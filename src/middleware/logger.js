var myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

module.exports = myLogger