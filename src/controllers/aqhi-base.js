export async function handleAQHI(req, res, field, communityID) {
  console.log(`Watching field ${field} for community #${communityID}`)

  let xmlString = ''
  try {
    xmlString = await request(process.env.AIR_QUALITY_URL)
  }
  catch (e) {
    res.send(500, e)
  }
  for (let stationAirQuality of await parseXML(xmlString)) {
    if (stationAirQuality.community_id !== communityID) {
      continue
    }

    let { community_name, aqhi_current, health_risk } = stationAirQuality
    console.log(`${community_name} has a ${health_risk} risk.`)
    let key = `${community_name}/${field}`
    let metaKey = `${community_name}/${field}/meta`

    // Set base object info
    console.log(`Key for cache is ${key}`)
    let oldField = await req.cache.hget(key, field)
    if (oldField === stationAirQuality[field]) {
      console.log('Sending old data.')
      let oldData = await req.cache.hgetall(key)
      let meta = await req.cache.hgetall(metaKey)
      oldData['meta'] = meta
      return res.send({
        data: oldData
      })
    }
    else if (oldField !== stationAirQuality[field]) {
      console.log('Updating existing.')
      let oldData = await req.cache.hgetall(key)
      let oldMeta = await req.cache.hgetall(metaKey)

      let id = uuid()
      let newData = {...oldData, ...stationAirQuality}
      newData['id'] = id
      newData['date_created'] = new Date()
      await req.cache.hmset(key, newData)
      
      let newMeta = {
        id,
        timestamp: Math.round(newData['date_created'] / 1000)
      }
      await req.cache.hmset(metaKey, newMeta)


      newData['meta'] = newMeta
      oldData['meta'] = oldMeta
      return res.send({
        data: [
          newData,
          oldData
        ]
      })
    }
    else {
      console.log('New request')
      let id = uuid()
      stationAirQuality['date_created'] = new Date()
      stationAirQuality['id'] = id
      await req.cache.hmset(key, stationAirQuality)

      let meta = {
        id,
        timestamp: Math.round(stationAirQuality['date_created'] / 1000)
      }
      await req.cache.hmset(metaKey, meta)

      stationAirQuality['meta'] = meta
      return res.send({
        data: stationAirQuality
      })
    }
    // Set object meta info
  }
  return res.send(404, `No communities found with ID ${communityID}`)
}