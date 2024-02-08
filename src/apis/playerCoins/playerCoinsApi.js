import { all, call, put, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import {
  createPlayer,
  createPlayerSuccess,
  createPlayerFailure,
  reCreatePlayer,
  reCreatePlayerSuccess,
  reCreatePlayerFailure,
  getPlayerData,
  getPlayerDataSuccess,
  getPlayerDataFailure,
  updatePlayerProfile,
  updatePlayerProfileSuccess,
  updatePlayerProfileFailure,
  getAllPlayers,
  getAllPlayersSuccess,
  getAllPlayersFailure,
  getPlayerDetailsSuccess,
  getPlayerDetailsError,
  getPlayerDetails,
  getPlayerDetailsImplicit,
  getPlayerDetailsImplicitSuccess,
  fetchAllPlayers,
  fetchTickerBanner,
  fetchTickerBannerSuccess,
  fetchTickerBannerFailure,
  fetchDraftPlayers,
  fetchDraftPlayersSuccess,
  fetchDraftPlayersFailure,
  fetchMostDraftPlayers,
  fetchMostDraftPlayersSuccess,
  fetchMostDraftPlayersFailure,
  fetchVersusPlayers,
  fetchVersusPlayersSuccess,
  fetchVersusPlayersFailure,
  fetchAllPlayersSuccess,
  fetchAllPlayersFailure,
  fetchListPlayers,
  fetchListPlayersAll,
  fetchListPlayersSuccess,
  fetchListPlayersFailure,
  launchPlayerCoin,
  launchPlayerCoinSuccess,
  launchPlayerCoinFailure,
  fetchDraftNewPlayersSuccess,
  fetchDraftNewPlayersError,
  fetchDraftNewPlayers,
  getPlayer1ContractSuccess,
  getPlayer1ContractFailure,
  getPlayer2ContractSuccess,
  getPlayer2ContractFailure,
  getPlayer1Contract,
  getPlayer2Contract,
  getPlayerDraftsSuccess,
  getPlayerDraftsFailure,
  getPlayerDrafts,
  fetchPlayersBalance,
  fetchPlayersBalanceSuccess,
  fetchPlayersBalanceError,
  getPlayerSelection,
  getPlayerSelectionSuccess,
  getPlayerSelectionFailure,
  getSelectedPlayer,
  getSelectedPlayerSuccess,
  getSelectedPlayerFailure,
  getAddedAgents,
  getAddedAgentsSuccess,
  getAddedAgentsFailure,
  getVoteList,
  getVoteListSuccess,
  getVoteListFailure,
  getOpenVoteList,
  getOpenVoteListSuccess,
  getOpenVoteListFailure,
  getVoteInfo,
  getVoteInfoSuccess,
  getVoteInfoFailure,
  getStakingStatus,
  getStakingStatusSuccess,
  getStakingStatusFailure,
  getCoinList,
  getCoinListSuccess,
  getCoinListFailure,
  fetchFeaturedNfts,
  fetchFeaturedNftsSuccess,
  fetchFeaturedNftsFailure,
  getNftsData,
  getNftsDataSuccess,
  getNftsDataFailure,
  getPreviewNftsData,
  getPreviewNftsDataSuccess,
  getPreviewNftsDataFailure,
  getMyCoinNftsData,
  getMyCoinNftsDataSuccess,
  getMyCoinNftsDataFailure,
  getNftsBalance,
  getNftsBalanceSuccess,
  getNftsBalanceFailure,
  getAllNftsData,
  getAllNftsDataSuccess,
  getAllNftsDataFailure,
  getAllKioskData,
  getAllKioskDataSuccess,
  getAllKioskDataFailure,
  getPlayerKioskData,
  getPlayerKioskDataSuccess,
  getPlayerKioskDataFailure,
  getLandingKioskData,
  getLandingKioskDataSuccess,
  getLandingKioskDataFailure,
  getSendMaticTxnConfirm,
  getSendMaticTxnConfirmSuccess,
  getSendMaticTxnConfirmError,
  getTxnConfirm,
  getTxnConfirmSuccess,
  getTxnConfirmError,
  getBids,
  getBidsSuccess,
  getBidsFailure,
  getStakingReward,
  getStakingRewardSuccess,
  getStakingRewardFailure,
  getStakingBalance,
  getStakingBalanceSuccess,
  getStakingBalanceFailure,
  getDraftedByData,
  getDraftedByDataSuccess,
  getDraftedByDataError,
  getCurrentDraftsData,
  getCurrentDraftsDataSuccess,
  getCurrentDraftsDataError,
  getAllDraftsData,
  getAllDraftsDataSuccess,
  getAllDraftsDataError,
  getBlockdeadline,
  getBlockdeadlineSuccess,
  getBlockdeadlineFailure,
  getCharts,
  getChartsSuccess,
  getChartsFailure,
  checkPlayerStatus,
  checkPlayerStatusSuccess,
  checkPlayerStatusFailure,
  checkLaunchStatus,
  checkLaunchStatusSuccess,
  checkLaunchStatusFailure,
  launchCoin,
  createAuction,
  createRaffle,
  mintNft,
  allowStaking,
  staking,
  unstaking,
  claimReward,
  createVote,
  vote,
  closeVote,
  buyTokens,
  sellTokens,
  addAdmin,
  addAgent,
  revokeAdmin,
  createDraft,
  acceptDraft,
  deleteDraftee,
  bidOnAuction,
  playerTokenWithdraw,
  nativeWithdraw,
  closeAction,
  drawWinner,
  nftTransfer,
  nftGenesisTransfer,
  claimNft,
  consumeNft,
  claimXP,
  enrollRaffle,
  getDisplayPlayers,
  getDisplayPlayersSuccess,
  getDisplayPlayersFailure,
  transferCoins,
  savePlayerCustomisation,
  savePlayerCustomisationSuccess,
  savePlayerCustomisationFailure,
  AddPayout,
  AddPayoutSuccess,
  AddPayoutFailure,
  getPurchaseContract,
  getPurchaseContractSuccess,
  approveTradeCurrencySuccess,
  approveTradeCurrency,
  getPurchaseContractFailure,
  buyPlayerCoinsInCurrency,
  sellPlayerCoinsInCurrency,
  newRewardPercentage,
  newRewardPercentageSuccess,
  newRewardPercentageFailure,
  fetchPassportImage,
  fetchPassportImageSuccess,
  fetchPassportImageFailure,
  instaProfileRefetch,
  instaProfileRefetchSuccess,
  instaProfileRefetchFailure,
  getItemsPrice,
  getItemsPriceSuccess,
  getItemsPriceFailure,
  payForItem,
  payForItemSuccess,
  payForItemFailure,
  getUserPayedItems,
  getUserPayedItemsSuccess,
  getUserPayedItemsFailure,
  approveProExchange,
  fetchListPlayersOverviewInit,
  fetchListPlayersTrending,
  fetchListPlayersTrendingSuccess,
  fetchListPlayersTrendingFailure,
  fetchListPlayersMarket,
  fetchListPlayersMarketSuccess,
  fetchListPlayersMarketFailure,
  fetchListPlayersLatestTrades,
  fetchListPlayersLatestTradesSuccess,
  fetchListPlayersLatestTradesFailure,
  fetchListPlayersSupporters,
  fetchListPlayersSupportersSuccess,
  fetchListPlayersSupportersFailure,
  fetchListPlayersWinners,
  fetchListPlayersWinnersSuccess,
  fetchListPlayersWinnersFailure,
  fetchListPlayersLosers,
  fetchListPlayersLosersSuccess,
  fetchListPlayersLosersFailure,
  fetchListPlayersTalents,
  fetchListPlayersTalentsSuccess,
  fetchListPlayersTalentsFailure,
  fetchListPlayersCountry,
  fetchListPlayersCountrySuccess,
  fetchListPlayersCountryFailure,
  fetchListPlayersHot,
  fetchListPlayersHotSuccess,
  fetchListPlayersHotFailure,
  fetchListPlayersFeatured,
  fetchListPlayersFeaturedSuccess,
  fetchListPlayersFeaturedFailure,
  fetchListPlayersNew,
  fetchListPlayersNewSuccess,
  fetchListPlayersNewFailure,
  fetchListNftsOverviewInit,
  fetchListNftsHot,
  fetchListNftsHotSuccess,
  fetchListNftsHotFailure,
  fetchListNftsNew,
  fetchListNftsNewSuccess,
  fetchListNftsNewFailure,
  fetchListNftsUpcoming,
  fetchListNftsUpcomingSuccess,
  fetchListNftsUpcomingFailure,
  fetchListNftsAuction,
  fetchListNftsAuctionSuccess,
  fetchListNftsAuctionFailure,
  fetchListNftsRaffle,
  fetchListNftsRaffleSuccess,
  fetchListNftsRaffleFailure,
  fetchListNftsMinted,
  fetchListNftsMintedSuccess,
  fetchListNftsMintedFailure,
  fetchListNftsValuable,
  fetchListNftsValuableSuccess,
  fetchListNftsValuableFailure,
  DraftingPercentage,
  DraftingPercentageSuccess,
  DraftingPercentageFailure,
  createKioskItem,
  createKioskItemSuccess,
  createKioskItemFailure,
  searchTickerPlayers,
  searchTickerPlayersSuccess,
  searchTickerPlayersFailure,
  editKioskItem,
  fetchListPlayersLanding,
  fetchListPlayersLandingSuccess,
  fetchListPlayersLandingFailure,
  getPlayerCoinContractSuccess,
  getPlayerCoinContractFailure,
  getPlayerCoinContract,
  createFanPlayer,
  createFanPlayerSuccess,
  createFanPlayerFailure,
  reCreateFanPlayer,
  reCreateFanPlayerSuccess,
  resetCreatePlayerSuccess,
  reCreateFanPlayerFailure,
  getFanPlayerData,
  getFanPlayerDataSuccess,
  getFanPlayerDataFailure,
  checkFanPlayerStatus,
  checkFanPlayerStatusSuccess,
  checkFanPlayerStatusFailure,
  getSeasonDetails,
  getSeasonDetailsSuccess,
  getSeasonDetailsFailure,
  getUserEarlyAccessNft,
  getUserEarlyAccessNftSuccess,
  getUserEarlyAccessNftFailure,
  launchCoinSuccess,
  launchCoinError,
  getEANftsBalance,
  getEANftsBalanceSuccess,
  getEANftsBalanceFailure,
  claimPrize,
  getSeasonPrize,
  getSeasonPrizeSuccess,
  getSeasonPrizeFailure,
  sellPlayerCoinsInCurrencySuccess,
  sellPlayerCoinsInCurrencyFailure,
  buyPlayerCoinsInCurrencySuccess,
  buyPlayerCoinsInCurrencyFailure,
  getDefaultMatic,
  getDefaultMaticSuccess,
  getDefaultMaticError,
  getMinStaking,
  getMinStakingSuccess,
  getMinStakingFailure,
  getApprovedCountriesForPlayerCreation,
  getApprovedCountriesForPlayerCreationSuccess,
  getApprovedCountriesForPlayerCreationError,
  getGenesisSaleDetail,
  getGenesisSaleDetailSuccess,
  getGenesisSaleDetailError,
  getLandingPlayerCount,
  getLandingPlayerCountSuccess,
  getLandingPlayerData,
  getLandingPlayerDataWithURL,
  getLandingPlayerDataSuccess,
  getLandingPlayerDataWithURLSuccess,
  getBanner,
  getBannerSuccess,
  getMyWalletPlayers,
  getMyWalletPlayersSuccess,
  getMyWalletPlayersFailure,
  getTrendingScoutsPlayers,
  getTrendingScoutsPlayersSuccess,
  getLaunchingPlayers,
  getLaunchingPlayersSuccess,
  getFeedPlayers,
  getFeedPlayersSuccess,
  updateFeedPlayers,
  getScoutsCount,
  getScoutsCountSuccess,
  getScoutsLeaderboard,
  getScoutsLeaderboardSuccess,
  getScoutsTop,
  getScoutsTopSuccess,
  getPlayersCount,
  getPlayersCountSuccess,
  getPlayersComingSoon,
  getPlayersComingSoonSuccess,
  getMessagesReply,
  getMessagesReplySuccess,
  getMessagesReplyFailure,
  getMessages,
  getMessagesSuccess,
  getMessagesFailure,
  updateScoutsLeaderboard,
  updateScoutsLeaderboardSuccess,
  getAllKioskItems,
  getKioskKpi,
  getTopKioskItems,
  getNewKioskItems,
  getRecentAquisitionItems,
  getRecentAquisitionItemsSuccess,
  getRecentAquisitionItemsFailure,
  getNewKioskItemsSuccess,
  getNewKioskItemsFailure,
  getTopKioskItemsSuccess,
  getTopKioskItemsFailure,
  getKioskKpiSuccess,
  getKioskKpiFailure,
  getAllKioskItemsSuccess,
  getAllKioskItemsFailure,
  getUserTopTrades,
  getTopTrades,
  getTopTradesSuccess,
  getTopTradesFailure,
  resetTopTrades,
} from './playerCoinsSlice'
import {
  transaction,
  transactionSuccess,
  transactionFailure,
  getCheckWatchList,
} from '../onboarding/authenticationSlice'
import {
  getRequestAuth,
  getRequestAuthQ,
  postRequestAuth,
  putRequestAuth,
} from '../axiosClientAuth'
import {
  getRequest,
  makeGetRequest,
  makeGetRequestAdvance,
} from '../axiosClient'
import { handleException } from '../apiHelper'
import { API_CONSTANTS as constants } from '@root/constants'

function* createPlayerAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/player/', action.payload),
    )
    yield put(createPlayerSuccess(response.data))
  } catch (error) {
    yield put(createPlayerFailure(error))
  }
}

