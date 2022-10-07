// To create a router
const express = require('express')
const router = express.Router()

// To import our "secrets"
const dotenv = require('dotenv')
const path = require('path')

// Invoke dotenv, setting path to the secrets file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// To verify JSON Web Tokens
const jwt = require("jsonwebtoken")

// validators for all signup fields (same code as in React front-end)
const {
  validateEmail,
  validateName
} = require('../utils/validators')

const profilesController = require('../controllers/profiles')

// middleware to validate Profile form input fields
function validateProfileForm(req, res, next) {
  if (!req.hasOwnProperty('body') ||
    !req.body.hasOwnProperty('firstname') ||
    !req.body.hasOwnProperty('lastname') ||
    !req.body.hasOwnProperty('email') ||
    !req.body.hasOwnProperty('age') ||
    !req.body.hasOwnProperty('gender') ||
    !req.body.hasOwnProperty('prefers') ||
    !req.body.hasOwnProperty('bio') ||
    !validateName(req.body.firstname) ||
    !validateName(req.body.lastname) ||
    !validateEmail(req.body.email))
  {
    res.status(400).json({ message: 'bad request' })
    return
  }
  next()
}

// middleware for validating pics will go here...

function mwAuthorize(req, res, next) {
  const authHeader = req.headers.authorization

  if (authHeader) {
      const [key, accessToken] = authHeader.split(' ');

      if (key !== 'Bearer') {
        res.status(400).json({ message: 'bad request' })
        return
      }
      jwt.verify(accessToken, process.env.SECRET_JWT_KEY, (err, payload) => {
          // jwt.verify checks both that the token is legit and not expired
          if (err) return res.status(403).json({ message: 'invalid token'})
          else {
            // console.log(payload) // testing

            // Attaching properties to the request object is the way to 
            // pass data to next middleware or controller
            req.uid = payload.sub // The 'sub' claim contains the uid
            next()
          }
      })
  } else {
    res.status(400).json({ message: 'bad request'})
  }
}

// GET => /api/profiles (for accessing the form to create/update profile)
router.get('/profiles', mwAuthorize, profilesController.get)

// POST => /api/profiles (for creating profiles)
router.post('/profiles', mwAuthorize, validateProfileForm, profilesController.create)

// PUT => /api/profiles (for updating profile; profile is CREATED at signup!)
// router.put('/profiles', mwValidateForm, profilesController.update)

module.exports = router
