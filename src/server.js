// Set default env vars
if (!process.env.AIR_QUALITY_URL) {
  process.env['AIR_QUALITY_URL'] = 'https://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/CommunityAQHIs'
}
if (!process.env.LTB_URL) {
  process.env['LTB_URL'] = 'https://twitrss.me/twitter_search_to_rss/?term=LighttheBridge%20from:CityofEdmonton'
}
if (!process.env.REDIS_PORT) {
  process.env.REDIS_PORT = '6379'
}
if (!process.env.REDIS_HOST) {
  process.env.REDIS_HOST = '127.0.0.1'
}
if (!process.env.REDIS_PASSWORD) {
  process.env.REDIS_PASSWORD = 'myPassword'
}
if (!process.env.IFTTT_SERVICE_KEY) {
  throw new Error('Missing service key in IFTTT_SERVICE_KEY environment variable.')
}
process.env.CACHE = 'REDIS'

const express = require('express')
var bodyParser = require('body-parser')
const app = express()

// Controllers
const lightTheBridge = require('./controllers/light-the-bridge')
const createAirQualityController = require('./controllers/aqhi-base')
const status = require('./controllers/status')
const test = require('./controllers/test')

// Middleware
const logger = require('./middleware/logger')
const cacheProvider = require('./middleware/cache-provider')
const iftttValidator = require('./middleware/ifttt-validator')

const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(logger)
app.use(cacheProvider)
app.use(iftttValidator)

if (process.env.STATIC) {
  app.use(express.static(process.env.static))
}
else {
  app.use(express.static('public'))
}

app.use('/ifttt/v1/triggers/light_the_bridge', lightTheBridge)
app.use('/ifttt/v1/triggers/edmonton_air_health_risk', createAirQualityController((req, res) => {
  return {
    field: 'health_risk',
    communityID: '67',
    limit: req.body['limit']
  }
}))
app.use('/ifttt/v1/triggers/edmonton_air_health_index', createAirQualityController((req, res) => {
  return {
    field: 'aqhi_current',
    communityID: '67',
    limit: req.body['limit']
  }
}))
app.use('/ifttt/v1/status', status)
app.use('/ifttt/v1/test/setup', test)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))