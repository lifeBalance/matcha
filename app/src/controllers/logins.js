const UserModel = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const path = require('path')
const dotenv = require('dotenv')
const unixTimeInSeconds = () => Math.floor(Date.now() / 1000)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Log in the user, send tokens if credentials match, else...
exports.login = async (req, res, next) => {
  try {
    const [user, _] = await UserModel.readOne({ username: req.body.username })

    if (!Array.isArray(user) || !user.length) {
      res.status(401).json('wrong username')
      return
    }

    bcrypt.compare(req.body.password, user[0].pwd_hash, function(err, result) {
      if (result == true) {
        // Generate the access_token
        const access_token = jwt.sign({
          sub:    user[0].id,
          email:  user[0].email,
          exp:    unixTimeInSeconds() + eval(process.env.ACCESS_TOKEN_EXP)
        }, process.env.SECRET_JWT_KEY)

        // Generate the refresh_token
        const refresh_token = jwt.sign({
          sub:    user[0].id,
          exp:    unixTimeInSeconds() + eval(process.env.REFRESH_TOKEN_EXP),
        }, process.env.SECRET_JWT_KEY)

        // Set hardened cookie
        res.cookie('refreshToken', refresh_token, {
          path:     '/api',
          secure:   true,
          expires:  new Date(Date.now() + (eval(process.env.REFRESH_TOKEN_EXP) * 1000)),
          httpOnly: true,
          samesite: 'None'
        })

        // Send the access_token in the response body
        res.status(200).json({
          access_token: access_token,
          uid:          user[0].id,
          // exp: new Date(Date.now() + (eval(process.env.REFRESH_TOKEN_EXP) * 1000)), // testing
          // now: new Date(Date.now()) // testing
        })
      } else {
        res.status(401).json('wrong pwd')
      }
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}

// Return ...
// exports.logout = async (req, res, next) => {
//   try {
//     // The fields (metadata about results) are assigned to the '_'
//     const [user, _] = await UserModel.readOne(req.params.id)
//     res.status(200).json(user)
//   } catch (error) {
//     console.log(error)
//     next(error)
//   }
// }
