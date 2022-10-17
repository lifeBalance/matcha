const express = require('express')

// Instantiate a Router
const router = express.Router()

const loginsController = require('../controllers/logins')

// Middlewares
const { validateLogin } = require('../middlewares/validateLogin')

// Something is WRONG with this middleware...
const { handleRefreshToken } = require('../middlewares/handleRefreshToken')

// POST => /api/logins (for logging in)
router.post('/logins', validateLogin, loginsController.login)

// DELETE => /api/logins (for logging out)
router.delete('/logins', loginsController.logout)

module.exports = router
