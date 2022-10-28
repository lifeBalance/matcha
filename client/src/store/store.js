// Redux
import { configureStore } from '@reduxjs/toolkit'

// Slices
import burgerReducer from './burgerSlice'
import authReducer from './authSlice'

const store = configureStore({
  reducer: {
    burger: burgerReducer,
    auth: authReducer
  },
})

export default store