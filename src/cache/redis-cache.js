const redis = require('redis')
const { promisify } = require('util')

class RedisCache {
  /**
   * This class wraps the Redis client in async functions.
   */
  constructor() {
    const client = redis.createClient({
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD
    })
    client.on('error', message => {
      console.log(message)
    })
    client.on('ready', () => {
      console.log('Redis is ready.')
    })

    this.lindexAsync = promisify(client.lindex).bind(client)
    this.lpushAsync = promisify(client.lpush).bind(client)
    this.ltrimAsync = promisify(client.ltrim).bind(client)
    this.lrangeAsync = promisify(client.lrange).bind(client)
    this.setAsync = promisify(client.set).bind(client)
    this.getAsync = promisify(client.get).bind(client)
    this.keysAsync = promisify(client.keys).bind(client)
  }

  /**
   * https://redis.io/commands/lindex
   */
  async lindex(key, index) {
    return await this.lindexAsync(key, index)
  }

  /**
   * https://redis.io/commands/lpush
   */
  async lpush(key, value) {
    return await this.lpushAsync(key, value)
  }

  /**
   * https://redis.io/commands/ltrim
   */
  async ltrim(key, start, end) {
    return await this.ltrimAsync(key, start, end)
  }

  /**
   * https://redis.io/commands/lrange
   */
  async lrange(key, start, end) {
    return await this.lrangeAsync(key, start, end)
  }

  /**
   * https://redis.io/commands/set
   */
  async set(key, value) {
    return await this.setAsync(key, value)
  }

  /**
   * https://redis.io/commands/get
   */
  async get(key) {
    return await this.getAsync(key)
  }

  /**
   * https://redis.io/commands/keys
   */
  async keys(pattern) {
    return await this.keysAsync(pattern)
  }
}

module.exports = RedisCache
