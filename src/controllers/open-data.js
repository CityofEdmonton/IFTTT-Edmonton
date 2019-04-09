const request = require('request-promise-native')

/**
 * Open Data...
 */
module.exports = async function(req, res) {
  console.log('Open Data trigger called.')

  let triggerFields = req.body.triggerFields
  let column = triggerFields.dataset.split(':')

  // The Socrata api endpoint
  let url = 'https://data.edmonton.ca/resource/' + column[0] + '.json'
  let id = column[1]
  console.log(url)
  console.log(id)

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
