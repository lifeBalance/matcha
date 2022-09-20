import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoggedIn: false,
  accessToken: '',
  isLoggingIn: false,
  errorLoggingIn: false,
}

const login = createAsyncThunk('auth/login', async function(args, thunkAPI) {
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
    console.log(error.response.data);
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const refresh = createAsyncThunk('auth/refresh', async (args, thunkAPI) => {
  // If there's no Access Token in Local Storage, it means
  // the user didn't log in, so there's no token to REFRESH!
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
      state.isLoggingIn = true
    },

    [login.fulfilled]: (state, action) => {
      state.isLoggingIn = false
      state.isLoggedIn = true
      state.errorLoggingIn = false

      // console.log(action.payload);
      if (action.payload && action.payload.access_token) {
        localStorage.setItem('accessToken', action.payload.access_token)
        state.accessToken = action.payload.access_token
      }
    },
    [login.rejected]: (state, action) => {
      state.isLoggingIn = false
      // console.log(action.payload);
      state.errorLoggingIn = action.payload
    },

    [refresh.pending]: (state) => {
      state.isLoggingIn = true
    },

    [refresh.fulfilled]: (state, action) => {
      state.isLoggingIn = false
      state.isLoggedIn = true
      state.errorLoggingIn = null

      if (action.payload && action.payload.access_token) {
        // localStorage.removeItem('accessToken')
        localStorage.setItem('accessToken', action.payload.access_token)
        state.accessToken = action.payload.access_token
      }
    },
    [refresh.rejected]: (state, action) => {
      state.isLoggingIn = false
      state.isLoggedIn = false
      localStorage.removeItem('accessToken')

      console.log(action.payload)
      state.errorLoggingIn = action.payload
    },
  },
})

export const { logout, loginAfterReload } = authSlice.actions
export { login, refresh }
export default authSlice.reducer
