import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: []
}

const notifSlice = createSlice({
  name: 'notif',
  initialState,
  reducers: {
    addNotif: (state, action) => {
      console.log(action) // testing
      state.notifications = [...state.notifications, action.payload]
    },
    deleteNotif: (state, action) => {
      console.log(action)
    }
  },
})

export const {
  addNotif,
  deleteNotif
} = notifSlice.actions

export default notifSlice.reducer
