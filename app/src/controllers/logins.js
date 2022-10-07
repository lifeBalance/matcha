// Models to verify user's credentials with DB, and store Refresh Tokens.
const AccountModel = require('../models/Account')
const RefreshTokenModel = require('../models/RefreshToken')

// To compare with the stored encrypted passwords
const bcrypt = require('bcrypt')

// To create JSON Web Tokens
const jwt = require("jsonwebtoken")

// To hash the Refresh Tokens before writing them to DB (later to locate them)
const { createHash } = require('crypto')

// Import our "secrets"
const path = require('path')
const dotenv = require('dotenv')

// Invoke dotenv, setting path to the secrets file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Log in the user, send tokens if credentials match, else...
exports.login = async (req, res, next) => {
  try {
    const [account, _] = await AccountModel.readOne({ username: req.body.username })

    // If the DB returns an empty array, it means the username doesn't exist
    if (!Array.isArray(account) || !account.length) {
      res.status(401).json({ message: 'wrong username' })
      return
    }

    bcrypt.compare(req.body.password, account[0].pwd_hash, function(err, result) {
      if (result == true) {
        // Generate the access_token
        const accessToken = jwt.sign({
          sub:    account[0].id,
          email:  account[0].email,
        }, process.env.SECRET_JWT_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXP})

        // Generate the refresh_token
        const refreshToken = jwt.sign({
          sub:    account[0].id,
        }, process.env.SECRET_JWT_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXP})

        // Let's extract the expiry time of the Refresh token from the claim ;-)
        const expiryRefreshToken = jwt.verify(refreshToken, process.env.SECRET_JWT_KEY).exp

        // Set hardened cookie
        res.cookie('refreshToken', refreshToken, {
          path:     '/api',
          secure:   true,
          maxAge:   expiryRefreshToken,
          httpOnly: true,
          sameSite: 'None'
        })

        // Hash the Refresh Token before storing it in the DB
        const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex')

        // Instantiate the RefreshToken model
        const RefreshToken = new RefreshTokenModel({
          uid:        account[0].id,
          token_hash: refreshTokenHash,
          // (If I change MySQL to TIMESTAMP, use format = 'YYYY-MM-DD HH:MM:SS')
          expires_at: expiryRefreshToken // already in seconds ;-)
        })
        // Store the Refresh Token in DB, by invoking the create method on the instance
        const ret = RefreshToken.create()

        // Send the access_token in the response body
        res.status(200).json({
          access_token: accessToken,
          uid:          account[0].id,
        })
      } else {
        res.status(401).json({ message: 'wrong password' })
      }
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.logout = async (req, res, next) => {
  try {
    // console.log('cookie: ' + req.cookies.refreshToken) // testing

    // Let's hash the Refresh Token (in order to locate it in the DB)
    const refreshTokenHash = createHash('sha256').update(req.cookies.refreshToken).digest('hex')
    // console.log('hash: ' + refreshTokenHash) // testing

    // Let's delete the Refresh Token in the database using the hash
    const [_, ret] = await RefreshTokenModel.delete(refreshTokenHash)
    // console.log('ret ' + JSON.stringify(ret)) // test

    // Let's delete the hardened cookie on the client. Options must be
    // identical to those given to res.cookie(), excluding expires and maxAge.
    res.clearCookie('refreshToken', {
        path:     '/api',
        secure:   true,
        httpOnly: true,
        sameSite: 'None'
    })
    res.status(200).json({ message: 'successfully logged out' })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
