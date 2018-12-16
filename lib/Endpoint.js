const express = require('express')
    , Node = require('./Node')

module.exports = class Endpoint extends Node {
  constructor(opts){
    super(opts)
    
    this.method = opts.method
    this.name = this.method.toUpperCase()

    if (opts.callback) {
      this.middlewares.push(opts.callback)
    }
    else if (opts.middlewares) {
      this.middlewares = this.middlewares.concat(opts.middlewares)
    }
  }

  static cast(endpoint, method) {
    if (endpoint instanceof Endpoint)
      return endpoint
    if (endpoint instanceof Function)
      return new Endpoint({ method, callback: endpoint })
    if (endpoint instanceof Array)
      return new Endpoint({ method, middlewares: endpoint })
    if (endpoint instanceof Object)
      return new Endpoint(Object.assign({ method }, endpoint))
    
    throw(Error('Unsupported type for endpoint configuration!'))
  }

  applyMiddleware(parent, path) {
    let args = this.middlewares
    if (path) {
      args = args.slice()
      args.unshift(path)
    }
    parent[this.method].apply(parent, args)
  }

  resolvePaths(site) {
    site.pathMap[this.parent.url] = this.parent
  }
}
