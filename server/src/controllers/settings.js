// To create/update Profile Settings (one model could deal with several tables).
const SettingsModel = require('../models/Settings')
const AccountModel = require('../models/Account')
const LikeModel = require('../models/Like')
const MatchModel = require('../models/Match')

// Let's pull also the Pic model for the profile pictures
const PicModel = require('../models/Pic')

// Let's pull also the Tag model for the tags
const TagModel = require('../models/Tag')

// Utility for generate Email token and send Account Confirmation email
const { tokenAndEmail } = require('../utils/tokenAndEmail')

// For saving/deleting pics to/from DB and filesystem
const { savePic, deletePic } = require('../utils/picUtils')

// Returns Email field and UID after authenticating user's Access Token
exports.getSettings = async (req, res, next) => {
  const settings = await SettingsModel.readSettings({ id: req.uid })

  if (!settings) {
    return res.status(200).json({
      type: 'ERROR',
      message: 'Sorry, requested user does not exist'
    })
  }
  // console.log('SETTINGS: '+JSON.stringify(settings))  // testing

  /* The 'readProfilePicUrl' method returns the URL of the user's profile pic
  (If the user has a Profile pic) otherwise, null (falsey value) */
  const profile_pic_url = await PicModel.readProfilePicUrl({
    id: req.uid
  })

  // Pull from the DB ALL of the pic URLs (including the one for the Profile)
  const extraPics = await PicModel.readExtraPics({ id: req.uid })
  const allPics = await PicModel.readAll({ id: req.uid })

  const fakeBio = 'Some users prefer to keep an air of mistery about themselves...'

  /* The following variable is to convert the 'manual' nested
    property to Boolean. No big deal.
  */
  const location = {
    lat: settings.location.lat,
    lng: settings.location.lng,
    manual: settings.location.manual === 'true' || false,
  }

  // Let's query the DB for ALL the available Tags.
  const allTags = await TagModel.readAll()
  // console.log(`allTags: ${JSON.stringify(allTags)}`)  // testing

  // Let's query the DB for the user Tags.
  const userTags = await TagModel.readTagsArray(settings.tags)
  // console.log(`USER TAGS: ${userTags}`) // testing

  // Pull array of all the users liked by current user
  const allLikedUsers = await LikeModel.readAllLikedBy({ uid: req.uid })

  // Compute the user's rating as ratio of matches/liked users
  const matches = await MatchModel.readAllMatches({ uid: req.uid })
  const rated = matches.length === 0 ? 0 : allLikedUsers.length * 100 / matches.length

  // Send Account information to prepopulate fields in the Profile form.
  res.status(200).json({
    uid:            req.uid, // send it just in case...
    username:       settings.username,
    firstname:      settings.firstname,
    lastname:       settings.lastname,
    email:          settings.email,
    age:            settings.age,
    gender:         settings.gender,
    prefers:        settings.prefers,
    rated:          rated,
    bio:            settings.bio || fakeBio,
    profile_pic:    profile_pic_url,
    extraPics:      extraPics,
    allPics:        allPics,
    pics_left:      4 - extraPics.length,
    location:       location,
    availableTags:  allTags,
    userTags:       userTags
  })
}

