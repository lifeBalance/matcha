import { createSlice, current } from '@reduxjs/toolkit'

const notifSlice = createSlice({
  name: 'notif',
  initialState: {
    newNotifs: 0,
    newMsgs: 0,       // for the navigation bar
    updatedConvos: [],
    isLoadingNotifs: false,
    /* 'matchesChanged' is just a "trigger", meaning that it's not 
      its boolean value what matters, but its CHANGE in state. */
    matchesChanged: false
  },
  reducers: {
    increaseNewNotifs: (state, action) => {
      state.newNotifs += 1
      // console.log(current(state)) // testing
    },
    resetNewNotifs: (state, action) => {
      state.newNotifs = 0
    },
    setNewMsgs: (state, action) => {
      state.newMsgs = action.payload
      // console.log(current(state)) // testing
    },
    increaseNewMsgs: (state, action) => {
      state.newMsgs += 1
      // console.log(current(state)) // testing
    },
    resetNewMsgs: (state, action) => {
      state.newMsgs = 0
    },
    refetchConvos: (state, action) => {
      state.matchesChanged = !state.matchesChanged
    },
    updateConvo: (state, action) => {
      // console.log('notifSlice: updateConvo '+action.payload) // testing
      if (!state.updatedConvos.includes(action.payload))
      state.updatedConvos.push(action.payload)
    },
    setConvoAsSeen: (state, action) => {
      // console.log('notifSlice: setConvoAsSeen '+action.payload + ' type: '+ typeof action.payload)
      // console.log(current(state.updatedConvos)) // testing
      state.updatedConvos = state.updatedConvos.filter(i => i !== action.payload)
    },
  },
})

export const {
  increaseNewNotifs,
  resetNewNotifs,
  setNewMsgs,
  increaseNewMsgs,
  resetNewMsgs,
  refetchConvos,
  updateConvo,
  setConvoAsSeen
} = notifSlice.actions

export default notifSlice.reducer
