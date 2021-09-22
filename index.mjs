import http from 'http'
import app from './src/app.mjs'

const PORT = process.env.port || 5000
const server = app()

server.listen(PORT, () => console.log(`Now listening on port: ${PORT}`))
