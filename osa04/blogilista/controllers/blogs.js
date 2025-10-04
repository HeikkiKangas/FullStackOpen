const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/',  async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).send({error: 'Author or url missing'})
  } else {
    const blog = new Blog(request.body)
    const result = await blog.save()
    return response.status(201).json(result)
  }
})

module.exports = blogsRouter
