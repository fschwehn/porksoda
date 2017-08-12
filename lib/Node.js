const _ = require('underscore')
    , _s = require('underscore.string')
    , path = require('path')

let Endpoint

class Node {
  constructor(opts) {
    this.name = opts.name

    if (opts.visible) {
      this.visible = opts.visible
    }
  }

  addChild(node) {
    if (!this.children)
      this.children = [node]
    else
      this.children.push(node)
    
    node.parent = this
  }

  resolvePaths(pathMap) {
    if (!pathMap)
      pathMap = this.pathMap = {}

    if (this.parent) {
      this.url = path.join(this.parent.path, this.path)
    }
    else {
      this.url = this.path || '/'
    }

    if (this.children) {
      for (const child of this.children) {
        child.resolvePaths(pathMap)
      }
    }

    if (!pathMap[this.url])
      pathMap[this.url] = this
  }

  applyMiddleware(parent) {}

  active(req) {
    return req.visitedNodes.indexOf(this) != -1
  }

  activeClass(req) {
    return this.active(req) ? 'active' : null
  }

  visible(req) {
    return this.parent ? this.parent.visible(req) : true
  }
}

module.exports = Node

Endpoint = require('./Endpoint')
