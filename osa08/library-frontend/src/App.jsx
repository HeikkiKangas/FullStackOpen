import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login.jsx'
import { useApolloClient, useQuery } from '@apollo/client/react'
import Recommend from './components/Recommend.jsx'
import { ME } from './queries.js'

const App = () => {
  const client = useApolloClient()
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const userQuery = useQuery(ME)

  useEffect(() => {
    const storedToken = localStorage.getItem('books-user-token')
    if (storedToken) setToken(storedToken)
  }, [])

  const login = (token) => {
    setToken('Bearer ' + token)
    localStorage.setItem('books-user-token', 'Bearer ' + token)
    setPage('authors')
  }

  const logout = () => {
    setToken(null)
    client.resetStore()
    localStorage.clear()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          token
            ? <button onClick={() => setPage('add')}>add book</button>
            : <button onClick={() => setPage('login')}>login</button>
        }
        { token && <button onClick={() => setPage('recommend')}>recommend</button> }
        { token && <button onClick={logout}>logout</button> }
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommend show={page === 'recommend'} favoriteGenre={userQuery?.data?.me?.favoriteGenre}/>

      <Login show={page === 'login'} login={login} />
    </div>
  )
}

export default App
