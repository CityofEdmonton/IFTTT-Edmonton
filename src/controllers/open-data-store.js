const storeAll = require('../utils/store-odp-data')

/**
 * Starts the async function to obtain and store
 * the dataset data into the Redis cache
 */
module.exports = async function(req, res) {
  try {
    storeAll(req.store)
  } catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: 'Request sent.'
  })
}
