/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loader: false,
  fetchedPlayerStatsDataNL: false,
  isProgress: false,
  fetchPlayerStatsError: '',
  fetchPlayerStatsData: [],
  fetchPlayerStatsRateData: '',
  amountPassed: null,
  formName: '',
  fetchSinglePlayerStatsError: '',
  fetchSinglePlayerStatsData: [],
  fetchSinglePlayerStatsBuy: [],
  fetchSinglePlayerStatsSell: [],
  fetchSinglePlayerStatsRateData: '',
  fetchPlayerCoinStatsError: '',
  fetchPlayerCoinStatsData: '',
  fetchPlayerCoinStatsRateData: null,
  fetchPlayerStatsDataTrending: [],
  fetchPlayerStatsDataNL: [],
  fetchPlayerStatsErrorNL: '',
  fetchPlayerStatsRateDataNL: '',
  fetchPlayerStatsDataHT: [],
  fetchPlayerStatsErrorHT: '',
  fetchPlayerStatsRateDataHT: '',
  fetchPlayerStatsDataPL: [],
  fetchPlayerStatsErrorPL: '',
  fetchPlayerStatsRateDataPL: '',
  playerDraftsStatsLoading: false,
  playerDraftsStatsError: '',
  playerDraftsStatsData: [],
  displayPlayersStatsLoading: false,
  displayPlayersStatsError: '',
  displayPlayerStatsData: '',
  isProgress24h: false,
  isFetchSinglePlayer24hStatsError: '',
  fetchSinglePlayer24hStatsData: '',
}

const playerStatsSlice = createSlice({
  name: 'playerstats',
  initialState,
  reducers: {
    fetchPlayersStats(state, action) {
      state.loader = true
    },
    fetchPlayersStatsSuccess(state, action) {
      state.loader = false
      state.fetchPlayerStatsError = ''
      state.fetchPlayerStatsData = action.payload.data.list
    },
    fetchPlayersStatsError(state, action) {
      state.loader = false
      state.fetchPlayerStatsError = 'Error Occured'
      state.fetchPlayerStatsData = ''
      state.fetchPlayerStatsRateData = ''
    },
    fetchPlayersStatsReset(state) {
      state.fetchPlayerStatsData = []
    },
    resetFPS(state) {
      state.fetchPlayerStatsError = ''
    },
    //------------------------------------------------- NEW_LAUNCHES ---------------------------------------------
    fetchPlayersStatsNewLaunchesInit(state) {
      state.fetchedPlayerStatsDataNL = false
    },
    fetchPlayersStatsNewLaunches(state, action) {
      state.loader = true
      state.fetchedPlayerStatsDataNL = false
    },
    fetchPlayersStatsSuccessNewLaunches(state, action) {
      state.loader = false
      state.fetchedPlayerStatsDataNL = true
      state.fetchPlayerStatsErrorNL = ''
      state.fetchPlayerStatsDataNL = action.payload.data.list
    },
    fetchPlayersStatsErrorNewLaunches(state, action) {
      state.loader = false
      state.fetchedPlayerStatsDataNL = false
      state.fetchPlayerStatsErrorNL = 'Error Occured'
      state.fetchPlayerStatsDataNL = []
      state.fetchPlayerStatsRateDataNL = ''
    },
    //------------------------------------------------- TRENDING ---------------------------------------------
    fetchPlayersStatsTrending(state, action) {
      state.loader = true
    },
    fetchPlayersStatsSuccessTrending(state, action) {
      state.loader = false
      state.fetchPlayerStatsDataTrending = action.payload.data.list
    },
    fetchPlayersStatsErrorTrending(state, action) {
      state.loader = false
      state.fetchPlayerStatsDataTrending = []
    },
    //----------------------------------------------------------------------------------------------------------------
    fetchPlayersStatsPlayerDrafts(state, action) {
      state.playerDraftsStatsLoading = true
    },
    fetchPlayersStatsSuccessPlayerDrafts(state, action) {
      state.playerDraftsStatsLoading = false
      state.playerDraftsStatsError = ''
      state.playerDraftsStatsData = action.payload.data.list
    },
    fetchPlayersStatsErrorPlayerDrafts(state, action) {
      state.playerDraftsStatsLoading = false
      state.playerDraftsStatsError = 'Error Occured'
      state.playerDraftsStatsData = ''
    },
    resetPlayerStatsPlayerDrafts(state, action) {
      state.playerDraftsStatsData = []
    },
    //------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------- display players --------------------------------
    fetchPlayersStatsDisplayPlayers(state, action) {
      state.displayPlayersStatsLoading = true
    },
    fetchPlayersStatsDisplayPlayersSuccess(state, action) {
      state.displayPlayersStatsLoading = false
      state.displayPlayersStatsError = ''
      state.displayPlayerStatsData = action.payload.data.list
    },
    fetchPlayersStatsDisplayPlayersFailure(state, action) {
      state.displayPlayersStatsLoading = false
      state.displayPlayersStatsError = 'Error Occured'
      state.displayPlayerStatsData = ''
    },
    resetPlayerStatsPlayerDrafts(state, action) {
      state.displayPlayersStatsLoading = false
      state.displayPlayerStatsData = ''
      state.displayPlayersStatsError = ''
    },
    //---------------------------------------------------------------------------------------------------------
    fetchPlayersStatsHT(state, action) {
      state.loader = true
    },
    fetchPlayersStatsSuccessHT(state, action) {
      state.loader = false
      state.fetchPlayerStatsErrorHT = ''
      state.fetchPlayerStatsDataHT = action.payload.data.list
      state.fetchPlayerStatsRateDataHT =
        action.payload.data.list[0].exchangeRateUSD
    },
    fetchPlayersStatsErrorHT(state, action) {
      state.loader = false
      state.fetchPlayerStatsErrorHT = 'Error Occured'
      state.fetchPlayerStatsDataHT = ''
      state.fetchPlayerStatsRateDataHT = ''
    },
    fetchPlayerCoinStats(state, action) {
      state.fetchPlayerCoinStatsError = ''
    },
    fetchPlayerCoinStatsSuccess(state, action) {
      state.fetchPlayerCoinStatsError = ''
      state.fetchPlayerCoinStatsData = action.payload.data.list
      state.fetchPlayerCoinStatsRateData = action.payload.data.exchangeRateUSD
    },
    fetchPlayerCoinStatsError(state, action) {
      state.fetchPlayerCoinStatsError = 'Error Occured'
      state.fetchPlayerCoinStatsData = ''
      state.fetchPlayerCoinStatsRateData = ''
    },
    //------------------------------------------ PLAYER_LIST ------------------------
    fetchPlayersStatsPL(state, action) {
      state.loader = true
    },
    fetchPlayersStatsSuccessPL(state, action) {
      state.loader = false
      state.fetchPlayerStatsErrorPL = ''
      state.fetchPlayerStatsDataPL = action.payload.data.list
      state.fetchPlayerStatsRateDataPL = action.payload.data.exchangeRateUSD
    },
    fetchPlayersStatsErrorPL(state, action) {
      state.loader = false
      state.fetchPlayerStatsErrorPL = 'Error Occured'
      state.fetchPlayerStatsDataPL = []
      state.fetchPlayerStatsRateDataPL = ''
    },
    //------------------------------------------RPCCALL-------------------------------------------
    fetchSinglePlayerStats(state, action) {
      state.isProgress = true
      state.amountPassed = action.payload.amount
      state.formName = action.payload.formType
    },
    fetchSinglePlayersStatsSuccess(state, action) {
      console.log({ llop: action })
      state.isProgress = false
      state.fetchSinglePlayerStatsError = ''
      if (action.payload.form === 'BUY') {
        state.fetchSinglePlayerStatsBuy = action.payload.data.data.list
      } else if (action.payload.form === 'SELL') {
        state.fetchSinglePlayerStatsSell = action.payload.data.data.list
      }
      state.fetchSinglePlayerStatsData = action.payload.data.data.list
      state.fetchSinglePlayerStatsRateData =
        action.payload.data.data.exchangeRateUSD
    },
    resetSinglePlayersStats(state) {
      console.log('RSPS')
      state.fetchSinglePlayerStatsData = []
    },
    fetchSinglePlayersStatsError(state, action) {
      let errMsg = action.payload?.response?.data?.message
      state.isProgress = false
      if (!errMsg.includes('Not enough balance for trade')) {
        state.fetchSinglePlayerStatsError =
          action.payload?.response?.data?.message
      } else {
        state.fetchSinglePlayerStatsError =
          'amount exceeds maximum amount allowed'
      }
      state.fetchSinglePlayerStatsData = ''
      state.fetchSinglePlayerStatsRateData = ''
    },
    //---------------------------------------TickerCall-----------------------------------------
    fetchSinglePlayer24hStats(state, action) {
      state.isProgress24h = true
    },
    fetchSinglePlayer24hStatsSuccess(state, action) {
      state.isProgress24h = false
      state.isFetchSinglePlayer24hStatsError = ''
      state.fetchSinglePlayer24hStatsData = action.payload.data.list
    },
    fetchSinglePlayer24hStatsError(state, action) {
      state.isProgress24h = false
      state.isFetchSinglePlayer24hStatsError =
        action.payload.response?.data?.message || '' //'Error Occured'
      state.fetchSinglePlayer24hStatsData = ''
    },
    resetStatsError(state) {
      state.fetchSinglePlayerStatsError = ''
    },
  },
})

