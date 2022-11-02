const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Notif {
  constructor(data) {}

  static async readAllUserNotifs(data) {
    const { to } = data

    const sql = `
    SELECT *
    FROM notifications
    WHERE to_uid = ?`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [to])

    console.log('ARR: '+ JSON.stringify(arr)) // testing
    return arr
  }

  static async writeNotif(data) {
    const { from, to, type } = data

    /* INSERT returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `
    INSERT INTO notifications (to_uid, from_uid, type) VALUES (?, ?, ?)`

    const [fields, _] = await pool.execute(sql, [from, to, type])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
    return fields.affectedRows // 1 or 0
  }

  static async writeTwoNotifs(data) {
    const { from, to, type } = data

    /* INSERT returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `
    INSERT INTO notifications (to_uid, from_uid, type)
    VALUES
      (${from}, ${to}, ${type}),
      (${to}, ${from}, ${type})`

    const [fields, _] = await pool.execute(sql, [])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
    return fields.affectedRows // 1 or 0
  }

  static async deleteNotif(data) {
    const { notif_id } = data

    /* DELETE returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `
    DELETE FROM notifications
    WHERE id = ?`

    const [fields, _] = await pool.execute(sql, [notif_id])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
  }
}
