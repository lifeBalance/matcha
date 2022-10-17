const bcrypt = require('bcrypt')

// Gotta work on this one a bit...
exports.hashPassword = async (plaintextPassword) => {
  return await bcrypt.hash(plaintextPassword, 10);
}

// compare passwords and return true or false
exports.comparePasswords = async (plaintextPassword, hash) => {
  return await bcrypt.compare(plaintextPassword, hash)
}