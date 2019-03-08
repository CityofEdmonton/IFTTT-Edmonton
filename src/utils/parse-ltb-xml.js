
const parseString = require('xml2js').parseString;

/**
 * Parses the RSS feed returned from https://twitrss.me.
 * https://twitrss.me/twitter_search_to_rss/?term=LighttheBridge%20from:CityofEdmonton
 * It resolves with an array of objects.
 * @param {String} xml The XML string returned from the RSS URL.
 * @return {Promise<Array<Object>>} title contains the tweet.
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
    if (!result || !result.rss || !result.rss.channel || !result.rss.channel[0]) {
      throw new Error('LTB XML schema is incorrect')
    }

    let description = result.rss.channel[0].title[0]
    let root = result.rss.channel[0].item
    let flatResult = root.map((entry) => {
      return {
        title: entry.title[0],
        description
      }
    })
    resolve(flatResult)
  })

  return promise
}