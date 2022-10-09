const {
  validateEmail
} = require('../utils/validators')

exports.validateConfirmationRequest = (req, res, next) => {
  if (!req.hasOwnProperty('body')       ||
      !req.body.hasOwnProperty('email') ||
      !validateEmail(req.body.email))
  {
    res.status(400).json({ message: 'bad request' })
    return
  }
  next()
}