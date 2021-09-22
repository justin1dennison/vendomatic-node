import { match } from 'path-to-regexp'
import { URL } from 'url'

function defaultNotFound(request, response) {
  response.end('Not Found')
}
function defaultErrorHandler(error, request, response) {
  response.end('Error: ' + error.message)
}

export default class Router {
  constructor({
    notFoundHandler = defaultNotFound,
    errorHandler = defaultErrorHandler,
  } = {}) {
    this.routes = []
    this.notFoundHandler = notFoundHandler
    this.errorHandler = errorHandler
  }

  get(path, handler) {
    this.routes.push(Route.of('GET', path, handler))
  }
  post(path, handler) {
    this.routes.push(Route.of('POST', path, handler))
  }
  put(path, handler) {
    this.routes.push(Route.of('PUT', path, handler))
  }
  del(path, handler) {
    this.routes.push(Route.of('DELETE', path, handler))
  }
  patch(path, handler) {
    this.routes.push(Route.of('PATCH', path, handler))
  }
  handle(request, response) {
    const route = this.routes.find((route) => route.match(request))
    if (!route) return this.notFoundHandler(request, response)
    try {
      return route.handle(request, response)
    } catch (error) {
      this.errorHandler(error, request, response)
    }
  }
}

class Route {
  constructor(method, path, handler) {
    this.method = method
    this.path = path
    this.handler = handler
    this.matcher = match(this.path, { decode: decodeURIComponent })
  }

  static of(method, path, handler) {
    return new Route(method, path, handler)
  }

  match(request) {
    if (request.method !== this.method) return false

    const { pathname } = new URL(request.url, `http://${request.headers.host}`)
    return this.matcher(pathname)
  }

  async handle(request, response) {
    await this._params(request)

    return this.handler(request, response)
  }

  async _params(request) {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`)
    request.params = { ...this.matcher(pathname).params }
  }
}
