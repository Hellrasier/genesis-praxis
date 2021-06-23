const fs = require('fs')
const users_data = require('./users_data.json')

module.exports = {
    get: (email) => email ? users_data.find(user => user.email == email) : users_data,
    insert: (data) => new Promise(resolve => {
        users_data.push(data)
        fs.writeFile('./storage/users_data.json', JSON.stringify(users_data), resolve)
    }),
    checkToken: token => users_data.every(user => user.token = token)
}