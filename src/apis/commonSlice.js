import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isNftWinBid: false,
}

const nftNavigationSlice = createSlice({
  name: 'nftnavigation',
  initialState,
  reducers: {
    setBeforeNavigate(state) {
      state.isNftWinBid = true
    },
    setAfterNavigate(state) {
      state.isNftWinBid = false
    },
  },
})

export const { setBeforeNavigate, setAfterNavigate } =
  nftNavigationSlice.actions
export default nftNavigationSlice.reducer
