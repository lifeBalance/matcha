/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const { faker } = require('@faker-js/faker')

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
   // The minimum is inclusive and the maximum is exclusive.
  return Math.floor(Math.random() * (max - min) + min)
}

// generate an in-memory array of users
const users = []
const pics = []
for (let index = 3; index <= 500; index++) {
  users.push({
    id: index,
    username: `${faker.word.adjective(5)}-${faker.word.noun(5)}`,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    pwd_hash: '$2b$10$aopAqevaM7HwyLuo9S93ue/87k7szKKdZ/xyEZNfeaqLUZzasFV7O',
    confirmed: 1,
    age: getRandomInt(18, 99),
    gender: getRandomInt(0, 3),   // either 0, 1, or 2.
    prefers: getRandomInt(0, 3),  // either 0, 1, or 2.
    bio: faker.hacker.phrase()
  })

  pics.push({
    user_id: index,
    url: faker.image.people(480, 480, true), // true is to make pics randome
    profile_pic: true
  })
}

exports.seed = async function(knex) {
  // Deletes existing entries in ALL tables
  await knex('users').del()
  await knex('pic_urls').del()

  // Write new ones
  await knex('users').insert(users)
  await knex('pic_urls').insert(pics)
}