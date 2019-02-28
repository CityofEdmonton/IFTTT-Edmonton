const express = require('express')
const app = express()
const airQuality = require('./controllers/air-quality')

const port = 3000

app.use('/test/path', airQuality)
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))