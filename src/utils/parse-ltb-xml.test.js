const parseXML = require('./parse-ltb-xml')

const singleTweetSample = `
<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss" xmlns:twitter="http://api.twitter.com" xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <atom:link href="http://twitrss.me/twitter_search_to_rss/?term=lightthebridge from:cityofedmonton" rel="self" type="application/rss+xml" /> 
    <title>Twitter search feed for: lightthebridge from:cityofedmonton.</title>
    <link>https://twitter.com/search?f=tweets&amp;src=typd&amp;q=lightthebridge from:cityofedmonton</link>
    <description>Twitter search feed for: lightthebridge from:cityofedmonton.</description>
    <language>en-us</language>
    <ttl>40</ttl>
    <item>
      <title>The bridge will be lit in magenta for Social Work Week 2019. #socialworkersAB  http://acsw.ab.ca&#xA0; http://facebook.com/AlbertaCollegeofSocialWorkers&#xA0;&#x2026; #yeg #LightTheBridge</title>
      <dc:creator> (@CityofEdmonton)</dc:creator>
      <description><![CDATA[<p class="TweetTextSize  js-tweet-text tweet-text"  lang="en">The bridge will be lit in magenta for Social Work Week 2019. <a class="twitter-hashtag pretty-link js-nav"  dir="ltr" href="https://twitter.com/hashtag/socialworkersAB?src=hash">#<b>socialworkersAB</b></a>  <a href="http://acsw.ab.ca">http://acsw.ab.ca&nbsp;</a>  <a href="http://facebook.com/AlbertaCollegeofSocialWorkers">http://facebook.com/AlbertaCollegeofSocialWorkers&nbsp;&hellip;</a> <a class="twitter-hashtag pretty-link js-nav"  dir="ltr" href="https://twitter.com/hashtag/yeg?src=hash">#<b>yeg</b></a> <a class="twitter-hashtag pretty-link js-nav"  dir="ltr" href="https://twitter.com/hashtag/LightTheBridge?src=hash">#<b>LightTheBridge</b></a></p>]]></description>
      <pubDate>Wed, 06 Mar 2019 23:05:11 +0000</pubDate>
      <guid>https://twitter.com/CityofEdmonton/status/1103431359610212353</guid>
      <link>https://twitter.com/CityofEdmonton/status/1103431359610212353</link>
      <twitter:source/>
      <twitter:place/>
    </item>
  </channel>
</rss>
`
test('single tweet', async () => {
  expect.assertions(3)
  const data = await parseXML(singleTweetSample)
  expect(data.id).toBe('1103431359610212353')
  expect(data.title).toBe('The bridge will be lit in magenta for Social Work Week 2019. #socialworkersAB  http://acsw.ab.ca  http://facebook.com/AlbertaCollegeofSocialWorkers … #yeg #LightTheBridge')
  expect(data.description).toBe('Twitter search feed for: lightthebridge from:cityofedmonton.')
})

const invalidXml = `
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss" xmlns:twitter="http://api.twitter.com" xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
</rss>
`
const invalidXmlMessage = `Unexpected close tag
Line: 3
Column: 6
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
<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss" xmlns:twitter="http://api.twitter.com" xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
  </channel>
</rss>
`
const invalidXmlSchemaMessage = `LTB XML schema is incorrect`
test('invalid XML schema', async () => {
  expect.assertions(1)
  try {
    await parseXML(invalidXmlSchema)
  }
  catch (e) {
    expect(e.context.message).toBe(invalidXmlSchemaMessage)
  }
})

const invalidTweetSchema = `
<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss" xmlns:twitter="http://api.twitter.com" xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <atom:link href="http://twitrss.me/twitter_search_to_rss/?term=lightthebridge from:cityofedmonton" rel="self" type="application/rss+xml" /> 
    <title>Twitter search feed for: lightthebridge from:cityofedmonton.</title>
    <link>https://twitter.com/search?f=tweets&amp;src=typd&amp;q=lightthebridge from:cityofedmonton</link>
    <description>Twitter search feed for: lightthebridge from:cityofedmonton.</description>
    <language>en-us</language>
    <ttl>40</ttl>
    <item>
      <dc:creator> (@CityofEdmonton)</dc:creator>
      <description><![CDATA[<p class="TweetTextSize  js-tweet-text tweet-text"  lang="en">The bridge will be lit in magenta for Social Work Week 2019. <a class="twitter-hashtag pretty-link js-nav"  dir="ltr" href="https://twitter.com/hashtag/socialworkersAB?src=hash">#<b>socialworkersAB</b></a>  <a href="http://acsw.ab.ca">http://acsw.ab.ca&nbsp;</a>  <a href="http://facebook.com/AlbertaCollegeofSocialWorkers">http://facebook.com/AlbertaCollegeofSocialWorkers&nbsp;&hellip;</a> <a class="twitter-hashtag pretty-link js-nav"  dir="ltr" href="https://twitter.com/hashtag/yeg?src=hash">#<b>yeg</b></a> <a class="twitter-hashtag pretty-link js-nav"  dir="ltr" href="https://twitter.com/hashtag/LightTheBridge?src=hash">#<b>LightTheBridge</b></a></p>]]></description>
      <pubDate>Wed, 06 Mar 2019 23:05:11 +0000</pubDate>
      <guid>https://twitter.com/CityofEdmonton/status/1103431359610212353</guid>
    </item>
  </channel>
</rss>
`
test('invalid XML schema inside tweet', async () => {
  expect.assertions(1)
  let data = await parseXML(invalidTweetSchema)
  expect(data).toBe(undefined)
})