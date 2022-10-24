// Models to verify user's credentials with DB, and store Refresh Tokens.
const AccountModel = require('../models/Account')
const PicModel = require('../models/Pic')
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

    // REMEMBER: We set the user's location at LOGIN!! (design choice)

    /* Let's start by checking that the user didn't set her LOCATION to
      'manual' in her Profile Settings; in that case we don't write her 
      current location to the DB (either req.geoLoc or req.geoIpLoc). */
    const dbLocation = await AccountModel.getLocation({
      uid: currentUser.id
    })
    // console.log('LOGINS CONTROLLER: '+JSON.stringify(location)) // testing

    let liveLocation = req.geoLoc
    // console.log(`logins CONTROLLER - geolocation = 
    //             ${JSON.stringify(req.geoLoc)}`)     // testing
    if (!req?.geoLoc || (req.geoLoc?.lat === 0 && req.geoLoc?.lng === 0))
      liveLocation = req.geoIpLoc
    // console.log(`logins CONTROLLER - liveLocation = 
    //             ${JSON.stringify(liveLocation)}`)   // testing

    /* On the FIRST LOGIN, the 'location' column in the DB, will be null,
      since it hasn't been set yet, and that's the DEFAULT VALUE for this 
      column). */
    if (!dbLocation || !dbLocation.manual) {
      /*  So if the user didn't set her location to MANUAL (or it was
        her 1st LOGIN) let's write her liveLocation to the DB (it could be 
        either the browser's Geolocation API or the one we juiced from her
        IP). */
      await AccountModel.setLocation({
        uid:      currentUser.id,
        location: { ...liveLocation, manual: false }
      })
    }
    // console.log('dbLocation: '+JSON.stringify(dbLocation))  // testing
    // console.log('liveLocation: '+JSON.stringify(liveLocation))  // testing

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

    // Pull the profile pic from DB (It could be an empty string or null)
    const profile_pic = await PicModel.readProfilePicUrl({ id: currentUser.id })

    // Send the access_token in the response body
    res.status(200).json({
      type:             'SUCCESS',
      message:          'Successfully logged in!',
      access_token:     accessToken,
      profiled:         currentUser.profiled,
      confirmed:        currentUser.confirmed,
      uid:              currentUser.id,
      profile_pic:      profile_pic,
      location:         dbLocation,
      liveLocation:     liveLocation,
      manualLocation:   dbLocation?.manual || false
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
