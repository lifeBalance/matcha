// To create/update Profile Settings (one model could deal with several tables).
const SettingsModel = require('../models/Settings')
// Let's pull also the account model to pull the user's email
const AccountModel = require('../models/Account')
const PicModel = require('../models/Pic')

// Utility for generate Email token and send Account Confirmation email
const { tokenAndEmail } = require('../utils/tokenAndEmail')

// For doing filesystem stuff
const fs = require('fs')
const path = require('path')
const { savePic } = require('../utils/savePic')

// Returns Email field and UID after authenticating user's Access Token
exports.getSettings = async (req, res, next) => {
  const currentUser = await AccountModel.readOne({ id: req.uid })

  if (!currentUser) {
    return res.status(204).json({
      message: 'Sorry, requested user does not exist'
    })
  }
  /* If the user has a Profile pic, we assign it to this variable;
  otherwise we set is as null (falsey value) */
  const profile_pic_url = await PicModel.readProfilePicUrl({
    id: currentUser.id
  })

  // Pull from the DB ALL of the pic URLs (including the one for the Profile)
  const pics = await PicModel.readAll({ id: currentUser.id })
  // const profile_pic_url = (prof_pic_arr.length > 0) ?
  //   prof_pic_arr[0].url : null

  // Pull from the DB ALL of the pic URLs (including the one for the Profile)
  // const [pics_arr, fieldsr] = await PicModel.readAll({
  //   id: req.uid
  // })
  // We initialize 'pics' to an empty array.
  // const pics = []
  /* If there are any pics in the DB, we write their URLs to 'pics'; 
  otherwise stays empty.*/
  // if (pics_arr.length > 0) for (const pic of pics_arr) pics.push(pic.url)

  // console.log('PROFILE PIC: '+ profile_pic_url)
  // console.log(pics)
  const fakeBio = 'Some users prefer to keep an air of mistery about themselves...'
  // Send Account information to prepopulate fields in the Profile form.
  res.status(200).json({
    uid:          currentUser.id, // send it just in case...
    username:     currentUser.username,
    firstname:    currentUser.firstname,
    lastname:     currentUser.lastname,
    email:        currentUser.email,
    age:          currentUser.age,
    gender:       currentUser.gender,
    prefers:      currentUser.prefers,
    bio:          currentUser.bio || fakeBio,
    profile_pic:  profile_pic_url,
    pics:         pics
  })
}

// Creates a Single Resource (a user Profile)
exports.updateSettings = async (req, res, next) => {
  try {
    /* Assign to 'currentUser' the user we've just pulled from the DB using
      the uid that we got from the authorization middleware */
    const currentUser = await AccountModel.readOne({ id: req.uid })
    if (!currentUser) {
      return res.status(204).json({
        message: 'Sorry, requested user does not exist'
      })
    }

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
      const anotherUser = await AccountModel.readOne({ email })

      // console.log('Check new email: ' + JSON.stringify(rowArr2)) // testing

      // If there's another user (with another UID) that is using that email...
      if (anotherUser) {
        return res.status(200).json({
          type: 'WARNING',
          message: 'Sorry, that email already exists in our Database'
        })
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
    // Check if user has a Profile picture set in DB
    const hasProfilePic = await PicModel.readProfilePicUrl({ id: currentUser.id })
      // Let's set the first pic submitted as the Profile pic.
    if (!hasProfilePic && req.pics && req.pics.length > 0) {
      // console.log('Trying to write profile pic!!!') // testing

      /* The next function call writes the first pic to the user's folder and
      to the DB, and returns its URL (that we'll send back in the response */
      var profilePicUrl = await savePic(req.pics[0], currentUser.id, true)

      /* Create a shallow copy of the req.pics array to iterate over it,
      to save up the rest of the submitted pictures (if any) */
      if (req.pics.length > 1) req.pics = req.pics.slice(1)
      // console.log('REMAINING PICS: ' + JSON.stringify(req.pics)) // testing
    }
    
    /* Let's count how many pics in total the user already has in DB. */
    const picsAmount = await PicModel.countPics({ id: currentUser.id })
    // Check we don't surpass the 5 pics limit.
    const filesLeft = 5 - picsAmount
    // If there are more pics in the submitted form, save them too!
    if (req.pics && req.pics.length > 0 && filesLeft > 0) {
      for (const pic of req.pics) {
        await savePic(pic, currentUser.id, false)
      }
    }
    // console.log('Profile pic: ' + profile_pic_url) // testing
    // Instantiate the Settings model class to update/create new Profile
    const settings = new SettingsModel({
      firstname,
      lastname,
      email,
      age: parseInt(age),
      gender: parseInt(gender),
      prefers: parseInt(prefers),
      bio,
      id: currentUser.id,
      confirmed: confirmed
    })

    // We could use the DB response, to check if the profile was created/updated
    const success = await settings.update()
    

    let msg = 'Profile successfully updated.'
    if (!confirmed) msg += " Don't forget to confirm your account!"

    if (success) {
      return res.status(200).json({
        type: 'SUCCESS',
        message: msg,
        confirmed: confirmed,
        profile_pic: profilePicUrl
      })
    } else {
      res.status(400).json({ message: 'woops' })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}