function* reCreatePlayerAPI(action) {
  try {
    const response = yield call(() =>
      putRequestAuth('players/player/', action.payload),
    )
    yield put(reCreatePlayerSuccess(response.data))
  } catch (error) {
    yield put(reCreatePlayerFailure(error))
  }
}

function* getPlayerAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/player/?id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(getPlayerDataSuccess(response.data))
  } catch (error) {
    yield put(getPlayerDataFailure(error))
  }
}

function* checkPlayerStatusAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/player/?check_status=True'),
    )
    yield put(checkPlayerStatusSuccess(response.data))
  } catch (error) {
    yield put(checkPlayerStatusFailure(error))
  }
}

function* getAddedAgentsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/agent/?contract=' + action.payload),
    )
    yield put(getAddedAgentsSuccess(response.data))
  } catch (error) {
    yield put(getAddedAgentsFailure(error))
  }
}

function* updatePlayerProfileAPI(action) {
  try {
    const response = yield call(() =>
      putRequestAuth('players/player/', action.payload),
    )
    yield put(updatePlayerProfileSuccess(response.data))
    yield put(getPlayerData({ isInstaLoading: true }))
  } catch (error) {
    yield put(updatePlayerProfileFailure(error))
  }
}

function* getAllPlayersAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/players_all/'),
    )
    yield put(getAllPlayersSuccess(response.data))
  } catch (error) {
    yield put(getAllPlayersFailure(error))
  }
}

function* fetchAllPlayersAPI(action) {
  let response
  try {
    if (action.payload) {
      const url = new URL(constants.HOST_URL + '/players/players_featured/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      response = yield call(() => makeGetRequestAdvance(url.toString()))
    } else {
      response = yield call(() => makeGetRequestAdvance('players/players_all/'))
    }
    yield put(fetchAllPlayersSuccess(response.data))
  } catch (error) {
    yield put(fetchAllPlayersFailure(error))
    handleException(error)
  }
}

function* fetchListPlayersAPI(action) {
  let response
  try {
    if (action?.payload?.type === 'overview') {
      yield put(fetchListPlayersOverviewInit(action?.payload))
      yield put(fetchListPlayersTrending(action?.payload))
      yield put(fetchListPlayersMarket(action?.payload))
      yield put(fetchListPlayersLatestTrades(action?.payload))
      yield put(fetchListPlayersSupporters(action?.payload))
      yield put(fetchListPlayersWinners(action?.payload))
      yield put(fetchListPlayersLosers(action?.payload))
      yield put(fetchListPlayersTalents(action?.payload))
    } else if (action?.payload?.type === 'hot') {
      yield put(fetchListPlayersHot(action?.payload))
    } else if (action?.payload?.type === 'new') {
      yield put(fetchListPlayersNew(action?.payload))
    } else {
      if (action.payload) {
        const url = new URL(constants.HOST_URL + '/players/players_all/')
        const searchParams = url.searchParams
        const paramSet = Object.keys(action.payload)
        for (let i = 0; i < paramSet.length; i++) {
          action.payload[paramSet[i]] &&
            searchParams.set(paramSet[i], action.payload[paramSet[i]])
        }
        response = yield call(() => makeGetRequestAdvance(url.toString()))
      } else {
        response = yield call(() =>
          makeGetRequestAdvance('players/players_all/'),
        )
      }
      yield put(fetchListPlayersSuccess(response.data))
    }
  } catch (error) {
    yield put(fetchListPlayersFailure(error))
    handleException(error)
  }
}

function* fetchListPlayersAllAPI(action) {
  let response
  try {
    if (action.payload) {
      const url = new URL(constants.HOST_URL + '/players/players_all/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        action.payload[paramSet[i]] &&
          searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      response = yield call(() => makeGetRequestAdvance(url.toString()))
    } else {
      response = yield call(() => makeGetRequestAdvance('players/players_all/'))
    }
    yield put(fetchListPlayersSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersFailure(error))
    handleException(error)
  }
}

function* fetchDraftNewPlayersAPI(action) {
  try {
    const url = new URL(constants.HOST_URL + '/players/draft_players_list/')
    const searchParams = url.searchParams
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      if (paramSet[i] === 'status_id') {
        searchParams.set('status_id', `[${action.payload[paramSet[i]]}]`)
      } else {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
    }
    const response = yield call(() => makeGetRequestAdvance(url.toString()))
    yield put(fetchDraftNewPlayersSuccess(response.data))
  } catch (error) {
    yield put(fetchDraftNewPlayersError(error))
  }
}

function* fetchTickerBannerAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/players_ticker/'),
    )
    yield put(fetchTickerBannerSuccess(response.data))
  } catch (error) {
    yield put(fetchTickerBannerFailure(error))
  }
}

function* fetchDraftPlayersAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance(
        'players/draft-players/?contract=' + action.payload,
      ),
    )
    yield put(fetchDraftPlayersSuccess(response.data))
  } catch (error) {
    yield put(fetchDraftPlayersFailure(error))
  }
}

function* fetchMostDraftPlayersAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/players_most_drafted/'),
    )
    yield put(fetchMostDraftPlayersSuccess(response.data))
  } catch (error) {
    yield put(fetchMostDraftPlayersFailure(error))
  }
}

function* fetchVersusPlayersAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance(
        `players/players_versus?id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(fetchVersusPlayersSuccess(response.data))
  } catch (error) {
    yield put(fetchVersusPlayersFailure(error))
  }
}

function* getPlayerDetailsAPI(action) {
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/player-detailpage/?detailpageurl=${
          action.payload
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(getPlayerDetailsSuccess(response.data))
    if (loginId || loginInfo) {
      yield put(getCheckWatchList(action.payload))
    }
  } catch (error) {
    yield put(getPlayerDetailsError(error))
  }
}

function* getDefaultMaticAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/player-detailpage/?detailpageurl=${
          action.payload
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(getDefaultMaticSuccess(response.data))
  } catch (error) {
    yield put(getDefaultMaticError(error))
  }
}

function* getPlayerDetailsImplicitAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/player-detailpage/?detailpageurl=${
          action.payload
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(getPlayerDetailsImplicitSuccess(response.data))
  } catch (error) {
    console.log({ error })
  }
}

function* getCoinListAPI(action) {
  let response
  try {
    const url = new URL(constants.HOST_URL + '/players/coin-holders/')
    const searchParams = url.searchParams
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams.set(paramSet[i], action.payload[paramSet[i]])
    }
    response = yield call(() => makeGetRequestAdvance(url.toString()))
    yield put(getCoinListSuccess(response.data))
  } catch (error) {
    yield put(getCoinListFailure(error))
  }
}

function* launchPlayerCoinAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/launch-player/', action.payload),
    )
    yield put(launchPlayerCoinSuccess(response.data))
  } catch (error) {
    yield put(launchPlayerCoinFailure(error))
  }
}

function* getPlayer1ContractAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance(
        'players/player-contracts/?detailpageurl=' + action.payload.url,
      ),
    )
    yield put(getPlayer1ContractSuccess(response.data))
    if (action.payload.callback) {
      action.payload.callback(response.data)
    }
  } catch (error) {
    yield put(getPlayer1ContractFailure(error))
  }
}

function* getPlayerCoinContractAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance(
        'players/player-contracts/?detailpageurl=' + action.payload.url,
      ),
    )
    yield put(getPlayerCoinContractSuccess(response.data))
  } catch (error) {
    yield put(getPlayerCoinContractFailure(error))
  }
}

function* getPlayer2ContractAPI(action) {
  // called to get genesis_phase
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance(
        'players/player-contracts/?detailpageurl=' + action.payload,
      ),
    )
    yield put(getPlayer2ContractSuccess(response.data))
  } catch (error) {
    yield put(getPlayer2ContractFailure(error))
  }
}

function* getPurchaseContractAPI(action) {
  let response
  const { detailpageUrl, walletAddress } = action.payload
  try {
    response = yield call(() =>
      makeGetRequestAdvance(
        'players/player-contracts/?detailpageurl=' +
          detailpageUrl +
          '&wallet_address=' +
          walletAddress,
      ),
    )
    yield put(getPurchaseContractSuccess(response.data))
  } catch (error) {
    yield put(getPurchaseContractFailure(error))
  }
}

function* getPlayerDraftsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`players/draft/?contract=${action.payload}`),
    )
    yield put(getPlayerDraftsSuccess(response.data))
  } catch (error) {
    yield put(getPlayerDraftsFailure(error))
  }
}

function* fetchPlayersBalanceAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/balance/', action.payload),
    )
    yield put(fetchPlayersBalanceSuccess(response.data))
  } catch (error) {
    yield put(fetchPlayersBalanceError(error))
    handleException(error)
  }
}

function* getPlayerSelectionAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/player-selection'),
    )
    yield put(getPlayerSelectionSuccess(response.data))
  } catch (error) {
    yield put(getPlayerSelectionFailure(error))
    handleException(error)
  }
}

function* getSelectedPlayerAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/player/?contract=' + action.payload),
    )
    yield put(getSelectedPlayerSuccess(response.data))
  } catch (error) {
    yield put(getSelectedPlayerFailure(error))
  }
}

function* getVoteListAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/list-all-vote/?contract=' + action.payload,
      ),
    )
    yield put(getVoteListSuccess(response.data))
  } catch (error) {
    yield put(getVoteListFailure(error))
    handleException(error)
  }
}

function* getOpenVoteListAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/list-open-vote/?contract=' + action.payload,
      ),
    )
    yield put(getOpenVoteListSuccess(response.data))
  } catch (error) {
    yield put(getOpenVoteListFailure(error))
    handleException(error)
  }
}

function* getVoteInfoAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/list-vote-details/?' + action.payload),
    )
    yield put(getVoteInfoSuccess(response.data))
  } catch (error) {
    yield put(getVoteInfoFailure(error))
    handleException(error)
  }
}

function* getStakingStatusAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/staking-confirm/?detail_page_url=' + action.payload,
      ),
    )
    yield put(getStakingStatusSuccess(response.data))
  } catch (error) {
    yield put(getStakingStatusFailure(error))
    handleException(error)
  }
}

function* fetchFeaturedNftsAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequestAdvance('players/featured-nfts'))
    yield put(fetchFeaturedNftsSuccess(response.data))
  } catch (error) {
    yield put(fetchFeaturedNftsFailure(error))
  }
}

function* getNftsDataAPI(action) {
  try {
    const url = new URL(constants.HOST_URL + '/players/get-players-nfts/')
    const searchParams = url.searchParams
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      if (paramSet[i] === 'status_id' && action.payload[paramSet[i]] === -1) {
        searchParams.set(paramSet[i], [2, 3, 4, 5])
      } else {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
    }
    const response = yield call(() => makeGetRequestAdvance(url.toString()))
    yield put(getNftsDataSuccess(response.data))
  } catch (error) {
    yield put(getNftsDataFailure(error))
  }
}

function* getMyCoinNftsDataAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/mycoin-nfts/?status_id=2,3,4,5&contract=' + action.payload,
      ),
    )
    yield put(getMyCoinNftsDataSuccess(response.data))
  } catch (error) {
    yield put(getMyCoinNftsDataFailure(error))
  }
}

function* getPreviewNftsDataAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/player-preview-nfts/?player_contract=' + action.payload,
      ),
    )
    yield put(getPreviewNftsDataSuccess(response.data))
  } catch (error) {
    yield put(getPreviewNftsDataFailure(error))
  }
}

function* getNftsBalanceAPI(action) {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const url = new URL(constants.HOST_URL + '/players/nft-balance')
    const searchParams = url.searchParams
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams.set(paramSet[i], action.payload[paramSet[i]])
    }
    console.log({ accessToken })
    const response = yield call(() =>
      // axios.get(url.toString(), {
      //   withCredentials: true,
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // }),
      makeGetRequestAdvance(url.toString()),
    )
    yield put(getNftsBalanceSuccess(response.data))
  } catch (error) {
    yield put(getNftsBalanceFailure(error))
  }
}

function* getEANftsBalanceAPI(action) {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const url = new URL(constants.HOST_URL + '/accounts/user-early-access-nft/')
    const searchParams = url.searchParams
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams.set(paramSet[i], action.payload[paramSet[i]])
    }
    const response = yield call(() =>
      // axios.get(url.toString(), {
      //   withCredentials: true,
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // }),
      makeGetRequestAdvance(url.toString()),
    )
    yield put(getEANftsBalanceSuccess(response.data))
  } catch (error) {
    yield put(getEANftsBalanceFailure(error))
  }
}

function* getAllNftsDataAPI(action) {
  try {
    if (action?.payload?.type === 'overview') {
      yield put(fetchListNftsOverviewInit(action?.payload))
      yield put(fetchListNftsAuction(action?.payload))
      yield put(fetchListNftsRaffle(action?.payload))
      yield put(fetchListNftsUpcoming(action?.payload))
      yield put(fetchListNftsMinted(action?.payload))
      yield put(fetchListNftsValuable(action?.payload))
    } else if (action?.payload?.type === 'hot') {
      yield put(fetchListNftsHot(action?.payload))
    } else if (action?.payload?.type === 'new') {
      yield put(fetchListNftsNew(action?.payload))
    } else {
      const url = new URL(constants.HOST_URL + '/players/nftList/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        if (paramSet[i] === 'status_id' && action.payload[paramSet[i]] === -1) {
          searchParams.set(paramSet[i], [2, 3, 4, 5])
        } else {
          searchParams.set(paramSet[i], action.payload[paramSet[i]])
        }
      }
      const response = yield call(() => makeGetRequestAdvance(url.toString()))
      yield put(getAllNftsDataSuccess(response.data))
    }
  } catch (error) {
    yield put(getAllNftsDataFailure(error))
  }
}

function* getAllKioskDataAPI(action) {
  try {
    let response
    if (action?.payload?.type === 'new') {
      response = yield call(() =>
        makeGetRequestAdvance('players/player_new_items'),
      )
    } else if (action?.payload?.type === 'digital items') {
      response = yield call(() =>
        makeGetRequestAdvance('players/player_digital_items'),
      )
    } else if (action?.payload?.type === 'physical items') {
      response = yield call(() =>
        makeGetRequestAdvance('players/player_postal_items'),
      )
    } else {
      const url = new URL(constants.HOST_URL + '/players/player_all_items/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      response = yield call(() => makeGetRequestAdvance(url.toString()))
    }
    yield put(getAllKioskDataSuccess(response.data))
  } catch (error) {
    yield put(getAllKioskDataFailure(error))
  }
}

function* getLandingKioskDataAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/players_items'),
    )
    yield put(getLandingKioskDataSuccess(response.data))
  } catch (error) {
    yield put(getLandingKioskDataFailure(error))
  }
}

function* getPlayerKioskDataAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/player_detail_items/?playerid=' + action.payload,
      ),
    )
    yield put(getPlayerKioskDataSuccess(response.data))
  } catch (error) {
    yield put(getPlayerKioskDataFailure(error))
  }
}

function* getTxnConfirmAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/transaction-status/?transaction_hash=' + action.payload,
      ),
    )
    yield put(getTxnConfirmSuccess(response.data))
  } catch (error) {
    console.log({ error })
    yield put(getTxnConfirmError(error))
  }
}

function* getSendMaticTxnConfirmAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'wallets/transaction-receipt/?txn_hash=' + action.payload,
      ),
    )
    yield put(getSendMaticTxnConfirmSuccess(response.data))
  } catch (error) {
    console.log({ error })
    yield put(getSendMaticTxnConfirmError(error))
  }
}

function* getBidsAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/get-bids/?' + action.payload),
    )
    yield put(getBidsSuccess(response.data))
  } catch (error) {
    yield put(getBidsFailure(error))
  }
}

function* getStakingRewardAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance(
        'players/staking-rewards/?player_contract=' + action.payload,
      ),
    )
    yield put(getStakingRewardSuccess(response.data))
  } catch (error) {
    yield put(getStakingRewardFailure(error))
  }
}

function* getStakingBalanceAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance(
        'players/staking-balance/?player_contract=' + action.payload,
      ),
    )
    yield put(getStakingBalanceSuccess(response.data))
  } catch (error) {
    yield put(getStakingBalanceFailure(error))
  }
}

function* getPlayerCoinDraftsAPI(action) {
  let response
  try {
    if (action.payload) {
      const url = new URL(constants.HOST_URL + '/players/drafted-by/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      response = yield call(() => makeGetRequestAdvance(url.toString()))
    } else {
      response = yield call(() => makeGetRequestAdvance('players/drafted-by/'))
    }
    yield put(getDraftedByDataSuccess(response.data.data))
  } catch (error) {
    yield put(getDraftedByDataError(error))
  }
}

function* getCurrentDraftsAPI(action) {
  let response
  try {
    if (action.payload) {
      const url = new URL(constants.HOST_URL + '/players/active-draft/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      response = yield call(() => makeGetRequestAdvance(url.toString()))
    } else {
      response = yield call(() =>
        makeGetRequestAdvance('players/active-draft/'),
      )
    }
    yield put(getCurrentDraftsDataSuccess(response.data.data))
  } catch (error) {
    yield put(getCurrentDraftsDataError(error))
  }
}

function* getAllDraftsAPI(action) {
  let response
  try {
    if (action.payload) {
      const url = new URL(constants.HOST_URL + '/players/all-draft/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      response = yield call(() => makeGetRequestAdvance(url.toString()))
    } else {
      response = yield call(() => makeGetRequestAdvance('players/all-draft/'))
    }
    yield put(getAllDraftsDataSuccess(response.data.data))
  } catch (error) {
    yield put(getAllDraftsDataError(error))
  }
}

function* getBlockdeadlineAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/calculate-block-deadline/?endDate=' + action.payload,
      ),
    )
    yield put(getBlockdeadlineSuccess(response.data))
  } catch (error) {
    yield put(getBlockdeadlineFailure(error))
  }
}

function* getChartsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/charts/?contract=${action.payload?.contract}&chart_time=${action.payload?.chart_time}`,
      ),
    )
    yield put(getChartsSuccess(response.data))
  } catch (error) {
    yield put(getChartsFailure(error))
  }
}

