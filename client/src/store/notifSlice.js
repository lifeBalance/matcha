import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import produce from 'immer'
import axios from 'axios'

const getNotifs = createAsyncThunk('notif/getNotifs', async function(args, thunkAPI) {
  const requestGetNotifs = axios.create({ baseURL: '/api' })
  
  requestGetNotifs.interceptors.response.use(
    response => {
      if (response.data.type === 'ERROR' &&
          response.data.message === 'jwt expired')
      {
        return response.config.refreshTokens()
          .then(resp => {
            response.config.headers = {
              'Authorization': `Bearer ${resp.payload.access_token}`
            }
            return axios.request(response.config)
          })
          .catch(e => console.log(e))
      }
      return response // if we didn't enter the 'if' statement.
    },
    error => Promise.reject(error)
  )

  try {
    // console.log(args) // testing
    let { accessToken } = args
    if (!accessToken) accessToken = JSON.parse(localStorage.getItem('matcha')).accessToken
    if (!accessToken) return thunkAPI.rejectWithValue('Expired session')

    const response = await requestGetNotifs({
      url: '/notifs',
      method: 'get',
      headers: { 'Authorization': `Bearer ${args.accessToken}` },
      withCredentials: true,
      refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
    })

    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const delNotif = createAsyncThunk('notif/delNotif', async function(args, thunkAPI) {
  const requestDelNotif = axios.create({
    baseURL: '/api',
  })
  
  requestDelNotif.interceptors.response.use(
    response => {
      if (response.data.type === 'ERROR' &&
          response.data.message === 'jwt expired')
      {
        return response.config.refreshTokens()
          .then(resp => {
            response.config.headers = {
              'Authorization': `Bearer ${resp.payload.access_token}`
            }
            return axios.request(response.config)
          })
          .catch(e => console.log(e))
      }
      return response // if we didn't enter the 'if' statement.
    },
    error => Promise.reject(error)
  )

  try {
    // console.log(args) // testing
    let { accessToken } = args
    if (!accessToken) accessToken = JSON.parse(localStorage.getItem('matcha')).accessToken
    if (!accessToken) return thunkAPI.rejectWithValue('Expired session')

    const response = await requestDelNotif({
      url: '/notifs',
      method: 'delete',
      headers: {
        'Authorization': `Bearer ${args.accessToken}`
      },
      data: { notif_id: args.notif_id },
      /*  Hang the following function in the 'config' object in
         order to make it available in the interceptor. */
      refreshTokens: () => dispatch(refresh({
        accessToken: args.accessToken
      })),
    })

    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const notifSlice = createSlice({
  name: 'notif',
  initialState: {
    notifications: [],
    newNotifs: 0,
    isLoadingNotifs: false,
  },
  reducers: {
    increaseNewNotifs: (state, action) => {
      state.newNotifs += 1
      // console.log(current(state)) // testing
    },
    resetNewNotifs: (state, action) => {
      state.newNotifs = 0
    },
    addNotif: (state, action) => {
      console.log(action.payload) // testing
      state.notifications.push(action.payload)
      console.log(current(state)) // testing
    },
    deleteAllNotifs: (state, action) => {
      state = initialState
    },
  },

  extraReducers: {
    [getNotifs.pending]: (state, action) => {
      state.isLoadingNotifs = true
      console.log('getting notifs in async thunk');
    },
    [getNotifs.fulfilled]: (state, action) => {
      state.isLoadingNotifs = false
      console.log(action.payload) // testing
      console.log(current(state)) // testing
      state.notifications = action.payload.notifs
    },
    [getNotifs.rejected]: (state, action) => {
      state.isLoadingNotifs = false
      console.log(action) // testing
      console.log('error getting notifs in async thunk');
    },
    [delNotif.pending]: (state, action) => {
      console.log('deleting notif in async thunk');
    },
    [delNotif.fulfilled]: (state, action) => {
      console.log(action.payload) // testing
      console.log(current(state)) // testing
      state.newNotifs = 0
      // DO NOT USE STRICT COMPARISON IN THE FILTER!!!
      state.notifications = state.notifications.filter(n => (
        n.id != action.payload.notif_id
      ))
    },
    [delNotif.rejected]: (state, action) => {
      console.log(action) // testing
      console.log('error deleting notif in async thunk');
    },
  }
})

export const {
  setNotifs,
  addNotif,
  increaseNewNotifs,
  resetNewNotifs,
  deleteNotifs
} = notifSlice.actions

export { getNotifs, delNotif } // async actions

export default notifSlice.reducer
