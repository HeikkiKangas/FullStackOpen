import { createSlice } from '@reduxjs/toolkit'
import { createNew, getAll, vote } from '../service/anecdotes.js'
import { showNotification } from './notificationReducer.js'

const alphabeticalAnecdoteSorter = (a, b) => {
  if (a.votes === b.votes) {
    return a.content.toLowerCase().charCodeAt(0) < b.content.toLowerCase().charCodeAt(0) ? -1 : 1
  } else {
    return a.votes > b.votes ? -1 : 1
  }
}

export const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addAnecdote: (state, action) => [...state, action.payload].sort(alphabeticalAnecdoteSorter),
    addVote: (state, action) => {
      const id = action.payload
      state.forEach(anecdote => {
        if (id === anecdote.id) {
          anecdote.votes += 1
        }
      })
      return state.sort(alphabeticalAnecdoteSorter)
    },
    setAnecdotes: (state, action) => action.payload.sort(alphabeticalAnecdoteSorter)
  }
})

const {
  addAnecdote,
  addVote,
  setAnecdotes
} = anecdoteSlice.actions

export const createAnecdote = content =>
  async (dispatch) => {
    const newAnecdote = { content, id: getId(), votes: 0 }
    await createNew(newAnecdote)
    dispatch(addAnecdote(newAnecdote))
    dispatch(showNotification('Created ' + newAnecdote.content, 5))
  }


export const initilizeAnecdotes = () =>
  async (dispatch) => {
    const anecdotes = await getAll()
    dispatch(setAnecdotes(anecdotes))
  }


export const voteAnecdote = id =>
  async (dispatch, getState) => {
    let anecdote = { ...getState().anecdotes.find(a => a.id === id) }
    anecdote.votes += 1
    await vote(anecdote)
    dispatch(addVote(anecdote.id))
    dispatch(showNotification('Voted ' + anecdote.content, 5))
  }

export default anecdoteSlice.reducer
