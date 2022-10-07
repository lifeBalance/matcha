const pool = require('../db/dbPool')

module.exports = class EmailToken {
  constructor(data) {
    this.email        = data.email
    this.email_token  = data.email_token
    this.expires_at   = data.expires_at
  }

  create() {
    const sql = `INSERT INTO email_tokens (email, email_token, expires_at)
    VALUES (?, ?, ?)`

    return pool.execute(sql, [
      this.email,
      this.email_token,
      this.expires_at
    ])
  }

  static read(token) {
    const sql = `SELECT * FROM email_tokens WHERE token_hash = ?`

    return pool.execute(sql, [token]) // returns...
  }

  static delete(email) {
    const sql = `DELETE FROM email_tokens WHERE email = ?`

    return pool.execute(sql, [token]) // returns...
  }
}