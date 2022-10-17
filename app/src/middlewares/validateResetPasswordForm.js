const {
  validatePassword
} = require('../utils/validators')

exports.validateResetPasswordForm = (req, res, next) => {
  if (!req.hasOwnProperty('body')           ||
      !req.body.hasOwnProperty('password')  ||
      !req.body.hasOwnProperty('pwdConf')   ||
      !validatePassword(req.body.password)  ||
      req.body.password !== req.body.pwdConf)
  {
    return res.status(200).json({
      type: 'ERROR',
      message: 'bad request'
    })
  }
  next()
}