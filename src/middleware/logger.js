var myLogger = function(req, res, next) {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
  next()
}

module.exports = myLogger
