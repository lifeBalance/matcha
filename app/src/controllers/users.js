const UserModel = require('../models/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Return a Collection of Resources
exports.readAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.readAll()
    res.status(200).json(users)
  } catch(error) {
    console.log(error)
    next(error)
  }
}

// Return a Single Resource(with some ID)
exports.readOneUser = async (req, res, next) => {
  try {
    // The fields (metadata about results) are assigned to the '_'
    const [user, _] = await UserModel.readOne({ id: req.params.id })
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// Creates a Single Resource and returns it in the response (if all went well).
exports.createUser = async (req, res, next) => {
  try {
    const {
      username,
      firstname,
      lastname,
      email,
      password
    } = req.body

    // Let's hash the password
    const salt = await bcrypt.genSalt(10)
    const pwd_hash = await bcrypt.hash(password, salt)

    // console.log(firstname, pwd_hash); return;
    let user = new UserModel({
      username,
      firstname,
      lastname,
      email,
      pwd_hash
    })

    const [dbResp, _] = await user.create()

    res.status(200).json(dbResp)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
