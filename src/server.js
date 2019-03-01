const express = require('express')
const app = express()
const airQuality = require('./controllers/air-quality')

// Middleware
const logger = require('./middleware/logger')
const cacheProvider = require('./middleware/cache-provider')

const port = 3000

// Set default env vars
if (!process.env.AIR_QUALITY_URL) {
  process.env['AIR_QUALITY_URL'] = 'https://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/CommunityAQHIs'
}

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