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
  // console.log('ID of user requesting profile: ' + req.uid) // testing
  // console.log('ID of requested profile: ' + req.params.id) // testing
  const path = url.parse(req.url).path
  console.log('backend -> path: '+path);

  if (req.uid == req.params.id && path !== '/settings') {
    return res.status(200).json({
      error: 'Sorry, user not found :-('
    })
  }

  /**
   *  We check the user REQUESTING the profile is not blocked (or has not 
   * blocked?) by the user with the REQUESTED PROFILE.
   */
  try {
    // The fields (metadata about results) are assigned to the '_'
    const [profileArr, _] = await ProfileModel.readOne({ id: req.params.id })
    console.log(JSON.stringify(profileArr))
    // If there's no profile with that UID, send feedback about it.
    if (profileArr.length === 0) {
      res.status(200).json({
        error: 'Sorry, user not found :-('
      })
      return
    }

    const [pics_arr, fieldsr] = await PicModel.readAll({
      id: req.uid
    })
  
    const pics = []
    if (pics_arr.length > 0) for (const pic of pics_arr) pics.push(pic.url)
  
    console.log(profileArr[0]);
    // Check if user has a Profile picture set in DB
    const [prof_pic_arr, fields3] = await PicModel.readProfilePic({
      id: req.params.id
    })
    console.log(prof_pic_arr[0].url);


    res.status(200).json({
      profile: {
        username: profileArr[0].usertname,
        firstname: profileArr[0].firstname,
        lastname: profileArr[0].lastname,
        age: profileArr[0].age,
        gender: profileArr[0].gender,
        prefers: profileArr[0].prefers,
        bio: profileArr[0].bio,
        profile_pic_url: prof_pic_arr[0].url
      },
      pics: pics // gotta read filesystem and send the urls...
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
