const request = require('request-promise-native')
const parseColors = require('../utils/color-parse')
const uuid = require('uuid/v4')

const TIMEZONE_OFFSET_MILLIS = -1 * 360 * 60 * 1000 // Timezone offset for Edmonton to UTC
const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
let dateObject = new Date()
let today = new Date(dateObject.getTime() + TIMEZONE_OFFSET_MILLIS)
let todayDateString = today.toISOString().match(dateRegex)[0]

const URL = 'https://data.edmonton.ca/resource/2ue2-adat.json' // The Socrata api endpoint
const QUERY = `${URL}?$query=
  SELECT colour_s, reason_occasion, row_id
  WHERE row_id = '${todayDateString}'`

/**
 * Returns the most recent light the bridge results to IFTTT.
 */
module.exports = async function(req, res) {
  let queryResult
  try {
    let rawJsonQueryResult = await request(QUERY)
    queryResult = JSON.parse(rawJsonQueryResult)
  } catch (e) {
    console.error(e)
    return res.status(500).send({
      errors: [
        {
          message: e
        }
      ]
    })
  }

  // the 'data' object has fields: colour_s, reason_occasion, row_id
  let data = queryResult[0]
  let responseValues
  let key = `light_the_bridge`
  let latest = await req.cache.getLatest(key)
  if (!data || (latest && latest.row_id == data.row_id)) {
    console.log('No new color data.')
    responseValues = await req.cache.getAll(key, req.body['limit'])
  } else {
    console.log(data.reason_occasion)
    let id = uuid()
    let colors = parseColors(data.colour_s)
    let firstColor = colors[0] ? colors[0].hex : ''
    let newData = {
      id,
      row_id: data.row_id,
      title: data.reason_occasion,
      description: data.reason_occasion,
      created_at: new Date().toISOString(),
      color_description: colors
        .map(function(element) {
          return element.color.charAt(0).toUpperCase() + element.color.slice(1)
        })
        .join(', '),
      color1: firstColor,
      color2: colors[1] ? colors[1].hex : firstColor,
      color3: colors[2] ? colors[2].hex : firstColor,
      color4: colors[3]
        ? colors[3].hex
        : colors[1]
        ? colors[1].hex
        : firstColor,
      meta: {
        id,
        timestamp: Math.round(new Date() / 1000)
      }
    }
    console.log('Adding new color data.')
    await req.cache.add(key, newData)
    responseValues = await req.cache.getAll(key, req.body['limit'])
  }

  res.status(200).send({
    data: responseValues
  })
}
