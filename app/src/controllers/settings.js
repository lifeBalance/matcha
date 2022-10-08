// To create/update Profile Settings (one model could deal with several tables).
const SettingsModel = require('../models/Settings')

// We need the Email Token model too! (email updates require Confirmation)
// const EmailTokenModel = require('../models/EmailToken')

// To hash the Email Token before writing them to DB (if email was modified)
// const { createHash } = require('crypto')

// To import our "secrets"
const dotenv = require('dotenv')
const path = require('path')

// Invoke dotenv, setting path to the secrets file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
// console.log(process.env) // testing

// Returns Email field and UID after authenticating user's Access Token
exports.get = async (req, res, next) => {
  // In our 'authorize' middleware, we attached the uid to the Request object
  const [user, _] = await SettingsModel.readOne({ id: req.uid })

  // Send Account information to prepopulate fields in the Profile form.
  res.status(200).json({
    uid:          req.uid, // send it just in case...
    firstname:    user[0].firstname,
    lastname:     user[0].lastname,
    email:        user[0].email,
    age:          user[0].age,
    gender:       user[0].gender,
    prefers:      user[0].prefers,
    bio:          user[0].bio,
    profile_pic:  user[0].profile_pic
  })
}

// Creates a Single Resource (a user Profile)
exports.update = async (req, res, next) => {
  try {
    const uid = req.uid
    const {
      firstname,
      lastname,
      email,
      age,
      gender,
      prefers,
      bio,
      profile_pic
    } = req.body

    // console.log(req.uid, firstname, lastname, email, age, gender, bio, profile_pic); return;
    // Instantiate the ProfileModel class to create new Profile
    const profile = new ProfileModel({
      id: uid,
      age: parseInt(age),
      gender: parseInt(gender),
      prefers: parseInt(prefers),
      bio,
      profile_pic: profile_pic || ''
    })
    
    // We could use the DB response, to check if the profile was created
    const [dbResp, _] = await profile.create()
    
    // Update the user's account anyways (even with the same intel)
    // AccountModel.update() // update() method not yet created....

    if (dbResp) console.log('affectedRows: ' + dbResp.affectedRows) // testing
    res.status(200).json({uid, firstname, lastname, email, age, gender, prefers, bio, profile_pic})


    // If Email was modified: 1. Generate Email token
    // 2. Delete preexisting Email token (if any)
    // 3. Send Account Confirmation Email with the token
  } catch(error) {
    console.log(error)
    next(error)
  }
}
