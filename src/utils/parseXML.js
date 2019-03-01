/**
 * Parses the Air Quality info provided by the GoA.
 * <d:CommunityName>Gibbons</d:CommunityName>
 * <d:ReadingDate>2019-02-28 11:00</d:ReadingDate>
 * <d:AQHI>3</d:AQHI>
 * <d:AQHIDisabledText m:null="true" />
 * <d:ForecastToday>3</d:ForecastToday>
 * <d:ForecastTonight>3</d:ForecastTonight>
 * <d:ForecastTomorrow>3</d:ForecastTomorrow>
 * <d:ForecastDisabledText m:null="true" />
 * <d:HealthRisk>Low</d:HealthRisk>
 * <d:GeneralPopulationMessage>Ideal air quality for outdoor activities.</d:GeneralPopulationMessage>
 * <d:AtRiskMessage>Enjoy your usual outdoor activities.</d:AtRiskMessage>
 * <d:OdourMessage></d:OdourMessage>
 */

const parseString = require('xml2js').parseString;


const parseXML = async function(xml) {
  console.log(xml)
  let resolve, reject
  let promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  parseString(xml, (err, result) => {
    if (err) {
      return reject(err)
    }

    flatRes = result.feed.entry.map((aqInfo) => {
      let root = aqInfo.content[0]['m:properties'][0]
      return {
        community_id: root['d:Id'][0]['_'],
        community_name: root['d:CommunityName'][0],
        aqhi_current: root['d:AQHI'][0],
        aqhi_forecast_today: root['d:ForecastToday'][0],
        aqhi_forecast_tonight: root['d:ForecastTonight'][0],
        aqhi_forecast_tomorrow: root['d:ForecastTomorrow'][0],
        health_risk: root['d:HealthRisk'][0],
        general_population_message: root['d:GeneralPopulationMessage'][0],
        at_risk_message: root['d:AtRiskMessage'][0]
      }
    })

    resolve(flatRes)
  })

  return promise
}

module.exports = parseXML