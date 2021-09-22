import http from 'http'
import { buffer } from 'stream/consumers'
import Router from './router.mjs'

export default function build({ isDev = true } = {}) {
  const router = new Router()

  router.put('/', (request, response) => {
    response.end('works')
  })

  router.del('/', (request, response) => {
    console.log({ request })
  })

  router.get('/inventory', (request, response) => {
    console.log({ request })
    response.end('inventory')
  })

  router.get(
    '/inventory/:id',
    withMiddleware([])((request, response) => {
      console.log({ request })
      response.end(request.url)
    })
  )

  return http.createServer(async (request, response) => {
    await _body(request)
    await _querystring(request)
    router.handle(request, response)
  })
}

async function _body(request) {
  const buffers = []
  for await (const chunk of req) {
    buffers.push(chunk)
  }
  request.body = JSON.parse(Buffer.concat(buffers).toString())
}
async function _querystring(request) {
  const { searchParams } = new URL(
    request.url,
    `http://${request.headers.host}`
  )
  request.query = { ...searchParams }
}
