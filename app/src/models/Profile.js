const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Profile {
  constructor(data) {}

  static async readOne({ id }) {
    const sql =`
    SELECT
    username, firstname, lastname, age, gender, prefers, bio
    FROM users WHERE id = ?`

    const [arr, fields] = await pool.execute(sql, [id])
    return (arr.length > 0) ? arr[0] : null // mb FALSE is better here?
  }

  static async readAll(data) {
    const { id } = data
    const sql = 'SELECT * FROM users WHERE id != ?'

    const [arr, fields] = await pool.execute(sql, [id])

    return (arr.length > 0) ? arr : false
  }
}