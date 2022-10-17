const pool = require('../db/dbPool')

module.exports = class RefreshToken {
  constructor(obj) {
    this.uid        = obj.uid
    this.token_hash = obj.token_hash
    this.expires_at = obj.expires_at
  }

  async create() {
    const sql = `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)`

    /* INSERT returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null OBJECT. */
    const [fields, _] = await pool.execute(sql, [
      this.uid,
      this.token_hash,
      this.expires_at
    ])

    // console.log('RT CREATED: '+JSON.stringify(fields)) // testing
    return fields.affectedRows === 1
  }

  /* Returns true if the token hash was found in the DB; false otherwise */
  static async read(hash) {
    const sql = `SELECT * FROM refresh_tokens WHERE token_hash = ?`

    /* SELECT returns an ARRAY with two elements:
      0: An ARRAY with the rows (could be an empty array).
      1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [hash])

    // console.log('RT READ: '+JSON.stringify(arr))  // testing
    return (arr.length > 0) ? true : false
  }

  static async delete(hash) {
    const sql = `DELETE FROM refresh_tokens WHERE token_hash = ?`

    /* DELETE returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null OBJECT. */
    const [fields, _] = await pool.execute(sql, [hash])

    // console.log('RT DELETED: ' + JSON.stringify(fields))  // testing
    return (fields.affectedRows === 1) ? true : false
  }
}