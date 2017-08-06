const _ = require('underscore')
    , assert = require('assert')

class NavItem {
  constructor(site, opts) {
    let route

    if (typeof opts == 'string') {
      route = opts
    }
    else {
      route = opts.route
    }

    let node = route ? site.root.nodeForRoute(route) : undefined

    if (node) {
      this.node = node
      this.title = opts.title || node.title
    }
    else {
      this.title = opts.title
    }

    this.url = route
    this.type = opts.type || 'default'
    this.matchesSubPaths = opts.matchesSubPaths
    this.icon = opts.icon

    if (opts.items) {
      this.items = opts.items.map(itemConf => new NavItem(site, itemConf))
    }

    if (opts.visible instanceof Function) {
      this.visible = opts.visible.bind(this)
    }
  }
  
  visible(req) {
    return true

    if (this.node) {
      return this.node.grantsPermission(req, 'get')
    }
    
    return true
  }
  
  matchesPath(pth) {
    return this.matchesSubPaths ? pth.startsWith(this.url) : pth == this.url
  }
}

module.exports = NavItem
