const NotifModel = require('../models/Notif')

// Log in the user, send tokens if credentials match, else...
exports.getNotifs = async (req, res, next) => {
  try {
    if (!req.uid) return
    // else console.log('UID: '+req.uid) // testing

    const notifs = await NotifModel.readAllUserNotifs({
      recipient: req.uid
    })

    // console.log('notifs controller: '+JSON.stringify(notifs));

    if (notifs.length > 0) {
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
    // console.log('NOTIF ID: '+req.body.notif_id) // testing
    if (!req.body.notif_id) return
    const success = await NotifModel.deleteNotif({
      notif_id: req.body.notif_id
    })

    if (success) {
      res.status(200).json({
        type: 'SUCCESS',
        message: 'successfully deleted',
        notif_id: req.body.notif_id
      })
      // console.log('NOTIF ID: '+req.body.notif_id) // testing
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}
