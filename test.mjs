import build from './src/app.mjs'
import supertest from 'supertest'
import model from './src/model.mjs'

test('can deposit coins', async (done) => {
  const app = supertest(build())
  let response = await app.put('/').send({ coin: 3 })
  let coins = parseInt(response.headers['x-coins'], 10)
  expect(response.statusCode).toBe(204)
  expect(coins).toBe(3)

  response = await app.put('/').send({ coin: 1 })
  coins = parseInt(response.headers['x-coins'], 10)
  expect(response.statusCode).toBe(204)
  expect(coins).toBe(3)
  done()
})

// test('can refund coins', async (t) => {
//   reset()
//   const app = supertest(build())
//   await app.put('/').send({ coin: 3 })
//   const response = await app.del('/')
//   const coins = parseInt(response.headers['x-coins'], 10)
//   t.is(response.statusCode, 204)
//   t.is(coins, 3)
// })

// test('can report the inventory', async (t) => {
//   reset()
//   const app = supertest(build())
//   const response = await app.get('/inventory')
//   t.is(response.statusCode, 200)
//   t.deepEqual(response.body, [5, 5, 5])
// })

// test('can report the inventory of a single item', async (t) => {
//   reset()
//   const app = supertest(build())
//   const response = await app.get('/inventory/1')
//   t.is(response.statusCode, 200)
//   t.deepEqual(response.body, 5)
// })

//test('can make purchase', async (t) => {
//  reset()
//  const app = supertest(build())
//  await app.put('/').send({ coin: 5 })
//  const response = await app.put('/inventory/2')
//  const coins = parseInt(response.headers['x-coins'], 10)
//  const remaining = parseInt(response.headers['x-remaining-inventory'], 10)
//  t.is(response.statusCode, 200)
//  t.is(response.body, 1)
//  t.is(coins, 3)
//  t.is(remaining, 4)
//})

// test('cannot make a purchase without enough money', async (t) => {
//   reset()
//   t.pass()
// })

// test('cannot make a purchase if out of stock', async (t) => {
//   reset()
//   t.pass()
// })
