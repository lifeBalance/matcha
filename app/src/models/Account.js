const pool = require('../db/dbPool')

module.exports = class Account {
  constructor(data = null) {
    this.username   = data.username
    this.firstname  = data.firstname
    this.lastname   = data.lastname
    this.email      = data.email
    this.pwd_hash   = data.pwd_hash
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
  
  static readUsername(username) {
    const sql = 'SELECT username FROM users WHERE username = ?'

    return pool.execute(sql, [username]) // returns empty array or [ { username: ...} ]
  }
}