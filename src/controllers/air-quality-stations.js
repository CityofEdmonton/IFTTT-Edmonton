const request = require('request-promise-native')
const parseXML = require('../utils/parse-aqhi-locations')

/**
 * This route returns the cities and their community IDs
 * for use as a dynamic trigger field.
 */
module.exports = async function (req, res) {
  let cities
  try {
    let xmlString = await request(process.env.AIR_QUALITY_URL)
    cities = await parseXML(xmlString)
  }
  catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: cities
  })
}