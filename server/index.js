const express = require('express')
const app = express()
const path = require('path')

// Add a Node HTTP server so that we can also use it with socket.io
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

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
const resetRoutes = require('./src/routes/reset')
const likesRoutes = require('./src/routes/likes')

const testsRoutes = require('./src/routes/tests')

app.use('/api', accountsRoutes)   // create/update Accounts (Signup, new email/password)
app.use('/api', loginsRoutes)     // logging in and out
app.use('/api', profilesRoutes)   // check own and other users profiles
app.use('/api', settingsRoutes)   // create/update OWN Profile
app.use('/api', confirmRoutes)    // for confirming account
app.use('/api', refreshRoutes)    // for silently refreshing tokens
app.use('/api', resetRoutes)      // for resetting passwords
app.use('/api', likesRoutes)      // for likes/unlikes

app.use('/api', testsRoutes) // testing stuff

// To serve the React build
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// The chat
io.on('connection', socket => {
  // When a user connects to the socket logs it to the shell.
  console.log(`user connected (${socket.id})`)
  // console.log(socket) // testing

  // Send a 'connected' event when the connection is available.
  io.emit('connected', socket.id)

  // When a user sends a 'msg' event to the socket...
  socket.on('msg', data => {
    console.log(data.message, data.room, data.socketId)
    // ... send the event (and 'msg' content) back to the proper room.
    socket.to(data.room).emit('msg', {message: data.message, own: false})
  })
  socket.on('notify', data => {
    console.log(data.type, data.room, data.content)
    // Send the event (and content) back to the proper room (user).
    socket.to(data.room).emit('notify', data)
  })

  // Create a room based on the 'create-room' event sent from client
  socket.on('join-room', num => {
    console.log(`request to join room: ${num}`) // testing

    socket.join(num)
    console.log(`room ${num} was joined by ${socket.id}`) // testing

    socket.emit('room-joined', num) // notify the user the room is done
  })
  
  // When a user disconnects from the socket, logs it too.
  socket.on('disconnect', socket => {
    console.log(`user disconnected (${socket})`) // testing
    // console.log(socket) // testing
  })
})

server.listen(3000, () => {
  console.log('App running on port 3000');
})
