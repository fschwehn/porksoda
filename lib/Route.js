const express = require('express')
    , _ = require('underscore')
    , Node = require('./Node')
    , Endpoint = require('./Endpoint')
    , routerVerbs = require('./util').routerVerbs

module.exports = class Route extends Node {
  constructor(opts){
    super(opts)

    if (opts.routes && !this.allowsRoutes()) {
      throw Error('Subroutes not allowed! Use a controller as parent of this node.')
    }

    this.path = opts.path

    // add endpoints
    for (const method of this.verbs()) {
      let endpoint = opts[method]
      if (endpoint)
        this.addChild(Endpoint.cast(endpoint, method))
    }

    // middlewares
    this.middlewares.unshift((req, res, next) => {
      req.visitedNodes.push(this)
      res.locals.route = this
      next()
    })

    if (opts.params)
      this.middlewares.push(opts.params)
  }

  allowsRoutes() {
    return false
  }

  verbs() {
    return routerVerbs
  }

  applyMiddleware(parent) {
    const route = parent.route(this.path)
    route.all.apply(route, this.middlewares)

    if (this.children) {
      for (const node of this.children) {
        node.applyMiddleware(route)
      }
    }
  }
}
