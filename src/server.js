// Set default env vars
if (!process.env.AIR_QUALITY_URL) {
  process.env['AIR_QUALITY_URL'] = 'https://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/CommunityAQHIs'
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
const edmontonAirQualityRisk = require('./controllers/edmonton-air-quality-risk')
const edmontonAirQualityIndex = require('./controllers/edmonton-air-quality-index')
const status = require('./controllers/status')

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

app.use('/ifttt/v1/triggers/edmonton_air_health_risk', edmontonAirQualityRisk)
app.use('/ifttt/v1/triggers/edmonton_air_health_index', edmontonAirQualityIndex)
app.use('/ifttt/v1/status', status)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))