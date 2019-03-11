/**
 * Finds the color associated with a given air quality
 * index. Check the README for the chart used to get
 * these values.
 * @param {String} index The index of the air quality.
 */
module.exports = function(index) {
  let color = '#A9A9A9';
  let lightColor = '#A9A9A9';

  switch (index) {
    case '1':
      color = '#00CCFF';
      lightColor = '#00CCFF';
      break;
    case '2':
      color = '#0099CC';
      lightColor = '#0099CC';
      break;
    case '3':
      color = '#006699';
      lightColor = '#3F5FBF';
      break;
    case '4':
      color = '#FFFF00';
      lightColor = '#FFE900';
      break;
    case '5':
      color = '#FFCC00';
      lightColor = '#FFCC00';
      break;
    case '6':
      color = '#FF9933';
      lightColor = '#FFAA00';
      break;
    case '7':
      color = '#FF6666';
      lightColor = '#FF6666';
      break;
    case '8':
      color = '#FF0000';
      lightColor = '#FF0000';
      break;
    case '9':
      color = '#CC0000';
      lightColor = '#CC0000';
      break;
    case '10':
      color = '#990000';
      lightColor = '#990000';
      break;
  }
  return { color, lightColor }
};
