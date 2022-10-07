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

// Creates a Single Resource (user account) and returns it in the response (if all went well).
exports.create = async (req, res, next) => {
  try {
    const {
      username,
      firstname,
      lastname,
      email,
      password
    } = req.body

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

    // We could use the DB response, to check affectedRows, insertId, etc...
    const [dbResp, _] = await account.create()
    if (dbResp.affectedRows === 1) // It means we updated the row in 'accounts'
    {
      // Generate Email Token Hash
      const emailTokenHash = crypto.randomBytes(16).toString('hex')

      // Delete old Email token from DB (if any). Can only be one per email!
      // await EmailTokenModel.delete(email)
/* 
      // Write new Email token from DB
      const emailToken = new EmailTokenModel({
        email,
        emailTokenHash,
        // expires_at: ... come up with a date (check the PHP code)
      })
      // emailToken.create()
 */
      // Send Account Confirmation Email
      const mailOptions = {
        from: process.env.WEBADMIN_EMAIL_ADDRESS,
        to: email,
        subject: 'Confirm your Matcha account',
        text: `<h1>Welcome to Matcha</h1>
        <p>
          Please, click <a href="https://localhost/confirm/${email}/${emailTokenHash}" >here</a> to get the party started!
        </p>`
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error)
        else console.log('Email sent: ' + info.response)
      })

      // console.log('account id: ' + dbResp.insertId) // testing
      res.status(200).json(dbResp)
    } else {
      res.status(400).json({ message: 'bad request' })
    }
  } catch(error) {
    console.log(error)
    next(error)
  }
}
