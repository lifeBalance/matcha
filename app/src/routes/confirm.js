const express = require('express')

// Instantiate a Router
const router = express.Router()

const confirmController = require('../controllers/confirm')

// Middlewares
const {
  validateEmailRequestForm
} = require('../middlewares/validateEmailRequestForm')

const {
  validateLinkParams
} = require('../middlewares/validateLinkParams')

// POST => /api/confirm (requests for emails with account confirmation links)
router.post('/confirm', validateEmailRequestForm, confirmController.requestEmail)

// PUT => /api/confirm (for confirming account)
router.put('/confirm', validateLinkParams, confirmController.confirm)

module.exports = router
