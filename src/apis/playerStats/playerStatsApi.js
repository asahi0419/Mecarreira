import { all, call, put, takeLatest } from 'redux-saga/effects'
import { v4 as uuidv4 } from 'uuid'
import {
  fetchPlayersStats,
  fetchPlayersStatsSuccess,
  fetchPlayersStatsError,
  fetchSinglePlayersStatsSuccess,
  fetchSinglePlayersStatsError,
  fetchSinglePlayerStats,
  fetchPlayerCoinStatsSuccess,
  fetchPlayerCoinStatsError,
  fetchPlayerCoinStats,
  fetchPlayersStatsErrorNewLaunches,
  fetchPlayersStatsHT,
  fetchPlayersStatsNewLaunches,
  fetchPlayersStatsSuccessHT,
  fetchPlayersStatsErrorHT,
  fetchPlayersStatsSuccessNewLaunches,
  fetchPlayersStatsTrending,
  fetchPlayersStatsSuccessTrending,
  fetchPlayersStatsErrorTrending,
  fetchPlayersStatsPL,
  fetchPlayersStatsSuccessPL,
  fetchPlayersStatsErrorPL,
  fetchPlayersStatsPlayerDrafts,
  fetchPlayersStatsSuccessPlayerDrafts,
  fetchPlayersStatsErrorPlayerDrafts,
  fetchPlayersStatsDisplayPlayersSuccess,
  fetchPlayersStatsDisplayPlayersFailure,
  fetchPlayersStatsDisplayPlayers,
  fetchSinglePlayer24hStatsSuccess,
  fetchSinglePlayer24hStatsError,
  fetchSinglePlayer24hStats,
} from './playerStatsSlice'

import {
  getRequest,
  makeGetRequest,
  makeGetRequestAdvance,
} from '../axiosClient'
import { getRequestAuthQ } from '../axiosClientAuth'
function* fetchPlayerStatsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/coin-market-data/?contracts=${
          action.payload.contracts
        }&query_type=${
          action.payload.query
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}
        `,
      ),
    )
    yield put(fetchPlayersStatsSuccess(response.data))
  } catch (error) {
    yield put(fetchPlayersStatsError(error))
  }
}

function* fetchPlayerStatsNewLaunchesAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/coin-market-data/?contracts=${
          action.payload.contracts
        }&query_type=${
          action.payload.query
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(fetchPlayersStatsSuccessNewLaunches(response.data))
  } catch (error) {
    yield put(fetchPlayersStatsErrorNewLaunches(error))
  }
}

function* fetchPlayersStatsTrendingAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/coin-market-data/?contracts=${
          action.payload.contracts
        }&query_type=${
          action.payload.query
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(fetchPlayersStatsSuccessTrending(response.data))
  } catch (error) {
    yield put(fetchPlayersStatsErrorTrending(error))
  }
}

function* fetchPlayerStatsPlayerListAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/coin-market-data/?contracts=${
          action.payload.contracts
        }&query_type=${
          action.payload.query
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(fetchPlayersStatsSuccessPL(response.data))
  } catch (error) {
    yield put(fetchPlayersStatsErrorPL(error))
  }
}

function* fetchPlayerStatsHTAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/coin-market-data/?contracts=${
          action.payload.contracts
        }&query_type=${
          action.payload.query
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(fetchPlayersStatsSuccessHT(response.data))
  } catch (error) {
    yield put(fetchPlayersStatsErrorHT(error))
  }
}

function* fetchPlayersStatsPlayerDraftsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/coin-market-data/?contracts=${
          action.payload.contracts
        }&query_type=${
          action.payload.query
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(fetchPlayersStatsSuccessPlayerDrafts(response.data))
  } catch (error) {
    yield put(fetchPlayersStatsErrorPlayerDrafts(error))
  }
}

function* fetchDisplayPlayersStatsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/coin-market-data/?contracts=${
          action.payload.contracts
        }&query_type=${
          action.payload.query
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(fetchPlayersStatsDisplayPlayersSuccess(response.data))
  } catch (error) {
    yield put(fetchPlayersStatsDisplayPlayersFailure(error))
  }
}

function* fetchPlayerCoinStatsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/coin-market-data/?contracts=${
          action.payload
        }&query_type=complex&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(fetchPlayerCoinStatsSuccess(response.data))
  } catch (error) {
    yield put(fetchPlayerCoinStatsError(error))
  }
}

function* fetchSinglePlayerStatsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/coin-market-data/?contracts=${
          action.payload.contracts
        }&query_type=${action.payload.query}&form-type=${
          action.payload.formType
        }&amount=${
          action.payload.amount
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(
      fetchSinglePlayersStatsSuccess({
        data: response.data,
        form: action.payload.formType,
      }),
    )
  } catch (error) {
    yield put(fetchSinglePlayersStatsError(error))
  }
}

function* fetchSinglePlayerStats24hAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/coin-market-data/?contracts=${
          action.payload.contracts
        }&query_type=complex&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(fetchSinglePlayer24hStatsSuccess(response.data))
  } catch (error) {
    yield put(fetchSinglePlayer24hStatsError(error))
  }
}

export default function* rootSaga() {
  yield all([takeLatest(fetchPlayersStats, fetchPlayerStatsAPI)]),
    yield all([
      takeLatest(fetchPlayersStatsNewLaunches, fetchPlayerStatsNewLaunchesAPI),
    ]),
    yield all([
      takeLatest(fetchPlayersStatsTrending, fetchPlayersStatsTrendingAPI),
    ]),
    yield all([takeLatest(fetchPlayersStatsPL, fetchPlayerStatsPlayerListAPI)]),
    yield all([takeLatest(fetchPlayersStatsHT, fetchPlayerStatsHTAPI)]),
    yield all([takeLatest(fetchSinglePlayerStats, fetchSinglePlayerStatsAPI)])
  yield all([takeLatest(fetchPlayerCoinStats, fetchPlayerCoinStatsAPI)])
  yield all([
    takeLatest(fetchPlayersStatsPlayerDrafts, fetchPlayersStatsPlayerDraftsAPI),
  ])
  yield all([
    takeLatest(fetchPlayersStatsDisplayPlayers, fetchDisplayPlayersStatsAPI),
  ])
  yield all([
    takeLatest(fetchSinglePlayer24hStats, fetchSinglePlayerStats24hAPI),
  ])
}
