import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  burgerIsOpen: false
}

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.burgerIsOpen = !state.burgerIsOpen
    },
  }
})

export const { toggleMobileMenu } = burgerSlice.actions
export default burgerSlice.reducer