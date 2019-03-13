class InMemCache {
  constructor() {
    this._store = {}
  }

  /**
   * Gets an item stored in the cache.
   */
  get(key) {
    return this._store[key]
  }

  /**
   * Sets an item in the cache.
   */
  set(key, value) {
    this._store[key] = value
  }
}

module.exports = InMemCache
