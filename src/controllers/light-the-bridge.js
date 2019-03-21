const request = require('request-promise-native')
const parseXML = require('../utils/parse-ltb-xml')
var _ = require('lodash')
var toHex = require('colornames')

/**
 * Returns the most recent light the bridge results to IFTTT.
 */
module.exports = async function(req, res) {
  let tweet
  var colors = []
  try {
    let xmlString = await request(process.env.LTB_URL)
    tweet = await parseXML(xmlString)
    // Parse colors
    const words = _.words(tweet.title)
    for (let i = 0; i < words.length; i++) {
      var hexColor = toHex(words[i])
      hexColor ? colors.push({color: words[i], hex: hexColor}) : null
    }
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

  console.log(`${tweet.title}`)
  tweet = {
    ...tweet,
    ...{
      created_at: new Date().toISOString(),
      color_description: colors.map(function(element) { return _.capitalize(element.color) }).join(', '),
      color1: colors[0] ? colors[0].hex : '',
      color2: colors[1] ? colors[1].hex : '',
      color3: colors[2] ? colors[2].hex : '',
      color4: colors[3] ? colors[3].hex : '',
      meta: {
        id: tweet.id,
        timestamp: Math.round(new Date() / 1000)
      }
    }
  }

  console.log(tweet)

  let responseValues
  let key = `light_the_bridge`
  let latest = await req.cache.getLatest(key)
  if (latest && tweet.id == latest.id) {
    console.log('Returning old results')
    responseValues = await req.cache.getAll(key, req.body['limit'])
  } else {
    console.log('Adding new tweet')
    await req.cache.add(key, tweet)
    responseValues = await req.cache.getAll(key, req.body['limit'])
  }

  res.status(200).send({
    data: responseValues
  })
}
