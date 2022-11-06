const express = require('express')

// Instantiate a Router
const router = express.Router()

const chatsController = require('../controllers/chats')

// Middlewares
const { authorize } = require('../middlewares/authorize')

// GET => /api/chats (for getting list of chats/matches)
router.get('/chats', authorize, chatsController.getChats)

// GET => /api/chats (for getting list of messages)
router.get('/chats/:id', authorize, chatsController.getMessageList)

// POST => /api/chats (for writing messages to chats)
router.post('/chats/:id', authorize, chatsController.writeMessage)

module.exports = router
