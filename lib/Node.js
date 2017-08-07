const _ = require('underscore')
    , _s = require('underscore.string')
    , path = require('path')

class Node {
  constructor(opts) {
    this.name = opts.name
  }

  addChild(node) {
    if (!this.children)
      this.children = [node]
    else
      this.children.push(node)
  }

  applyMiddleware(parent) {
    
  }
}

module.exports = Node
