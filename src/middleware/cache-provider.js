/**
 * This middleware adds the current cache to the request.
 * This is a poor (wo)mans dependency injection.
 * @author j-rewerts
 */
const Cache = require('../in-mem-cache')
const RedisCache = require('../cache/redis-cache')

if (process.env.CACHE == 'REDIS') {
  cache = new RedisCache()
}
else {
  cache = new Cache()
}

var cacheProvider = function (req, res, next) {
  req.cache = cache
  next()
}

module.exports = cacheProvider