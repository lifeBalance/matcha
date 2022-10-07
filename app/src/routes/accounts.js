const express = require('express')
// validators for all signup fields (same code as in React front-end)
const {
  validateUsername,
  validatePassword,
  validateEmail,
  validateName
} = require('../utils/validators')

const accountsController = require('../controllers/accounts')

const router = express.Router()

// middleware to validate 'em all, son
function mwValidateSignup(req, res, next) {
  if (!req.hasOwnProperty('body') ||
    !req.body.hasOwnProperty('username') ||
    !req.body.hasOwnProperty('firstname') ||
    !req.body.hasOwnProperty('lastname') ||
    !req.body.hasOwnProperty('email') ||
    !req.body.hasOwnProperty('password') ||
    !req.body.hasOwnProperty('pwdconf')  ||
    !validateUsername(req.body.username) ||
    !validateName(req.body.firstname) ||
    !validateName(req.body.lastname) ||
    !validateEmail(req.body.email) ||
    !validatePassword(req.body.password) ||
    req.body.password !== req.body.pwdconf)
  {
    res.status(400).json({ message: 'bad request' })
    return
  }
  next()
}

// POST => /api/accounts (for creating account)
router.post('/accounts', mwValidateSignup, accountsController.create)

// DELETE => /api/accounts (for account deletion)
// router.delete('/accounts', ) // coming soon!

module.exports = router
