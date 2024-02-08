/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loader: false,
  isCreateWalletError: '',
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    createWallet(state, action) {
      state.loader = true
      state.isCreateWalletError = ''
    },
    createWalletSuccess(state, action) {
      state.loader = false
      state.isWalletCreated = action.payload.is_email_verified
    },
    createWalletFailure(state, action) {
      const { payload } = action
      state.loader = false
      state.isCreateWalletError = payload.response.data.detail
    },
  },
})

export const { createWallet, createWalletSuccess, createWalletFailure } =
  walletSlice.actions
export default walletSlice.reducer
