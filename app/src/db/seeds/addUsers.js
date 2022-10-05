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
    confirmed: 1
  })
}

// generate an in-memory array of profiles
const profiles = []
users.forEach(user => {
  profiles.push({
    id: user.id,
    age: getRandomInt(18, 99),
    gender: getRandomInt(0, 3),   // either 0, 1, or 2.
    prefers: getRandomInt(0, 3),  // either 0, 1, or 2.
    bio: faker.hacker.phrase(),
    profile_pic: faker.image.people(480, 480)
  })
})

exports.seed = async function(knex) {
  // Deletes existing entries in ALL tables
  await knex('users').del()
  await knex('profiles').del()

  // Write new ones
  await knex('users').insert(users)
  // await knex('users').insert([
  //   {
  //     id: 1,
  //     username: 'crazyBear',
  //     firstname: 'Alotto',
  //     lastname: 'Dicks',
  //     email: 'test@test.com',
  //     pwd_hash: '$2y$10$m2E7H1mg/MJ7.4cwqIDiTe/iJ48i/yULkd/XLVSRL4RUE8qf5jkcG',
  //     confirmed: 1
  //   },
  //   {
  //     id: 2,
  //     username: 'bjQueen',
  //     firstname: 'Thea',
  //     lastname: 'Baggins',
  //     email: 'test@test2.com',
  //     pwd_hash: '$2y$10$m2E7H1mg/MJ7.4cwqIDiTe/iJ48i/yULkd/XLVSRL4RUE8qf5jkcG',
  //     confirmed: 1
  //   },
  // ])
  await knex('profiles').insert(profiles)
  // await knex('profiles').insert([
  //   {
  //     id: 1,
  //     age: 32,
  //     gender: 1,
  //     prefers: 0,
  //     bio: "I like long walks in the beach with my girlfriend, until the acid wears off, and I realize I'm draggin a manequin through the parking lot.",
  //     profile_pic: ''
  //   },
  //   {
  //     id: 2,
  //     age: 35,
  //     gender: 0,
  //     prefers: 2,
  //     bio: "If you are looking for a woman with personality, well it's your lucky day, because I have multiple.",
  //     profile_pic: ''
  //   },
  // ])
}