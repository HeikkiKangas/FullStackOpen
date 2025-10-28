import {deleteBlog, updateBlog} from '../services/blogs'
import {useMutation, useQueryClient} from "@tanstack/react-query"

const BlogDetails = ({ blog, user }) => {
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
      <div>
        { blog.url }
        <br/>
        { blog.likes } likes
        <button onClick={ () => handleLike(blog) }>like</button>
        <br/>
        added by { blog.user?.name ?? blog.user?.username }
        <br/>
        { blog?.user?.username === user?.username ? <button onClick={ handleDelete }>remove</button> : null }
      </div>
    </div>
  )
}

export default BlogDetails
