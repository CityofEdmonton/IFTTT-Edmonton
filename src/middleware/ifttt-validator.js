module.exports = function (req, res, next) {
  if (req.headers['ifttt-service-key'] != process.env.IFTTT_SERVICE_KEY) {
    let message = 'Invalid IFTTT service key provided.'
    console.error(message)
    return res.status(401).send(message)
  }
  next()
}