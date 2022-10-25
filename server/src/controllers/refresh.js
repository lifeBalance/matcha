/* Model to verify that the Refresh Token exists in the DB,
  and store the new Refresh Tokens. */
const RefreshTokenModel = require('../models/RefreshToken')
// To check the user still has an Account in our site.
const AccountModel = require('../models/Account')
// Let's pull also the Pic model for the profile pictures
const PicModel = require('../models/Pic')

// To create both JWTs (Access and Refresh)
const jwt = require("jsonwebtoken")

// To hash the Refresh Tokens before writing them to DB (later to locate them)
const { createHash } = require('crypto')

// Import our "secrets": SECRET_JWT_KEY, ACCESS_TOKEN_EXP and REFRESH_TOKEN_EXP
const path = require('path')
const dotenv = require('dotenv')

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
    const currentUser = await AccountModel.readOne({ id: payload.sub })
    const profile_pic = await PicModel.readProfilePicUrl({ id: payload.sub })
    if (!currentUser) {
      return res.status(204).json({
        message: 'Sorry, requested user does not exist'
      })
    }
    // const [userArr, fields] = await AccountModel.readOne({ id: payload.sub })

    // // If the DB returns an empty array, it means the username doesn't exist
    // if (!Array.isArray(userArr) || !userArr.length) {
    //   res.status(401).json({ message: 'user does not exist' })
    //   return
    // }

    // console.log(createHash('sha256').update(oldRefreshToken).digest('hex'))
    /* If the token is legit and the user exists, let's check the token is in
    our DB. Remember to check for the hashed version of the token! */
    const oldRefreshTokenHash = createHash('sha256')
      .update(oldRefreshToken)
      .digest('hex')
    const refreshTokenExists = await RefreshTokenModel.read(oldRefreshTokenHash)

    /* If the DB returns an empty array, it means the token is not whitelisted,
    because maybe the user used it and was removed (or may be a stolen token)*/
    if (!refreshTokenExists) {
      return res.status(200).json({
        type: 'ERROR',
        message: 'bad request'
      })
    } else {
      const tokenWasDeleted = await RefreshTokenModel.delete(oldRefreshTokenHash)
      // if (tokenWasDeleted)
      //   console.log('Old Refresh Token was deleted') // testing
    }
    // res.status(200).json('found it') // testing
    /* If all is good:
      1. Generate a NEW Access Token: */
    const accessToken = jwt.sign({
      sub:    currentUser.id,
      email:  currentUser.email,
    }, process.env.SECRET_JWT_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXP})

    // 2. Generate a NEW Refresh Token
    const refreshToken = jwt.sign({
      sub:    currentUser.id,
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
      uid:        currentUser.id,
      token_hash: refreshTokenHash,
      // (If I change MySQL to TIMESTAMP, use format = 'YYYY-MM-DD HH:MM:SS')
      expires_at: expiryRefreshToken // already in seconds ;-)
    })
    // Store the Refresh Token in DB, by invoking the create method on the instance
    const tokenWasCreated = await RefreshToken.create()
    // console.log('ret: ' + JSON.stringify(ret)) // testing

    if (tokenWasCreated) {
      // Delete the old Refresh Token
      // await RefreshToken.delete({ token: oldRefreshTokenHash })
      // Send the access_token in the response body
      res.status(200).json({
        type:         'SUCCESS',
        message:      'tokens have been refreshed!',
        access_token: accessToken,
        profiled:     currentUser.profiled,
        confirmed:    currentUser.confirmed,
        uid:          currentUser.id,
        profile_pic:  profile_pic
      })
      // console.log('tokens have been refreshed!')  // testing
    } else {
      res.status(200).json({
        type:     'ERROR',
        message:  'Refresh token could not be stored in DB'
      })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}
