global.log = console.log
global.logj = x => console.log(JSON.stringify(x, null, '  '))

const express = require('express')
    , path = require('path')
    , app = express()
    , porksoda = require('../../')
    , Controller = porksoda.Controller
    , Site = porksoda.Site
    , Route = porksoda.Route
    , Endpoint = porksoda.Endpoint

app.locals.title = 'porksoda - main example'
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.enable('view cache');

const blogPosts = [
  { title: 'A damn good story', text: 'Mauris lobortis odio ut libero ultrices euismod. Pellentesque auctor bibendum dui, tincidunt.' },
  { title: 'You gonna know it...', text: 'Donec auctor maximus elementum. Phasellus faucibus tincidunt aliquam. Nunc consectetur blandit orci nec lobortis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere.' },
  { title: 'About the dark side', text: 'Phasellus varius mi at aliquet luctus. Praesent a aliquam ex. Integer.' },
]

const blogPostGetEndpoint = new Endpoint({
  method: 'get',
  callback: (req, res, next) => {
    res.render('blog', {
      posts: blogPosts,
      selectedPost: blogPosts[req.params.post]
    })
  }
})

const blogPostRoute = new Route({
  path: '/:post',
  name: 'Post',
  get: blogPostGetEndpoint
})

const blogController = new Controller({
  path: '/blog',
  name: 'Blog',
  routes: [
    {
      path: '/',
      name: 'Blog',
      get: (req, res, next) => res.render('blog', { posts: blogPosts }),
      post: (req, res, next) => res.redirect('./blog')
    },
    blogPostRoute,
  ]
})

const frontend = new Site(app, {
  name: 'Root',
  path: '/',
  routes: [
    {
      path: '/',
      name: 'Home',
      get: (req, res, next) => res.render('home')
    },
  ],
  controllers: [
    blogController,
    {
      path: '/news',
      name: 'News',
      routes: [
        {
          path: '/',
          get: (req, res) => res.redirect(path.join(req.originalUrl, 'breaking'))
        },
        {
          path: '/breaking',
          name: 'Breaking News',
          get: (req, res, next) => res.render('news')
        },
        {
          path: '/politics',
          name: 'Politics',
          get: (req, res, next) => res.render('news')
        },
        {
          path: '/technology',
          name: 'Technology',
          get: (req, res, next) => res.render('news')
        },
      ]
    }
  ]
})

app.listen(3000)
console.log('Express started on port 3000')
