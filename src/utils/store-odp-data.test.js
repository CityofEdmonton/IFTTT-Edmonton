const { getDatasets, getDatasetColumns } = require('./store-odp-data')

if (!process.env.OPEN_DATA_URL) {
  process.env['OPEN_DATA_URL'] = 'https://data.edmonton.ca/data.json'
}

/**
 * Tests for 'getDatasets' function
 * Using Jest to test JSON shape: http://www.kevinfodness.com/using-jest-to-validate-json-data-shape
 */

test('shape of returned datasets', async () => {
  let data = await getDatasets()
  expect(Array.isArray(data)).toEqual(true)
  data.forEach(dataset => {
    expect(typeof dataset).toEqual('object')
    expect(Object.keys(dataset).sort()).toEqual(['identifier', 'label'])
  })
}, 30000) // Set a 30 second timeout for the test

/**
 * Tests for 'getDatasetColumns' function
 */

test('shape of returned dataset columns', async () => {
  let data = await getDatasets()
  let dataset = data[0]
  let { identifier, label } = dataset
  let columns = await getDatasetColumns(identifier, label)
  expect(Array.isArray(columns)).toEqual(true)
  columns.forEach(column => {
    expect(typeof column).toEqual('object')
    expect(Object.keys(column).sort()).toEqual(['label', 'value'])
    let values = column.value.split('|&|') // Split by unique separator
    expect(values.length).toEqual(3)
    expect(values[0]).toEqual(identifier.split('/').slice(-1)[0]) // Unique dataset identifier
    expect(values[1]).toEqual(label) // Dataset label
  })
}, 30000)
