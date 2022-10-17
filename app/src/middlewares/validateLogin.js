// validators for username & password (same code as in React front-end)
const {
  validateUsername,
  validatePassword
} = require('../utils/validators')


exports.validateLogin = (req, res, next) => {
  if (!req.hasOwnProperty('body') ||
    !req.body.hasOwnProperty('username') ||
    !req.body.hasOwnProperty('password') ||
    !validateUsername(req.body.username) ||
    !validatePassword(req.body.password))
  {
    return res.status(200).json({
      type: 'ERROR',
      message: 'bad request'
    })
  }
  next()
}