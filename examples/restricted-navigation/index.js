global.log = console.log
global.logj = x => console.log(JSON.stringify(x, null, '  '))

const express = require('express')
    , session = require('express-session')
    , path = require('path')
    , app = express()
    , porksoda = require('../../')
    , Controller = porksoda.Controller
    , Site = porksoda.Site
    , Route = porksoda.Route
    , Endpoint = porksoda.Endpoint

app.locals.title = 'porksoda - restricted navigation'
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.enable('view cache');

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'my secret',
}))

const loggedIn = req => req.session.authenticated
    , loggedOut = req => !loggedIn(req)

const frontend = new Site({
  name: 'Root',
  path: '/',
  controllers: [
    {
      name: 'public',
      routes: [
        {
          path: '/',
          name: 'Home',
          endpoints: [
            {
              method: 'get',
              callback: (req, res, next) => res.render('generic')
            }
          ]
        },
        {
          path: '/protected',
          name: 'Protected',
          visible: loggedIn,
          endpoints: [
            {
              method: 'get',
              callback: (req, res, next) => res.render('generic')
            }
          ],
        },
      ]
    },
    {
      name: 'protected',
      routes: [
        {
          path: '/login',
          name: 'Login',
          visible: loggedOut,
          endpoints: [
            {
              method: 'get',
              callback: (req, res, next) => {
                req.session.authenticated = true
                res.redirect('/')
              }
            }
          ],
        },
        {
          path: '/logout',
          name: 'Logout',
          visible: loggedIn,
          endpoints: [
            {
              method: 'get',
              callback: (req, res, next) => {
                req.session.authenticated = false
                res.redirect('/')
              }
            }
          ],
        },
      ]
    }
  ],
})

frontend.applyMiddleware(app)

app.listen(3000)
console.log('Express started on port 3000')
