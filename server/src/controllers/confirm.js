// Model to verify the Email Token in the DB.
const EmailTokenModel = require('../models/EmailToken')

// Model to set user's account to confirmed.
const AccountModel = require('../models/Account')

// To hash the Email Tokens before writing them to DB (later to locate them)
const crypto = require('crypto')

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

exports.confirm = async (req, res, next) => {
  try {
    const account = await AccountModel.readOne({ email: req.body.email})

    if (account?.confirmed) {
      return res.status(200).json({
        type: 'ERROR',
        message: 'Your account was already confirmed. You can log in!'
      })
    }
    // console.log('ACCOUNT: '+JSON.stringify(account));
    
    // Check if the Email token exists in the DB
    const emailToken = await EmailTokenModel.read({ email: req.body.email})
    // console.log('EMAIL TOKEN: '+JSON.stringify(emailToken));

    /* If there's no token in the DB linked to that email, or if the token
      received in the request parameters doesn't match the one in the DB */
    if (!emailToken || emailToken.token_hash !== req.body.token) {
      // console.log({ message: 'invalid token' }) // testing
      return res.status(200).json({
        type: 'ERROR',
        message: 'invalid token'
      })
    }

    // Check if the token is expired.
    if (emailToken.expires_at < Math.floor(Date.now() / 1000)) {
      // console.log({ message: 'expired token' }) // testing
      return res.status(200).send({
        type: 'ERROR',
        message: 'expired token'
      })
    }

    // Only if the token existed, delete it.
    if (emailToken)
      await EmailTokenModel.delete({ email: req.body.email })

    // confirm the user account,
    const accountConfirmed = await AccountModel.confirmAccount({
      email: req.body.email
    })

    // and send feedback in the response.
    if (accountConfirmed) {
      // console.log(`ACCOUNT Confirmed `) // testing
      return res.status(200).send({
        type: 'SUCCESS',
        message: 'account has been confirmed. You can log in.'
      })
    } else {
      // console.log(`ACCOUNT NOT Confirmed `) // testing
      return res.status(200).send({
        type: 'ERROR',
        message: 'sorry, our server is busy. Try a bit later ;-)'
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
      // console.log({ message: 'invalid email' }) // testing
      return res.status(200).json({
        type: 'ERROR',
        message: 'invalid email'
      })
    }

    // Check if the user's account is already confirmed!
    if (account.confirmed) {
      return res.status(200).json({
        type: 'ERROR',
        message: 'Your account is already confirmed. You can log in'
      })
    }

    // If is not, delete any preexisting token,
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
        message: 'Sorry, there was some issue generating your confirmation link!',
      })

    // Set the email options,
    const mailOptions = {
      from: process.env.WEBADMIN_EMAIL_ADDRESS,
      to: email,
      subject: 'Confirm your Matcha account',
      html: `<h1>Welcome to Matcha</h1>
      <p>
      Please, click <a href="http://localhost/confirm/${email}/${emailTokenHash}" >here</a> to confirm your account!
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