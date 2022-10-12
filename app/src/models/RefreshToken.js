const pool = require('../db/dbPool')

module.exports = class RefreshToken {
  constructor(obj) {
    this.uid        = obj.uid
    this.token_hash = obj.token_hash
    this.expires_at = obj.expires_at
  }

  create() {
    const sql = `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)`

    return pool.execute(sql, [
      this.uid,
      this.token_hash,
      this.expires_at
    ])
  }

  static read(hash) {
    const sql = `SELECT * FROM refresh_tokens WHERE token_hash = ?`

    return pool.execute(sql, [hash]) // returns...
  }

  static delete(hash) {
    const sql = `DELETE FROM refresh_tokens WHERE token_hash = ?`

    return pool.execute(sql, [hash]) // returns...
  }
}