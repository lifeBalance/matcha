import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoggedIn: false,
  isLoading: false,
  accessToken: '',
  error: false
}

const login = createAsyncThunk(
  'auth/login',
  function(args, thunkAPI) {
    const { username, password } = args

    axios.post('/api/login', {
      username: 'Testing',
      password: 'Asdf1!'
    })
    .then(function (response) {
      console.log(response.data)
      return response.data
    })
    .catch(function (error) {
      console.log(error)
      return error
    });
  })
  
/*
    try {
      const { data } = await axios({
        url: '/api/login',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'post',
        data: {
          username: username,
          password: password
        }
      })

      console.log(data);
      return data
    } catch (error) {
      console.log(error.response.data.error.message);
      return thunkAPI.rejectWithValue(error.response.data.error.message)
    }
    */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false,
      state.accessToken = ''
      localStorage.removeItem('accessToken')
    },
    setTokenAndLogin: (state, action) => {
      state.isLoggedIn = true,
      state.accessToken = action.payload
    },
  },

  extraReducers: {
    [login.pending]: (state) => {
      state.isLoading = true
    },

    [login.fulfilled]: (state, action) => {
      console.log(action) // testing
      state.isLoading = false
      state.isLoggedIn = true

      if (action.payload && action.payload.access_token) {
        state.accessToken = action.payload.access_token
        state.error = null
        // Store the Access Token in local storage
        localStorage.setItem('accessToken', state.accessToken)
        // Store the Refresh Token in hardened cookie
        // For developing our SPA set temporarily SameSite=None
        // (at deploy SameSite=Strict)
        document.cookie = `matcha=${action.payload.refresh_token}; SameSite=None; HttpOnly; Secure`
        // Setting HttpOnly means we can't see it in Application/Cookies (but it's sent automatically by the browser)
      }
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false
      console.log(action)
      console.log(action.error)
      // state.error = action.payload // this works with Axios!!
    },
  }
})

export const { logout, setTokenAndLogin } = authSlice.actions
export { login }
export default authSlice.reducer