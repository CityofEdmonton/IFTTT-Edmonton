const { storeData } = require('../../utils/store-odp-data')

/**
 * Sends a post request to start the async function to obtain
 * and store the dataset data into the Redis cache
 */
module.exports = async function(req, res) {
  // If no environment variable is set, the request will not need a key
  if (req.headers['ifttt-data-store-key'] == process.env.IFTTT_DATA_STORE_KEY) {
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
  } else {
    res.status(401).send({
      error: 'Invalid Date-store key provided. Unable to send request.'
    })
  }
}
