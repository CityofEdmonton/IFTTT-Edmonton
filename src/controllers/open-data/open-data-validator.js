/**
 * NOT BEING USED
 * Dynamic validator endpoint
 * See here for info: https://platform.ifttt.com/docs/api_reference#trigger-field-dynamic-validation
 * Note: Dynamic validation of trigger field options have to be enabled by
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
