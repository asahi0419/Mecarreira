import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  createWallet,
  createWalletSuccess,
  createWalletFailure,
} from './walletSlice'
import { postRequestAuth } from '../axiosClientAuth'

function* createWalletApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('wallets/wallet/', action.payload),
    )
    yield put(createWalletSuccess(response.data))
  } catch (error) {
    yield put(createWalletFailure(error))
  }
}

export default function* rootSaga() {
  yield all([takeLatest(createWallet, createWalletApi)])
}
