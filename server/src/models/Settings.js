const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Settings {
  constructor(data) {
    this.firstname    = data.firstname
    this.lastname     = data.lastname
    this.email        = data.email
    this.age          = data.age
    this.gender       = data.gender
    this.prefers      = data.prefers
    this.bio          = data.bio
    this.id           = data.id
    this.confirmed    = data.confirmed
    this.location     = data.location
    this.tags         = data.tags
  }

  static async readSettings({ id }) {
    const sql =`
    SELECT
    id,
    username,
    firstname,
    lastname,
    email,
    age,
    gender,
    prefers,
    bio,
    confirmed,
    profiled,
    location,
    tags,
    (SELECT IF(
      (SELECT COUNT(*) FROM likes WHERE likes.liker = users.id) = 0,
        0,
        ((SELECT COUNT(*) FROM matches WHERE users.id = liker OR users.id = liked) * 100) / (SELECT COUNT(*) FROM likes WHERE likes.liker = users.id))) AS fame
    FROM users WHERE id = ?`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [id])

    return (arr.length > 0) ? arr[0] : false
  }

  // If the user is creating her profile, she's profiled! (set it to 1 ;-)
  async update() {
    const sql = `UPDATE users SET
      firstname = ?,
      lastname= ?,
      email = ?,
      age = ?,
      gender= ?,
      prefers = ?,
      bio = ?,
      profiled = 1,
      confirmed = ?,
      location = ?,
      tags = ?
    WHERE id = ?`

    const fields = await pool.execute(sql, [
      this.firstname,
      this.lastname,
      this.email,
      this.age,
      this.gender,
      this.prefers,
      this.bio,
      this.confirmed,
      this.location,
      this.tags,
      this.id
    ])

    /* Apparently, UPDATE queries only return an array of "fields" */
    if (fields[0].affectedRows === 1) return true
    // console.log('FIELDS'+JSON.stringify(fields)) // testing
  }
}