/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  getRequest,
  makeGetRequest,
  makeGetRequestAdvance,
} from '../axiosClient'
import { getRequestAuth, getRequestAuthQ } from '../axiosClientAuth'
import {
  getPurchaseReceipt,
  getPurchaseReceiptFailure,
  getPurchaseReceiptSuccess,
  getUsdRate,
  getUsdRateFailure,
  getUsdRateSuccess,
  setPurchaseMode,
} from './purchaseSlice'

function* getPurchaseReceiptApi(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'wallets/transaction-receipt/?txn_hash=' + action.payload,
      ),
    )
    yield put(getPurchaseReceiptSuccess(response.data))
  } catch (error) {
    yield put(getPurchaseReceiptFailure(error))
  }
}

function* getUsdRateAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('exchange-rate/?ticker=MATIC'),
    )
    yield put(getUsdRateSuccess(response.data))
  } catch (error) {
    yield put(getUsdRateFailure(error))
  }
}

export default function* rootSaga() {
  yield all([setPurchaseMode])
  yield all([takeLatest(getPurchaseReceipt, getPurchaseReceiptApi)])
  yield all([takeLatest(getUsdRate, getUsdRateAPI)])
}
