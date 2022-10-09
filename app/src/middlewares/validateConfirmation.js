const {
  validateEmail
} = require('../utils/validators')

exports.validateConfirmation = (req, res, next) => {
  if (!req.hasOwnProperty('body')       ||
      !req.body.hasOwnProperty('email') ||
      !req.body.hasOwnProperty('token') ||
      !validateEmail(req.body.email)    ||
      !/^[a-f0-9]{2,32}$/.test(req.body.token))
  {
    res.status(400).json({ message: 'bad request' })
    return
  }
  next()
}