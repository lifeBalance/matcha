// To create/update Profile Settings (one model could deal with several tables).
const SettingsModel = require('../models/Settings')
// Let's pull also the account model to pull the user's email
const AccountModel = require('../models/Account')

// Utility for generate Email token and send Account Confirmation email
const { tokenAndEmail } = require('../utils/tokenAndEmail')

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

// For doing filesystem stuff
const fs = require('fs')

// Returns Email field and UID after authenticating user's Access Token
exports.getSettings = async (req, res, next) => {
  // In our 'authorize' middleware, we attached the uid to the Request object
  const [user, _] = await AccountModel.readOne({ id: req.uid })

  // Send Account information to prepopulate fields in the Profile form.
  res.status(200).json({
    uid:          req.uid, // send it just in case...
    username:     user[0].username,
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
exports.updateSettings = async (req, res, next) => {
  const uploadsFolder = path.join(`${__dirname}/../../public/uploads/${req.uid}`)
  // If the user modifies her email, set confirmed to 0
  let confirmed = 1 // If the user's editing the profile, she's confirmed!

  try {
    if (req.pics && req.pics.length > 0) {
      if (!fs.existsSync(uploadsFolder)) fs.mkdirSync(uploadsFolder)
      for (const pic of req.pics) {
        fs.readFile(pic.filepath, (err, e) => {
          if (err) console.log(err)
          fs.writeFile(`${uploadsFolder}/${pic.newFilename}`, e, (err) => {
            console.log(err)
          })
        })
      }
    }

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
    } = req.fields

    // Read email of the CURRENT USER (to compare with the one in the form)
    const [rowArr, fieldsArr] = await AccountModel.readOne({ id: uid })

    if (rowArr.length === 0) { // what, no email linked to the logged in user?
      res.status(400).json({ message: 'bad request' }) // shenanigans!!!
      return
    }
    /* Pull from the DB the email of the current user (using the uid from the
      authorization middleware, from her Access token claim), to check if
      it's different from the EMAIL provided in the FORM. */
    const currentEmail = rowArr[0].email

    /* If the EMAIL provided in the form is not the same that the one in the 
      DB, we gotta check there's not another user with that new Email. */
    if (currentEmail !== email) {
      // Check that the new Email does not belong to another user.
      const [rowArr2, fieldsArr2] = await AccountModel.readOne({ email })
      console.log('Check new email: ' + JSON.stringify(rowArr2));
      // If there's another user (with another UID) that is using that email...
      if (rowArr2.length > 0) {
        res.status(409).json({
          message: 'Sorry, that email already exists in our Database'
        })
        return
      } else {
        // 1. Generate Email token
        // 2. Delete preexisting Email token (if any)
        // 3. Store new Email token in DB
        // 4. Send Account Confirmation Email with the token
        await tokenAndEmail(email) // This fn does 4 steps above!!
        // 5. Set Account to NOT CONFIRMED!
        confirmed = 0
      }
    }

    // Instantiate the Settings model class to update/create new Profile
    const settings = new SettingsModel({
      id: uid,
      firstname,
      lastname,
      email,
      age: parseInt(age),
      gender: parseInt(gender),
      prefers: parseInt(prefers),
      bio,
      profile_pic: profile_pic || '',
      confirmed: confirmed
    })

    // We could use the DB response, to check if the profile was created/updated
    const [dbResp, _] = await settings.update()

    let msg = 'Profile successfully updated.'
    if (!confirmed)
      msg += " Don't forget to confirm your account!"

    if (dbResp.affectedRows === 1) {
      // console.log('affectedRows: ' + dbResp.affectedRows) // testing
      res.status(200).json({
        message: msg,
        confirmed: confirmed
      })
    } else {
      res.status(400).json({ message: 'woops' })
    }
    // res.status(200).json({
    //   uid,
    //   firstname,
    //   lastname,
    //   email,
    //   age,
    //   gender,
    //   prefers,
    //   bio,
    //   profile_pic,
    //   confirmed: confirmed
    // }) // testing
  } catch(error) {
    console.log(error)
    next(error)
  }
}
