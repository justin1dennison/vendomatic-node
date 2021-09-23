function withMiddleware(...fns) {
  return (handler) => (request, response) => {
    for (let fn of fns) {
      fn(request, response)
    }
    return handler(request, response)
  }
}

function sendJSON(data, status = 200, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }
  headers = { ...defaultHeaders, ...headers }
  return (response) => {
    Object.entries(headers).forEach(([key, val]) =>
      response.setHeader(key, val)
    )
    response.statusCode = status
    response.end(JSON.stringify(data))
  }
}
module.exports = { withMiddleware, sendJSON }
