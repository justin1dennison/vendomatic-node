let _products = [5, 5, 5]
let _coins = 0
module.exports = {
  async products() {
    return _products
  },
  async coins() {
    return _coins
  },
  async refund() {
    let ref = _coins
    _coins = 0
    return ref
  },
  async deposit(coins) {
    _coins += coins
  },
  async isAvailable(id) {
    return _products[id] > 0
  },
  async purchase(id) {
    let purchased = 0
    if (!this.isAvailable(id)) return purchased
    purchased += 1
    _products[id] -= 1
    _coins -= 2
    return purchased
  },
  async remaining(id) {
    return _products[id]
  },
  async canAfford() {
    return _coins >= 2
  },
  reset() {
    _coins = 0
    _products = [5, 5, 5]
  },
}
