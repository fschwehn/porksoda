const express = require('express')
    , Node = require('./Node')
    , NavItem = require('./NavItem')
    , path = require('path')
    , _ = require('underscore')
    // , errors = require('common-errors')
    // , HttpStatusError = errors.HttpStatusError

module.exports = class Site {
  constructor(conf, opts) {
    opts = opts || {}

    this.config = conf
    this.name = conf.name
    
    // build tree
    const root = new Node('')

    if (conf.routers) {
      for (const routerConf of conf.routers) {
        const mountPoint = routerConf.mountPoint
        
        for (const route in routerConf.nodes) {
          const fullRoute = path.join(mountPoint, route)
          root.insert(fullRoute, routerConf.nodes[route], routerConf)
        }
      }
    }

    this.root = root
    // logj(this.root)

    // build navigations
    this.navigations = {}

    if (conf.navigations) {
      for (let id in conf.navigations) {
        this.navigations[id] = new NavItem(this, conf.navigations[id])
      }
    }

    // logj(this.navigations)
  }

  // locals middleware
  locals() {
    return (req, res, next) => {
      const locals = res.locals
          , route = req.baseUrl + req.path
          , node = this.root.nodeForRoute(route)

      locals.site = this
      locals.node = node
      locals.path = route
      locals.title = node ? node.title : 'Not Found'
      locals.req = req
      
      next()
    }
  }

  // router middleware
  router(routersPath) {
    const siteRouter = express.Router()
    
  //   // access control
  //   siteRouter.use((req, res, next) => {
  //     const route = req.baseUrl + req.path
  //     const node = this.root.nodeForRoute(route)
      
  //     if (node.requires instanceof Array && node.requires.length) {
  //       const requires = node.requires
  //       if (!req.session || !req.session.grantedResources)
  //           return next(HttpStatusError(401))

  //       for (const resource of requires) {
  //         if (!(req.session.grantedResources[resource]))
  //           return next(HttpStatusError(403))
  //       }
  //     }
  //     next()
  //   })

    // mount routers
    for (const conf of this.config.routers) {
      const router = require(path.join(routersPath, conf.name))
      const mountPoint = conf.mountPoint
      // const node = this.root.nodeForRoute(mountPoint)
      
      siteRouter.use(mountPoint, router)
    }

    return siteRouter
  }
}
