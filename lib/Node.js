const _ = require('underscore')
    , _s = require('underscore.string')
    , path = require('path')

class Node {
  constructor(key, opts) {
    opts = opts || {}

    this.key = key
    this.title = opts.title || _s.titleize(key)

    if (opts.requires)
      this.requires = opts.requires
  }

  arrifyRoute(route) {
    if (typeof route == 'string') {
      route = route.split('/')
      route.shift()
    }
    return route
  }

  insert(route, opts, parentOpts) {
    route = this.arrifyRoute(route)

    const key = route[0]

    if (!this.nodes)
      this.nodes = {}
    
    // only 1 comp - can insert directly
    if (route.length == 1) {
      // @todo: check if node would be replaced
      let requires = opts.requires
      if (parentOpts) {
        requires = _.union(requires, parentOpts.requires)
      }

      let child = new Node(key, opts)
      child.requires = requires
      this.nodes[key] = child
    }
    // multiple comps - optionally create intermediate node
    else {
      let intermediateNode = this.nodes[key]
      if (!intermediateNode) {
        intermediateNode = this.nodes[key] = new Node(key, parentOpts)
      }
      intermediateNode.insert(route.slice(1), opts, intermediateNode)
    }
  }

  /** 
   * always yields a node with fallback on this
   */
  nodeForRoute(route) {
    route = this.arrifyRoute(route)
    const key = route[0]
    const node = this.nodes[key]
    return node ? node.nodeForPathComponents(route.slice(1)) : this
  }

  /** 
   * always yields a node with fallback on this
   */
  nodeForPathComponents(comps) {
    if (!comps.length || !this.nodes) return this;
    const key = comps.shift()
    const node = this.nodes[key]
    return node ? node.nodeForPathComponents(comps) : this
  }

  grantsPermission(req, permission) {
    if (!this.requires) return true;
    
    const session = req.session
    if (!session) return false;
      
    const grantedResources = session.grantedResources
    if (!grantedResources) return false;
    
    for (let requiredResource of this.requires) {
      const grantedPermissions = grantedResources[requiredResource]
      if (!grantedPermissions) return false;
      
      for (let permission of ['*'])
        if (grantedPermissions.indexOf(permission) == -1 && grantedPermissions.indexOf('*') == -1)
          return false;
    }

    return true
  }
}

module.exports = Node
