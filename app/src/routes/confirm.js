const express = require('express')

// Instantiate a Router
const router = express.Router()

const confirmController = require('../controllers/confirm')

// validator for email (same code as in React front-end)
const {
  validateConfirmation
} = require('../middlewares/validateConfirmation')

const {
  validateConfirmationRequest
} = require('../middlewares/validateConfirmationRequest')

// PUT => /api/confirm (for confirming account)
router.put('/confirm', confirmController.confirm)

// POST => /api/confirm (requests for an email with account confirmation link)
router.post('/confirm', validateConfirmationRequest, confirmController.requestEmail)

module.exports = router