function* launchCoinAPI(action) {
  let response
  try {
    yield put(transaction())
    response = yield call(() =>
      postRequestAuth('players/launch-coin/', action.payload),
    )
    yield put(transactionSuccess(response.data))
    yield put(launchCoinSuccess())
  } catch (error) {
    yield put(transactionFailure(error))
    yield put(launchCoinError())
  }
}

function* createAuctionAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/auction-nft/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* createRaffleAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/raffle-nft/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* mintNftAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/mint-nft/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* allowStakingAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/allow-staking/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* stakingAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/lock-staking/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* unstakingAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/unlock-staking/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* claimRewardAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/reward-claim/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* createVoteAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/create-vote/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* voteAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/vote/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* closeVoteAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/close-vote/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* buyTokensAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/payment-buy/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* sellTokensAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/payment-sell/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* addAdminAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/set-admin/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* addAgentAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/set-agent/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* revokeAdminAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/revoke-admin/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* createDraftAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/add-draftee/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* acceptDraftAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/accept-draft-request/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* deleteDrafteeAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/delete-draftee/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* bidOnAuctionAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/place-bid/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* playerTokenWithdrawAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/player-token-withdraw/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* nativeWithdrawAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/native-withdraw/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* closeActionAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/close-auction/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* drawWinnerAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/close-raffle/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* nftTransferAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/nft-transfer/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* nftGenesisTransferAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('accounts/early_access_nft_transfer/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* enrollRaffleAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/enroll-raffle/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* getDisplayPlayersAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/similar-entries/?playerId=${
          action.payload
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(getDisplayPlayersSuccess(response.data))
  } catch (error) {
    yield put(getDisplayPlayersFailure(error))
    handleException(error)
  }
}

function* transferCoinsAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/transfer-coins/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* checkLaunchStatusAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/check-player-status/?detailpageurl=' + action.payload,
      ),
    )
    yield put(checkLaunchStatusSuccess(response.data))
  } catch (error) {
    yield put(checkLaunchStatusFailure(error))
  }
}

function* savePlayerCustomisationAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/player-customisation/', action.payload),
    )
    yield put(savePlayerCustomisationSuccess(response.data))
  } catch (error) {
    yield put(savePlayerCustomisationFailure(error))
  }
}

function* AddPayoutAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/change-payout-address/', action.payload),
    )
    yield put(AddPayoutSuccess(response.data))
  } catch (error) {
    yield put(AddPayoutFailure(error))
  }
}
function* approveTradeCurrencyApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/approve-trade-currency/', action.payload),
    )
    yield put(transactionSuccess(response.data))
    yield put(approveTradeCurrencySuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* buyPlayerCoinsInCurrencyApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/buy-player-coins-in-currency/', action.payload),
    )
    yield put(transactionSuccess(response.data))
    yield put(buyPlayerCoinsInCurrencySuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
    yield put(buyPlayerCoinsInCurrencyFailure(error))
  }
}

function* sellPlayerCoinsInCurrencyApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/sell-player-coins-in-currency/', action.payload),
    )
    yield put(transactionSuccess(response.data))
    yield put(sellPlayerCoinsInCurrencySuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
    yield put(sellPlayerCoinsInCurrencyFailure(response.data))
  }
}

function* approveProExchangeApi(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/approve-router/', action.payload),
    )
    yield put(transactionSuccess(response.data))
    // yield put(approveProExchangeSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
    // yield put(approveProExchangeError(error))
  }
}
// function* buyTokensAPI(action) {
//   try {
//     yield put(transaction())
//     const response = yield call(() =>
//       postRequestAuth('players/payment-buy/', action.payload),
//     )
//     yield put(transactionSuccess(response.data))
//   } catch (error) {
//     yield put(transactionFailure(error))
//   }
// }

function* newRewardPercentageApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/change-reward-percentage/', action.payload),
    )
    yield put(newRewardPercentageSuccess(response.data))
  } catch (error) {
    yield put(newRewardPercentageFailure(error))
  }
}

function* fetchPassportImageAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/player-passport/'),
    )
    yield put(fetchPassportImageSuccess(response.data))
  } catch (error) {
    yield put(fetchPassportImageFailure(error))
  }
}

function* instaProfileRefetchApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/insta-profile-pic-refetch/', action.payload),
    )
    yield put(instaProfileRefetchSuccess(response.data))
  } catch (error) {
    yield put(instaProfileRefetchFailure(error))
  }
}

function* getItemsPriceAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('wallets/all-items-price/'),
    )
    yield put(getItemsPriceSuccess(response.data))
  } catch (error) {
    yield put(getItemsPriceFailure(error))
  }
}

function* payForItemAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('wallets/pay-for-item/', action.payload),
    )
    yield put(payForItemSuccess(response.data))
  } catch (error) {
    yield put(payForItemFailure(error))
  }
}

function* getUserPayedItemsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `wallets/user-paid-items/?id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(getUserPayedItemsSuccess(response.data))
  } catch (error) {
    yield put(getUserPayedItemsFailure(error))
  }
}

function* fetchListPlayersTrendingAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/players_trending/'),
    )
    yield put(fetchListPlayersTrendingSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersTrendingFailure(error))
  }
}

function* fetchListPlayersMarketAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/players_high_market_value/'),
    )
    yield put(fetchListPlayersMarketSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersMarketFailure(error))
  }
}

function* fetchListPlayersSupportersAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/players_most_supporters/'),
    )
    yield put(fetchListPlayersSupportersSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersSupportersFailure(error))
  }
}

function* fetchListPlayersWinnersAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/players_winners/'),
    )
    yield put(fetchListPlayersWinnersSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersWinnersFailure(error))
  }
}

function* fetchListPlayersLosersAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/players_losers/'),
    )
    yield put(fetchListPlayersLosersSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersLosersFailure(error))
  }
}

function* fetchListPlayersTalentsAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/players_new_talent/'),
    )
    yield put(fetchListPlayersTalentsSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersTalentsFailure(error))
  }
}

function* fetchListPlayersCountryAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance(
        'players/players_all/?country_id=' + action?.payload,
      ),
    )
    yield put(fetchListPlayersCountrySuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersCountryFailure(error))
  }
}

function* fetchListPlayersLatestTradesAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/players_latest_trades/'),
    )
    yield put(fetchListPlayersLatestTradesSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersLatestTradesFailure(error))
  }
}

function* fetchListPlayersHotAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequestAdvance('players/players_hot/'))
    yield put(fetchListPlayersHotSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersHotFailure(error))
  }
}

function* fetchListPlayersFeaturedAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/players_featured/'),
    )
    yield put(fetchListPlayersFeaturedSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersFeaturedFailure(error))
  }
}

function* fetchListPlayersNewAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequestAdvance('players/players_new/'))
    yield put(fetchListPlayersNewSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersNewFailure(error))
  }
}
function* fetchListNftsHotAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequestAdvance('players/nftHot'))
    yield put(fetchListNftsHotSuccess(response.data))
  } catch (error) {
    yield put(fetchListNftsHotFailure(error))
  }
}

function* fetchListNftsNewAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequestAdvance('players/nftNew'))
    yield put(fetchListNftsNewSuccess(response.data))
  } catch (error) {
    yield put(fetchListNftsNewFailure(error))
  }
}

function* fetchListNftsUpcomingAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequestAdvance('players/nftNew'))
    yield put(fetchListNftsUpcomingSuccess(response.data))
  } catch (error) {
    yield put(fetchListNftsUpcomingFailure(error))
  }
}

function* fetchListNftsAuctionAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequestAdvance('players/nftAuction'))
    yield put(fetchListNftsAuctionSuccess(response.data))
  } catch (error) {
    yield put(fetchListNftsAuctionFailure(error))
  }
}

function* fetchListNftsRaffleAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequestAdvance('players/nftRaffle'))
    yield put(fetchListNftsRaffleSuccess(response.data))
  } catch (error) {
    yield put(fetchListNftsRaffleFailure(error))
  }
}

function* fetchListNftsMintedAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequestAdvance('players/nftMinted'))
    yield put(fetchListNftsMintedSuccess(response.data))
  } catch (error) {
    yield put(fetchListNftsMintedFailure(error))
  }
}

function* fetchListNftsValuableAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/mostValuableNFTs'),
    )
    yield put(fetchListNftsValuableSuccess(response.data))
  } catch (error) {
    yield put(fetchListNftsValuableFailure(error))
  }
}

function* DraftingPercentageApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/change-drafting-percentage/', action.payload),
    )
    yield put(DraftingPercentageSuccess(response.data))
  } catch (error) {
    yield put(DraftingPercentageFailure(error))
  }
}

function* CreateKioskItemApi(action) {
  try {
    console.log('kioskCreateItem', action?.payload)
    const response = yield call(() =>
      postRequestAuth('players/kioskItem/', action.payload),
    )
    yield put(createKioskItemSuccess(response.data))
  } catch (error) {
    yield put(createKioskItemFailure(error))
  }
}

function* editKioskItemApi(action) {
  try {
    const response = yield call(() =>
      putRequestAuth('players/kioskItem/', action.payload),
    )
    yield put(createKioskItemSuccess(response.data))
  } catch (error) {
    yield put(createKioskItemFailure(error))
  }
}

function* searchTickerPlayerApi(action) {
  let response
  try {
    if (action.payload) {
      // const url = new URL(constants.HOST_URL + '/players/player-list/')
      const url = new URL(constants.HOST_URL + '/players/players_search/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      response = yield call(() => makeGetRequestAdvance(url.toString()))
    } else {
      response = yield call(() => makeGetRequestAdvance('players/players_all/'))
    }
    yield put(searchTickerPlayersSuccess(response.data))
  } catch (error) {
    yield put(searchTickerPlayersFailure(error))
  }
}

function* fetchListPlayersLandingAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance(
        `players/players_landing_trending?id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(fetchListPlayersLandingSuccess(response.data))
  } catch (error) {
    yield put(fetchListPlayersLandingFailure(error))
  }
}

function* getMinStakingClaimAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance(`players/min_staking_for_claim/`),
    )
    yield put(getMinStakingSuccess(response.data))
  } catch (error) {
    yield put(getMinStakingFailure(error))
  }
}

function* createFanPlayerAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/player_claim_request/', action.payload),
    )
    yield put(createFanPlayerSuccess(response.data))
  } catch (error) {
    yield put(createFanPlayerFailure(error))
  }
}

function* reCreateFanPlayerAPI(action) {
  try {
    const response = yield call(() =>
      putRequestAuth('players/player_claim_request/', action.payload),
    )
    yield put(reCreateFanPlayerSuccess(response.data))
  } catch (error) {
    yield put(reCreateFanPlayerFailure(error))
  }
}

function* getFanPlayerAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`players/player_claim_request/`),
    )

    yield put(getFanPlayerDataSuccess(response.data))
    // yield put(resetCreatePlayerSuccess())
  } catch (error) {
    yield put(getFanPlayerDataFailure(error))
  }
}

function* checkFanPlayerStatusAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/check_claim_request/'),
    )
    yield put(checkFanPlayerStatusSuccess(response.data))
  } catch (error) {
    yield put(checkFanPlayerStatusFailure(error))
  }
}

