const baseurl = 'http://localhost:3001/anecdotes'

export const getAll = () => fetch(baseurl)
  .then(res => res.json())
  .catch(err => console.log(err))

export const createNew = anecdote => {
  console.log('createNew', anecdote)
  fetch(
    baseurl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anecdote)
    }
  )
    .then(res => res.json())
    .catch(err => console.log(err))
}

export const vote = anecdote => fetch(
  `${baseurl}/${anecdote.id}`,
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote)
  })
  .then(res => res.json())
  .catch(err => console.log(err))

export default { getAll, createNew, vote }
