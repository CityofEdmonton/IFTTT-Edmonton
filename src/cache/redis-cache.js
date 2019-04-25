const redis = require('redis')
const { promisify } = require('util')

class RedisCache {
  /**
   * This class wraps the Redis client in async functions.
   * @param {String} url The URL of the Redis service of the form
   * redis://user:password@host:port
   */
  constructor(url) {
    // (user), (password), (host), (port)
    let match = url.match(/redis:\/\/(\w+):(\w+)@([\w.-]+):(\w+)/)
    if (match.length < 5) {
      throw new Error(
        `Failed parsing ${url} for port, host, user and password.`
      )
    }
    let password = match[2]
    let host = match[3]
    let port = match[4]

    if (!password || !host || !port) {
      throw new Error(
        `Failed parsing ${url} for port, host, user and password.`
      )
    }

    const client = redis.createClient({
      port,
      host,
      password
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
}

module.exports = RedisCache
