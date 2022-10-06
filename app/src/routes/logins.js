const express = require('express')

const loginsController = require('../controllers/logins')

const router = express.Router()

// POST => /api/logins (for logging in)
router.post('/logins', loginsController.login)

// DELETE => /api/logins (for logging out)
// router.get('/users', loginsController.logout)

module.exports = router
