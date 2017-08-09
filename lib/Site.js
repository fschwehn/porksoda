const express = require('express')
    , Controller = require('./Controller')

module.exports = class Site extends Controller {
  applyMiddleware(parent) {
    parent.use((req, res, next) => {
      req.visitedNodes = []
      res.locals.req = req
      res.locals.site = this
      next()
    })
    
    super.applyMiddleware(parent)
  }
}
