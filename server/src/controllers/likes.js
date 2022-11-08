const LikeModel = require('../models/Like')
const MatchModel = require('../models/Match')
const ChatModel = require('../models/Chat')
const NotifModel = require('../models/Notif')
const ProfileModel = require('../models/Profile')
const io = require('../../index')

// Log in the user, send tokens if credentials match, else...
exports.like = async (req, res, next) => {
  try {
    if (!req?.uid || !req?.body?.profileId) {
      return res.status(200).json({
        type:       'ERROR',
        message:    'bad request'
      })
    }
    
    // Check if the like already exists (we want NO duplicates)
    const likeExists = await LikeModel.readLike({
      liker: req.uid,
      liked: req.body.profileId
    })

    if (likeExists) {
      return res.status(200).json({
        type:       'ERROR',
        message:    'bad request (like already exists)'
      })
    }

    // Pull info from the liker from DB (to write the notification)
    const liker = await ProfileModel.readOne({
      id: req.uid
    })
    // Find the profile pic
    const likerProfilePic = liker.pics.find(pic => pic.profile === 1)

    // Write the like
    const ret = await LikeModel.writeLike({
      liker: req.uid,
      liked: req.body.profileId
    })

    // Check if there's a row with the inverted like (a match!)
    const match = await LikeModel.readLike({
      liker: req.body.profileId,
      liked: req.uid,
    })

    if (match) {
      /* If there's a match, we'll need to pull some info from
        the liked profile, in order to notify the current user. */
      const liked = await ProfileModel.readOne({
        id: req.body.profileId
      })

      // Find the profile pic
      const likedProfilePic = liked.pics.find(pic => pic.profile === 1)

      await MatchModel.writeMatch({
        // order doesn't matter here; a match is a match ;-)
        liker: req.uid,
        liked: req.body.profileId
      })

      // Write the match notification for the LIKED user to the DB!
      const notif = await NotifModel.writeNotif({
        recipient:   req.body.profileId,
        type:       'match',
        content: {
          from:       liker.id,
          username:   liker.username,
          profilePic: likerProfilePic.url
        }
      })

      // Write the match notification for the LIKER user to the DB!
      const notifId = await NotifModel.writeNotif({
        recipient:   req.uid,
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
        recipient:   req.body.profileId,
        type:       'like',
        content: {
          from:       liker.id,
          username:   liker.username,
          profilePic: likerProfilePic.url
        }
      })

      // Send real time notif to the liked user!
      io.io.to(req.body.profileId).emit('notify', {
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
    if (!req?.uid || !req?.body?.profileId) {
      return res.status(200).json({
        type:       'ERROR',
        message:    'bad request'
      })
    }

    // Then delete the like
    await LikeModel.deleteLike({
      liker: req.uid,
      liked: req.body.profileId
    })

    // Check if there's a match for the couple of users
    const matchId = await MatchModel.readMatchId({
      liker: req.uid,
      liked: req.body.profileId,
    })

    // If there's a match, delete it...
    if (matchId) {
      await MatchModel.deleteMatchById({ matchId })

      // And delete also the chat linked to that match (if any)
      await ChatModel.deleteChatById({ chatId: matchId })

      // Pull the "unliker" from the DB to notify the unliked
      const liker = await ProfileModel.readOne({ id: req.uid })

      // Extract the "unliker" profile picture
      const likerProfilePic = liker.pics.find(pic => pic.profile === 1)

      // Write the notification to the DB
      const notifId = await NotifModel.writeNotif({
        recipient:   req.body.profileId,
        type:       'unmatch',
        content: {
          from:       liker.id,
          username:   liker.username,
          profilePic: likerProfilePic.url
        }
      })

      // And notify the "unliked" user that has been unmatched
      io.io.to(req.body.profileId).emit('notify', {
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
