import { parse } from 'url'

export default function Router() {
  if (!(this instanceof Router)) {
    return new Router()
  }

  this.routes = []
}

Router.prototype.get = function get(path, handler) {
  this.routes.push(Route('GET', path, handler))
}

Router.prototype.handler = function handler(request, response) {
  const route = this.routes.find((route) => route.shouldHandle(request))
}

function Route(method, path, handler) {
  if (!(this instanceof Route)) {
    return new Route(method, path, handler)
  }

  this.method = method
  this.path = path
  this.handler = handler
}

Route.prototype.shouldHandle = function shouldHandle(request) {
  const requrl = URL
  return request.url === this.path
}
