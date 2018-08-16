const { ok, equal, deepEqual } = require('assert')
const { get } = require('./metaweb')
const winston = require('winston')

log = winston.createLogger({
  level: 'debug',
  transports: [
    new (winston.transports.File)({
      filename: './test.log',
      prepend: true,
      level: 'debug'
    })
  ]
})


describe('metaweb', function() {
  this.timeout(5000)

  it('unshortens', async () => {
    const result = await get('https://bitly.com/4kb77v')
    equal(result.url, 'https://www.youtube.com/watch?v=oHg5SJYRHA0')
    equal(result.status, 200)
    equal(result.content_type, 'text/html; charset=utf-8')
    equal(result.title, "RickRoll'D - YouTube")
  })

  it('handles bad protocol', async () => {
    try {
      result = await get('foo')
      ok(! result)
    } catch(error) {
      ok(error.message.match(/Invalid URI/))
    }
  })

  it('handles 404', async () => {
    const result = await get('http://example.com/inkdroid')
    equal(result.status, 404)
  })

   
  it('handles redirect to 404', async () => {
    const result = await get('http://bit.ly/2y1xVk6')
    equal(result.status, 404)
  })

  it('handles connection refused', async () => {
    try {
      const result = await get('http://inkdroid.org:666/')
    } catch(error) {
      ok(error.message.match(/ECONNREFUSED/))
    }
  })

  it('handles t.co', async () => {
    const result = await get('https://t.co/r2mIeyyY7t')
    equal(result.url, 'https://www.newshub.co.nz/home/election/2017/08/patrick-gower-bill-english-in-shutdown-mode-over-todd-barclay-texts.html')
    equal(result.status, 200)
  })
  
  it('handles canonical link', async () => {
    const result = await get('https://www.nytimes.com/2017/05/23/opinion/mitch-landrieu-new-orleans-mayor-speech.html?smprod=nytcore-iphone&smid=nytcore-iphone-share&_r=0')
    equal(result.canonical, 'https://www.nytimes.com/2017/05/23/opinion/mitch-landrieu-new-orleans-mayor-speech.html')
  })

  it('extracts metadata', async () => {
    const result = await get('http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/')
    equal(result.title, 'NSA slides explain the PRISM data-collection program - The Washington Post')
    equal(result.description, 'Through a Top-Secret program authorized by federal judges working under the Foreign Intelligence Surveillance Act (FISA), the U.S. intelligence community can gain access to the servers of nine internet companies for a wide range of digital data. Documents describing the previously undisclosed program, obtained by The Washington Post, show the breadth of U.S. electronic surveillance capabilities.')
    equal(result.image, 'http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/images/upstream-promo-296.jpg')
    // equal(result.type, '')
    equal(result.publisher, 'The Washington Post')
    // equal(result.published, '')
    deepEqual(result.keywords, ['nsa', 'security', 'privacy', 'government data collection', 'nsa data collection', 'nsa prism program', 'prism data collection', 'prism program'])
  })

})
  
