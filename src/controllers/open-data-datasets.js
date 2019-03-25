const request = require('request-promise-native')

module.exports = async function(req, res) {
  let datasets
  try {
    let rawJsonData = await request(process.env.OPEN_DATA_URL)
    const rawData = JSON.parse(rawJsonData)
    datasets = rawData.dataset.map(function(entry){
        return entry.title
    }).sort()
  } catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: datasets
  })
}