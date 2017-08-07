global.log = console.log
global.logj = x => console.log(JSON.stringify(x, null, '  '))

const express = require('express')
    , path = require('path')
    , app = express()
    , porksoda = require('../../')
    , Controller = porksoda.Controller

app.locals.title = 'porksoda - main example'
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const publicController = new Controller({
  name: 'public controller',
  mountpoint: '/',
  routes: [
    {
      path: '/',
      name: 'Home',
      endpoints: [
        {
          method: 'get',
          callback: (req, res, next) => res.render('home')
        }
      ]
    },
    {
      path: '/blog',
      name: 'Blog',
      endpoints: [
        {
          method: 'get',
          callback: (req, res, next) => res.render('blog')
        },
        {
          method: 'post',
          callback: (req, res, next) => res.redirect('./blog')
        },
      ]
    }
  ]
})

publicController.applyMiddleware(app)

app.listen(3000)
console.log('Express started on port 3000')
