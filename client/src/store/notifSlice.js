import { createSlice, current } from '@reduxjs/toolkit'

const notifSlice = createSlice({
  name: 'notif',
  initialState: {
    notifications: [],
    newNotifs: 0,
    newConvos: [],
    newMsgs: 0,
    isLoadingNotifs: false,
  },
  reducers: {
    setNewNotifs: (state, action) => {
      state.newNotifs = action.payload
      // console.log(current(state)) // testing
    },
    setNewMsgs: (state, action) => {
      state.newMsgs = action.payload
      // console.log(current(state)) // testing
    },
    increaseNewNotifs: (state, action) => {
      state.newNotifs += 1
      // console.log(current(state)) // testing
    },
    increaseNewMsgs: (state, action) => {
      state.newMsgs += 1
      // console.log(current(state)) // testing
    },
    resetNewNotifs: (state, action) => {
      state.newNotifs = 0
    },
    resetNewConvos: (state, action) => {
      state.newConvos = 0
    },
  },
})

export const {
  setNewNotifs,
  increaseNewNotifs,
  resetNewNotifs,
  setNewMsgs,
  increaseNewMsgs,
  resetNewConvos,
} = notifSlice.actions

export default notifSlice.reducer
