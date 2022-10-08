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
    closeMobileMenu: (state) => {
      state.burgerIsOpen = false
    },
  }
})

export const { toggleMobileMenu, closeMobileMenu } = burgerSlice.actions
export default burgerSlice.reducer