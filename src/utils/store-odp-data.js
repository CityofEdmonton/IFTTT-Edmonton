const request = require('request-promise-native')

/**
 * Stores the datasets and columns into Redis
 * @param {PersistentStore} store The persisten store to store the dataset data
 * @param {Number} filterDate The maximum number of days last updated (E.g. 365 would
 * filter datasets that were last updated a year ago or less)
 */
async function storeData(store, filterDate) {
  console.log('Retrieving data...')
  let timer = Date.now()
  try {
    let datasets = await getDatasets(filterDate)
    console.log(`Time taken to retrieve datasets: ${Date.now() - timer} ms`)
    console.log('Retrieving and storing all dataset columns...')
    timer = Date.now()
    let counter = 0
    await Promise.all(
      datasets.map(async dataset => {
        const { label, identifier } = dataset
        let columns = await getDatasetColumns(identifier, label)
        // Store the data in the Redis 'store'
        if (columns) {
          // The identifier is in the form: 'https://data.edmonton.ca/api/views/XXXX-XXXX'
          const key = identifier.split('/').slice(-1)[0] // Gets the last element of the array after the split
          store.insertDataset(key, label, columns)
          counter++
        }
      })
    )
    console.log(`Time taken to store data: ${Date.now() - timer} ms`)
    console.log(`Store operation completed. Datasets stored: ${counter}`)
  } catch (e) {
    console.log('Error ' + e)
  }
}

function daysFromToday(dateString) {
  let date = new Date(dateString)
  return Math.floor((Date.now() - date) / (24 * 60 * 60 * 1000))
}

/**
 * Gets the datasets from the Edmonton Open Data Portal with an additional filter
 * @param {Number} dayFilter The maximum number of days last updated (E.g. 365 would
 * filter datasets that were last updated a year ago or less)
 * @return {Object} A JSON object describing the datasets obtained
 */
async function getDatasets(dayFilter) {
  let rawJsonData = await request(process.env.OPEN_DATA_URL)
  const rawData = JSON.parse(rawJsonData)
  return rawData.dataset.map(entry => {
    if (dayFilter) {
      if (daysFromToday(entry.modified) < dayFilter) {
        return { label: entry.title, identifier: entry.identifier }
      } else {
        return { label: null, identifier: null }
      }
    } else {
      return { label: entry.title, identifier: entry.identifier }
    }
  })
}

/**
 * Returns the columns for the specified dataset
 * @param {String} identifier The endpoint to retrieve dataset data
 * @param {String} label The name of the dataset
 * @return {Array<Object>} Returns an array of JSON objects in the proper format
 * Look here for example format: https://platform.ifttt.com/docs/api_reference#trigger-field-dynamic-options
 */
async function getDatasetColumns(identifier, label) {
  if (!identifier) {
    return
  }
  let rawJsonDataColumns = await request(identifier)
  const rawDataColumns = JSON.parse(rawJsonDataColumns)
  const id = rawDataColumns.id
  const columns = rawDataColumns.columns
    .map(function(entry) {
      return {
        label: entry.name,
        value: `${id}|&|${label}|&|${entry.fieldName}`
      }
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

/**
 * Returns a JSON object in the proper format for a trigger field option
 * See 'Example' here: https://platform.ifttt.com/docs/api_reference#trigger-field-dynamic-options
 * @param {Object} datasets The JSON object describing the datasets to obtain columns of
 * @return {Object} The JSON object in the proper format for the trigger field options
 */
async function returnData(datasets) {
  let data
  try {
    await Promise.all(
      datasets.map(async dataset => {
        const { label, identifier } = dataset
        let columns = await getDatasetColumns(identifier, label)
        return { label: label, values: columns }
      })
    ).then(values => {
      data = values
    })
  } catch (e) {
    console.log('Error ' + e)
  }
  return data
}

module.exports = { storeData, getDatasets }
