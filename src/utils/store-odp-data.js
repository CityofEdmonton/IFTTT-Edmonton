const request = require('request-promise-native')

/** Stores the datasets and columns into Redis */
async function storeData(store) {
  console.log('Retrieving data...')
  let timer = Date.now()
  try {
    let datasets = await getDatasets()
    console.log(`Time taken to retrieve datasets: ${Date.now() - timer} ms`)
    console.log('Retrieving and storing all dataset columns...')
    timer = Date.now()
    await Promise.all(
      datasets.map(async dataset => {
        const { label, identifier } = dataset
        let columns = await getDatasetColumns(identifier)
        // The identifier is in the form: 'https://data.edmonton.ca/api/views/XXXX-XXXX'
        const key = identifier
          .split('/')
          .slice(
            -1
          )[0] /** Gets the last element of the array after the split */
        // Store the data in the Redis 'store'
        store.insertDataset(key, label, columns)
      })
    )
    console.log(`Time taken to store data: ${Date.now() - timer} ms`)
    console.log('Store operation completed.')
  } catch (e) {
    console.log('Error ' + e)
  }
}

async function getDatasets() {
  let rawJsonData = await request(process.env.OPEN_DATA_URL)
  const rawData = JSON.parse(rawJsonData)
  return rawData.dataset.map(function(entry) {
    return { label: entry.title, identifier: entry.identifier }
  })
}

async function getDatasetColumns(identifier) {
  let rawJsonDataColumns = await request(identifier)
  const rawDataColumns = JSON.parse(rawJsonDataColumns)
  const columns = rawDataColumns.columns
    .map(function(entry) {
      return { label: entry.name, value: entry.id }
    })
    .sort(sortOrder)
  return columns
}

function sortOrder(a, b) {
  if (a.label < b.label) {
    return -1
  } else if (a.label > b.label) {
    return 1
  } else {
    return 0
  }
}

module.exports = storeData
