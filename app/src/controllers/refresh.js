/* Model to verify that the Refresh Token exists in the DB,
  and store the new Refresh Tokens. */
const RefreshTokenModel = require('../models/RefreshToken')
// To check the user still has an Account in our site.
const AccountModel = require('../models/Account')

// To compare with the stored encrypted passwords
const bcrypt = require('bcrypt')

// To create both JWTs (Access and Refresh)
const jwt = require("jsonwebtoken")

// To hash the Refresh Tokens before writing them to DB (later to locate them)
const { createHash } = require('crypto')

// Import our "secrets": SECRET_JWT_KEY, ACCESS_TOKEN_EXP and REFRESH_TOKEN_EXP
const path = require('path')
const dotenv = require('dotenv')
const { json } = require('body-parser')

// Invoke dotenv, setting path to the secrets file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

/* Verify the Refresh token sent by the front-end is:
  - Matches our signature (It was issued by us).
  - Exists in our DB (it's white-listed)
  - It's not expired (later on I can create a script to clean the DB) */
exports.refresh = async (req, res, next) => {
  try {
    /**
     *  Let's start by extracting the Refresh Token from the HTTP only COOKIE.
     * (Remember that a cookie with the `Secure` attribute will only be sent 
     * over HTTPS, a secure connection)
     */
    const oldRefreshToken = req?.cookies?.refreshToken

    if (!oldRefreshToken) {
      res.status(400).json({ message: 'bad request'})
      return
    }

    /* The verify method returns the payload if the token is legit, and it's 
      not expired; otherwise it throws some error that we have to handle. */
    const payload = (() => { 
      try {
        return jwt.verify(oldRefreshToken, process.env.SECRET_JWT_KEY)
        // res.status(200).json(payload)
        // return
      } catch (error) {
        res.status(401).json(error) // return feedback of expired Session( login again...)
        return
      }
    })()

    /* Since Refresh Tokens have a long expiry time we gotta check the user 
    still exists in our DB, because it's possible that her access rights have
    been revoked (she may have not logged in in a long time, so her Refresh
    token may still be valid, but she doesn't have an account in our 
    DB anymore. */
    const [userArr, fields] = await AccountModel.readOne({ id: payload.sub })

    // If the DB returns an empty array, it means the username doesn't exist
    if (!Array.isArray(userArr) || !userArr.length) {
      res.status(401).json({ message: 'user does not exist' })
      return
    }

    // console.log(createHash('sha256').update(oldRefreshToken).digest('hex'))
    /* If the token is legit and the user exists, let's check the token is in
    our DB. Remember to check for the hashed version of the token! */
    const oldRefreshTokenHash = createHash('sha256')
      .update(oldRefreshToken)
      .digest('hex')
    const [rowArr, fields2] = await RefreshTokenModel.read(oldRefreshTokenHash)

    /* If the DB returns an empty array, it means the token is not whitelisted,
    because maybe the user used it and was removed (or may be a stolen token)*/
    if (!Array.isArray(rowArr) || !rowArr.length) {
      res.status(400).json({ message: 'bad request' })
      return
    } else {
      const [delArr, fields3] = await RefreshTokenModel.delete(oldRefreshTokenHash)
      if (delArr.affectedRows)
        console.log('Old Refresh Token was deleted')
    }
    // res.status(200).json('found it') // testing
    /* If all is good:
      1. Generate a NEW Access Token: */
    const accessToken = jwt.sign({
      sub:    userArr[0].id,
      email:  userArr[0].email,
    }, process.env.SECRET_JWT_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXP})

    // 2. Generate a NEW Refresh Token
    const refreshToken = jwt.sign({
      sub:    userArr[0].id,
    }, process.env.SECRET_JWT_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXP})

    /* Let's extract the expiry time of the Refresh token from the claim,
      so we can use it in the cookie ;-) */
    const expiryRefreshToken = jwt.verify(refreshToken, process.env.SECRET_JWT_KEY).exp

    // Send the NEW Refresh Token in a hardened cookie
    res.cookie('refreshToken', refreshToken, {
      path:     '/api',
      // secure:   true, // Disable it until I add SSL certificates.
      maxAge:   expiryRefreshToken,
      httpOnly: true,
      // sameSite: 'None'
    })
    
    // Hash the Refresh Token before storing it in the DB
    const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex')
    
    // Instantiate the RefreshToken model
    const RefreshToken = new RefreshTokenModel({
      uid:        userArr[0].id,
      token_hash: refreshTokenHash,
      // (If I change MySQL to TIMESTAMP, use format = 'YYYY-MM-DD HH:MM:SS')
      expires_at: expiryRefreshToken // already in seconds ;-)
    })
    // Store the Refresh Token in DB, by invoking the create method on the instance
    const ret = await RefreshToken.create()
    // console.log('ret: ' + JSON.stringify(ret)) // testing

    if (ret[0].affectedRows === 1) {
      // Delete the old Refresh Token
      // await RefreshToken.delete({ token: oldRefreshTokenHash })
      // Send the access_token in the response body
      res.status(200).json({
        message:      'tokens have been refreshed!',
        access_token: accessToken,
        profiled:     userArr[0].profiled,
        uid:          userArr[0].id
      })
      console.log('tokens have been refreshed!');
    } else {
      res.status(401).json({ message: 'wrong password' })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}
