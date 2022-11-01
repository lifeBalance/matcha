const LikeModel = require('../models/Like')
const MatchModel = require('../models/Match')


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

    let notif_type = 'like' // default value of the notification
    console.log('Match? '+match) // testing
    if (match) {
      await MatchModel.writeMatch({
        liker: req.body.liker,
        liked: req.body.liked
      })
      notif_type = 'match'
    }
    // Send the access_token in the response body
    res.status(200).json({
      type:       'SUCCESS',
      message:    'Successfully liked!',
      toUser:     req.body.liked,
      fromUser:   req.body.liker,
      notif_type: notif_type
    })
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
