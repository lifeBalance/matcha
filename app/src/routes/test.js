const express = require('express')

const testController = require('../controllers/test')

const router = express.Router()

// GET /api/tests
router.get('/tests', testController.getTests)

// POST /api/test
router.post('/test', testController.createTest)

module.exports = router