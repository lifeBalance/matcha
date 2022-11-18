const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Notif {
  constructor(data) {}

  static async readAllUserNotifs(data) {
    const { recipient } = data

    const sql = `
    SELECT *
    FROM notifications
    WHERE recipient_uid = ?`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [recipient])

    // console.log('ARR: '+ JSON.stringify(arr)) // testing
    return arr
  }

  static async writeNotif(data) {
    const { recipient, type, content } = data

    /* INSERT returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `
    INSERT INTO notifications
    (recipient_uid, type, content)
    VALUES (?, ?, ?)`

    const [fields, _] = await pool.execute(sql, [
      recipient,
      type,
      content
    ])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
    return fields.insertId // the id of the notification
  }

  static async deleteNotif(data) {
    const { notif_id } = data

    /* DELETE returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `DELETE FROM notifications WHERE id = ?`

    const [fields, _] = await pool.execute(sql, [notif_id])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
    return fields.affectedRows
  }

  static async deleteAllNotifs(data) {
    const { uid } = data

    /* DELETE returns an ARRAY with two elements:
        0: A fields OBJECT (metadata about the query result).
        1: A null/undefined OBJECT. */
    const sql = `DELETE FROM notifications WHERE recipient_uid = ?`

    const [fields, _] = await pool.execute(sql, [uid])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
    return fields.affectedRows
  }

  // static async deleteAllNotifsBothUsers(data) {
  //   const { uid } = data

  //   /* DELETE returns an ARRAY with two elements:
  //       0: A fields OBJECT (metadata about the query result).
  //       1: A null/undefined OBJECT. */
  //   const sql = `DELETE FROM notifications
  //     WHERE recipient_uid = ?`

  //   const [fields, _] = await pool.execute(sql, [uid])
  //   // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
  //   // console.log('_: ' + JSON.stringify(_))   // testing
  //   return fields.affectedRows
  // }
}
