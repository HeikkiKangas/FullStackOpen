import { createAddAnecdoteAction } from '../reducers/anecdoteReducer.js'
import { useDispatch } from 'react-redux'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.content.value
    e.target.content.value = ''
    console.log('addAnecdote, content:', content)
    dispatch(createAddAnecdoteAction(content))
  }

  return (
    <>
      <h2>create new anecdote</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='content'/>
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
