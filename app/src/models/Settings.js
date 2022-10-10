const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Settings {
  constructor(data) {
    this.id           = data.id
    this.firstname    = data.firstname
    this.lastname     = data.lastname
    this.email        = data.email
    this.age          = data.age
    this.gender       = data.gender
    this.prefers      = data.prefers
    this.bio          = data.bio
    this.profile_pic  = data.profile_pic ?? '',  // Nullish Coalescing operator
    this.confirmed    = data.confirmed
  }

  // If the user is creating her profile, she's profiled! (set it to 1 ;-)
  update() {
    const sql = `UPDATE users SET
      firstname = ?,
      lastname= ?,
      email = ?,
      age = ?,
      gender= ?,
      prefers = ?,
      bio = ?,
      profile_pic = ?,
      profiled = 1,
      confirmed = ?
    WHERE id = ?`

    return pool.execute(sql, [
      this.firstname,
      this.lastname,
      this.email,
      this.age,
      this.gender,
      this.prefers,
      this.bio,
      this.profile_pic,
      this.confirmed,
      this.id
    ])
  }
}