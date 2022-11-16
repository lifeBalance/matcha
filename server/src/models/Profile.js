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
    id,
    username,
    firstname,
    lastname,
    online,
    last_seen,
    age,
    gender,
    prefers,
    bio,
    tags,
    location,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'url', pic_urls.url,
      'profile', pic_urls.profile_pic))
        FROM pic_urls
        WHERE pic_urls.user_id = users.id
    ) AS pics
    FROM users WHERE id = ?`

    const [arr, fields] = await pool.execute(sql, [id])
    return (arr.length > 0) ? arr[0] : null // mb FALSE is better here?
  }

  static async readAll(data) {
    let { id, page, prefers, userA, dist, age } = data
    // console.log(`id: ${id} - page: ${page} - prefers: ${JSON.stringify(prefers)}`)  // testing
    console.log(`locat.: ${JSON.stringify(dist)} (typeof hi: ${typeof dist.hi})`)
    console.log(`userA.: ${JSON.stringify(userA)}`)
    console.log(`age: ${JSON.stringify(age)}`)

    const limit = 10
    const offset = (page - 1) * limit
    const sql = 
    `
    SELECT
      users.id,
      users.username,
      users.firstname,
      users.lastname,
      users.online,
      users.last_seen,
      users.age,
      users.gender,
      users.prefers,
      users.bio,
      users.location,
      (SELECT JSON_ARRAYAGG(
        JSON_OBJECT('url', pic_urls.url, 'profile', pic_urls.profile_pic)
        ) FROM pic_urls WHERE pic_urls.user_id = users.id) AS pics,
      (SELECT ST_Distance_Sphere(
        point(?, ?),
        point(
          JSON_EXTRACT(users.location, '$.lat'),
          JSON_EXTRACT(users.location, '$.lng')
        )
      )) AS location
    FROM users
    WHERE users.id != ?
      AND users.id NOT IN
        (SELECT blocker
          FROM blocked_users
          WHERE blocked = ?)
      AND users.gender IN (?)
      AND users.age BETWEEN ? AND ?
      AND ST_Distance_Sphere(
        point(?, ?),
        point(
          JSON_EXTRACT(users.location, '$.lat'),
          JSON_EXTRACT(users.location, '$.lng')
        )
      ) BETWEEN ? AND ?
    ORDER BY location ASC
    LIMIT ${limit} OFFSET ${offset}
    `

    // console.log(sql)
    console.log(`limit: ${limit} - offset: ${offset}`);
    const [arr, fields] = await pool.execute(sql, [
      userA.lat,
      userA.lng,
      id,
      id,
      prefers,
      age.lo,
      age.hi,
      userA.lat,
      userA.lng,
      dist.lo,
      dist.hi
    ])

    // `
    // SELECT
    //   users.id,
    //   users.username,
    //   users.firstname,
    //   users.lastname,
    //   users.online,
    //   users.last_seen,
    //   users.age,
    //   users.gender,
    //   users.prefers,
    //   users.bio,
    //   users.tags,
    //   users.location,
    //   (SELECT JSON_ARRAYAGG(JSON_OBJECT('url', pic_urls.url, 'profile', pic_urls.profile_pic))
    //   FROM pic_urls WHERE pic_urls.user_id = users.id) AS pics,
    //   (SELECT ST_Distance_Sphere(
    //     point(CAST(? AS DOUBLE), CAST(? AS DOUBLE)),
    //     point(
    //       CAST(JSON_EXTRACT(users.location, '$.lng') AS DOUBLE),
    //       CAST(JSON_EXTRACT(users.location, '$.lat') AS DOUBLE)
    //     )
    //   )) AS location
    //   FROM users
    //   WHERE users.id != ?
    //     AND users.gender IN (?)
    //     AND users.id NOT IN
    //       (SELECT blocker
    //         FROM blocked_users
    //         WHERE blocked = ?)
    //     AND ST_Distance_Sphere(
    //       point(CAST(? AS DOUBLE), CAST(? AS DOUBLE)),
    //       point(
    //         CAST(JSON_EXTRACT(users.location, '$.lng') AS DOUBLE),
    //         CAST(JSON_EXTRACT(users.location, '$.lat') AS DOUBLE)
    //       )
    //     ) BETWEEN 0 AND ?
    //   ORDER BY location DESC
    //   `
      // LIMIT ${limit} OFFSET ${offset}
      // console.log(userA.lng, userA.lat)
      // console.log(limit, offset)

    // const [arr, fields] = await pool.execute(sql, [
    //   userA.lng,
    //   userA.lat,
    //   id,
    //   prefers,
    //   id,
    //   userA.lng,
    //   userA.lat,
    //   // dist.lo,
    //   dist.hi
    // ])
    // console.log('Profile Model: '+JSON.stringify(arr))
    return arr // it could be an empty array
  }

  static async increaseViews(data) {
    const sql = `
    UPDATE users
    SET views = views + 1
    WHERE id = ?`
    const [fields, _] = await pool.execute(sql, [
      data.uid
    ])

    // console.log('fields: '+ JSON.stringify(fields)) // testing
    return (fields.affectedRows === 1) ? true : false
  }

  static async isOnline({ id }) {
    const sql =`
    SELECT
    online
    FROM users WHERE id = ?`

    const [arr, fields] = await pool.execute(sql, [id])
    // console.log(JSON.stringify(`${id} is online: ${arr[0].online}`));
    return arr[0].online === 1 ? true : false
  }
}