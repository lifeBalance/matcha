const express = require('express')

// Instantiate a Router
const router = express.Router()

// Controller
const resetController = require('../controllers/reset')

// Middlewares
const {
  validateEmailRequestForm
} = require('../middlewares/validateEmailRequestForm')

const {
  validateLinkParams
} = require('../middlewares/validateLinkParams')

const {
  validateResetPasswordForm
} = require('../middlewares/validateResetPasswordForm')

// POST => /api/reset (requests for an email with Reset Password link)
router.post('/reset', validateEmailRequestForm, resetController.requestEmail)

// PUT => /api/reset (for resetting the password)
router.put('/reset',
            validateLinkParams,
            validateResetPasswordForm,
            resetController.reset)

module.exports = router
