import {useEffect, useState} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user])

  useEffect(() => {
    const savedUser = window.localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    loginService
      .login(username, password)
      .then(result => {
        setUser(result)
        window.localStorage.setItem('user', JSON.stringify(result))
        setUsername('')
        setPassword('')
        setNotification({
          type: 'success',
          message: 'Login successfully'
        })
        setTimeout(() => setNotification(null), 5000)
      })
      .catch(e => {
        setNotification({type: 'error', message: e.response.data.error})
        setTimeout(() => setNotification(null), 5000)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('user')
    setNotification({
      type: 'success',
      message: 'Logged out successfully'
    })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleAddBlog = (e) => {
    e.preventDefault()
    blogService.addBlog(user.token, title, author, url).then(() => {
      setNotification({
        type: 'success',
        message: `Added "${title}" successfully`
      })
      setTimeout(() => setNotification(null), 5000)
      blogService.getAll().then(res => setBlogs(res))
    }).catch(e => {
      setNotification({type: 'error', message: e.response.data.error})
      setTimeout(() => setNotification(null), 5000)
    })
  }

  return (
    <div>
      {
        notification
        ? <div style={{
          borderColor: notification.type === 'success' ? 'green' : 'red',
          borderWidth: '5px',
          borderStyle: 'solid',
          borderRadius: '1rem',
          backgroundColor: 'grey',
          padding: '1rem'
        }}><h2 style={{ padding: 0, margin: 0 }}>{notification?.message}</h2></div>
        : null
      }
      {
      user
      ? <div>
      <h2>blogs</h2>

      {user?.name} logged in
      <button onClick={handleLogout}>Log out</button>

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
          <button>Add blog</button>
        </div>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog}/>
      )}
    </div>
      : <div>
      <h2>login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
      }
    </div>
  )
}

export default App