function* getSeasonDetailsAPI(action) {
  let response
  try {
    if (action.payload) {
      const url = new URL(constants.HOST_URL + '/players/get_season_details/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      response = yield call(() => makeGetRequestAdvance(url.toString()))

      if (response?.data?.success === true) {
        yield put(getSeasonDetailsSuccess(response.data))
      }
    } else {
      response = yield call(() =>
        makeGetRequestAdvance('players/get_season_details/'),
      )

      if (response?.data?.success === true) {
        yield put(getSeasonDetailsSuccess(response.data))
      }
    }
  } catch (error) {
    yield put(getSeasonDetailsFailure(error))
  }
}

function* claimNftAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/claim_auto_nft/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* consumeNftAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/consume_nft/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* claimXpAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('players/claim_xp/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* getUserEarlyAccessNftAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`accounts/user-early-access-nft/`),
    )

    yield put(getUserEarlyAccessNftSuccess(response.data))
  } catch (error) {
    yield put(getUserEarlyAccessNftFailure(error))
  }
}

function* claimPrizeAPI(action) {
  try {
    yield put(transaction())
    const response = yield call(() =>
      postRequestAuth('accounts/claim-season-prize/', action.payload),
    )
    yield put(transactionSuccess(response.data))
  } catch (error) {
    yield put(transactionFailure(error))
  }
}

function* getSeasonPrizeAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `accounts/get_season_prize/?season_id=${action.payload}`,
      ),
    )

    yield put(getSeasonPrizeSuccess(response.data))
  } catch (error) {
    yield put(getSeasonPrizeFailure(error))
  }
}

function* getApprovedCountriesForPlayerCreationAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('wallets/player_approved_country'),
    )
    yield put(getApprovedCountriesForPlayerCreationSuccess(response.data))
  } catch (error) {
    console.log({ error })
    yield put(getApprovedCountriesForPlayerCreationError(error))
  }
}

function* getGenesisSaleDetailAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/genesis_sale_detail'),
    )
    yield put(getGenesisSaleDetailSuccess(response.data))
  } catch (error) {
    console.log({ error })
    yield put(getGenesisSaleDetailError(error))
  }
}

function* getLandingPlayerCountAPI() {
  try {
    const response = yield call(() =>
      makeGetRequest('players/landing_player_section'),
    )
    let res = {}
    if (response.data.success) {
      res = {
        scoutsCount: response.data.scouts_count,
        playerCount: response.data.player_count,
        uniqueCountryCount: response.data.unique_country_count,
      }
    } else {
      res = {
        scoutsCount: 0,
        playerCount: 0,
        uniqueCountryCount: 0,
      }
    }
    yield put(getLandingPlayerCountSuccess(res))
  } catch (error) {
    const res = {
      scoutsCount: 0,
      playerCount: 0,
      uniqueCountryCount: 0,
    }
    yield put(getLandingPlayerCountSuccess(res))
  }
}

function* getLandingPlayerDataWithURLAPI(action) {
  let response
  try {
    if (action.payload) {
      const url = new URL(action.payload)
      response = yield call(() => makeGetRequest(url.toString()))
    } else {
      response = yield call(() => makeGetRequest('players/player_landing'))
    }
    yield put(getLandingPlayerDataWithURLSuccess(response.data))
  } catch (error) {
    yield put(getLandingPlayerDataWithURLSuccess([]))
  }
}

function* getLandingPlayerDataAPI(action) {
  let response
  try {
    if (action.payload?.search) {
      const url = new URL(constants.HOST_URL + '/players/player_landing')
      const searchParams = url.searchParams
      searchParams.set('search', action.payload.search)
      response = yield call(() => makeGetRequest(url.toString()))
    } else {
      response = yield call(() => makeGetRequest('players/player_landing'))
    }
    yield put(getLandingPlayerDataSuccess(response.data))
  } catch (error) {
    yield put(getLandingPlayerDataSuccess([]))
  }
}

function* getMessagesAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/player_messages/?player_contract=${action?.payload}`,
      ),
    )
    yield put(getMessagesSuccess(response.data))
  } catch (error) {
    console.log({ error })
    yield put(getMessagesFailure(error))
  }
}
function* getMessagesReplyAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/player_message_reply/?player_contract=${action?.payload?.playerContract}&parent=${action?.payload?.parent}`,
      ),
    )
    yield put(getMessagesReplySuccess(response.data))
  } catch (error) {
    console.log({ error })
    yield put(getMessagesReplyFailure(error))
  }
}

function* getBannerAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequest('players/banner'))
    if (response.data.success) {
      yield put(getBannerSuccess(response.data))
    } else {
      response = {
        main_banner: [],
        extra_banner: [],
      }
      yield put(getBannerSuccess(response.data))
    }
  } catch (error) {
    response = {
      main_banner: [],
      extra_banner: [],
    }
    yield put(getBannerSuccess(response))
  }
}

function* getMyWalletPlayersAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/my_wallet_players_list'),
    )
    if (response.status === 200) {
      yield put(getMyWalletPlayersSuccess(response.data))
    } else {
      yield put(getMyWalletPlayersFailure())
    }
  } catch (error) {
    yield put(getMyWalletPlayersFailure())
  }
}

function* getTrendingScoutsPlayersAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('accounts/scouts_landing_trending'),
    )
    if (response.status === 200) {
      yield put(getTrendingScoutsPlayersSuccess(response.data.results))
    } else {
      yield put(getTrendingScoutsPlayersSuccess([]))
    }
  } catch (error) {
    yield put(getTrendingScoutsPlayersSuccess([]))
  }
}

function* getLaunchingPlayersAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/launching_players_list'),
    )
    if (response.status === 200) {
      yield put(getLaunchingPlayersSuccess(response.data.results))
    } else {
      yield put(getLaunchingPlayersSuccess([]))
    }
  } catch (error) {
    yield put(getLaunchingPlayersSuccess([]))
  }
}

function* getFeedPlayersAPI(action) {
  let response
  try {
    const url = new URL(constants.HOST_URL + '/players/feed/')
    const searchParams = url.searchParams
    const paramSet = Object.keys(action.payload.params)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams.set(paramSet[i], action.payload?.params[paramSet[i]])
    }
    response = yield call(() => makeGetRequest(url.toString()))
    // response = yield call(() => makeGetRequest('players/feed'))
    if (response.data.success) {
      // yield put(getFeedPlayersSuccess(response.data.data))
      yield put(
        getFeedPlayersSuccess({
          success: response.data.data,
          sliceAction: action,
        }),
      )
    } else {
      yield put(getFeedPlayersSuccess([]))
    }
  } catch (error) {
    yield put(getFeedPlayersSuccess([]))
  }
}

function* updateFeedPlayersAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequest('players/feed'))
    if (response.data.success) {
      yield put(getFeedPlayersSuccess(response.data.data))
    } else {
      yield put(getFeedPlayersSuccess([]))
    }
  } catch (error) {
    yield put(getFeedPlayersSuccess([]))
  }
}

function* getScoutsCountAPI(action) {
  let response
  const empty_res = {
    total_trades: 0,
    xp_collected_24hr: 0,
    scoutsCount: 0,
  }
  try {
    response = yield call(() => makeGetRequest('accounts/scouts_page_kpis'))
    if (response.data.success) {
      yield put(getScoutsCountSuccess(response.data))
    } else {
      yield put(getScoutsCountSuccess(empty_res))
    }
  } catch (error) {
    yield put(getScoutsCountSuccess(empty_res))
  }
}

function* getScoutsLeaderboardAPI(action) {
  let response
  try {
    if (action.payload) {
      const url = new URL(constants.HOST_URL + '/accounts/scouts_leaderboard/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      response = yield call(() => makeGetRequest(url.toString()))

      if (response?.data?.success === true) {
        yield put(getScoutsLeaderboardSuccess(response.data))
      }
    }
  } catch (error) {
    yield put(getScoutsLeaderboardSuccess({}))
  }
}

function* updateScoutsLeaderboardAPI(action) {
  let response
  try {
    if (action.payload) {
      const url = new URL(constants.HOST_URL + '/accounts/scouts_leaderboard/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      response = yield call(() => makeGetRequest(url.toString()))

      if (response?.data?.success === true) {
        yield put(updateScoutsLeaderboardSuccess(response.data))
      }
    }
  } catch (error) {
    yield put(updateScoutsLeaderboardSuccess({}))
  }
}

function* getScoutsTopAPI(action) {
  let response
  try {
    response = yield call(() => makeGetRequest('accounts/scouts_top5'))
    if (response.data.results) {
      yield put(getScoutsTopSuccess(response.data.results))
    } else {
      yield put(getScoutsTopSuccess([]))
    }
  } catch (error) {
    yield put(getScoutsTopSuccess([]))
  }
}

function* getPlayersCountAPI(action) {
  let response
  const empty_res = {
    token_count: 0,
    unique_country_count: 0,
    player_count: 0,
  }
  try {
    response = yield call(() => makeGetRequest('players/player_page_kpis'))
    if (response.data.success) {
      yield put(getPlayersCountSuccess(response.data))
    } else {
      yield put(getPlayersCountSuccess(empty_res))
    }
  } catch (error) {
    yield put(getPlayersCountSuccess(empty_res))
  }
}

function* getPlayersComingSoonAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequest('players/players_coming_soon_list'),
    )
    if (response.data) {
      yield put(getPlayersComingSoonSuccess(response.data.results))
    } else {
      yield put(getPlayersComingSoonSuccess([]))
    }
  } catch (error) {
    yield put(getPlayersComingSoonSuccess([]))
  }
}

function* getRecentAquisitionItemsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/recent_aquisition_items' + action.payload),
    )
    yield put(getRecentAquisitionItemsSuccess(response.data))
  } catch (error) {
    yield put(getRecentAquisitionItemsFailure(error))
  }
}

function* getNewKioskItemsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/new_kiosk_items/' + action.payload),
    )
    yield put(getNewKioskItemsSuccess(response.data))
  } catch (error) {
    yield put(getNewKioskItemsFailure(error))
  }
}

function* getTopKioskItemsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/top_kiosk_items/' + action.payload),
    )
    yield put(getTopKioskItemsSuccess(response.data))
  } catch (error) {
    yield put(getTopKioskItemsFailure(error))
  }
}

function* getKioskKpiAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/kiosk_page_kpis/' + action.payload),
    )
    yield put(getKioskKpiSuccess(response.data))
  } catch (error) {
    yield put(getKioskKpiFailure(error))
  }
}

function* getAllKioskItemsAPI(action) {
  try {
    let response = null
    // const response = yield call(() =>
    //   makeGetRequestAdvance('players/all_kiosk_items/' + action.payload),
    // )
    // yield put(getAllKioskItemsSuccess(response.data))
    if (action.payload) {
      const url = new URL(constants.HOST_URL + '/players/all_kiosk_items/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      console.log({ response })
      response = yield call(() => makeGetRequestAdvance(url.toString()))
      yield put(getAllKioskItemsSuccess(response.data))
    } else {
      response = yield call(() =>
        makeGetRequestAdvance('players/all_kiosk_items/'),
      )
      console.log({ response })
      yield put(getAllKioskItemsSuccess(response.data))
    }
  } catch (error) {
    console.log('preet', error)
    yield put(getAllKioskItemsFailure(error))
  }
}

function* getTopTradesAPI(action) {
  try {
    let response = null
    if (Object.keys(action.payload).length) {
      const url = new URL(constants.HOST_URL + '/players/global_top_trades/')
      const searchParams = url.searchParams
      const paramSet = Object.keys(action.payload)
      for (let i = 0; i < paramSet.length; i++) {
        searchParams.set(paramSet[i], action.payload[paramSet[i]])
      }
      console.log({ response })
      response = yield call(() => makeGetRequestAdvance(url.toString()))
      yield put(getTopTradesSuccess(response.data))
    } else {
      yield put(resetTopTrades())
      response = yield call(() =>
        makeGetRequestAdvance('players/global_top5_trades/'),
      )
      console.log({ response })
      yield put(getTopTradesSuccess(response.data))
    }
  } catch (error) {
    console.log('preet', error)
    yield put(getTopTradesFailure(error))
  }
}

function* getUserTopTradesAPI(action) {
  try {
    yield put(resetTopTrades())
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/user_top5_trades/?username=' + action.payload,
      ),
    )
    yield put(getTopTradesSuccess(response.data))
  } catch (error) {
    yield put(getTopTradesFailure(error))
  }
}

