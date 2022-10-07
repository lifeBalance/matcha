const express = require('express')

const testsController = require('../controllers/tests')

const router = express.Router()

function mwHello(req, res, next) {
  if (req.body.test) {
    console.log('hello ' + typeof req.body.test)
    console.log('hello ' + req.body.test.toUpperCase())
  } else {
    res.status(400).json({'hello': 'it seems your request did not include the ting'})
    return
  }
  next()
}

// GET => /api/tests
router.get('/tests', mwHello, testsController.testsGet)

// POST => /api/tests (for logging in)
// router.post('/tests', testsController.testsPost)

// DELETE => /api/tests
// router.delete('/tests', testsController.testsDelete)

module.exports = router
