const pool = require('../db/dbPool')

module.exports = class EmailToken {
  constructor(data) {
    this.email        = data.email
    this.token_hash   = data.emailTokenHash
    this.expires_at   = data.expires_at
  }

  async create() {
    const sql = `INSERT INTO email_tokens (email, token_hash, expires_at)
    VALUES (?, ?, ?)`

    const [ret, fields] = await pool.execute(sql, [
      this.email,
      this.token_hash,
      this.expires_at
    ])

    return (ret.affectedRows === 1) ? true : false
  }

  static async read(data) {
    const sql = `SELECT * FROM email_tokens WHERE email = ?`

    const [ret, fields] =  pool.execute(sql, [data.email])

    return (ret.affectedRows === 1) ? true : false
  }

  static async delete(data) {
    const sql = `DELETE FROM email_tokens WHERE email = ?`

    const [ret, fields] = await pool.execute(sql, [data.email])

    return (ret.affectedRows === 1) ? true : false
  }
}