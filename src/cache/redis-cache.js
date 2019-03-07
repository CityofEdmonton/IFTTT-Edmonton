const redis = require('redis');
const { promisify } = require('util');

class RedisCache {
  constructor() {
    const client = redis.createClient({
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
    });
    client.on('error', (message) => {
      console.log(message)
    })
    client.on('ready', (message) => {
      console.log('Redis is ready.')
    })
    this.hmsetAsync = promisify(client.hmset).bind(client);
    this.hgetAsync = promisify(client.hget).bind(client);
    this.hmgetAsync = promisify(client.hmget).bind(client);
    this.hgetallAsync = promisify(client.hgetall).bind(client);
  }

  async hget(key, subkey) {
    return await this.hgetAsync(key, subkey)
  }

  async hmset(key, args) {
    return await this.hmsetAsync(key, ...this.objToArray(args))
  }

  async hgetall(key) {
    return await this.hgetallAsync(key)
  }

  objToArray(obj) {
    let val = Object.keys(obj).reduce((r, k) => {
      return r.concat(k, obj[k]);
    }, []);
    return val
  }
}

module.exports = RedisCache