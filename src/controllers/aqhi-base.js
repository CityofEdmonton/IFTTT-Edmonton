const request = require('request-promise-native')
const uuid = require('uuid/v4')
const parseXML = require('../utils/parse-aqhi-xml')
const indexToColor = require('../utils/index-to-color')

/**
 * This is a factory function for creating air quality controllers. IFTTT requires unique
 * routes for every trigger. Since the functionality for our air quality triggers are all
 * very similar, we can create controllers based on them.
 * @param {Function} prepareFunc Prepares the values needed or parsing air quality information.
 * This function must return an objetc with the fields 'field' and 'communityID'. Optionally, it
 * may also include a 'limit' value.
 */
module.exports = function createAirQualityController(prepareFunc) {
  return async (req, res) => {
    let handleResponse
    try {
      let params = prepareFunc(req, res)
      handleResponse = await handleAQHI(
        req.cache,
        params.field,
        params.communityID,
        params.key,
        params.limit
      )
    } catch (e) {
      console.error(e)
      return res.status(e.code).send({
        errors: [
          {
            message: e.message
          }
        ]
      })
    }

    return res.status(200).send({
      data: handleResponse
    })
  }
}

async function handleAQHI(cache, field, communityID, key, limit) {
  console.log(`Watching field ${field} for community #${communityID}`)

  let airQualityInfo
  try {
    let xmlString = await request(process.env.AIR_QUALITY_URL)
    airQualityInfo = await parseXML(xmlString)
  } catch (e) {
    e.code = 500
    throw e
  }

  for (let stationAirQuality of airQualityInfo) {
    if (stationAirQuality.community_id !== communityID) {
      continue
    }

    let id = uuid()
    let colors = indexToColor(stationAirQuality['aqhi_current'])
    stationAirQuality['id'] = id
    stationAirQuality['created_at'] = new Date().toISOString()
    stationAirQuality['meta'] = {
      id,
      timestamp: Math.round(new Date() / 1000)
    }
    stationAirQuality['color'] = colors['color']
    stationAirQuality['light_color'] = colors['lightColor']

    let { community_name, health_risk } = stationAirQuality
    console.log(`${community_name} has a ${health_risk} risk.`)

    // Set base object info
    console.log(`Key for cache is ${key}`)
    let latest = await cache.getLatest(key)
    if (latest && latest[field] === stationAirQuality[field]) {
      console.log('Sending old data.')
      return await cache.getAll(key, limit)
    } else {
      console.log('Updating old data.')
      await cache.add(key, stationAirQuality)
      return await cache.getAll(key, limit)
    }
  }
  let error = new Error(`No communities found with ID ${communityID}`)
  error.code = 500
  throw error
}
