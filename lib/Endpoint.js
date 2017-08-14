const express = require('express')
    , Node = require('./Node')

module.exports = class Endpoint extends Node {
  constructor(opts){
    super(opts)
    
    this.method = opts.method
    this.name = this.method.toUpperCase()
    this.middlewares.push(opts.callback)
  }

  static cast(endpoint, method) {
    if (endpoint instanceof Endpoint)
      return endpoint
    if (endpoint instanceof Function)
      return new Endpoint({ method, callback: endpoint })
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
