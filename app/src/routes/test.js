const express = require('express')

const testController = require('../controllers/test')

const router = express.Router()

// GET /api/tests
router.get('/tests', testController.getTests)
// GET /api/test
router.get('/test', testController.getTest)

// POST /api/test
router.post('/test', testController.createTest)

module.exports = router