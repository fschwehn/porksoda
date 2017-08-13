const express = require('express')
    , _ = require('underscore')
    , Node = require('./Node')
    , Route = require('./Route')
    , Controller = require('./Controller')
    , NavItem = require('./NavItem')
    , Endpoint = require('./Endpoint')
    , httpVerbs = require('./util').httpVerbs

module.exports = class Controller extends Node {
  constructor(opts){
    super(opts)

    this.path = opts.path || '/'

    for (const method of httpVerbs) {
      let endpoint = opts[method]
      if (endpoint) {
        if (!(endpoint instanceof Endpoint))
          endpoint = new Endpoint({ method, callback: endpoint })
        
        this.addChild(endpoint)
      }
    }

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
  }

  resolvePaths(pathMap) {
    super.resolvePaths(pathMap)

    if (!pathMap)
      pathMap = this.pathMap

    if (this.navigations) {
      for (const name in this.navigations) {
        this.navigations[name].populateNodes(pathMap)
      }
    }
  }

  applyMiddleware(parent) {
    const router = express.Router()

    router.use((req, res, next) => {
      req.visitedNodes.push(this)
      res.locals.controller = this
      res.locals.route = this
      next()
    })
    
    super.applyMiddleware(parent)

    if (this.children) {
      for (const node of this.children) {
        if (node instanceof Endpoint)
          node.applyMiddleware(router, '/')
        else
          node.applyMiddleware(router)
      }
    }

    parent.use(this.path, router)
  }
}
