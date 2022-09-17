import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'
import { refresh } from '../store/authSlice'

const fetchUsers = axios.create({
  baseURL: '/api',
})

fetchUsers.interceptors.response.use(
  // If all goes smooth:
  response => response, // Returning the response is ESSENTIAL!!

  /* If the interceptor fails, we check for a 401 (unauthorized) status,
    in that case, we invoke the refresh reducer from the auth slice to
    refresh our JWTs */
  error => {
    if (error.response.status === 401) {
      // console.log('JWTs were Silently Refreshed!');
      return error.response.config.refreshTokens()
        .then(resp => {
          error.response.config.headers = {
            'Authorization': `Bearer ${resp.payload.access_token}`
          }

          return axios.request(error.response.config)
        })
        .catch(e => console.log(e))
    }
    return Promise.reject(error)
  }
)

const getUsers = createAsyncThunk('users/getUsers', async (args, thunkAPI) => {
  try {
    const response = await fetchUsers({
      url: '/users',
      method: 'get',
      headers: { 'Authorization': `Bearer ${args.accessToken}` },
      refreshTokens: () => thunkAPI.dispatch(refresh()),
    })

    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message)
  }
})

/* 
const getUsers = createAsyncThunk(
  'users/getUsers',
  async (args, thunkAPI) => {
    // console.log(thunkAPI)

    try {
      const url = '/api/users'
      // const url = 'https://127.0.0.1/api/users' // CORS errors!!
      // console.log('fanks', args.accessToken);

      const { data } = await axios({
        url: url,
        method: 'get',
        headers: {
          // 'Origin': 'http://127.0.0.1:5173',
          // 'Access-Control-Allow-Origin': 'http://127.0.0.1:5173',
          // 'Access-Control-Request-Method': 'POST',
          // 'Access-Control-Request-Headers': 'Content-Type, Authorization',
          'Authorization': `Bearer ${args.accessToken}`
        },
      })

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error.message)
    }
})
 */

const initialState = {
  users: false,
  isLoading: true,
  error: false,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.isLoading = true
    },

    [getUsers.fulfilled]: (state, action) => {
      // console.log(action) // testing
      state.isLoading = false
      state.error = false
      state.users = action.payload
    },

    [getUsers.rejected]: (state, action) => {
      state.isLoading = false
      // console.log(action)
      state.error = action.error.message
    },
  },
})

export default usersSlice.reducer
export { getUsers }
// export const {} = usersSlice.actions