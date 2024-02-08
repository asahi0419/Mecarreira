/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ConstructionOutlined } from '@mui/icons-material'
import { createSlice } from '@reduxjs/toolkit'
import {
  checkForAuthNotProvided,
  checkForStatusZero,
  checkInviteNotLinked,
} from '@utils/helpers'

import {
  DummyPlayer,
  DummyScoutsKPI,
  DummyScoutsLeaderboard,
  DummyScoutsTop5,
  DummySeason,
} from '@root/constants'

const currentURL = window.location.href
const includesGenesis = currentURL.includes('/genesis')

const initialState = {
  isLoadingTP: false,
  isLoading: false,
  getDetailsLoading: false,
  isLoadingNfts: true,
  secretInputAttempts: 5,
  isLoadingKiosk: false,
  loadedStakingStatus: false,
  isLoadingPlayerList: false,
  isInstaProfileLoading: false,
  isVerifyingWhatsapp: false,
  defaultLoader: false,
  isLoadingCheckStatus: false,
  isCheckPlayerStatusError: '',
  isCheckPlayerStatusSuccess: '',
  allPlayersDataCheckStatus: [],
  isLoadingList: true,
  isLoadingCountry: true,
  isLoadingListTP: true,
  isLoadingPlayerCustomisation: false,
  fetchDraftPlayersLoading: false,
  isLaunching: false,
  tokenExpired: false,
  tokenExpiredTP: false,
  isCreatePlayerError: '',
  isCreatePlayerSuccess: '',
  isGetPlayerError: '',
  isGetPlayerSuccess: '',
  isFetchPlayerSuccess: '',
  isFetchDeployedPlayerSuccess: '',
  playerData: {
    artistname: '',
    dateofbirth: '',
    email: '',
    givenname: '',
    nationality: '',
    surname: '',
    mobilenumber: '',
    transfermarktlink: '',
  },
  passportimage: '',
  isFetchPassportImageSuccess: false,
  isFetchPassportImageError: false,
  isUpdatePlayerProfileError: '',
  isUpdatePlayerProfileSuccess: '',
  allPlayersData: [],
  signoutPressed: 0,
  allPlayersList: [],
  playersTableData: [],
  isFetchListPlayerError: '',
  isFetchListPlayerErrorTP: '',
  playersListData: [],
  playersTrendingListData: [],
  playersMarketListData: [],
  playersWinnersListData: [],
  playersLosersListData: [],
  playersSupportersListData: [],
  playersTalentsListData: [],
  playersCountryListData: [],
  playersListDataTP: [],
  isLoadingPlayersMarketListData: false,
  isFetchListPlayerSuccess: '',
  isFetchListPlayerSuccessTP: '',
  isFetchListPlayerTrendingDone: false,
  isFetchListPlayerMarketDone: false,
  isFetchListPlayerLatestTradesDone: false,
  isFetchListPlayerSupportersDone: false,
  isFetchListPlayerWinnersDone: false,
  isFetchListPlayerLosersDone: false,
  isFetchListPlayerTalentsDone: false,
  playersBannerData: [],
  playersDraftsData: [],
  playersMostDraftsData: [],
  playersVersusData: [],
  totalPlayersCount: 0,
  totalPlayersCountTP: 0,
  totalDeployedPlayersCount: 0,
  nextPlayerListUrl: '',
  nextPlayerListUrlTP: '',
  nextDeployedPlayerListUrl: '',
  previousPlayerListUrl: '',
  previousPlayerListUrlTP: '',
  previousDeployedPlayerListUrl: '',
  isGetAllPlayerError: '',
  isFetchAllPlayerError: '',
  getPlayerDetailsErrorMsg: '',
  getPlayerDetailsSuccessData: null,
  getPlayerDetailsImplicitSuccessData: null,
  cardPlayerDetailsSuccessData: null,
  fetchingDefaultMaticLoading: false,
  purchaseFormDefaultMatic: '',
  newPlayerId: null,
  tempAlteration: false,
  isLaunchPlayerCoinError: '',
  isLaunchPlayerCoinSuccess: '',
  deployedPlayersList: '',
  fetchDraftNewPlayersError: '',
  isDraftPlayersLoading: false,
  isGetPlayer1ContractSuccess: false,
  isGetPlayer1ContractError: false,
  player1contractPlayer: '',
  player1contract: '',
  player1contractabi: null,
  stakingcontract: null,
  stakingcontractabi: null,
  nftcontract: null,
  nftcontractabi: null,
  routerabi: null,
  routerContract: null,
  listingOn: null,
  wmatic: null,
  paymentOptions: [],
  paymentOptionsSell: [],
  proxyContract: null,
  proxyContractAbi: null,
  isGetPlayerCoinContractSuccess: false,
  isGetPlayerCoinContractError: false,
  playerCoinContract: null,
  playerCoinContractabi: null,
  playerCoinStakingContract: null,
  playerCoinStakingContractAbi: null,
  playerCoinNftcontract: null,
  playerCoinNftcontractabi: null,
  playerCoinRouterabi: null,
  playerCoinRouterContract: null,
  playerCoinWmatic: null,
  playerCoinListingOn: null,
  playerCoinPaymentOptionsSell: [],
  playerCoinProxyContract: null,
  playerCoinProxyContractAbi: null,
  sharetype: null,
  isGetPlayer2ContractSuccess: false,
  isGetPlayer2ContractError: false,
  isGetPlayer2ContractLoading: false,
  player2contract: '',
  player2contractabi: null,
  buyFormPlayerContract: '',
  buyFormPlayer2contractabi: '',
  staking2contract: null,
  staking2contractabi: null,
  fetchBalancePlayersProgress: false,
  fetchBalancePlayersError: '',
  fetchBalancePlayersSuccess: false,
  fetchBalancePlayersData: '',
  playerCoinActiveTab: '',
  drafteePlayerUrl: '',
  playerList: [],
  isGetPlayerSelectionSuccess: false,
  isGetPlayerSelectionCalled: false,
  isGetPlayerSelectionError: false,
  selectedPlayer: null,
  isGetSelectedPlayerSuccess: false,
  isGetSelectedPlayerFailure: false,
  isStakingOnlySelected: includesGenesis ? true : false,
  drafteePlayer: '',
  draftAction: '',
  draftPersist: null,
  drafteePlayerName: '',
  drafteePlayerAddress: '',
  isGetAgentsError: '',
  isGetAgentsSuccess: '',
  allAgentsData: [],
  selectedAgent: null,
  voteList: [],
  isGetVoteListSuccess: false,
  isGetVoteListError: false,
  openVoteList: [],
  isGetOpenVoteListSuccess: false,
  isGetOpenVoteListError: false,
  voteInfo: [],
  isGetVoteInfoSuccess: false,
  isGetVoteInfoError: false,
  stakingStatus: false,
  isLoadingCoins: false,
  isGetCoinsError: '',
  getCoinsData: [],
  nextCoinListUrl: '',
  previousCoinListUrl: '',
  isGetCoinsSuccess: '',
  totalCoinsCount: 0,
  featuredNftsData: [],
  nftsData: [],
  isGetNftsDataSuccess: false,
  isGetNftDataError: false,
  mycoinNftsData: [],
  isGetMyCoinNftsDataSuccess: false,
  isGetEndableNftDataError: false,
  previewNftsData: [],
  isGetPreviewNftsDataSuccess: false,
  isGetPreviewNftDataError: false,
  allNftsData: [],
  isGetAllNftsDataSuccess: false,
  isGetAllNftsDataError: false,
  nftsBalance: [],
  isGetNftsBalanceSuccess: false,
  isGetNftBalanceError: false,
  totalNftsCount: 0,
  nextNftsListUrl: '',
  previousNftsListUrl: '',
  totalKioskCount: 0,
  nextKioskListUrl: '',
  allKioskData: [],
  isGetAllKioskDataSuccess: false,
  isGetAllKioskDataError: false,
  playerKioskData: [],
  isGetPlayerKioskDataSuccess: false,
  isGetPlayerKioskDataError: false,
  landingKioskData: [],
  isGetLandingKioskDataSuccess: false,
  isGetLandingKioskDataError: false,
  isTxnChecking: false,
  txnConfirmResp: [],
  txnConfirmErr: '',
  txnConfirmSuccess: false,
  isGetBidsSuccess: false,
  isGetBidsError: false,
  bidList: [],
  isGetStakingRewardSuccess: false,
  isGetStakingRewardError: false,
  reward: 0,
  isGetStakingBalanceSuccess: false,
  isGetStakingBalanceError: false,
  stakingBalance: 0,
  maxbids: 0,
  isHighestBidder: false,
  coinMatics: '',
  isLoadingDraftedBy: false,
  isGetDraftedBySuccess: '',
  isGetDraftedByError: '',
  playerDraftedByData: '',
  isLoadingCurrentDrafts: true,
  isGetCurrentDraftsError: '',
  isGetCurrentDraftsSuccess: '',
  playerCurrentDraftsData: '',
  nextDraftedByUrl: '',
  previousDraftedByUrl: '',
  totalDraftedByCount: '',
  isLoadingAllDrafts: true,
  isGetAllDraftsError: '',
  isGetAllDraftsSuccess: '',
  playerAllDraftsData: '',
  blockdeadline: 0,
  isGetBlockdeadlineSuccess: false,
  isGetBlockdeadlineError: false,
  charts: [],
  volume: null,
  isGetChartsSuccess: false,
  isGetChartsError: false,
  playerUrl: '',
  isLoadingCurrentDrafts: false,
  isGetCurrentDraftsError: '',
  totalCurrentDraftsCount: '',
  nextCurrentDraftsUrl: '',
  previousCurrentDraftsUrl: '',
  isGetCurrentDraftsSuccess: '',
  playerCurrentDraftsData: '',
  isFetchCurrentDraftsError: '',
  isCheckLaunchStatusError: '',
  isCheckLaunchStatusSuccess: '',
  isSavePlayerCustomisationSuccess: false,
  isSavePlayerCustomisationError: false,
  launchStatus: null,
  isDisplayPlayersLoading: false,
  isDisplayPlayersError: '',
  displayPlayersList: [],
  isNoDisplayPlayers: false,
  isUnverifiedUser: '',
  playercardjson: null,
  purchaseContractLoading: false,
  isAddPayoutLoading: false,
  isAddPayoutError: '',
  AddPayoutData: false,
  paymentOptionsPurchase: [],
  approveLoading: false,
  approvePaymentOptionFailure: '',
  approvePaymentOptionSuccess: '',
  approveExchangeLoading: false,
  approveExchangeSuccess: '',
  approveExchangeFailure: '',
  buyInCurrencyLoading: false,
  isBuyInCurrencyTransactionSuccess: '',
  buyInCurrencyTxnHash: '',
  buyInCurrencyTransactionError: '',
  isSellInCurrencyTransactionSuccess: '',
  sellInCurrencyTxnHash: '',
  sellInCurrencyTransactionError: '',
  sellInCurrencyLoading: false,
  isnewRewardPercentageLoading: false,
  isnewRewardPercentageError: '',
  newRewardPercentageData: '',
  newRewardPercentageDataSuccess: false,
  isinstaProfileRefetchLoading: false,
  isinstaProfileRefetchError: '',
  instaProfileRefetchData: '',
  instaProfileRefetchDataSuccess: false,
  isItemLoading: false,
  getItemPriceData: [],
  serviceFeeAddress: '',
  getItemPriceError: '',
  isPayForLoading: false,
  payForItemData: '',
  payForItemDataSuccess: false,
  payForItemError: '',
  isUserPayedLoading: false,
  userPayedItemsData: [],
  userPayedItemsError: '',
  latestTradesData: [],
  exchangeRateData: null,
  isFetchListPlayersLatestTradesSuccess: false,
  isFetchListPlayersLatestTradesFailure: false,
  DraftingPercentageLoading: false,
  DraftingPercentageError: '',
  DraftingPercentageData: '',
  DraftingPercentageDataSuccess: false,
  txnHashN: '',
  createKioskLoading: false,
  createKioskError: '',
  createKioskSuccess: '',
  isCreateKioskItemFormVisible: false,
  isItemSwitchedToEdit: false,
  isLoadingPlayersLanding: false,
  isFetchListPlayerLandingSuccess: false,
  isFetchListPlayerLandingError: false,
  playersListLandingData: [],
  isLoadingTopTrades: false,
  isGetTopTradesSuccess: false,
  isGetTopTradesError: false,
  topTradesData: [],
  nextTopTradesUrl: '',
  showNewDraftPopupRedux: false,
  showFanClubList: false,
  searchField: false,
  playerId: '',
  allFanPlayersDataCheckStatus: false,
  seasonStatusError: '',
  season: null,
  prevbanner: null,
  prevbannermobile: null,
  hasSeasonPrev: false,
  hasSeasonNext: false,
  prevseasonid: 0,
  nextseasonid: 0,
  isGetSeasonDetailSuccess: false,
  centralNftContract: null,
  centralNftContractAbi: null,
  centralContract: null,
  centralContractAbi: null,
  centralContractAbi: null,
  earlyAccessNfts: [],
  earlyAccessPeriod: 0,
  isEarlyAccessNftSuccess: false,
  isEarlyAccessNftError: '',
  goLiveBtnClicked: false,
  isGetEANftsBalanceSuccess: false,
  isGetEANftsBalanceError: false,
  eaNftsBalance: [],
  seasonPrizeAmount: 0,
  isGetSeasonPrizeSuccess: false,
  isGetSeasonPrizeError: false,
  pictureUploadLoader: false,
  isMinStakingClaimLoading: false,
  minStakingSuccessData: '0',
  minStakingClaimError: '',
  isGetCountriesLoading: false,
  approvedCountriesListSuccess: [],
  approvedCountriesCodeList: [],
  approvedCountriesListError: '',
  genesisSaleDetailData: null,
  genesisSaleDetailSuccess: false,
  genesisSaleDetailError: '',
  landingPlayerCount: {
    scoutsCount: 0,
    playerCount: 0,
    uniqueCountryCount: 0,
  },
  landingPlayerData: [],
  landingPlayerNextUrl: null,
  landingPlayerPrevUrl: null,
  loadingLandingPlayerData: false,
  loadingLandingPlayerDataWithUrl: false,
  mainBanner: [],
  extraBanner: [],
  loadingBanner: false,
  myWalletPlayers: [],
  current_balance: 0,
  wallet_balance_percentage_change: 0,
  loadingMyWalletPlayers: false,
  trendingScoutsPlayers: [],
  loadingTrendingScoutsPlayers: false,
  launchingPlayers: [],
  loadingLaunchingPlayers: false,
  feedPlayers: [],
  newFeeds: [],
  newTimestamp: 1705051137,
  loadingFeedPlayers: false,
  initialFeedsFetched: false,
  scoutsCount: {
    scoutsCount: 0,
    totalTrades: 0,
    xpCollected: 0,
  },
  scoutsLeaderboard: [],
  loadingScoutsLeaderboard: false,
  updatingScoutsLeaderboard: false,
  scoutsTop: [],
  loadingScoutsTop: false,
  playersCount: {
    tokenCount: 0,
    uniqueCountryCount: 0,
    playerCount: 0,
  },
  playersComingSoon: [],
  loadingPlayersComingSoon: false,
  isLoadingMessages: false,
  isGetMessagesSuccess: [],
  isGetMessagesError: '',
  isLoadingMessagesReply: false,
  isGetMessagesReplySuccess: [],
  isGetMessagesReplyError: '',
  scoutsLeaderboardNextURL: null,
  scoutsLeaderboardPrevURL: null,
  allowShowAddToHomeScreenPopup: false,
  graiSuccess: [],
  graiIsLoading: false,
  graiFailure: '',
  gnkiSuccess: [],
  gnkiIsLoading: false,
  gnkiFailure: '',
  getTopItemsSuccess: [],
  getTopItemsLoading: false,
  getTopItemsFailure: '',
  getKioskKpiSuccess: [],
  getKioskKpiLoading: false,
  getIsKioskKpiFailure: '',
  getAllKioskItemsSuccess: [],
  isGetAllKioskItems: false,
  getAllKioskItemsNextUrl: '',
  getAllKioskItemsLoading: false,
  getAllKioskItemsFailure: '',
}

