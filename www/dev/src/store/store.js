// Redux
import { configureStore } from '@reduxjs/toolkit'

// Slices
import burgerReducer from './burgerSlice'
import testReducer from './testSlice'
import usersReducer from './usersSlice'

const store = configureStore({
  reducer: {
    burger: burgerReducer,
    test: testReducer,
    users: usersReducer,
  },
})

export default store