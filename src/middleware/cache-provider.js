/**
 * This middleware adds the current cache to the request.
 * This is a poor (wo)mans dependency injection.
 * @author j-rewerts
 */
const Cache = require('../in-mem-cache')

if (process.env.CACHE == 'REDIS') {

}
else {
  cache = new Cache()
}

var cacheProvider = function (req, res, next) {
  req.cache = cache
  next()
}

module.exports = cacheProvider