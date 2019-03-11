const parseXML = require('./parse-aqhi-locations')

const singleCitySample = `
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<feed xml:base="http://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <content type="application/xml">
      <m:properties>
        <d:Id m:type="Edm.Int32">67</d:Id>
        <d:CommunityName>Edmonton</d:CommunityName>
      </m:properties>
    </content>
  </entry>
</feed>
`
test('single city', async () => {
  expect.assertions(3)
  const data = await parseXML(singleCitySample)
  expect(data.length).toBe(1)
  expect(data[0].label).toBe('Edmonton')
  expect(data[0].value).toBe('67')
})

const invalidXml = `
<feed>
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
  }
  catch (e) {
    expect(e.message).toBe(invalidXmlMessage)
  }
})

const invalidXmlSchema = `
<feed>
</feed>
`
const invalidXmlSchemaMessage = `AQHI XML schema is incorrect when finding cities`
test('invalid XML schema', async () => {
  expect.assertions(1)
  try {
    await parseXML(invalidXmlSchema)
  }
  catch (e) {
    expect(e.context.message).toBe(invalidXmlSchemaMessage)
  }
})

const invalidCitySchema = `
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<feed xml:base="http://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <content type="application/xml">
      <m:properties>
        <d:CommunityName>Edmonton</d:CommunityName>
      </m:properties>
    </content>
  </entry>
</feed>
`
test('invalid XML schema inside city', async () => {
  expect.assertions(1)
  let data = await parseXML(invalidCitySchema)
  expect(data.length).toBe(0)
})