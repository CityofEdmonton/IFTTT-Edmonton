/**
 * This middleware adds the current cache to the request.
 * This is a poor (wo)mans dependency injection.
 * @author j-rewerts
 */
const RedisCache = require('../cache/redis-cache')
const ChangeWriter = require('../cache/change-writer')

let redis = new RedisCache(process.env.REDIS_URL)
let cache = new ChangeWriter(redis, process.env.MAX_RESULTS)

var cacheProvider = function(req, res, next) {
  req.cache = cache
  next()
}

module.exports = cacheProvider
