const pool = require('../db/dbPool')

module.exports = class EmailToken {
  constructor(data) {
    this.email        = data.email
    this.token_hash   = data.emailTokenHash
    this.expires_at   = data.expires_at
  }

  create() {
    const sql = `INSERT INTO email_tokens (email, token_hash, expires_at)
    VALUES (?, ?, ?)`

    return pool.execute(sql, [
      this.email,
      this.token_hash,
      this.expires_at
    ])
  }

  static read(email) {
    const sql = `SELECT * FROM email_tokens WHERE email = ?`

    return pool.execute(sql, [email]) // returns array
  }

  static delete(email) {
    const sql = `DELETE FROM email_tokens WHERE email = ?`

    return pool.execute(sql, [email]) // returns array
  }
}