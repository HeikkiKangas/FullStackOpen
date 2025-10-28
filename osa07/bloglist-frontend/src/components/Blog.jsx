import { useState } from 'react'
import {deleteBlog, updateBlog} from '../services/blogs'
import {useMutation, useQueryClient} from "@tanstack/react-query"

const Blog = ({ blog, user }) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const blogStyle = {
    margin: '1rem 0',
    padding: '0.5rem',
    border: '3px solid black',
    borderRadius: '0.5rem',
  }

  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const likeBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const handleLike = () => {
    likeBlogMutation.mutate({ user, updatedBlog: {...blog, likes: blog.likes + 1 } })
  }

  const handleDelete = () => {
    const confirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (confirmation) {
      deleteBlogMutation.mutate({ user, id: blog.id })
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
