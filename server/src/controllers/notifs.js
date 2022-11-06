const NotifModel = require('../models/Notif')

// Log in the user, send tokens if credentials match, else...
exports.getNotifs = async (req, res, next) => {
  try {
    if (!req.uid) {
      return res.status(200).json({
        type:     'ERROR',
        message:  'no uid in token'
      })
    }

    const notifs = await NotifModel.readAllUserNotifs({
      recipient: req.uid
    })

    console.log('notifs controller: '+JSON.stringify(notifs)) // testing

    if (notifs) {
      return res.status(200).json({
        type:     'SUCCESS',
        message:  'your notifs',
        notifs:   notifs
      })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.deleteNotif = async (req, res, next) => {
  try {
    console.log('NOTIF ID: '+req.body.notif_id) // testing
    if (!req.body.notif_id) {
      return res.status(200).json({
        type:     'ERROR',
        message:  'no notif id supplied in the request'
      })
    }

    if (req.body.notif_id === 'all') {
      var success = await NotifModel.deleteAllNotifs({
        uid: req.uid
      })
    } else {
      var success = await NotifModel.deleteNotif({
        notif_id: req.body.notif_id
      })
    }

    if (success) {
      res.status(200).json({
        type: 'SUCCESS',
        message: 'successfully deleted',
        notif_id: req.body.notif_id
      })
      // console.log('NOTIF ID: '+req.body.notif_id) // testing
    } else {
      res.status(200).json({
        type: 'ERROR',
        message: 'we could not delete the notif/s'
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}
