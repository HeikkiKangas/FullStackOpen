const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require("node:assert")
const {MONGODB_URI} = require("../utils/config")
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: "Blog 1",
    author: "James",
    url: 'http://localhost:3001',
    likes: 5
  },
  {
    title: "Blog 2",
    author: "Jane",
    url: 'http://localhost:3002'
  }
]

const newBlog = {
  title: 'Blog 3',
  author: 'Jack',
  url: 'http://localhost:3005'
}

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const blog of initialBlogs) {
    const newBlog = new Blog(blog)
    await newBlog.save()
  }
})

describe('blogs api', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blogs have id field', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(Object.keys(response.body[0]).includes('id'), true)
  })

  test('blogs can be added', async () => {
    const firstResponse = await api.get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const secondResponse = await api.get('/api/blogs')

    assert.strictEqual(secondResponse.body.length, firstResponse.body.length + 1)
  })

  test('likes defaults to 0', async () => {
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes, 0)
  })

  test('title is required', async () => {
    await api
      .post('/api/blogs')
      .send({ author: 'James', url: 'http://localhost:3010' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('url is required', async () => {
    await api
      .post('/api/blogs')
      .send({ author: 'James', title: 'Blog 4' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  await mongoose.connection.close()
})
