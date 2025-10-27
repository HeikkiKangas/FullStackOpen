import {useState} from "react"

const AddBlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [formVisible, setFormVisible] = useState(false)
  const hideWhenVisible = { display: formVisible ? 'none' : '' }
  const showWhenVisible = { display: formVisible ? '' : 'none' }

  const handleAddBlog = (e) => {
    e.preventDefault()
    addBlog(title, author, url)
  }

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={() => setFormVisible(true)}>Add blog</button>
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
          <div>
            <button type='submit'>Create</button>
          </div>
        </form>
        <button onClick={() => setFormVisible(false)}>Cancel</button>
      </div>
    </>
  )
}

export default AddBlogForm
