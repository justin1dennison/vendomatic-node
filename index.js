const http = require('http')
const app = require('./src/app')

const PORT = process.env.port || 5000
const server = app()

server.listen(PORT, () => console.log(`Now listening on port: ${PORT}`))
