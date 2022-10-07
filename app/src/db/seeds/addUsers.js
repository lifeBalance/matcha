/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const { faker } = require('@faker-js/faker')

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
   // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min)
}

// generate an in-memory array of users
const users = []
for (let index = 1; index <= 500; index++) {
  users.push({
    id: index,
    username: `${faker.word.adjective(5)}-${faker.word.noun(5)}`,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    pwd_hash: '$2y$10$m2E7H1mg/MJ7.4cwqIDiTe/iJ48i/yULkd/XLVSRL4RUE8qf5jkcG',
    confirmed: 1,
    age: getRandomInt(18, 99),
    gender: getRandomInt(0, 3),   // either 0, 1, or 2.
    prefers: getRandomInt(0, 3),  // either 0, 1, or 2.
    bio: faker.hacker.phrase(),
    profile_pic: faker.image.people(480, 480)
  })
}

exports.seed = async function(knex) {
  // Deletes existing entries in ALL tables
  await knex('users').del()

  // Write new ones
  await knex('users').insert(users)
}