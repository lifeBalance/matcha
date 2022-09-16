import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoggedIn: false,
  accessToken: '',
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

const login = createAsyncThunk(
  'auth/login',
  async function(args, thunkAPI) {
    const { username, password } = args // make sure you send an Object!!!

    try {
      const response = await axios.post('/api/login', {
          username: username,
          password: password
      }, {
        withCredentials: true
      })

      return response.data
    } catch (error) {
      console.log(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  })

const refresh = createAsyncThunk(
  'auth/refresh',
  async function(args, thunkAPI) {
    // If there's no Access Token in Local Storage, it means the user didn't 
    // log in, so there's no token to REFRESH!
    if (!localStorage.getItem('accessToken')) { 
      return thunkAPI.rejectWithValue('Expired session')
    }

    try {
      const response = await axios.post('/api/refresh', {
        withCredentials: true
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
      state.accessToken = ''
      localStorage.removeItem('accessToken')
    },
    loginAfterReload: (state, action) => {
      state.isLoggedIn = true
      state.accessToken = localStorage.getItem('accessToken')
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

      console.log(action.payload);
      if (action.payload && action.payload.access_token) {
        localStorage.setItem('accessToken', action.payload.access_token)
        state.accessToken = action.payload.access_token
      }
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false
      // console.log(action.payload)
      state.error = action.payload
    },

    [refresh.pending]: (state) => {
      state.isLoading = true
    },

    [refresh.fulfilled]: (state, action) => {
      state.isLoading = false
      state.isLoggedIn = true
      state.error = null

      console.log(action.payload);
      if (action.payload && action.payload.access_token) {
        // localStorage.removeItem('accessToken')
        localStorage.setItem('accessToken', action.payload.access_token)
        state.accessToken = action.payload.access_token
      }
    },
    [refresh.rejected]: (state, action) => {
      state.isLoading = false
      state.isLoggedIn = false
      localStorage.removeItem('accessToken')

      console.log(action.payload)
      state.error = action.payload
    },
  },
})

export const { logout, loginAfterReload } = authSlice.actions
export { login, refresh }
export default authSlice.reducer
