// Validators for all signup fields (same code as in React front-end)
const {
  validateEmail,
  validateName
} = require('../utils/validators')

// Handy functions
const { inrange } = require('../utils/utils')

exports.validateSettingsForm = (req, res, next) => {
  if (!req.hasOwnProperty('body')           ||
    !req.body.hasOwnProperty('firstname')   ||
    !req.body.hasOwnProperty('lastname')    ||
    !req.body.hasOwnProperty('email')       ||
    !req.body.hasOwnProperty('age')         ||
    !req.body.hasOwnProperty('gender')      ||
    !req.body.hasOwnProperty('prefers')     ||
    !req.body.hasOwnProperty('bio')         ||
    !validateName(req.body.firstname)       ||
    !validateName(req.body.lastname)        ||
    !validateEmail(req.body.email)          ||
    !inrange(req.body.gender, 0, 2)         ||
    !inrange(req.body.prefers, 0, 2)        ||
    !inrange(req.body.bio.length, 1, 255))
  {
    res.status(400).json({ message: 'bad request' })
    return
  }
  next()
}
