const express = require('express');
const router = express.Router();
const request = require('request-promise-native')
const uuid = require('uuid/v4')
const parseXML = require('../utils/parse-ltb-xml')

/**
 * Returns the most recent light the bridge results to IFTTT.
 */
router.post('/', async function (req, res) {
  let tweet
  try {
    let xmlString = await request(process.env.LTB_URL)
    tweet = await parseXML(xmlString)
  }
  catch (e) {
    console.error(e)
    return res.status(500).send({
      errors:[{
        message: e
      }]
    })
  }

  console.log(`${tweet.title}`)
  tweet = {
    ...tweet,
    ...{
      created_at: (new Date()).toISOString(),
      color_description: '',
      color1: '',
      color2: '',
      color3: '',
      color4: '',
      meta: {
        id: tweet.id,
        timestamp: Math.round((new Date()) / 1000)
      }
    }
  }

  let responseValues
  let key = `light_the_bridge/${tweet.id}`
  let latest = await req.cache.getLatest(key)
  if (latest && tweet.id == latest.id) {
    console.log('Returning old results')
    responseValues = await req.cache.getAll(key, req.body['limit'])
  }
  else {
    console.log('Adding new tweet')
    await req.cache.add(key, tweet)
    responseValues = await req.cache.getAll(key, req.body['limit'])
  }

  res.status(200).send({
    data: responseValues
  })
})

module.exports = router;