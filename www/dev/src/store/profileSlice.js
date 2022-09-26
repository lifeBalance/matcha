import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { refresh } from '../store/authSlice'

const getProfile = axios.create({
  baseURL: '/api',
})

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  gender: 2,
  preferences: 2,
  aboutYou: '',
  profileIsLoading: false,
  errorLoadingProfile: false,
  firstNameHasError: false,
  lastNameHasError: false,
  emailHasError: false,
  profileWasModified: false,
  formIsValid: false
}

getProfile.interceptors.response.use(
  response => {
    // console.log(response)
    return response
  },

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

const loadProfile = createAsyncThunk('profile/loadProfile', async (args, thunkAPI) => {
  try {
    const response = await getProfile({
      url: '/profile',
      method: 'get',
      headers: { 'Authorization': `Bearer ${args.accessToken}` }, // extract uid
      refreshTokens: () => thunkAPI.dispatch(refresh()),
    })

    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message)
  }
})

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setFirstName: (state, action) => {
      state.firstName = action.payload
      console.log('firstname?', action.payload);
    },
    setLastName: (state, action) => {
      state.lastName = action.payload
      console.log('lastname?', action.payload);
    },
    setEmail: (state, action) => {
      state.email = action.payload
      console.log('email?', action.payload);
    },
    setGender: (state, action) => {
      state.gender = action.payload
      console.log('gender?', action.payload);
    },
    setPreferences: (state, action) => {
      state.preferences = action.payload
      console.log('preferences?', action.payload);
    },
    setAboutYou: (state, action) => {
      state.aboutYou = action.payload
      console.log(action.payload);
    },
    setFirstNameHasError: (state, action) => {
      state.firstNameHasError = action.payload
      console.log('firstname has error?', action.payload);
    },
    setLastNameHasError: (state, action) => {
      state.lastNameHasError = action.payload
      console.log('lastname has error?', action.payload);
    },
    setEmailHasError: (state, action) => {
      state.emailHasError = action.payload
      console.log('email has error?', action.payload);
    },
    setFormIsValid: (state, action) => {
      state.formIsValid = action.payload
      console.log('form is valid?', action.payload);
    },
    setProfileWasModified: (state, action) => {
      state.profileWasModified = action.payload
      console.log('profile form has been modified?', action.payload);
    },
  },
  extraReducers: {
    [loadProfile.pending]: (state) => {
      state.profileIsLoading = true
    },

    [loadProfile.fulfilled]: (state, action) => {
      console.log(action) // testing
      state.profileIsLoading = false
      state.errorLoadingProfile = false
      state.user = action.payload
    },

    [loadProfile.rejected]: (state, action) => {
      state.profileIsLoading = false
      console.log(action) // testing
      state.errorLoadingProfile = action.error.message
    },
  },
})

export const {
  setAboutYou,
  setFirstName,
  setLastName,
  setEmail,
  setGender,
  setPreferences,
  setFirstNameHasError,
  setLastNameHasError,
  setEmailHasError,
  setFormIsValid,
  setProfileWasModified,
} = profileSlice.actions

export { loadProfile } // async actions
export default profileSlice.reducer
