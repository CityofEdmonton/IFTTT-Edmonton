const request = require('request-promise-native')
const parseXML = require('../utils/parse-aqhi-locations')

function sortOrder(a, b) {
    return a.title < b.title ? -1 : (a.title > b.title ? 1 : 0)
}

module.exports = async function(req, res) {
  let cities
  try {
    // let xmlString = await request(process.env.AIR_QUALITY_URL)
    // cities = await parseXML(xmlString)
    let jsonData = await request(process.env.OPEN_DATA_URL)
    const data = JSON.parse(jsonData)
    // console.log(data)
    const extractedData = data.dataset.map(function(entry){
        return { title: entry.title, identifier: entry.identifier }
    }).sort(sortOrder)
    // const sorted = new Map([...titles]).sort()
    console.log(extractedData)
    // console.log(data.dataset)
    // cities = await request(process.env.OPEN_DATA_URL)
    cities = "Success"
  } catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: cities
  })
}
