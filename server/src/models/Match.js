const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Match {
  constructor(data) {}

  // static async readAllMatches(data) {
  //   const { uid } = data

  //   const sql = `
  //   SELECT *
  //   FROM matches
  //   WHERE liker = ? OR liked = ?`

  //   /* SELECT returns an ARRAY with two elements:
  //       0: An ARRAY with the rows (could be an empty array).
  //       1: A fields OBJECT (metadata about the query result). */
  //   const [arr, fields] = await pool.execute(sql, [uid, uid])

  //   console.log('ARR: '+ JSON.stringify(arr)) // testing
  //   return arr
  // }
  static async readAllMatches(data) {
    const { uid } = data

    const sql = `
    SELECT id, IF(liker = ${uid}, liked, liker) AS uid
    FROM matches
    WHERE liker = ${uid} OR liked = ${uid}`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [])

    console.log('ARR: '+ JSON.stringify(arr)) // testing
    return arr
  }


  static async writeMatch(data) {
    const { liker, liked } = data

    /* INSERT returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `
    INSERT INTO matches (liker, liked) VALUES (?, ?)`

    const [fields, _] = await pool.execute(sql, [liker, liked])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
    return fields.affectedRows // 1 or 0
  }

  static async deleteMatch(data) {
    const { liker, liked } = data

    /* DELETE returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `
    DELETE FROM matches
    WHERE liker = ? AND liked = ?
    OR liked = ? AND liker = ?`

    const [fields, _] = await pool.execute(sql, [liker, liked, liked, liker])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
  }
}
