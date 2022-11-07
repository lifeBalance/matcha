const ProfileModel = require('../models/Profile')
const SettingsModel = require('../models/Settings')
const PicModel = require('../models/Pic')
const TagModel = require('../models/Tag')
const LikeModel = require('../models/Like')

// To format "time ago" in a user-friendly way :-)
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
const { readAllLikedBy } = require('../models/Like')
TimeAgo.addDefaultLocale(en)

// Return a Single Resource(a profile identified by an ID)
exports.readOneProfile = async (req, res, next) => {
  /**
   *  From the authorization middleware we get the uid of the user requesting
   * the profile. If the user is trying to access her own profile, by writting
   * it in the browser's address bar: localhost/profiles/1, we don't show it.
   */
  if (req.uid == req.params.id) {
    return res.status(200).json({
      type: 'ERROR',
      message: 'Sorry, user not found :-('
    })
  }
  // console.log('ID of user requesting profile: ' + req.uid) // testing
  // console.log('ID of requested profile: ' + req.params.id) // testing

  // Pull array of all the users liked by current user
  const allLikedUsers = await readAllLikedBy({ uid: req.uid })

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
    console.log('all liked users: '+JSON.stringify(allLikedUsers)) // testing

    const youLikeUser = allLikedUsers.map(u => u.liked).includes(profile.id)

    return res.status(200).json({
      type: 'SUCCESS',
      message: 'there you go champ',
      profile: {
        id:               profile.id,
        username:         profile.username,
        firstname:        profile.firstname,
        lastname:         profile.lastname,
        age:              profile.age,
        gender:           profile.gender,
        prefers:          profile.prefers,
        bio:              profile.bio,
        profile_pic_url:  profilePicUrl,
        you_like_user:    youLikeUser,
        pics:             pics
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
    // Package for user-friendly 'last_seen' date formatting.
    const timeAgo = new TimeAgo('en-US')

    // Don't forget to check if the user requesting profiles is profiled!
    const settings = await SettingsModel.readSettings({ id: req.uid })
    // console.log('PROFILES controller: ' + JSON.stringify(settings)) // testing

    /* If the user requesting profiles is not profiled, we don't send her
      the Profile list. */
    if (!settings.profiled || !settings.confirmed) {
      return res.status(200).json({
        type:       'ERROR',
        message:    'Sorry, you are not authorized to check other profiles',
        profiled:   settings.profiled,
        confirmed:  settings.confirmed,
      })
    }
    /* Here we have to add things such as pagination, filters, etc. */
    const page = parseInt(req.query.page)

    // console.log('PAGE: '+page+' UID: '+req.uid)          // testing

    // Read all profiles, except the one of the user making the request!!!
    const profileList = await ProfileModel.readAll({
      id: req.uid,
      page: page
    })

    const allTags = await TagModel.readAll()
    // console.log('ALL TAGS: '+JSON.stringify(allTags)) // testing

    // console.log('PROFILE LIST 1: '+JSON.stringify(profileList)) // testing
    const profiles = []
    if (profileList) {
      for (const prof of profileList) {
        // Pull array of all the users liked by current user
        const allLikedUsers = await readAllLikedBy({ uid: req.uid })

        // Compute distance from current user using geolib package!
        // const distance = getDistance(
        //   {
        //     latitude: prof.location.lat,
        //     longitude: prof.location.lng
        //   },
        //   {
        //     latitude: settings.location.lat,
        //     longitude: settings.location.lng
        //   }
        // )

        let tagLabels = []
        if (prof.tags)
          tagLabels = prof.tags.map(tag => allTags[tag - 1].label)

        profiles.push({
          ...prof,
          tags:           tagLabels,
          last_seen:      timeAgo.format(Date.now() - prof.last_seen / 1000),
          you_like_user:  allLikedUsers.map(u => u.liked).includes(prof.id),
          location:       1234 // fake location for now...
        })
      }
    }
    // console.log('PROFILE LIST 2: '+JSON.stringify(profiles)) // testing

    res.status(200).json({
      type: 'SUCCESS',
      message: 'there you go champ',
      profiles: profiles,
      profiled: settings.profiled, // We need this in both cases
      confirmed: settings.confirmed
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}
