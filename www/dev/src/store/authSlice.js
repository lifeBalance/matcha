import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoggedIn: true,
  isLoading: false,
  accessToken: '',
  error: false
}

const login = createAsyncThunk(
  'auth/login',
  async (args, thunkAPI) => {
    const { email, password } = args

    try {
      const url = '/api/login'

      const { data } = await axios({
        url: url,
        method: 'post',
        data: {
          email: email,
          password: password
        }
      })

      return data
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
      state.isLoggedIn = false,
      state.accessToken = ''
      localStorage.removeItem('accessToken')
    },
    setTokenAndLogin: (state, action) => {
      state.isLoggedIn = true,
      state.idToken = action.payload
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

      if (action.payload && action.payload.idToken) {
        state.accessToken = action.payload.idToken
        state.error = null
        // Store the Access Token in local storage
        localStorage.setItem('accessToken', state.accessToken)
        // Store the Refresh Token in hardened cookie
        // For developing our SPA set SameSite=None (at deploy SameSite=Strict)
        document.cookie = `matcha=${action.payload.refreshToken}; SameSite=None; HttpOnly; Secure`
        // Setting HttpOnly means we can't see it in Application/Cookies (but it's sent automatically by the browser)
      }
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false
      // console.log(action.payload)
      state.error = action.payload // this works with Axios!!
    },
  }
})

export const { logout, setTokenAndLogin } = authSlice.actions
export { login }
export default authSlice.reducer