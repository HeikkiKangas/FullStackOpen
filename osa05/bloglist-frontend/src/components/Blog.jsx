import { useState } from 'react'
import { updateBlog, deleteBlog } from '../services/blogs'

const Blog = ({ blog, token, blogs, setBlogs, user }) => {
  const [open, setOpen] = useState(false)

  const blogStyle = {
    margin: '1rem 0',
    padding: '0.5rem',
    border: '3px solid black',
    borderRadius: '0.5rem',
  }

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    updateBlog(token, updatedBlog)
      .then(response => {
        setBlogs(blogs.map(b => b.id === updatedBlog.id ? response : b).sort((a, b) => b.likes > a.likes ? 1 : -1))
      })
  }

  const handleDelete = () => {
    const confirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (confirmation) {
      deleteBlog(token, blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button style={{ display: open ? '' : 'none' }} onClick={() => setOpen(false)}>hide</button>
      {
        open
          ? <div>
            { blog.url }
            <br/>
            likes: { blog.likes }
            <button onClick={ handleLike }>like</button>
            <br/>
            { blog.user?.name ?? blog.user?.username }
            <br/>
            { blog?.user?.username === user?.username ? <button onClick={ handleDelete }>remove</button> : null }
          </div>
          : <button onClick={() => setOpen(true)}>view</button>
      }
    </div>
  )
}

export default Blog