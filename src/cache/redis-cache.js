const redis = require('redis');
const { promisify } = require('util');

class RedisCache {
  constructor() {
    const client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    });
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