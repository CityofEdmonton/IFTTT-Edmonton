/**
 * Gets the datasets from the cache
 */
module.exports = async function(req, res) {
  let cache = req.cache
  let datasets
  try {
    datasets = await cache.getDatasetData()
  } catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: datasets
  })
}