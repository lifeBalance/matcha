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
  profilePic: '',
  gps: {
    coords: { lat: 0, lng: 0 },
    manual: false
  }
}

const logout = createAsyncThunk('auth/logout', async function(args, thunkAPI) {
  try {
    const response = await axios.delete('/api/logins', {
      withCredentials: true
    })

    localStorage.removeItem('accessToken')
    localStorage.removeItem('matcha')

    // console.log(response.data)
    return response.data
  } catch (error) {
    // console.log(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const login = createAsyncThunk('auth/login', async function(args, thunkAPI) {
  // 'args' is an OBJECT, so invoke the extraReducer with an Object!!!
  const { username, password } = args
console.log(thunkAPI.getState().auth) // testing
  try {
    const response = await axios.post('/api/logins', {
      username: username,
      password: password,
      gps: thunkAPI.getState().auth.gps
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
  /*  If we receive no Access Token in args, it means the user may have
    RELOADED the page, and the Access Token is not in memory anymore, so we 
    reach for Local Storage to check if there's a token there */
  if (!accessToken) accessToken = JSON.parse(localStorage.getItem('matcha')).accessToken
  /* If there's no token in Local storage, it means the user logged out, so 
    there's no "session" to REFRESH! */
  if (!accessToken) return thunkAPI.rejectWithValue('Expired session')

  // console.log(accessToken); return

  try {
    const response = await axios.get('/api/refresh', {
      withCredentials: true,
      headers: { 'Authorization': `Bearer ${accessToken}` },
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
      state.isLoggingIn = true
      const matcha = JSON.parse(action.payload)
      // console.log('slice: '+action.payload)  // testing

      const {
        uid,
        accessToken,
        isProfiled,
        isConfirmed,
        profilePic
      } = matcha

      state.isLoggedIn = true
      state.uid = uid
      state.accessToken = accessToken
      state.isProfiled = isProfiled
      state.isConfirmed = isConfirmed
      state.profilePic = profilePic
      state.isLoggingIn = false
    },
    resetLoggingInErrors: (state) => {
      state.errorLoggingIn = false
    },
    setIsProfiled: (state, action) => {
      // console.log(action) // testing
      state.isProfiled = action.payload
    },
    setIsConfirmed: (state, action) => {
      // console.log(action) // testing
      state.isConfirmed = action.payload
    },
    setProfilePic: (state, action) => {
      // Set in memory state
      state.profilePic = action.payload

      // Persist state to Local storage
      const matcha = JSON.parse(localStorage.getItem('matcha'))
      matcha.profilePic = action.payload
      localStorage.setItem('matcha', JSON.stringify(matcha))
    },
    setCoords: (state, action) => {
      state.gps.coords = action.payload
      console.log('auth Slice: ' + JSON.stringify(action.payload)) // testing
    },
    setManualLocation: (state, action) => {
      state.gps.manual = action.payload
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

      // console.log(action) // testing
      // console.log(action.payload) // testing
      if (action.payload) {
        state.isLoggedIn = true
        state.errorLoggingIn = false
        state.accessToken = action.payload.access_token
        state.uid = action.payload.uid
        state.isProfiled = action.payload.profiled
        state.isConfirmed = action.payload.confirmed
        state.profilePic = action.payload.profile_pic

        // Let's save these pieces of state in Local Storage
        const matcha = {
          uid: action.payload.uid,
          accessToken: action.payload.access_token,
          isProfiled: action.payload.profiled,
          isConfirmed: action.payload.confirmed,
          profilePic: action.payload.profile_pic,
        }
        localStorage.setItem('matcha', JSON.stringify(matcha))

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
      localStorage.removeItem('matcha')
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
        // We receive lots of intel in the payload; let's set state:
        state.accessToken = action.payload.access_token
        state.uid         = action.payload.uid
        state.profilePic  = action.payload.profile_pic
        state.profiled    = action.payload.profiled
        state.confirmed   = action.payload.confirmed
        // Grab the Local Storage item
        const matcha = localStorage.getItem('matcha')
        // console.log(matcha)   // testing

        // Parse it into an object
        const parsed = JSON.parse(matcha)

        // Update its Access token property
        parsed.accessToken = action.payload.access_token

        // Save it back to Local Storage
        localStorage.setItem('matcha', JSON.stringify({ ...parsed }))
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
  setIsConfirmed,
  setProfilePic,
  setCoords,
  setManualLocation
} = authSlice.actions
export { login, logout, refresh } // async actions
export default authSlice.reducer
