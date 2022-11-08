const BlockModel = require('../models/Block')
const LikeModel = require('../models/Like')
const MatchModel = require('../models/Match')

exports.blockUser = async (req, res, next) => {
  try {
    if (!req?.uid || !req?.body?.profileId) {
      return res.status(200).json({
        type:       'ERROR',
        message:    'bad request'
      })
    }

    // Delete match if any
    await MatchModel.deleteMatch({
      liker: req.uid,
      liked: req.body.profileId
    })

    // Delete like if any
    await LikeModel.deleteLikeNoOrder({
      liker: req.uid,
      liked: req.body.profileId
    })

    // Write blocked use to DB
    const ret = await BlockModel.writeBlock({
      blocker: req.uid,
      blocked: req.body.profileId
    })

    return res.status(200).json({
      type:       'SUCCESS',
      message:    `user ${req.uid} blocked user ${req.body.profileId}`
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}
