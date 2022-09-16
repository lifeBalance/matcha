import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoggedIn: false,
  isLoading: false,
  error: false,
}
/*
// Chained version
const login = createAsyncThunk('auth/login', function (args, thunkAPI) {
  const { username, password } = args // make sure you send an Object!!!

  return axios
    .post('/api/login', {
      username: 'Testing',
      password: 'Asdf1!',
    })
    .then(function (response) {
      console.log(response.data) // <== This prints nicely
      return response.data
    })
    .catch(function (error) {
      console.log(error)
      return error
    })
})
 */

/* TODO: add an interceptor, which detects the 401 status,
 stores the failing request in a queue, and calls the /api/refresh endpoint. */
const login = createAsyncThunk(
  'auth/login',
  async function(args, thunkAPI) {
    const { username, password } = args // make sure you send an Object!!!

    try {
      const response = await axios.post('/api/login', {
          username: username,
          password: password
      })

      return response.data
    } catch (error) {
      console.log(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  })

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false
      localStorage.removeItem('accessToken')
    },
    loginAfterReload: (state, action) => {
      state.isLoggedIn = true
    },
  },

  extraReducers: {
    [login.pending]: (state) => {
      state.isLoading = true
    },

    [login.fulfilled]: (state, action) => {
      state.isLoading = false
      state.isLoggedIn = true
      state.error = null

      if (action.payload && action.payload.access_token) {
        localStorage.setItem('accessToken', state.accessToken)
      }
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false
      // console.log(action.payload)
      state.error = action.payload
    },
  },
})

export const { logout, loginAfterReload } = authSlice.actions
export { login }
export default authSlice.reducer
