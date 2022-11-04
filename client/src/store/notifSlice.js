import { createSlice, current } from '@reduxjs/toolkit'

const notifSlice = createSlice({
  name: 'notif',
  initialState: {
    notifications: [],
    newNotifs: 0,
    isLoadingNotifs: false,
  },
  reducers: {
    increaseNewNotifs: (state, action) => {
      state.newNotifs += 1
      // console.log(current(state)) // testing
    },
    resetNewNotifs: (state, action) => {
      state.newNotifs = 0
    },
  },
})

export const {
  increaseNewNotifs,
  resetNewNotifs
} = notifSlice.actions

export default notifSlice.reducer
