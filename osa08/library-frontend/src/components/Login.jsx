import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const Login = (props) => {
  const [login] = useMutation(LOGIN)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (!props.show) return null

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await login({
      variables: {
        username,
        password
      }
    })
    const token = res?.data?.login?.value
    if (token) props.login(token)
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username
          <input
            style={{ marginLeft: '0.5rem' }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password
          <input
            style={{ marginLeft: '0.5rem' }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login
