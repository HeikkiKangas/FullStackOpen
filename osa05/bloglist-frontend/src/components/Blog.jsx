import { useState } from 'react'
import { deleteBlog } from '../services/blogs'

const Blog = ({ blog, token, blogs, setBlogs, user, handleLike }) => {
  const [open, setOpen] = useState(false)

  const blogStyle = {
    margin: '1rem 0',
    padding: '0.5rem',
    border: '3px solid black',
    borderRadius: '0.5rem',
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
            <button onClick={ () => handleLike(blog) }>like</button>
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