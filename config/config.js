require('dotenv').config()

const MONGOURI = process.env.MONGOURI
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
    MONGOURI,
    JWT_SECRET
}