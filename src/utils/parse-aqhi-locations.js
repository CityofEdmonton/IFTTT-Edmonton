const parseString = require('xml2js').parseString

/**
 * Parses the list of cities found here:
 * https://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/CommunityAQHIs
 * @param {String} xml The XML string returned from the URL.
 * @return {Promise<Array<Object>>} label is the city name, value is the community id.
 */
module.exports = async function(xml) {
  let resolve, reject
  let promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  parseString(xml, (err, result) => {
    if (err) {
      return reject(err)
    }
    if (!result.feed.entry) {
      throw new Error('AQHI XML schema is incorrect when finding cities')
    }

    let root = result.feed.entry

    let flatResult = root
      .filter(entry => {
        // Filter out poorly formatted XML,
        try {
          let path = entry.content[0]['m:properties'][0]
          path['d:CommunityName'][0]
          path['d:Id'][0]['_']
        } catch (e) {
          return false
        }
        return true
      })
      .map(entry => {
        // then flatten the results.
        let path = entry.content[0]['m:properties'][0]
        return {
          label: path['d:CommunityName'][0],
          value: path['d:Id'][0]['_']
        }
      })

    resolve(flatResult)
  })

  return promise
}
