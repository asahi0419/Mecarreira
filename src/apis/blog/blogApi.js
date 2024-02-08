/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  getBlogs,
  getBlogsSuccess,
  getBlogsFailure,
  getBlog,
  getBlogSuccess,
  getBlogFailure,
} from './blogSlice'
import {
  getRequest,
  makeGetRequest,
  makeGetRequestAdvance,
} from '../axiosClient'
import { getRequestAuth } from '../axiosClientAuth'

function* getBlogsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('blogs?category=' + action.payload),
    )
    yield put(getBlogsSuccess(response.data))
  } catch (error) {
    yield put(getBlogsFailure(error))
  }
}

function* getBlogAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('post?post=' + action.payload),
    )
    yield put(getBlogSuccess(response.data))
  } catch (error) {
    yield put(getBlogFailure(error))
  }
}

export default function* rootSaga() {
  yield all([takeLatest(getBlogs, getBlogsAPI)])
  yield all([takeLatest(getBlog, getBlogAPI)])
}
