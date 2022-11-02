import { createSlice, current } from '@reduxjs/toolkit'

const notifSlice = createSlice({
  name: 'notif',
  initialState: [],
  reducers: {
    addNotif: (state, action) => {
      // console.log(action) // testing
      state.push(action.payload)
      // console.log(current(state)) // testing
    },
    deleteNotifs: (state, action) => {
      return initialState
    }
  },
})

export const {
  addNotif,
  deleteNotif
} = notifSlice.actions

export default notifSlice.reducer
