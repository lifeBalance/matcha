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
    // Check if the Email token exists in the DB
    const [rowArr, fields] = await EmailTokenModel.read({ email: req.body.email})

    // If the DB returns an empty array, it means there's no token to that email.
    if (!Array.isArray(rowArr) || !rowArr.length) {
      res.status(400).json({ message: 'invalid token' })
      // console.log({ message: 'invalid token' }) // testing
      return
    }

    // Check if the token is expired.
    if (rowArr[0].expires_at < Math.floor(Date.now() / 1000)) {
      res.status(400).send({ message: 'expired token' })
      // console.log({ message: 'expired token' }) // testing
      return
    }

    // If all's good, delete the used token,
    await EmailTokenModel.delete({ email: req.body.email })
    // confirm the user account,
    const [rowArr2, fields2] = await AccountModel.confirmAccount({ email: req.body.email })
    // and send feedback in the response.
    res.status(200).send({ message: 'account has been confirmed. You can log in.' })
    // console.log(`Confirmed ${JSON.stringify(rowArr2.affectedRows)}`) // testing
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.requestEmail = async (req, res, next) => {
  try {
    const email = req.body.email
    // Check if the Email exists in the DB
    const [rowArr, fields] = await AccountModel.readOne({ email })

    // If the DB returns an empty array, it means there's no user to that email.
    if (!Array.isArray(rowArr) || !rowArr.length) {
      res.status(400).json({ message: 'invalid email' })
      // console.log({ message: 'invalid email' }) // testing
      return
    }

    // Check if the user's account is already confirmed!
    if (rowArr[0].confirmed) {
      res.status(200).json({
        message: 'Your account was already confirmed. You can log in'
      })
      return
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
    emailToken.create()
    
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
    res.status(200).send({ message: "email's on its way. Sit tight!" })
    console.log(`Email sent ${JSON.stringify(rowArr2)}`)
  } catch(error) {
    console.log(error)
    next(error)
  }
}