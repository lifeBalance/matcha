const pool = require('../db/dbPool')

module.exports = class Block {
  constructor(data) {}

  /* Returns true or false depending on in the like
    already exists in the DB (we don't want duplicates). */
  static async readAllBlocked(data) {
    const { blocker } = data

    const sql = `SELECT * FROM blocked_users WHERE blocker = ?`

    const [arr, fields] = await pool.execute(sql, [blocker])

    // console.log('Block model: '+ JSON.stringify(arr)) // testing
    return arr
  }

  static async isBlockedOrBlocker(data) {
    const { currentUser, requestedUser } = data
console.log(`Block model: ${currentUser} - ${requestedUser}`);
    const sql = `SELECT * FROM blocked_users
    WHERE blocker = ? AND blocked = ?
    OR blocked = ?  AND blocker = ?`

    const [arr, fields] = await pool.execute(sql, [currentUser, requestedUser, currentUser, requestedUser])
//, otherUser, currentUser
    console.log('Block model: '+ JSON.stringify(arr)) // testing
    return arr.length > 0 ? true : false
  }

  static async writeBlock(data) {
    const { blocker, blocked } = data

    const sql = `
    INSERT INTO blocked_users (blocker, blocked) VALUES (?, ?)`

    const [fields, _] = await pool.execute(sql, [blocker, blocked])
    // console.log('FIELDS: ' + JSON.stringify(fields))   // testing
    // console.log('_: ' + JSON.stringify(_))   // testing
    return fields.affectedRows // 1 or 0
  }
}
