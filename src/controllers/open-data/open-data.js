const request = require('request-promise-native')
const uuid = require('uuid/v4')

/**
 * Open Data controller
 */
module.exports = async function(req, res) {
  console.log(
    `Open Data trigger called. Time: ${new Date(Date.now()).toISOString()}`
  )

  let triggerFields = req.body.triggerFields
  let data = triggerFields.dataset.split('|&|') // Unique separator
  let id = data[0] // The id of the dataset
  let dataset = data[1] // The name of the dataset
  let column = data[2]
  let key = `opendata/column/${id}/${column}` // Unique key for dataset storage
  let url = `https://data.edmonton.ca/resource/${id}.json` // The Socrata api endpoint
  let queryBase = `${url}?$query=`

  let storedData = await req.cache.getLatest(key)
  let storedTimestamp
  let filteredStoredColumnValues // The stored/previous column values to be compared to
  if (storedData) {
    storedTimestamp = storedData.created_at
    filteredStoredColumnValues = JSON.parse(storedData.all_values).map(row => {
      return row[column]
    })
  } else {
    storedTimestamp = '1998-07-25T00:00:00.000Z' // This value is random
  }

  // TODO: Change to appropriate limit
  // Get all the columns (filter it by column later)
  let getLatestUpdatedQuery = `${queryBase}SELECT * WHERE :updated_at >= '${storedTimestamp}' ORDER BY :updated_at DESC LIMIT 100`
  let getUpdatedTimestamp = `${queryBase}SELECT :updated_at ORDER BY :updated_at LIMIT 1`
  let latestTimestamp
  let latestColumnRows
  let filteredLatestColumnValues // The current values of the column being monitored
  try {
    let rawJsonUpdatedAt = await request(getUpdatedTimestamp)
    latestTimestamp = JSON.parse(rawJsonUpdatedAt)[0][':updated_at']
    let rawJsonColumnValues = await request(getLatestUpdatedQuery)
    latestColumnRows = JSON.parse(rawJsonColumnValues)
    filteredLatestColumnValues = latestColumnRows.map(row => {
      return row[column]
    })
  } catch (e) {
    e.code = 500
    throw e
  }
  // Ensure that the date is in ISO 8601 time format
  // TODO: Check for other potential time formats
  if (
    !latestTimestamp
      .toString()
      .match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/)
  ) {
    // Convert Epoch times to ISO 8601 time format
    latestTimestamp = new Date(latestTimestamp * 1000).toISOString()
  }

  let responseValues
  if (
    storedData &&
    compareArr(filteredStoredColumnValues, filteredLatestColumnValues)
  ) {
    console.log('Row values not changed. Returning old data')
    responseValues = await req.cache.getAll(key, req.body['limit'])
  } else {
    console.log('Adding new rows')
    let id = uuid()
    // The unique difference (does not catch repeat values)
    let diff = {
      new: arrDiff(filteredLatestColumnValues, filteredStoredColumnValues),
      removed: arrDiff(filteredStoredColumnValues, filteredLatestColumnValues)
    }
    let newRows = {
      id,
      created_at: latestTimestamp,
      data_set: dataset,
      column: column,
      column_values: JSON.stringify(filteredLatestColumnValues),
      all_values: JSON.stringify(latestColumnRows), // Stringified array of updated row values (unfiltered)
      difference: JSON.stringify(diff),
      meta: {
        id,
        timestamp: Math.round(new Date() / 1000)
      }
    }
    req.cache.add(key, newRows)
    responseValues = await req.cache.getAll(key, req.body['limit'])
  }

  res.status(200).send({
    data: responseValues
  })
}

/**
 * Compares the elements of two arrays and returns TRUE arrays are same or FALSE
 * if they are different
 * @param {Array<String|Number>} arr1 The first array to compare
 * @param {Array<String|Number>} arr2 The second array to compare
 * @return {Boolean} Returns TRUE if the arrays are the same or FALSE otherwise
 */
function compareArr(arr1, arr2) {
  arr1.sort()
  arr2.sort()
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
 * Returns an array of elements in the first array (arr1) that are not
 * in the second array (arr2)
 * @param {Array<String|Number>} arr1 The array to compare to
 * @param {Array<String|Number>} arr2 The array to compare against
 * @return {Array<String|Number>} The difference between the two arrays
 */
function arrDiff(arr1, arr2) {
  let diff = []
  if (!arr1) {
    // Nothing to compare with
    return diff
  }
  if (!arr2) {
    // Everything in array1 will not be in array2 for this case
    return arr1
  }
  for (let element of arr1) {
    if (arr2.indexOf(element) == -1) {
      diff.push(element)
    }
  }
  return diff
}
