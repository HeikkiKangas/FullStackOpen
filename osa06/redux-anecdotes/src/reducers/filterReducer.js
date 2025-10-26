export const createSetFilterAction = (filter) => ({
  type: 'SET_FILTER',
  payload: filter.toLowerCase()
})

export const filterReducer = (state = '', action) => {
  switch (action.type) {
  case 'SET_FILTER':
    return action.payload
  default:
    return state
  }
}