const playerCoinsSlice = createSlice({
  name: 'playercoins',
  initialState,
  reducers: {
    createPlayer(state, action) {
      state.isLoading = true
      state.isCreatePlayerError = ''
      state.playerData = action.payload
      state.newPlayerId = null
    },
    createPlayerSuccess(state, action) {
      state.isLoading = false
      state.isCreatePlayerSuccess = action.payload.message
      state.newPlayerId = action.payload.data.id
      state.isUnverifiedUser =
        action.payload.data.playerstatusid.playerstatusname === 'Unverified'
    },
    createPlayerFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isCreatePlayerError =
        action.payload.response.data.message || 'Something went wrong'
      state.playerData = {
        artistname: '',
        dateofbirth: '',
        email: '',
        givenname: '',
        nationality: '',
        surname: '',
        mobilenumber: '',
        transfermarktlink: '',
      }
    },
    resetCreatePlayerError(state) {
      state.isCreatePlayerError = ''
    },
    reCreatePlayer(state, action) {
      state.isLoading = true
      state.pictureUploadLoader = true
      state.isCreatePlayerError = ''
      state.playerData = action.payload
      state.newPlayerId = null
    },
    reCreatePlayerSuccess(state, action) {
      state.isLoading = false
      state.pictureUploadLoader = false
      state.isCreatePlayerSuccess = action.payload.message
      state.newPlayerId = action.payload.data.id
      state.isUnverifiedUser =
        action.payload.data.playerstatusid.playerstatusname === 'Unverified'
    },
    reCreatePlayerFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.pictureUploadLoader = false
      state.isCreatePlayerError =
        action.payload.response.data.message || 'Something went wrong'
      state.playerData = {
        artistname: '',
        dateofbirth: '',
        email: '',
        givenname: '',
        nationality: '',
        surname: '',
        mobilenumber: '',
        transfermarktlink: '',
      }
    },
    getPlayerData(state, action) {
      if (action?.payload?.isReloading === false) {
        state.isLoadingPlayerList = true
        state.isVerifyingWhatsapp = true
      }
      if (action?.payload?.afterWhatsApp === true) {
        state.isVerifyingWhatsapp = true
      }
      if (action?.payload?.isInstaLoading === true) {
        state.isInstaProfileLoading = true
      }
      state.isGetPlayerSuccess = ''
      state.isGetPlayerError = ''
      // state.allPlayersData = []
      state.defaultLoader = true
    },
    getPlayerDataSuccess(state, action) {
      console.log('GPDS', action)
      state.defaultLoader = false
      state.isGetPlayerSuccess = action.payload.message
      state.allPlayersData = action.payload.data
      state.isUnverifiedUser =
        action.payload.data[0]?.playerstatusid?.playerstatusname ===
        'Unverified'
      localStorage.setItem(
        'playercontract',
        state.allPlayersData[0]?.playercontract,
      )
      state.isLoadingPlayerList = false
      state.isVerifyingWhatsapp = false
      state.isInstaProfileLoading = false
      // if (state.allPlayersData.length === 1) {
      //   state.selectedPlayer = state.allPlayersData[0]
      // }
    },
    getPlayerDataFailure(state, action) {
      const { payload } = action
      state.defaultLoader = false
      state.isLoadingPlayerList = false
      state.isVerifyingWhatsapp = false
      state.isInstaProfileLoading = false
      state.isGetPlayerError = 'Something went wrong' //action.payload.response.data.message
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    getPlayerDataInit(state) {
      state.isGetPlayerSuccess = ''
      state.isGetPlayerError = ''
    },
    checkPlayerStatus(state) {
      state.isLoadingCheckStatus = true
      state.isCheckPlayerStatusError = ''
    },
    checkPlayerStatusSuccess(state, action) {
      state.isLoadingCheckStatus = false
      state.isCheckPlayerStatusSuccess = action?.payload?.message
      state.allPlayersDataCheckStatus = action?.payload?.data
      state.allFanPlayersDataCheckStatus = action?.payload?.claimFanClubPlayer
    },
    checkPlayerStatusFailure(state, action) {
      state.isLoadingCheckStatus = false
      state.isCheckPlayerStatusError = 'Something went wrong'
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    //----------- getAgents
    getAddedAgents(state, action) {
      state.isLoading = true
      state.isGetAgentsError = ''
      // state.allPlayersData = []
    },
    getAddedAgentsSuccess(state, action) {
      state.isLoading = false
      state.isGetAgentsSuccess = action.payload.message
      state.allAgentsData = action.payload.data.agent_data
      state.selectedAgent = state.allPlayersData[0]
    },
    getAddedAgentsFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isGetAgentsError = action.payload.response.data.message
    },
    resetPlayerCoinData(state) {
      state.isLoading = false
      state.isGetPlayerError = ''
      state.isGetPlayerSuccess = ''
      state.allPlayersData = []
    },
    getAllPlayers(state) {
      state.isLoading = true
      state.isGetAllPlayerError = ''
      state.allPlayersList = []
      // state.totalPlayersCount = ''
      state.nextPlayerListUrl = ''
      state.previousPlayerListUrl = ''
    },
    getAllPlayersSuccess(state, action) {
      state.isLoading = false
      state.totalPlayersCount = action.payload.count
      state.nextPlayerListUrl = action.payload.next
      state.previousPlayerListUrl = action.payload.previous
      state.isGetPlayerSuccess = action.payload.message
      state.allPlayersList = action.payload.results
    },
    getAllPlayersFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.totalPlayersCount = 0
      state.isGetAllPlayerError = action.payload.response.data.detail
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    launchPlayerCoin(state) {
      state.isLaunching = true
      state.isLaunchPlayerCoinError = ''
      state.isLaunchPlayerCoinSuccess = ''
    },
    launchPlayerCoinSuccess(state, action) {
      state.isLaunching = false
      state.isLaunchPlayerCoinError = ''
      state.isLaunchPlayerCoinSuccess = 'success'
    },
    launchPlayerCoinFailure(state, action) {
      const { payload } = action
      state.isLaunching = false
      state.isLaunchPlayerCoinError = 'Launching Member Token failed'
      state.isLaunchPlayerCoinSuccess = ''
    },
    resetCoinLaunch(state) {
      state.isLaunching = false
      state.isLaunchPlayerCoinError = ''
      state.isLaunchPlayerCoinSuccess = ''
    },
    fetchAllPlayers(state, action) {
      state.isLoading = true
      state.isFetchAllPlayerError = ''
      state.playersTableData = []
      // state.totalPlayersCount = ''
      state.previousPlayerListUrl = ''
    },
    fetchListPlayers(state, action) {
      state.isLoading = true
      state.isFetchListPlayerSuccess = ''
      state.isFetchListPlayerError = ''
      state.playersListData = []
      // state.totalPlayersCount = ''
      state.previousPlayerListUrl = ''
      state.isLoadingList = true
    },
    fetchListPlayersAll(state, action) {
      state.isLoading = true
      state.isFetchListPlayerSuccess = ''
      state.isFetchListPlayerError = ''
      state.playersListData = []
      state.previousPlayerListUrl = ''
      state.isLoadingList = true
    },
    fetchListPlayersSuccess(state, action) {
      state.isLoading = false
      state.totalPlayersCount = action.payload.count
      state.nextPlayerListUrl = action.payload.next
      if (action.payload.results.length < 10) {
        state.nextPlayerListUrl = null
      }
      state.previousPlayerListUrl = action.payload.previous
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      state.playersListData = action.payload.results
      // state.playersListData = action.payload.results.splice(1, 2)

      state.isLoadingList = false
      if (state.playersListData.length === 0) {
        state.isFetchListPlayerError = 'No data found'
      }
    },
    fetchListPlayersFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.totalPlayersCount = 0
      state.isFetchListPlayerError =
        action.payload.response.data.detail ?? 'Error'
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
      state.isLoadingList = false
    },
    searchTickerPlayers(state, action) {
      state.isLoadingTP = true
      state.isFetchListPlayerSuccessTP = ''
      state.isFetchListPlayerErrorTP = ''
      state.playersListDataTP = []
      state.previousPlayerListUrlTP = ''
      state.isLoadingListTP = true
    },
    searchTickerPlayersSuccess(state, action) {
      state.isLoadingTP = false
      state.totalPlayersCountTP = action.payload.count
      state.nextPlayerListUrlTP = action.payload.next
      state.previousPlayerListUrlTP = action.payload.previous
      state.isFetchListPlayerSuccessTP = 'players fetched successfully' //action.payload.message
      state.playersListDataTP = action.payload.results
      state.isLoadingListTP = false
      if (state.playersListDataTP.length === 0) {
        state.isFetchListPlayerErrorTP = 'No data found'
      }
    },
    searchTickerPlayersFailure(state, action) {
      console.log({ action })
      const { payload } = action
      state.isLoadingTP = false
      state.totalPlayersCountTP = 0
      state.isFetchListPlayerErrorTP =
        action?.payload?.response?.data?.detail ?? 'Error'
      if (
        action?.payload?.response?.status === '403' ||
        action?.payload?.response?.status === 403
      ) {
        state.tokenExpiredTP = true
      }
      state.isLoadingListTP = false
    },
    resetAllPlayers(state) {
      state.playersTableData = []
    },
    fetchTickerBanner(state, action) {
      state.isLoading = true
      state.isFetchAllPlayerError = ''
      state.playersBannerData = []
      // state.totalPlayersCount = ''
      state.previousPlayerListUrl = ''
    },
    fetchDraftPlayers(state, action) {
      state.isLoading = true
      state.isFetchAllPlayerError = ''
      state.playersDraftsData = []
      // state.totalPlayersCount = ''
      state.previousPlayerListUrl = ''
    },
    fetch(state, action) {
      state.isLoading = true
      state.isFetchAllPlayerError = ''
      state.playersTableData = []
      // state.totalPlayersCount = ''
      state.previousPlayerListUrl = ''
    },
    fetchAllPlayersSuccess(state, action) {
      state.isLoading = false
      state.totalPlayersCount = action.payload.count
      state.nextPlayerListUrl = action.payload.next
      state.previousPlayerListUrl = action.payload.previous
      state.isFetchPlayerSuccess = action.payload.message
      state.playersTableData = action.payload.results
    },
    fetchAllPlayersFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.totalPlayersCount = 0
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchTickerBannerSuccess(state, action) {
      state.isLoading = false
      state.totalPlayersCount = action.payload.count
      state.nextPlayerListUrl = action.payload.next
      state.previousPlayerListUrl = action.payload.previous
      state.isFetchPlayerSuccess = action.payload.message
      state.playersBannerData = action.payload.results
      // state.playersBannerData = action.payload.results.splice(0, 1)
    },
    fetchTickerBannerFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.totalPlayersCount = 0
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchDraftPlayersSuccess(state, action) {
      state.isLoading = false
      state.totalPlayersCount = action.payload.count
      state.nextPlayerListUrl = action.payload.next
      state.previousPlayerListUrl = action.payload.previous
      state.isFetchPlayerSuccess = action.payload.message
      state.playersDraftsData = action.payload.results
    },
    fetchDraftPlayersFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.totalPlayersCount = 0
      state.isFetchListPlayerError = action.payload.response.data.detail
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchMostDraftPlayers(state, action) {
      state.isLoading = true
      state.playersMostDraftsData = []
    },
    fetchMostDraftPlayersSuccess(state, action) {
      state.isLoading = false
      state.playersMostDraftsData = action.payload.results
    },
    fetchMostDraftPlayersFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchVersusPlayers(state, action) {
      state.isLoading = true
      state.playersVersusData = []
    },
    fetchVersusPlayersSuccess(state, action) {
      state.isLoading = false
      state.playersVersusData = action.payload.results
    },
    fetchVersusPlayersFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      if (
        action?.payload?.response?.status === '403' ||
        action?.payload?.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    updatePlayerProfile(state, action) {
      state.isLoading = true
      state.isInstaProfileLoading = true
      state.isUpdatePlayerProfileError = ''
    },
    updatePlayerProfileSuccess(state, action) {
      state.isLoading = false
      state.isInstaProfileLoading = false
      state.isUpdatePlayerProfileSuccess = action.payload.message
    },
    resetPlayerProfileMessage(state) {
      state.isUpdatePlayerProfileSuccess = ''
    },
    updatePlayerProfileFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isInstaProfileLoading = false
      state.isUpdatePlayerProfileError = 'Some error occured'
    },
    resetPlayerData(state) {
      state.signoutPressed = Math.random() * 10
      state.allPlayersData = []
      state.selectedPlayer = null
      state.isLoading = false
      state.isGetPlayerError = ''
      state.isGetPlayerSuccess = ''
      state.isCreatePlayerError = ''
      ;(state.isCreatePlayerSuccess = ''),
        (state.isUpdatePlayerProfileError = ''),
        (state.isUpdatePlayerProfileSuccess = ''),
        (state.playerData = {
          artistname: '',
          dateofbirth: '',
          email: '',
          givenname: '',
          nationality: '',
          surname: '',
          mobilenumber: '',
          transfermarktlink: '',
        })
    },
    getPlayerDetails(state, action) {
      state.isLoading = true
      state.playerKioskData = []
      state.getDetailsLoading = true
      state.getPlayerDetailsErrorMsg = ''
      state.getPlayerDetailsSuccessData = null
    },
    getPlayerDetailsSuccess(state, action) {
      state.isLoading = false
      state.getDetailsLoading = false
      state.getPlayerDetailsSuccessData = action.payload.data[0]
      state.cardPlayerDetailsSuccessData = action.payload.data[0]
    },
    getTourPlayerDetails(state) {
      state.isLoading = false
      state.getDetailsLoading = false
      state.getPlayerDetailsSuccessData = DummyPlayer
      state.cardPlayerDetailsSuccessData = DummyPlayer
    },
    getDefaultMatic(state) {
      state.fetchingDefaultMaticLoading = true
    },
    getDefaultMaticSuccess(state, action) {
      state.fetchingDefaultMaticLoading = false
      state.purchaseFormDefaultMatic = action.payload.data[0]?.matic
    },
    getDefaultMaticError(state) {
      state.fetchingDefaultMaticLoading = false
      state.purchaseFormDefaultMatic = ''
    },
    getPlayerDetailsImplicit(state, action) {
      console.log('')
    },
    getPlayerDetailsImplicitSuccess(state, action) {
      state.getPlayerDetailsImplicitSuccessData = action.payload.data[0]
    },
    resetPlayerDetails(state) {
      state.isLoading = false
      state.getDetailsLoading = false
      state.getPlayerDetailsSuccessData = null
      state.getPlayerDetailsErrorMsg = ''
      state.nftsData = []
    },
    getPlayerDetailsError(state, action) {
      state.isLoading = false
      state.getPlayerDetailsErrorMsg =
        action?.payload?.response?.data?.detail || 'Error Occured'
    },
    getPlayerDetailsReset(state) {
      state.getPlayerDetailsSuccessData = null
    },
    setGoLive(state) {
      if (state.allPlayersData.length > 0) {
        const temp = state.allPlayersData[0]
        temp.playerstatusid = { id: 4, playerstatusname: 'Subscription' }
        state.tempAlteration = true
        // allPlayersData[0] = temp
        state.allPlayersData = [temp]
      }
    },
    setDeployed(state) {
      if (state.allPlayersData.length > 0) {
        const temp = state.allPlayersData[0]
        temp.playerstatusid = { id: 3, playerstatusname: 'Deployed' }
        // allPlayersData[0] = temp
        state.tempAlteration = true
        state.allPlayersData = [temp]
      }
    },
    //---------------------------------------- get player contract ----------------------------------------//

    getPlayer1Contract(state, action) {
      state.isGetPlayer1ContractSuccess = false
      state.isGetPlayer1ContractError = false
      state.player1contractPlayer = action?.payload?.url
      state.sharetype = null
    },
    getPlayer1ContractSuccess(state, action) {
      console.log({ action })
      state.isGetPlayer1ContractSuccess = true
      state.player1contract = action.payload.data.playercontract
      state.player1contractabi = action.payload.data.playercontractabi
      state.stakingcontract = action.payload.data.stakingcontract
      state.stakingcontractabi = action.payload.data.stakingcontractabi
      state.nftcontract = action.payload.data.nftcontract
      state.nftcontractabi = action.payload.data.nftcontractabi
      state.routerabi = action.payload.data.router_abi
      state.routerContract = action.payload.data.router_contract
      state.wmatic = action.payload.data.wmatic_contract
      state.listingOn = action.payload.data.exlistingon
      state.paymentOptionsSell = action.payload.data.payment_options
      state.proxyContract = action.payload.data.proxy_contract_coins
      state.proxyContractAbi = action.payload.data.proxy_contract_coins_abi
      state.sharetype = action.payload.data.sharetype
      state.centralNftContract = action?.payload?.data?.centralnftcontract
      state.centralNftContractAbi = action?.payload?.data?.centralnftcontractabi
      state.centralContract = action?.payload?.data?.centralcontract
      state.centralContractAbi = action?.payload?.data?.centralcontractabi
    },
    getPlayer1ContractFailure(state, action) {
      state.isGetPlayer1ContractError = true
    },

    getPlayerCoinContract(state, action) {
      state.isGetPlayerCoinContractSuccess = false
      state.isGetPlayerCoinContractError = false
      state.sharetype = null
    },
    getPlayerCoinContractSuccess(state, action) {
      state.isGetPlayerCoinContractSuccess = true
      state.playerCoinContract = action.payload.data.playercontract
      state.playerCoinContractabi = action.payload.data.playercontractabi
      state.playerCoinStakingContract = action.payload.data.stakingcontract
      state.playerCoinStakingContractAbi =
        action.payload.data.stakingcontractabi
      state.playerCoinNftcontract = action.payload.data.nftcontract
      state.playerCoinNftcontractabi = action.payload.data.nftcontractabi
      state.playerCoinRouterabi = action.payload.data.router_abi
      state.playerCoinRouterContract = action.payload.data.router_contract
      state.playerCoinWmatic = action.payload.data.wmatic_contract
      state.playerCoinListingOn = action.payload.data.exlistingon
      state.playerCoinPaymentOptionsSell = action.payload.data.payment_options
      state.playerCoinProxyContract = action.payload.data.proxy_contract_coins
      state.playerCoinProxyContractAbi =
        action.payload.data.proxy_contract_coins_abi
      state.sharetype = action.payload.data.sharetype
      state.centralNftContract = action?.payload?.data?.centralnftcontract
      state.centralNftContractAbi = action?.payload?.data?.centralnftcontractabi
      state.centralContract = action?.payload?.data?.centralcontract
      state.centralContractAbi = action?.payload?.data?.centralcontractabi
    },
    getPlayerCoinContractFailure(state, action) {
      state.isGetPlayerCoinContractError = true
    },
    clearPlayer1ContractSuccess(state) {
      state.isGetPlayer1ContractSuccess = false
    },
    getPurchaseContract(state, action) {
      state.purchaseContractLoading = true
    },
    getPurchaseContractSuccess(state, action) {
      state.paymentOptionsPurchase = action.payload.data.payment_options
      state.purchaseContractLoading = false
    },
    getPurchaseContractFailure(state, action) {
      state.isGetPlayer1ContractError = action.payload.message
      state.paymentOptionsPurchase = []
      state.purchaseContractLoading = false
    },

    resetPlayer1Contract(state) {
      state.isGetPlayer1ContractSuccess = false
      state.isGetPlayer1ContractError = false
      state.player1contract = ''
      state.player1contractabi = null
      state.stakingcontract = null
      state.stakingcontractabi = null
      state.nftcontract = null
      state.nftcontractabi = null
    },
    getPlayer2Contract(state, action) {
      state.isGetPlayer2ContractLoading = true
      state.isGetPlayer2ContractSuccess = false
      state.isGetPlayer2ContractError = false
      state.buyFormPlayerContract = ''
      state.buyFormPlayer2contractabi = ''
      state.sharetype = null
    },
    getPlayer2ContractSuccess(state, action) {
      console.log('fetchedPays', action.payload.data.payment_options)
      state.isGetPlayer2ContractLoading = false
      state.isGetPlayer2ContractSuccess = true
      state.player2contract = action.payload.data.playercontract
      state.player2contractabi = action.payload.data.playercontractabi
      state.staking2contract = action.payload.data.stakingcontract
      state.staking2contractabi = action.payload.data.stakingcontractabi
      // needed for updated payment options
      state.routerabi = action.payload.data.router_abi
      state.routerContract = action.payload.data.router_contract
      state.wmatic = action.payload.data.wmatic_contract
      state.listingOn = action.payload.data.exlistingon
      state.paymentOptions = action.payload.data.payment_options
      state.proxyContract = action.payload.data.proxy_contract_coins
      state.proxyContractAbi = action.payload.data.proxy_contract_coins_abi
      state.sharetype = action.payload.data.sharetype
      state.centralNftContract = action?.payload?.data?.centralnftcontract
      state.centralNftContractAbi = action?.payload?.data?.centralnftcontractabi
      state.centralContract = action?.payload?.data?.centralcontract
      state.centralContractAbi = action?.payload?.data?.centralcontractabi
      state.buyFormPlayerContract = action.payload.data.playercontract
      state.buyFormPlayer2contractabi = action.payload.data.playercontractabi
    },
    getPlayer2ContractFailure(state, action) {
      state.isGetPlayer2ContractLoading = false
      state.isGetPlayer2ContractError = true
      state.buyFormPlayerContract = ''
      state.buyFormPlayer2contractabi = ''
    },
    getPlayer2ContractReset(state) {
      state.isGetPlayer2ContractSuccess = ''
      state.isGetPlayer2ContractError = ''
    },
    resetBuyformPlayerContract(state) {
      state.buyFormPlayerContract = ''
      state.buyFormPlayer2contractabi = ''
    },
    // fetchDraftNewPlayers()
    fetchDraftNewPlayers(state, action) {
      // state.fetchDraftPlayersLoading = true
      // state.deployedPlayersList = ''
      state.isDraftPlayersLoading = true
      state.fetchDraftNewPlayersError = ''
    },
    fetchDraftNewPlayersSuccess(state, action) {
      // state.fetchDraftPlayersLoading = false
      try {
        const temp = action.payload.results
        const filteredResults = temp.filter(
          item => item.id !== state.selectedPlayer.id,
        )
        state.deployedPlayersList = filteredResults
      } catch (error) {
        state.deployedPlayersList = action.payload.results
      }
      // state.deployedPlayersList = action.payload.results
      state.isDraftPlayersLoading = false
      state.fetchDraftNewPlayersError = ''
      state.totalDeployedPlayersCount = action.payload.count
      state.nextDeployedPlayerListUrl = action.payload.next
      state.previousDeployedPlayerListUrl = action.payload.previous
      state.isFetchDeployedPlayerSuccess = 'players fetched successfully' //action.payload.message
    },
    fetchDraftNewPlayersError(state, action) {
      state.deployedPlayersList = []
      state.isDraftPlayersLoading = false
      // state.fetchDraftPlayersLoading = false
      state.fetchDraftNewPlayersError = 'error'
    },
    setShowNewDraftPopupRedux(state, action) {
      state.showNewDraftPopupRedux = action?.payload?.showNewDraftPopupRedux
      state.showFanClubList = action?.payload?.showFanClubList
    },
    setSearchFieldRedux(state, action) {
      state.searchField = action?.payload?.searchField
    },
    setPlayerIdRedux(state, action) {
      state.playerId = action?.payload?.playerId
    },
    resetDraftNewPlayers(state) {
      state.isGetPlayer2ContractSuccess = ''
      state.fetchDraftNewPlayersError = ''
      state.isFetchDeployedPlayerSuccess = ''
      state.deployedPlayersList = ''
    },
    getPlayerDrafts(state, action) {
      state.isLoading = true
      state.isGetPlayerDraftsSuccess = false
      state.isGetPlayerDraftsError = false
    },
    getPlayerDraftsSuccess(state, action) {
      state.isLoading = false
      state.isGetPlayerDraftsSuccess = true
      state.getPlayerDraftsData = action.payload.data
    },
    getPlayerDraftsFailure(state, action) {
      state.isLoading = false
      state.isGetPlayerDraftsError = true
    },
    initPlayer1ContractStatus(state) {
      state.isGetPlayer1ContractSuccess = false
      state.isGetPlayer1ContractError = false
    },
    fetchPlayersBalance(state, action) {
      state.fetchBalancePlayersData = ''
      state.fetchBalancePlayersProgress = true
      state.fetchBalancePlayersError = ''
      state.fetchBalancePlayersSuccess = false
    },
    fetchPlayersBalanceSuccess(state, action) {
      let respTemp = { ...action.payload.data }
      state.fetchBalancePlayersProgress = false
      state.fetchBalancePlayersError = false
      state.fetchBalancePlayersSuccess = true
      if (state.isStakingOnlySelected) {
        const stakedCoins = respTemp.token.filter(
          coin => coin.stakingbalance && coin.stakingbalance > 0,
        )
        const filteredData = { ...respTemp, token: stakedCoins }
        state.fetchBalancePlayersData = filteredData
      } else {
        state.fetchBalancePlayersData = respTemp
      }
    },
    fetchPlayersBalanceError(state, action) {
      console.log('FPBE--', { action })
      state.fetchBalancePlayersProgress = false
      state.fetchBalancePlayersSuccess = false
      state.fetchBalancePlayersError = true
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    resetPlayersBalance(state) {
      state.fetchBalancePlayersData = ''
    },
    toggleStakingCoins(state, action) {
      state.isStakingOnlySelected = action.payload
    },
    storeActiveTabBeforeLeaving(state, action) {
      state.playerCoinActiveTab = action.payload.activeTab
    },
    persistDrafteePlayer(state, action) {
      state.drafteePlayerUrl = action.payload.playerUrl
    },
    persistDraftAction(state, action) {
      state.drafteePlayerName = action.payload.playerName
      state.drafteePlayerAddress = action.payload.playerAddress
      state.draftAction = action.payload.draftAction
      state.draftPersist = action.payload
    },
    getPlayerSelection(state) {
      state.isGetPlayerSelectionSuccess = false
      state.isGetPlayerSelectionError = false
      state.isGetPlayerSelectionCalled = true
    },
    getPlayerSelectionSuccess(state, action) {
      state.isGetPlayerSelectionSuccess = true
      state.playerList = action.payload.data.player
    },
    getPlayerSelectionFailure(state, action) {
      state.isGetPlayerSelectionError = true
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    getPlayerSelectionDone(state) {
      state.isGetPlayerSelectionSuccess = false
    },
    resetPlayerSelection(state) {
      state.isGetPlayerSelectionCalled = false
    },
    getSelectedPlayer(state, action) {
      state.isLoading = true
      state.isGetSelectedPlayerSuccess = false
      state.isGetSelectedPlayerFailure = false
      state.isGetPlayerSelectionSuccess = false
    },
    getSelectedPlayerSuccess(state, action) {
      console.log({ action })
      state.isLoading = false
      state.isGetSelectedPlayerSuccess = true
      state.selectedPlayer = action.payload.data[0]
    },
    getSelectedPlayerFailure(state, action) {
      state.isLoading = false
      state.isGetSelectedPlayerFailure = true
    },
    getSelectedPlayerDone(state) {
      state.isGetSelectedPlayerSuccess = false
    },
    setDefaultSelectedPlayer(state) {
      state.selectedPlayer = state.allPlayersData[0]
    },
    getVoteList(state, action) {
      state.isLoading = true
      state.isGetVoteListSuccess = false
      state.isGetVoteListError = false
    },
    getVoteListSuccess(state, action) {
      state.isLoading = false
      state.isGetVoteListSuccess = true
      state.voteList = action.payload.data.results
    },
    getVoteListFailure(state, action) {
      state.isLoading = false
      state.isGetVoteListError = true
      if (
        action.payload?.response?.status === '403' ||
        action.payload?.response?.status === 403
      ) {
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    getOpenVoteListInit(state) {
      state.isGetOpenVoteListSuccess = false
      state.isGetOpenVoteListError = false
      state.openVoteList = []
    },
    getOpenVoteList(state, action) {
      state.isLoading = true
      state.isGetOpenVoteListSuccess = false
      state.isGetOpenVoteListError = false
    },
    getOpenVoteListSuccess(state, action) {
      state.isLoading = false
      state.openVoteList = action.payload.data.open_vote_list
      state.isGetOpenVoteListSuccess = true
    },
    getOpenVoteListFailure(state, action) {
      state.isLoading = false
      state.isGetOpenVoteListError = true
      if (
        action.payload?.response?.status === '403' ||
        action.payload?.response?.status === 403
      ) {
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    getVoteInfo(state, action) {
      // state.isLoading = true
      state.isGetVoteInfoSuccess = false
      state.isGetVoteInfoError = false
    },
    getVoteInfoSuccess(state, action) {
      // state.isLoading = false
      state.isGetVoteInfoSuccess = true
      state.voteInfo = action.payload.data.detail_vote_list
    },
    getVoteInfoFailure(state, action) {
      // state.isLoading = false
      state.isGetVoteInfoError = true
    },
    clearLoadedStakingStatus(state) {
      state.loadedStakingStatus = false
    },
    getStakingStatus(state, action) {
      state.stakingStatus = false
      state.loadedStakingStatus = false
    },
    getStakingStatusSuccess(state, action) {
      state.stakingStatus = action.payload.data.staking_status
      state.loadedStakingStatus = true
    },
    getStakingStatusFailure(state, action) {
      state.loadedStakingStatus = true
    },
    // getCoinList(state, action) {
    //   state.isLoadingCoins = true
    //   state.isGetCoinsError = false
    // },
    // getCoinListSuccess(state, action) {
    //   state.isLoadingCoins = false
    //   state.isGetCoinsSuccess = 'success'
    //   state.getCoinsData = action.payload.data
    // },
    // getCoinListFailure(state, action) {
    //   state.isLoadingCoins = false
    //   state.isGetCoinsError = 'error occured'
    // },
    getCoinList(state, action) {
      state.isLoadingCoins = true
      state.isGetCoinsError = ''
      state.getCoinsData = []
      state.coinMatics = ''
      // state.totalPlayersCount = ''
      state.nextCoinListUrl = ''
      state.previousCoinListUrl = ''
    },
    getCoinListSuccess(state, action) {
      state.isLoadingCoins = false
      state.totalCoinsCount = action.payload.data.count
      state.nextCoinListUrl = action.payload.data.next
      state.previousCoinListUrl = action.payload.data.previous
      state.isGetCoinsSuccess = 'success' //action.payload.data.message
      state.getCoinsData = action.payload.data.results.coin_holders
      state.coinMatics = action.payload.data.results.matic
    },
    getCoinListFailure(state, action) {
      const { payload } = action
      state.isLoadingCoins = false
      state.totalCoinsCount = 0
      state.isGetCoinsError = action.payload.response.data.detail
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchFeaturedNfts(state) {
      state.isLoading = true
      state.featuredNftsData = []
    },
    fetchFeaturedNftsSuccess(state, action) {
      state.isLoading = false
      state.featuredNftsData = action.payload.data.results
    },
    fetchFeaturedNftsFailure(state, action) {
      state.isLoading = false
    },
    getNftsData(state, action) {
      state.isLoadingNfts = true
      state.isGetNftsDataSuccess = false
      state.isGetNftsDataError = false
    },
    getNftsDataSuccess(state, action) {
      state.isLoadingNfts = false
      state.isGetNftsDataSuccess = true
      state.nftsData = action.payload.data.results
      state.totalNftsCount = action.payload.data.count
      state.nextNftsListUrl = action.payload.data.next
      state.previousNftsListUrl = action.payload.data.previous
    },
    getNftsDataFailure(state, action) {
      state.isLoadingNfts = false
      state.isGetNftsDataError = true
      state.nftsData = []
    },
    getPreviewNftsData(state, action) {
      state.isLoadingNfts = true
      state.isGetPreviewNftsDataSuccess = false
      state.isGetPreviewNftsDataError = false
    },
    getPreviewNftsDataSuccess(state, action) {
      state.isLoadingNfts = false
      state.isGetPreviewNftsDataSuccess = true
      state.previewNftsData = action.payload.data.results
    },
    getPreviewNftsDataFailure(state, action) {
      state.isLoadingNfts = false
      state.isGetPreviewNftsDataError = true
      state.previewNftsData = []
    },
    getMyCoinNftsData(state, action) {
      state.isLoadingNfts = true
      state.isGetMyCoinNftsDataSuccess = false
      state.isGetMyCoinNftsDataError = false
    },
    getMyCoinNftsDataSuccess(state, action) {
      state.isLoadingNfts = false
      state.isGetMyCoinNftsDataSuccess = true
      state.mycoinNftsData = action.payload.data.results
    },
    getMyCoinNftsDataFailure(state, action) {
      state.isLoadingNfts = false
      state.isGetMyCoinNftsDataError = true
      state.mycoinNftsData = []
    },
    getNftsBalance(state, action) {
      state.isGetEANftsBalanceSuccess = false
      state.isLoadingNfts = true
      state.isGetNftsBalanceSuccess = false
      state.isGetNftsBalanceError = false
    },
    getNftsBalanceSuccess(state, action) {
      state.isLoadingNfts = false
      state.isGetNftsBalanceSuccess = true
      state.nftsBalance = action.payload.data
    },
    getNftsBalanceFailure(state, action) {
      state.isLoadingNfts = false
      state.isGetNftsBalanceError = true
      state.nftsBalance = []
    },
    getEANftsBalance(state, action) {
      state.isLoadingNfts = true
      state.isGetEANftsBalanceSuccess = false
      state.isGetEANftsBalanceError = false
    },
    getEANftsBalanceSuccess(state, action) {
      state.isLoadingNfts = false
      state.isGetEANftsBalanceSuccess = true
      // state.eaNftsBalance = action.payload.data
      state.nftsBalance = action.payload.data
    },
    getEANftsBalanceFailure(state, action) {
      state.isLoadingNfts = false
      state.isGetEANftsBalanceError = true
      state.isGetEANftsBalanceSuccess = false
      // state.eaNftsBalance = []
      state.nftsBalance = []
    },
    resetIsGetEANftsBalanceSuccess(state, action) {
      state.isGetEANftsBalanceSuccess = false
    },
    getAllNftsData(state, action) {
      state.isLoadingNfts = true
      state.isGetAllNftsDataSuccess = false
      state.isGetAllNftsDataError = false
      state.allNftsData = []
    },
    getAllNftsDataSuccess(state, action) {
      state.isLoadingNfts = false
      state.isGetAllNftsDataSuccess = true
      state.allNftsData = action.payload.data.results
      state.totalNftsCount = action.payload.data.count
      state.nextNftsListUrl = action.payload.data.next
      state.previousNftsListUrl = action.payload.data.previous
    },
    getAllNftsDataFailure(state, action) {
      state.isLoadingNfts = false
      state.isGetAllNftsDataError = true
      state.allNftsData = []
    },
    resetAllNfts(state) {
      state.allNftsData = []
    },
    getAllKioskData(state, action) {
      state.isLoadingKiosk = true
      state.isGetAllKioskDataSuccess = false
      state.isGetAllKioskDataError = false
      state.allKioskData = []
    },
    getAllKioskDataSuccess(state, action) {
      state.isLoadingKiosk = false
      state.isGetAllKioskDataSuccess = true
      state.allKioskData = action.payload.results
      state.totalKioskCount = action.payload.count
      state.nextKioskListUrl = action.payload.next
    },
    getAllKioskDataFailure(state, action) {
      state.isLoadingKiosk = false
      state.isGetAllKioskDataError = true
      state.allKioskData = []
    },
    getPlayerKioskData(state, action) {
      state.playerKioskData = []
      state.isLoadingKiosk = true
      state.isGetPlayerKioskDataSuccess = false
      state.isGetPlayerKioskDataError = false
    },
    getPlayerKioskDataSuccess(state, action) {
      state.isLoadingKiosk = false
      state.isGetPlayerKioskDataSuccess = true
      state.playerKioskData = action.payload.results
    },
    getPlayerKioskDataFailure(state, action) {
      state.isLoadingKiosk = false
      state.isGetPlayerKioskDataError = true
      state.playerKioskData = []
    },
    getLandingKioskData(state) {
      state.isLoadingKiosk = true
      state.isGetLandingKioskDataSuccess = false
      state.isGetLandingKioskDataError = false
      state.landingKioskData = []
    },
    getLandingKioskDataSuccess(state, action) {
      state.isLoadingKiosk = false
      state.isGetLandingKioskDataSuccess = true
      state.landingKioskData = action.payload.results
    },
    getLandingKioskDataFailure(state, action) {
      state.isLoadingKiosk = false
      state.isGetLandingKioskDataError = true
      state.landingKioskData = []
    },
    getTxnConfirm(state, action) {
      state.isTxnChecking = true
    },
    getSendMaticTxnConfirm(state, action) {
      state.isTxnChecking = true
      state.txnConfirmSuccess = false
    },
    getSendMaticTxnConfirmSuccess(state, action) {
      console.log('txpgsmtcs', action)
      state.isTxnChecking = false
      state.txnConfirmSuccess = action.payload.success
      // akshay_edit_to_fix_txn_confirm_ui_error_on_approve
      state.txnConfirmResp = action.payload.data
      state.txnConfirmErr = ''
    },
    getSendMaticTxnConfirmError(state, action) {
      state.isTxnChecking = false
    },
    resetSendMaticTxnConfirm(state) {
      state.txnHash = ''
      state.txnHashN = ''
      state.isTxnChecking = false
      state.txnConfirmSuccess = false
    },
    getTxnConfirmSuccess(state, action) {
      console.log('txP', { action })
      state.isTxnChecking = false
      state.txnConfirmResp = action.payload.data
      state.txnConfirmErr = ''
    },
    getTxnConfirmError(state, action) {
      state.isTxnChecking = false
      state.txnConfirmErr = 'Failure'
    },
    setTxnConfirmSuccess(state, action) {
      console.log('txP', { action })
      state.isTxnChecking = false
      state.txnConfirmResp = [{ haserror: action.payload === 1 ? 0 : 1 }]
      state.txnConfirmErr = ''
    },
    setTxnConfirmError(state) {
      state.isTxnChecking = false
      state.txnConfirmErr = 'Failure'
    },
    resetTxnConfirmationData(state) {
      console.log('txpreset_txn_called')
      state.txnHash = ''
      state.txnHashN = ''
      state.isTxnChecking = false
      state.txnConfirmResp = []
      state.txnConfirmErr = ''
    },
    getBids(state, action) {
      state.isLoading = true
      state.isGetBidsSuccess = false
      state.isGetBidsError = false
    },
    getBidsSuccess(state, action) {
      state.isLoading = false
      state.isGetBidsSuccess = true
      state.bidList = action.payload.data.results
    },
    getBidsFailure(state, action) {
      state.isLoading = false
      state.isGetBidsError = true
      state.bidList = []
    },
    resetBids(state) {
      state.isGetBidsSuccess = false
      state.isGetBidsError = false
      state.bidList = []
    },
    getStakingReward(state, action) {
      state.isLoading = true
      state.isGetStakingRewardSuccess = false
      state.isGetStakingRewardError = false
    },
    getStakingRewardSuccess(state, action) {
      state.isLoading = false
      state.isGetStakingRewardSuccess = true
      state.reward = action.payload?.rewards ?? 0
    },
    getStakingRewardFailure(state, action) {
      state.isLoading = false
      state.isGetStakingRewardError = true
    },
    getStakingBalance(state, action) {
      state.isLoading = true
      state.isGetStakingBalanceSuccess = false
      state.isGetStakingBalanceError = false
    },
    getStakingBalanceSuccess(state, action) {
      state.isLoading = false
      state.isGetStakingBalanceSuccess = true
      state.stakingBalance =
        action.payload?.staking_balance[0]?.stakingbalance ?? 0
      state.maxbids = action.payload?.staking_balance[0]?.maxbids ?? 0
      state.isHighestBidder =
        action.payload?.staking_balance[0]?.isHighestBidder ?? false
    },
    getStakingBalanceFailure(state, action) {
      state.isLoading = false
      state.isGetStakingBalanceError = true
    },
    getDisplayPlayers(state, action) {
      state.isDisplayPlayersLoading = true
      state.isDisplayPlayersError = ''
      state.displayPlayersList = []
    },
    getDisplayPlayersSuccess(state, action) {
      state.isDisplayPlayersLoading = false
      state.isDisplayPlayersError = ''
      state.displayPlayersList = action.payload.results
      if (action.payload.results.length < 1) {
        state.isNoDisplayPlayers = true
      }
    },
    getDisplayPlayersFailure(state, action) {
      state.isDisplayPlayersLoading = false
      state.isDisplayPlayersError = 'unable_to_fetch_players'
      state.displayPlayersList = []
    },

    getDraftedByData(state, action) {
      state.isLoadingDraftedBy = true
      state.isGetDraftedByError = ''
      state.playerDraftedByData = []
      state.nextDraftedByUrl = ''
      state.previousDraftedByUrl = ''
    },
    getDraftedByDataSuccess(state, action) {
      state.isLoadingDraftedBy = false
      state.totalDraftedByCount = action.payload.count
      state.nextDraftedByUrl = action.payload.next
      state.previousDraftedByUrl = action.payload.previous
      state.isGetDraftedBySuccess = action.payload.message
      state.playerDraftedByData = action.payload.results
    },
    getDraftedByDataError(state, action) {
      state.isLoadingDraftedBy = false
      state.isGetDraftedByError = 'Something went wrong' //action.payload.response.data.message
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    getCurrentDraftsData(state, action) {
      state.isLoadingCurrentDrafts = true
      state.isGetCurrentDraftsError = ''
      state.isFetchCurrentDraftsError = ''
      state.playerCurrentDraftsData = ''
      state.nextCurrentDraftsUrl = ''
      state.previousCurrentDraftsUrl = ''
    },
    getCurrentDraftsDataSuccess(state, action) {
      state.isLoadingCurrentDrafts = false
      state.totalCurrentDraftsCount = action.payload.count
      state.nextCurrentDraftsUrl = action.payload.next
      state.previousCurrentDraftsUrl = action.payload.previous
      state.isGetCurrentDraftsSuccess = action.payload.message
      state.playerCurrentDraftsData = action.payload.results
    },
    getCurrentDraftsDataError(state, action) {
      state.isLoadingCurrentDrafts = false
      state.totalCurrentDraftsCount = 0
      state.isGetCurrentDraftsError = 'Something went wrong' //action.payload.response.data.message
      state.isFetchCurrentDraftsError = action.payload.response?.data.detail
      state.totalPlayersCount = 0
    },
    getAllDraftsData(state, action) {
      state.isLoadingAllDrafts = true
      state.isGetAllDraftsError = ''
      state.playerAllDraftsData = ''
    },
    getAllDraftsDataSuccess(state, action) {
      state.isLoadingAllDrafts = false
      state.isGetAllDraftsSuccess = action.payload.message
      state.playerAllDraftsData = action.payload.results
    },
    getAllDraftsDataError(state, action) {
      state.isLoadingAllDrafts = false
      state.isGetAllDraftsError = 'Something went wrong' //action.payload.response.data.message
      // if (
      //   action.payload.response.status === '403' ||
      //   action.payload.response.status === 403
      // ) {
      //   state.tokenExpired = true
      // }
    },
    getBlockdeadline(state, action) {
      state.isLoading = true
      state.isGetBlockdeadlineSuccess = false
      state.isGetBlockdeadlineError = false
    },
    getBlockdeadlineSuccess(state, action) {
      state.isLoading = false
      state.isGetBlockdeadlineSuccess = true
      state.blockdeadline = action.payload?.blockDeadline ?? 0
    },
    getBlockdeadlineFailure(state, action) {
      state.isLoading = false
      state.isGetBlockdeadlineError = true
    },
    resetBlockdeadline(state) {
      state.isGetBlockdeadlineSuccess = false
      state.isGetBlockdeadlineError = false
    },
    getCharts(state, action) {
      state.isLoading = true
      state.isGetChartsSuccess = false
      state.isGetChartsError = false
    },
    getChartsSuccess(state, action) {
      state.isLoading = false
      state.isGetChartsSuccess = true
      state.charts = action.payload?.data?.charts
      state.volume = action.payload?.data?.volume
    },
    getChartsFailure(state, action) {
      state.isLoading = false
      state.isGetChartsError = true
    },
    clearCharts(state) {
      state.charts = []
      state.volume = []
    },
    launchCoin(state, action) {
      state.goLiveBtnClicked = true
    },
    launchCoinSuccess(state, action) {
      // goLiveBtnClicked = false
    },
    launchCoinError(state, action) {
      state.goLiveBtnClicked = false
    },
    resetGoLive(state) {
      state.goLiveBtnClicked = false
    },
    createAuction(state, action) {
      console.log('')
    },
    createRaffle(state, action) {
      console.log('')
    },
    mintNft(state, action) {
      console.log('')
    },
    allowStaking(state, action) {
      console.log('')
    },
    staking(state, action) {
      console.log('')
    },
    unstaking(state, action) {
      console.log('')
    },
    claimReward(state, action) {
      console.log('')
    },
    goToPlayer(state, action) {
      state.playerUrl = action.payload.url
    },
    resetGoToPlayer(state) {
      state.playerUrl = ''
    },
    createVote(state, action) {
      console.log('')
    },
    vote(state, action) {
      console.log('')
    },
    closeVote(state, action) {
      console.log('')
    },
    buyTokens(state, action) {
      console.log('')
    },
    sellTokens(state, action) {
      console.log('')
    },
    addAdmin(state, action) {
      console.log('')
    },
    addAgent(state, action) {
      console.log('')
    },
    revokeAdmin(state, action) {
      console.log('')
    },
    createDraft(state, action) {
      console.log('')
    },
    acceptDraft(state, action) {
      console.log('')
    },
    deleteDraftee(state, action) {
      console.log('')
    },
    bidOnAuction(state, action) {
      console.log('')
    },
    playerTokenWithdraw(state, action) {
      console.log('')
    },
    nativeWithdraw(state, action) {
      console.log('')
    },
    closeAction(state, action) {
      console.log('')
    },
    drawWinner(state, action) {
      console.log('')
    },
    nftTransfer(state, action) {
      console.log('')
    },
    nftGenesisTransfer(state, action) {
      console.log('')
    },
    claimNft(state, action) {
      console.log('')
    },
    consumeNft(state, action) {
      console.log('')
    },
    claimXP(state, action) {
      console.log('')
    },
    enrollRaffle(state, action) {
      console.log('')
    },
    transferCoins(state, action) {
      console.log('')
    },
    claimPrize(state, action) {
      console.log('')
    },
    checkLaunchStatus(state, action) {
      state.isLoading = true
      state.isCheckLaunchStatusSuccess = false
      state.isCheckLaunchStatusError = false
      state.launchStatus = null
    },
    checkLaunchStatusSuccess(state, action) {
      state.isLoading = false
      state.isCheckLaunchStatusSuccess = true
      state.launchStatus = action.payload.data[0]
    },
    checkLaunchStatusFailure(state, action) {
      state.isLoading = false
      state.isCheckLaunchStatusError = true
    },
    savePlayerCustomisation(state, action) {
      state.isLoadingPlayerCustomisation = true
      state.isSavePlayerCustomisationSuccess = false
      state.isSavePlayerCustomisationError = false
    },
    savePlayerCustomisationSuccess(state, action) {
      state.isLoadingPlayerCustomisation = false
      state.isSavePlayerCustomisationSuccess = true
    },
    savePlayerCustomisationFailure(state, action) {
      state.isLoadingPlayerCustomisation = false
      state.isSavePlayerCustomisationError = true
    },
    savePlayerCustomisationInit(state) {
      state.isSavePlayerCustomisationSuccess = false
      state.isSavePlayerCustomisationError = false
    },
    resetWhatsappUnverified(state) {
      state.isUnverifiedUser = ''
    },
    savePlayercardjson(state, action) {
      state.playercardjson = action.payload
    },
    AddPayout(state, action) {
      state.isAddPayoutLoading = true
      state.isAddPayoutError = ''
      state.AddPayoutData = false
    },
    AddPayoutSuccess(state, action) {
      state.isAddPayoutLoading = false
      state.isAddPayoutError = ''
      state.AddPayoutData = action.payload.success
      state.txnHashN = action.payload.hash
    },
    AddPayoutFailure(state, action) {
      state.isAddPayoutLoading = false
      state.AddPayoutData = action.payload.response.data.success
      state.isAddPayoutError = action.payload.response.data.message
    },
    approveTradeCurrency(state, action) {
      state.approveLoading = true
      state.approvePaymentOptionSuccess = ''
      state.approvePaymentOptionFailure = ''
    },
    approveTradeCurrencySuccess(state, action) {
      state.approveLoading = false
      state.approvePaymentOptionSuccess = action.payload.success
      state.approvePaymentOptionFailure = ''
    },
    approveTradeCurrencyFailure(state, action) {
      state.approveLoading = false
      state.approvePaymentOptionSuccess = ''
      state.approvePaymentOptionFailure = action.payload.message
    },
    buyPlayerCoinsInCurrency(state, action) {
      state.buyInCurrencyLoading = true
      state.isBuyInCurrencyTransactionSuccess = ''
      state.buyInCurrencyTxnHash = ''
      state.buyInCurrencyTransactionError = ''
    },
    buyPlayerCoinsInCurrencySuccess(state, action) {
      state.buyInCurrencyLoading = false
      state.isBuyInCurrencyTransactionSuccess = action.payload.message
      state.buyInCurrencyTxnHash = action.payload?.hash
      state.buyInCurrencyTransactionError = ''
    },
    resetBuyTxnHash(state) {
      state.isBuyInCurrencyTransactionSuccess = ''
      state.buyInCurrencyTxnHash = ''
      state.buyInCurrencyTransactionError = ''
    },
    buyPlayerCoinsInCurrencyFailure(state, action) {
      const attempts = state.secretInputAttempts

      state.buyInCurrencyLoading = false
      state.isBuyInCurrencyTransactionSuccess = ''
      state.buyInCurrencyTxnHash = ''
      state.buyInCurrencyTransactionError = action.payload.response.data.message
      if (action.payload.response?.status === 500) {
        state.secretInputAttempts = attempts - 1
      }
    },
    sellPlayerCoinsInCurrency(state, action) {
      state.sellInCurrencyLoading = true
      state.sellInCurrencyTransactionSuccess = ''
      state.sellInCurrencyTxnHash = ''
      state.sellInCurrencyTransactionError = ''
    },
    sellPlayerCoinsInCurrencySuccess(state, action) {
      state.sellInCurrencyLoading = false
      state.sellInCurrencyTransactionSuccess = action.payload.message
      state.sellInCurrencyTxnHash = action.payload?.hash
      state.sellInCurrencyTransactionError = ''
    },
    sellPlayerCoinsInCurrencyFailure(state, action) {
      state.sellInCurrencyLoading = false
      state.sellInCurrencyTransactionSuccess = ''
      state.sellInCurrencyTxnHash = ''
      state.sellInCurrencyTransactionError =
        action.payload.response.data.message
    },
    newRewardPercentage(state, action) {
      state.isnewRewardPercentageLoading = true
      state.isnewRewardPercentageError = ''
      state.newRewardPercentageData = ''
      state.newRewardPercentageDataSuccess = false
    },
    newRewardPercentageSuccess(state, action) {
      state.isnewRewardPercentageLoading = false
      state.isnewRewardPercentageError = ''
      state.newRewardPercentageDataSuccess = action.payload.success
      state.newRewardPercentageData = action.payload.message
      state.txnHashN = action.payload.data
    },
    newRewardPercentageFailure(state, action) {
      state.isnewRewardPercentageLoading = false
      state.newRewardPercentageData = ''
      state.newRewardPercentageDataSuccess =
        action.payload.response.data.success
      state.isnewRewardPercentageError = action.payload.response.data.message
    },
    resetNewRewardPercentageMessage(state) {
      state.newRewardPercentageData = ''
      state.isnewRewardPercentageError = ''
      state.newRewardPercentageDataSuccess = false
    },
    fetchPassportImage(state) {
      state.isLoadingPlayerList = true
      state.isFetchPassportImageSuccess = false
      state.isFetchPassportImageFailture = false
      state.passportimage = ''
    },
    fetchPassportImageSuccess(state, action) {
      state.isLoadingPlayerList = false
      state.isFetchPassportImageSuccess = true
      state.passportimage = action.payload.data.passportimage
    },
    fetchPassportImageFailure(state, action) {
      state.isLoadingPlayerList = false
      state.isFetchPassportImageFailture = true
      state.passportimage = ''
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchPassportImageInit(state) {
      state.isFetchPassportImageSuccess = false
      state.isFetchPassportImageFailture = false
    },
    instaProfileRefetch(state, action) {
      state.isinstaProfileRefetchLoading = true
      state.isinstaProfileRefetchError = ''
      state.instaProfileRefetchData = ''
      state.instaProfileRefetchDataSuccess = false
    },
    instaProfileRefetchSuccess(state, action) {
      state.isinstaProfileRefetchLoading = false
      state.isinstaProfileRefetchError = ''
      state.instaProfileRefetchDataSuccess = action.payload.success
      state.instaProfileRefetchData = action.payload.message
    },
    instaProfileRefetchFailure(state, action) {
      state.isinstaProfileRefetchLoading = false
      state.instaProfileRefetchData = ''
      state.instaProfileRefetchDataSuccess =
        action.payload.response.data.success
      state.isinstaProfileRefetchError = action.payload.response.data.message
    },
    resetInstaProfileRefetch(state) {
      state.isinstaProfileRefetchError = ''
      state.instaProfileRefetchData = ''
      state.instaProfileRefetchDataSuccess = false
    },

    // pay for Item functionality to get price of items

    getItemsPrice(state) {
      state.isItemLoading = true
      state.getItemPriceData = []
      state.getItemPriceError = ''
    },
    getItemsPriceSuccess(state, action) {
      state.isItemLoading = false
      state.getItemPriceData = action.payload.data
      state.serviceFeeAddress = action.payload.serviceFeeAddress
      state.getItemPriceError = ''
    },
    getItemsPriceFailure(state, action) {
      state.isItemLoading = false
      state.getItemPriceData = []
      state.getItemPriceError = action.payload
    },

    // pay for Item functionality to payforItem call after transcation success

    payForItem(state, action) {
      state.isPayForLoading = true
      state.payForItemData = ''
      state.payForItemError = ''
      state.payForItemDataSuccess = false
    },
    payForItemSuccess(state, action) {
      state.isPayForLoading = false
      state.payForItemData = action.payload.message
      state.payForItemDataSuccess = action.payload.success
      state.payForItemError = ''
    },
    payForItemFailure(state, action) {
      state.isPayForLoading = false
      state.payForItemData = ''
      state.payForItemError = action.payload
      state.payForItemDataSuccess = false
    },

    // pay for Item functionality to get User Payed Items already

    getUserPayedItems(state) {
      state.isUserPayedLoading = true
      state.userPayedItemsData = []
      state.userPayedItemsError = ''
    },
    getUserPayedItemsSuccess(state, action) {
      state.isUserPayedLoading = false
      state.userPayedItemsData = action.payload.data
      state.userPayedItemsError = ''
    },
    getUserPayedItemsFailure(state, action) {
      state.isUserPayedLoading = false
      state.userPayedItemsData = []
      state.userPayedItemsError = action.payload
    },
    approveProExchange(state, action) {
      state.approveExchangeLoading = true
      state.approvePaymentOptionSuccess = ''
      state.approvePaymentOptionFailure = ''
    },
    approveProExchangeSuccess(state, action) {
      state.approveExchangeLoading = false
      state.approveExchangeSuccess = action.payload.success
      state.approveExchangeFailure = ''
    },
    approveProExchangeError(state, action) {
      state.approveExchangeLoading = false
      state.approveExchangeSuccess = ''
      state.approveExchangeFailure = action.payload.message
    },
    fetchListPlayersOverviewInit(state, action) {
      state.isFetchListPlayerTrendingDone = false
      state.isFetchListPlayerLatestTradesDone = false
      state.isFetchListPlayerSupportersDone = false
      state.isFetchListPlayerWinnersDone = false
      state.isFetchListPlayerLosersDone = false
      state.isFetchListPlayerTalentsDone = false
      state.isLoadingList = true
    },
    fetchListPlayersTrending(state) {
      state.isLoading = true
    },
    fetchListPlayersTrendingSuccess(state, action) {
      state.isLoading = false
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      state.playersListData = [
        ...state.playersListData,
        ...action.payload.results.map(item => {
          return { type: 'trending', ...item }
        }),
      ]
      state.playersTrendingListData = action.payload.results
      if (state.playersListData.length === 0) {
        state.isFetchListPlayerError = 'No data found'
      }
      state.isFetchListPlayerTrendingDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersTrendingFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
      state.isFetchListPlayerTrendingDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersMarket(state) {
      state.isLoading = true
      state.isLoadingPlayersMarketListData = true
    },
    fetchListPlayersMarketSuccess(state, action) {
      state.isLoading = false
      state.isLoadingPlayersMarketListData = false
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      // state.playersListData = [
      //   ...state.playersListData,
      //   ...action.payload.results.map(item => {
      //     return { type: 'market', ...item }
      //   }),
      // ]
      state.playersMarketListData = action.payload.results
      // if (state.playersListData.length === 0) {
      //   state.isFetchListPlayerError = 'No data found'
      // }
      state.isFetchListPlayerLatestTradesDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersMarketFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isLoadingPlayersMarketListData = false
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
      state.isFetchListPlayerLatestTradesDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersSupporters(state) {
      state.isLoading = true
    },
    fetchListPlayersSupportersSuccess(state, action) {
      state.isLoading = false
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      state.playersListData = [
        ...state.playersListData,
        ...action.payload.results.map(item => {
          return { type: 'supporters', ...item }
        }),
      ]
      state.playersSupportersListData = action.payload.results
      if (state.playersListData.length === 0) {
        state.isFetchListPlayerError = 'No data found'
      }
      state.isFetchListPlayerSupportersDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersSupportersFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
      state.isFetchListPlayerSupportersDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersWinners(state) {
      state.isLoading = true
    },
    fetchListPlayersWinnersSuccess(state, action) {
      state.isLoading = false
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      state.playersListData = [
        ...state.playersListData,
        ...action.payload.results.map(item => {
          return { type: 'winners', ...item }
        }),
      ]
      state.playersWinnersListData = action.payload.results
      if (state.playersListData.length === 0) {
        state.isFetchListPlayerError = 'No data found'
      }
      state.isFetchListPlayerWinnersDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersWinnersFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
      state.isFetchListPlayerWinnersDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersLosers(state) {
      state.isLoading = true
    },
    fetchListPlayersLosersSuccess(state, action) {
      state.isLoading = false
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      state.playersListData = [
        ...state.playersListData,
        ...action.payload.results.map(item => {
          return { type: 'losers', ...item }
        }),
      ]
      state.playersLosersListData = action.payload.results
      if (state.playersListData.length === 0) {
        state.isFetchListPlayerError = 'No data found'
      }
      state.isFetchListPlayerLosersDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersLosersFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
      state.isFetchListPlayerLosersDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersTalents(state) {
      state.isLoading = true
    },
    fetchListPlayersTalentsSuccess(state, action) {
      state.isLoading = false
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      state.playersListData = [
        ...state.playersListData,
        ...action.payload.results.map(item => {
          return { type: 'talents', ...item }
        }),
      ]
      state.playersTalentsListData = action.payload.results
      if (state.playersListData.length === 0) {
        state.isFetchListPlayerError = 'No data found'
      }
      state.isFetchListPlayerTalentsDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersTalentsFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
      state.isFetchListPlayerTalentsDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersLatestTrades(state) {
      state.isLoading = true
      state.isFetchListPlayersLatestTradesSuccess = false
      state.isFetchListPlayersLatestTradesFailure = false
    },
    fetchListPlayersLatestTradesSuccess(state, action) {
      state.isLoading = false
      state.isFetchListPlayersLatestTradesSuccess = true
      state.latestTradesData = action.payload.data
      state.exchangeRateData = action.payload.exchangerate
      state.isFetchListPlayerLatestTradesDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersLatestTradesFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isFetchListPlayersLatestTradesFailure = true
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
      state.isFetchListPlayerLatestTradesDone = true
      state.isLoadingList = !(
        state.isFetchListPlayerTrendingDone &&
        state.isFetchListPlayerLatestTradesDone &&
        state.isFetchListPlayerSupportersDone &&
        state.isFetchListPlayerWinnersDone &&
        state.isFetchListPlayerLosersDone &&
        state.isFetchListPlayerTalentsDone
      )
    },
    fetchListPlayersHot(state) {
      state.isLoading = true
      state.isLoadingList = true
      state.playersListData = []
    },
    fetchListPlayersHotSuccess(state, action) {
      state.isLoading = false
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      state.playersListData = action.payload.results
      state.isLoadingList = false
      if (state.playersListData.length === 0) {
        state.isFetchListPlayerError = 'No data found'
      }
    },
    fetchListPlayersHotFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchListPlayersFeatured(state) {
      state.isLoading = true
      state.isLoadingList = true
      state.playersListData = []
    },
    fetchListPlayersFeaturedSuccess(state, action) {
      state.isLoading = false
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      state.playersListData = action.payload.results
      state.isLoadingList = false
      if (state.playersListData.length === 0) {
        state.isFetchListPlayerError = 'No data found'
      }
    },
    fetchListPlayersFeaturedFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchListPlayersNew(state) {
      state.isLoading = true
      state.isLoadingList = true
      state.playersListData = []
    },
    fetchListPlayersNewSuccess(state, action) {
      state.isLoading = false
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      state.playersListData = action.payload.results
      state.isLoadingList = false
      if (state.playersListData.length === 0) {
        state.isFetchListPlayerError = 'No data found'
      }
    },
    fetchListPlayersNewFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchListPlayersCountry(state, action) {
      state.isLoadingCountry = true
      state.playersCountryListData = []
    },
    fetchListPlayersCountrySuccess(state, action) {
      state.isLoadingCountry = false
      state.isFetchListPlayerSuccess = 'players fetched successfully' //action.payload.message
      state.playersCountryListData = action.payload.results
    },
    fetchListPlayersCountryFailure(state, action) {
      const { payload } = action
      state.isLoadingCountry = false
      state.isFetchAllPlayerError = action.payload.response?.data.detail
      if (
        action.payload.response?.status === '403' ||
        action.payload.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchListNftsAuction(state, action) {
      state.isLoading = true
    },
    fetchListNftsAuctionSuccess(state, action) {
      state.allNftsData = [
        ...state.allNftsData,
        ...action.payload?.data?.results.map(item => {
          return { type: 'auction', ...item }
        }),
      ]
      state.isLoading = false
      state.isFetchListNftsAuctionDone = true
      state.isLoadingNfts = !(
        state.isFetchListNftsAuctionDone &&
        state.isFetchListNftsRaffleDone &&
        state.isFetchListNftsUpcomingDone &&
        state.isFetchListNftsMintedDone &&
        state.isFetchListNftsValuableDone
      )
    },
    fetchListNftsAuctionFailure(state, action) {
      state.isLoading = false
      state.isFetchListNftsAuctionDone = true
      state.isLoadingNfts = !(
        state.isFetchListNftsAuctionDone &&
        state.isFetchListNftsRaffleDone &&
        state.isFetchListNftsUpcomingDone &&
        state.isFetchListNftsMintedDone &&
        state.isFetchListNftsValuableDone
      )
    },
    fetchListNftsRaffle(state, action) {
      state.isLoading = true
    },
    fetchListNftsRaffleSuccess(state, action) {
      state.allNftsData = [
        ...state.allNftsData,
        ...action.payload?.data?.results.map(item => {
          return { type: 'raffle', ...item }
        }),
      ]
      state.isLoading = false
      state.isFetchListNftsRaffleDone = true
      state.isLoadingNfts = !(
        state.isFetchListNftsAuctionDone &&
        state.isFetchListNftsRaffleDone &&
        state.isFetchListNftsUpcomingDone &&
        state.isFetchListNftsMintedDone &&
        state.isFetchListNftsValuableDone
      )
    },
    fetchListNftsRaffleFailure(state, action) {
      state.isLoading = false
      state.isFetchListNftsRaffleDone = true
      state.isLoadingNfts = !(
        state.isFetchListNftsAuctionDone &&
        state.isFetchListNftsRaffleDone &&
        state.isFetchListNftsUpcomingDone &&
        state.isFetchListNftsMintedDone &&
        state.isFetchListNftsValuableDone
      )
    },
    fetchListNftsNew(state, action) {
      state.isLoadingNfts = true
    },
    fetchListNftsNewSuccess(state, action) {
      state.isLoadingNfts = false
      state.allNftsData = [
        ...state.allNftsData,
        ...action.payload?.data?.results.map(item => {
          return { type: 'new', ...item }
        }),
      ]
    },
    fetchListNftsNewFailure(state, action) {
      state.isLoadingNfts = false
      state.allNftsData = []
    },
    fetchListNftsUpcoming(state, action) {
      state.isLoading = true
    },
    fetchListNftsUpcomingSuccess(state, action) {
      state.allNftsData = [
        ...state.allNftsData,
        ...action.payload?.data?.results.map(item => {
          return { type: 'new', ...item }
        }),
      ]
      state.isLoading = false
      state.isFetchListNftsUpcomingDone = true
      state.isLoadingNfts = !(
        state.isFetchListNftsAuctionDone &&
        state.isFetchListNftsRaffleDone &&
        state.isFetchListNftsUpcomingDone &&
        state.isFetchListNftsMintedDone &&
        state.isFetchListNftsValuableDone
      )
    },
    fetchListNftsUpcomingFailure(state, action) {
      state.isLoading = false
      state.isFetchListNftsUpcomingDone = true
      state.isLoadingNfts = !(
        state.isFetchListNftsAuctionDone &&
        state.isFetchListNftsRaffleDone &&
        state.isFetchListNftsUpcomingDone &&
        state.isFetchListNftsMintedDone &&
        state.isFetchListNftsValuableDone
      )
    },
    fetchListNftsMinted(state, action) {
      state.isLoading = true
    },
    fetchListNftsMintedSuccess(state, action) {
      state.allNftsData = [
        ...state.allNftsData,
        ...action.payload?.data?.results?.map(item => {
          return { type: 'minted', ...item }
        }),
      ]
      state.isLoading = false
      state.isFetchListNftsMintedDone = true
      state.isLoadingNfts = !(
        state.isFetchListNftsAuctionDone &&
        state.isFetchListNftsRaffleDone &&
        state.isFetchListNftsUpcomingDone &&
        state.isFetchListNftsMintedDone &&
        state.isFetchListNftsValuableDone
      )
    },
    fetchListNftsMintedFailure(state, action) {
      state.isLoading = false
      state.isFetchListNftsMintedDone = true
      state.isLoadingNfts = !(
        state.isFetchListNftsAuctionDone &&
        state.isFetchListNftsRaffleDone &&
        state.isFetchListNftsUpcomingDone &&
        state.isFetchListNftsMintedDone &&
        state.isFetchListNftsValuableDone
      )
    },
    fetchListNftsValuable(state, action) {
      state.isLoading = true
    },
    fetchListNftsValuableSuccess(state, action) {
      state.allNftsData = [
        ...state.allNftsData,
        ...action.payload?.data.map(item => {
          return { type: 'valuable', ...item }
        }),
      ]
      state.isLoading = false
      state.isFetchListNftsValuableDone = true
      state.isLoadingNfts = !(
        state.isFetchListNftsAuctionDone &&
        state.isFetchListNftsRaffleDone &&
        state.isFetchListNftsUpcomingDone &&
        state.isFetchListNftsMintedDone &&
        state.isFetchListNftsValuableDone
      )
    },
    fetchListNftsValuableFailure(state, action) {
      state.isLoading = false
      state.isFetchListNftsValuableDone = true
      state.isLoadingNfts = !(
        state.isFetchListNftsAuctionDone &&
        state.isFetchListNftsRaffleDone &&
        state.isFetchListNftsUpcomingDone &&
        state.isFetchListNftsMintedDone &&
        state.isFetchListNftsValuableDone
      )
    },
    fetchListNftsHot(state, action) {
      state.isLoadingNfts = true
    },
    fetchListNftsHotSuccess(state, action) {
      state.isLoadingNfts = false
      state.allNftsData = action.payload.data.results
    },
    fetchListNftsHotFailure(state, action) {
      state.isLoadingNfts = false
      state.allNftsData = []
    },
    fetchListNftsOverviewInit(state, action) {
      state.isFetchListNftsAuctionDone = false
      state.isFetchListNftsRaffleDone = false
      state.isFetchListNftsUpcomingDone = false
      state.isFetchListNftsMintedDone = false
      state.isFetchListNftsValuableDone = false
      state.isLoadingNfts = true
    },
    DraftingPercentage(state, action) {
      state.DraftingPercentageLoading = true
      state.DraftingPercentageError = ''
      state.DraftingPercentageData = ''
      state.DraftingPercentageDataSuccess = false
    },
    DraftingPercentageSuccess(state, action) {
      state.DraftingPercentageLoading = false
      state.DraftingPercentageError = ''
      state.DraftingPercentageDataSuccess = action.payload.success
      state.DraftingPercentageData = action.payload.message
      state.txnHashN = action.payload.data
    },
    DraftingPercentageFailure(state, action) {
      state.DraftingPercentageLoading = false
      state.DraftingPercentageData = ''
      state.DraftingPercentageDataSuccess = action.payload.response.data.success
      state.DraftingPercentageError = action.payload.response.data.message
    },
    resetDraftingPercentageMessage(state) {
      state.DraftingPercentageData = ''
      state.DraftingPercentageError = ''
      state.DraftingPercentageDataSuccess = false
      state.txnHashN = ''
    },
    createKioskItem(state, action) {
      state.createKioskLoading = true
      state.createKioskError = ''
    },
    createKioskItemSuccess(state, action) {
      state.createKioskLoading = false
      state.createKioskError = ''
      state.createKioskSuccess = action.payload.message
    },
    createKioskItemFailure(state, action) {
      state.createKioskLoading = false
      state.createKioskError = action.payload.response.data.message
    },
    createKioskItemReset(state) {
      state.createKioskLoading = false
      state.createKioskError = ''
      state.createKioskSuccess = ''
    },
    editKioskItem(state, action) {
      state.createKioskLoading = true
      state.createKioskError = ''
    },
    showCreteKioskItemForm(state, action) {
      state.createKioskSuccess = ''
      state.isCreateKioskItemFormVisible = action.payload.show
    },
    switchItemToEdit(state, action) {
      state.isItemSwitchedToEdit = action.payload.data
    },
    fetchListPlayersLanding(state) {
      state.isLoadingPlayersLanding = true
      state.isFetchListPlayerLandingSuccess = false
      state.isFetchListPlayerLandingError = false
      state.playersListLandingData = []
    },
    fetchListPlayersLandingSuccess(state, action) {
      state.isLoadingPlayersLanding = false
      state.playersListLandingData = action.payload.results
      state.isFetchListPlayerLandingSuccess = true
    },
    fetchListPlayersLandingFailure(state, action) {
      state.isLoadingPlayersLanding = false
      state.isFetchListPlayerLandingError = true
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },

    createFanPlayer(state, action) {
      state.isLoading = true
      state.isCreatePlayerError = ''
      state.playerData = action?.payload
      state.newPlayerId = null
    },
    createFanPlayerSuccess(state, action) {
      state.isLoading = false
      state.isCreatePlayerSuccess = action?.payload?.message
      state.newPlayerId = action?.payload?.data?.id
      state.isUnverifiedUser =
        action?.payload?.data?.playerstatusid?.playerstatusname === 'Unverified'
    },
    createFanPlayerFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isCreatePlayerError =
        action?.payload?.response?.data?.message || 'Something went wrong'
      state.playerData = {
        artistname: '',
        dateofbirth: '',
        email: '',
        givenname: '',
        nationality: '',
        surname: '',
        mobilenumber: '',
        transfermarktlink: '',
      }
    },
    resetCreateFanPlayerError(state) {
      state.isCreatePlayerError = ''
    },
    reCreateFanPlayer(state, action) {
      state.isLoading = true
      state.isCreatePlayerError = ''
      state.playerData = action?.payload
      state.newPlayerId = null
    },
    reCreateFanPlayerSuccess(state, action) {
      state.isLoading = false
      state.isCreatePlayerSuccess = action?.payload?.message
      state.newPlayerId = action?.payload?.data?.id
      state.isUnverifiedUser =
        action?.payload?.data?.playerstatusid?.playerstatusname === 'Unverified'
    },
    resetCreatePlayerSuccess(state) {
      // console.log('resetCreatePlayerSuccess')
      state.isCreatePlayerSuccess = ''
    },
    reCreateFanPlayerFailure(state, action) {
      const { payload } = action
      state.isLoading = false
      state.isCreatePlayerError =
        action?.payload?.response?.data?.message || 'Something went wrong'
      state.playerData = {
        artistname: '',
        dateofbirth: '',
        email: '',
        givenname: '',
        nationality: '',
        surname: '',
        mobilenumber: '',
        transfermarktlink: '',
      }
    },
    getFanPlayerData(state, action) {
      if (action?.payload?.isReloading === false) {
        state.isLoadingPlayerList = true
        state.isVerifyingWhatsapp = true
      }
      if (action?.payload?.afterWhatsApp === true) {
        state.isVerifyingWhatsapp = true
      }
      if (action?.payload?.isInstaLoading === true) {
        state.isInstaProfileLoading = true
      }
      state.isGetPlayerSuccess = ''
      state.isGetPlayerError = ''
      // state.allPlayersData = []
      state.defaultLoader = true
    },
    getFanPlayerDataSuccess(state, action) {
      state.defaultLoader = false
      state.isGetPlayerSuccess = action?.payload?.message
      state.allPlayersData = action?.payload?.data
      state.isUnverifiedUser =
        action?.payload?.data[0]?.playerstatusid?.playerstatusname ===
        'Unverified'
      localStorage.setItem(
        'playercontract',
        state.allPlayersData[0]?.playercontract,
      )
      state.isLoadingPlayerList = false
      state.isVerifyingWhatsapp = false
      state.isInstaProfileLoading = false
      // if (state.allPlayersData.length === 1) {
      //   state.selectedPlayer = state.allPlayersData[0]
      // }
    },
    getFanPlayerDataFailure(state, action) {
      const { payload } = action
      state.defaultLoader = false
      state.isLoadingPlayerList = false
      state.isVerifyingWhatsapp = false
      state.isInstaProfileLoading = false
      state.isGetPlayerError = 'Something went wrong' //action.payload.response.data.message
      if (
        action?.payload?.response?.status === '403' ||
        action?.payload?.response?.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    checkFanPlayerStatus(state) {
      state.isLoadingCheckStatus = true
      state.isCheckPlayerStatusError = ''
    },
    checkFanPlayerStatusSuccess(state, action) {
      state.isLoadingCheckStatus = false
      state.isCheckPlayerStatusSuccess = action?.payload?.message
      state.allPlayersDataCheckStatusFan = action?.payload?.claim_status
    },
    checkFanPlayerStatusFailure(state, action) {
      state.isLoadingCheckStatus = false
      state.isCheckPlayerStatusError = 'Something went wrong'
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    getSeasonDetails(state, action) {
      state.season = null
      state.hasSeasonPrev = false
      state.hasSeasonNext = false
      state.isGetSeasonDetailSuccess = false
    },
    getSeasonDetailsSuccess(state, action) {
      state.seasonStatusError = ''
      state.isGetSeasonDetailSuccess = true
      state.season = action?.payload?.data
      state.hasSeasonPrev = action?.payload?.prev
      state.prevseasonid = action?.payload?.prevseasonid
      state.hasSeasonNext = action?.payload?.next
      state.nextseasonid = action?.payload?.nextseasonid
      // state.hasSeasonPrev = true
      // state.prevseasonid = Math.ceil(Math.random() * 10)
      // state.hasSeasonNext = true
      // state.nextseasonid = Math.ceil(Math.random() * 10)
      state.prevbanner = action?.payload?.data?.prevbanner
      state.prevbannermobile = action?.payload?.data?.prevbannermobile
    },
    getTourSeasonDetails(state) {
      state.isGetSeasonDetailSuccess = true
      state.season = DummySeason
    },
    getSeasonDetailsFailure(state) {
      state.seasonStatusError = 'Something went wrong'
    },
    getUserEarlyAccessNft(state) {
      state.isLoading = true
      state.earlyAccessNfts = []
      state.earlyAccessPeriod = 0
      state.isEarlyAccessNftSuccess = false
      state.isEarlyAccessNftError = ''
    },
    getUserEarlyAccessNftSuccess(state, action) {
      state.isLoading = false
      state.earlyAccessNfts = action?.payload?.data
      state.earlyAccessPeriod = action?.payload?.earlyaccessperiod
      state.isEarlyAccessNftSuccess = true
    },
    getUserEarlyAccessNftFailure(state) {
      state.isLoading = false
      state.isEarlyAccessNftError = 'Something went wrong'
    },
    getSeasonPrize(state, action) {
      state.isLoading = true
      state.seasonPrizeAmount = 0
      state.isGetSeasonPrizeSuccess = false
      state.isGetSeasonPrizeError = ''
    },
    getSeasonPrizeSuccess(state, action) {
      state.isLoading = false
      state.seasonPrizeAmount = action?.payload?.data
      state.isGetSeasonPrizeSuccess = true
    },
    getSeasonPrizeFailure(state) {
      state.isLoading = false
      state.isGetSeasonPrizeError = 'Something went wrong'
    },
    getMinStaking(state) {
      state.isMinStakingClaimLoading = true
      state.minStakingSuccessData = ''
      state.minStakingClaimError = ''
    },
    getMinStakingSuccess(state, action) {
      state.isMinStakingClaimLoading = false
      state.minStakingSuccessData = action?.payload?.data
      state.minStakingClaimError = ''
    },
    getMinStakingFailure(state, action) {
      state.isMinStakingClaimLoading = false
      state.minStakingClaimError = action?.payload?.response?.data?.message
      state.minStakingSuccessData = ''
    },
    getApprovedCountriesForPlayerCreation(state) {
      state.isGetCountriesLoading = true
      state.approvedCountriesListSuccess = ''
      state.approvedCountriesListError = ''
    },
    getApprovedCountriesForPlayerCreationSuccess(state, action) {
      state.isGetCountriesLoading = false
      state.approvedCountriesListSuccess = action.payload
      state.approvedCountriesListError = ''
      const data = action.payload.map(country => country?.iso2)
      const filteredCountries = data.filter(
        country => country !== 'CS' && country !== 'UM',
      )
      state.approvedCountriesCodeList = filteredCountries
    },
    getApprovedCountriesForPlayerCreationError(state, action) {
      state.isGetCountriesLoading = false
      state.approvedCountriesListSuccess = ''
      state.approvedCountriesListError =
        action?.payload?.response?.data?.message
    },
    getGenesisSaleDetail(state) {
      state.isLoading = true
      state.genesisSaleDetailSuccess = false
      state.genesisSaleDetailError = ''
    },
    getGenesisSaleDetailSuccess(state, action) {
      state.isLoading = false
      state.genesisSaleDetailSuccess = true
      state.genesisSaleDetailError = ''
      state.genesisSaleDetailData = action.payload
    },
    getGenesisSaleDetailError(state, action) {
      state.isLoading = false
      state.genesisSaleDetailSuccess = fakse
      state.genesisSaleDetailError = action?.payload?.response?.data?.message
    },
    getLandingPlayerCount(state) {
      state.landingPlayerCount = {
        scoutsCount: 0,
        playerCount: 0,
        uniqueCountryCount: 0,
      }
    },
    getLandingPlayerCountSuccess(state, action) {
      state.landingPlayerCount = action.payload
    },
    getLandingPlayerData(state, action) {
      state.landingPlayerData = []
      state.loadingLandingPlayerData = true
    },
    getLandingPlayerDataWithURL(state, action) {
      state.loadingLandingPlayerDataWithUrl = true
    },
    getLandingPlayerDataSuccess(state, action) {
      if (action.payload.results !== undefined) {
        state.landingPlayerData = action.payload.results
        state.landingPlayerNextUrl = action.payload.next
        state.landingPlayerPrevUrl = action.payload.previous
        state.loadingLandingPlayerData = false
      } else {
        state.landingPlayerData = []
        state.landingPlayerNextUrl = null
        state.landingPlayerPrevUrl = null
        state.loadingLandingPlayerData = false
      }
    },
    getLandingPlayerDataWithURLSuccess(state, action) {
      if (action.payload.results !== undefined) {
        state.landingPlayerData = state.landingPlayerData.concat(
          action.payload.results,
        )
        state.landingPlayerNextUrl = action.payload.next
        state.landingPlayerPrevUrl = action.payload.previous
        state.loadingLandingPlayerDataWithUrl = false
      } else {
        state.landingPlayerData = state.landingPlayerData
        state.landingPlayerNextUrl = null
        state.landingPlayerPrevUrl = null
        state.loadingLandingPlayerDataWithUrl = false
      }
    },
    getBanner(state) {
      state.mainBanner = []
      state.extraBanner = []
      state.loadingBanner = true
      state.allowShowAddToHomeScreenPopup = false
    },
    getBannerSuccess(state, action) {
      state.mainBanner = action.payload.main_banner
      state.extraBanner = action.payload.extra_banner
      state.loadingBanner = false
      state.allowShowAddToHomeScreenPopup = true
    },
    getMyWalletPlayers(state) {
      state.myWalletPlayers = []
      state.loadingMyWalletPlayers = true
    },
    getMyWalletPlayersSuccess(state, action) {
      state.myWalletPlayers = action.payload?.results
      state.current_balance = action.payload?.balance_change_24hr_usd
      state.wallet_balance_percentage_change =
        action.payload?.wallet_balance_percentage_change
      state.loadingMyWalletPlayers = false
    },
    getMyWalletPlayersFailure(state) {
      state.myWalletPlayers = []
      state.current_balance = 0
      state.loadingMyWalletPlayers = false
    },
    getTrendingScoutsPlayers(state) {
      state.trendingScoutsPlayers = []
      state.loadingTrendingScoutsPlayers = true
    },
    getTrendingScoutsPlayersSuccess(state, action) {
      state.trendingScoutsPlayers = action.payload
      state.loadingTrendingScoutsPlayers = false
    },
    getLaunchingPlayers(state) {
      state.launchingPlayers = []
      state.loadingLaunchingPlayers = true
    },
    getLaunchingPlayersSuccess(state, action) {
      state.launchingPlayers = action.payload
      state.loadingLaunchingPlayers = false
    },
    getFeedPlayers(state, action) {
      state.feedPlayers = []
      if (action.payload?.isFirstLoad) {
        state.loadingFeedPlayers = true
      }
    },
    getFeedPlayersSuccess(state, action) {
      state.feedPlayers = action.payload?.success || []
      state.loadingFeedPlayers = false
      if (action.payload?.sliceAction?.payload?.isFirstLoad) {
        state.initialFeedsFetched = true
      }
      if (action.payload?.sliceAction?.payload?.params?.tradetimestamp) {
        state.newFeeds = action.payload?.success
        //------------------------------------------------------------------------------------------
        //-------------------TEST_CODE_FOR_DEBUGGING_PURPOSE------------------------------
        //------------------------------------------------------------------------------------------
        // state.newTimestamp =
        //   state.newTimestamp + parseInt((Math.random() * 1000).toFixed())
        // const randomNo = Math.random() * 10
        // state.newFeeds = [
        //   {
        //     tradetimestamp: state.newTimestamp,
        //     amt: Math.random() * 10,
        //     direction: randomNo % 2 === 0 ? -1 : 1,
        //     name: `Gregor${randomNo.toFixed()} Kobel${randomNo.toFixed()}`,
        //     detailpageurl: 'gregor-kobel',
        //     ticker: `GR${randomNo.toFixed()}KO`,
        //     wallet: '0x7ddcaad8f20d6d092978b77ddd1c91aad57682b9',
        //     username: `Trade${randomNo.toFixed()}OrDie`,
        //     avatar: 'group-5',
        //     lifetimelevel: 36,
        //   },
        // ]
        //-------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
      }
    },
    clearLiveFeeds(state) {
      state.newFeeds = []
      state.initialFeedsFetched = false
    },
    updateFeedPlayers(state) {
      // state.feedPlayers = []
    },
    getMessages(state) {
      state.isLoadingMessages = true
      state.isGetMessagesError = ''
    },
    getMessagesSuccess(state, action) {
      console.log('messages', action?.payload)
      state.isLoadingMessages = false
      state.isGetMessagesSuccess = action?.payload?.results
      state.isGetMessagesError = ''
    },
    getMessagesFailure(state, action) {
      state.isLoadingMessages = false
      state.isGetMessagesError = 'Something went wrong'
    },
    getMessagesReply(state, action) {
      state.isLoadingMessagesReply = true
      state.isGetMessagesReplyError = ''
    },
    getMessagesReplySuccess(state, action) {
      console.log('messagesReply', action?.payload)
      state.isLoadingMessagesReply = false
      state.isGetMessagesReplySuccess = action?.payload?.results
      state.isGetMessagesReplyError = ''
    },
    getMessagesReplyFailure(state, action) {
      state.isLoadingMessagesReply = false
      state.isGetMessagesReplyError = 'Something went wrong'
    },
    getScoutsCount(state) {
      state.scoutsCount = {
        totalTrades: 0,
        xpCollected: 0,
        scoutsCount: 0,
      }
    },
    getScoutsCountSuccess(state, action) {
      state.scoutsCount = {
        totalTrades: action.payload.total_trades,
        xpCollected: action.payload.xp_collected_24hr,
        scoutsCount: action.payload.scouts_count,
      }
    },
    getTourScoutsCount(state) {
      state.scoutsCount = {
        totalTrades: DummyScoutsKPI.total_trades,
        xpCollected: DummyScoutsKPI.xp_collected_24hr,
        scoutsCount: DummyScoutsKPI.scouts_count,
      }
    },
    getScoutsLeaderboard(state, action) {
      state.scoutsLeaderboard = []
      state.loadingScoutsLeaderboard = true
    },
    updateScoutsLeaderboard(state, action) {
      //update scouts leaderboard data
      state.updatingScoutsLeaderboard = true
    },
    getScoutsLeaderboardSuccess(state, action) {
      if (action.payload.success) {
        state.scoutsLeaderboard = action.payload.results
        state.scoutsLeaderboardNextURL = action.payload.next
        state.scoutsLeaderboardPrevURL = action.payload.previous
      }
      state.loadingScoutsLeaderboard = false
    },
    getTourScoutsLeaderboard(state) {
      state.scoutsLeaderboard = DummyScoutsLeaderboard
      state.loadingScoutsLeaderboard = false
    },
    updateScoutsLeaderboardSuccess(state, action) {
      state.updatingScoutsLeaderboard = false
      if (action.payload.success && action.payload.results.length > 0) {
        state.scoutsLeaderboard = state.scoutsLeaderboard.concat(
          action.payload.results,
        )
        if (action.payload.results.length < 10) {
          state.scoutsLeaderboardNextURL = null
        } else {
          state.scoutsLeaderboardNextURL = action.payload.next
          state.scoutsLeaderboardPrevURL = action.payload.previous
        }
      } else {
        state.scoutsLeaderboard = state.scoutsLeaderboard
        state.scoutsLeaderboardNextURL = null
        state.scoutsLeaderboardPrevURL = null
      }
    },
    getScoutsTop(state) {
      state.scoutsTop = []
      state.loadingScoutsTop = true
    },
    getScoutsTopSuccess(state, action) {
      state.scoutsTop = action.payload
      state.loadingScoutsTop = false
    },
    getTourScoutsTop(state) {
      state.scoutsTop = DummyScoutsTop5
      state.loadingScoutsTop = false
    },
    getPlayersCount(state) {
      state.playersCount = {
        tokenCount: 0,
        uniqueCountryCount: 0,
        playerCount: 0,
      }
    },
    getPlayersCountSuccess(state, action) {
      state.playersCount = {
        tokenCount: action.payload.token_count,
        uniqueCountryCount: action.payload.unique_country_count,
        playerCount: action.payload.player_count,
      }
    },
    getPlayersComingSoon(state) {
      state.playersComingSoon = []
      state.loadingPlayersComingSoon = true
    },
    getPlayersComingSoonSuccess(state, action) {
      state.playersComingSoon = action.payload
      state.loadingPlayersComingSoon = false
    },
    //-------
    // graiSuccess: [],
    // graiIsLoading: false,
    // graiFailure: '',
    // gnkiSuccess: [],
    // gnkiIsLoading: false,
    // gnkiFailure: '',
    // getTopItemsSuccess: [],
    // getTopItemsLoading: false,
    // getTopItemsFailure: '',
    // getKioskKpiSuccess: [],
    // getKioskKpiLoading: false,
    // geIstKioskKpiFailure: '',
    // getAllKioskItemsSuccess: [],
    //  getAllKioskItemsLoading: false,
    //  getAllKioskItemsFailure: '',

    // ------------------------------------- GET_RECENT_ACQUISITION_DATA -----------------------------
    getRecentAquisitionItems(state) {
      state.graiSuccess = []
      state.graiIsLoading = true
    },
    getRecentAquisitionItemsSuccess(state, action) {
      state.graiSuccess = action.payload?.results || []
      state.graiIsLoading = false
    },
    getRecentAquisitionItemsFailure(state, action) {
      // state.playersComingSoon = action.payload
      // state.loadingPlayersComingSoon = false
      state.graiFailure = action.payload
      state.graiIsLoading = false
    },
    // ------------------------------------- GET_NEW_KIOSK_ITEM_DATA -----------------------------
    getNewKioskItems(state) {
      state.gnkiSuccess = []
      state.gnkiIsLoading = true
    },
    getNewKioskItemsSuccess(state, action) {
      state.gnkiSuccess = action.payload?.results || []
      state.gnkiIsLoading = false
    },
    getNewKioskItemsFailure(state, action) {
      state.gnkiFailure = action.payload
      state.gnkiIsLoading = false
    },
    // ------------------------------------- GET_TOP_KIOSK_ITEM_DATA -----------------------------

    getTopKioskItems(state) {
      state.getTopItemsSuccess = []
      state.getTopItemsLoading = true
    },
    getTopKioskItemsSuccess(state, action) {
      state.getTopItemsSuccess = action.payload?.results || []
      state.getTopItemsLoading = false
    },
    getTopKioskItemsFailure(state, action) {
      state.getTopItemsFailure = action.payload
      state.getTopItemsLoading = false
    },

    // ------------------------------------- GET_KIOSK_KPI_DATA -----------------------------
    getKioskKpi(state) {
      state.getKioskKpiSuccess = []
      state.getKioskKpiLoading = true
    },
    getKioskKpiSuccess(state, action) {
      state.getKioskKpiSuccess = action.payload || []
      state.getKioskKpiLoading = false
    },
    getKioskKpiFailure(state, action) {
      state.getIsKioskKpiFailure = action.payload
      state.getKioskKpiLoading = false
    },
    // ------------------------------------- GET_ALL_KIOSK_ITEM_DATA -----------------------------
    getAllKioskItems(state, action) {
      state.getAllKioskItemsSuccess = []
      state.getAllKioskItemsLoading = true
    },
    getAllKioskItemsSuccess(state, action) {
      console.log('gakis', { action })
      state.getAllKioskItemsSuccess = action.payload?.results || []
      state.isGetAllKioskItems = true
      state.getAllKioskItemsNextUrl = action.payload?.next || ''
      state.getAllKioskItemsLoading = false
    },
    getAllKioskItemsFailure(state, action) {
      state.getAllKioskItemsFailure = action.payload
      state.getAllKioskItemsLoading = false
    },
    getAllKioskItemsReset(state) {
      state.getAllKioskItemsSuccess = []
    },
    resetTopTrades(state) {
      state.isGetTopTradesSuccess = false
      state.isGetTopTradesError = false
      state.topTradesData = []
    },
    getUserTopTrades(state, action) {
      state.isLoadingTopTrades = true
      state.isGetTopTradesSuccess = false
      state.isGetTopTradesError = false
      state.topTradesData = []
    },
    getTopTrades(state, action) {
      state.isLoadingTopTrades = true
      state.isGetTopTradesSuccess = false
      state.isGetTopTradesError = false
    },
    getTopTradesSuccess(state, action) {
      state.isLoadingTopTrades = false
      state.topTradesData = [...state.topTradesData, ...action.payload.results]
      state.nextTopTradesUrl = action.payload?.next
      state.isGetTopTradesSuccess = true
    },
    getTopTradesFailure(state, action) {
      state.isLoadingTopTrades = false
      state.isGetTopTradesError = true
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
  },
})

export const {
  getMessagesReply,
  getMessagesReplySuccess,
  getMessagesReplyFailure,
  getMessages,
  getMessagesSuccess,
  getMessagesFailure,
  createFanPlayer,
  createFanPlayerSuccess,
  createFanPlayerFailure,
  resetCreateFanPlayerError,
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
  setSearchFieldRedux,
  setShowNewDraftPopupRedux,
  setPlayerIdRedux,
  DraftingPercentage,
  DraftingPercentageSuccess,
  DraftingPercentageFailure,
  resetDraftingPercentageMessage,
  getUserPayedItems,
  getUserPayedItemsSuccess,
  getUserPayedItemsFailure,
  payForItem,
  payForItemSuccess,
  payForItemFailure,
  getItemsPrice,
  getItemsPriceSuccess,
  getItemsPriceFailure,
  instaProfileRefetch,
  instaProfileRefetchSuccess,
  instaProfileRefetchFailure,
  resetInstaProfileRefetch,
  newRewardPercentage,
  newRewardPercentageSuccess,
  newRewardPercentageFailure,
  resetNewRewardPercentageMessage,
  AddPayout,
  AddPayoutSuccess,
  AddPayoutFailure,
  createPlayer,
  createPlayerSuccess,
  createPlayerFailure,
  reCreatePlayer,
  reCreatePlayerSuccess,
  reCreatePlayerFailure,
  getPlayerData,
  getPlayerDataSuccess,
  getPlayerDataFailure,
  getPlayerDataInit,
  checkPlayerStatus,
  checkPlayerStatusSuccess,
  checkPlayerStatusFailure,
  resetPlayerData,
  updatePlayerProfile,
  resetPlayerProfileMessage,
  updatePlayerProfileSuccess,
  updatePlayerProfileFailure,
  getAllPlayers,
  getAllPlayersSuccess,
  getAllPlayersFailure,
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
  fetchAllPlayers,
  fetchAllPlayersSuccess,
  fetchAllPlayersFailure,
  fetchListPlayers,
  fetchListPlayersAll,
  fetchListPlayersSuccess,
  fetchListPlayersFailure,
  fetchPlayersStats,
  fetchPlayersStatsSuccess,
  fetchPlayersStatsError,
  getPlayerDetails,
  getPlayerDetailsSuccess,
  getTourPlayerDetails,
  getTourSeasonDetails,
  getDefaultMatic,
  getDefaultMaticSuccess,
  getDefaultMaticError,
  getPlayerDetailsError,
  getPlayerDetailsReset,
  getPlayerDetailsImplicit,
  getPlayerDetailsImplicitSuccess,
  resetPlayerDetails,
  setGoLive,
  setDeployed,
  resetAllPlayers,
  launchPlayerCoin,
  launchPlayerCoinSuccess,
  launchPlayerCoinFailure,
  resetCoinLaunch,
  getPlayer1Contract,
  getPlayer1ContractSuccess,
  getPlayer1ContractFailure,
  getPlayerCoinContract,
  getPlayerCoinContractSuccess,
  getPlayerCoinContractFailure,
  getPlayer2Contract,
  getPlayer2ContractSuccess,
  getPlayer2ContractFailure,
  initPlayer1ContractStatus,
  resetPlayerCoinData,
  fetchDraftNewPlayers,
  fetchDraftNewPlayersSuccess,
  fetchDraftNewPlayersError,
  getPlayerDrafts,
  getPlayerDraftsSuccess,
  getPlayerDraftsFailure,
  getPlayer2ContractReset,
  resetBuyformPlayerContract,
  resetDraftNewPlayers,
  fetchPlayersBalance,
  fetchPlayersBalanceSuccess,
  fetchPlayersBalanceError,
  resetPlayersBalance,
  storeActiveTabBeforeLeaving,
  persistDrafteePlayer,
  persistDraftAction,
  getPlayerSelection,
  getPlayerSelectionSuccess,
  getPlayerSelectionFailure,
  getPlayerSelectionDone,
  resetPlayerSelection,
  getSelectedPlayer,
  getSelectedPlayerSuccess,
  getSelectedPlayerFailure,
  getSelectedPlayerDone,
  setDefaultSelectedPlayer,
  resetCreatePlayerError,
  toggleStakingCoins,
  getAddedAgents,
  getAddedAgentsSuccess,
  getAddedAgentsFailure,
  getVoteList,
  getVoteListSuccess,
  getVoteListFailure,
  getOpenVoteList,
  getOpenVoteListSuccess,
  getOpenVoteListFailure,
  getOpenVoteListInit,
  getVoteInfo,
  getVoteInfoSuccess,
  getVoteInfoFailure,
  clearLoadedStakingStatus,
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
  getMyCoinNftsData,
  getMyCoinNftsDataSuccess,
  getMyCoinNftsDataFailure,
  getPreviewNftsData,
  getPreviewNftsDataSuccess,
  getPreviewNftsDataFailure,
  getNftsBalance,
  getNftsBalanceSuccess,
  getNftsBalanceFailure,
  getEANftsBalance,
  getEANftsBalanceSuccess,
  getEANftsBalanceFailure,
  resetIsGetEANftsBalanceSuccess,
  getAllNftsData,
  getAllNftsDataSuccess,
  getAllNftsDataFailure,
  resetAllNfts,
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
  resetSendMaticTxnConfirm,
  getTxnConfirm,
  getTxnConfirmSuccess,
  getTxnConfirmError,
  setTxnConfirmSuccess,
  setTxnConfirmError,
  resetTxnConfirmationData,
  getBids,
  getBidsSuccess,
  getBidsFailure,
  resetBids,
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
  resetPlayer1Contract,
  getBlockdeadline,
  getBlockdeadlineSuccess,
  getBlockdeadlineFailure,
  resetBlockdeadline,
  getCharts,
  getChartsSuccess,
  getChartsFailure,
  checkLaunchStatus,
  checkLaunchStatusSuccess,
  checkLaunchStatusFailure,
  clearCharts,
  launchCoin,
  launchCoinSuccess,
  launchCoinError,
  resetGoLive,
  createAuction,
  createRaffle,
  mintNft,
  allowStaking,
  staking,
  unstaking,
  claimReward,
  goToPlayer,
  resetGoToPlayer,
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
  savePlayerCustomisationInit,
  resetWhatsappUnverified,
  savePlayercardjson,
  getPurchaseContract,
  getPurchaseContractSuccess,
  getPurchaseContractFailure,
  approveTradeCurrency,
  approveTradeCurrencySuccess,
  approveTradeCurrencyFailure,
  buyPlayerCoinsInCurrency,
  buyPlayerCoinsInCurrencySuccess,
  resetBuyTxnHash,
  buyPlayerCoinsInCurrencyFailure,
  sellPlayerCoinsInCurrency,
  sellPlayerCoinsInCurrencySuccess,
  sellPlayerCoinsInCurrencyFailure,
  fetchPassportImage,
  fetchPassportImageSuccess,
  fetchPassportImageFailure,
  fetchPassportImageInit,
  approveProExchange,
  approveProExchangeSuccess,
  approveProExchangeError,
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
  fetchListPlayersHot,
  fetchListPlayersHotSuccess,
  fetchListPlayersHotFailure,
  fetchListPlayersFeatured,
  fetchListPlayersFeaturedSuccess,
  fetchListPlayersFeaturedFailure,
  fetchListPlayersNew,
  fetchListPlayersNewSuccess,
  fetchListPlayersNewFailure,
  fetchListPlayersCountry,
  fetchListPlayersCountrySuccess,
  fetchListPlayersCountryFailure,
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
  createKioskItem,
  createKioskItemFailure,
  createKioskItemSuccess,
  createKioskItemReset,
  searchTickerPlayers,
  searchTickerPlayersSuccess,
  searchTickerPlayersFailure,
  editKioskItem,
  showCreteKioskItemForm,
  switchItemToEdit,
  fetchListPlayersLanding,
  fetchListPlayersLandingSuccess,
  fetchListPlayersLandingFailure,
  clearPlayer1ContractSuccess,
  getSeasonDetails,
  getSeasonDetailsSuccess,
  getSeasonDetailsFailure,
  getUserEarlyAccessNft,
  getUserEarlyAccessNftSuccess,
  getUserEarlyAccessNftFailure,
  claimPrize,
  getSeasonPrize,
  getSeasonPrizeSuccess,
  getSeasonPrizeFailure,
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
  getLandingPlayerDataWithURL,
  getLandingPlayerData,
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
  clearLiveFeeds,
  updateFeedPlayers,
  getScoutsCount,
  getScoutsCountSuccess,
  getTourScoutsCount,
  getScoutsLeaderboard,
  getScoutsLeaderboardSuccess,
  getTourScoutsLeaderboard,
  updateScoutsLeaderboard,
  updateScoutsLeaderboardSuccess,
  getScoutsTop,
  getScoutsTopSuccess,
  getTourScoutsTop,
  getPlayersCount,
  getPlayersCountSuccess,
  getPlayersComingSoon,
  getPlayersComingSoonSuccess,
  getNewKioskItems,
  getNewKioskItemsSuccess,
  getNewKioskItemsFailure,
  getTopKioskItems,
  getTopKioskItemsSuccess,
  getTopKioskItemsFailure,
  getKioskKpi,
  getKioskKpiSuccess,
  getKioskKpiFailure,
  getAllKioskItems,
  getAllKioskItemsSuccess,
  getAllKioskItemsFailure,
  getRecentAquisitionItems,
  getRecentAquisitionItemsSuccess,
  getRecentAquisitionItemsFailure,
  getAllKioskItemsReset,
  getTopTrades,
  getUserTopTrades,
  getTopTradesSuccess,
  getTopTradesFailure,
  resetTopTrades,
} = playerCoinsSlice.actions
export default playerCoinsSlice.reducer
