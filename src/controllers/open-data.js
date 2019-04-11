const request = require('request-promise-native')
const uuid = require('uuid/v4')

// Compares the elements of two arrays
function compareArr(array1, array2) {
  let arr1 = array1.sort()
  let arr2 = array2.sort()
  let length
  if (arr1.length !== arr2.length) {
    return false
  } else {
    length = arr1.length
  }
  for (let i = 0; i < length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

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
  let getUpdatedTimestamp = `${queryBase}SELECT :updated_at ORDER BY :updated_at LIMIT 1`

  let key = `opendata/column/${id}/${column}` // unique key for dataset storage
  let storedData
  try {
    storedData = await req.cache.getLatest(key)
  } catch (e) {
    console.log('Error ' + e)
  }

  let lastUpdated
  if (storedData) {
    lastUpdated = storedData.created_at
  } else {
    lastUpdated = '1998-07-25T00:00:00.000Z'
  }

  let updatedAt
  try {
    let rawJsonUpdatedAt = await request(getUpdatedTimestamp)
    updatedAt = JSON.parse(rawJsonUpdatedAt)[0][':updated_at']
  } catch (e) {
    console.log('Error ' + e)
  }

  // Default limit is 1000 (Should always return an array)
  // TODO: Change to appropriate limit
  // let getLatestUpdatedQuery = `${queryBase}SELECT :updated_at, ${column} WHERE :updated_at >= '${lastUpdated}' ORDER BY :updated_at DESC LIMIT 100`
  // Get all the columns (filter it by column later)
  let getLatestUpdatedQuery = `${queryBase}SELECT * WHERE :updated_at >= '${lastUpdated}' ORDER BY :updated_at DESC LIMIT 100`

  let latestColumnRows
  try {
    let rawJsonColumnRows = await request(getLatestUpdatedQuery)
    latestColumnRows = JSON.parse(rawJsonColumnRows)
  } catch (e) {
    e.code = 500
    throw e
  }

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

  let filteredColumnRows = latestColumnRows.map(row => {
    return row[column]
  })
  let filteredStoredColumnRows
  if (storedData) {
    filteredStoredColumnRows = JSON.parse(storedData.all_values).map(row => {
      return row[column]
    })
  }

  let responseValues
  if (storedData && storedData.created_at == latestUpdated) {
    console.log('Dataset rows not updated. Returning old data.')
    responseValues = await req.cache.getAll(key, req.body['limit'])
  } else {
    // Dataset rows were updated (check if the columns are different)
    console.log('Dataset rows updated.')
    if (
      storedData &&
      compareArr(filteredStoredColumnRows, filteredColumnRows)
    ) {
      console.log('Row values not changed. Returning old data')
      responseValues = await req.cache.getAll(key, req.body['limit'])
    } else {
      console.log('Adding new rows')
      let id = uuid()
      let newRows = {
        id,
        created_at: latestUpdated,
        data_set: dataset,
        column: column,
        column_values: JSON.stringify(filteredColumnRows),
        all_values: JSON.stringify(latestColumnRows), // Stringified array of updated row values
        meta: {
          id,
          timestamp: Math.round(new Date() / 1000)
        }
      }
      req.cache.add(key, newRows)
      responseValues = await req.cache.getAll(key, req.body['limit'])
    }
  }

  res.status(200).send({
    data: responseValues
  })
}
