// To create/update Profile Settings (one model could deal with several tables).
const SettingsModel = require('../models/Settings')
// Let's pull also the account model to pull the user's email
const AccountModel = require('../models/Account')

// Utility for generate Email token and send Account Confirmation email
const { tokenAndEmail } = require('../utils/tokenAndEmail')

// For doing filesystem stuff
const fs = require('fs')
const path = require('path')
const { savePic } = require('../utils/savePic')

// Returns Email field and UID after authenticating user's Access Token
exports.getSettings = async (req, res, next) => {
  // In our 'authorize' middleware, we attached the uid to the Request object
  const [user, _] = await AccountModel.readOne({ id: req.uid })

  const fakeBio = 'Some users prefer to keep an air of mistery about themselves...'
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
    bio:          user[0].bio || fakeBio,
    profile_pic:  user[0].profile_pic
  })
}

// Creates a Single Resource (a user Profile)
exports.updateSettings = async (req, res, next) => {
  try {
    /*  The Authorization middleware extracted the user's id from the token,
       and hung it in the Request object! */
    const uid = req.uid

    // Pull from DB the CURRENT USER (using the uid from the authorization mw)
    const [rowArr, fieldsArr] = await AccountModel.readOne({ id: uid })

     // Check if there's some user with that uid
    if (rowArr.length === 0) {
      res.status(400).json({ message: 'bad request' }) // shenanigans!!!
      return
    }
    /* Assign to 'currentUser' the user we've just pulled from the DB using
      the uid that we got from the authorization middleware */
    const currentUser = rowArr[0]

    /* Let's assign to variables the fields we got in the form. */
    const {
      firstname,
      lastname,
      email,
      age,
      gender,
      prefers,
      bio
    } = req.fields

    /**
     *  Let's initialize the variable 'confirmed` to 1 (true), meaning that
     * if the user is creating/updating her profile, she's confirmed her 
     * account already!
     * 
     *  Later we'll check if she's changed her email, in which case, we'll set 
     * confirmed to 0 (false), and made her confirm her account.
     */
    let confirmed = 1 // We write a 'confirmed' value to DB no matter what.

    /* If the EMAIL provided in the form is not the same that the one in the 
      DB, we gotta check there's not another user with that new Email. */
    if (currentUser.email !== email) {
      // Check that the new Email does not belong to another user.
      const [rowArr2, fieldsArr2] = await AccountModel.readOne({ email })

      // console.log('Check new email: ' + JSON.stringify(rowArr2)) // testing

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
        await tokenAndEmail(email) // This fn call does 4 steps above!!
        // 5. Set Account to NOT CONFIRMED!
        confirmed = 0
      }
    }

    /**
     * Pics stuff.
     */
    // Let's set a folder for user pics.
    // const userFolder = path.join(`${__dirname}/../../public/uploads/${uid}`)

    // console.log('username ' + currentUser.username) // testing
    // console.log('Has profile pic? ' + currentUser.profile_pic) // testing
    // console.log('typeof profile pic? ' + typeof(currentUser.profile_pic)) // testing

    // Check if user has a Profile picture set in DB
    let profile_pic_url = currentUser.profile_pic

    // const filesLeft (derive from the amount of files in the user's folder)

    // Let's set the first pic submitted as the Profile pic.
    if (!profile_pic_url && req.pics && req.pics.length > 0) {
      // console.log('Trying to write profile pic!!!') // testing

      /* The next function call writes the first pic to the user's folder and
        returns its URL (that's what we write to the DB */
      profile_pic_url = await savePic(req.pics[0], currentUser.id)

      /* Create a shallow copy of the req.pics array to iterate over it, to 
        save up the rest of the submitted pictures (if any) */
      if (req.pics.length > 1) req.pics = req.pics.slice(1)
      // console.log('REMAINING PICS: ' + JSON.stringify(req.pics)) // testing
    }

    // If there are remaining pics in the submitted form, save them too!
    if (req.pics && req.pics.length > 0) {
      // Let's set a folder for user pics.
      const userFolder = path.join(`${__dirname}/../../public/uploads/${uid}`)

      for (const pic of req.pics) {
        // Read the file from the /temp folder
        fs.readFile(pic.filepath, (err, e) => {
          if (err) console.log(err)

          // Extract the extension from the mimetipe
          const ext = pic.mimetype.split('/')[1]

          // Write the file to the user's folder
          fs.writeFile(`${userFolder}/${pic.newFilename}.${ext}`, e, (err) => {
            console.log(err)
          })
        })
      }
    }
    // console.log('Profile pic: ' + profile_pic_url) // testing
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
      profile_pic: profile_pic_url,
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
        confirmed: confirmed,
        profile_pic: profile_pic_url
      })
    } else {
      res.status(400).json({ message: 'woops' })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}