export const {
  fetchPlayersStats,
  fetchPlayersStatsSuccess,
  fetchPlayersStatsError,
  fetchPlayersStatsReset,
  resetFPS,
  fetchPlayerCoinStats,
  fetchPlayerCoinStatsSuccess,
  fetchPlayerCoinStatsError,
  fetchSinglePlayerStats,
  fetchSinglePlayersStatsSuccess,
  resetSinglePlayersStats,
  fetchSinglePlayersStatsError,
  resetStatsError,
  fetchPlayersStatsNewLaunches,
  fetchPlayersStatsNewLaunchesInit,
  fetchPlayersStatsSuccessNewLaunches,
  fetchPlayersStatsErrorNewLaunches,
  fetchPlayersStatsTrending,
  fetchPlayersStatsSuccessTrending,
  fetchPlayersStatsErrorTrending,
  fetchPlayersStatsPlayerDrafts,
  fetchPlayersStatsSuccessPlayerDrafts,
  fetchPlayersStatsErrorPlayerDrafts,
  resetPlayerStatsPlayerDrafts,
  fetchPlayersStatsHT,
  fetchPlayersStatsSuccessHT,
  fetchPlayersStatsErrorHT,
  fetchPlayersStatsPL,
  fetchPlayersStatsSuccessPL,
  fetchPlayersStatsErrorPL,
  fetchPlayersStatsDisplayPlayers,
  fetchPlayersStatsDisplayPlayersSuccess,
  fetchPlayersStatsDisplayPlayersFailure,
  fetchSinglePlayer24hStats,
  fetchSinglePlayer24hStatsSuccess,
  fetchSinglePlayer24hStatsError,
} = playerStatsSlice.actions
export default playerStatsSlice.reducer
