var _ = require('lodash')
var toHex = require('colornames')

function parseColors(string_to_parse) {
  const words = _.words(_.toLower(string_to_parse))
  var colors = []
  for (let i = 0; i < words.length; i++) {
    var hexColor = toHex(words[i])
    if (hexColor) colors.push({ color: words[i], hex: hexColor })
  }
  return colors
}

module.exports = parseColors
