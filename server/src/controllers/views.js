const NotifModel = require('../models/Notif')
const ProfileModel = require('../models/Profile')
const io = require('../../index')

// Log in the user, send tokens if credentials match, else...
exports.postView = async (req, res, next) => {
  try {
    console.log(`req.body.to: ${req.body.to} req.uid: ${req.uid}`);
    if (!req.body.to || !req.uid) {
      return res.status(200).json({
        type:     'ERROR',
        message:  'bad request'
      })
    }

    const viewAdded = await ProfileModel.increaseViews({
      uid: req.body.to
    })

    // Fetch viewer info (need username and profile pic)
    const viewer = await ProfileModel.readOne({
      id: req.uid
    })
    // console.log('views controller: '+JSON.stringify(viewer));

    // Find the profile pic
    const profilePic = viewer.pics ? viewer.pics.find(pic => pic.profile === 1) : ''
    // console.log(`profile pic: ${JSON.stringify(profilePic)}`) // testing

    // If the view was written to the DB
    if (viewAdded) {
      // Write also the notification to the DB
      var notifId = await NotifModel.writeNotif({
        recipient:    req.body.to,
        type:         'view',
        content: {
          from:       req.uid,
          username:   viewer.username,
          profilePic: profilePic.url,
        }
      })
    }

    if (notifId) {
      io.io.to(req.body.to).emit('notify', {
        id:         notifId,
        type:       'view',
        from:       req.uid,
        username:   viewer.username,
        profilePic: profilePic.url
      })

      return res.status(200).json({
        type:     'SUCCESS',
        message:  'Successfully viewed!'
      })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}
