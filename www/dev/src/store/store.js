// Redux
import { configureStore } from '@reduxjs/toolkit'

// Slices
import burgerReducer from './burgerSlice'
import authReducer from './authSlice'
import testReducer from './testSlice'
import usersReducer from './usersSlice'

const store = configureStore({
  reducer: {
    burger: burgerReducer,
    test: testReducer,
    users: usersReducer,
    auth: authReducer,
  },
})

export default store