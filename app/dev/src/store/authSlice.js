import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  uid: false,
  isLoggedIn: false,
  isProfiled: false,
  accessToken: '',
  isLoggingIn: false,
  isLoggingOut: false,
  errorLoggingIn: false,
  errorLoggingOut: false,
}

const logout = createAsyncThunk('auth/logout', async function(args, thunkAPI) {
  try {
    const response = await axios.delete('/api/logins', {
      withCredentials: true
    })

    localStorage.removeItem('accessToken')

    // console.log(response.data)
    return response.data
  } catch (error) {
    // console.log(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const login = createAsyncThunk('auth/login', async function(args, thunkAPI) {
  const { username, password, openModal } = args // invoke it with an Object!

  try {
    const response = await axios.post('/api/logins', {
      username: username,
      password: password
    }, {
      withCredentials: true
    })

    // console.log(response.data);
    return response.data
  } catch (error) {
     // Server responses sent in an JSON object { "message": "value"}
    // console.log(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message)
  } finally {
    openModal() // setModalIsOpen
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
    // console.log(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAfterReload: (state, action) => {
      state.isLoggedIn = true
      state.accessToken = localStorage.getItem('accessToken')
    },
    resetLoggingInErrors: (state) => {
      state.errorLoggingIn = false
    },
    setIsProfiled: (state) => {
      state.isProfiled = true
    }
  },

  extraReducers: {
    [login.pending]: (state) => {
      state.isLoggingIn = true
    },
    [login.fulfilled]: (state, action) => {
      state.isLoggingIn = false
      state.isLoggedIn = true
      state.errorLoggingIn = false

      console.log(action.payload); // testing
      if (action.payload && action.payload.access_token) {
        localStorage.setItem('accessToken', action.payload.access_token)
        state.accessToken = action.payload.access_token
        state.uid = action.payload.uid
      }
    },
    [login.rejected]: (state, action) => {
      state.isLoggingIn = false
      state.errorLoggingIn = action.payload
      // console.log(action.payload)
      // console.log(state.errorLoggingIn)
    },

    // LOGOUT
    [logout.pending]: (state, action) => {
      state.isLoggingOut = true
      // if (action) console.log(action)
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false
      state.errorLoggingIn = false
      state.accessToken = ''
      localStorage.removeItem('accessToken')
      // if (action) console.log(action)
    },
    [logout.rejected]: (state, action) => {
      state.errorLoggingOut = action.payload
      state.isLoggingOut = false
      // if (action) console.log(action)
    },

    // Silent Token Refresh
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

      // console.log(action.payload)
      state.errorLoggingIn = action.payload
    },
  },
})

export const { loginAfterReload, resetLoggingInErrors } = authSlice.actions
export { login, logout, refresh } // async actions
export default authSlice.reducer
