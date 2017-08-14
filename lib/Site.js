const express = require('express')
    , Controller = require('./Controller')

module.exports = class Site extends Controller {
  constructor(app, opts) {
    super(opts)

    this.permissions = opts.permissions
    this.pathMap = {}

    this.resolvePaths(this)

    this.middlewares.unshift((req, res, next) => {
      req.visitedNodes = []
      res.locals.req = req
      res.locals.site = this
      next()
    })
    
    this.applyMiddleware(app)
  }
}
