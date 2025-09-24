const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce(
  (total, blog) => total + blog.likes,
  0
)

const favouriteBlog = (blogs) => {
  let maxLikes = 0
  let maxIndex = 0
  blogs.forEach((blog) => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
      maxIndex = blogs.indexOf(blog)
    }
  })
  return blogs[maxIndex]
}

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, (b) => b.author)
  const result = {}
  Object.entries(authors).forEach(([key, value]) => {
    if (!result['blogs'] || value > result['blogs']) {
      result['author'] = key
      result['blogs'] = value
    }
  })
  return result
}

const mostLikes = (blogs) => {
  const likes = blogs.reduce((total, blog) => {
    if (Object.keys(total).includes(blog.author)) {
      total[blog.author] += blog.likes
    } else {
      total[blog.author] = blog.likes
    }
    return total
  }, {})
  let result = {}
  let maxLikes = 0
  Object.entries(likes).forEach(([key, value]) => {
    if (value > maxLikes) {
      result = { author: key, likes: value }
      maxLikes = value
    }
  })
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
