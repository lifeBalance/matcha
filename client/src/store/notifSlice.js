import { createSlice, current } from '@reduxjs/toolkit'

const notifSlice = createSlice({
  name: 'notif',
  initialState: { notifications: [], newNotifs: 0 },
  reducers: {
    increaseNewNotifs: (state, action) => {
      state.newNotifs += 1
      // console.log(current(state)) // testing
    },
    resetNewNotifs: (state, action) => {
      state.newNotifs = 0
    },
    setNotifs: (state, action) => {
      // console.log(action) // testing
      state.notifications = action.payload
      // console.log(current(state)) // testing
    },
    addNotif: (state, action) => {
      // console.log(action) // testing
      state.notifications.push(action.payload)
      // console.log(current(state)) // testing
    },
    deleteAllNotifs: (state, action) => {
      return initialState
    },
    deleteNotif: (state, action) => {
      // console.log(action) // testing
      // console.log(current(state)) // testing
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
  },
})

export const {
  setNotifs,
  addNotif,
  increaseNewNotifs,
  resetNewNotifs,
  deleteNotifs,
  deleteNotif
} = notifSlice.actions

export default notifSlice.reducer