export default function* rootSaga() {
  yield all([takeLatest(getMessagesReply, getMessagesReplyAPI)])
  yield all([takeLatest(getMessages, getMessagesAPI)])
  yield all([takeLatest(claimXP, claimXpAPI)])
  yield all([takeLatest(consumeNft, consumeNftAPI)])
  yield all([takeLatest(claimNft, claimNftAPI)])
  yield all([takeLatest(createFanPlayer, createFanPlayerAPI)])
  yield all([takeLatest(reCreateFanPlayer, reCreateFanPlayerAPI)])
  yield all([takeLatest(getFanPlayerData, getFanPlayerAPI)])
  yield all([takeLatest(checkFanPlayerStatus, checkFanPlayerStatusAPI)])
  yield all([takeLatest(createPlayer, createPlayerAPI)])
  yield all([takeLatest(reCreatePlayer, reCreatePlayerAPI)])
  yield all([takeLatest(getPlayerData, getPlayerAPI)])
  yield all([takeLatest(checkPlayerStatus, checkPlayerStatusAPI)])
  yield all([takeLatest(getAddedAgents, getAddedAgentsAPI)])
  yield all([takeLatest(updatePlayerProfile, updatePlayerProfileAPI)])
  yield all([takeLatest(getAllPlayers, getAllPlayersAPI)])
  yield all([takeLatest(fetchAllPlayers, fetchAllPlayersAPI)])
  yield all([takeLatest(fetchListPlayersAll, fetchListPlayersAllAPI)])
  yield all([takeLatest(fetchListPlayers, fetchListPlayersAPI)])
  yield all([takeLatest(searchTickerPlayers, searchTickerPlayerApi)])
  yield all([takeLatest(fetchTickerBanner, fetchTickerBannerAPI)])
  yield all([takeLatest(fetchDraftPlayers, fetchDraftPlayersAPI)])
  yield all([takeLatest(fetchMostDraftPlayers, fetchMostDraftPlayersAPI)])
  yield all([takeLatest(fetchVersusPlayers, fetchVersusPlayersAPI)])
  yield all([takeLatest(getPlayerDetails, getPlayerDetailsAPI)])
  yield all([takeLatest(getDefaultMatic, getDefaultMaticAPI)])
  yield all([takeLatest(getPlayerDetailsImplicit, getPlayerDetailsImplicitAPI)])
  yield all([takeLatest(launchPlayerCoin, launchPlayerCoinAPI)])
  yield all([takeLatest(getPlayer1Contract, getPlayer1ContractAPI)])
  yield all([takeLatest(getPlayerCoinContract, getPlayerCoinContractAPI)])
  yield all([takeLatest(getPurchaseContract, getPurchaseContractAPI)])
  yield all([takeLatest(getPlayer2Contract, getPlayer2ContractAPI)])
  yield all([takeLatest(fetchDraftNewPlayers, fetchDraftNewPlayersAPI)])
  yield all([takeLatest(getPlayerDrafts, getPlayerDraftsAPI)])
  yield all([takeLatest(fetchPlayersBalance, fetchPlayersBalanceAPI)])
  yield all([takeLatest(getPlayerSelection, getPlayerSelectionAPI)])
  yield all([takeLatest(getSelectedPlayer, getSelectedPlayerAPI)])
  yield all([takeLatest(getVoteList, getVoteListAPI)])
  yield all([takeLatest(getOpenVoteList, getOpenVoteListAPI)])
  yield all([takeLatest(getVoteInfo, getVoteInfoAPI)])
  yield all([takeLatest(getStakingStatus, getStakingStatusAPI)])
  yield all([takeLatest(getCoinList, getCoinListAPI)])
  yield all([takeLatest(fetchFeaturedNfts, fetchFeaturedNftsAPI)])
  yield all([takeLatest(getNftsData, getNftsDataAPI)])
  yield all([takeLatest(getMyCoinNftsData, getMyCoinNftsDataAPI)])
  yield all([takeLatest(getPreviewNftsData, getPreviewNftsDataAPI)])
  yield all([takeLatest(getNftsBalance, getNftsBalanceAPI)])
  yield all([takeLatest(getEANftsBalance, getEANftsBalanceAPI)])
  yield all([takeLatest(getAllNftsData, getAllNftsDataAPI)])
  yield all([takeLatest(getAllKioskData, getAllKioskDataAPI)])
  yield all([takeLatest(getLandingKioskData, getLandingKioskDataAPI)])
  yield all([takeLatest(getPlayerKioskData, getPlayerKioskDataAPI)])
  yield all([takeLatest(getTxnConfirm, getTxnConfirmAPI)])
  yield all([takeLatest(getSendMaticTxnConfirm, getSendMaticTxnConfirmAPI)])
  yield all([takeLatest(getBids, getBidsAPI)])
  yield all([takeLatest(getStakingReward, getStakingRewardAPI)])
  yield all([takeLatest(getStakingBalance, getStakingBalanceAPI)])
  // yield all([takeLatest(fetchPlayersStats, fetchPlayerStatsAPI)])
  yield all([takeLatest(getDraftedByData, getPlayerCoinDraftsAPI)])
  yield all([takeLatest(getCurrentDraftsData, getCurrentDraftsAPI)])
  yield all([takeLatest(getAllDraftsData, getAllDraftsAPI)])
  yield all([takeLatest(getBlockdeadline, getBlockdeadlineAPI)])
  yield all([takeLatest(getCharts, getChartsAPI)])
  yield all([takeLatest(launchCoin, launchCoinAPI)])
  yield all([takeLatest(createAuction, createAuctionAPI)])
  yield all([takeLatest(createRaffle, createRaffleAPI)])
  yield all([takeLatest(mintNft, mintNftAPI)])
  yield all([takeLatest(allowStaking, allowStakingAPI)])
  yield all([takeLatest(staking, stakingAPI)])
  yield all([takeLatest(unstaking, unstakingAPI)])
  yield all([takeLatest(claimReward, claimRewardAPI)])
  yield all([takeLatest(createVote, createVoteAPI)])
  yield all([takeLatest(vote, voteAPI)])
  yield all([takeLatest(closeVote, closeVoteAPI)])
  yield all([takeLatest(buyTokens, buyTokensAPI)])
  yield all([takeLatest(sellTokens, sellTokensAPI)])
  yield all([takeLatest(addAdmin, addAdminAPI)])
  yield all([takeLatest(addAgent, addAgentAPI)])
  yield all([takeLatest(revokeAdmin, revokeAdminAPI)])
  yield all([takeLatest(createDraft, createDraftAPI)])
  yield all([takeLatest(acceptDraft, acceptDraftAPI)])
  yield all([takeLatest(deleteDraftee, deleteDrafteeAPI)])
  yield all([takeLatest(bidOnAuction, bidOnAuctionAPI)])
  yield all([takeLatest(playerTokenWithdraw, playerTokenWithdrawAPI)])
  yield all([takeLatest(nativeWithdraw, nativeWithdrawAPI)])
  yield all([takeLatest(closeAction, closeActionAPI)])
  yield all([takeLatest(drawWinner, drawWinnerAPI)])
  yield all([takeLatest(nftTransfer, nftTransferAPI)])
  yield all([takeLatest(nftGenesisTransfer, nftGenesisTransferAPI)])
  yield all([takeLatest(enrollRaffle, enrollRaffleAPI)])
  yield all([takeLatest(getDisplayPlayers, getDisplayPlayersAPI)])
  yield all([takeLatest(transferCoins, transferCoinsAPI)])
  yield all([takeLatest(checkLaunchStatus, checkLaunchStatusAPI)])
  yield all([takeLatest(savePlayerCustomisation, savePlayerCustomisationAPI)])
  yield all([takeLatest(AddPayout, AddPayoutAPI)])
  yield all([takeLatest(approveTradeCurrency, approveTradeCurrencyApi)])
  yield all([takeLatest(buyPlayerCoinsInCurrency, buyPlayerCoinsInCurrencyApi)])
  yield all([
    takeLatest(sellPlayerCoinsInCurrency, sellPlayerCoinsInCurrencyApi),
  ])
  yield all([takeLatest(newRewardPercentage, newRewardPercentageApi)])
  yield all([takeLatest(fetchPassportImage, fetchPassportImageAPI)])
  yield all([takeLatest(instaProfileRefetch, instaProfileRefetchApi)])
  yield all([takeLatest(getItemsPrice, getItemsPriceAPI)])
  yield all([takeLatest(payForItem, payForItemAPI)])
  yield all([takeLatest(getUserPayedItems, getUserPayedItemsAPI)])
  yield all([takeLatest(approveProExchange, approveProExchangeApi)])
  yield all([takeLatest(fetchListPlayersTrending, fetchListPlayersTrendingAPI)])
  yield all([takeLatest(fetchListPlayersMarket, fetchListPlayersMarketAPI)])
  yield all([
    takeLatest(fetchListPlayersLatestTrades, fetchListPlayersLatestTradesAPI),
  ])
  yield all([
    takeLatest(fetchListPlayersSupporters, fetchListPlayersSupportersAPI),
  ])
  yield all([takeLatest(fetchListPlayersWinners, fetchListPlayersWinnersAPI)])
  yield all([takeLatest(fetchListPlayersLosers, fetchListPlayersLosersAPI)])
  yield all([takeLatest(fetchListPlayersTalents, fetchListPlayersTalentsAPI)])
  yield all([takeLatest(fetchListPlayersCountry, fetchListPlayersCountryAPI)])
  yield all([takeLatest(fetchListPlayersHot, fetchListPlayersHotAPI)])
  yield all([takeLatest(fetchListPlayersFeatured, fetchListPlayersFeaturedAPI)])
  yield all([takeLatest(fetchListPlayersNew, fetchListPlayersNewAPI)])
  yield all([takeLatest(fetchListNftsHot, fetchListNftsHotAPI)])
  yield all([takeLatest(fetchListNftsNew, fetchListNftsNewAPI)])
  yield all([takeLatest(fetchListNftsUpcoming, fetchListNftsUpcomingAPI)])
  yield all([takeLatest(fetchListNftsAuction, fetchListNftsAuctionAPI)])
  yield all([takeLatest(fetchListNftsRaffle, fetchListNftsRaffleAPI)])
  yield all([takeLatest(fetchListNftsMinted, fetchListNftsMintedAPI)])
  yield all([takeLatest(fetchListNftsValuable, fetchListNftsValuableAPI)])
  yield all([takeLatest(DraftingPercentage, DraftingPercentageApi)])
  yield all([takeLatest(createKioskItem, CreateKioskItemApi)])
  yield all([takeLatest(editKioskItem, editKioskItemApi)])
  yield all([takeLatest(fetchListPlayersLanding, fetchListPlayersLandingAPI)])
  yield all([takeLatest(getMinStaking, getMinStakingClaimAPI)])
  yield all([takeLatest(getSeasonDetails, getSeasonDetailsAPI)])
  yield all([takeLatest(getUserEarlyAccessNft, getUserEarlyAccessNftAPI)])
  yield all([takeLatest(claimPrize, claimPrizeAPI)])
  yield all([takeLatest(getSeasonPrize, getSeasonPrizeAPI)])
  yield all([
    takeLatest(
      getApprovedCountriesForPlayerCreation,
      getApprovedCountriesForPlayerCreationAPI,
    ),
  ])
  yield all([takeLatest(getGenesisSaleDetail, getGenesisSaleDetailAPI)])
  yield all([takeLatest(getLandingPlayerCount, getLandingPlayerCountAPI)])
  yield all([takeLatest(getLandingPlayerData, getLandingPlayerDataAPI)])
  yield all([
    takeLatest(getLandingPlayerDataWithURL, getLandingPlayerDataWithURLAPI),
  ])
  yield all([takeLatest(getBanner, getBannerAPI)])
  yield all([takeLatest(getMyWalletPlayers, getMyWalletPlayersAPI)])
  yield all([takeLatest(getTrendingScoutsPlayers, getTrendingScoutsPlayersAPI)])
  yield all([takeLatest(getLaunchingPlayers, getLaunchingPlayersAPI)])
  yield all([takeLatest(getFeedPlayers, getFeedPlayersAPI)])
  yield all([takeLatest(updateFeedPlayers, updateFeedPlayersAPI)])
  yield all([takeLatest(getScoutsCount, getScoutsCountAPI)])
  yield all([takeLatest(getScoutsLeaderboard, getScoutsLeaderboardAPI)])
  yield all([takeLatest(updateScoutsLeaderboard, updateScoutsLeaderboardAPI)])
  yield all([takeLatest(getScoutsTop, getScoutsTopAPI)])
  yield all([takeLatest(getPlayersCount, getPlayersCountAPI)])
  yield all([takeLatest(getPlayersComingSoon, getPlayersComingSoonAPI)])
  yield all([takeLatest(getRecentAquisitionItems, getRecentAquisitionItemsAPI)])
  yield all([takeLatest(getNewKioskItems, getNewKioskItemsAPI)])
  yield all([takeLatest(getTopKioskItems, getTopKioskItemsAPI)])
  yield all([takeLatest(getKioskKpi, getKioskKpiAPI)])
  yield all([takeLatest(getAllKioskItems, getAllKioskItemsAPI)])
  yield all([takeLatest(getTopTrades, getTopTradesAPI)])
  yield all([takeLatest(getUserTopTrades, getUserTopTradesAPI)])
}
