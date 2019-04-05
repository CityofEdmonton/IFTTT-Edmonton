var toHex = require('colornames')

function parseColors(string_to_parse = '') {
  const words = string_to_parse
    .replace(new RegExp(/[^a-zA-Z\s]/g), ' ')
    .toLowerCase()
    .split(' ')
  var colors = []
  for (let i = 0; i < words.length; i++) {
    var hexColor = toHex(words[i])
    if (hexColor && !colors.some(el => el.color === words[i]))
      colors.push({ color: words[i], hex: hexColor })
  }
  return colors
}

module.exports = parseColors
