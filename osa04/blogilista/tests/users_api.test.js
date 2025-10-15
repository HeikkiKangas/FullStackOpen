const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
  {
    name: 'Jack',
    username: 'Jack',
    password: '123456'
  },
  {
    username: 'esa',
    password: '123456'
  }
]

const invalidPasswordUser = {
  username: 'Esa1',
  password: '12'
}

const invalidUsernameUser = {
  username: 'Es',
  password: '123456'
}

beforeEach(async () => {
  await User.deleteMany({})
  for (const user of initialUsers) {
    const newUser = new User(user)
    await newUser.save()
  }
})

describe('users api', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('username has to be unique', async () => {
    const response = await api
      .post('/api/users')
      .send(initialUsers[0])
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'User already exists')
  })

  test('username must be at least 3 characters', async () => {
    const response = await api
      .post('/api/users')
      .send(invalidUsernameUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'Username must be at least 3 characters')
  })

  test('password must be at least 3 characters', async () => {
    const response = await api
      .post('/api/users')
      .send(invalidPasswordUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'Password must be at least 3 characters')
  })
})

after(async () => {
  User.deleteMany({})
  await mongoose.connection.close()
})