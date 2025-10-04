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

blogsRouter.delete('/:id',  async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id',  async (request, response, next) => {
  const { url, likes, title, author } = request.body
  Blog.findById(request.params.id)
    .then(blog => {
      if (!blog) {
        return response.status(404).send({error: 'Blog not found'})
      }
      blog.title = title
      blog.author = author
      blog.likes = likes
      blog.url = url

      return blog
        .save()
        .then((updatedBlog) => {
          response.json(updatedBlog)
        })
        .catch((error) => { next(error) })
    })
})

module.exports = blogsRouter
