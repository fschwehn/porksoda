const express = require('express')
    , Controller = require('./Controller')

module.exports = class Site extends Controller {
  applyMiddleware(parent) {
    parent.use((req, res, next) => {
      req.passedNodes = []
      res.locals.req = req
      res.locals.root = this
      next()
    })
    
    super.applyMiddleware(parent)
  }
}
