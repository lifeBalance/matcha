const express = require('express')

// Instantiate a Router
const router = express.Router()

const likesController = require('../controllers/likes')

// Middlewares
const { authorize } = require('../middlewares/authorize')

// POST => /api/likes (for liking users)
router.post('/likes', authorize, likesController.like)

// DELETE => /api/likes (for unliking users)
// router.delete('/likes', authorize, likesController.unlike)

module.exports = router
