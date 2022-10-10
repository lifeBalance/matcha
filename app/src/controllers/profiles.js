const ProfileModel = require('../models/Profile')
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Return a Single Resource(a profile identified by an ID)
exports.readOneProfile = async (req, res, next) => {
    /**
     *  From the authorization middleware we get the uid of the user requesting
     * the profile. If that uid matches the one in the Request Parameters, it
     * means the user is trying to check her own profile, so we send them more
     * information than to a user checking OTHER USER profile.
     */
    console.log(req)
    if (req.uid == req.params.id) { // dont' use strict equality: integer !== string
      try {
        const [profile, _] = await ProfileModel.readOwn({ id: req.uid })
        console.log(profile);
        res.status(200).json({
          profile: profile[0]
        })
      } catch (error) {
        console.log(error)
        next(error)
      }
    } else {
      /**
       *  We check the user REQUESTING the profile is not blocked (or has not 
       * blocked?) by the user with the REQUESTED PROFILE.
       */
      try {
        // The fields (metadata about results) are assigned to the '_'
        const [profile, _] = await ProfileModel.readOne({ id: req.params.id })
        res.status(200).json({ message: `profile ${req.params.id}`})
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
}

// Return a Collection of Resources
exports.readAllProfiles = async (req, res, next) => {
  try {
    const [profiles, _] = await ProfileModel.readAll()
    res.status(200).json({ profiles: profiles })
  } catch(error) {
    console.log(error)
    next(error)
  }
}
