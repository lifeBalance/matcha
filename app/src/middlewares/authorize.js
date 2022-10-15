// To verify JSON Web Tokens
const jwt = require('jsonwebtoken')

// To import our "secrets"
const dotenv = require('dotenv')
const path = require('path')

// Invoke dotenv, setting path to the secrets file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

exports.authorize = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const [key, accessToken] = authHeader.split(' ')

    if (key !== 'Bearer') {
      // console.log(JSON.stringify({ message: 'bad request' })) // testing
      res.status(400).json({ message: 'bad request' })
      return
    }

    try {
      /*  At the same time we verify the Access Token, we hang the 'sub'
        claim (which contains the user id) in the Request object. */
      req.uid = jwt.verify(accessToken, process.env.SECRET_JWT_KEY).sub
      next()
    } catch (error) {
      /* If the Access Token is just expired, we catch the error
        and send a 401 status code, to trigger a "silent token refresh" 
        in the front-end. */
      if (error.name === 'TokenExpiredError') {
        return res.status(200).json({
          type: 'ERROR',
          message: error.message
        })
      }
      // For any other token verification error, party stops here with 403.
      else res.status(403).json({ message: error })
    }
  } else {
    res.status(400).json({ message: 'bad request'})
  }
}
