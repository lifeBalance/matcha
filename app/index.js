const express = require('express')
const app = express()
const path = require('path')

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
const accountsRoutes = require('./src/routes/accounts')
const loginsRoutes = require('./src/routes/logins')
const profilesRoutes = require('./src/routes/profiles')
const settingsRoutes = require('./src/routes/settings')
const confirmRoutes = require('./src/routes/confirm')
const refreshRoutes = require('./src/routes/refresh')

const testsRoutes = require('./src/routes/tests')

app.use('/api', accountsRoutes)   // create/update Accounts (Signup, new email/password)
app.use('/api', loginsRoutes)     // logging in and out
app.use('/api', profilesRoutes)   // check own and other users profiles
app.use('/api', settingsRoutes)   // create/update OWN Profile
app.use('/api', confirmRoutes)    // for confirming account
app.use('/api', refreshRoutes)    // for silently refreshing tokens

app.use('/api', testsRoutes) // testing stuff

// To serve the React build
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('App running on port 3000');
})
