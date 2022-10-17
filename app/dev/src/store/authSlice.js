import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  uid: false,
  isLoggedIn: false,
  isProfiled: false,
  isConfirmed: false,
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
  // 'args' is an OBJECT, so invoke the extraReducer with an Object!!!
  const { username, password, openModal } = args

  try {
    const response = await axios.post('/api/logins', {
      username: username,
      password: password
    }, {
      withCredentials: true
    })

    // console.log(response.data) // testing
    // console.log(args) // testing
    // console.log(thunkAPI) // testing
    return response.data // Important!
  } catch (error) {
    // console.log(args) // testing
    // console.log(thunkAPI) // testing
    // console.log(error.response.data) // testing
    return thunkAPI.rejectWithValue(error.response.data) // Important!
  }
})

const refresh = createAsyncThunk('auth/refresh', async function (args, thunkAPI) {
  let { accessToken } = args
  /* If we receive no Access Token in args, it means the user may have
  RELOAD the page, so we reach to Local Storage to check if there's a 
  token there */
  if (!accessToken) accessToken = localStorage.getItem('accessToken') 
  /* If there's no token in Local storage, it means the user logged out, so 
    there's no "session" to REFRESH! */
  if (!accessToken) return thunkAPI.rejectWithValue('Expired session')

  // console.log(accessToken); return

  try {
    const response = await axios.get('/api/refresh', {
      withCredentials: true,
      headers: { 'Authorization': `Bearer ${args.accessToken}` },
    })

    // console.log( response.data) // testing
    return response.data
  } catch (error) {
    // console.log(error?.response?.data?.message)  // testing
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
    setIsProfiled: (state, action) => {
      // console.log(action);
      state.isProfiled = true
    },
    setIsConfirmed: (state, action) => {
      // console.log(action) // testing
      state.isConfirmed = action.payload
    }
  },
  
  extraReducers: {
    [login.pending]: (state) => {
      state.isLoggingIn = true
    },
    
    [login.fulfilled]: (state, action) => {
      // console.log(action) // testing
      state.isLoggingIn = false

      if (action.payload.type === 'ERROR') {
        state.errorLoggingIn = true
        state.isLoggedIn = false
        action.meta.arg.openModal(action.payload)
        return
      }
      state.isLoggedIn = true
      state.errorLoggingIn = false

      // console.log(action) // testing
      // console.log(action.payload) // testing
      if (action.payload) {
        localStorage.setItem('accessToken', action.payload.access_token)
        state.accessToken = action.payload.access_token
        state.uid = action.payload.uid
        state.isProfiled = action.payload.profiled
        state.isConfirmed = true
        // The callback we passed to the extraReducer is under action.meta.arg!
        action.meta.arg.openModal(action.payload)
      }
    },
    [login.rejected]: (state, action) => {
      state.isLoggingIn = false
      state.errorLoggingIn = action.payload
      // console.log(action) // testing
      // The callback we passed to the extraReducer is under action.meta.arg!
      action.meta.arg.openModal(action.payload)
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
      // console.log(action.payload) // testing

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
      // console.log(action?.payload) // testing

      state.errorLoggingIn = action.payload
      state.isLoggingIn = false
      state.isLoggedIn = false
      localStorage.removeItem('accessToken')
    },
  },
})

export const {
  loginAfterReload,
  resetLoggingInErrors,
  setIsProfiled,
  setIsConfirmed
} = authSlice.actions
export { login, logout, refresh } // async actions
export default authSlice.reducer
