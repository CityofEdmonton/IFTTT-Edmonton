/**
 * Gets the datasets from the cache and returns as a response
 */
module.exports = async function(req, res) {
  let store = req.store
  let datasets
  try {
    datasets = await store.getDatasetData()
  } catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: datasets
  })
}
