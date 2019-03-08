class ChangeWriter {
  constructor(client, maxElements) {
    this.client = client
    this.maxElements = maxElements
  }

  /**
   * Adds an object to a Redis list. Elements are inserted at the head.
   * Elements are trimmed from the tail. Only this.maxElements are allowed.
   * @param {String} key The name of the list to add obj to.
   * @param {Object} obj The JSON serializeable object that should be added.
   * @return {Promise}
   */
  async add(key, obj) {
    let value = JSON.stringify(obj)
    await this.client.lpush(key, value)
    await this.client.ltrim(key, 0, this.maxElements)
  }

  /**
   * Gets the most recently added item
   * @param {String} key The name of the list.
   * @return {Promise<Object>}
   */
  async getLatest(key) {
    let str = await this.client.lindex(key, 0)
    return JSON.parse(str)
  }

  /**
   * Gets all JSON objects stored in a Redis list,
   * sorted by when they were added, with most recent
   * in index 0.
   * @param {String} key The name of the list.
   * @param {Number?} limit The number to return. Optional.
   * @return {Promise<Array<Object>>}
   */
  async getAll(key, limit) {
    let resultStrings
    if (limit >= 0) {
      resultStrings = await this.client.lrange(key, 0, limit-1)
    }
    else {
      resultStrings = await this.client.lrange(key, 0, this.maxElements-1)
    }

    return resultStrings.map((str) => {
      return JSON.parse(str)
    })
  }
}

module.exports = ChangeWriter