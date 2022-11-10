const express = require('express')
const app = express()
const path = require('path')
const dayjs = require('dayjs')
const fs = require('fs')

// Add a Node HTTP server so that we can also use it with socket.io
const http = require('http')
const httpServer = http.createServer(app)

// const https = require('https')
// const httpsServer = https.createServer({
//   key: fs.readFileSync(path.resolve(__dirname, './ssl/ssl-cert-snakeoil.key')),
//   cert: fs.readFileSync(path.resolve(__dirname, './ssl/ssl-cert-snakeoil.pem'))
// }, app)

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

/*
// Another way of wiring up socket.io to the HTTP server:
const { Server } = require('socket.io')
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})
*/

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
const notifsRoutes = require('./src/routes/notifs')
const viewsRoutes = require('./src/routes/views')
const chatsRoutes = require('./src/routes/chats')
const blocksRoutes = require('./src/routes/blocks')

app.use('/api', accountsRoutes) // create/update Accounts (Signup, new email/password)
app.use('/api', loginsRoutes)   // logging in and out
app.use('/api', profilesRoutes) // check own and other users profiles
app.use('/api', settingsRoutes) // create/update OWN Profile
app.use('/api', confirmRoutes)  // for confirming account
app.use('/api', refreshRoutes)  // for silently refreshing tokens
app.use('/api', resetRoutes)    // for resetting passwords
app.use('/api', likesRoutes)    // for likes/unlikes
app.use('/api', notifsRoutes)   // for notifications
app.use('/api', viewsRoutes)    // for views
app.use('/api', chatsRoutes)    // for chats
app.use('/api', blocksRoutes)   // for blocking users

// Model to set the 'online' state.
const AccountModel = require('./src/models/Account')

// To serve the React build
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* In order to set the 'login' state properly, we need to maintain an 
  array of { userId, socketId } objects. At log out, we need to use 
  it to get the userId from the socketId (available at disconnect). */
let users = []

const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) &&
  users.push({ userId, socketId })
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
}

// The chat
io.on('connection', socket => {
  // console.log(`user connected (${socket.id})`) // testing

  // Send a 'connected' event when the connection is available.
  io.emit('connected', socket.id)

  // When a user sends a 'msg' event to the socket...
  socket.on('msg', data => {
    // console.log(data.message, data.room, data.socketId) // testing
    // ... send the event (and 'msg' content) back to the proper room.
    socket.to(data.room).emit('msg', {message: data.message, own: false})
  })

  // Create a room based on the 'create-room' event sent from client
  socket.on('join-room', num => {
    // Join the user to the room
    socket.join(num)
    // console.log(`request to join room: ${num}`) // testing

    // Set the user 'login' state to 1, in DB.
    AccountModel.setOnline({ uid: num })

    // Store the socket/room pair in the 'users' array.
    addUser(num, socket.id)

    // Notify the users that she's joined a room (named after her uid).
    socket.emit('room-joined', num) // notify the user the room is done

    // console.log(`Rooms/users after online: ${JSON.stringify(users)}`)
  })
  
  // When a user disconnects from the socket, logs it too.
  socket.on('disconnect', () => {
    // Find socket/room pair in the 'users' array.
    const user = users.find(u => u.socketId === socket.id)

    // Set the user 'login' state to 0, in DB (using the room id, aka user id).
    if (user) {
      AccountModel.setOffline({
        uid:        user.userId,
        last_seen:  dayjs().valueOf()
      })
    }
    
    // Remove the socket/room pair in the 'users' array.
    removeUser(socket.id)

    // console.log(`Rooms/users after not online: ${JSON.stringify(users)}`)
  })
})

httpServer.listen(3000, () => {
  console.log('App running on port 3000');
})
// httpsServer.listen(3000, () => {
//   console.log('App running on port 3000');
// })

exports.io = io