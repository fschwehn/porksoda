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

const genericEndpoints = [{
  method: 'get',
  callback: (req, res, next) => res.render('layout')
}]

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
          endpoints: genericEndpoints
        },
        {
          path: '/around/thecorner',
          name: 'The Corner',
          endpoints: genericEndpoints
        },
      ]
    },
    {
      name: 'About',
      path: '/about',
      routes: [
        {
          path: '/',
          name: 'About',
          endpoints: genericEndpoints
        },
        {
          path: '/you',
          name: 'We know all about you',
          endpoints: genericEndpoints
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
          endpoints: genericEndpoints
        },
        {
          path: '/sports',
          name: 'Sports',
          endpoints: genericEndpoints
        },
      ]
    },
  ],
  navigations: {
    main: {
      items: [
        { path: '/' },
        { path: '/about' },
        {
          path: '/news',
          items: [
            { path: './politics' },
            { path: './sports' },
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
            {
              name: 'atc',
              path: '/around/thecorner',
            },
            {
              name: 'ab',
              path: '/about/you',
            },
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
