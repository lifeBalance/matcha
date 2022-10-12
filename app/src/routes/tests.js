const express = require('express')

const testsController = require('../controllers/tests')

const router = express.Router()

// GET => /api/tests
router.get('/tests', testsController.testsGet)

module.exports = router
