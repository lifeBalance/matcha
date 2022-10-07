const UserModel = require('../models/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Return a Single Resource(with some ID)
exports.testsGet = async (req, res, next) => {
  res.status(200).json('da response')
}
