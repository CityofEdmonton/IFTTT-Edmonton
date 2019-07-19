const request = require('request-promise-native')
const uuid = require('uuid/v4')

const TIMEZONE_OFFSET_MILLIS = -1 * 360 * 60 * 1000 // Timezone offset for Edmonton to UTC
const KEY = 'water-level-changes' // Unique key for dataset storage
const URL = 'https://data.edmonton.ca/resource/cnsu-iagr.json' // The Socrata api endpoint
const QUERY_BASE = `${URL}?$query=`
const STATION_NUMBER = '05DF001' // 05DF001 refers to the water station near the low-level bridge by the North Saskatchewan River at Edmonton

/**
 * Water Level Changes (North Saskatchewan River at Edmonton)
 */
module.exports = async function(req, res) {
  console.log('Water Level Changes Controller')
  let storedData = await req.cache.getLatest(KEY)
  let storedUpdated
  if (storedData) {
    storedUpdated = storedData.last_updated
  }

  let getUpdatedQuery = `${QUERY_BASE}
    SELECT date_and_time, water_level_m
    WHERE station_number = '${STATION_NUMBER}'
    ORDER BY date_and_time DESC
    LIMIT 1`
  let updatedData
  let recentUpdated
  let recentWaterLevel
  try {
    let rawJsonUpdated = await request(getUpdatedQuery)
    updatedData = JSON.parse(rawJsonUpdated)
    recentUpdated = updatedData[0].date_and_time
    recentWaterLevel = Number(updatedData[0].water_level_m)
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
    let currentDay = getBounds(recentUpdated, {
      timeZoneOffset: TIMEZONE_OFFSET_MILLIS
    })
    let previousDay = getBounds(recentUpdated, {
      timeZoneOffset: TIMEZONE_OFFSET_MILLIS,
      offset: -1
    })
    let threeDaySpan = getBounds(recentUpdated, {
      timeZoneOffset: TIMEZONE_OFFSET_MILLIS,
      offset: -2,
      span: true
    })
    let threeDaysAgo = getBounds(recentUpdated, {
      timeZoneOffset: TIMEZONE_OFFSET_MILLIS,
      offset: -2
    })
    let oneWeekSpan = getBounds(recentUpdated, {
      timeZoneOffset: TIMEZONE_OFFSET_MILLIS,
      offset: -6,
      span: true
    })
    let oneWeekAgo = getBounds(recentUpdated, {
      timeZoneOffset: TIMEZONE_OFFSET_MILLIS,
      offset: -6
    })
    let currentDayAvg
    let previousDayAvg
    let threeDaySpanAvg
    let threeDaysAgoAvg
    let oneWeekSpanAvg
    let oneWeekAgoAvg
    try {
      await Promise.all([
        (currentDayAvg = await queryData(currentDay)),
        (previousDayAvg = await queryData(previousDay)),
        (threeDaySpanAvg = await queryData(threeDaySpan)),
        (threeDaysAgoAvg = await queryData(threeDaysAgo)),
        (oneWeekSpanAvg = await queryData(oneWeekSpan)),
        (oneWeekAgoAvg = await queryData(oneWeekAgo))
      ])
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
      latest_water_level: recentWaterLevel.toFixed(3),
      one_day_average: currentDayAvg.averageWaterLevel.toFixed(3),
      one_day_delta: (
        currentDayAvg.averageWaterLevel - previousDayAvg.averageWaterLevel
      ).toFixed(3),
      three_day_average: threeDaySpanAvg.averageWaterLevel.toFixed(3),
      three_day_delta: (
        currentDayAvg.averageWaterLevel - threeDaysAgoAvg.averageWaterLevel
      ).toFixed(3),
      one_week_average: oneWeekSpanAvg.averageWaterLevel.toFixed(3),
      one_week_delta: (
        currentDayAvg.averageWaterLevel - oneWeekAgoAvg.averageWaterLevel
      ).toFixed(3),
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
 * This function obtains the upper and lower bounds of a the full day of the given date, or it can be used
 * to get the bounds of date ranges.
 * @param {String} date The date in ISO format
 * @param {Object} [options] The options for the bounds
 * @param {Number} [options.timeZoneOffset] The time zone offset of the date (optional)
 * @param {Number} [options.offset] The number of days to offset the current date by (optional)
 * @param {Boolean} [options.span] If enabled, will return the bounds between the specified date and offset (default: false)
 * @returns {Array<String>} The upper and lower bounds of the full day
 */
function getBounds(date, options) {
  const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
  let timeZoneOffset = options.timeZoneOffset || 0
  let offset = options.offset || 0
  let span = options.span || false
  let dayOffset = offset * 24 * 60 * 60 * 1000
  let dateObject = new Date(date)
  let referenceDay = new Date(dateObject.getTime() + timeZoneOffset)
  let day = new Date(dateObject.getTime() + timeZoneOffset + dayOffset)
  let lowerBound
  let upperBound
  if (span) {
    if (referenceDay > day) {
      lowerBound = day.toISOString().match(dateRegex)[0] + 'T00:00:00.000'
      upperBound =
        referenceDay.toISOString().match(dateRegex)[0] + 'T23:59:59.999'
    } else {
      lowerBound =
        referenceDay.toISOString().match(dateRegex)[0] + 'T00:00:00.000'
      upperBound = day.toISOString().match(dateRegex)[0] + 'T23:59:59.999'
    }
  } else {
    let returnDay = day.toISOString().match(dateRegex)[0]
    lowerBound = returnDay + 'T00:00:00.000'
    upperBound = returnDay + 'T23:59:59.999'
  }
  return [lowerBound, upperBound]
}

/**
 * Queries the API endpoint for the average water level in meters between the specified bounds and the
 * number of data points within that bound.
 * @param {Array<String>} bounds The bounds to do calculation on (dates in ISO 8601 format)
 * @returns {Object} The number of data points and average water level between the specified bounds: { dataCount, averageWaterLevel }
 */
async function queryData(bounds) {
  let dataQuery = `${QUERY_BASE}
    SELECT count(*), avg(water_level_m)
    WHERE station_number = '${STATION_NUMBER}'
    AND date_and_time
    BETWEEN '${bounds[0]}'
    AND '${bounds[1]}'`
  let queryResults
  try {
    let rawQueryResults = await request(dataQuery)
    queryResults = JSON.parse(rawQueryResults)[0]
  } catch (e) {
    e.code = 500
    throw e
  }
  return {
    dataCount: Number(queryResults.count),
    averageWaterLevel: Number(queryResults.avg_water_level_m)
  }
}
