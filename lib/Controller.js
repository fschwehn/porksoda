const express = require('express')
    , _ = require('underscore')
    , Node = require('./Node')
    , Route = require('./Route')
    , Controller = require('./Controller')
    , NavItem = require('./NavItem')
    , Endpoint = require('./Endpoint')
    , controllerVerbs = require('./util').controllerVerbs

module.exports = class Controller extends Route {
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

    const navOpts = opts.navigations

    if (opts.navigations) {
      const navigations = this.navigations = {}

      for (const name in navOpts) {
        this.navigations[name] = new NavItem(navOpts[name], this)
      }
    }

    // middlewares
    this.middlewares.unshift((req, res, next) => {
      res.locals.controller = this
      next()
    })
  }

  allowsRoutes() {
    return true
  }

  verbs() {
    return controllerVerbs
  }

  resolvePaths(site) {
    super.resolvePaths(site)

    if (this.navigations) {
      for (const name in this.navigations) {
        this.navigations[name].populateNodes(site.pathMap)
      }
    }
  }

  applyMiddleware(parent) {
    const router = express.Router()
    router.use.apply(router, this.middlewares)
    parent.use(this.path, router)
    
    if (this.children) {
      for (const node of this.children) {
        if (node instanceof Endpoint)
          node.applyMiddleware(router, '/')
        else
          node.applyMiddleware(router)
      }
    }
  }
}
