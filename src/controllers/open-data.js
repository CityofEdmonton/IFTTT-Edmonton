/**
 * Returns the most recent light the bridge results to IFTTT.
 */
module.exports = async function(req, res) {
  console.log('Open Data trigger called.')

  res.status(200).send({
    dataset: '???'
  })
}
