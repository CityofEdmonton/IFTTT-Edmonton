/**
 * Dynamic validator endpoint (Not being used)
 * Dynamic validation of trigger field options have to be enabled by
 * the IFTTT Platform Support team
 */
module.exports = async function(req, res) {
  res.status(200).send({
    data: {
      dataset: {
        valid: true // Always return true (Validation not used)
      }
    }
  })
}
