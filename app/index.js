const express = require('express')
const app = express()

/**
**  Middleware
*/
const bodyParser = require('body-parser') // middleware to parse incoming data
const cookieParser = require('cookie-parser')

// middleware to serve static files (our React bundle)
app.use(express.static('public'))
// middleware to access cookies sent in requests
app.use(cookieParser())

// middleware to avoid CROSS errors (no package needed)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next() // we need to call next so that our request can be handled by our routes
})

// app.use(bodyParser.urlencoded()) // x-www-form-urlencoded <form> 
app.use(bodyParser.json()) // Content-Type: application-json

// ⚙️ middleware to catch errors from body-parser (gotta be placed after it)
app.use(function (err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).send({ message: 'bad request' })
  } else next()
})

/**
**  Routes
*/
const usersRoutes = require('./src/routes/users')
const loginsRoutes = require('./src/routes/logins')
const testsRoutes = require('./src/routes/tests')

app.use('/api', usersRoutes)
app.use('/api', loginsRoutes)
app.use('/api', testsRoutes)

app.listen(3000, () => {
  console.log('App running on port 3000');
})
