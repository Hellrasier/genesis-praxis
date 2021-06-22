const Crypto  = require('crypto')

module.exports = {
    generateToken: () => Crypto.randomBytes(16).toString("hex"),

    hashPassword: (password) => new Promise(resolve => {
        const salt = Crypto.randomBytes(16).toString("hex")
        Crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        })
    }),

    verifyPassword: (password, hash) => new Promise(resolve => {
        const [salt, key] = hash.split(":")
        Crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString('hex'))
        });
    })
}