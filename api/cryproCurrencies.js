require('dotenv').config()
const https = require('https');

module.exports = {
    getRate: (cryptoCurr, priceCurr) => new Promise((resolve, reject) => {
        const options = {
            "method": "GET",
            "hostname": "rest.coinapi.io",
            "path": `/v1/exchangerate/${cryptoCurr}/${priceCurr}`,
            "headers": {'X-CoinAPI-Key': process.env.CRYPTOCURR_TOKEN}
        }
        return https.request(options, resp => {
            const buffer = [];
            resp.on('data', chunk => {
                buffer.push(chunk)
            }).on('end', async () => {
                const body = buffer.join('')
                resolve(body)
            })
        })
        .on('error', e => reject(e))
        .end()
    })
}