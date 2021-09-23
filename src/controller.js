const model = require('./model')
const { sendJSON } = require('./helpers')

module.exports = {
  depositCoins,
  refundCoins,
  getInventory,
  getItemFromInventory,
  dispenseItem,
}

async function depositCoins(request, response) {
  const { coin } = request.body
  await model.deposit(coin)
  const reply = sendJSON(null, 204, { 'X-Coins': await model.coins() })
  return reply(response)
}

async function refundCoins(request, response) {
  const reply = sendJSON(null, 204, { 'X-Coins': await model.refund() })
  return reply(response)
}

async function getInventory(request, response) {
  const products = await model.products()
  const reply = sendJSON(products, 200)
  return reply(response)
}

async function getItemFromInventory(request, response) {
  let { id } = request.params
  id = parseInt(id, 10)
  const stock = await model.remaining(id)
  const reply = sendJSON(stock, 200)
  return reply(response)
}

async function dispenseItem(request, response) {
  let { id } = request.params
  id = parseInt(id, 10)
  if (!(await model.isAvailable(id))) {
    const reply = sendJSON('', 404, { 'X-Coins': await model.coins() })
    return reply(response)
  }
  if (!(await model.canAfford())) {
    const reply = sendJSON('', 403, { 'X-Coins': await model.coins() })
    return reply(response)
  }
  const products = await model.purchase(id)
  const reply = sendJSON(products, 200, {
    'X-Coins': await model.refund(),
    'X-Inventory-Remaining': await model.remaining(id),
  })
  return reply(response)
}
