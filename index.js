require('dotenv').config()
const http = require('http')

const parse = body => {
    if(body){
        return JSON.parse(body)
    }
    return null
   
}

const api = require('./api/api')

const getBody = req => new Promise((resolve) => {
    const buffer = [];
    req.on('data', chunk => {
        buffer.push(chunk)
    }).on('end', async () => {
        const body = buffer.join('')
        resolve(body)
    })
})

const getHeaders = req => {
    const obj = {}
    for (let i = 0; i < req.rawHeaders.length;  i = i+2) {
        obj[req.rawHeaders[i]] = req.rawHeaders[i+1]
    }
    return obj
}

const server = http.createServer()

server.on('request', async (req, res) => {
    let {url, method} = req
    console.log(`Received response from ${res.socket.remoteAddress}:${res.socket.remotePort}\n url: ${url}`)
    const handler = api[url + '/' + method]
    if (!handler){
        res.statusCode = 404
        res.end(`404: Not Found`)
        return
    }
    try {
        const body = parse(await getBody(req))
        let answer = await handler(body, getHeaders(req))
        console.log("Server answer:", answer.body)
        res.statusCode = answer.status
        res.end(JSON.stringify(answer.body))
    }
    catch (err){
        console.log(err)
        res.statusCode = '500'
        res.end("500: Internal Server Error")
    }
})
server.listen(process.env.WEB_PORT)

console.log(`Server listening on port ${process.env.WEB_PORT}`)

process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())


