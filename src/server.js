// Set default env vars
if (!process.env.AIR_QUALITY_URL) {
  // process.env['AIR_QUALITY_URL'] = 'https://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/CommunityAQHIs'
  process.env['AIR_QUALITY_URL'] = 'http://localhost:3000/samples/CommunityAQHIs.xml'
}
if (!process.env.REDIS_PORT) {
  process.env.REDIS_PORT = '6379'
}
if (!process.env.REDIS_HOST) {
  process.env.REDIS_HOST = '127.0.0.1'
}
process.env.CACHE = 'REDIS'

const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const airQuality = require('./controllers/air-quality')

// Middleware
const logger = require('./middleware/logger')
const cacheProvider = require('./middleware/cache-provider')

const port = 3000

app.use(bodyParser.json())
app.use(logger)
app.use(cacheProvider)

if (process.env.STATIC) {
  app.use(express.static(process.env.static))
}
else {
  app.use(express.static('public'))
}

app.use('/test/path', airQuality)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))