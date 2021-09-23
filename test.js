const build = require('./src/app')
const supertest = require('supertest')
const model = require('./src/model')
const { PassThrough } = require('stream')

let app = supertest(build())

beforeEach(() => {
  model.reset()
})

test('can deposit coins', async () => {
  expect.assertions(4)
  let response = await app
    .put('/')
    .send({ coin: 3 })
    .then((response) => response)
  let coins = parseInt(response.headers['x-coins'], 10)
  expect(response.statusCode).toBe(204)
  expect(coins).toBe(3)

  response = await app
    .put('/')
    .send({ coin: 1 })
    .then((response) => response)
  coins = parseInt(response.headers['x-coins'], 10)
  expect(response.statusCode).toBe(204)
  expect(coins).toBe(4)
})

test('can refund coins', async () => {
  await app
    .put('/')
    .send({ coin: 3 })
    .then((response) => response)
  const response = await app.del('/').then((response) => response)
  const coins = parseInt(response.headers['x-coins'], 10)
  expect(response.statusCode).toBe(204)
  expect(coins).toBe(3)
})

test('can report the inventory', async () => {
  const response = await app.get('/inventory').then((response) => response)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual([5, 5, 5])
})

test('can report the inventory of a single item', async () => {
  const response = await app.get('/inventory/1').then((response) => response)
  expect(response.statusCode).toBe(200)
  expect(response.body).toBe(5)
})

test('can make purchase', async () => {
  await app.put('/').send({ coin: 5 })
  const response = await app.put('/inventory/2').then((response) => response)
  const coins = parseInt(response.headers['x-coins'], 10)
  const remaining = parseInt(response.headers['x-inventory-remaining'], 10)
  expect(response.statusCode).toBe(200)
  expect(response.body).toBe(1)
  expect(coins).toBe(3)
  expect(remaining).toBe(4)
})

test('cannot make a purchase without enough money', async () => {
  const response = await app.put('/inventory/1').then((response) => response)
  expect(response.statusCode).toBe(403)
})

test('cannot make a purchase if out of stock', async () => {
  const response = await app.put('/inventory/4').then((response) => response)
  expect(response.statusCode).toBe(404)
})
