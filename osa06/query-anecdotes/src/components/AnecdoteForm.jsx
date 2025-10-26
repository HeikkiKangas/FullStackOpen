import { createAnecdote } from '../requests.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext.jsx'

const getId = () => (100000 * Math.random()).toFixed(0)

const AnecdoteForm = () => {
  const { notificationDispatch } = useContext(NotificationContext)

  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (data ) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: `Add anecdote '${data.content}'` })
      setTimeout(() => notificationDispatch({ type: 'SET_NOTIFICATION', payload: '' }), 5000)
    },
    onError: () => {
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: 'too short anecdote, must have length of 5 or more' })
      setTimeout(() => notificationDispatch({ type: 'SET_NOTIFICATION', payload: '' }), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, id: getId(), votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
