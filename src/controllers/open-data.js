const request = require('request-promise-native')

/**
 * Open Data...
 */
module.exports = async function(req, res) {
  console.log('Open Data trigger called.')

  let triggerFields = req.body.triggerFields
  let data = triggerFields.dataset.split(':')
  const id = data[0] // The id of the dataset
  const column = data[1]

  // The Socrata api endpoint
  let url = `https://data.edmonton.ca/resource/${id}.json?$select=${column}`
  console.log(url)
  console.log(column)

  // let newColumn
  try {
    let rawJsonDataColumns = await request(url)
    const rawDataColumns = JSON.parse(rawJsonDataColumns)
    console.log(rawDataColumns)
    // console.log(rawDataColumns.columns[0].cachedContents)
  } catch (e) {
    e.code = 500
    throw e
  }

  res.status(200).send({
    data: {
      CreatedAt: 'Date',
      DataSet: 'String',
      Column: 'String',
      ColumnValues: 'Array as String (Value1, Value2, Value3)'
    }
  })
}
