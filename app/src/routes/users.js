const express = require('express')

const usersController = require('../controllers/users')

const router = express.Router()

// GET /api/tests
router.get('/users', usersController.readAllUsers)

// GET /api/tests/:id
router.get('/users/:id', usersController.readOneUser)

// POST /api/tests
router.post('/users', usersController.createUser)

module.exports = router
