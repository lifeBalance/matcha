// Redux
import { configureStore } from '@reduxjs/toolkit'

// Slices
import burgerReducer from './burgerSlice'
import authReducer from './authSlice'
import notifReducer from './notifSlice'

const store = configureStore({
  reducer: {
    burger: burgerReducer,
    auth: authReducer,
    notif: notifReducer
  },
})

export default store