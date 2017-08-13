global.log = console.log
global.logj = x => console.log(JSON.stringify(x, null, '  '))

const express = require('express')
    , path = require('path')
    , app = express()
    , util = require('util')
    , inspectN = (x, d) => log(util.inspect(x, { depth: d }))
    , porksoda = require('../../')
    , Controller = porksoda.Controller
    , Site = porksoda.Site
    , Route = porksoda.Route
    , Endpoint = porksoda.Endpoint

app.locals.title = 'porksoda - navigations'
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.enable('view cache');

const genericEndpoint = (req, res, next) => res.render('layout')

const frontend = new Site({
  name: 'Navigations',
  path: '/',
  controllers: [
    {
      name: 'main',
      routes: [
        {
          path: '/',
          name: 'Home',
          get: genericEndpoint
        },
        {
          path: '/around/thecorner',
          name: 'The Corner',
          get: genericEndpoint
        },
      ]
    },
    {
      name: 'About',
      path: '/about',
      get: genericEndpoint,
      routes: [
        {
          path: '/you',
          name: 'We know all about you',
          get: genericEndpoint
        },
      ]
    },
    {
      name: 'News',
      path: '/news',
      routes: [
        {
          path: '/politics',
          name: 'Politics',
          get: genericEndpoint
        },
        {
          path: '/sports',
          name: 'Sports',
          get: genericEndpoint
        },
      ]
    },
  ],
  navigations: {
    main: {
      items: [
        '/',
        '/about',
        {
          path: '/news',
          items: [
            './politics',
            './sports',
          ]
        }
      ]
    },
    hot: {
      items: [
        {
          path: '/news/sports'
        },
        {
          name: 'for you',
          items: [
            '/around/thecorner',
            '/about/you',
          ]
        }
      ]
    }
  }
})

frontend.resolvePaths()

// log(Object.keys(frontend.pathMap))
// log(frontend.navigations.main)

frontend.applyMiddleware(app)

app.listen(3000)
console.log('Express started on port 3000')
