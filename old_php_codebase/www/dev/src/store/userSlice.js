import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'
import { refresh } from '../store/authSlice'

const fetchUser = axios.create({
  baseURL: '/api',
})

fetchUser.interceptors.response.use(
  // If all goes smooth:
  response => {
    // console.log(response)
    return response // Returning the response is ESSENTIAL!!
  },

  error => {
    // If accessToken was expired (we got 401), we intercept the response:
    if (error.response.status === 401) {
      // console.log('JWTs were Silently Refreshed!');
      return error.response.config.refreshTokens()
        .then(resp => {
          error.response.config.headers = {
            'Authorization': `Bearer ${resp.payload.access_token}`
          }
          // and repeat the request for the user, with a new accessToken
          return axios.request(error.response.config)
        })
        .catch(e => console.log(e))
    }
    return Promise.reject(error)
  }
)

const getUser = createAsyncThunk('user/getUser', async (args, thunkAPI) => {
  try {
    const response = await fetchUser({
      url: '/users',
      method: 'get',
      params: {id: args.id},
      headers: { 'Authorization': `Bearer ${args.accessToken}` },
      refreshTokens: () => thunkAPI.dispatch(refresh()),
    })

    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message)
  }
})

const initialState = {
  user: false,
  userIsLoading: true,
  errorFetchingUser: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [getUser.pending]: (state) => {
      state.userIsLoading = true
    },

    [getUser.fulfilled]: (state, action) => {
      // console.log(action) // testing
      state.userIsLoading = false
      state.errorFetchingUser = false
      state.user = action.payload
    },

    [getUser.rejected]: (state, action) => {
      state.userIsLoading = false
      console.log(action)
      state.errorFetchingUser = action.error.message
    },
  },
})

export default userSlice.reducer
export { getUser }
// export const {} = usersSlice.actions