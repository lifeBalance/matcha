const pool = require('../db/dbPool')

module.exports = class Profile {
  constructor(data) {
    this.id           = data.id
    this.age          = data.age
    this.gender       = data.gender
    this.prefers      = data.prefers
    this.bio          = data.bio
    this.profile_pic  = data.profile_pic
  }

  create() {
    const sql = `INSERT INTO profiles (
      id, age, gender, prefers, bio, profile_pic
    ) VALUES (?, ?, ?, ?, ?, ?)`

    return pool.execute(sql, [
      this.id,
      this.age,
      this.gender,
      this.prefers,
      this.bio,
      this.profile_pic
    ])
  }

  update() {
    const sql = `UPDATE profiles SET (
      age, gender, prefers, bio, profile_pic
    ) VALUES (?, ?, ?, ?, ?)`

    return pool.execute(sql, [
      this.age,
      this.gender,
      this.prefers,
      this.bio,
      this.profile_pic
    ])
  }

  static readAll() {
    const sql = 'SELECT * FROM profiles'

    return pool.execute(sql)
  }

  static readOne(id) {
    sql = 'SELECT * FROM profiles WHERE id = ?'

    return pool.execute(sql, [id]) // returns Empty Array or [ { id: ...} ]
  }
}