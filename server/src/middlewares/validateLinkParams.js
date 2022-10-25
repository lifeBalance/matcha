const {
  validateEmail
} = require('../utils/validators')

exports.validateLinkParams = (req, res, next) => {
  if (!req.hasOwnProperty('body')       ||
      !req.body.hasOwnProperty('email') ||
      !req.body.hasOwnProperty('token') ||
      !validateEmail(req.body.email)    ||
      !/^[a-f0-9]{2,32}$/.test(req.body.token))
  {
    return res.status(200).json({
      type: 'ERROR',
      message: 'bad request'
    })
  }
  next()
}