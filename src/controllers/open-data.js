const request = require('request-promise-native')

function getOffset(numberOfLatestRows, totalRows) {
  let offset = totalRows - numberOfLatestRows
  if (offset < 0) {
    return 0
  } else {
    return offset
  }
}

/**
 * Open Data...
 */
module.exports = async function(req, res) {
  console.log('Open Data trigger called.')

  let triggerFields = req.body.triggerFields
  let data = triggerFields.dataset.split(':')
  const id = data[0] // The id of the dataset
  const column = data[1]
  console.log(id)

  // The Socrata api endpoint
  let url = `https://data.edmonton.ca/resource/${id}.json`
  let queryBase = `${url}?$query=`
  // let countQuery = `${queryBase}SELECT count(*)`
  let selectQuery = `${queryBase}SELECT ${column}`
  let getLatestRowQuery = `${queryBase}SELECT ${column} ORDER BY :updated_at LIMIT 5`
  // get lastUpdated (is a date encoded as ISO8601 Times) from changeWriter
  let getLastUpdatedQuery = `${queryBase}SELECT ${column} WHERE :updated_at > ${lastUpdated}`

  // let newColumn
  try {
    // let rawJsonCount = await request(countQuery)
    // console.log(rawJsonCount)
    // const count = JSON.parse(rawJsonCount)[0].count
    // const offset = getOffset(100, count)
    // console.log(offset)
    // let rawJsonDataColumns = await request(`${selectQuery} OFFSET ${offset}`)
    let rawJsonDataColumns = await request(getLatestRowQuery)
    const latestColumnRow = JSON.parse(rawJsonDataColumns)
    console.log(latestColumnRow)
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
