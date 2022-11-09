const ProfileModel = require('../models/Profile')
const SettingsModel = require('../models/Settings')
const PicModel = require('../models/Pic')
const TagModel = require('../models/Tag')
const LikeModel = require('../models/Like')
const MatchModel = require('../models/Match')
const geolib = require('geolib')

// To format "time ago" in a user-friendly way :-)
const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

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

  try {
    // Pull the profile of the current user
    const currentUser = await ProfileModel.readOne({ id: req.uid })
    // Pull the profile of the desired user
    const profile = await ProfileModel.readOne({ id: req.params.id })

    // console.log(JSON.stringify(profile)) // testing
    // Pull array of all the users liked by current user
    const allLikedUsers = await LikeModel.readAllLikedBy({ uid: req.uid })

  /**
   *  We check the user REQUESTING the profile is not blocked (or has not 
   * blocked?) by the user with the REQUESTED PROFILE.
   */
    const profilePicUrl = await PicModel.readProfilePicUrl({
      id: req.params.id
    })
    // console.log('PROFILE PIC: '+profilePicUrl) // testing
    console.log('all liked users: '+JSON.stringify(allLikedUsers)) // testing

    const youLikeUser = allLikedUsers.map(u => u.liked).includes(profile.id)

    // Tags
    const allTags = await TagModel.readAll()
    let tagLabels = []
    if (profile.tags)
      tagLabels = profile.tags.map(tag => allTags[tag - 1].label)

    // Compute distance from current user using geolib package!
    const distance = geolib.getDistance(
      {
        latitude: profile.location.lat,
        longitude: profile.location.lng
      },
      {
        latitude: currentUser.location.lat,
        longitude: currentUser.location.lng
      }
    )

    // Compute the user's rating as ratio of matches/liked users
    const matches = await MatchModel.readAllMatches({ uid: req.uid })
    const rated = matches.length === 0 ? 0 : allLikedUsers.length * 100 / matches.length

    // Last seen in a user-friendly way
    const ago = dayjs().to(dayjs(profile.last_seen))

    return res.status(200).json({
      type: 'SUCCESS',
      message: 'there you go champ',
      profile: {
        id:               profile.id,
        username:         profile.username,
        firstname:        profile.firstname,
        lastname:         profile.lastname,
        online:           profile.online,
        last_seen:        ago,
        rated:            rated.toFixed(1),
        age:              profile.age,
        gender:           profile.gender,
        prefers:          profile.prefers,
        bio:              profile.bio,
        profile_pic_url:  profilePicUrl,
        you_like_user:    youLikeUser,
        tags:             tagLabels,
        pics:             profile.pics.map(p => p.url),
        location:         (distance / 1000).toFixed(1)
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
        const allLikedUsers = await LikeModel.readAllLikedBy({ uid: req.uid })

        // Compute distance from current user using geolib package!
        const distance = geolib.getDistance(
          {
            latitude: prof.location.lat,
            longitude: prof.location.lng
          },
          {
            latitude: settings.location.lat,
            longitude: settings.location.lng
          }
        )

        // Compute the user's rating as ratio of matches/liked users
        const matches = await MatchModel.readAllMatches({ uid: req.uid })
        const rated = matches.length === 0 ? 0 : allLikedUsers.length * 100 / matches.length

        let tagLabels = []
        if (prof.tags)
          tagLabels = prof.tags.map(tag => allTags[tag - 1].label)

        const ago = dayjs().to(dayjs(prof.last_seen))

        profiles.push({
          ...prof,
          tags:           tagLabels,
          last_seen:      ago,
          you_like_user:  allLikedUsers.map(u => u.liked).includes(prof.id),
          location:       (distance / 1000).toFixed(2),
          rated:          rated.toFixed(1)
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
