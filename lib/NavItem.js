const Node = require('./Node')
    , path = require('path')

module.exports = class NavItem extends Node {
  constructor(opts) {
    if (typeof opts === 'string')
      opts = { path: opts }
    
    super(opts)

    this.path = opts.path
    this.type = opts.type || 'default'
    this.icon = opts.icon

    const items = opts.items
    if (items) {
      for (const item of items) {
        this.addChild(new NavItem(item))
      }
    }
  }

  populateNodes(pathMap) {
    let pth = this.path
    if (pth) {
      if (pth.startsWith('./'))
        pth = path.join(this.parent.path, pth.substr(2))
      
      const node = this.node = pathMap[pth]
      
      if (node) {
        this.name = node.name
        this.url = pth
      }
      else {
        this.name = '???'
      }
    }

    if (this.children) {
      for (const child of this.children) {
        child.populateNodes(pathMap)
      }
    }
  }

  active(req) {
    return this.node ? this.node.active(req) : false
  }

  activeClass(req) {
    return this.active(req) ? 'active' : null
  }

  visible(req) {
    return this.node ? this.node.visible(req) : true
  }
}
