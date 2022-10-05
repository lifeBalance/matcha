const pool = require('../db/dbPool')

module.exports = class User {
  constructor(user) {
    this.username  = user.username
    this.firstname  = user.firstname
    this.lastname   = user.lastname
    this.email      = user.email
    this.pwd_hash   = user.pwd_hash
  }

  create() {
    const sql = `INSERT INTO users (
      username, firstname, lastname, email, pwd_hash
    ) VALUES (?, ?, ?, ?, ?)`

    return pool.execute(sql, [
      this.username,
      this.firstname,
      this.lastname,
      this.email,
      this.pwd_hash
    ])
  }

  static readAll() {
    const sql = 'SELECT * FROM users'

    return pool.execute(sql)
  }

  static readOne(id) {
    const sql = 'SELECT * FROM users WHERE id = ?'

    return pool.execute(sql, [id])
  }
}