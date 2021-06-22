require('dotenv').config()
const http = require('http')
// const fs = require('fs')
// const {readFile} = fs.promises
// const path_static = './static/'
// const MIME_TYPES = {
//     html: 'text/html; charset=UTF-8',
//     css: 'text/css',
//     js: 'application/javascript',
//     png: 'image/png',
//     jpg: 'image/jpeg',
//     svg: 'image/svg+xml',
//     mp4: 'video/mp  4'
// }   

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
    // console.dir(obj)
    return obj
}

// const sendStaticFiles = (url, res) => readFile(path_static + url).then(buffer => {
//     const file_type = url.split('.')[1]
//     res.writeHead(200, {'Content-Type': MIME_TYPES[file_type]})
//     return buffer
// })
const server = http.createServer()

server.on('request', async (req, res) => {
    let {url, method} = req
    console.log(`Received response from ${res.socket.remoteAddress}:${res.socket.remotePort}\n url: ${url}`)
    // if (url.split('/')[1] == 'api') {
        const body = parse(await getBody(req))
        const handler = api[url + '/' + method]
        if (!handler){
            res.statusCode = 404
            res.end(`404: Not Found`)
            return
        }
        try {
            let answer = await handler(body, getHeaders(req))
            console.log("Server answer:", answer)
            res.statusMessage = 'ok' 
            res.statusCode = 200
            res.end(JSON.stringify(answer))
        }
        catch (err){
            console.log(err)
            res.statusCode = '500'
            res.end("500: Internal Server Error")
        }
    // } else {
    //    url = url.split('/')[1] ? url : '/index.html'
    //    if(!url.includes('.')) url = url + '.html'
    //    sendStaticFiles(url, res)
    //     .then(data => res.end(data))
    //     .catch(err => {
    //         res.writeHead(404, {'Content-Type': MIME_TYPES.html})
    //         res.end(`<h2>404: Not found file ${url}</h2>`)
    //     })
    // }
})
server.listen(process.env.WEB_PORT)

process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())


