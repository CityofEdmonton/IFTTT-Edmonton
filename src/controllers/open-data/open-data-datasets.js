const zlib = require('zlib')
const { storeData } = require('../../utils/store-odp-data')

/**
 * Gets the datasets from the cache and returns as a response
 */
module.exports = async function(req, res) {
  const LABEL_MAX_LENGTH = 65
  let data
  let newData
  let timer
  try {
    console.log('Getting dataset options...')
    timer = Date.now()
    data = await req.store.getDatasetData()
    newData = data.map(dataset => {
      let newLabel = truncateString(dataset.label, LABEL_MAX_LENGTH)
      let newColumnValues = dataset.values.map(columnValue => {
        let newColumnValue = truncateString(columnValue.label, LABEL_MAX_LENGTH)
        return { label: newColumnValue, value: columnValue.value }
      })
      return { label: newLabel, values: newColumnValues }
    })
  } catch (e) {
    e.code = 500
    throw e
  }
  let sendData = {
    data: newData
  }
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Encoding': 'gzip'
  })
  zlib.gzip(JSON.stringify(sendData), function(_, result) {
    res.end(result)
    console.log(`Options sent. Time: ${Date.now() - timer} ms`)
  })

  // Expiry check to update stored data
  let expiryKey = 'DATA_STORE_EXPIRY_KEY'
  let dataExpired = await req.store.getExpired(expiryKey) // Return a boolean
  if (dataExpired) {
    req.store.setExpiry(expiryKey, 60 * 20) // Time is in seconds (20 minutes)
    storeData(req.store, 185) // Only datasets that were last modified half a year ago or less
  }
}

function truncateString(string, maxLength) {
  let longer = string.length > maxLength ? true : false
  if (longer) {
    return string.slice(0, maxLength).trimEnd() + '... '
  } else {
    return string + ' ' // Add a space as padding
  }
}
