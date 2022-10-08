const express = require('express')
// Validators for all signup fields (same code as in React front-end)
const {
  validateUsername,
  validatePassword,
  validateEmail,
  validateName
} = require('../utils/validators')

const accountsController = require('../controllers/accounts')

const router = express.Router()

// Middleware to validate usernames
const { validateUsernames } = require('../middlewares/validateUsernames')

// middleware to validate 'em all, son
function mwValidateSignup(req, res, next) {
  if (!req.hasOwnProperty('body') ||
    !req.body.hasOwnProperty('username') ||
    !req.body.hasOwnProperty('firstname') ||
    !req.body.hasOwnProperty('lastname') ||
    !req.body.hasOwnProperty('email') ||
    !req.body.hasOwnProperty('password') ||
    !validateUsername(req.body.username) ||
    !validateName(req.body.firstname) ||
    !validateName(req.body.lastname) ||
    !validateEmail(req.body.email) ||
    !validatePassword(req.body.password))
  {
    res.status(400).json({ message: 'bad request' })
    return
  }
  next()
}

// POST => /api/accounts (for creating account)
router.post('/accounts', mwValidateSignup, accountsController.create)

// GET => /api/accounts (check if username exists; useful at signup)
router.get('/accounts', validateUsernames, accountsController.readUsername)

// DELETE => /api/accounts (for account deletion)
// router.delete('/accounts', ) // coming soon!

module.exports = router
