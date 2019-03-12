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
if (!process.env.MAX_RESULTS) {
  process.env['MAX_RESULTS'] = 5
}
process.env.CACHE = 'REDIS'

const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const router = express.Router()

// Controllers
const lightTheBridge = require('./controllers/light-the-bridge')
const createAirQualityController = require('./controllers/aqhi-base')
const status = require('./controllers/status')
const test = require('./controllers/test-setup')
const airQualityStations = require('./controllers/air-quality-stations')

// Middleware
const logger = require('./middleware/logger')
const cacheProvider = require('./middleware/cache-provider')
const iftttValidator = require('./middleware/ifttt-validator')

const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(logger)
app.use(express.static('public'))
app.use(cacheProvider)
app.use(iftttValidator)

// Triggers

router.post('/triggers/light_the_bridge', lightTheBridge)
router.post('/triggers/edmonton_air_health_risk', createAirQualityController((req, res) => {
  return {
    field: 'health_risk',
    communityID: '67',
    key: 'edmonton_air_health_risk/67/health_risk',
    limit: req.body['limit']
  }
}))
router.post('/triggers/edmonton_air_health_index', createAirQualityController((req, res) => {
  return {
    field: 'aqhi_current',
    communityID: '67',
    key: 'edmonton_air_health_index/67/aqhi_current',
    limit: req.body['limit']
  }
}))
router.post('/triggers/alberta_air_health_risk', createAirQualityController((req, res) => {
  if (!req.body.triggerFields || !req.body.triggerFields['city']) {
    let error = new Error('Trigger fields not provided.')
    error.code = 400
    throw error
  }

  let city = req.body.triggerFields['city']
  return {
    field: 'health_risk',
    communityID: city,
    key: `alberta_air_health_risk/${city}/health_risk`,
    limit: req.body['limit']
  }
}))
router.post('/triggers/alberta_air_health_risk/fields/city/options', airQualityStations)
router.post('/triggers/alberta_air_health_index', createAirQualityController((req, res) => {
  if (!req.body.triggerFields || !req.body.triggerFields['city']) {
    let error = new Error('Trigger fields not provided.')
    error.code = 400
    throw error
  }

  let city = req.body.triggerFields['city']
  return {
    field: 'aqhi_current',
    communityID: city,
    key: `alberta_air_health_index/${city}/aqhi_current`,
    limit: req.body['limit']
  }
}))
router.post('/triggers/alberta_air_health_index/fields/city/options', airQualityStations)

// Misc

router.get('/status', status)
router.post('/test/setup', test)

app.use('ifttt/v1', router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))