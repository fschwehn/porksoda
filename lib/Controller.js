const express = require('express')
    , _ = require('underscore')
    , Node = require('./Node')
    , Route = require('./Route')
    , Controller = require('./Controller')

module.exports = class Controller extends Node {
  constructor(opts){
    super(opts)

    this.path = opts.path || '/'

    if (opts.routes) {
      for (let route of opts.routes) {
        if (!(route instanceof Route))
          route = new Route(route)
        this.addChild(route)
      }
    }
    
    if (opts.controllers) {
      for (let controller of opts.controllers) {
        if (!(controller instanceof Controller))
          controller = new Controller(controller)
        this.addChild(controller)
      }
    }
  }

  applyMiddleware(parent) {
    const router = express.Router()
    router.use((req, res, next) => {
      req.visitedNodes.push(this)
      res.locals.controller = this
      next()
    })

    for (const node of this.children) {
      node.applyMiddleware(router)
    }

    parent.use(this.path, router)
  }
}
