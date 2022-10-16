// Validators for all signup fields (same code as in React front-end)
const {
  validateUsername,
  validatePassword,
  validateEmail,
  validateName
} = require('../utils/validators')

exports.validateSignup = (req, res, next) => {
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
    res.status(200).json({
      type: 'ERROR',
      message: 'bad request'
    })
    return
  }
  next()
}