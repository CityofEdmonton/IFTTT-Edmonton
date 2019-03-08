const request = require('request-promise-native')
const uuid = require('uuid/v4')
const parseXML = require('../utils/parseXML')

module.exports = async function handleAQHI(req, res, field, communityID, limit) {
  console.log(`Watching field ${field} for community #${communityID}`)

  let xmlString = ''
  try {
    xmlString = await request(process.env.AIR_QUALITY_URL)
  }
  catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }

  let airQualityInfo
  try {
    airQualityInfo = await parseXML(xmlString)
  }
  catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }

  for (let stationAirQuality of airQualityInfo) {
    if (stationAirQuality.community_id !== communityID) {
      continue
    }

    let id = uuid()
    stationAirQuality['id'] = id
    stationAirQuality['date_created'] = (new Date()).toString()
    stationAirQuality['meta'] = {
      id,
      timestamp: Math.round((new Date()) / 1000)
    }

    let { community_name, aqhi_current, health_risk } = stationAirQuality
    console.log(`${community_name} has a ${health_risk} risk.`)
    let key = `${community_name}/${field}`

    // Set base object info
    console.log(`Key for cache is ${key}`)
    let latest = await req.cache.getLatest(key)
    if (latest && latest[field] === stationAirQuality[field]) {
      console.log('Sending old data.')
      let oldData = await req.cache.getAll(key, limit)
      return res.send({
        data: oldData
      })
    }
    else {
      console.log('Updating old data.')
      await req.cache.add(key, stationAirQuality)
      let logs = await req.cache.getAll(key, limit)
      return res.send({
        data: logs
      })
    }
  }
  return res.send(404, `No communities found with ID ${communityID}`)
}