import { createAnecdote } from '../reducers/anecdoteReducer.js'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer.js'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.content.value
    e.target.content.value = ''
    console.log('addAnecdote, content:', content)
    dispatch(createAnecdote(content))
    dispatch(setNotification('Created anecdote: ' + content))
    setTimeout(() => dispatch(setNotification('')), 5000)
  }

  return (
    <div>
      <h2>create new anecdote</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='content'/>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
