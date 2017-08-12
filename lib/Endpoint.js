const express = require('express')
    , _ = require('underscore')
    , Node = require('./Node')

module.exports = class Endpoint extends Node {
  constructor(opts){
    super(opts)

    this.method = opts.method
    this.name = this.method.toUpperCase()
    this.callback = opts.callback
  }

  applyMiddleware(parent, path) {
    if (path)
      parent[this.method](path, this.callback)
    else
      parent[this.method](this.callback)
  }

  resolvePaths(pathMap) {
    pathMap[this.parent.url] = this.parent
  }
}
