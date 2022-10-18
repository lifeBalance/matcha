// Models to verify user's credentials with DB, and store Refresh Tokens.
const AccountModel = require('../models/Account')
const RefreshTokenModel = require('../models/RefreshToken')

// Custom ASYNC function To compare with the stored in DB encrypted passwords.
const { comparePasswords } = require('../utils/passwords') 

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
    const currentUser = await AccountModel.readOne({ 
      username: req.body.username
    })
    // console.log(JSON.stringify(currentUser)) // testing
    if (!currentUser) {
      return res.status(200).json({
        type: 'ERROR',
        message: 'Sorry, requested user does not exist'
      })
    }

    const passwordsMatch = await comparePasswords(req.body.password, currentUser.pwd_hash)
    if (!passwordsMatch) {
      // console.log('PASSWORDS DO NOT MATCH!') // testing
      return res.status(200).json({ 
        type: 'ERROR',
        message: 'Wrong password.'
      })
    }

    // If the user's account is NOT confirmed
    if (!currentUser.confirmed) {
      return res.status(200).json({
        type: 'ERROR',
        message: 'Please, confirm your account before logging in.'
      })
    }

    // Generate the access_token
    const accessToken = jwt.sign({
      sub:    currentUser.id,
      email:  currentUser.email,
    }, process.env.SECRET_JWT_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXP})

    // Generate the refresh_token
    const refreshToken = jwt.sign({
      sub:    currentUser.id,
    }, process.env.SECRET_JWT_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXP})

    // Let's extract the expiry time of the Refresh token from the claim ;-)
    const expiryRefreshToken = jwt.verify(refreshToken, process.env.SECRET_JWT_KEY).exp

    // Set hardened cookie
    res.cookie('refreshToken', refreshToken, {
      path:     '/api',
      // secure:   true,
      // Gotta divide by 10 to get 2 days. Otherwise expires in 20 days! 🤔
      maxAge:   expiryRefreshToken / 10,
      httpOnly: true,
      // sameSite: 'None' // this must be used together with 'secure: true'
    })

    // Hash the Refresh Token before storing it in the DB
    const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex')

    // Instantiate the RefreshToken model
    const RefreshToken = new RefreshTokenModel({
      uid:        currentUser.id,
      token_hash: refreshTokenHash,
      // (If I change MySQL to TIMESTAMP, use format = 'YYYY-MM-DD HH:MM:SS')
      expires_at: expiryRefreshToken // already in seconds ;-)
    })
    // Store the Refresh Token in DB, by invoking the create method on the instance
    const ret = await RefreshToken.create()

    // Send the access_token in the response body
    res.status(200).json({
      type: 'SUCCESS',
      message: 'Successfully logged in!',
      access_token: accessToken,
      profiled:     currentUser.profiled,
      confirmed:    currentUser.confirmed,
      uid:          currentUser.id
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.logout = async (req, res, next) => {
  try {
    /* The 'deleteRefreshToken' middleware deleted the Refresh Token in the 
      DB, now let's delete the hardened COOKIE on the user's Browser. In order 
      to do that, the options must be identical to the ones used when sending 
      the cookie at log in (excluding the 'expires' and 'maxAge' options) */
    res.clearCookie('refreshToken', {
        path:     '/api',
        // secure:   true,
        httpOnly: true,
        // sameSite: 'None'
    })
    res.status(200).json({ message: 'successfully logged out' })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
