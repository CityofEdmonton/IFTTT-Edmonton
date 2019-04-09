/**
 * Open Data...
 */
module.exports = async function(req, res) {
  console.log('Open Data trigger called.')

  console.log(req.body)

  res.status(200).send({
    dataset: '???'
  })
}
