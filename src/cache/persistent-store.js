class PersistentStore {
  constructor(client) {
    this.client = client
  }

  /**
   * Inserts the dataset description as a JSON string into
   * the specified key
   * @param {String} key The key to store the dataset under
   * @param {String} dataset_label The dataset label
   * @param {Array<Object>} columns The columns are in the form { label: <string>, value: <string> }
   * @return {Promise}
   */
  async insertDataset(key, dataset_label, columns) {
    let data = {
      label: dataset_label,
      values: columns
    }
    await this.client.set('opendata:' + key, JSON.stringify(data))
  }

  /**
   * Returns a sorted array of dataset data store by the 'insertDataset' function
   * @return {Promise<Array<Object>>}
   */
  async getDatasetData() {
    let keys = await this.client.keys('opendata:*')
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
   * Adds a key value pair
   * @param {String} key The key to store the value under
   * @param {String} value The value to store under the key
   * @return {Promise}
   */
  async addKV(key, value) {
    await this.client.set(key, value)
  }

  /**
   * Gets a value from a key
   * @param {String} key The key to retrieve
   * @return {Promise<String>}
   */
  async getKV(key) {
    return await this.client.get(key)
  }
}

module.exports = PersistentStore
