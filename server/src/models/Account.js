const pool = require('../db/dbPool')

module.exports = class Account {
  constructor(data = null) {
    this.username   = data.username
    this.firstname  = data.firstname
    this.lastname   = data.lastname
    this.email      = data.email
    this.pwd_hash   = data.pwd_hash
  }

  async create() {
    const sql = `INSERT INTO users (
      username, firstname, lastname, email, pwd_hash
    ) VALUES (?, ?, ?, ?, ?)`

    const [ret, fields] = await pool.execute(sql, [
      this.username,
      this.firstname,
      this.lastname,
      this.email,
      this.pwd_hash
    ])

    return (ret.affectedRows === 1) ? true : false
  }

  static async readOne(object) {
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

    // The execute method returns two Arrays: one with the results and 'fields'.
    const [arr, fields] = await pool.execute(sql, [val]) // returns empty array or [ { username: ...} ]
    // console.log('USER: ' + JSON.stringify(arr)) // testing
    return (arr.length === 0) ? false : arr[0]
  }

  static async confirmAccount(data) {
    const sql = 'UPDATE users SET confirmed = 1 WHERE email = ?'
    const [ret, fields] = await pool.execute(sql, [data.email])
    
    return (ret.affectedRows === 1) ? true : false
  }

  static async resetPassword(data) {
    const sql = 'UPDATE users SET pwd_hash = ? WHERE email = ?'
    const [fields, _] = await pool.execute(sql, [data.pwd_hash, data.email])

    // console.log('fields: '+ JSON.stringify(fields)) // testing
    return (fields.affectedRows === 1) ? true : false
  }

  static async setLocation(data) {
    const sql = `
    UPDATE users
    SET location = ?
    WHERE id = ?`
    const [fields, _] = await pool.execute(sql, [
      JSON.stringify(data.location),
      data.uid
    ])

    // console.log('fields: '+ JSON.stringify(fields)) // testing
    return (fields.affectedRows === 1) ? true : false
  }

  static async getLocation(data) {
    const sql = `
    SELECT location FROM users
    WHERE id = ?`
    const [arr, _] = await pool.execute(sql, [data.uid])

    // console.log('arr: '+ JSON.stringify(arr)) // testing
    return arr.length ? arr[0].location : false
  }
}