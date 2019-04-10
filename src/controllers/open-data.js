const request = require('request-promise-native')

/**
 * Open Data controller...
 */
module.exports = async function(req, res) {
  console.log('Open Data trigger called.')

  let triggerFields = req.body.triggerFields
  let data = triggerFields.dataset.split(':')
  const id = data[0] // The id of the dataset
  const column = data[1]
  console.log(id)

  // The Socrata api endpoint
  let url = `https://data.edmonton.ca/resource/${id}.json`
  let queryBase = `${url}?$query=`
  let getLastUpdated = `${queryBase}SELECT :updated_at ORDER BY :updated_at LIMIT 1`
  // get lastUpdated (is a date encoded as ISO8601 Times) from changeWriter
  // get stored item from Redis here...

  let key = `opendata/${id}/${column}` // unique key for dataset storage? -> opendata:${id}:${column}
  console.log(key)
  /**
   * storedColumnRows: {
   *  lastUpdated: (ISO8601 Time),
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
    lastUpdated = storedColumnRows.lastUpdated
  } else {
    lastUpdated = '1998-07-25T00:00:00'
  }

  console.log(lastUpdated)

  // Add a limit??
  let getLatestUpdatedQuery = `${queryBase}SELECT :updated_at, ${column} WHERE :updated_at >= '${lastUpdated}' ORDER BY :updated_at DESC`

  let latestColumnRows
  try {
    // let rawJsonLastUpdated = await request(getLastUpdated)
    // lastUpdated = JSON.parse(rawJsonLastUpdated)[0][':updated_at']
    // console.log("last updated: ", lastUpdated)
    let rawJsonColumnRows = await request(getLatestUpdatedQuery)
    latestColumnRows = JSON.parse(rawJsonColumnRows)
  } catch (e) {
    e.code = 500
    throw e
  }

  console.log(latestColumnRows)

  let responseValues
  if (storedColumnRows && storedColumnRows.lastUpdated == latestColumnRows.lastUpdated) {
    // send data
  } else {
    // store new row, send data
    console.log('Adding new rows')
    // req.cache.add(key, )
  }

  res.status(200).send({
    data: [
      {
        CreatedAt: 'Date',
        DataSet: 'String',
        Column: 'String',
        ColumnValues: 'Array as String (Value1, Value2, Value3)'
      }
    ]
  })
}
