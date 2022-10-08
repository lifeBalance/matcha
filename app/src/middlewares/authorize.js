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
      const [key, accessToken] = authHeader.split(' ');

      if (key !== 'Bearer') {
        res.status(400).json({ message: 'bad request' })
        return
      }
      jwt.verify(accessToken, process.env.SECRET_JWT_KEY, (err, payload) => {
          // jwt.verify checks both that the token is legit and not expired
          if (err) return res.status(403).json({ message: 'invalid token'})
          else {
            // console.log(payload) // testing

            // Attaching properties to the request object is the way to 
            // pass data to next middleware or controller
            req.uid = payload.sub // The 'sub' claim contains the uid
            next()
          }
      })
  } else {
    res.status(400).json({ message: 'bad request'})
  }
}
