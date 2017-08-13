const express = require('express')
    , _ = require('underscore')
    , Node = require('./Node')
    , Endpoint = require('./Endpoint')
    , httpVerbs = require('./util').httpVerbs

module.exports = class Route extends Node {
  constructor(opts){
    if (opts.routes)
      throw Error('Subroutes not allowed! Use a controller as parent of this node.')

    super(opts)

    this.path = opts.path

    if (opts.params)
      this.paramsCallback = opts.params

    // add endpoints
    for (const method of httpVerbs) {
      let endpoint = opts[method]
      if (endpoint) {
        if (!(endpoint instanceof Endpoint))
          endpoint = new Endpoint({ method, callback: endpoint })
        
        this.addChild(endpoint)
      }
    }
  }

  applyMiddleware(parent) {
    const route = parent.route(this.path)
    
    route.all((req, res, next) => {
      req.visitedNodes.push(this)
      res.locals.route = this

      if (this.accessible)
        this.accessible(req, res, next)
      else
        next()
    })

    if (this.paramsCallback)
      route.all(this.paramsCallback)

    for (const node of this.children) {
      node.applyMiddleware(route)
    }
  }
}
