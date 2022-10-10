const EmailTokenModel = require('../models/EmailToken')

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

/**
 *  This function:
 * 1. generates an Email Token.
 * 2. Stores it in the DB (deleting pre-existing ones, if any).
 * 3. Send it to the user in a "Confirm Your Account" email.
 * 
 * Args:
 *  - Email of the user.
 * Return:
 *  - true for success.
 *  - false for failure.
 */
exports.tokenAndEmail = async (email) => {

  // Generate Email Token Hash
  const emailTokenHash = crypto.randomBytes(16).toString('hex')

  // Delete old Email token from DB (if any). Can only be one per email!
  await EmailTokenModel.delete({ email })

  const unixtimeInSeconds = Math.floor(Date.now() / 1000)
  // console.log(unixtimeInSeconds + eval(process.env.EMAIL_TOKEN_EXP)) // test

  // Write new Email token to DB
  const emailToken = new EmailTokenModel({
    email,
    emailTokenHash,
    expires_at: unixtimeInSeconds + eval(process.env.EMAIL_TOKEN_EXP)
  })

  // Invoke method to write the Email Token to DB
  await emailToken.create()

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
}