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

    const pics = profile?.pics ? profile?.pics.map(p => p.url) : []

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
        pics:             pics,
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
    // console.log('PROFILES controller: ' + JSON.stringify(settings.location)) // testing

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


    // console.log(`profiles controller(dist): ${req.query.distRange}`) // testing
    // console.log(`profiles controller(age): ${req.query.ageRange}`) // testing
    // console.log(`profiles controller: ${JSON.parse(req.query.distRange).lo} - ${JSON.parse(req.query.distRange).hi}`) // testing
    // Search defaults
    // const dist = { lo: 0, hi: 200 } // 20km radius

    // req.query.dist = null // testing

    // Normalize distance range (if user submitted one)
    let ageRange = null
    if (req.query.ageRange) {
      const loAge = Math.min(
        parseInt(JSON.parse(req.query.ageRange).lo),
        parseInt(JSON.parse(req.query.ageRange).hi)
      )
      const hiAge = Math.max(
        parseInt(JSON.parse(req.query.ageRange).lo),
        parseInt(JSON.parse(req.query.ageRange).hi)
      )
      ageRange = { lo: loAge, hi: hiAge }
    }
    ageRange ??= { lo: 18, hi: 99 } // Default 0-99 years old

    // Normalize fame range (if user submitted one)
    // console.log(`fameRange: ${req.query.fameRange}`);

    let fameRange = null
    if (req.query.fameRange) {
      const lo = Math.min(
        parseInt(JSON.parse(req.query.fameRange).lo),
        parseInt(JSON.parse(req.query.fameRange).hi)
      )
      const hi = Math.max(
        parseInt(JSON.parse(req.query.fameRange).lo),
        parseInt(JSON.parse(req.query.fameRange).hi)
      )
      fameRange = { lo: lo, hi: hi }
    }
    fameRange ??= { lo: 0, hi: 100 } // Default 0-100%
    // console.log(`fameRange: ${JSON.stringify(fameRange)}`);

    // Normalize distance range (if user submitted one)
    let distRange = null
    if (req.query.distRange) {
      const lo = Math.min(
        parseInt(JSON.parse(req.query.distRange).lo),
        parseInt(JSON.parse(req.query.distRange).hi)
      )
      const hi = Math.max(
        parseInt(JSON.parse(req.query.distRange).lo),
        parseInt(JSON.parse(req.query.distRange).hi)
      )
      distRange = { lo: lo, hi: hi }
    }
    distRange ??= { lo: 0, hi: 50 } // Default 50km radius

    // TODO: NORMALIZE ALSO THE FAME RATES!!!

    // TAGS
    // console.log('PROFILES controller (tags): ' + req.query.tags) // testing
    // console.log('PROFILES controller (type of tags): ' + Array.isArray(req.query.tags)) // testing

    // if (req.query.tags)
    //   req?.query?.tags.forEach(element => {
    //     console.log(element)
    //   })
    const tagIds = Array.isArray(req?.query?.tags) ? 
      req.query.tags.map(t => JSON.parse(t).value) : []
    // console.log(`profiles controller - tagIds: ${JSON.stringify(tagIds)}`)

    // Read all profiles, except the one of the user making the request!!!
    const profileList = await ProfileModel.readAll({
      id:       req.uid,
      page:     page,
      prefers:  settings.prefers === 2 ? [0, 1] : [settings.prefers],
      userA:    {
        lat: parseFloat(settings.location.lat),
        lng: parseFloat(settings.location.lng), 
      },
      dist:     {
        lo: +distRange.lo * 1000.0,
        hi: +distRange.hi * 1000.0
      },
      age:  ageRange,
      tags: JSON.stringify(tagIds), // we need a JSON array: [1, 3]
      fame: fameRange
    })

    const allTags = await TagModel.readAll()
    // console.log('ALL TAGS: '+JSON.stringify(allTags)) // testing

    // console.log('PROFILE LIST 1: '+JSON.stringify(profileList)) // testing
    const profiles = []
    if (profileList) {
      for (const prof of profileList) {
        // console.log(`${prof.id} - ${(prof.location / 1000).toFixed(2)}`)
        // console.log(`profiles controller: ${prof.fame}`)

        // Pull array of all the users liked by current user
        const allLikedUsers = await LikeModel.readAllLikedBy({ uid: req.uid })

        let tagLabels = []
        if (prof.tags)
          tagLabels = prof.tags.map(tag => allTags[tag - 1].label)

        const ago = dayjs().to(dayjs(prof.last_seen))

        profiles.push({
          ...prof,
          tags:           tagLabels,
          last_seen:      ago,
          you_like_user:  allLikedUsers.map(u => u.liked).includes(prof.id)
        })
      }
    }
    // console.log('PROFILE LIST 2: '+JSON.stringify(profiles)) // testing

    res.status(200).json({
      type:       'SUCCESS',
      message:    'there you go champ',
      tags:       allTags,
      profiles:   profiles,
      profiled:   settings.profiled, // We need this in both cases
      confirmed:  settings.confirmed
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}
