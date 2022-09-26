// Redux
import { configureStore } from '@reduxjs/toolkit'

// Slices
import burgerReducer from './burgerSlice'
import authReducer from './authSlice'
import testReducer from './testSlice'
import usersReducer from './usersSlice'
import userReducer from './userSlice'
import profileReducer from './profileSlice'

const store = configureStore({
  reducer: {
    burger: burgerReducer,
    auth: authReducer,
    test: testReducer,
    users: usersReducer,
    user: userReducer,
    profile: profileReducer,
  },
})

export default store