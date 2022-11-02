const express = require('express')

// Instantiate a Router
const router = express.Router()

const notifsController = require('../controllers/notifs')

// Middlewares
const { authorize } = require('../middlewares/authorize')

// POST => /api/notifs (for liking users)
router.get('/notifs', authorize, notifsController.getNotifs)

// DELETE => /api/notifs (for unliking users)
// router.delete('/notifs', authorize, notifsController.delete)

module.exports = router
