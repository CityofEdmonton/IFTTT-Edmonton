const request = require('request-promise-native')

function sortOrder(a, b) {
  return a.label < b.label ? -1 : (a.label > b.label ? 1 : 0)
}

module.exports = async function(req, res) {
  let datasets
  try {
    let rawJsonData = await request(process.env.OPEN_DATA_URL)
    const rawData = JSON.parse(rawJsonData)
    datasets = rawData.dataset.map(function(entry){
        return { label: entry.title, value: entry.identifier }
    }).sort(sortOrder)
    console.log(datasets)
  } catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: datasets
  })
}