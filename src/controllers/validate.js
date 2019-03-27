const request = require('request-promise-native')

var returnData = {
    column: {
        valid: false,
        message: "Helloooooooooooooooooooooooooooooooooooo\nooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"
    },
    dataset: {
        valid: true
    }
}

// TODO: check for dataset if it is defined -> return valid false if undefined

module.exports = async function(req, res) {
  const { column, dataset } = req.body.values
  console.log(req)
  console.log("Column: ", column)
  console.log("Data set: ", dataset)
  let columnsList
  let columnsListString = ""
  try {
    let rawJsonData = await request(dataset)
    const rawData = JSON.parse(rawJsonData)
    columnsList = rawData.columns.map(function(entry){
        return entry.name
    })
    for (let i = 0; i < columnsList.length; i++) {
        columnsListString += '[' + columnsList[i] + ']\n'
    }
    console.log("Columns: ", columnsListString)
  } catch (e) {
    e.code = 500
    throw e
  }
  returnData = {
      ...returnData,
      column: {
          ...returnData.column,
          message: columnsListString ? columnsListString : "null",
          value: "asdasdasdasd"
      }
  }
  res.status(200).send({
    data: returnData
  })
}
