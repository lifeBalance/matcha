import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoggedIn: false,
  isLoading: false,
  accessToken: '',
  error: false,
}
/*
// Chained version
const login = createAsyncThunk('auth/login', function (args, thunkAPI) {
  const { username, password } = args

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
    const { username, password } = args

    try {
      const response = await axios.post('/api/login', {
          username: username,
          password: password
      })

      console.log(response.data);
      return response.data
    } catch (error) {
      console.log(error.response.data.error.message);
      return thunkAPI.rejectWithValue(error.response.data.error.message)
    }
  })

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false
      state.accessToken = ''
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
      console.log(action) // <-- promise fulfilled, payload undefined :-(
      state.isLoading = false
      state.isLoggedIn = true
      state.error = null

      if (action.payload && action.payload.access_token) {
        // Store the Access Token in memory
        state.accessToken = action.payload.access_token
        // Store the Access Token in local storage
        localStorage.setItem('accessToken', state.accessToken)
      }
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false
      console.log(action)
      console.log(action.error)
      // state.error = action.payload // this works with Axios!!
    },
  },
})

export const { logout, loginAfterReload } = authSlice.actions
export { login }
export default authSlice.reducer
