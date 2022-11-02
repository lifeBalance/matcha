const express = require('express')

// Instantiate a Router
const router = express.Router()

const viewsController = require('../controllers/views')

// Middlewares
const { authorize } = require('../middlewares/authorize')

// POST => /api/views (for registering views in user profiles)
router.post('/views', authorize, viewsController.postView)

module.exports = router
