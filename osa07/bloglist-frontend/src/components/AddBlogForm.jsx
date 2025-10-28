import {useState} from "react"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import blogService from "../services/blogs.js"
import {Button} from '@mui/material'

const AddBlogForm = ({ user, showNotification }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [formVisible, setFormVisible] = useState(false)
  const hideWhenVisible = { display: formVisible ? 'none' : '' }
  const showWhenVisible = { display: formVisible ? '' : 'none' }

  const addBlogMutation = useMutation({
    mutationFn: blogService.addBlog,
    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: ['blogs']})
      showNotification(`Add blog '${data.title}'`)
      console.log('success', data)

      setTitle('')
      setAuthor('')
      setUrl('')
    },
    onError: error => console.log(error)
  })

  const handleAddBlog = (e) => {
    e.preventDefault()
    console.log(title, author, url)
    addBlogMutation.mutate({ user, title, author, url })
  }

  const queryClient = useQueryClient()

  return (
    <>
      <div style={hideWhenVisible}>
        <Button variant='outlined' onClick={() => setFormVisible(true)}>Add blog</Button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={handleAddBlog}>
          <div>
            <label>
              Title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Author
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Url
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
          </div>
          <div style={{ margin: '0.5rem 0' }}>
            <Button variant='outlined' type='submit'>Create</Button>
          </div>
        </form>
        <Button variant='outlined' onClick={() => setFormVisible(false)}>Cancel</Button>
      </div>
    </>
  )
}

export default AddBlogForm
