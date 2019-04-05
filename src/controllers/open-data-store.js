const storeAll = require('../utils/store-odp-data')

module.exports = async function(req, res) {
  try {
    storeAll(req.cache)
  } catch (e) {
    e.code = 500
    throw e
  }
  res.status(200).send({
    data: "Request sent."
  })
}
