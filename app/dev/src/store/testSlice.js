import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'

const getContent = createAsyncThunk(
  'test/getContent',
  async (args = false, thunkAPI) => {
    try {
      const url = '/api/test'

      const { data } = await axios({
        url: url,
        method: 'get',
        headers: {'Content-Type': 'application/json'},
        data: null
      })
      // console.log(data);
      return data
    } catch (error) {
      // console.log(error.message)
      return thunkAPI.rejectWithValue(error.message)
    }
})

const initialState = {
  content: '',
  isLoading: true,
  error: false
}

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    test: (state) => {
      state.content = 'blabla'
      state.isLoading = false
      state.error = false
    },
  },
  extraReducers: {
    [getContent.pending]: (state) => {
      state.isLoading = true
    },

    [getContent.fulfilled]: (state, action) => {
      state.isLoading = false
      state.content = action.payload
    },

    [getContent.rejected]: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export default testSlice.reducer
export { getContent }
// export const { test } = testSlice.actions