// Validators for all signup fields (same code as in React front-end)
const {
  validateEmail,
  validateName
} = require('../utils/validators')

// Handy functions
const { inrange } = require('../utils/utils')

// For parsing form data, especially file uploads.
const formidable = require('formidable')

exports.validateSettingsForm = (req, res, next) => {
  const form = new formidable.IncomingForm()
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err)
      return
    }

    if (Object.entries(fields).length === 0   ||
        !fields.hasOwnProperty('firstname')   ||
        !fields.hasOwnProperty('lastname')    ||
        !fields.hasOwnProperty('email')       ||
        !fields.hasOwnProperty('age')         ||
        !fields.hasOwnProperty('gender')      ||
        !fields.hasOwnProperty('prefers')     ||
        !fields.hasOwnProperty('bio')         ||
        !validateName(fields.firstname)       ||
        !validateName(fields.lastname)        ||
        !validateEmail(fields.email)          ||
        !inrange(fields.age, 18, 100)         ||
        !inrange(fields.gender, 0, 2)         ||
        !inrange(fields.prefers, 0, 2)        ||
        !inrange(fields.bio.length, 0, 255))
    {
      return res.status(200).json({ 
        type: 'ERROR',
        message: 'bad request'
      })
    }
    // If there's no error, let's attach the form fields array to the Request object
    req.fields = fields

    // Let's create an empty array to attach the pics to the Request object
    req.pics = []

    // regex to match image filetypes
    const regex = /^(image\/)(png|jpe?g|gif)$/

    if (Object.entries(files).length === 0) next()

    // for (const pic of Object.keys(files))
    //   console.log(`Pic key: ${JSON.stringify(pic)}`) // testing

    // console.log(`Amount of pics: ${Object.entries(files).length}`) // testing
    if (Object.entries(files).length > 5) {
      return res.status(200).json({
        type: 'ERROR',
        message: 'too many files'
      })
    }

    for (const pic of Object.entries(files)) {
      const filename = pic[0]
      const file = pic[1]

      if (file.size > 2000000 || !file.mimetype.match(regex)) {
        return res.status(200).json({
          type: 'ERROR',
          message: 'wrong filetype'
        })
      }

      if (filename === 'profilePic') req.profilePic = file
      else req.pics.push(file)
      console.log(`FileName: ${filename} - file: ${JSON.stringify(file)}`) // testing
    }

    next()
  })
}
