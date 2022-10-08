const express = require('express')
const router = express.Router()

// Naturally we need the 'accounts' controller
const accountsController = require('../controllers/accounts')

// Middleware for our routes
const { validateUsernames } = require('../middlewares/validateUsernames')
const { validateSignup } = require('../middlewares/validateSignup')

// POST => /api/accounts (for creating accounts)
router.post('/accounts', validateSignup, accountsController.create)

// GET => /api/accounts (check if username exists; useful at signup)
router.get('/accounts', validateUsernames, accountsController.readUsername)

// DELETE => /api/accounts (for account deletion)
// router.delete('/accounts', ) // coming soon!

module.exports = router
