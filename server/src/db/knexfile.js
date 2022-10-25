const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

module.exports = {
  client: 'mysql2',
  connection:
  {
    host:     process.env.DB_HOSTNAME,
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  seeds: { directory: './seeds' }
}

