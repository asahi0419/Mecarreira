/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  isContactUsError: '',
  isContactUsSuccess: '',
}

const careersSlice = createSlice({
  name: 'careers',
  initialState,
  reducers: {
    contactUs(state, action) {
      state.isLoading = true
      state.isContactUsError = ''
      state.isContactUsSuccess = ''
    },
    contactUsSuccess(state, action) {
      state.isLoading = false
      state.isContactUsSuccess = action.payload.message
    },
    contactUsFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isContactUsError = 'error occured'
    },
    contactUsReset(state) {
      state.isLoading = false
      state.isContactUsError = ''
      state.isContactUsSuccess = ''
    },
  },
})

export const { contactUs, contactUsFailure, contactUsSuccess, contactUsReset } =
  careersSlice.actions
export default careersSlice.reducer
