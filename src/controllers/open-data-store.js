const { storeData } = require('../utils/store-odp-data')

/**
 * Starts the async function to obtain and store
 * the dataset data into the Redis cache
 */
module.exports = async function(req, res) {
  try {
    storeData(req.store, 185) // Only datasets that were last modified half a year ago or less
    // storeData(req.store)
  } catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: 'Request sent.'
  })
}
