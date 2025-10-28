import {Button} from '@mui/material'
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
    <Button variant='outlined' type="submit">login</Button>
    <Button variant='outlined' onClick={hideLogin}>cancel</Button>
  </form>
</div>

export default LoginForm
