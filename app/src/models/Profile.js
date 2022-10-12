const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Profile {
  constructor(data) {}

  static readOwn({ id }) {
    const sql =`
    SELECT
    username, firstname, lastname, email, age, gender, prefers, bio, profiled
    FROM users WHERE id = ?`

    return pool.execute(sql, [id]) // returns Empty Array or [ { id: ...} ]
  }

  static readOne({ id }) {
    const sql =`
    SELECT
    username, firstname, lastname, age, gender, prefers, bio
    FROM users WHERE id = ?`

    return pool.execute(sql, [id]) // returns Empty Array or [ { id: ...} ]
  }

  static readAll() {
    const sql = 'SELECT * FROM users'

    return pool.execute(sql)
  }
}