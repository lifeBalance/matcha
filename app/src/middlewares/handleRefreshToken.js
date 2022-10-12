// To verify JSON Web Tokens
const jwt = require('jsonwebtoken')
const RefreshTokenModel = require('../models/RefreshToken')

// To import our "secrets"
const dotenv = require('dotenv')
const path = require('path')

// Invoke dotenv, setting path to the secrets file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// To hash the Refresh Tokens before deleting them to DB (need to find them)
const { createHash } = require('crypto')

exports.handleRefreshToken = async (req, res, next) => {
  /**
   *  Let's start by extracting the Refresh Token from the HTTP only COOKIE.
   * (Remember that a cookie with the `Secure` attribute will only be sent 
   * over HTTPS, a secure connection)
   */
  try {
    // console.log('cookie: ' + JSON.stringify(req.cookies)) // testing
    var oldRefreshToken = req?.cookies?.refreshToken // function scoped
    // Early return if no Refresh token was sent!
    if (!oldRefreshToken) {
      console.log('no refresh token sent');
      next()
      return
    }

    /* The verify method returns the payload if the token is legit, and it's 
    not expired; otherwise it throws some error that we have to handle. */
    jwt.verify(oldRefreshToken, process.env.SECRET_JWT_KEY)
    next()
  } catch (error) {
    /* If the Refresh Token is just expired, we catch the error
    and let the controller handle what happens next */
    if (error.name === 'TokenExpiredError') next()

    // For any other token verification error, party stops here.
    else res.status(403).json({ message: error })
  } finally {
    // console.log('oldRefreshToken: ' + oldRefreshToken);
    const hash = createHash('sha256').update(oldRefreshToken).digest('hex')
    // console.log('HASH: ' + hash) // testing

    // Here is where we DELETE the Refresh Token from the DB
    const [rowArr, fields2] = await RefreshTokenModel.delete(hash)
    // console.log('YOYOYO '+ JSON.stringify(rowArr)) // testing
    if (rowArr?.affectedRows)
      console.log('An old refresh token was deleted')
  }
}
