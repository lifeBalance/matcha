const NotifModel = require('../models/Notif')

// Log in the user, send tokens if credentials match, else...
exports.getNotifs = async (req, res, next) => {
  try {
    if (req.uid)
    console.log('UID: '+req.uid);
    else
    return
    const notifs = await NotifModel.readAllUserNotifs({
      to: req.uid
    })
    console.log('notifs controller: '+JSON.stringify(notifs));

    if (notifs.length > 0) {
      return res.status(200).json({
        type:     'SUCCESS',
        message:  'your notifs',
        notifs:   notifs || ['kaka', 'culo']
      })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.deleteNotif = async (req, res, next) => {
  try {
    const success = await NotifModel.deleteNotif(req.notif_id)

    if (success) {
      res.status(200).json({
        type: 'SUCCESS',
        message: 'successfully deleted'
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}
