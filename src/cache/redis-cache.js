const redis = require('redis');
const { promisify } = require('util');

class RedisCache {
  constructor() {
    const client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    });
    const hmsetAsync = promisify(client.hmset).bind(client);
    const hgetAsync = promisify(client.hget).bind(client);
    const hmgetAsync = promisify(client.hmget).bind(client);
  }

  async hget(key, subkey) {
    return await hgetAsync(key, subkey)
  }

  async hmset(...args) {
    return await hmsetAsync(args)
  }

  async hmget(...args) {
    return await hmgetAsync(...args)
  }
}

module.exports = RedisCache