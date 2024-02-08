/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  getNotifications,
  getNotificationsSuccess,
  getNotificationsFailure,
} from './notificationSlice'
import {
  getRequest,
  makeGetRequest,
  makeGetRequestAdvance,
} from '../axiosClient'
import { getRequestAuthQ } from '../axiosClientAuth'

function* getNotificationsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('accounts/notifications/'),
    )
    yield put(getNotificationsSuccess(response.data))
  } catch (error) {
    yield put(getNotificationsFailure(error))
  }
}

export default function* rootSaga() {
  yield all([takeLatest(getNotifications, getNotificationsAPI)])
}
