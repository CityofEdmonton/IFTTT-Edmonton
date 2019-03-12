/**
 * Remove leading slashes from the original URL.
 * Example: https://webhost.ca//ifttt/v1/triggers/light_the_bridge
 * becomes https://webhost.ca/ifttt/v1/triggers/light_the_bridge
 * This fixes an issue where IFTTT will pass through a URL that 
 * has too many slashes.
 */
module.exports = function (req, res, next) {
  let leadingSlashes = 0
  let splits = req.originalUrl.split('/').filter((item) => {
    if (item == '') {
      leadingSlashes++
      return false
    }
    return true
  })

  req.url = req.originalUrl = `/${splits.join('/')}`
  next()
}