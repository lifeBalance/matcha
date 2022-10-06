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

  static readOne(object) {
    let val
    let sql

    if (object.hasOwnProperty('id')) {
      val = object.id
      sql = 'SELECT * FROM users WHERE id = ?'
    } else if (object.hasOwnProperty('email')) {
      val = object.email
      sql = 'SELECT * FROM users WHERE email = ?'
    } else if (object.hasOwnProperty('username')) {
      val = object.username
      sql = 'SELECT * FROM users WHERE username = ?'
    }

    return pool.execute(sql, [val]) // returns empty array or [ { username: ...} ]
  }
}