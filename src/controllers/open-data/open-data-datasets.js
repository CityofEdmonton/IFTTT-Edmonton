const zlib = require('zlib')

/**
 * Gets the datasets from the cache and returns as a response
 */
module.exports = async function(req, res) {
  const LABEL_MAX_LENGTH = 65
  let data
  let dataExpired
  let newData
  let timer
  try {
    console.log('Getting dataset options...')
    timer = Date.now()
    let datasetData = await req.store.getDatasetData()
    data = datasetData[0]
    dataExpired = datasetData[1]
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

  // TODO
  if (dataExpired) {
    // call update function
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
