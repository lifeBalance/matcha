// Validators for all signup fields (same code as in React front-end)
const { validateUsername } = require('../utils/validators')

exports.validateUsernames = (req, res, next) => {
  if (!req.query.hasOwnProperty('username') ||
      !validateUsername(req.query.username))
  {
    res.status(200).json({
      type: 'ERROR',
      message: 'bad request'
    })
    return
  }
  next()
}
