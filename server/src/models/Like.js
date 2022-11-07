const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Like {
  constructor(data) {}

  /* Returns true or false depending on in the like
    already exists in the DB (we don't want duplicates). */
  static async readLike(data) {
    const { liker, liked } = data

    const sql = `
    SELECT * FROM likes
    WHERE liker = ? AND liked = ?`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [liker, liked])

    // console.log('ARR: '+ JSON.stringify(arr)) // testing
    return arr.length > 0 ? true : false
  }

  /* Returns an array with all the ids of
    the users liked by a given user. */
  static async readAllLikedBy(data) {
    const { uid } = data

    const sql = `
    SELECT liked
    FROM likes
    WHERE liker = ?`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [uid])

    // console.log('ARR: '+ JSON.stringify(arr)) // testing
    return arr
  }

  /* This method returns the AMOUNT of likes a given user has. */
  static async countLikes({ id }) {
    const sql = `
    SELECT *
    FROM likes
    WHERE liked = ?`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [id])
    // console.log('PIC model, ARR: '+ JSON.stringify(arr.length)) // testing
    return arr.length // We return just the amount of pics in the array.
  }

  static async writeLike(data) {
    const { liker, liked } = data

    /* INSERT returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `
    INSERT INTO likes (liker, liked) VALUES (?, ?)`

    const [fields, _] = await pool.execute(sql, [liker, liked])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
    return fields.affectedRows // 1 or 0
  }

  static async deleteLike(data) {
    const { liker, liked } = data

    /* DELETE returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `DELETE FROM likes
    WHERE liker = ? ANd liked = ?`

    const [fields, _] = await pool.execute(sql, [liker, liked])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
  }
}
