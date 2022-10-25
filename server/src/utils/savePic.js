const fs = require('fs/promises')
const path = require('path')

const PicModel = require('../models/Pic')

/**
 *  This function does two things:
 *
 * 1. Writes to the filesystem the image file received as argument.
 * 2. Writes to the Database the URL of the image file above.
 * 
 *   - Args:
 *        - pic: Image file (created by 'formidable' in /temp folder)
 *        - uid: So we can build the absolute path to the user's Uploads folder.
 *        - profile_pic: A boolean that indicates if the pic is the profile pic.
 *
 *   - Returns: The URL (relative path) of the pic in the user's folder.
 */
exports.savePic = async (pic, uid, is_profile_pic) => {
  const userFolder = path.join(`${__dirname}/../../public/uploads/${uid}`)

  /*  If the picture is a Profile pic, it means the user still doesn't 
    have a folder in /public/uploads, so let's create one. */
  if (is_profile_pic)
    await fs.mkdir(userFolder)

  // Read the first pic (the server placed it in a /temp folder)
  const content = await fs.readFile(pic.filepath, (err, e) => {
    if (err) console.log(err)
  })

  // Extract the extension
  const ext = pic.mimetype.split('/')[1]

  // Write the pic to the user's folder
  await fs.writeFile(`${userFolder}/${pic.newFilename}.${ext}`, content)

  // Write the URL to the DB.
  await PicModel.writeOne({
    uid,
    url: `/uploads/${uid}/${pic.newFilename}.${ext}`,
    profile_pic: is_profile_pic
  })

  // We return the relative URL, in case we want to send it in the response.
  return `/uploads/${uid}/${pic.newFilename}.${ext}`
}