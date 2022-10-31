const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Profile {
  constructor(data) {}

  static async readOne({ id }) {
    const sql =`
    SELECT
    id, username, firstname, lastname, age, gender, prefers, bio
    FROM users WHERE id = ?`

    const [arr, fields] = await pool.execute(sql, [id])
    return (arr.length > 0) ? arr[0] : null // mb FALSE is better here?
  }

  static async readAll(data) {
    const { id } = data
    const sql = 
    `
    SELECT
      users.id,
      users.username,
      users.firstname,
      users.lastname,
      users.age,
      users.gender,
      users.prefers,
      users.bio,
      users.online,
      users.last_seen,
      users.tags,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('url', pic_urls.url, 'profile', pic_urls.profile_pic))
        FROM pic_urls
        WHERE pic_urls.user_id = users.id) AS pics
      FROM users
    WHERE users.id != ?`

    const [arr, fields] = await pool.execute(sql, [id])
    // console.log('Profile Model: '+JSON.stringify(arr))
    return arr // it could be an empty array
  }
}