const request = require('request-promise-native')
const uuid = require('uuid/v4')

/**
 * LRT Escalator & Elevator Outages
 */
module.exports = async function(req, res) {
  console.log('LRT Escalator & Elevator Outages Controller')
  let key = 'lrt-escalator-elevator-outages' // Unique key for dataset storage
  let url = 'https://data.edmonton.ca/resource/snws-u3zx.json' // The Socrata api endpoint
  let queryBase = `${url}?$query=`

  let storedData = await req.cache.getLatest(key)
  let storedTimestamp
  let filteredStoredColumnValues // The stored/previous column values to be compared to
  if (storedData) {
    storedTimestamp = storedData.created_at
    filteredStoredColumnValues = JSON.parse(storedData.outages).map(device => {
      return device.device_id
    })
  } else {
    storedTimestamp = '1998-07-25T00:00:00.000Z' // This value is random
  }

  // Get all the columns (filter it by column later)
  let getLatestUpdatedQuery = `${queryBase}SELECT lrt_station_name, device_id, lrt_device_location, device_type WHERE :updated_at >= '${storedTimestamp}' ORDER BY :updated_at DESC`
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
      return row['device_id']
    })
  } catch (e) {
    e.code = 500
    throw e
  }
  // Ensure that the date is in ISO 8601 time format
  latestTimestamp = timestampFormat(latestTimestamp)

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
    let fixed = arrDiffFixed(storedData, filteredLatestColumnValues)
    let newRows = {
      id,
      created_at: latestTimestamp,
      outages: JSON.stringify(latestColumnRows),
      fixed: JSON.stringify(fixed),
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
 * Returns an array of JSON objects of devices that are no longer in the dataset
 * (devices that are fixed). The IDs that were stored that are no longer in 'latestDeviceIds'
 * @param {Object} storedData The JSON object that is stored in the Redis cache
 * @param {Array<String>} latestDeviceIds An array of device IDs representing
 * escalator/elevator outages
 */
function arrDiffFixed(storedData, latestDeviceIds) {
  let fixed = []
  if (!storedData) return fixed
  if (!latestDeviceIds) return stored
  for (let element of JSON.parse(storedData.outages)) {
    if (latestDeviceIds.indexOf(element.device_id) == -1) {
      fixed.push(element)
    }
  }
  return fixed
}

/**
 * Converts timestamps to correctly formatted ISO 8601 time (currently only checks for epoch time)
 * @param {String|Number} timestamp The timestamp to convert
 * @return {String} The ISO 8601 formatted timestamp string
 */
function timestampFormat(timestamp) {
  if (
    !timestamp
      .toString()
      .match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/)
  ) {
    // Convert Epoch times to ISO 8601 time format
    return new Date(timestamp * 1000).toISOString()
  }
  return timestamp
}
