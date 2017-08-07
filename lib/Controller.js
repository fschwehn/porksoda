const express = require('express')
    , _ = require('underscore')
    , Node = require('./Node')
    , Route = require('./Route')

module.exports = class Controller extends Node {
  constructor(opts){
    super(opts)

    this.mountpoint = opts.mountpoint || '/'

    for (const routeOpts of opts.routes) {
      const route = new Route(routeOpts)
      this.addChild(route)
    }
  }

  applyMiddleware(parent) {
    const router = express.Router()
    router.use((req, res, next) => {
      res.locals.controller = this
      next()
    })

    for (const node of this.children) {
      node.applyMiddleware(router)
    }

    parent.use(this.mountpoint, router)
  }
}
