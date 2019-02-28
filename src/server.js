const express = require('express')
const app = express()
const airQuality = require('./controllers/air-quality')

const port = 3000

if (process.env.STATIC) {
  app.use(express.static(process.env.static))
}
else {
  app.use(express.static('public'))
}
app.use('/test/path', airQuality)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))