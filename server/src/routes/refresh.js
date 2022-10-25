const express = require('express')

// Instantiate a Router
const router = express.Router()

// Middlewares
const { checkExpiredAccessToken } = require('../middlewares/checkExpiredAccessToken')

const refreshController = require('../controllers/refresh')

// GET => /api/refresh (for getting a pair of JWTs (Access and Refresh tokens)
router.get('/refresh', checkExpiredAccessToken, refreshController.refresh)

module.exports = router
