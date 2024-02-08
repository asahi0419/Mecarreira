/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loader: false,
  purchaseAction: '',
  purchasePlayerId: 0,
  showPurchaseForm: false,
  isPurchaseReceiptSuccess: '',
  isPurchaseReceiptFailure: '',
  fetchUsdRatefailure: '',
  usdRate: '',
}

const purchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    setPurchaseMode(state, action) {
      state.purchaseAction = action.payload
    },
    setPurchasePlayerId(state, action) {
      if (action.payload.toString().includes('/')) {
        state.purchasePlayerId = parseInt(action.payload.split('/')[1]) - 1
      } else {
        state.purchasePlayerId = action.payload
      }
    },
    setPurchaseShow(state, action) {
      state.showPurchaseForm = action.payload
    },
    getPurchaseReceipt(state, action) {
      state.loader = true
    },
    getPurchaseReceiptSuccess(state, action) {
      state.loader = false
      state.isPurchaseReceiptSuccess = action.payload.data.message
    },
    getPurchaseReceiptFailure(state, action) {
      state.loader = false
      state.isPurchaseReceiptFailure = action.payload.response.data.message //'failure'
    },
    clearLastTransaction(state) {
      state.isPurchaseReceiptSuccess = ''
      state.isPurchaseReceiptFailure = ''
      state.loader = false
    },
    getUsdRate(state) {
      // state.loader = true
    },
    getUsdRateSuccess(state, action) {
      state.usdRate = action.payload.data.rate
    },
    getUsdRateFailure(state, action) {
      state.fetchUsdRatefailure = 'failure'
    },
  },
})

export const {
  setPurchaseMode,
  setPurchasePlayerId,
  setPurchaseShow,
  getPurchaseReceipt,
  getPurchaseReceiptSuccess,
  getPurchaseReceiptFailure,
  clearLastTransaction,
  getUsdRate,
  getUsdRateSuccess,
  getUsdRateFailure,
} = purchaseSlice.actions
export default purchaseSlice.reducer