// Creates a Single Resource (a user Profile)
exports.updateSettings = async (req, res, next) => {
  try {
    /*  Pull from DB the user with the uid that we got 
      from the authorization middleware (if there's one) */
    const currentUser = await SettingsModel.readSettings({ id: req.uid })
    // console.log('currentUser: '+JSON.stringify(currentUser)) // testing
    if (!currentUser) {
      // console.log('Sorry, requested user does not exist') // testing
      return res.status(200).json({
        type: 'ERROR',
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
      bio,
      coords,
      manual,
      filesToDelete,
      tags
    } = req.fields

    // Let's parse the location (coords sent as a JSON string) <== Mb in middleware?
    const location = { ...JSON.parse(coords), manual: manual }
    
    // TODO:
    // Make sure the user doesn't try to write more than 5 tags to DB (count preexisting ones)
    // Let's parse the tags (sent as a JSON string) <== Mb in middleware?
    const tagList = JSON.parse(tags)
    const tagIdList = [] // This is what we'll write to the `users` table
    // console.log(`Tags: ${JSON.stringify(tagList)}`) // testing
    for (const tag of tagList) {
      if (tag.hasOwnProperty('__isNew__')) {
        const tagId = await TagModel.writeOne(tag.label)
        // console.log(`NEW TAG: ${tag.label}`) // Write the tag to DB (get id of row)
        tagIdList.push(tagId)
      } else {
        tagIdList.push(tag.value)
      }
      // console.log(`TAG ID list: ${tagIdList}`)
    }

    // The array of files to delete (it may be empty)
    const deleteList = JSON.parse(filesToDelete)
    // console.log(deleteList) // testing
    // console.log(`extraPics: ${JSON.stringify(req.extraPics)}`) // testing
    // console.log(`profilePic: ${JSON.stringify(req.profilePic)}`) // testing

    // console.log('SETTINGS - FORM FIELDS: '+JSON.stringify(req.fields)) // testing
    // console.log('SETTINGS - Location: '+JSON.stringify(location)) // testing

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
      const anotherUser = await AccountModel.readOne({ email: email })

      // console.log('SETTINGS - Check new email: ' + JSON.stringify(rowArr2)) // testing

      // If there's another user (with another UID) that is using that email...
      if (anotherUser) {
        return res.status(200).json({
          type: 'ERROR',
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
    if (req.profilePic) {
      const oldProfilePic = await PicModel.readProfilePicUrl({
        id: currentUser.id
      })

      // console.log(`oldProfilePic: ${oldProfilePic}`)
      // Delete the OLD profile pic, if any (from filesystem and DB).
      if (oldProfilePic) { await deletePic(oldProfilePic, currentUser.id) }

      /*  Write the NEW profile pic (to filesystem and DB), and 
        store its URL (that we'll send back in the response. */
      var profilePicUrl = await savePic(req.profilePic, currentUser.id, true)
      // console.log(`profilePicUrl (settings controller): ${profilePicUrl}`);
    }

    /* Let's count how many pics in total the user already has in DB. */
    const extraPicsAmount = await PicModel.countExtraPics({ id: currentUser.id })

    // Check we don't surpass the 4 pics limit.
    const filesLeft = 4 - extraPicsAmount + deleteList.length
    // console.log(`picsAmount: ${extraPicsAmount}`) // testing
    // console.log(`deleteList: ${deleteList.length}`) // testing
    // console.log(`Files Left: ${filesLeft}`) // testing

    // If there are pics to DELETE in the submitted form, delete them too!
    if (deleteList && deleteList.length > 0) {
      for (const pic of deleteList) {
        // console.log(`About to delete: ${pic}`)  // testing
        await deletePic(pic, currentUser.id)
      }
    }

    // If there are more pics in the submitted form, save them too!
    if (req.extraPics && req.extraPics.length > 0 && filesLeft > 0) {
      for (const pic of req.extraPics) {
        await savePic(pic, currentUser.id, false)
      }
    }
    // console.log('SETTINGS - Profile pic: ' + profilePicUrl) // testing
    // Instantiate the Settings model class to update/create new Profile
    const settings = new SettingsModel({
      firstname,
      lastname,
      email,
      age:        parseInt(age),
      gender:     parseInt(gender),
      prefers:    parseInt(prefers),
      bio,
      id:         currentUser.id,
      confirmed:  confirmed,
      location:   location,
      tags:       tagIdList
    })

    // We could use the DB response, to check if the profile was created/updated
    const success = await settings.update()
    // console.log('SETTINGS UPDATED? '+success) // testing

    let msg = 'Profile successfully updated.'
    if (!confirmed) msg += " Don't forget to confirm your account!"

    if (success) {
      // console.log('SETTINGS: SUCCESS')  // testing
      return res.status(200).json({
        type: 'SUCCESS',
        message: msg,
        confirmed: confirmed,
        profiled: 1,
        profile_pic: profilePicUrl || ''
      })
    } else {
      res.status(200).json({
        type: 'ERROR',
        message: 'woops'
      })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}
