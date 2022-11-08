const express = require('express')

// Instantiate a Router
const router = express.Router()

const blocksController = require('../controllers/blocks')

// Middlewares
const { authorize } = require('../middlewares/authorize')

// POST => /api/blocks (for blocking users)
router.post('/blocks', authorize, blocksController.blockUser)

module.exports = router
