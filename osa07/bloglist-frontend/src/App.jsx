import {useContext, useEffect, useState} from 'react'
import BlogDetails from './components/BlogDetails.jsx'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import NotificationContext from "./NotificationContext.jsx";
import Notification from "./components/Notification.jsx";
import UserContext from "./UserContext.jsx";
import {useQuery} from "@tanstack/react-query"
import {Route, Routes, useMatch} from "react-router-dom";
import UsersList from "./components/UsersList.jsx"
import UserDetails from "./components/UserDetails.jsx"
import Blog from "./components/Blog.jsx"
import Navbar from "./components/Navbar.jsx"
import {Container, Button} from "@mui/material"

const App = () => {
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

  const match = useMatch('/blogs/:id')

  const blog = match && blogs.isSuccess ? blogs.data.find(a => a.id === match.params.id) : null

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

  const handleLogout = () => {
    userDispatch({ type: 'LOG_OUT' })
    window.localStorage.removeItem('user')
    showNotification('Logout successfully')
  }

  const showLogin = () => setShowLoginForm(true)
  const hideLogin = () => setShowLoginForm(false)

  return (
    <Container>
      <Notification/>
      {
        user
          ? <>
            <Navbar />
            <h2>Blogs</h2>
            {user?.name ?? user.username} logged in
            <Button variant='outlined' onClick={handleLogout}>Log out</Button>

            <Routes>
              <Route path="/" element={
                <div>
                  <AddBlogForm {...{user, showNotification}} />
                  <div style={{ marginTop: '0.5rem' }}>
                  {
                    blogs?.data && blogs?.data?.sort((a, b) => a.likes > b.likes ? -1 : 1)
                    .map(blog =>
                      <Blog key={blog.id} blog={blog}/>
                    )
                  }
                  </div>
                </div>
              }/>
              <Route path="/users/:id" element={<UserDetails user={user} />}/>
              <Route path="/blogs/:id" element={<BlogDetails blog={blog} />}/>
              <Route path="/users" element={<UsersList/>} />
            </Routes>
          </>
          : showLoginForm
            ? <LoginForm {...{ handleLogin, username, setUsername, password, setPassword, hideLogin }}/>
            : <Button variant='outlined' onClick={ showLogin }>Login</Button>
      }
    </Container>
  )
}

export default App
