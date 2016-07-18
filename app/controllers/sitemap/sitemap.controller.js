var request = require('request');
var cheerio = require('cheerio');
var xml = require('xml');

exports.list = function (req, res) {
  var sitemapUrl = req.query.url,
      sitemap = {},
      noRequests = 0,
      limit = 50,
      alternates = {},
      canonical = '';

  function sendXmlResponse() {
    var xmlBody = [{
      'urlset': [
        {
          '_attr': {
            'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1'
          }
        }]
    }];

    for (var link in sitemap) {
      var siteMapItem = [
        {'loc': link}
      ];

      for (var asset in sitemap[link].assets) {
        siteMapItem.push({'image:image': [{'image:loc': sitemap[link].assets[asset]}]});
      }

      xmlBody[0].urlset.push({
        'url': siteMapItem
      })
    }

    res.set('Content-Type', 'text/xml');
    res.send(xml(xmlBody, true));
  }

  function requestNextLink() {
    for (var link in sitemap) {
      if (sitemap[link].visited !== true) {
        sitemap[link].visited = true;

        getSitemap(link);

        break;
      }
    }

    if (!request) {
      sendXmlResponse();
    }
  }

  function getLinks(tags, canonical, alt) {
    for (var i = 0; i < tags.length; i += 1) {
      var link = tags[i].attribs.href;

      if (link && link.indexOf('/cdn-cgi') === -1 && link.indexOf('#') !== 0 && !alt[sitemapUrl + link] && link.indexOf('http') === -1) {
        link = canonical + link;

        if (!sitemap[link]) {
          sitemap[link] = {};
        }
      }
    }
  }

  function scrapePage(error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body),
          aTags = $('a'),
          alternatesDom = $('link[rel="alternate"]');

      if (canonical === '') {
        canonical = $('link[rel="canonical"]')[0].attribs.href.slice(0, -1);
      }

      for (var a = 0; a < alternatesDom.length; a += 1) {
        alternates[alternatesDom[a].attribs.href] = true;
      }

      getLinks(aTags, canonical, alternates);

      var images = $('img'),
          assets = [];
      for (var f = 0; f < images.length; f += 1) {
        assets.push(canonical + images[f].attribs.src);
      }

      sitemap[response.request.uri.href] = {};
      sitemap[response.request.uri.href].assets = assets;
      sitemap[response.request.uri.href].visited = true;

      requestNextLink();
    } else {
      requestNextLink();
    }
  }

  function getSitemap(url) {
    noRequests += 1;
    if (noRequests < limit) {
      request({url: url}, scrapePage);
    } else {
      sendXmlResponse();
    }
  }

  getSitemap(sitemapUrl);
};
