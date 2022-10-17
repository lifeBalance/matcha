// Model to verify the Email Token in the DB.
const EmailTokenModel = require('../models/EmailToken')

// Model to set user's account to confirmed.
const AccountModel = require('../models/Account')

// To hash the Email Tokens before writing them to DB (later to locate them)
const crypto = require('crypto')

// To encrypt password
const bcrypt = require('bcrypt')

// To send Account Confirmation mail
const nodemailer = require('nodemailer')

// General settings for the "transporter" (function that sends emails)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.WEBADMIN_EMAIL_ADDRESS,
    pass: process.env.WEBADMIN_EMAIL_PASSWORD
  }
})

exports.reset = async (req, res, next) => {
  try {
    const account = await AccountModel.readOne({ email: req.body.email})

    if (!account) {
      return res.status(200).json({
        type: 'ERROR',
        message: 'Such email does NOT exist in our DB!'
      })
    }
    // console.log('ACCOUNT: '+JSON.stringify(account))    // testing

    // Check if the Email token exists in the DB
    const emailToken = await EmailTokenModel.read({ email: req.body.email})
    // console.log('EMAIL TOKEN: '+JSON.stringify(emailToken))    // testing

    /* If there's no token in the DB linked to that email, or if the token
      received in the request parameters doesn't match the one in the DB */
    if (!emailToken || emailToken.token_hash !== req.body.token) {
      // console.log({ message: 'invalid token' }) // testing
      return res.status(200).json({
        type: 'ERROR',
        message: 'invalid token'
      })
    }

    // Only if the token existed, delete it.
    if (emailToken)
      await EmailTokenModel.delete({ email: req.body.email })

    // Check if the token was expired.
    if (emailToken.expires_at < Math.floor(Date.now() / 1000)) {
      // console.log('WOOPS, expired token') // testing
      return res.status(200).send({
        type: 'ERROR',
        message: 'Sorry, expired token. Please, request new Email.'
      })
    }


    // Let's hash the password before writing it to the DB
    const salt = await bcrypt.genSalt(10)       // add a bit of salt
    const pwd_hash = await bcrypt.hash(req.body.password, salt)

    // Reset the account's password,
    const passwordReset = await AccountModel.resetPassword({
      email:    req.body.email,
      pwd_hash: pwd_hash
    })

    // and send feedback in the response.
    if (passwordReset) {
      // console.log('PASSWORD RESET!!') // testing
      return res.status(200).send({
        type: 'SUCCESS',
        message: 'Your password has been reset. You can log in.'
      })
    } else {
      // console.log('PASSWORD NOT RESET') // testing
      return res.status(200).send({
        type: 'ERROR',
        message: 'Sorry, our server is busy. Try a bit later ;-)'
      })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.requestEmail = async (req, res, next) => {
  try {
    const email = req.body.email

    // Check if the Email exists in the DB
    const account = await AccountModel.readOne({ email })

    // If the DB returns false, it means there's no user to that email.
    if (!account) {
      // console.log('RESET CONTROLLER: That email does not exist in our DB') // testing
      return res.status(200).json({
        type: 'ERROR',
        message: 'invalid email'
      })
    }

    // If is not, delete any preexisting Email token,
    await EmailTokenModel.delete({ email })

    // Generate Email Token Hash
    const emailTokenHash = crypto.randomBytes(16).toString('hex')

    // Compute current Unix time
    const unixtimeInSeconds = Math.floor(Date.now() / 1000)

    // Write new Email token to DB
    const emailToken = new EmailTokenModel({
      email: email,
      emailTokenHash,
      expires_at: unixtimeInSeconds + eval(process.env.EMAIL_TOKEN_EXP)
    })

    // Invoke method to write the Email Token to DB
    const emailTokenCreated = await emailToken.create()

    if (!emailTokenCreated)
      return res.status(200).json({
        type: 'ERROR',
        message: 'Sorry, there was some issue generating your reset link!',
      })

    // Set the email options,
    const mailOptions = {
      from: process.env.WEBADMIN_EMAIL_ADDRESS,
      to: email,
      subject: 'Reset your Matcha password',
      html: `<h1>It seems you forgot your password.</h1>
      <p>
      Please, click <a href="http://localhost/reset/${email}/${emailTokenHash}" >here</a> to reset your password!
      </p>`
    }

    // Send Account Confirmation Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error)
      else console.log('Email sent: ' + info.response)
    })

    // and send feedback in the response.
    res.status(200).send({
      type: 'SUCCESS',
      message: "email's on its way. Sit tight!"
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}