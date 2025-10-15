const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require("../utils/logger");
const {userExtractor} = require("../utils/middleware");

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).send({error: 'Title or url missing'})
  } else {
    if (!request.user) {
      return response.status(401).send({error: 'Invalid token'})
    }
    const user = await User.findById(request.user)
    if (!user) {
      return response.status(400).send({error: 'Invalid or missing UserId'})
    }

    const blog = new Blog({...request.body, user: user._id})
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    return response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(401).send({error: 'Invalid token'})
  }
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  if (!blog) {
    return response.status(404).send({error: 'Blog not found'})
  }
  if (blog.user.toString() === request.user) {
    await Blog.findByIdAndDelete(blogId)
    response.status(204).end()
  } else {
    response.status(403).end({error: 'Invalid User'})
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const {url, likes, title, author} = request.body
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
        .catch((error) => {
          next(error)
        })
    })
})

module.exports = blogsRouter
