class PersistentStore {
  constructor(client) {
    this.client = client
  }

  /**
   * Inserts the dataset description as a JSON string into
   * the specified key
   * @param {String} key The key to store the dataset under
   * @param {String} datasetLabel The dataset label
   * @param {Array<Object>} columns The columns are in the form { label: <string>, value: <string> }
   * @return {Promise}
   */
  async insertDataset(key, datasetLabel, columns) {
    let data = {
      label: datasetLabel,
      values: columns
    }
    await this.client.set('opendata/dataset/' + key, JSON.stringify(data))
  }

  /**
   * Returns a sorted array of dataset data store by the 'insertDataset' function
   * @return {Promise<Array<Object>>}
   */
  async getDatasetData() {
    let keys = await this.client.keys('opendata/dataset/*')
    let data = []
    for (let key of keys) {
      let dataset = await this.client.get(key)
      data.push(JSON.parse(dataset))
    }
    data.sort(function(a, b) {
      let x = a['label'],
        y = b['label']
      if (x > y) {
        return 1
      } else if (x < y) {
        return -1
      } else {
        return 0
      }
    })
    return data
  }

  /**
   * Sets a key with name 'expiryKey' with time to live 'time'
   * @param {String} expiryKey The name of the expiry key
   * @param {Number} time The number of seconds the expiry key has to live
   */
  async setExpiry(expiryKey, time) {
    await this.client.set(expiryKey, 'key')
    await this.client.expire(expiryKey, time)
  }

  /**
   * Checks to see if the key with name 'expiryKey' has expired or not
   * @param {String} expiryKey The key to check if expired
   * @return {Boolean} Returns TRUE if the key has expired, FALSE otherwise
   */
  async getExpired(expiryKey) {
    let expire = await this.client.get(expiryKey)
    if (expire == null) return true
    return false
  }
}

module.exports = PersistentStore
