/**
 * This middleware adds the current cache to the request.
 * This is a poor (wo)mans dependency injection.
 * @author j-rewerts
 */
const RedisCache = require('../cache/redis-cache')
const ChangeWriter = require('../cache/change-writer')
const PersistentStore = require('../cache/persistent-store')

let redis = new RedisCache(process.env.REDIS_URL)
let cache = new ChangeWriter(redis, process.env.MAX_RESULTS)
let new PersistentStore(redis)

var cacheProvider = function(req, res, next) {
  req.cache = cache
  req.store = store
  next()
}

module.exports = cacheProvider
