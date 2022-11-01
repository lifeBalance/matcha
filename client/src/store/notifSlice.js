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
  },
})

export const {
  addNotif
} = notifSlice.actions

export default notifSlice.reducer
