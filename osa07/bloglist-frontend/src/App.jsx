import {useContext, useEffect, useState} from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import NotificationContext from "./NotificationContext.jsx";
import Notification from "./components/Notification.jsx";
import UserContext from "./UserContext.jsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

const App = () => {
  //const [blogs, setBlogs] = useState([])
  //const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showLoginForm, setShowLoginForm] = useState(false)

  const { notificationDispatch } = useContext(NotificationContext)
  const { user, userDispatch } = useContext(UserContext)

  const showNotification = (payload) => {
    notificationDispatch({ type: 'SET_NOTIFICATION', payload })
    setTimeout(() => notificationDispatch({ type: 'CLEAR_NOTIFICATION' }), 5000)
  }

  const blogs = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    enabled: !!user
  })

  /*
  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs.sort((a, b) => b.likes > a.likes ? 1 : -1)))
    }
  }, [user])
  */

  useEffect(() => {
    const savedUser = window.localStorage.getItem('user')
    if (savedUser) {
      userDispatch({ type: 'LOG_IN', payload: JSON.parse(savedUser) })
    }
  }, [userDispatch])

  const handleLogin = (e) => {
    e.preventDefault()
    loginService
      .login(username, password)
      .then(result => {
        userDispatch({ type: 'LOG_IN', payload: result })
        window.localStorage.setItem('user', JSON.stringify(result))
        setUsername('')
        setPassword('')
        showNotification('Login successfully')
      })
      .catch(e => {
        notificationDispatch({ type: 'SET_NOTIFICATION', payload: e.response.data.error })
        setTimeout(() => notificationDispatch({ type: 'CLEAR_NOTIFICATION' }), 5000)
      })
  }



  const handleLike = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }

    blogService.updateBlog(user.token, updatedBlog)
      .then(response => {
        //setBlogs(blogs.map(b => b.id === updatedBlog.id ? response : b).sort((a, b) => b.likes > a.likes ? 1 : -1))
      })
  }

  const handleLogout = () => {
    userDispatch({ type: 'LOG_OUT' })
    window.localStorage.removeItem('user')
    showNotification('Logout successfully')
  }

  const showLogin = () => setShowLoginForm(true)
  const hideLogin = () => setShowLoginForm(false)

  return (
    <div>
      <Notification/>
      {
        user
          ? <div>
            <h2>blogs</h2>

            {user?.name ?? user.username} logged in
            <button onClick={handleLogout}>Log out</button>

            <AddBlogForm {...{user, showNotification}} />

            {blogs?.data && blogs?.data?.sort((a, b) => a.likes > b.likes ? -1 : 1).map(blog =>
              <Blog key={blog.id} {...{ blog, token: user.token, blogs, user, handleLike }}/>
            )}
          </div>
          : showLoginForm
            ? <LoginForm {...{ handleLogin, username, setUsername, password, setPassword, hideLogin }}/>
            : <button onClick={ showLogin }>Login</button>
      }
    </div>
  )
}

export default App
