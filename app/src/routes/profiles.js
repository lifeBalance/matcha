const express = require('express')

const profilesController = require('../controllers/profiles')

const router = express.Router()

// Middlewares
const { authorize } = require('../middlewares/authorize')

// GET /api/profiles     ==> read other users profiles.
router.get('/profiles', authorize, profilesController.readAllProfiles)

// GET /api/profiles/:id ==> read other users profiles.
router.get('/profiles/:id', authorize, profilesController.readOneProfile)

module.exports = router
