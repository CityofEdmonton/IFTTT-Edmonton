const parseXML = require('./parse-aqhi-xml')

const singleAqhiSample = `
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<feed xml:base="http://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <content type="application/xml">
      <m:properties>
        <d:Id m:type="Edm.Int32">67</d:Id>
        <d:CommunityName>Edmonton</d:CommunityName>
        <d:ReadingDate>2019-03-07 09:00</d:ReadingDate>
        <d:AQHI>2</d:AQHI>
        <d:AQHIDisabledText m:null="true" />
        <d:ForecastToday>3</d:ForecastToday>
        <d:ForecastTonight>4</d:ForecastTonight>
        <d:ForecastTomorrow>3</d:ForecastTomorrow>
        <d:ForecastDisabledText m:null="true" />
        <d:HealthRisk>Low</d:HealthRisk>
        <d:GeneralPopulationMessage>Ideal air quality for outdoor activities.</d:GeneralPopulationMessage>
        <d:AtRiskMessage>Enjoy your usual outdoor activities.</d:AtRiskMessage>
        <d:OdourMessage></d:OdourMessage>
      </m:properties>
    </content>
  </entry>
</feed>
`
test('single aqhi', async () => {
  expect.assertions(10)
  const data = await parseXML(singleAqhiSample)
  expect(data.length).toBe(1)
  expect(data[0].community_id).toBe('67')
  expect(data[0].community_name).toBe('Edmonton')
  expect(data[0].aqhi_current).toBe('2')
  expect(data[0].aqhi_forecast_today).toBe('3')
  expect(data[0].aqhi_forecast_tonight).toBe('4')
  expect(data[0].aqhi_forecast_tomorrow).toBe('3')
  expect(data[0].health_risk).toBe('Low')
  expect(data[0].general_population_message).toBe(
    'Ideal air quality for outdoor activities.'
  )
  expect(data[0].at_risk_message).toBe('Enjoy your usual outdoor activities.')
})

const invalidXml = `
<feed xml:base="http://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://www.w3.org/2005/Atom">
  <entry>
</feed>
`
const invalidXmlMessage = `Unexpected close tag
Line: 3
Column: 7
Char: >`
test('invalid XML', async () => {
  expect.assertions(1)
  try {
    await parseXML(invalidXml)
  } catch (e) {
    expect(e.message).toBe(invalidXmlMessage)
  }
})

const invalidXmlSchema = `
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<feed xml:base="http://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://www.w3.org/2005/Atom">
</feed>
`
const invalidXmlSchemaMessage = `XML Schema seems to have changed.`
test('invalid XML schema', async () => {
  expect.assertions(1)
  try {
    await parseXML(invalidXmlSchema)
  } catch (e) {
    expect(e).toBe(invalidXmlSchemaMessage)
  }
})
