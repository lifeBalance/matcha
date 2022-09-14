import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJjYW1hZ3J1NjlAb3V0bG9vay5jb20iLCJleHAiOjE2NjMxNzk1MzB9.dpj2X9bxWm15g-uuqktjfAGPckNPLAdrIm7L-0wDDDQ'

const getUsers = createAsyncThunk(
  'users/getUsers',
  async (args = false, thunkAPI) => {
    // console.log(thunkAPI)

    try {
      const url = '/api/users'

      const { data } = await axios({
        url: url,
        method: 'get',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${token}`
        },
      })

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error.message)
    }
})

const DUMMY_USERS = [
  {
    id: 1,
    username: 'foo',
    email: 'foo@bar.com',
  },
  {
    id: 2,
    username: 'foobar',
    email: 'foobar@bar.com',
  },
]

const initialState = {
  users: [],
  isLoading: true,
  error: false
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    test: (state) => {
      state.users = DUMMY_USERS
      state.isLoading = false
      state.error = false
    },
  },
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.isLoading = true
    },
    // action will contain the fetched items (if the fetch request is successful)
    [getUsers.fulfilled]: (state, action) => {
      // console.log(action) // testing
      state.isLoading = false
      state.users = action.payload
    },
    [getUsers.rejected]: (state, action) => {
      state.isLoading = false
      // console.log(action)
      state.error = action.error.message
    },
  },
})

export default usersSlice.reducer
export { getUsers }
export const { test } = usersSlice.actions