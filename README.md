# metaweb

metaweb will extract metadata from web pages. It attempts to extract common
metadata from standard HTML, Twitter Cards and Facebook's Open Graph Protocol. 

## Install

npm install metaweb

## Command Line

When you install metaweb you will get a command line program:

```
% metaweb http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/
{
  "url": "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/",
  "canonical": "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/",
  "status": 200,
  "content_type": "text/html",
  "title": "NSA slides explain the PRISM data-collection program - The Washington Post",
  "description": "Through a Top-Secret program authorized by federal judges working under the Foreign Intelligence Surveillance Act (FISA), the U.S. intelligence community can gain access to the servers of nine internet companies for a wide range of digital data. Documents describing the previously undisclosed program, obtained by The Washington Post, show the breadth of U.S. electronic surveillance capabilities.",
  "image": "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/images/upstream-promo-296.jpg"
}
```

Use the `--includeRaw` parameter to include all the ran `meta` and `link` 
content.

```
metaweb.js http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/ --includeRaw
{
  "url": "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/",
  "canonical": "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/",
  "status": 200,
  "content_type": "text/html",
  "title": "NSA slides explain the PRISM data-collection program - The Washington Post",
  "description": "Through a Top-Secret program authorized by federal judges working under the Foreign Intelligence Surveillance Act (FISA), the U.S. intelligence community can gain access to the servers of nine internet companies for a wide range of digital data. Documents describing the previously undisclosed program, obtained by The Washington Post, show the breadth of U.S. electronic surveillance capabilities.",
  "image": "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/images/upstream-promo-296.jpg",
  "raw": {
    "link": {
      "canonical": [
        "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/"
      ],
      "shorturl": [
        "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/"
      ],
      "stylesheet": [
        "http://css.wpdigital.net/wpost/css/combo?context=eidos&c=true&m=true&r=/2.0.0/reset.css&r=/2.0.0/structure.css&r=/2.0.0/header.css&r=/2.0.0/footer.css&r=/2.0.0/right-rail.css&r=/2.0.0/rules.css&r=/2.0.0/forms.css&r=/2.0.0/base.css&r=/2.0.0/flipper.css&r=/2.0.0/modules.css&r=/2.0.0/wsodEWA.css&r=/2.0.0/ads.css&r=/2.0.0/fonts/font_FranklinITCProBold.css",
        "http://css.wpdigital.net/wp-srv/graphics/css/pretty-comments.css",
        "http://css.wpdigital.net/wp-srv/graphics/css/staticbase-2.0.css",
        "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/css/prism.css"
      ]
    },
    "meta": {
      "twitter:title": [
        "NSA slides explain the PRISM data-collection program"
      ],
      "description": [
        "Through a Top-Secret program authorized by federal judges working under the Foreign Intelligence Surveillance Act (FISA), the U.S. intelligence community can gain access to the servers of nine internet companies for a wide range of digital data. Documents describing the previously undisclosed program, obtained by The Washington Post, show the breadth of U.S. electronic surveillance capabilities."
      ],
      "twitter:description": [
        "Through a Top-Secret program authorized by federal judges working under the Foreign Intelligence Surveillance Act (FISA), the U.S. intelligence community can gain access to the servers of nine internet companies for a wide range of digital data. Documents describing the previously undisclosed program, obtained by The Washington Post, show the breadth of U.S. electronic surveillance capabilities."
      ],
      "keywords": [
        "nsa, security, privacy, government data collection, nsa data collection, nsa prism program, prism data collection, prism program"
      ],
      "twitter:url": [
        "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/"
      ],
      "og:image": [
        "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/images/upstream-promo-296.jpg"
      ],
      "twitter:image": [
        "http://www.washingtonpost.com/wp-srv/special/politics/prism-collection-documents/images/upstream-promo-296.jpg"
      ],
      "twitter:site": [
        "@postgraphics"
      ],
      "twitter:card": [
        "summary"
      ],
      "fb:app_id": [
        "41245586762"
      ],
      "og:site_name": [
        "The Washington Post"
      ]
    },
    "title": "NSA slides explain the PRISM data-collection program - The Washington Post"
  }
}
```

## From JavaScript

Usually you will probably want to use metaweb as a library in your own 
JavaScript applications:

```javascript
metaweb = require('metaweb')

metadata = metaweb.get(url).then((metadata) => {
	// do something with the metadata
})
```

If you would like to also get the raw `link` and `meta` content use the 
`includeRaw` parameter:

```javascript
metaweb.get(url, includeRaw)
```
