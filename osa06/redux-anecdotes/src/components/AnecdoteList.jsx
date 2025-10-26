import { useDispatch, useSelector } from 'react-redux'
import { createVoteAction } from '../reducers/anecdoteReducer.js'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  const vote = id => {
    console.log('vote, id:', id)
    dispatch(createVoteAction(id))
  }

  return (
    <>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
