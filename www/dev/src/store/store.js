// Redux
import { configureStore } from '@reduxjs/toolkit'

// Slices
import burgerReducer from './burgerSlice'

const store = configureStore({
  reducer: {
    burger: burgerReducer,
  },
})

export default store