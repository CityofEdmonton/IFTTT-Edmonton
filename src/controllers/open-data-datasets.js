const { returnData, getDatasets } = require('../utils/store-odp-data')

/**
 * Gets the datasets from the cache and returns as a response
 */
module.exports = async function(req, res) {
  let cache = req.cache
  let datasets
  let data
  try {
    // console.log("Getting latest datasets")
    // datasets = JSON.parse(await cache.getLatest('datasets'))
    // if (!datasets) {
    //   console.log("No datasets found")
    //   datasets = (await getDatasets()).sort
    //   cache.add('datasets', JSON.stringify(datasets))
    // }
    // console.log("Starting to get columns")
    // let timer = Date.now()
    // data = await returnData(datasets)
    // console.log(`Time took: ${Date.now() - timer} ms`)
    data = await req.store.getDatasetData()
  } catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: data
  })
}
