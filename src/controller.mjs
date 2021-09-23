import model from './model.mjs'

const defaultHeaders = {
  'Content-Type': 'application/json',
}

export async function depositCoins(request, response) {
  const { coin } = request.body
  await model.deposit(coin)
  response
    .writeHead(204, { ...defaultHeaders, 'X-Coins': await model.coins() })
    .end()
}

export async function refundCoins(request, response) {
  console.log(await model.coins())
  return response
    .writeHead(204, { ...defaultHeaders, 'X-Coins': await model.refund() })
    .end()
}

export async function getInventory(request, response) {
  return response
    .writeHead(200, { ...defaultHeaders })
    .end(await model.products())
}

export async function getItemFromInventory(request, response) {
  let { id } = request.params
  id = parseInt(id, 10)
  return response
    .writeHead(200, { ...defaultHeaders })
    .end(await model.remaining(id))
}

export async function dispenseItem(request, response) {
  let { id } = request.params
  id = parseInt(id, 10)
  if (!(await model.isAvailable(id)))
    return response
      .writeHead(404, { ...defaultHeaders, 'X-Coins': await model.coins() })
      .end()
  if (!(await model.canAfford()))
    return response
      .writeHead(403, { ...defaultHeaders, 'X-Coins': await model.coins() })
      .end()
  const qty = await model.purchase(id)
  return response
    .writeHead(200, {
      ...defaultHeaders,
      'X-Coins': await model.refund(),
      'X-Inventory-Remaining': await model.remaining(id),
    })
    .end({ qty })
}
