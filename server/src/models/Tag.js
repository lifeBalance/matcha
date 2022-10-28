const pool = require('../db/dbPool')

module.exports = class Tag {
  constructor(data) {}

  static async readAll() {
    const sql = `SELECT label, id AS value FROM tags`
    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [])
    /* We map over the resulting array of objects in order to return an array 
      of just pic URLs, which could be empty, if there are no pics. */
    return arr
  }

  static async readTagsArray(userTags) {
    /* We gotta check the userTags is not an empty array */
    if (!userTags || userTags.length === 0) return []

    /* The only way I could pass an array in this query, was by using
      string interpolation (is there a better way?)*/
    const sql = `
    SELECT label, id AS value FROM tags
    WHERE id IN (${userTags})`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [])
    /* We map over the resulting array of objects in order to return an array 
      of just pic URLs, which could be empty, if there are no pics. */
    return arr
  }

  static async writeOne(tagLabel) {
    const sql = `INSERT INTO tags (label) VALUES (?)`

    /* INSERT returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const [fields, _] = await pool.execute(sql, [tagLabel])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
    return fields.insertId
  }
}
