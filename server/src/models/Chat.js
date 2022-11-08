const pool = require('../db/dbPool')

/**
 *  As of now, the Settings model only deals with the 'users' table, but if we
 * split this table in two, this model could deal with both of them (or more).
 */
module.exports = class Chat {
  constructor(data) {}

  static async readAllInterlocutors(data) {
    const { uid } = data

    const sql = `
    SELECT IF(liker = ${uid}, liked, liker) AS uid
    FROM matches
    WHERE liker = ${uid} OR liked = ${uid}`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [])

    console.log('ARR: '+ JSON.stringify(arr)) // testing
    return arr
  }

  static async readMessageList({ chat_id }) {
    if (!chat_id) return []

    const sql = `SELECT * FROM chat_lines WHERE chat_id = ?`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [chat_id])
    /* We map over the resulting array of objects in order to return an array 
      of just pic URLs, which could be empty, if there are no pics. */
    return arr
  }

  static async writeMessage(data) {
    const { chatId, msg } = data
    if (!chatId) return []
console.log(`chatId: ${chatId}`);
console.log(`msg: ${JSON.stringify(msg)}`);
    const sql = `
    INSERT INTO chat_lines
    (chat_id, line) 
    VALUES (?, ?)`

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [fields, _] = await pool.execute(sql, [
      chatId,
      JSON.stringify(msg)
    ])
    /* We map over the resulting array of objects in order to return an array 
      of just pic URLs, which could be empty, if there are no pics. */
    console.log(`Chat model - fields: ${JSON.stringify(fields)}`);
    return fields.insertId
  }

  static async readChatList(data) {
    const { uid } = data

    const sql = `
    SELECT
      matches.id,
      users.id AS uid,
      users.username,
      pic_urls.url
    FROM matches
    JOIN users
      ON IF(matches.liker = ${uid}, matches.liked, matches.liker) = users.id
    JOIN pic_urls
      ON IF(matches.liker = ${uid}, matches.liked, matches.liker) = pic_urls.user_id
    WHERE profile_pic = 1
    `

    /* SELECT returns an ARRAY with two elements:
        0: An ARRAY with the rows (could be an empty array).
        1: A fields OBJECT (metadata about the query result). */
    const [arr, fields] = await pool.execute(sql, [])
    /* We map over the resulting array of objects in order to return an array 
      of just pic URLs, which could be empty, if there are no pics. */
    return arr
  }
  static async deleteChatById(data) {
    const { chatId } = data

    const sql = `DELETE FROM chat_lines WHERE chat_id = ?`

    const [fields, _] = await pool.execute(sql, [chatId])
    console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    console.log('_: ' + JSON.stringify(_))   // testing
  }
}
