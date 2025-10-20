import { useEffect, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [showLoginForm, setShowLoginForm] = useState(false)

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs.sort((a, b) => b.likes > a.likes ? 1 : -1)))
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
        setNotification({ type: 'error', message: e.response.data.error })
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

  const notificationStyle = {
    borderWidth: '5px',
    borderStyle: 'solid',
    borderRadius: '1rem',
    backgroundColor: 'grey',
    padding: '1rem'
  }

  const showLogin = () => setShowLoginForm(true)
  const hideLogin = () => setShowLoginForm(false)

  return (
    <div>
      {
        notification
          ? <div style={{
            borderColor: notification.type === 'success' ? 'green' : 'red',
            ...notificationStyle
          }}><h2 style={{ padding: 0, margin: 0 }}>{notification?.message}</h2></div>
          : null
      }
      {
        user
          ? <div>
            <h2>blogs</h2>

            {user?.name ?? user.username} logged in
            <button onClick={handleLogout}>Log out</button>

            <AddBlogForm {...{ user, setNotification, setBlogs }}/>

            {blogs.map(blog =>
              <Blog key={blog.id} {...{ blog, token: user.token, blogs, setBlogs, user }}/>
            )}
          </div>
          : showLoginForm
            ? <LoginForm {...{ handleLogin, username, setUsername, password, setPassword, hideLogin }}/>
            : <button onClick={ showLogin }>Login</button>
      }
    </div>
  )
}

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword, hideLogin }) => <div>
  <h2>login</h2>
  <form onSubmit={handleLogin}>
    <div>
      <label>
        username
        <input
          type="text"
          value={ username }
          onChange={ (e) => setUsername(e.target.value) }
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
    <button onClick={hideLogin}>cancel</button>
  </form>
</div>

const AddBlogForm = ({ user, setNotification, setBlogs }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [formVisible, setFormVisible] = useState(false)
  const hideWhenVisible = { display: formVisible ? 'none' : '' }
  const showWhenVisible = { display: formVisible ? '' : 'none' }

  const handleAddBlog = (e) => {
    e.preventDefault()
    blogService.addBlog(user.token, title, author, url).then(() => {
      setNotification({
        type: 'success',
        message: `Added "${title}" successfully`
      })
      setTimeout(() => setNotification(null), 5000)
      blogService.getAll().then(res => setBlogs(res.sort((a, b) => b.likes > a.likes ? 1 : -1)))
    }).catch(e => {
      setNotification({ type: 'error', message: e.response.data.error })
      setTimeout(() => setNotification(null), 5000)
    })
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

export default App