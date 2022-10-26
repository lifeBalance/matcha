const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Pic {
  constructor(data) {}

  // MARKED FOR REMOVAL
  // static readProfilePic({ id }) {
  //   console.log('readProfilePic: ' + id)
  //   const sql = `
  //   SELECT url
  //   FROM pic_urls
  //   WHERE user_id = ? AND profile_pic = 1`

  //   return pool.execute(sql, [id]) // returns Empty Array or [ {...} ]
  // }

  /* This method returns either the Profile pic URL, or null. */
  static async readProfilePicUrl({ id }) {
    const sql = `
    SELECT url
    FROM pic_urls
    WHERE user_id = ? AND profile_pic = 1`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [id])

    // console.log('ARR: '+ JSON.stringify(arr)) // testing
    return arr.length > 0 ? arr[0].url : null
  }

  /* This method returns the AMOUNT of pic URLs in the DB for a given user. */
  static async countPics({ id }) {
    const sql = `
    SELECT *
    FROM pic_urls
    WHERE user_id = ?`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [id])
    // console.log('PIC model, ARR: '+ JSON.stringify(arr.length)) // testing
    return arr.length // We return just the amount of pics in the array.
  }

  static async readAll({ id }) {
    const sql = 'SELECT * FROM pic_urls WHERE user_id = ?'
    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [id])
    /* We map over the resulting array of objects in order to return an array 
      of just pic URLs, which could be empty, if there are no pics. */
    return arr.map((pic) => pic.url)
  }

  static async writeOne(data) {
    const { uid, url, profile_pic } = data

    /* INSERT returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `INSERT INTO pic_urls (user_id, url, profile_pic)
                  VALUES (?, ?, ?)`

    const [fields, _] = await pool.execute(sql, [uid, url, profile_pic])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
  }

  static async deleteOne(data) {
    const { uid, url } = data

    /* DELETE returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `
    DELETE FROM pic_urls
    WHERE user_id = ? AND url = ?`

    const [fields, _] = await pool.execute(sql, [uid, url])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
  }
}
