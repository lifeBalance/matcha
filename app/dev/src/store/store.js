// Redux
import { configureStore } from '@reduxjs/toolkit'

// Slices
import burgerReducer from './burgerSlice'
import authReducer from './authSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    burger: burgerReducer,
    auth: authReducer,
    user: userReducer,
  },
})

export default store