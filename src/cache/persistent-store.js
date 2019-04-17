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
    // TODO: Set an expiry key (look at function Jared sent)
    await this.client.set('opendata/dataset/' + key, JSON.stringify(data))
    await this.client.set('opendata/dataset/' + key + '/expiry', '')
    // TODO: add expire functionality to redis-cache file??
  }

  /**
   * Returns a sorted array of dataset data store by the 'insertDataset' function
   * @return {Promise<Array<Object>>}
   */
  async getDatasetData() {
    let keys = await this.client.keys('opendata/dataset/*')
    let data = []
    let expired
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
    // TODO: return expiry flag -> after calculating if expired
    return [data, expired]
  }
}

module.exports = PersistentStore
