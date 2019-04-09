/**
 * Dynamic validator endpoint (not being used)
 */
module.exports = async function(req, res) {
  console.log('Open Data validator called.')
  console.log(req.body)

  res.status(200).send({
    data: {
      dataset: {
        valid: true
      }
    }
  })
}
