const { ok, strictEqual } = require('assert')
const { get } = require('./metaweb')
const winston = require('winston')
const { assert } = require('console')

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
    const result = await get('https://bit.ly/348J1DN')
    strictEqual(result.url, 'https://www.youtube.com/watch?v=oHg5SJYRHA0')
    strictEqual(result.status, 200)
    strictEqual(result.content_type, 'text/html; charset=utf-8')
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
    strictEqual(result.status, 404)
  })

   
  it('handles redirect to 404', async () => {
    const result = await get('http://bit.ly/2y1xVk6')
    strictEqual(result.status, 404)
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
    strictEqual(result.url, 'https://www.newshub.co.nz/home/election/2017/08/patrick-gower-bill-english-in-shutdown-mode-over-todd-barclay-texts.html')
    strictEqual(result.status, 200)
  })
  
  it('handles canonical link', async () => {
    const result = await get('https://www.nytimes.com/2017/05/23/opinion/mitch-landrieu-new-orleans-mayor-speech.html?smprod=nytcore-iphone&smid=nytcore-iphone-share&_r=0')
    strictEqual(result.canonical, 'https://www.nytimes.com/2017/05/23/opinion/mitch-landrieu-new-orleans-mayor-speech.html')
  })

  it('extracts metadata', async () => {
    const result = await get('https://www.youtube.com/watch?v=oHg5SJYRHA0')
    strictEqual(result.title, "RickRoll'D")
    strictEqual(result.description, "https://www.facebook.com/rickroll548Reddit AMA: https://www.reddit.com/r/IAmA/comments/mx53y/i_am_youtube_user_cotter548_aka_the_inventor_of/As long as troll...")
    strictEqual(result.image, 'https://i.ytimg.com/vi/oHg5SJYRHA0/hqdefault.jpg')
    strictEqual(result.publisher, 'YouTube')
    assert(result.keywords.length > 0)
  })

})
  
