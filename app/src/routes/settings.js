// To create a router
const express = require('express')
const router = express.Router()

// Settings controller
const settingsController = require('../controllers/settings')

// Middlewares
const { authorize } = require('../middlewares/authorize')
const { validateSettingsForm } = require('../middlewares/validateSettingsForm')
// middleware for validating pics will go here...

// GET => /api/settings (for accessing the form to create/update profile)
router.get('/settings', authorize, settingsController.get)

// PUT => /api/settings (for editing users own profile settings)
router.put('/settings', authorize, validateSettingsForm, settingsController.update)

module.exports = router
