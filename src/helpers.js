const withMiddleware =
  (...fns) =>
  (handler) => {
    return (request, response) => {
      for (let fn of fns) {
        fn(request, response)
      }
      return handler(request, response)
    }
  }

module.exports = { withMiddleware }
