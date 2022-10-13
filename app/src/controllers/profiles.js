const ProfileModel = require('../models/Profile')

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
        const [profileArr, _] = await ProfileModel.readOwn({ id: req.uid })
        // console.log(profile);
        res.status(200).json({
          profile: profileArr[0],
          profiled: profileArr[0].profiled
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
        const [profileArr, _] = await ProfileModel.readOne({ id: req.params.id })
        res.status(200).json({
          message: `profile ${req.params.id}`,
          profiled: profile[0].profiled,
          pics: []
        })
      } catch (error) {
        console.log(error)
        next(error)
      }
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
