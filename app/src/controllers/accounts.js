// Models to verify credentials (username and pwd)
const AccountModel = require('../models/Account')
const EmailTokenModel = require('../models/EmailToken')

// To encrypt password
const bcrypt = require('bcrypt')

// To send Account Confirmation mail
const nodemailer = require('nodemailer')

// To hash the Email Tokens before writing them to DB (later to locate them)
const crypto = require('crypto')

// To import our "secrets"
const dotenv = require('dotenv')
const path = require('path')

// Invoke dotenv, setting path to the secrets file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

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

/*  Creates a Single Resource (user account) and returns
  it as an object in the response (if all went well).*/
exports.create = async (req, res, next) => {
  try {
    const {
      username,
      firstname,
      lastname,
      email,
      password
    } = req.body

    /*  Check if username exists in DB. This is just in case the user 
      used an email that already exists in our DB (we don't check for that 
      in our UI. */
    const emailExists = await AccountModel.readOne({ email })
    if (emailExists) {
      return res.status(200).json({
        type: 'ERROR',
        message: `${email} already exists in our Database.`
      })
    }

    // Check if username exists in DB (BS, we do check for that in the UI!)
    const usernameExists = await AccountModel.readOne({ username })
    if (usernameExists) {
      return res.status(200).json({
        type: 'ERROR',
        message: 'bad request'
      })
    }

    // Let's hash the password before writing it to the DB
    const salt = await bcrypt.genSalt(10)       // add a bit of salt
    const pwd_hash = await bcrypt.hash(password, salt)

    // console.log(firstname, pwd_hash); return;
    let account = new AccountModel({
      username,
      firstname,
      lastname,
      email,
      pwd_hash
    })

    // The create method returns true/false (success/failure creating account).
    const accountCreated = await account.create()
    if (accountCreated)
    {
      // Generate Email Token Hash
      const emailTokenHash = crypto.randomBytes(16).toString('hex')

      /* Delete old Email token from DB (if any). This can only happen if some 
        user generated a token for her email address, then changed her address, 
        and for some reason the token was not deleted and remained in DB.
        Can only be one per email! */
      await EmailTokenModel.delete({ email }) // Really remote chance!

      const unixtimeInSeconds = Math.floor(Date.now() / 1000)
      // console.log(unixtimeInSeconds + eval(process.env.EMAIL_TOKEN_EXP)) // test

      // Write new Email token to DB
      const emailToken = new EmailTokenModel({
        email,
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

      // Set Email options
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

      // console.log('account id: ' + dbResp.insertId) // testing
      res.status(200).json({
        type: 'SUCCESS',
        message: 'Account successfully created. Check your email for confirmation!',
      })
    } else {
      res.status(200).json({
        type: 'ERROR',
        message: 'Something went wrong.' })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.readUsername = async (req, res, next) => {
  const username = await AccountModel.readOne({
    username: req.query.username
  })

  // If the username doesn't exist in the DB, 'username' will be null.
  if (!username) {
    return res.status(200).json({ available: true })
    // console.log(username + ' available') // testing
  } else {
    res.status(200).json({ available: false })
    // console.log(username + ' not available') // testing
  }
}
