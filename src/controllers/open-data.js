const request = require('request-promise-native')
const uuid = require('uuid/v4')

/**
 * Open Data controller...
 */
module.exports = async function(req, res) {
  console.log(
    `Open Data trigger called. Time: ${new Date(Date.now()).toISOString()}`
  )

  let triggerFields = req.body.triggerFields
  let data = triggerFields.dataset.split('|&|') // unique separator (hopefully)
  const id = data[0] // The id of the dataset
  const dataset = data[1] // The name of the dataset
  const column = data[2]

  // The Socrata api endpoint
  let url = `https://data.edmonton.ca/resource/${id}.json`
  let queryBase = `${url}?$query=`
  let getLastUpdated = `${queryBase}SELECT :updated_at ORDER BY :updated_at LIMIT 1`
  // get lastUpdated (is a date encoded as ISO 8601 Times) from changeWriter
  // get stored item from Redis here...

  let key = `opendata/column/${id}/${column}` // unique key for dataset storage
  /**
   * storedColumnRows: {
   *  lastUpdated: (ISO 8601 Time),
   *  rows: [
   *    row 1,
   *    row 2,
   *    etc...
   *  ]
   * }
   */
  let storedColumnRows
  try {
    storedColumnRows = await req.cache.getLatest(key)
  } catch (e) {
    console.log('Error ' + e)
  }

  let lastUpdated
  if (storedColumnRows) {
    lastUpdated = storedColumnRows.created_at
  } else {
    lastUpdated = '1998-07-25T00:00:00.000Z'
  }

  // console.log('Last updated: ', lastUpdated)

  // Default limit is 1000 (Should always return an array)
  // TODO: Change to appropriate limit
  let getLatestUpdatedQuery = `${queryBase}SELECT :updated_at, ${column} WHERE :updated_at >= '${lastUpdated}' ORDER BY :updated_at DESC LIMIT 100`

  let latestColumnRows
  try {
    let rawJsonColumnRows = await request(getLatestUpdatedQuery)
    latestColumnRows = JSON.parse(rawJsonColumnRows)
  } catch (e) {
    e.code = 500
    throw e
  }

  let updatedAt = latestColumnRows[0][':updated_at']
  let latestUpdated
  // Ensure that the date is in ISO 8601 time format
  if (
    updatedAt
      .toString()
      .match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/)
  ) {
    latestUpdated = updatedAt
  } else {
    // Filter for Epoch times
    latestUpdated = new Date(updatedAt * 1000).toISOString()
  }
  // console.log('Latest updated: ', latestUpdated)
  let filteredColumnRows = latestColumnRows.map(row => {
    return { [column]: row[column] }
  })

  let responseValues
  if (storedColumnRows && storedColumnRows.created_at == latestUpdated) {
    // send data
    console.log('Returning old data')
    responseValues = await req.cache.getAll(key, req.body['limit'])
  } else {
    // store new row, send data
    console.log('Adding new rows')
    let id = uuid()
    let newRows = {
      id,
      created_at: latestUpdated,
      data_set: dataset,
      column: column,
      column_values: JSON.stringify(filteredColumnRows),
      meta: {
        id,
        timestamp: Math.round(new Date() / 1000)
      }
    }
    req.cache.add(key, newRows)
    responseValues = await req.cache.getAll(key, req.body['limit'])
  }

  // Filter and add meta data to responseValues here...

  res.status(200).send({
    data: responseValues
  })
}
