const ProfileModel = require('../models/Profile')
const PicModel = require('../models/Pic')
const url = require('url')

// Return a Single Resource(a profile identified by an ID)
exports.readOneProfile = async (req, res, next) => {
  /**
   *  From the authorization middleware we get the uid of the user requesting
   * the profile. If the user is trying to access her own profile, by writting
   * it in the browser's address bar: localhost/profiles/1, we don't show it.
   */
  if (req.uid == req.params.id) {
    return res.status(200).json({
      error: 'Sorry, user not found :-('
    })
  }
  // console.log('ID of user requesting profile: ' + req.uid) // testing
  // console.log('ID of requested profile: ' + req.params.id) // testing

  /**
   *  We check the user REQUESTING the profile is not blocked (or has not 
   * blocked?) by the user with the REQUESTED PROFILE.
   */
  try {
    const profile = await ProfileModel.readOne({ id: req.params.id })
    // console.log(JSON.stringify(profile)) // testing

    const pics = await PicModel.readAll({ id: req.params.id })
    // console.log('PICS: '+JSON.stringify(pics)) // testing

    const profilePicUrl = await PicModel.readProfilePicUrl({
      id: req.params.id
    })
    // console.log('PROFILE PIC: '+profilePicUrl) // testing


    return res.status(200).json({
      status: 'SUCCESS',
      message: 'there you go champ',
      profile: {
        username: profile.username,
        firstname: profile.firstname,
        lastname: profile.lastname,
        age: profile.age,
        gender: profile.gender,
        prefers: profile.prefers,
        bio: profile.bio,
        profile_pic_url: profilePicUrl,
        pics: pics
      }
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// Return a Collection of Resources
exports.readAllProfiles = async (req, res, next) => {
  try {
    // Don't forget to check if the user requesting profiles is profiled!
    const [ownProfileArr, fields] = await ProfileModel.readOwn({ id: req.uid })

    // console.log(JSON.stringify(ownProfileArr)) // testing

    // If the user is not profiled, we don't send the Profile list in the 
    // response. Instead we just send that is NOT PROFILED!
    if (!ownProfileArr[0].profiled) {
      // console.log('is profiled? '+ownProfileArr[0].profiled)
      res.status(200).json({ profiled: ownProfileArr[0].profiled })
      return
    }

    const [profiles, fields2] = await ProfileModel.readAll()
    // console.log('is profiled? '+ownProfileArr[0].profiled)
    res.status(200).json({ 
      profiles: profiles,
      profiled: ownProfileArr[0].profiled // We need this in both cases
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}
