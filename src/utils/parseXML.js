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
  let resolve, reject
  let promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  parseString(xml, (err, result) => {
    if (err) {
      return reject(err)
    }

    let entry
    if (result.entry) {
      entry = [result.entry]
    }
    else if (result.feed.entry) {
      entry = result.feed.entry
    }
    else {
      throw new Error('XML Schema seems to have changed.')
    }

    flatRes = entry.map((aqInfo) => {
      let root = aqInfo.content[0]['m:properties'][0]
      let ret = {}
      if (typeof root['d:Id'][0]['_'] === 'string')
        ret['community_id'] = root['d:Id'][0]['_']
      if (typeof root['d:CommunityName'][0] === 'string')
        ret['community_name'] = root['d:CommunityName'][0]
      if (typeof root['d:AQHI'][0] === 'string')
        ret['aqhi_current'] = root['d:AQHI'][0]
      if (typeof root['d:ForecastToday'][0] === 'string')
        ret['aqhi_forecast_today'] = root['d:ForecastToday'][0]
      if (typeof root['d:ForecastTonight'][0] === 'string')
        ret['aqhi_forecast_tonight'] = root['d:ForecastTonight'][0]
      if (typeof root['d:ForecastTomorrow'][0] === 'string')
        ret['aqhi_forecast_tomorrow'] = root['d:ForecastTomorrow'][0]
      if (typeof root['d:HealthRisk'][0] === 'string')
        ret['health_risk'] = root['d:HealthRisk'][0]
      if (typeof root['d:GeneralPopulationMessage'][0] === 'string')
        ret['general_population_message'] = root['d:GeneralPopulationMessage'][0]
      if (typeof root['d:AtRiskMessage'][0] === 'string')
        ret['at_risk_message'] = root['d:AtRiskMessage'][0]
      
      return {
        ...{
          community_id: '',
          community_name: '',
          aqhi_current: '',
          aqhi_forecast_today: '',
          aqhi_forecast_tonight: '',
          aqhi_forecast_tomorrow: '',
          health_risk: '',
          general_population_message: '',
          at_risk_message: ''
        },
        ...ret
      }
    })

    resolve(flatRes)
  })

  return promise
}

module.exports = parseXML