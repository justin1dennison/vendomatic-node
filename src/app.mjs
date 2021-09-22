import http from 'http'
import Router from './router.mjs'
import * as ctrl from './controller.mjs'

export default function build({ isDev = true } = {}) {
  const router = new Router()
  router.put('/', ctrl.depositCoins)
  router.del('/', ctrl.refundCoins)
  router.get('/inventory', ctrl.getInventory)
  router.get('/inventory/:id', ctrl.getItemFromInventory)
  router.put('/inventory/:id', ctrl.dispenseItem)
  return http.createServer(async (request, response) => {
    await _body(request)
    await _querystring(request)
    router.handle(request, response)
  })
}

function _body(request) {
  let data = []
  request.on('data', (chunk) => {
    data.push(chunk)
  })

  return new Promise((resolve, reject) => {
    request.on('end', () => {
      const results = Buffer.concat(data).toString()
      if (results) {
        request.body = JSON.parse(results)
      } else {
        request.body = {}
      }
      resolve()
    })
    request.on('error', (err) => reject(err))
  })
}
async function _querystring(request) {
  const { searchParams } = new URL(
    request.url,
    `http://${request.headers.host}`
  )
  request.query = { ...searchParams }
}
