import http from 'http'

const defaults = {}
export default function build({ isDev = true,  } = defaults) {
  

  return http.createServer((req, res) => {
     res.end('Hello')
  })
  
}
