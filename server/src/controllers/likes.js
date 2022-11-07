const LikeModel = require('../models/Like')
const MatchModel = require('../models/Match')
const NotifModel = require('../models/Notif')
const ProfileModel = require('../models/Profile')
const io = require('../../index')

// Log in the user, send tokens if credentials match, else...
exports.like = async (req, res, next) => {
  try {
    if (!req?.body?.liker || !req?.body?.liked || !req?.uid) {
      return res.status(200).json({
        type:       'ERROR',
        message:    'bad request'
      })
    }

    // Check if the like already exists (we want NO duplicates)
    const likeExists = await LikeModel.readLike({
      liker: req.body.liker,
      liked: req.body.liked
    })

    if (likeExists) {
      return res.status(200).json({
        type:       'ERROR',
        message:    'bad request (like already exists)'
      })
    }

    const liker = await ProfileModel.readOne({
      id: req.uid
    })

    // Find the profile pic
    const likerProfilePic = liker.pics.find(pic => pic.profile === 1)

    // Write the like
    const ret = await LikeModel.writeLike({
      liker: req.body.liker,
      liked: req.body.liked
    })

    // Check if there's a row with the inverted like (a match!)
    const match = await LikeModel.readLike({
      liker: req.body.liked,
      liked: req.body.liker,
    })

    if (match) {
      const liked = await ProfileModel.readOne({
        id: req.body.liked
      })

      // Find the profile pic
      const likedProfilePic = liked.pics.find(pic => pic.profile === 1)

      await MatchModel.writeMatch({
        // order doesn't matter here; a match is a match ;-)
        liker: req.body.liker,
        liked: req.body.liked
      })

      // Write the match notification to the liker user!
      const notif = await NotifModel.writeNotif({
        recipient:   req.body.liked,
        type:       'match',
        content: {
          from:       liker.id,
          username:   liker.username,
          profilePic: likerProfilePic.url
        }
      })

      // Write the match notification to the liked user!
      const notifId = await NotifModel.writeNotif({
        recipient:   req.body.liker,
        type:       'match',
        content: {
          from:       liked.id,
          username:   liked.username,
          profilePic: likedProfilePic.url
        }
      })

      io.io.to(liked.id).emit('notify', {
        id:         notifId,
        type:       'match',
        from:       liker.id,
        username:   liker.username,
        profilePic: likerProfilePic.url
      })

      io.io.to(liker.id).emit('notify', {
        id:         notifId,
        type:       'match',
        from:       liked.id,
        username:   liked.username,
        profilePic: likedProfilePic.url
      })

      // The response contains the necessary intel to inform both users!
      res.status(200).json({
        type:       'SUCCESS',
        message:    'Successfully matched!',
        like:       true
      })
    } else {
      // Write the match notification to the liked user!
      const notifId = await NotifModel.writeNotif({
        recipient:   req.body.liked,
        type:       'like',
        content: {
          from:       liker.id,
          username:   liker.username,
          profilePic: likerProfilePic.url
        }
      })

      // Send real time notif to the liked user!
      io.io.to(req.body.liked).emit('notify', {
        id:         notifId,
        type:       'match',
        from:       liker.id,
        username:   liker.username,
        profilePic: likerProfilePic.url
      })

      res.status(200).json({
        type:       'SUCCESS',
        message:    'Successfully liked!',
        like:       true
      })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.unlike = async (req, res, next) => {
  try {
    // Check we have the necessary ingredients
    if (!req?.body?.liker || !req?.body?.liked || !req?.uid) {
      return res.status(200).json({
        type:       'ERROR',
        message:    'bad request'
      })
    }

    // Then delete the like
    await LikeModel.deleteLike({
      liker: req.body.liker,
      liked: req.body.liked
    })

    // Check if there's a match for the couple of users
    const matchId = await MatchModel.readMatchId({
      liker: req.body.liker,
      liked: req.body.liked,
    })

    // If there's a match, delete it...
    if (matchId) {
      await MatchModel.deleteMatchById({ matchId })

      // Pull the "unliker" from the DB
      const liker = await ProfileModel.readOne({ id: req.body.liker })

      // Extract the "unliker" profile picture
      const likerProfilePic = liker.pics.find(pic => pic.profile === 1)

      // Write the notification to the DB
      const notifId = await NotifModel.writeNotif({
        recipient:   req.body.liked,
        type:       'unmatch',
        content: {
          from:       liker.id,
          username:   liker.username,
          profilePic: likerProfilePic.url
        }
      })

      // And notify the "unliked" user that has been unmatched
      io.io.to(req.body.liked).emit('notify', {
        id:         notifId,
        type:       'match',
        from:       liker.id,
        username:   liker.username,
        profilePic: likerProfilePic.url
      })
    }

    res.status(200).json({
      type:     'SUCCESS',
      message:  'successfully unliked',
      like:     false
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
