/**
 * This middleware adds the current cache to the request.
 * This is a poor (wo)mans dependency injection.
 * @author j-rewerts
 */
const Cache = require('../in-mem-cache')
const RedisCache = require('../cache/redis-cache')
const ChangeWriter = require('../cache/change-writer')
const PersistentStore = require('../cache/persistent-store')

let cache
let store
if (process.env.CACHE == 'REDIS') {
  let redis = new RedisCache()
  cache = new ChangeWriter(redis, process.env.MAX_RESULTS)
  store = new PersistentStore(redis)
} else {
  cache = new Cache()
}

var cacheProvider = function(req, res, next) {
  req.cache = cache
  req.store = store
  next()
}

module.exports = cacheProvider
