// validators for email (same code as in React front-end)
const { validateEmail } = require('../utils/validators')

exports.validateEmailRequestForm = (req, res, next) => {
  if (!req.hasOwnProperty('body') ||
      !req.body.hasOwnProperty('email') ||
      !validateEmail(req.body.email))
  {
    return res.status(200).json({
      type: 'ERROR',
      message: 'bad request'
    })
  }
  next()
}