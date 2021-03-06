#!/usr/bin/env node

const URL = require('url')
const jsdom = require('jsdom')
const winston = require('winston')
const request = require('request')
const minimist = require('minimist')

const log = winston.createLogger()
const jar = request.jar();
const virtualConsole = new jsdom.VirtualConsole();

function get(url, includeRaw=false) {

  let opts = {
    url: url,
    jar: jar,
    timeout: 10000,
    strictSSL: false,
    headers: {
      "User-Agent": "ushrtn (https://github.com/edsu/metaweb)",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
  }

  let sent = false

  let result = {
    url: url,
    canonical: null,
    status: null,
    content_type: null,
    title: null
  }

  return new Promise(function(resolve, reject) {
    try {
      let req = request(opts)
      req.on('response', (resp) => {
        result.url = resp.request.uri.href
        result.status = resp.statusCode
        result.content_type = resp.headers['content-type']

        // fetch and retrieve html
        
        if (result.content_type && result.content_type.match(/text\/x?html/)) {
          let html = []
          resp.on('data', chunk => html.push(chunk))
          return resp.on('end', () => {
            if (!sent) {
              sent = true
              html = Buffer.concat(html).toString()
              let meta = extractHtmlMetadata(html, result.url)
              result = mergeMetadata(result, meta)
              if (includeRaw) {
                result.raw = meta
              }
              resolve(result)
            }
          })
        } else {
          // TODO: parse metadata from other content types (images, etc?)
          sent = true
          resolve(result)
        }
      })

      return req.on('error', (error) => {
        if (!sent) {
          sent = true
          reject(error)
        }
      })

    } catch (error) {
      if (!sent) {
        sent = true
        reject(error)
      }
    }

  })
}

function extractHtmlMetadata(html, url) {
  let result = {
    link: {},
    meta: {}
  }

  let dom
  try {
    dom = new jsdom.JSDOM(html, {url: url, virtualConsole})
  } catch (e) {
    log.error(`jsdom error ${e}`)
    return result
  }

  let doc = dom.window.document

  const title = doc.querySelector('head title')
  result.title = title ? clean(title.text) : ''

  for (const meta of doc.querySelectorAll('meta')) {
    const name = meta.attributes.name || meta.attributes.property
    if (name) {
      if (result.meta[name.value]) {
        result.meta[name.value].push(clean(meta.content))
      } else {
        result.meta[name.value] = [clean(meta.content)]
      }
    }
  }
  
  for (const link of doc.querySelectorAll('link')) {
    const rel = link.attributes.rel
    if (rel) {
      if (result.link[rel.value]) {
        result.link[rel.value].push(link.href)
      } else {
        try {
          result.link[rel.value] = [new URL.URL(link.href, url).href]
        } catch (e) {
          log.warn(`ignoring invalid <link> href ${link.href}`, e)
        } 
      }
    }
  }

  return result
}

function mergeMetadata(result, source) {
  normalized = {
    title: source.title || pick(source.meta, ['og:title', 'twitter:title']),
    description: pick(source.meta, ['description', 'og:description', 'twitter:description']),
    image: pick(source.meta, ['twitter:image', 'og:image']),
    canonical: pick(source.link, ['canonical']),
    publisher: pick(source.meta, ['og:site_name']),
    keywords: pick(source.meta, ['keywords'], split=true)
  }
  return {...result, ...normalized}
}

function pick(source, names, split=false) {
  for (name of names) {
    if (source[name] && source[name][0] && split) {
      return source[name][0].split(/ *, */)
    } else if (source[name] && source[name][0]) {
      return source[name][0]
    }
  }
  return null
}

function clean(s) {
  if (s) {
    return s.replace(/\n/g, ' ').replace(/ +/g, ' ').trim()
  } else {
    return null
  }
}

async function main() {
  const args = minimist(process.argv.slice(2))

  // configure logging
  log.configure({
    level: 'info',
    transports: [
      new (winston.transports.File)({
        filename: './metaweb.log',
        prepend: true,
        level: 'info'
      })
    ]
  })

  if (args._.length != 1) {
    console.error('usage: metaweb [--includeRaw] <url>')
  } else {
    try {
      const result = await get(args._[0], includeRaw=args.includeRaw)
      console.log(JSON.stringify(result, null, 2))
    } catch (error) {
      console.error(error.message)
    }
  }
}

if (require.main === module) {
  main()
}

exports.get = get
