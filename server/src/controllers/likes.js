const LikeModel = require('../models/Like')
const MatchModel = require('../models/Match')
const NotifModel = require('../models/Notif')
const ProfileModel = require('../models/Profile')

// Log in the user, send tokens if credentials match, else...
exports.like = async (req, res, next) => {
  try {
    console.log(`LIKES: UID${req.uid}`) // testing
    console.log(`LIKES: BODY - ${JSON.stringify(req.body)}`) // testing

    if (!req.body?.liker || !req.body?.liked) {
      return res.status(200).json({
        type:       'ERROR',
        message:    'bad request (no body in request)'
      })
    }

    // Check if the like already exists
    const exists = await LikeModel.readLike({
      liker: req.body.liker,
      liked: req.body.liked
    })

    if (exists) {
      return res.status(200).json({
        type:       'ERROR',
        message:    'bad request (like already exists)'
      })
    }

    const liker = await ProfileModel.readOne({
      id: req.uid
    })

    // Find the profile pic
    const profilePic = liker.pics.find(pic => pic.profile === 1)

    // Write the like
    const result = await LikeModel.writeLike({
      liker: req.body.liker,
      liked: req.body.liked
    })

    // Check if there's a row with the inverted like (a match!)
    const match = await LikeModel.readLike({
      liker: req.body.liked,
      liked: req.body.liker,
    })

    // Default value of the notification
    let notif_type = 'like'

    console.log('Match? '+match) // testing
    if (match) {
      const liked = await ProfileModel.readOne({
        id: req.body.liked
      })

      // Find the profile pic
      const profilePic2 = liked.pics.find(pic => pic.profile === 1)

      await MatchModel.writeMatch({
        // order doesn't matter here; a match is a match ;-)
        liker: req.body.liker,
        liked: req.body.liked
      })
      notif_type = 'match'

      // Write the match notification to the liker user!
      const notif = await NotifModel.writeNotif({
        recipient:   req.body.liked,
        content: {
          from:       req.body.liker,
          username:   liker.username,
          profilePic: profilePic,
          type:       'match'
        }
      })

      // Write the match notification to the liked user!
      const notifId = await NotifModel.writeNotif({
        recipient:   req.body.liker,
        content: {
          from:       liked.id,
          username:   liked.username,
          profilePic: profilePic2,
          type:       'match'
        }
      })
      res.status(200).json({
        type:       'SUCCESS',
        message:    'Successfully liked!',
        notif: {
          id:         notifId,
          type:       'match',
          from:       liker.id,
          to:         req.body.to,
          username:   liker.username,
          profilePic
        }
      })
    } else {
      // Write the match notification to the liked user!
      const notifId = await NotifModel.writeNotif({
        recipient:   req.body.liked,
        content: {
          from:       liker.id,
          username:   liker.username,
          profilePic: profilePic,
          type:       'like'
        }
      })

      res.status(200).json({
        type:       'SUCCESS',
        message:    'Successfully liked!',
        notif: {
          id:         notifId,
          to:         req.body.to,
          from:       liker.id,
          username:   liker.username,
          profilePic,
          type:       'like' // could be 'like' or 'match'
        }
      })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.unlike = async (req, res, next) => {
  try {
    res.status(200).json({
      type: 'SUCCESS',
      message: 'successfully liked out'
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
