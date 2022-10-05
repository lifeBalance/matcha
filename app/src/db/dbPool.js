const mysql = require('mysql2')

// Sensitive intel kept in environment variables defined in .env
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
// console.log(process.env)  // testing

const pool = mysql.createPool({
  host:       process.env.DB_HOSTNAME,
  database:   process.env.DB_NAME,
  user:       process.env.DB_USER,
  password:   process.env.DB_PASSWORD
})

module.exports = pool.promise()
// const connection = mysql.createConnection({
//   host:               process.env.DB_HOSTNAME,
//   user:               process.env.DB_USER,
//   password:           process.env.DB_PASSWORD,
// })

// connection.connect()

// connection.query(sql, (error) => {
//   if (error) throw error
//   console.log('matcha DB created!')
// })

// connection.end()
