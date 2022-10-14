const fs = require('fs/promises')
const path = require('path')

/**
 *  This function writes to the filesystem the image file received as argument.
 *   - Args:
 *        - Image file (created by 'formidable' in /temp folder)
 *        - An absolute path where to write a copy of the file above (user's folder)
 *   - Returns: The URL (relative path) of the pic in the user's folder.
 */
exports.savePic = async (pic, uid) => {
  const userFolder = path.join(`${__dirname}/../../public/uploads/${uid}`)

  // Probably add here a check for directory existence (fn would be more flexible)
  // Create the directory for the user pics
  await fs.mkdir(userFolder)

  // Read the first pic (the server placed it in a /temp folder)
  const content = await fs.readFile(pic.filepath, (err, e) => {
    if (err) console.log(err)
  })

  // Extract the extension
  const ext = pic.mimetype.split('/')[1]

  // Write the pic to the user's folder
  await fs.writeFile(`${userFolder}/${pic.newFilename}.${ext}`, content)

  // We return the relative URL; that's what written to the DB
  return `/uploads/${uid}/${pic.newFilename}.${ext}`
}