const express = require('express')
// validators for username & password (same code as in React front-end)
const {
  validateUsername,
  validatePassword
} = require('../utils/validators')

const loginsController = require('../controllers/logins')

const router = express.Router()

// middleware to validate 'em all, son
function mwValidateLogin(req, res, next) {
  if (!req.hasOwnProperty('body') ||
    !req.body.hasOwnProperty('username') ||
    !req.body.hasOwnProperty('password') ||
    !validateUsername(req.body.username) ||
    !validatePassword(req.body.password))
  {
    res.status(400).json({ message: 'bad request' })
    return
  }
  next()
}

// POST => /api/logins (for logging in)
router.post('/logins', mwValidateLogin, loginsController.login)

// DELETE => /api/logins (for logging out)
router.delete('/logins', loginsController.logout)

module.exports = router
