const express = require('express')
    , _ = require('underscore')
    , Node = require('./Node')
    , Endpoint = require('./Endpoint')

module.exports = class Route extends Node {
  constructor(opts){
    super(opts)

    this.path = opts.path

    for (const endpointOpts of opts.endpoints) {
      const endpoint = new Endpoint(endpointOpts)
      this.addChild(endpoint)
    }
  }

  applyMiddleware(parent) {
    const route = parent.route(this.path)
    
    route.all((req, res, next) => {
      req.passedNodes.push(this)
      res.locals.route = this
      next()
    })

    for (const node of this.children) {
      node.applyMiddleware(route)
    }
  }
}
