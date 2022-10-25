// To verify JSON Web Tokens
const jwt = require('jsonwebtoken')

// To import our "secrets"
const dotenv = require('dotenv')
const path = require('path')

// Invoke dotenv, setting path to the secrets file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

exports.checkExpiredAccessToken = (req, res, next) => {
  const authHeader = req?.headers?.authorization

  if (authHeader) {
    const [key, accessToken] = authHeader.split(' ');

    // Check the header for the Access token.
    if (key !== 'Bearer') {
      res.status(400).json({ message: 'bad request' })
      return
    }

    try {
      jwt.verify(accessToken, process.env.SECRET_JWT_KEY)
      next()
    } catch (error) {
      /* If the Access Token is just expired, we catch the error
        and let the controller handle what happens next */
      if (error.name === 'TokenExpiredError') next()
      // For any other token verification error, party stops here.
      else res.status(403).json({ message: error })
    }
  } else {
    res.status(400).json({ message: 'bad request'})
  }
}
