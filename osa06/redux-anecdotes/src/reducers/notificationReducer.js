import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification: (state, action) => action.payload
  }
})

const { setNotification } = notificationSlice.actions

export const showNotification = (message, time) =>
  async (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => dispatch(setNotification('')), time * 1000)
  }

export default notificationSlice.reducer
