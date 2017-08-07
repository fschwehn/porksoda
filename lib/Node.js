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
    node.parent = this
  }

  applyMiddleware(parent) {}

  active(req) {
    return req.passedNodes.indexOf(this) != -1
  }

  activeClass(req) {
    return this.active(req) ? 'active' : null
  }

  url() {
    const parent = this.parent
      , pth = this.path || '/'
      , url = parent ? path.join(parent.url(), pth) : pth
    return url
  }
}

module.exports = Node
