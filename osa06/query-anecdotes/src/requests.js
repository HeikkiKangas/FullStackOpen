const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

export const createAnecdote = async (anecdote) => {
  const response = await fetch(
    baseUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anecdote)
    }
  )
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  return await response.json()
}

export const voteAnecdote = async (anecdote) => {
  const response = await fetch(
    `${baseUrl}/${anecdote.id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 })
    }
  )
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  return await response.json()
}