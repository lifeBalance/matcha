import { createSlice, current } from '@reduxjs/toolkit'

const notifSlice = createSlice({
  name: 'notif',
  initialState: {
    notifications: [],
    newNotifs: 0,
    newMsgs: 0,       // for the navigation bar
    changedConvos: [],
    isLoadingNotifs: false,
    /* 'matchesChanged' is just a "trigger", meaning that it's not 
      its boolean value what matters, but its CHANGE in state. */
    matchesChanged: false
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
    refetchConvos: (state, action) => {
      state.matchesChanged = !state.matchesChanged
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
  refetchConvos
} = notifSlice.actions

export default notifSlice.reducer
