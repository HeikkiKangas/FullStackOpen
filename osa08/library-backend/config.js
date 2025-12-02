require('dotenv').config()

//const SECRET = process.env.SECRET
const SECRET = 'secret'

const MONGODB_URI = process.env.MONGODB_URI

exports.SECRET = SECRET
exports.MONGODB_URI = MONGODB_URI
