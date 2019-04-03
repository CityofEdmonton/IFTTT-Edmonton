const request = require('request-promise-native')
const fs = require('fs')

function sortOrder(a, b) {
  return a.label < b.label ? -1 : (a.label > b.label ? 1 : 0)
}

const testData = [
  { label: "Test 1", value: "Value 1"},
  { label: "Test 2", value: "Value 2"},
  { label: "Test 3", values: [
    { label: "Test 3.1", value: "Value 3.1" },
    { label: "Test 3.2", value: "Value 3.2" },
    { label: "Test 3.3", value: "Value 3.3" },
  ]}
]

module.exports = async function(req, res) {
  // console.log(req)
  let cache = req.cache
  let datasets
  try {
    datasets = await cache.getDatasetData()
  } catch (e) {
    e.code = 500
    throw e
  }
  
  // try {
  //   let rawJsonData = await request(process.env.OPEN_DATA_URL)
  //   const rawData = JSON.parse(rawJsonData)
  //   const columns = [
  //     { label: "Column 1", value: "Column 1 Value" },
  //     { label: "Column 2", value: "Column 2 Value" },
  //     { label: "Column 3", value: "Column 3 Value" },
  //   ]
  //   datasets = rawData.dataset.map(function(entry){
  //       // let rawJsonDataColumns = await request(entry.identifier)
  //       // let rawDataColumns = JSON.parse(rawJsonDataColumns)
  //       // let columns = rawDataColumns.columns.map(function(entry){
  //       //   return { label: entry.name, value: entry.id }
  //       // })
  //       // console.log(columns)
  //       return { label: entry.title, values: columns }
  //   }).sort(sortOrder)
    // console.log(datasets)

  // } catch (e) {
  //   e.code = 500
  //   throw e
  // }
  
  res.status(200).send({
    data: datasets
  })
}