const storage = require('../storage/storage.js')
const Security = require('./security');
const cryptoCurrencies = require('./cryproCurrencies')


const emailAlreadyExist = email => storage.get().length != 0 && storage.get().every(user => user.email == email)

const api = {
    '/user/create/POST': async ({email, password}) => {
        if(!(email && password)) {
            return `Error, your E-mail or password field is empty`
        }
        if(emailAlreadyExist(email)){
            return `Error, user with this E-mail adress already exists`
        }
        const hashed_password = await Security.hashPassword(password)
        const token = await Security.generateToken()
        await storage.insert({
            email: email,
            password: hashed_password,
            token: token
        })
        return `Created user with E-mail: ${email}`
    },

    '/user/login/POST': async ({email, password}) => {
        if(!(email && password)) {
            return `Error, your E-mail or password field is empty`
        }
        if(!emailAlreadyExist(email)){
            return `Error, user with this email does not exist`
        }
        const user = storage.get(email)
        if(!await Security.verifyPassword(password, user.password)){
            return `Error, password is invalid`
        }
        return user.token
    },

    '/btcRate/GET': async () => {
        const rate = JSON.parse(await cryptoCurrencies.getRate('BTC', 'UAH'))
        return {
            cryptoCurrency: rate.asset_id_base,
            rate: rate.rate + ' UAH'
        }
    }
}

module.exports = api