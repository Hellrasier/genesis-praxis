const fs = require('fs')
const users_data = require('./users_data.json')

module.exports = {
    get: (email) => email ? users_data.find(user => user.email == email) : users_data,  
    // get with parameter "email" returns user with this email, get without parameters returns all users
    
    insert: (data) => new Promise(resolve => {
        users_data.push(data)
        fs.writeFile('./storage/users_data.json', JSON.stringify(users_data), resolve)
    }),


    checkToken: token => users_data.every(user => user.token == token)
    // this function returns true if token exists if users_data
}