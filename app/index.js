// Sensitive intel kept in environment variables defined in .env
require('dotenv').config()
// console.log(process.env)

const express = require('express')
const app = express()
const fs = require('fs')

const bodyParser = require('body-parser') // middleware to parse incoming data

// routes
const testRoute = require('./src/routes/test')

// app.use(bodyParser.urlencoded()) // x-www-form-urlencoded <form> 
app.use(bodyParser.json()) // Content-Type: application-json

// middleware to serve static files (our React bundle)
app.use(express.static('public'))

// middleware to avoid CROSS errors (no package needed)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next() // we need to call next so that our request can be handled by our routes
})

app.use('/api', testRoute)

app.listen(3000, () => {
  console.log('App running on port 3000');
})

// const mysql = require('mysql2')
// const connection = mysql.createConnection({
//   host:               process.env.DB_HOSTNAME,
//   user:               process.env.DB_USER,
//   password:           process.env.DB_PASSWORD,
//   multipleStatements: true  // needed for running SQL scripts
// })

// connection.connect()

// const sql = fs.readFileSync('./src/db/db_setup.sql', 'utf8')

// connection.query(sql, (error) => {
//   if (error) throw error
//   console.log('matcha DB created!')
// })

// connection.end()
