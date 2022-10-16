const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Pic {
  constructor(data) {}

  static readProfilePic({ id }) {
    console.log('readProfilePic: '+id)
    const sql =`
    SELECT url
    FROM pic_urls
    WHERE user_id = ? AND profile_pic = 1`

    return pool.execute(sql, [id]) // returns Empty Array or [ {...} ]
  }

  /* This method returns either the Profile pic URL, or null. */
  static async readProfilePicUrl({ id }) {
    const sql =`
    SELECT url
    FROM pic_urls
    WHERE user_id = ? AND profile_pic = 1`
    
    // The execute method returns two Arrays: one with the results and 'fields'.
    const [arr, fields] = await pool.execute(sql, [id])
    // console.log('ARR: '+ JSON.stringify(arr)) // testing

    return (arr.length > 0) ? arr[0].url : null
  }

  /* This method returns the amount of pic URLs in the DB for a given user. */
  static async countPics({ id }) {
    const sql =`
    SELECT *
    FROM pic_urls
    WHERE user_id = ?`

    // The execute method returns two Arrays: one with the results and 'fields'.
    const [arr, fields] = await pool.execute(sql, [id])
    // console.log('ARR: '+ JSON.stringify(arr.length)) // testing
    return arr.length
  }

  static async readAll({ id }) {
    const sql = 'SELECT * FROM pic_urls WHERE user_id = ?'

    const [arr, fields] = await pool.execute(sql, [id])
    /* We return an array of pic URLs, which could be 
      empty, if there are no pics. */
    return arr.map(pic => pic.url) 
  }

  static async writeOne(data) {
    const { uid, url, profile_pic } = data
    const sql = `INSERT INTO pic_urls (user_id, url, profile_pic)
                  VALUES (?, ?, ?)`

    const [arr, fields] = await pool.execute(sql, [uid, url, profile_pic])
    console.log('FIELDS: ' + JSON.stringify(fields))
    console.log('ARR: ' + JSON.stringify(arr))
  }
}