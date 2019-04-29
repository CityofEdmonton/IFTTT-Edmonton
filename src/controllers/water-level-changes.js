const request = require('request-promise-native')
const uuid = require('uuid/v4')

const TIMEZONE_OFFSET_MILLIS = 360 * 60 * 1000 // Timezone offset for Edmonton to UTC
const KEY = 'water-level-changes' // Unique key for dataset storage
const URL = 'https://data.edmonton.ca/resource/cnsu-iagr.json' // The Socrata api endpoint
const QUERY_BASE = `${URL}?$query=`

/**
 * Water Level Changes
 */
module.exports = async function(req, res) {
  console.log('Water Level Changes Controller')
  let storedData = await req.cache.getLatest(KEY)
  let storedUpdated
  if (storedData) storedUpdated = storedData.last_updated

  let getUpdatedQuery = `${QUERY_BASE}
    SELECT date_and_time, water_level_m
    WHERE station_number = '05DF001'
    ORDER BY date_and_time DESC
    LIMIT 1`
  let updatedData
  let recentUpdated
  try {
    let rawJsonUpdated = await request(getUpdatedQuery)
    updatedData = JSON.parse(rawJsonUpdated)
    recentUpdated = updatedData[0].date_and_time
  } catch (e) {
    e.code = 500
    throw e
  }

  let responseValues
  if (storedUpdated && new Date(storedUpdated) >= new Date(recentUpdated)) {
    console.log('No new updates')
    responseValues = await req.cache.getAll(KEY, req.body['limit'])
  } else {
    console.log('Dataset was updated')
    let oneDayBounds = getBounds(recentUpdated, 1)
    let threeDaysBounds = getBounds(recentUpdated, 3)
    let oneWeekBounds = getBounds(recentUpdated, 7)
    let oneDayResults
    let threeDaysResults
    let oneWeekResults
    try {
      await Promise.all(
        (oneDayResults = await getData(oneDayBounds)),
        (threeDaysResults = await getData(threeDaysBounds)),
        (oneWeekResults = await getData(oneWeekBounds))
      )
    } catch (e) {
      e.code = 500
      throw e
    }
    console.log('Adding new rows')
    let id = uuid()
    let newRows = {
      id,
      created_at: new Date(Date.now()).toISOString(),
      last_updated: recentUpdated,
      one_day_average: oneDayResults[0].toFixed(3),
      one_day_delta: oneDayResults[1].toFixed(3),
      three_day_average: threeDaysResults[0].toFixed(3),
      three_day_delta: threeDaysResults[1].toFixed(3),
      one_week_average: oneWeekResults[0].toFixed(3),
      one_week_delta: oneWeekResults[1].toFixed(3),
      meta: {
        id,
        timestamp: Math.round(new Date() / 1000)
      }
    }
    req.cache.add(KEY, newRows)
    responseValues = await req.cache.getAll(KEY, req.body['limit'])
  }

  res.status(200).send({
    data: responseValues
  })
}

/**
 * This function obtains the upper and lower bounds of a period
 * @param {String} date The date in ISO format
 * @param {Number} days The number of days the period should be
 * @returns {Array<String>} The upper and lower bounds of the period
 */
function getBounds(date, days) {
  const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}/
  let currentDate = new Date(new Date(date) - TIMEZONE_OFFSET_MILLIS)
  let threeDayPeriod = new Date(
    new Date(date) - (days * 24 * 60 * 60 * 1000 + TIMEZONE_OFFSET_MILLIS)
  )
  let lowerBound = threeDayPeriod.toISOString().match(dateRegex)[0]
  let upperBound = currentDate.toISOString().match(dateRegex)[0]
  return [lowerBound, upperBound]
}

/**
 * Returns the average and bounds respecitvely in an array
 * @param {Array<String>} bounds The bounds to do calculation on (dates in ISO 8601 format)
 * @returns {Array<Number>} The average and delta of the water level between the specified bounds
 */
async function getData(bounds) {
  let workingDataQuery = `${QUERY_BASE}
    SELECT water_level_m
    WHERE station_number = '05DF001'
    AND date_and_time
    BETWEEN '${bounds[0]}'
    AND '${bounds[1]}'
    ORDER BY date_and_time DESC
    LIMIT 10000`
  let workingData
  try {
    let rawJsonData = await request(workingDataQuery)
    workingData = JSON.parse(rawJsonData).map(data => {
      return Number(data.water_level_m)
    })
  } catch (e) {
    e.code = 500
    throw e
  }
  let delta = workingData[0] - workingData[workingData.length - 1]
  let sum = workingData.reduce(function(a, b) {
    return a + b
  })
  let average = sum / workingData.length
  return [average, delta]
}
