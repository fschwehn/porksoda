const _ = require('underscore')
    , _s = require('underscore.string')
    , path = require('path')

let Endpoint

class Node {
  constructor(opts) {
    this.name = opts.name

    if (opts.visible)
      this.visible = opts.visible

    this.middlewares = []

    if (opts.authentication)
      this.middlewares.push(opts.authentication)

    if (opts.permission) {
      this.permission = opts.permission
      this.middlewares.push((req, res, next) => {
        if (this.accessDenied(req)) {
          const err = Error(`You need the '${this.permission}' permission to access this resource!'`)
          err.status = 403
          return next(err)
        }
        next()
      })
    }
  }

  addChild(node) {
    if (!this.children)
      this.children = [node]
    else
      this.children.push(node)
    
    node.parent = this
  }

  resolvePaths(site) {
    if (this.parent) {
      this.url = path.join(this.parent.url, this.path)
    }
    else {
      this.url = this.path || '/'
    }

    if (this.children) {
      for (const child of this.children) {
        child.resolvePaths(site)
      }
    }
    
    if (!site.pathMap[this.url])
      site.pathMap[this.url] = this
  }

  applyMiddleware(parent) {
    if (this.middlewares.length)
      parent.use.apply(parent, this.middlewares)
  }

  active(req) {
    return req.visitedNodes.indexOf(this) != -1
  }

  activeClass(req) {
    return this.active(req) ? 'active' : null
  }

  visible(req) {
    if (this.accessDenied(req))
      return false
    return this.parent ? this.parent.visible(req) : true
  }

  accessDenied(req) {
    if (this.permission) {
      if (!req.user)
        return true
      const granted = req.user.permissions
      if (!granted.includes(this.permission))
        return true
    }
    return false
  }
}

module.exports = Node

Endpoint = require('./Endpoint')
