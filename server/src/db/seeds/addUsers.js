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

const ts = [
  1665328693000,
  1668374293000,
  1663143493000
]

const loc = [
  {
    // Somewhere around Kallio
    "lat": 60.2918,
    "lng": 24.9599,
    "manual": "true"
  },
  {
    // Espoo cathedral
    "lat": 60.2059,
    "lng": 24.6903,
    "manual": "true"
  },
  {
    // Turku cathedral
    "lat": 60.4321,
    "lng": 22.0841,
    "manual": "true"
  },
  {
    // Vantaa church of scientology
    "lat": 60.2941,
    "lng": 25.0262,
    "manual": "true"
  },
  {
    // Santa's village
    "lat": 66.5436,
    "lng": 25.8450,
    "manual": "true"
  }
]

const tags = [
  {id: 1, label: 'tattoos'},
  {id: 2, label: 'piercings'},
  {id: 3, label: 'blondes'},
  {id: 4, label: 'smarty-pants'},
  {id: 5, label: 'non-smokers'}
]

const pwd = '$2b$10$aopAqevaM7HwyLuo9S93ue/87k7szKKdZ/xyEZNfeaqLUZzasFV7O'
// generate an in-memory array of users
const users = []
const pics = []
const tagsArr = [
  [1, 2, 3],
  [1, 2, 5],
  [1, 4, 3]
]
for (let index = 2; index <= 500; index++) {
  users.push({
    id: index,
    username:     `${faker.word.adjective(5)}-${faker.word.noun(5)}`,
    firstname:    faker.name.firstName(),
    lastname:     faker.name.lastName(),
    email:        faker.internet.email(),
    // Same password: Asdf1!
    pwd_hash:     pwd,
    confirmed:    1,
    age:          getRandomInt(18, 99),
    gender:       getRandomInt(0, 3),   // either 0, 1, or 2.
    prefers:      getRandomInt(0, 3),  // either 0, 1, or 2.
    bio:          faker.hacker.phrase(),
    last_seen:    ts[getRandomInt(0, 3)],
    location:     loc[getRandomInt(0, 5)],
    views:        getRandomInt(0, 1000),
    tags:         JSON.stringify(tagsArr[getRandomInt(1, 3)])
  })

  pics.push({
    user_id: index,
    url: faker.image.people(480, 480, true), // true is to make pics random
    profile_pic: true
  })
}

exports.seed = async function(knex) {
  // Deletes existing entries in ALL tables
  await knex('users').del()
  await knex('pic_urls').del()
  await knex('tags').del()

  // Write new ones
  await knex('users').insert(users)
  await knex('pic_urls').insert(pics)
  await knex('tags').insert(tags)
}