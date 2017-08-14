const routerVerbs = ['get', 'post', 'put', 'delete', 'patch']
const controllerVerbs = routerVerbs.concat(['use', 'all'])

module.exports = {
  routerVerbs,
  controllerVerbs
}
