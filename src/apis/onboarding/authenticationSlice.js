/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import { DummyUser, DummyUserList, DummyUserPlayerList } from '@root/constants'
import { publish } from '@utils/events'
import { asyncLocalStorage, getFlooredFixed } from '@utils/helpers'
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const loginId = localStorage.getItem('loginId')
const selectedThemeValue = localStorage.getItem('theme')

const initialState = {
  isAuthenticated: false,
  isNavigated: false,
  loader: false,
  customcardsetting: 2,
  nftVisible: false,
  blogVisible: true,
  blogLoaded: false,
  nft: [],
  curTab: 'profile',
  showTourModal: false,
  hideTourHeader: false,
  isTourXPClaimed: false,
  tourStep: '',
  tourCategoryId: 0,
  tourCategories: {
    1: false,
    2: false,
    3: false,
    4: false,
  },
  isGetTourCategoriesSuccess: false,
  isGetTourCategoriesError: '',
  fixedFooter: false,
  passphraseLoader: false,
  exportKeyLoader: false,
  isEmailVerified: false,
  isSentEmailVerificationMail: false,
  companyDetails: {},
  refreshingToken: false,
  userId: '',
  email: '',
  address: '',
  name: '',
  userType: '',
  isOtpSent: false,
  activeTab: '',
  isAccessToken: '',
  isLoggedOut: false,
  isLogging: false,
  isRefreshToken: '',
  userName: loginId,
  isSignupFormVisible: false,
  isWalletFormVisible: false,
  isPurchaseFormVisible: '',
  isStakingFormVisible: false,
  isNftFormVisible: false,
  isStakeFormShowed: false,
  isNftFormBid: false,
  isNftEndable: false,
  isGenesisNftFormVisible: false,
  isVisibleGenesisModal: false,
  genesisNft: null,
  isPlayerSelectionFormVisible: false,
  nft: null,
  playerData: null,
  isMandatory: false,
  isForceShowPopupSelected: false,
  defaultTab: 'Register',
  defaultWalletTab: 'Balance',
  isLoginError: '',
  isGetWalletError: '',
  isNoWallet: false,
  isSignupError: '',
  isOtpLoginError: '',
  isOtpLoginSuccess: '',
  otpAttempts: 3,
  isEmailResendError: '',
  isEmailResent: '',
  passwordResetError: '',
  passwordResetSuccess: '',
  resetPasswordSuccess: '',
  resetPasswordError: '',
  isVerifyEmailSuccess: '',
  isUserNewVerified: false,
  isVerifyEmailError: '',
  isWalletCreatedSuccess: '',
  walletNotSetup: false,
  isWalletCreatedError: '',
  stateAccessToken: '',
  isInvitationPopupShown: false,
  userWalletData: '',
  isCreateWalletDisabled: false,
  isSendingMatic: false,
  isSendMaticSuccess: '',
  sendMaticTxnId: '',
  isSendMaticError: '',
  isExportKeySuccess: '',
  isExportKeyError: '',
  exportSecretAttempts: 5,
  isGetAddressWalletError: '',
  isGetAddressWalletSuccess: false,
  nativeAmount: 0,
  isGetHeaderBalanceSuccess: false,
  isGetCountriesError: '',
  countriesData: [],
  delay: 0,
  secretInputAttempts: 5,
  isTransactionSuccess: '',
  isTransactionError: '',
  txnHash: '',
  isMandatory: false,
  publicIpAddress: '',
  publicIpAddressError: '',
  ipLocaleData: '',
  isEULocale: false,
  ipLocaleCurrency: null,
  ipLocaleCountryCode: null,
  ipLocaleCountryName: null,
  ipLocaleDataError: '',
  selectedLanguage: '',
  factsheetUrl: '',
  loadSelectedLanguage: false,
  resendOtpLoading: false,
  localeLoader: false, //isLocaleSet ? false : true,
  videoUrl: '',
  walletSeedLoader: false,
  getWalletSeedData: '',
  getWalletSeedDataError: '',
  walletAddress: '',
  walletDetailAddress: '',
  socialLoader: false,
  setSocialHandlesLinksData: '',
  setSocialHandlesLinksDataMessage: '',
  setSocialHandlesSuccess: false,
  setSocialHandlesLinksError: '',
  isLoadingChart: false,
  walletChartData: [],
  isGetWalletChartSuccess: false,
  isGetWalletChartError: '',
  playerCoinChartData: [],
  isGetPlayerCoinChartSuccess: false,
  isGetPlayerCoinChartError: '',
  isTransferLoading: false,
  isTransferTxnHash: '',
  isTransferredData: [],
  transferAmountError: '',
  isTransferredSuccess: '',
  getAmountLoading: false,
  getAmountError: '',
  getAmountSuccess: '',
  getAmountSuccessData: '',
  cryptoLoader: false,
  userWalletCryptoData: [],
  isGetWalletCryptoError: '',
  imageLoader: false,
  userPlayerImageData: [],
  isPlayerImageError: '',
  tempCardImage: null,
  notificationSettingsLoader: false,
  postNotificationSettingsLoader: false,
  isNotificationSettingsError: '',
  getNotificationSettingsData: [],
  postNotificationSettingsData: [],
  notificationLoader: false,
  isNotificationError: '',
  getNotificationData: [],
  getNotificationCount: 0,
  nextNotificationUrl: '',
  previousNotificationUrl: '',
  notificationCountLoader: false,
  getNotificationCountData: [],
  isNotificationCountError: '',
  liveNotificationLoader: false,
  dontShowLiveNotifications: false,
  breakRequestCount: 0,
  isLiveNotificationError: '',
  getLiveNotificationData: [],
  verifyWhatsAppLoader: false,
  isVerifyWhatsAppError: '',
  postVerifyWhatsAppData: '',
  postVerifyWhatsAppDataCheck: false,
  resendWhatsAppLoader: false,
  isResendWhatsAppError: '',
  postResendWhatsAppData: [],
  changeWhatsAppLoader: false,
  isChangeWhatsAppError: '',
  postChangeWhatsAppData: '',
  isVerifyWhatsAppTimeLeft: '',
  isResendWhatsAppTimeLeft: '',
  playerSettingsLoader: false,
  isPlayerSettingsError: '',
  postPlayerSettingsData: [],
  userSettingsLoader: false,
  getUserSettingsLoader: false,
  isUserSettingsError: '',
  isUserProfileError: '',
  isUserPublicProfileError: '',
  isGetUserSettingsSuccess: false,
  postUserSettingsData: [],
  getUserSettingsData: [],
  verifyUserSettingsWhatsAppLoader: false,
  isVerifyUserSettingsWhatsAppError: '',
  postVerifyUserSettingsWhatsAppData: [],
  isVerifyUserSettingsWhatsAppTimeLeft: '',
  changeUserSettingsWhatsAppLoader: false,
  isChangeUserSettingsWhatsAppError: '',
  postChangeUserSettingsWhatsAppData: '',
  resendUserSettingsWhatsAppLoader: false,
  isResendUserSettingsWhatsAppError: '',
  postResendUserSettingsWhatsAppData: '',
  isResendUserSettingsWhatsAppTimeLeft: '',
  isOlduser: false,
  currencyLoader: false,
  currencyError: '',
  currencyListData: [],
  wethCurrencyBalance: '',
  usdtCurrencyBalance: '',
  usdcCurrencyBalance: '',
  wbtcCurrencyBalance: '',
  isPayForItemVisible: false,
  payForItemName: '',
  payForItemPrice: '',
  kioskItem: false,
  kioskItemInfo: {},
  deliveryModeRedux: '',
  newVotingCreate: false,
  playerCoinSettingsMobileView: false,
  isGetFiatCurrencyListSuccess: false,
  isGetFiatCurrencyListError: '',
  fiatCurrencyList: [],
  isGetCurrencyRateSuccess: false,
  isGetCurrencyRateError: '',
  currencyRate: '1',
  euroRate: 1,
  newVotingCreate: false,
  playerCoinSettingsMobileView: false,
  selectedThemeRedux: selectedThemeValue === null ? 'Dark' : selectedThemeValue,
  setLoginEmail: '',
  invalidDevice: false,
  walletConnectConfirmPopUp: false,
  walletType: '',
  userCurrency: '',
  showChangeSecret: false,
  changeSecretOtpLoading: false,
  changeSecretOtpResponse: '',
  changeSecretOtpAttempts: 4,
  changeSecretLoading: false,
  changeSecretSuccess: '',
  changeSecretDone: false,
  changeSecretError: '',
  changeSecretTimeLeft: '',
  showKioskItemDetails: false,
  PendingKioskLoader: false,
  PendingKioskList: [],
  isGetPendingKioskListSuccess: false,
  isGetPendingKioskListError: '',
  FulfilledKioskLoader: false,
  FulfilledKioskList: [],
  isGetFulfilledKioskListSuccess: false,
  isGetFulfilledKioskListError: '',
  KioskOrderDetailLoader: false,
  KioskOrderDetail: [],
  KioskOrderDetailLink: '',
  isGetKioskOrderDetailSuccess: true,
  isGetKioskOrderDetailError: '',
  PlayerKioskLoader: false,
  PlayerKioskList: [],
  isGetPlayerKioskListSuccess: false,
  isGetPlayerKioskListError: '',
  postFulfillKioskOrderLoader: false,
  postFulfillKioskOrderData: '',
  postFulfillKioskOrderSuccess: false,
  postFulfillKioskOrderError: '',
  CheckPlayerCoinBalLoader: false,
  CheckPlayerCoinBal: '',
  isGetCheckPlayerCoinBalSuccess: false,
  isGetCheckPlayerCoinBalError: '',
  postPlaceKioskOrderLoader: false,
  postPlaceKioskOrderHash: '',
  postPlaceKioskOrderSuccess: false,
  postPlaceKioskOrderError: '',
  postKioskItemPaymentLoader: false,
  postKioskItemPaymentHash: '',
  postKioskItemPaymentSuccess: false,
  postKioskItemPaymentError: '',
  KioskItemDetailLoader: false,
  KioskItemDetail: [],
  isGetKioskItemDetailSuccess: false,
  isGetKioskItemDetailError: '',
  showKioskItemDetailsBuy: false,
  sendTransOtpLoader: false,
  sendTransOtpSuccessData: false,
  sendTransOtpErrorData: '',
  sendTransOtpSuccessDataMessage: '',
  otpAttemptsLeft: '',
  blockedTimeLeft: '',
  postUploadFileLoader: false,
  postUploadFileSuccessData: false,
  postUploadFileError: '',
  postUploadFileSuccessDataLink: '',
  getDigitalItemLoader: false,
  getDigitalItemSuccess: false,
  getDigitalItemSuccessData: '',
  getDigitalItemError: '',
  referralDataLoader: false,
  referralDataSuccess: [],
  referralDataError: '',
  externalWalletError: '',
  externalWalletSuccess: false,
  bypassAppQualification: false,
  postReferralPayoutLoader: false,
  postReferralPayoutSuccess: '',
  postReferralPayoutHash: '',
  postReferralPayoutError: '',
  PendingKioskListCount: 0,
  nextPendingKioskListUrl: '',
  previousPendingKioskListUrl: '',
  checkWatchListLoader: false,
  checkWatchListSuccess: false,
  checkWatchListError: '',
  watchListLoader: false,
  watchListDataSuccess: false,
  watchListSuccess: '',
  watchListError: '',
  generalSettingsLoading: false,
  generalSettingsData: null,
  generalSettingsError: '',
  watchListLoading: false,
  watchListData: [],
  watchListError: '',
  latestTradeLoader: false,
  getLatestTradeData: [],
  getLatestTradeCount: 0,
  latestTradeHistoryLoader: false,
  latestTradeHistoryData: [],
  nextLatestTradeUrl: '',
  previousLatestTradeUrl: '',
  isLatestTradeError: '',
  showLatestTransaction: false,
  internalBalanceLive: null,
  cartoonStatusLoader: false,
  cartoonStatusData: true,
  cartoonStatusSuccess: false,
  loadingUserRankingList: false,
  userRankingList: [],
  userRankingListCount: 0,
  nextUserRankingListUrl: '',
  isUserRankingListSuccess: false,
  isUserRankingListError: '',
  loadingUserPlayerCoinList: false,
  userPlayerCoinList: [],
  userPlayerCoinListCount: 0,
  nextUserPlayerCoinListUrl: '',
  isUserPlayerCoinListSuccess: false,
  isUserPlayerCoinListError: '',
  loadingUserNftList: false,
  userNftList: [],
  userNftListCount: 0,
  nextUserNftListUrl: '',
  isUserNftListSuccess: false,
  isUserNftListError: '',
  userProfile: null,
  userPublicProfile: null,
  fanClubLoader: false,
  fanClubData: [],
  fanClubCount: 0,
  nextFanClubUrl: '',
  previousFanClubUrl: '',
  fanClubError: '',
  isFetchPlayerSuccess: '',
  openMenu: false,
  playerMode: false,
  landingNavigateIndex: 0,
  getNftImageLoader: false,
  getNftImageData: '',
  getNftImageError: '',
  centralContract: null,
  centralContractAbi: null,
  goLiveLoading: false,
  blockLoader: false,
  blockPerSecond: null,
  blockError: '',
  ownerListLoader: false,
  ownerListData: [],
  ownerListError: '',
  showPlayerShareXpValue: false,
  playerShareHold: 0,
  playerShareStaked: 0,
  playerShareLoader: false,
  playerShareError: '',
  xpRate: 1000,
  totalXp: 0,
  earnedXp: 0,
  isXpNotificationVisible: false,
  isFirstLoadingXp: false,
  loadingXp: false,
  claimableXpLoader: false,
  claimableXpData: [],
  claimableXpError: '',
  nextAvailabilityForActivityLoader: false,
  nextAvailabilityForActivityData: [],
  nextAvailabilityForActivityError: '',
  draftingReallocationPercentageLoader: false,
  draftingReallocationPercentageData: null,
  draftingReallocationPercentageError: '',
  playerPayoutAddressLoader: false,
  playerPayoutAddressData: null,
  playerPayoutAddressError: '',
  stakingRewardXpLoader: false,
  stakingRewardXpData: null,
  stakingRewardXpError: '',
  nextPossibleClaimLoader: false,
  nextPossibleClaimData: null,
  nextPossibleClaimError: '',
  balanceOfAllowanceLoader: false,
  balanceOfAllowanceData: null,
  balanceOfAllowanceError: '',
  centralNftContract: null,
  centralNftContractAbi: null,
  showGenesisRequired: true,
  newBuySellForm: 0,
  privyWallets: [],
  claimableCountLoader: false,
  claimableCountData: 0,
  claimableCountError: '',
  QualificationSettingLoader: false,
  QualificationSettingData: null,
  enablecreditcardpurchase: false,
  appGoLiveTimestamp: null,
  genesisGoLiveTimestamp: null,
  QualificationSettingError: '',
  qualifiedPublicKey: '',
  qualifiedInviteLinked: false,
  isInviteCodeVerifying: false,
  verifyInviteCodeSuccessData: '',
  verifyReferCodeSuccessData: '',
  isLastReferralInputInvalid: false,
  verifyInviteCodeError: '',
  codeType: null,
  linkInviteLoading: false,
  linkInviteSuccessData: '',
  isFireShownOnInviteLinkSuccess: false,
  linkInviteError: '',
  sharePopWallet: false,
  playerReferralDataLoader: false,
  playerReferralDataSuccess: [],
  playerReferralDataError: '',
  cloudFlareError: '',
  cloudFlareTokenReset: false,
  isShownAddToHomePopup: true,
  referralLinkCode: null,
  isLandingShown: false,
  pwaPrompt: null,
  showMore: false,
  kioskItemTempLoader: false,
  kioskItemTempData: 0,
  kioskItemTempError: '',
  checkItemTempLoader: false,
  checkItemTempData: '',
  checkItemTempError: '',
  timerFinished: false,
  itemCategoriesListLoader: false,
  itemCategoriesListData: [],
  itemCategoriesListError: '',
  deleteKioskImageLoader: false,
  deleteKioskImageError: '',
  deleteKioskImageData: [],
  checkTradingStatusLoader: false,
  checkTradingStatusError: '',
  checkTradingStatusData: true,
  kioskCategoriesLoader: false,
  kioskCategoriesData: [],
  kioskCategoriesError: '',
  kioskCategoriesDetailLoader: false,
  kioskCategoriesDetailSuccess: [],
  kioskCategoriesDetailError: '',
  appInstallFlag: false,
}

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login(state, action) {
      state.loader = true
      state.isLoginError = ''
    },
    loginSuccess(state, action) {
      state.loader = false
      state.isEmailVerified = action.payload.is_email_verified
      state.isAuthenticated = action.payload.is_email_verified
      state.companyDetails = action.payload.company_details
      state.userType = action.payload.type
      state.isOtpSent = true
    },
    emailConfirmReset(state) {
      state.isEmailVerified = true
    },
    loginFailure(state, action) {
      const { payload } = action
      state.loader = false
      state.isAuthenticated = false
      state.isOtpSent = false
      state.userName = ''
      state.isLoginError =
        payload?.response?.data?.detail || payload?.response?.data?.message
    },
    loginReset(state) {
      state.loader = false
      state.isAuthenticated = false
      state.isOtpSent = false
      state.userName = ''
      state.isLoginError = ''
      // state.loader = false
      // state.isAuthenticated = false
      // state.userName = loginId
      state.otpAttempts = 3
      state.isOtpLoginError = ''
    },
    loginWithOtp(state, action) {
      state.loader = true
      state.isOtpLoginError = ''
      state.isOlduser = false
    },
    loginWithOtpSuccess(state, action) {
      const { payload } = action
      state.loader = false
      state.isEmailVerified = action.payload.is_email_verified
      state.isAuthenticated = action.payload.is_email_verified
      state.isOtpLoginSuccess = payload.message
      state.isOtpLoginError = ''
      state.otpAttempts = 3
      state.stateAccessToken = payload.data.access
      state.isLoggedOut = false
      state.userName = payload.data.user
      localStorage.setItem('loginId', payload.data.user)
      localStorage.setItem('accessToken', payload.data.access)
      localStorage.setItem('refreshToken', payload.data.refresh)
      state.invalidDevice = false
    },
    resendOtp(state, action) {
      state.resendOtpLoading = true
      state.resendOtpError = ''
      state.resendOtpSuccess = ''
    },
    resendOtpSuccess(state, action) {
      const { payload } = action
      state.resendOtpLoading = false
      state.resendOtpError = ''
      state.resendOtpSuccess = payload.message
    },
    resendOtpError(state, action) {
      const { payload } = action
      state.resendOtpLoading = false
      state.resendOtpError = 'error'
      state.resendOtpSuccess = ''
    },
    resetResendOtp(state) {
      state.resendOtpError = ''
      state.resendOtpSuccess = ''
    },
    loginWithWallet(state, action) {
      state.loader = true
      state.isLoginError = ''
      state.isLoggedOut = false
      state.externalWalletSuccess = false
      state.isLogging = true
      state.externalWalletError = ''
      state.linkInviteSuccessData = ''
    },
    testSuccess(state, action) {
      console.log('lwwtstSUc--', { action })
    },
    loginWithWalletSuccess(state, action) {
      console.log('loginWalletSliceSuccess')
      state.isLogging = false
      const { payload } = action
      const referralId = window?.location?.pathname?.split('/')?.pop()
      try {
        state.loader = false
        state.stateAccessToken = payload.token
        console.log({
          action,
          llp: window.location.pathname,
          qualStat: state.QualificationSettingData,
          referralId,
        })
        // if (window.location.pathname.includes('invite')) {
        //   if (referralId.length > 0 && state.QualificationSettingData === 1) {
        //     state.isInvitationPopupShown = true //payload.show_invitation_popup
        //   } else {
        //     state.isInvitationPopupShown = payload.show_invitation_popup
        //   }
        // }
        state.walletAddress = localStorage.getItem('loginInfo')
        state.externalWalletError = ''
        localStorage.setItem('accessToken', payload.token)
        state.externalWalletSuccess = true
        state.bypassAppQualification = action?.payload?.bypass_app_qualification
        if (state.bypassAppQualification) {
          state.QualificationSettingData = 3
          localStorage.setItem('bypassAppQualification', true)
        } else {
          localStorage.removeItem('bypassAppQualification')
        }
        publish('externalWalletSuccess')

        // const cookieData = {
        //   accessToken: payload.token,
        //   loginInfo: localStorage.getItem('loginInfo'),
        //   wallet: localStorage.getItem('wallet'),
        //   externalWalletAddress: localStorage.getItem('externalWalletAddress'),
        //   privyToken: localStorage.getItem('privy:token'),
        //   privyRefreshToken: localStorage.getItem('privy:refresh_token'),
        //   privyConnections: localStorage.getItem('privy:connections'),
        // }
        // var cookieValue = JSON.stringify(cookieData)
        // const oneYearFromNow = new Date()
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
        // cookies.set('authInfo', encodeURIComponent(cookieValue), {
        //   path: '/',
        //   expires: oneYearFromNow,
        //   domain: '.mecarreira.com',
        // })
      } catch (error) {
        console.log('tesla--', error)
      }
    },
    loginWithWalletCookie(state) {
      //Set localstorage values from main domain cookie
      state.loader = false
      state.stateAccessToken = localStorage.getItem('accessToken')
      state.walletAddress = localStorage.getItem('loginInfo')
      state.externalWalletError = ''
      state.externalWalletSuccess = true
      state.isLoggedOut = false
    },

    loginWithWalletFailure(state, action) {
      const { payload } = action
      console.log('loginWalletSliceFailure')
      state.isLogging = false
      console.log('loginWithWalletFailure', action)
      state.loader = false
      state.isLoginError = payload.response.data.detail
      state.externalWalletError = payload.response.data.message
      localStorage.removeItem('loginInfo')
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('bypassAppQualification')
      state.externalWalletSuccess = false
    },
    resetExternalWalletSuccess(state) {
      console.log('hello reset wallet success')
      state.externalWalletSuccess = false
    },
    setBlogLoaded(state) {
      state.blogLoaded = true
    },
    getNft(state, action) {
      const { payload } = action
      state.nftVisible = payload.data.is_nft_visible
      state.nft = payload.data.nft_list
      state.blogVisible = payload.data.is_blog_visible
    },
    setCurTab(state, action) {
      const { payload } = action
      state.curTab = payload.curTab
    },
    getWalletDetails(state) {
      state.loader = true
      state.walletLoading = true
      state.isGetWalletError = ''
      state.isCreateWalletDisabled = false
      state.isGetAddressWalletSuccess = false
      state.walletDetailAddress = 'selected'
    },
    setWalletSuccessInit(state) {
      state.isGetAddressWalletSuccess = false
    },
    getWalletSuccess(state, action) {
      console.log('GWS--', { action, localRate: state?.currencyRate })
      localStorage.setItem('userWalletAddress', action.payload.message.address)
      state.loader = false
      state.walletLoading = false
      state.userWalletData = action.payload.message
      try {
        const amount = getFlooredFixed(
          action?.payload?.message?.USDBalance * state?.currencyRate,
          2,
        )
        state.nativeAmount = amount || 'jjj'
        state.isGetAddressWalletSuccess = true
      } catch (error) {
        console.log('getWalletSuccess---', error)
      }
      state.isGetWalletError = ''
      state.isMandatory = false
      state.walletAddress = action.payload.message.address
      state.isOlduser = action.payload?.data?.createBasicWallet
    },
    getWalletFailure(state, action) {
      console.log('psv', { action })
      state.loader = false
      state.isOlduser = action.payload?.data?.createBasicWallet
      state.walletLoading = false
      state.isWalletCreatedSuccess = ''
      if (
        action.payload.response?.status === 500 ||
        action.payload?.status === 500
      ) {
        state.isGetWalletError = 'Network Error'
        state.isCreateWalletDisabled = true
      } else {
        if (
          action?.payload?.status === 404 &&
          action?.payload?.data?.message === 'Wallet is not available'
        ) {
          state.walletNotSetup = true
        } else if (action?.payload?.data?.walletcreated === false) {
          state.isGetWalletError = ' '
          state.isNoWallet = true
        } else {
          state.isGetWalletError = 'Some error occured'
          state.isCreateWalletDisabled = true
        }
      }
    },
    getLiveBalance(state) {
      return state
    },
    getLiveBalanceSuccess(state, action) {
      const amount = action?.payload?.message?.balance
      state.internalBalanceLive = amount
    },
    getLiveBalanceFailure(state) {
      state.internalBalanceLive = null
    },
    setWalletAddress(state, action) {
      state.walletAddress = action.payload
    },
    getCountries(state) {
      state.loader = true
      state.isGetCountriesError = ''
    },
    getCountriesSuccess(state, action) {
      state.loader = false
      state.countriesData = action.payload
      state.isGetCountriesError = ''
    },
    getCountriesFailure(state, action) {
      state.loader = false
      if (action.payload.response?.status === 500) {
        state.isGetCountriesError = 'Network Error'
      } else {
        if (action.payload.response?.status === 404) {
          state.isGetCountriesError = ''
        } else {
          state.isGetCountriesError =
            'Some error occured. Unable to fetch countries'
        }
      }
    },
    getNotification(state) {
      state.loader = true
    },
    getNotificationSuccess(state, action) {
      state.loader = false
      state.delay = action.payload.data.delay
    },
    getNotificationFailure(state, action) {
      state.loader = false
    },
    getWalletAddress(state, action) {
      // state.loader = true
      state.walletLoading = true
      state.isGetAddressWalletError = ''
      state.isCreateWalletDisabled = false
      state.isGetAddressWalletSuccess = false
      state.walletDetailAddress = action.payload
    },
    getWalletAddressSuccess(state, action) {
      console.log('GWAS--', { action, localRate: state?.currencyRate })
      // state.loader = false
      state.walletLoading = false
      state.userWalletData = action.payload.message
      state.userWalletData.balance = action.payload.message.balance
      state.userWalletData.USDBalance = Number.parseFloat(
        state.userWalletData.USDBalance,
      ).toFixed(2)
      const amount = getFlooredFixed(
        action?.payload?.message?.USDBalance * state?.currencyRate,
        2,
      )
      state.nativeAmount = amount
      state.isGetAddressWalletError = ''
      state.isGetAddressWalletSuccess = true
    },
    getWalletAddressFailure(state, action) {
      // state.loader = false
      state.walletLoading = false
      if (action.payload.response?.status === 500) {
        state.isGetAddressWalletError = 'Network Error'
        state.isCreateWalletDisabled = true
      } else {
        if (action.payload.response?.status === 404) {
          state.isGetAddressWalletError = ''
        } else {
          state.isGetAddressWalletError = 'Some error occured'
        }
      }
    },
    getHeaderBalance(state) {
      // state.loader = true
      state.walletLoading = true
      state.isGetAddressWalletError = ''
      state.isCreateWalletDisabled = false
      state.isGetAddressWalletSuccess = false
      state.isGetHeaderBalanceSuccess = false
      // state.walletDetailAddress = action.payload
    },
    getHeaderBalanceSuccess(state, action) {
      console.log('GWHBS--', { action, localRate: state?.currencyRate })
      // state.loader = false
      state.walletLoading = false
      // state.userWalletData = action.payload.message
      // state.userWalletData.balance = action.payload.message.balance
      // state.userWalletData.USDBalance = Number.parseFloat(
      //   state.userWalletData.USDBalance,
      // ).toFixed(2)
      const amount = getFlooredFixed(
        action?.payload?.message?.USDBalance * state?.currencyRate,
        2,
      )
      state.nativeAmount = amount
      state.isGetAddressWalletError = ''
      state.isGetAddressWalletSuccess = true
      state.isGetHeaderBalanceSuccess = true
    },
    getHeaderBalanceFailure(state, action) {
      // state.loader = false
      state.walletLoading = false
      if (action.payload.response?.status === 500) {
        state.isGetAddressWalletError = 'Network Error'
        state.isCreateWalletDisabled = true
      } else {
        if (action.payload.response?.status === 404) {
          state.isGetAddressWalletError = ''
        } else {
          state.isGetAddressWalletError = 'Some error occured'
        }
      }
    },
    resetWallet(state) {
      state.loader = false
      state.walletLoading = false
      state.userWalletData = ''
      state.isGetAddressWalletError = ''
      state.isCreateWalletDisabled = false
      state.isGetAddressWalletSuccess = false
    },
    loginWithOtpFailure(state, action) {
      const { payload } = action
      state.loader = false
      state.isAuthenticated = false
      state.userName = ''
      state.otpAttempts = state.otpAttempts - 1
      state.isOtpLoginError = payload.response.data.message
    },
    signUp(state, action) {
      state.loader = true
      state.isSignupError = ''
    },
    signUpSuccess(state, action) {
      state.loader = false
      state.isSentEmailVerificationMail = true
      state.email = action.payload
      state.isSignupError = ''
    },
    closeEmailVerification(state) {
      state.isSentEmailVerificationMail = false
      state.activeTab = 'login'
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload
    },
    resetSentEmailVerification(state) {
      state.loader = false
      state.isSentEmailVerificationMail = false
      state.isOtpSent = false
      state.defaultTab = 'register'
    },
    resetOtp(state) {
      state.isOtpLoginSuccess = ''
    },
    signUpFailure(state, action) {
      const { payload } = action
      state.loader = false
      state.isSignupError = payload.response.data.message
    },
    forgotPassword(state, action) {
      state.loader = true
      state.resetPasswordError = ''
    },
    forgotPasswordSuccess(state, action) {
      state.loader = false
      state.resetPasswordError = ''
      state.resetPasswordSuccess = action.payload.message
    },
    forgotPasswordFailure(state, action) {
      state.loader = false
      state.resetPasswordError = action.payload.response.data.message
    },
    resetFormPassword(state) {
      state.resetPasswordError = ''
      state.resetPasswordSuccess = ''
    },
    signout(state) {
      state.loader = false
      state.isLoggedOut = true
      state.stateAccessToken = ''
      state.isNoWallet = false
      state.userProfile = null
      localStorage.removeItem('loginInfo')
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('externalWalletAddress')
      localStorage.removeItem('balance')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('wallet')
      localStorage.removeItem('playercontract')
      localStorage.removeItem('showMyCoin')
      localStorage.removeItem('privy:connections')
      localStorage.removeItem('bypassAppQualification')
      localStorage.removeItem('setWelcomeTime')
      console.log('==== sign out =====')
      cookies.remove('authInfo', { path: '/', domain: '.mecarreira.com' })
    },
    logout(state, action) {
      console.log('logoutAPI_Called_at', action.payload.location)
      state.loader = true
      state.isNoWallet = false
      state.isLoggedOut = true
      state.isAuthenticated = false
      state.userName = null
      state.stateAccessToken = ''
      state.isAccessToken = ''
      state.isRefreshToken = ''
      state.isOtpLoginSuccess = ''
      state.userCurrency = ''
      state.walletDetailAddress = ''
      state.userProfile = null
      state.walletNotSetup = false
      state.qualifiedInviteLinked = false
      state.referralDataSuccess = null
      localStorage.removeItem('referral_code')
      state.postVerifyWhatsAppDataCheck = false
      state.isFireShownOnInviteLinkSuccess = false
      state.isLastReferralInputInvalid = false
      // localStorage.removeItem('wallet')
      // asyncLocalStorage.removeItem('walletCreated')
      // asyncLocalStorage.removeItem('refreshToken')
      // asyncLocalStorage.removeItem('accessToken')
      // asyncLocalStorage.removeItem('loginId')
      // asyncLocalStorage.removeItem('loginInfo')
      // asyncLocalStorage.removeItem('playercontract')
      // asyncLocalStorage.removeItem('showMyCoin')
      // asyncLocalStorage.removeItem('ISGOLIVECLICKED')
    },
    logoutSuccess(state, action) {
      state.loader = false
      localStorage.removeItem('loginInfo')
      localStorage.removeItem('balance')
      localStorage.removeItem('wallet')
      localStorage.removeItem('bypassAppQualification')
      localStorage.removeItem('setWelcomeTime')
      asyncLocalStorage.removeItem('walletCreated')
      asyncLocalStorage.removeItem('refreshToken')
      asyncLocalStorage.removeItem('accessToken')
      asyncLocalStorage.removeItem('loginId')
      asyncLocalStorage.removeItem('loginInfo')
      asyncLocalStorage.removeItem('externalWalletAddress')
      asyncLocalStorage.removeItem('playercontract')
      asyncLocalStorage.removeItem('showMyCoin')
      asyncLocalStorage.removeItem('ISGOLIVECLICKED')
      asyncLocalStorage.removeItem('launchMode')
      asyncLocalStorage.removeItem('privy:connections')
      console.log('==== log out =====')

      cookies.remove('authInfo', { path: '/', domain: '.mecarreira.com' })
    },
    logoutFailure(state, action) {
      state.loader = false
      localStorage.removeItem('loginInfo')
      localStorage.removeItem('balance')
      localStorage.removeItem('wallet')
      localStorage.removeItem('bypassAppQualification')
      asyncLocalStorage.removeItem('walletCreated')
      asyncLocalStorage.removeItem('refreshToken')
      asyncLocalStorage.removeItem('accessToken')
      asyncLocalStorage.removeItem('loginId')
      asyncLocalStorage.removeItem('loginInfo')
      asyncLocalStorage.removeItem('externalWalletAddress')
      asyncLocalStorage.removeItem('playercontract')
      asyncLocalStorage.removeItem('showMyCoin')
      asyncLocalStorage.removeItem('ISGOLIVECLICKED')
      asyncLocalStorage.removeItem('launchMode')
      asyncLocalStorage.removeItem('privy:connections')
      console.log('==== log out =====')

      cookies.remove('authInfo', { path: '/', domain: '.mecarreira.com' })
    },

    resetPassword(state, action) {
      state.loader = true
    },
    resetPasswordSuccess(state, action) {
      state.loader = false
      state.passwordResetError = ''
      state.passwordResetSuccess = action.payload.message
    },
    resetPasswordFailure(state, action) {
      state.loader = false
      state.passwordResetError = action.payload.response.data.message
    },
    setLoading(state, action) {
      state.loader = action.payload
    },
    changePassword(state) {
      state.loader = true
    },
    emailConfirmation(state) {
      state.loader = true
    },
    resendEmail(state, action) {
      state.loader = true
    },
    resendEmailSuccess(state, action) {
      state.loader = false
      if (action.payload.success) {
        state.isEmailResent = action.payload.message
      } else {
        state.isEmailResendError = action.payload.message
      }
    },
    resendEmailFailure(state, action) {
      const { payload } = action
      state.loader = false
      state.isEmailResendError = payload.response.data.message
    },

    verifyEmail(state, action) {
      state.loader = true
    },
    verifyEmailSuccess(state, action) {
      state.loader = false
      localStorage.setItem('loginId', action.payload.email)
      localStorage.setItem('accessToken', action.payload.data.accessToken)
      localStorage.setItem('refreshToken', action.payload.data.refreshToken)
      state.refreshingToken = false
      state.isVerifyEmailSuccess = true
      state.isUserNewVerified = true
      state.isVerifyEmailError = ''
      state.isAccessToken = action.payload.data.access
      state.isRefreshToken = action.payload.data.refresh
      state.userName = action.payload.email
    },
    verifyEmailFailure(state, action) {
      const { payload } = action
      state.loader = false
      state.isVerifyEmailError = payload.response.data.message
    },
    resendEmailConfirmation(state) {
      state.loader = true
    },
    refreshToken(state, action) {
      state.loader = true
    },
    refreshTokenSuccess(state, action) {
      const { payload } = action
      state.loader = false
      state.isAccessToken = action.payload.data.access
      state.isRefreshToken = action.payload.data.refresh
      state.userName =
        action.payload.data.user || action.payload.data.email || ''
      state.stateAccessToken = payload.data.access
      localStorage.setItem('accessToken', payload.data.access)
      localStorage.setItem('refreshToken', payload.data.refresh)
    },
    refreshTokenFailure(state, action) {
      state.loader = false
      state.isAccessToken = ''
      state.isRefreshToken = ''
      state.userName = ''
      state.stateAccessToken = ''
    },
    resetUserName(state) {
      state.userName = ''
    },
    getUserDetails(state) {
      state.refreshingToken = false
    },
    showSignupForm(state) {
      state.isSignupFormVisible = !state.isSignupFormVisible
      state.isVisibleModal = state.isSignupFormVisible
      state.isOtpSent = false
      state.isSentEmailVerificationMail = false
      state.defaultTab = 'Register'
    },
    forceShowPopup(state, action) {
      state.isForceShowPopupSelected = action.payload
    },
    showWalletForm(state, action) {
      state.isWalletFormVisible = !state.isWalletFormVisible
      state.isVisibleModal = state.isWalletFormVisible
      state.defaultWalletTab = 'Balance'
      if (action?.payload?.isMandatory) {
        state.isMandatory = true
      }
    },
    showNftDetailForm(state, action) {
      state.isNftDetailFormVisible = action?.payload?.isNftDetailFormVisible
    },
    showPurchaseForm(state, action) {
      state.isPurchaseFormVisible = action?.payload?.mode ?? ''
      state.isVisibleModal = action?.payload?.mode ? true : false
      state.playerData = action?.payload?.playerData
    },
    showStakingForm(state, action) {
      state.isStakingFormVisible = !state.isStakingFormVisible
      state.isVisibleModal = state.isStakingFormVisible
      state.playerData = action?.payload?.playerData
    },
    showNftForm(state, action) {
      state.isNftFormVisible = !state.isNftFormVisible
      state.isVisibleModal = state.isNftFormVisible
      state.isNftFormBid = action?.payload?.isBid
      state.isNftEndable = action?.payload?.isEndable
      state.nft = action?.payload?.nft
    },
    showGenesisNftForm(state, action) {
      console.log('SGNF_called')
      state.isGenesisNftFormVisible = true
      state.isVisibleGenesisModal = state.isGenesisNftFormVisible
      state.genesisNft = action?.payload?.nft
    },
    hideGenesisNftForm(state) {
      state.isGenesisNftFormVisible = false
      state.isVisibleGenesisModal = false
      state.genesisNft = null
    },
    setStakeFormShowed(state) {
      state.isStakeFormShowed = !state.isStakeFormShowed
    },
    showPlayerSelectionForm(state) {
      state.isPlayerSelectionFormVisible = !state.isPlayerSelectionFormVisible
      state.isVisibleModal = state.isPlayerSelectionFormVisible
      if (state.isPlayerSelectionFormVisible) {
        localStorage.setItem('isPlayerSelectionFormVisible', 'true')
      } else {
        localStorage.removeItem('isPlayerSelectionFormVisible')
      }
    },
    removeMandatory(state) {
      state.isMandatory = false
    },
    getUserDetailsSuccess(state, action) {
      const {
        type,
        name,
        email,
        user_id: userId,
        is_email_verified: isEmailVerified,
      } = action.payload

      return {
        ...state,
        name,
        email,
        userId,
        userType: type,
        isEmailVerified,
        refreshingToken: false,
      }
    },
    getUserDetailsFailure(state) {
      state.refreshingToken = false
    },
    createWallet(state, action) {
      state.loader = true
      state.isCreateWalletError = ''
      state.walletNotSetup = false
    },
    createWalletSuccess(state, action) {
      state.loader = false
      state.isWalletCreatedSuccess = action.payload.message
      state.isNoWallet = false
      state.isUserNewVerified = false
    },
    createWalletFailure(state, action) {
      const { payload } = action
      state.loader = false
      localStorage.removeItem('walletCreated')
      state.isWalletCreatedError = 'The creation of wallet failed.'
    },
    //---------------------------------------- BUY_NFT_SLICE_METHODS----------------------------------------//

    fetchPurchaseDetails(state) {
      state.loader = true
    },
    fetchPurchaseDetailsSuccess(state) {
      state.loader = false
    },
    fetchPurchaseDetailsFailure(state) {
      state.loader = false
    },
    changeNftValue(state, action) {
      state.loadingBuy = true
    },
    changeNftValueSuccess(state, action) {
      state.loadingBuy = false
    },
    changeNftValueFailure(state, action) {
      const { payload } = action
      state.loadingBuy = false
    },

    //---------------------------------------- SEND_NFT_SLICE_METHODS----------------------------------------//
    sendMatics(state, action) {
      state.isSendMaticError = ''
      state.passphraseLoader = true
      state.isSendingMatic = true
    },
    sendMaticsSuccess(state, action) {
      state.passphraseLoader = false
      state.isSendingMatic = false
      state.isSendMaticSuccess = action.payload.message
      state.sendMaticTxnId = action.payload.data.txn_hash
    },
    sendMaticsFailure(state, action) {
      const { payload } = action
      const attempts = state.secretInputAttempts
      state.passphraseLoader = false
      state.isSendingMatic = false
      state.isSendMaticSuccess = ''
      state.sendMaticTxnId = ''
      if (action.payload.response?.status === 500) {
        state.secretInputAttempts = attempts - 1
        state.isSendMaticError =
          payload.response.data.message || 'Passphrase Error'
        state.isCreateWalletDisabled = true
      } else {
        if (action.payload.response?.status === 404) {
          state.isSendMaticError = ''
        } else {
          state.isSendMaticError = 'Some error occured'
        }
      }
    },
    resetSendMatics(state) {
      state.passphraseLoader = false
      state.isSendMaticSuccess = ''
      state.sendMaticTxnId = ''
      state.isTransferTxnHash = ''
    },
    sendMaticsReset(state) {
      state.passphraseLoader = false
      state.isSendMaticSuccess = ''
      state.isSendMaticError = ''
      state.secretInputAttempts = 5
    },

    resetSecretInputAttempts(state) {
      state.secretInputAttempts = 5
    },
    restrictSecretInput(state) {
      state.secretInputAttempts = 0
    },
    transaction(state) {
      state.passphraseLoader = true
      state.isTransactionSuccess = ''
      state.isTransactionError = ''
    },
    transactionSuccess(state, action) {
      state.passphraseLoader = false
      state.isTransactionSuccess = action.payload.message
      state.txnHash = action.payload?.hash
      state.secretInputAttempts = 5
    },
    transactionFailure(state, action) {
      state.passphraseLoader = false
      state.isTransactionError = action.payload.response.data.message
      state.otpAttemptsLeft = action.payload.response.data.attempts
      const attempts = state.secretInputAttempts
      if (
        state.isTransactionError.toLowerCase().includes('incorrect secret key')
      ) {
        state.secretInputAttempts = attempts - 1
      } else {
        state.isTransactionError =
          state.isTransactionError ?? 'Transaction failed.'
      }
      state.blockedTimeLeft = action.payload.response.data.time_left
    },
    resetTransaction(state) {
      state.passphraseLoader = false
      state.isTransactionSuccess = ''
      state.isTransactionError = ''
      state.txnHash = ''
      state.isTransferTxnHash = ''
    },
    sendMaticsMetamask(state) {
      state.passphraseLoader = true
      state.isSendMaticSuccess = ''
      state.isSendMaticError = ''
    },
    exportKey(state, action) {
      state.isExportKeyError = ''
      state.exportKeyLoader = true
    },
    exportKeySuccess(state, action) {
      state.exportKeyLoader = false
      state.isExportKeySuccess = action.payload.data.user_data
      state.exportSecretAttempts = 5
    },
    exportKeyError(state, action) {
      const { payload } = action
      const attempts = state.exportSecretAttempts
      state.exportKeyLoader = false
      if (action.payload.response?.status === 500) {
        state.isExportKeyError =
          payload.response.data.message || 'Network Error'
        state.isCreateWalletDisabled = true
        state.exportSecretAttempts = attempts - 1
      } else {
        if (action.payload.response?.status === 404) {
          state.isExportKeyError = ''
        } else {
          state.isExportKeyError = 'Some error occured'
        }
      }
    },
    exportKeyReset(state) {
      state.exportKeyLoader = false
      state.isExportKeySuccess = ''
      state.isExportKeyError = ''
      state.exportSecretAttempts = 5
    },
    exportKeyRestrict(state) {
      state.exportSecretAttempts = 0
    },
    getIpAddress(state) {
      state.publicIpAddress = ''
      state.loader = true
    },
    getIpAddressSuccess(state, action) {
      state.publicIpAddress = ''
      state.loader = false
    },
    getIpAddressFailure(state, action) {
      state.publicIpAddress = ''
      state.publicIpAddressError = 'Error fetching your IP Address'
      state.loader = false
    },
    getIpLocaleCurrency(state) {
      state.ipLocaleCurrency = null
      state.loader = true
    },
    getIpLocaleCurrencySuccess(state, action) {
      state.ipLocaleCurrency = action?.payload
      state.loader = false
    },
    getIpLocaleCurrencyFailure(state, action) {
      state.ipLocaleCurrency = 'USD'
      state.loader = false
    },
    checkEUCountry(state) {
      state.isEULocale = false
    },
    checkEUCountrySuccess(state, action) {
      state.isEULocale = action?.payload
    },
    checkEUCountryFailure(state, action) {
      state.isEULocale = false
    },
    getIpBasedLocale(state) {
      state.localeLoader = true
      state.ipLocaleDataError = ''
    },
    getIpBasedLocaleSuccess(state, action) {
      state.localeLoader = false
      const langSet = action?.payload?.location?.languages
      state.ipLocaleData = langSet
      state.ipLocaleDataError = action?.payload?.error?.info
      state.ipLocaleCountryCode = action?.payload?.country_code
      state.ipLocaleCountryName = action?.payload?.country_name
    },
    getIpBasedLocaleError(state, action) {
      state.localeLoader = false
      state.ipLocaleDataError = 'error occured'
    },
    getFactsheetUrl(state) {
      state.factsheetUrl = ''
    },
    getFactsheetUrlSuccess(state, action) {
      state.factsheetUrl = action?.payload?.file
    },
    getFactsheetUrlError(state, action) {
      state.factsheetUrl = ''
    },
    getSelectedLanguage(state) {
      state.selectedLanguage = ''
      state.loadSelectedLanguage = false
    },
    getSelectedLanguageSuccess(state, action) {
      state.selectedLanguage = action?.payload?.data?.language
      state.loadSelectedLanguage = true
    },
    setSelectedLanguage(state, action) {
      console.log('')
    },
    setSelectedLanguageSuccess(state, action) {
      state.selectedLanguage = action.payload.data?.language
    },
    setVideoUrl(state, action) {
      state.videoUrl = action.payload
    },

    //this action will trigger api wallet-seed
    getWalletSeed(state) {
      state.walletSeedLoader = true
      state.getWalletSeedDataError = ''
    },
    getWalletSeedSuccess(state, action) {
      state.walletSeedLoader = false
      state.getWalletSeedData = action.payload.data.user_data
    },
    getWalletSeedFailure(state, action) {
      state.walletSeedLoader = false
      state.getWalletSeedDataError = 'Some Error Occured'
    },

    //this action will trigger api setSocialLinks
    setSocialHandlesLinks(state, action) {
      state.socialLoader = true
      state.setSocialHandlesLinksError = ''
      state.setSocialHandlesSuccess = false
    },
    setSocialHandlesLinksSuccess(state, action) {
      state.socialLoader = false
      state.setSocialHandlesLinksData = action.payload
      state.setSocialHandlesLinksDataMessage = action.payload.message
      state.setSocialHandlesSuccess = action.payload.success
    },
    setSocialHandlesLinksFailure(state, action) {
      state.socialLoader = false
      state.setSocialHandlesLinksError = action.payload.response.data.message
      state.setSocialHandlesSuccess = false
    },
    getWalletChart(state, action) {
      state.loadingChart = true
      state.walletChartData = []
      state.isGetWalletChartSuccess = false
      state.isGetWalletChartError = ''
    },
    getWalletChartSuccess(state, action) {
      state.loadingChart = false
      state.isGetWalletChartSuccess = true
      state.walletChartData = action.payload.data.user_data
    },
    getWalletChartFailure(state, action) {
      state.loadingChart = false
      state.isGetWalletChartSuccess = false
      state.isGetWalletChartError = action.payload.response.data.detail
    },
    getPlayerCoinChart(state, action) {
      state.loadingChart = true
      state.playerCoinChartData = []
      state.isGetPlayerCoinChartSuccess = false
      state.isGetPlayerCoinChartError = ''
    },
    getPlayerCoinChartSuccess(state, action) {
      state.loadingChart = false
      state.isGetPlayerCoinChartSuccess = true
      state.playerCoinChartData = action.payload.data.user_data
    },
    getPlayerCoinChartFailure(state, action) {
      state.loadingChart = false
      state.isGetPlayerCoinChartSuccess = false
      state.isGetPlayerCoinChartError = action.payload.response.data.detail
    },
    transferToWallet(state, action) {
      state.isTransferLoading = true
      state.transferAmountError = ''
    },
    transferToWalletSuccess(state, action) {
      state.isTransferLoading = false
      state.isTransferredData = action.payload
      state.isTransferTxnHash = action.payload.data.txn_hash
      state.isTransferredSuccess = action.payload.message //action.payload.data.user_data
    },
    transferToWalletReset(state) {
      state.isTransferLoading = false
      state.isTransferredData = ''
      state.isTransferTxnHash = ''
      state.transferAmountError = ''
      state.isTransferredSuccess = '' //action.payload.data.user_data
    },
    transferToWalletFailure(state, action) {
      state.isTransferLoading = false
      state.transferAmountError = action?.payload?.data?.message
      state.otpAttemptsLeft = action?.payload?.data?.attempts
      state.isTransferredSuccess = ''
      const { payload } = action
      const attempts = state.secretInputAttempts
      if (action.payload?.status === 500) {
        state.secretInputAttempts = attempts - 1
      }
      state.blockedTimeLeft = action?.payload?.data?.time_left
    },
    getTransferableAmount(state, action) {
      state.getAmountLoading = true
      state.getAmountError = ''
      state.getAmountSuccess = '' //action.payload.data.user_data
      state.getAmountSuccessData = ''
    },
    getTransferableAmountSuccess(state, action) {
      state.getAmountLoading = false
      state.getAmountSuccess = action.payload.success //action.payload.data.user_data
      state.getAmountSuccessData = action.payload
    },
    getTransferableAmountFailure(state, action) {
      state.getAmountLoading = false
      state.getAmountError = 'Some Error Occured'
    },

    // get send crypto api
    getWalletCrypto(state) {
      state.cryptoLoader = true
      state.isGetWalletCryptoError = ''
    },
    getWalletCryptoSuccess(state, action) {
      state.cryptoLoader = false
      state.userWalletCryptoData = action.payload
      state.isGetWalletCryptoError = ''
    },
    getWalletCryptoFailure(state, action) {
      state.cryptoLoader = false
      state.isGetWalletCryptoError = action.payload.message
    },

    // get share player image api
    getPlayerImage(state, action) {
      state.imageLoader = true
      state.isPlayerImageError = ''
    },
    getPlayerImageSuccess(state, action) {
      state.imageLoader = false
      state.userPlayerImageData = action.payload
      state.isPlayerImageError = ''
    },
    getPlayerImageFailure(state, action) {
      state.imageLoader = false
      state.isPlayerImageError = 'Player Card Not Found'
    },

    // post share player image api
    postPlayerImage(state, action) {
      state.tempCardImage = null
      state.imageLoader = true
      state.isPlayerImageError = ''
      state.tempCardImage = action.payload
    },
    postPlayerImageSuccess(state, action) {
      state.imageLoader = false
      state.userPlayerImageData = action.payload
      state.isPlayerImageError = ''
    },
    postPlayerImageFailure(state, action) {
      state.imageLoader = false
      state.isPlayerImageError = action.payload.message
    },

    // get notification settings
    getNotificationsSettings(state) {
      state.notificationSettingsLoader = true
      state.isNotificationSettingsError = ''
    },
    getNotificationsSettingsSuccess(state, action) {
      state.notificationSettingsLoader = false
      state.getNotificationSettingsData = action.payload.data
      state.isNotificationSettingsError = ''
    },
    getNotificationsSettingsFailure(state, action) {
      state.notificationSettingsLoader = false
      state.isNotificationSettingsError = action.payload.message
    },

    // post notification settings
    postNotificationsSettings(state, action) {
      state.postNotificationSettingsLoader = true
      state.isNotificationSettingsError = ''
    },
    postNotificationsSettingsSuccess(state, action) {
      state.postNotificationSettingsLoader = false
      state.postNotificationSettingsData = action.payload
      state.isNotificationSettingsError = ''
    },
    postNotificationsSettingsFailure(state, action) {
      state.postNotificationSettingsLoader = false
      state.isNotificationSettingsError = action.payload.message
    },

    // get All notification
    getAllNotifications(state, action) {
      state.notificationLoader = true
      state.isNotificationError = ''
    },
    getAllNotificationsSuccess(state, action) {
      state.notificationLoader = false
      state.getNotificationData = action.payload.data
      state.getNotificationCount = action.payload.count
      state.nextNotificationUrl = action.payload.next
      state.previousNotificationUrl = action.payload.previous
      state.isNotificationError = ''
    },
    getAllNotificationsFailure(state, action) {
      state.notificationLoader = false
      state.isNotificationError = action.payload.message
    },
    resetAllNotificationsList(state) {
      state.notificationLoader = false
      state.getNotificationData = []
      state.getNotificationCount = 0
      state.nextNotificationUrl = ''
      state.previousNotificationUrl = ''
      state.isNotificationError = ''
    },
    // get update last notification
    getNotificationsCount(state) {
      state.notificationCountLoader = true
      state.isNotificationCountError = ''
    },
    getNotificationsCountSuccess(state, action) {
      state.notificationCountLoader = false
      state.getNotificationCountData = action.payload.data[0].count
      state.isNotificationCountError = ''
    },
    getNotificationsCountFailure(state, action) {
      state.notificationCountLoader = false
      state.isNotificationCountError = action.payload.message
    },

    // get live notification
    getLiveNotifications(state) {
      state.liveNotificationLoader = true
      state.isLiveNotificationError = ''
    },
    getLiveNotificationsSuccess(state, action) {
      state.liveNotificationLoader = false
      state.getLiveNotificationData = action.payload.data
      // state.getLiveNotificationData = dummyData
      state.getNotificationCountData = action.payload.data.length
      state.isLiveNotificationError = ''
    },
    getLiveNotificationsFailure(state, action) {
      state.liveNotificationLoader = false
      state.isLiveNotificationError = action.payload.message
    },
    breakLiveNotifications(state, action) {
      state.dontShowLiveNotifications = action.payload
      state.breakRequestCount = state.breakRequestCount + 1
    },
    // post verify whatsApp
    postVerifyWhatsApp(state, action) {
      state.verifyWhatsAppLoader = true
      state.isVerifyWhatsAppError = ''
      state.isResendWhatsAppError = ''
      state.postResendWhatsAppData = []
      state.postVerifyWhatsAppData = ''
      state.postVerifyWhatsAppDataCheck = false
    },
    postVerifyWhatsAppSuccess(state, action) {
      state.verifyWhatsAppLoader = false
      state.postVerifyWhatsAppData = action.payload.message
      state.isVerifyWhatsAppError = ''
      state.isResendWhatsAppError = ''
      state.postResendWhatsAppData = []
      state.postChangeWhatsAppData = []
      state.postVerifyWhatsAppDataCheck = action.payload.success
    },
    resetPostVerifyWhatsApp(state) {
      state.verifyWhatsAppLoader = false
      state.postVerifyWhatsAppData = []
      state.isVerifyWhatsAppError = ''
      state.isResendWhatsAppError = ''
      state.postResendWhatsAppData = []
      state.postChangeWhatsAppData = []
      state.postVerifyWhatsAppDataCheck = false
    },
    postVerifyWhatsAppFailure(state, action) {
      state.verifyWhatsAppLoader = false
      state.isVerifyWhatsAppError = action.payload.response.data.message
      state.isVerifyWhatsAppTimeLeft = action.payload.response.data.time_left
      state.isResendWhatsAppError = ''
      state.postResendWhatsAppData = []
      state.postVerifyWhatsAppDataCheck = false
    },

    // post Resend whatsApp
    postResendWhatsApp(state, action) {
      state.resendWhatsAppLoader = true
      state.isResendWhatsAppError = ''
      state.isVerifyWhatsAppError = ''
      state.postVerifyWhatsAppData = ''
    },
    postResendWhatsAppSuccess(state, action) {
      state.resendWhatsAppLoader = false
      state.postResendWhatsAppData = action.payload.message
      state.isResendWhatsAppError = ''
      state.isVerifyWhatsAppError = ''
      state.postVerifyWhatsAppData = ''
    },
    postResendWhatsAppFailure(state, action) {
      state.resendWhatsAppLoader = false
      state.isResendWhatsAppError = action.payload.response.data.message
      state.isResendWhatsAppTimeLeft = action.payload.response.data.time_left
      state.isVerifyWhatsAppError = ''
      state.postVerifyWhatsAppData = ''
    },

    // post Change whatsApp Number
    postChangeWhatsAppNumber(state, action) {
      state.changeWhatsAppLoader = true
      state.isChangeWhatsAppError = ''
      state.postChangeWhatsAppData = ''
    },
    postChangeWhatsAppNumberSuccess(state, action) {
      state.changeWhatsAppLoader = false
      state.postChangeWhatsAppData = action.payload.message
      state.isChangeWhatsAppError = ''
    },
    postChangeWhatsAppNumberFailure(state, action) {
      state.changeWhatsAppLoader = false
      state.postChangeWhatsAppData = ''
      state.isChangeWhatsAppError = action.payload.response.data.message
    },
    resetChangeWhatsAppNumber(state) {
      state.changeWhatsAppLoader = false
      state.postChangeWhatsAppData = ''
      state.isChangeWhatsAppError = ''
    },
    postChangeWhatsAppNumberEmpty() {
      state.isChangeWhatsAppError = ''
      state.postChangeWhatsAppData = ''
    },

    // post Player settings
    postPlayerSettings(state, action) {
      state.playerSettingsLoader = true
      state.isPlayerSettingsError = ''
    },
    postPlayerSettingsSuccess(state, action) {
      state.playerSettingsLoader = false
      state.isPlayerSettingsError = ''
      state.postPlayerSettingsData = action.payload.message
    },
    postPlayerSettingsFailure(state, action) {
      state.playerSettingsLoader = false
      state.postPlayerSettingsData = []
      state.isPlayerSettingsError = action.payload.response.data.message
    },

    // post User(Wallet) settings
    postUserSettings(state, action) {
      state.userSettingsLoader = true
      state.isUserSettingsError = ''
    },
    postUserSettingsSuccess(state, action) {
      state.userSettingsLoader = false
      state.isUserSettingsError = ''
      // state.getUserSettingsData = []
      state.postUserSettingsData = action.payload.message
    },
    postUserSettingsFailure(state, action) {
      state.userSettingsLoader = false
      // state.getUserSettingsData = []
      state.postUserSettingsData = []
      state.isUserSettingsError = action.payload.response.data.message
    },

    // get User(Wallet) settings
    getUserSettings(state) {
      state.getUserSettingsLoader = true
      state.isGetUserSettingsSuccess = false
      state.isUserSettingsError = ''
    },
    getUserSettingsSuccess(state, action) {
      state.getUserSettingsLoader = false
      state.isGetUserSettingsSuccess = true
      state.isUserSettingsError = ''
      state.postUserSettingsData = []
      state.getUserSettingsData = action.payload.data
      state.userCurrency = state.ipLocaleCurrency //ipLocaleCurrency //action.payload.data?.currency ?? ipLocaleCurrency ?? 'USD'
      state.isVerifyUserSettingsWhatsAppError = ''
      state.postVerifyUserSettingsWhatsAppData = ''
      state.postResendUserSettingsWhatsAppData = ''
      state.isResendUserSettingsWhatsAppError = ''
      state.postChangeUserSettingsWhatsAppData = ''
      state.isChangeUserSettingsWhatsAppError = ''
    },
    getUserSettingsFailure(state, action) {
      console.log({ action })
      state.getUserSettingsLoader = false
      state.getUserSettingsData = []
      state.postUserSettingsData = []
      state.isUserSettingsError = action.payload?.response?.data?.message
      state.isVerifyUserSettingsWhatsAppError = ''
      state.postVerifyUserSettingsWhatsAppData = ''
      state.postResendUserSettingsWhatsAppData = ''
      state.isResendUserSettingsWhatsAppError = ''
      state.postChangeUserSettingsWhatsAppData = ''
      state.isChangeUserSettingsWhatsAppError = ''
    },
    setUserSettingsSuccess(state) {
      state.isGetUserSettingsSuccess = true
    },
    // post user Settings verify whatsApp
    postUserSettingsVerifyWhatsApp(state, action) {
      state.verifyUserSettingsWhatsAppLoader = true
      state.isVerifyUserSettingsWhatsAppError = ''
    },
    postUserSettingsVerifyWhatsAppSuccess(state, action) {
      state.verifyUserSettingsWhatsAppLoader = false
      state.postVerifyUserSettingsWhatsAppData = action.payload.message
      state.isVerifyUserSettingsWhatsAppError = ''
      state.postResendUserSettingsWhatsAppData = ''
      state.isResendUserSettingsWhatsAppError = ''
    },
    resetPostUserSettingsVerifyWhatsApp(state) {
      state.verifyUserSettingsWhatsAppLoader = false
      state.postVerifyUserSettingsWhatsAppData = []
      state.isVerifyUserSettingsWhatsAppError = ''
    },
    postUserSettingsVerifyWhatsAppFailure(state, action) {
      state.verifyUserSettingsWhatsAppLoader = false
      state.isVerifyUserSettingsWhatsAppError =
        action.payload.response.data.message
      state.isVerifyUserSettingsWhatsAppTimeLeft =
        action.payload.response.data.time_left
      state.postResendUserSettingsWhatsAppData = ''
      state.isResendUserSettingsWhatsAppError = ''
    },

    // post User Settings Update whatsApp Number
    postChangeUserSettingsWhatsAppNumber(state, action) {
      state.changeUserSettingsWhatsAppLoader = true
      state.isChangeUserSettingsWhatsAppError = ''
      state.postChangeUserSettingsWhatsAppData = ''
    },
    postChangeUserSettingsWhatsAppNumberSuccess(state, action) {
      state.changeUserSettingsWhatsAppLoader = false
      state.postChangeUserSettingsWhatsAppData = action.payload.message
      state.isChangeUserSettingsWhatsAppError = ''
      state.postResendUserSettingsWhatsAppData = ''
      state.isResendUserSettingsWhatsAppError = ''
    },
    postChangeUserSettingsWhatsAppNumberFailure(state, action) {
      state.changeUserSettingsWhatsAppLoader = false
      state.postChangeUserSettingsWhatsAppData = ''
      state.isChangeUserSettingsWhatsAppError =
        action.payload.response.data.message
      state.postResendUserSettingsWhatsAppData = ''
      state.isResendUserSettingsWhatsAppError = ''
    },
    resetChangeUserSettingsWhatsAppNumber(state) {
      state.changeUserSettingsWhatsAppLoader = false
      state.postChangeUserSettingsWhatsAppData = ''
      state.isChangeUserSettingsWhatsAppError = ''
    },

    // post User Settings Resend whatsApp
    postResendUserSettingsWhatsApp(state, action) {
      state.resendUserSettingsWhatsAppLoader = true
      state.isResendUserSettingsWhatsAppError = ''
    },
    postResendUserSettingsWhatsAppSuccess(state, action) {
      state.resendUserSettingsWhatsAppLoader = false
      state.postResendUserSettingsWhatsAppData = action.payload.message
      state.isResendUserSettingsWhatsAppError = ''
      state.isVerifyUserSettingsWhatsAppError = ''
      state.postVerifyUserSettingsWhatsAppData = ''
      state.postChangeUserSettingsWhatsAppData = ''
      state.isChangeUserSettingsWhatsAppError = ''
    },
    postResendUserSettingsWhatsAppFailure(state, action) {
      state.resendUserSettingsWhatsAppLoader = false
      state.isResendUserSettingsWhatsAppError =
        action.payload.response.data.message
      state.isResendUserSettingsWhatsAppTimeLeft =
        action.payload.response.data.time_left
    },

    // get Currency List
    getCurrencyList(state) {
      state.currencyLoader = true
      state.currencyError = ''
    },
    getCurrencyListSuccess(state, action) {
      state.currencyLoader = false
      state.currencyListData = action.payload.data
      state.currencyError = ''
    },
    getCurrencyListFailure(state, action) {
      state.currencyLoader = false
      state.currencyError = action.payload.response.data.message
    },
    storeBalance(state, action) {
      if (action?.payload?.ticker === 'WETH') {
        state.wethCurrencyBalance = action.payload.balance
      } else if (action?.payload?.ticker === 'USDT') {
        state.usdtCurrencyBalance = action.payload.balance
      } else if (action?.payload?.ticker === 'USDC') {
        state.usdcCurrencyBalance = action.payload.balance
      } else if (action?.payload?.ticker === 'WBTC') {
        state.wbtcCurrencyBalance = action.payload.balance
      }
    },
    togglePayForItem(state, action) {
      state.isPayForItemVisible = action.payload.visible
      state.payForItemPrice = action.payload.price
      state.payForItemName = action.payload.name
      state.kioskItem = action.payload.kioskItem
      state.kioskItemInfo = action.payload.kioskItemInfo
      state.deliveryModeRedux = action.payload.deliveryModeRedux
    },
    showVotingMobile(state, action) {
      state.newVotingCreate = action.payload.newVotingCreate
      state.playerCoinSettingsMobileView =
        action.payload.playerCoinSettingsMobileView
    },
    getFiatCurrencyList(state) {
      state.loader = true
      state.isGetFiatCurrencyListSuccess = false
      state.isGetFiatCurrencyListError = ''
    },
    getFiatCurrencyListSuccess(state, action) {
      state.loader = false
      const currencyList = action.payload.data
      currencyList.sort((a, b) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }

        // names must be equal
        return 0
      })
      state.fiatCurrencyList = currencyList
      state.isGetFiatCurrencyListSuccess = true
    },
    getFiatCurrencyListFailure(state, action) {
      state.loader = false
      state.isGetFiatCurrencyListError = action.payload.response.data.message
    },
    getCurrencyRate(state, action) {
      // state.loader = true
      state.isGetCurrencyRateSuccess = false
      state.isGetCurrencyRateError = ''
    },
    getCurrencyRateSuccess(state, action) {
      // state.loader = false
      state.currencyRate = action.payload.data?.rate
      state.isGetCurrencyRateSuccess = true
    },
    getCurrencyRateFailure(state, action) {
      // state.loader = false
      state.isGetCurrencyRateError = action.payload.response.data.message
    },
    getEuroCurrencyRate(state) {
      console.log('')
    },
    getEuroCurrencyRateSuccess(state, action) {
      state.euroRate = action.payload.data?.rate
    },
    showVotingMobile(state, action) {
      state.newVotingCreate = action.payload.newVotingCreate
      state.playerCoinSettingsMobileView =
        action.payload.playerCoinSettingsMobileView
    },
    selectedTheme(state, action) {
      state.selectedThemeRedux = action.payload.selectedThemeRedux
    },
    userEmail(state, action) {
      state.setLoginEmail = action.payload.setLoginEmail
      state.invalidDevice = action.payload.invalidDevice
    },
    walletConnectCheck(state, action) {
      state.walletConnectConfirmPopUp = action.payload.walletConnectConfirmPopUp
      state.walletType = action.payload.walletType
    },
    handleChangeSecret(state, action) {
      state.showChangeSecret = action.payload
      if (action.payload === false) {
        state.changeSecretError = ''
        state.changeSecretSuccess = ''
        state.changeSecretDone = false
        state.changeSecretLoading = false
        state.changeSecretOtpResponse = ''
      }
    },
    sendChangeSecretOtp(state) {
      state.changeSecretOtpLoading = true
    },
    sendChangeSecretOtpSuccess(state, action) {
      state.changeSecretOtpLoading = false
      state.changeSecretOtpResponse = action.payload.message
      state.changeSecretOtpAttempts = 4
    },
    sendChangeSecretOtpFailure(state, action) {
      state.changeSecretOtpLoading = false
      state.changeSecretOtpError = action.payload
      if (action.payload.response.data.message === 'User has been blocked') {
        state.changeSecretOtpAttempts = 0
        state.changeSecretTimeLeft = action.payload.response.data.time_left
        localStorage.setItem('secret_change_restricted', 'true')
      }
      state.changeSecretError = action.payload.response.data.message
    },
    resetSendChangeSecretOtp(state) {
      state.changeSecretOtpAttempts = 4
    },
    changeSecret(state, action) {
      state.changeSecretLoading = true
    },
    changeSecretSuccess(state, action) {
      state.changeSecretLoading = false
      state.changeSecretSuccess = action.payload.message
      state.changeSecretDone = true
    },
    changeSecretFailure(state, action) {
      state.changeSecretLoading = false
      state.changeSecretDone = false
      state.changeSecretError = action.payload.response.data.message
      state.changeSecretOtpAttempts = state.changeSecretOtpAttempts - 1
      if (action.payload.response.data.message === 'User has been blocked') {
        state.changeSecretTimeLeft = action.payload.response.data.time_left
      }
    },
    resetChangeSecret(state) {
      state.changeSecretError = ''
      state.changeSecretSuccess = ''
      state.changeSecretDone = false
      state.changeSecretLoading = false
    },
    restrictSecretChange(state) {
      state.changeSecretOtpAttempts = 0
    },
    showKioskItemDetail(state, action) {
      state.showKioskItemDetails = action.payload.showKioskItemDetails
      state.showKioskItemDetailsBuy = action.payload.showKioskItemDetailsBuy
    },
    getPendingKioskList(state, action) {
      state.PendingKioskLoader = true
      state.isGetPendingKioskListSuccess = false
      state.isGetPendingKioskListError = ''
    },
    getPendingKioskListSuccess(state, action) {
      console.log('hello pending', action?.payload)
      state.PendingKioskLoader = false
      state.PendingKioskList = action?.payload?.results
      state.isGetPendingKioskListSuccess = true
      state.PendingKioskListCount = action?.payload?.count
      state.nextPendingKioskListUrl = action?.payload?.next
      state.previousPendingKioskListUrl = action?.payload?.previous
    },
    getPendingKioskListFailure(state, action) {
      state.PendingKioskLoader = false
      state.isGetPendingKioskListSuccess = false
      state.isGetPendingKioskListError = action.payload.response.data.message
    },
    getFulfilledKioskListFailure(state, action) {
      state.FulfilledKioskLoader = false
      state.isGetFulfilledKioskListError = action.payload.response.data.message
    },
    getFulfilledKioskList(state, action) {
      state.FulfilledKioskLoader = true
      state.isGetFulfilledKioskListSuccess = false
      state.isGetFulfilledKioskListError = ''
    },
    getFulfilledKioskListSuccess(state, action) {
      state.FulfilledKioskLoader = false
      state.FulfilledKioskList = action.payload.results
      state.isGetFulfilledKioskListSuccess = true
    },
    getFulfilledKioskListFailure(state, action) {
      state.FulfilledKioskLoader = false
      state.isGetFulfilledKioskListError = action.payload.response.data.message
    },
    getKioskOrderDetail(state, action) {
      console.log('GKOD')
      if (action.payload.reload) {
        state.KioskOrderDetailLoader = true
      }
      state.isGetKioskOrderDetailSuccess = false
      state.isGetKioskOrderDetailError = ''
    },
    getKioskOrderDetailSuccess(state, action) {
      state.KioskOrderDetailLoader = false
      state.KioskOrderDetail = action.payload.data
      state.KioskOrderDetailLink = action.payload.link
      state.isGetKioskOrderDetailSuccess = action.payload.success
    },
    getKioskOrderDetailFailure(state, action) {
      state.KioskOrderDetailLoader = false
      state.isGetKioskOrderDetailError = action.payload.response.data.message
    },
    resetKioskOrderDetail(state) {
      state.KioskOrderDetailLoader = false
      state.isGetKioskOrderDetailError = ''
      state.KioskOrderDetailLink = ''
    },
    getPlayerKioskList(state, action) {
      state.PlayerKioskLoader = true
      state.isGetPlayerKioskListSuccess = false
      state.isGetPlayerKioskListError = ''
    },
    getPlayerKioskListSuccess(state, action) {
      state.PlayerKioskLoader = false
      state.PlayerKioskList = action.payload.results
      state.isGetPlayerKioskListSuccess = true
    },
    getPlayerKioskListFailure(state, action) {
      state.PlayerKioskLoader = false
      state.isGetPlayerKioskListError = action.payload.response.data.message
    },
    postFulfillKioskOrder(state, action) {
      state.postFulfillKioskOrderLoader = true
      state.postFulfillKioskOrderSuccess = false
      state.postFulfillKioskOrderError = ''
    },
    postFulfillKioskOrderSuccess(state, action) {
      state.postFulfillKioskOrderLoader = false
      state.postFulfillKioskOrderData = action.payload.message
      state.postFulfillKioskOrderSuccess = true
    },
    postFulfillKioskOrderFailure(state, action) {
      state.postFulfillKioskOrderLoader = false
      state.postFulfillKioskOrderSuccess = false
      state.postFulfillKioskOrderError = action.payload.response.data.message
    },
    resetPostFulfillKioskOrder(state) {
      state.postFulfillKioskOrderLoader = false
      state.postFulfillKioskOrderSuccess = false
      state.postFulfillKioskOrderData = ''
      state.postFulfillKioskOrderError = ''
    },
    getCheckPlayerCoinBal(state, action) {
      state.CheckPlayerCoinBalLoader = true
      state.isGetCheckPlayerCoinBalSuccess = false
      state.isGetCheckPlayerCoinBalError = ''
    },
    getCheckPlayerCoinBalSuccess(state, action) {
      state.CheckPlayerCoinBalLoader = false
      state.CheckPlayerCoinBal = action.payload.data
      state.isGetCheckPlayerCoinBalSuccess = true
    },
    getCheckPlayerCoinBalFailure(state, action) {
      state.CheckPlayerCoinBalLoader = false
      state.isGetCheckPlayerCoinBalError = action.payload.response.data.message
    },
    postPlaceKioskOrder(state, action) {
      state.postPlaceKioskOrderLoader = true
      state.postPlaceKioskOrderSuccess = false
      state.postPlaceKioskOrderError = ''
    },
    postPlaceKioskOrderSuccess(state, action) {
      state.postPlaceKioskOrderLoader = false
      state.postPlaceKioskOrderHash = action.payload.hash
      state.postPlaceKioskOrderSuccess = true
    },
    postPlaceKioskOrderFailure(state, action) {
      state.postPlaceKioskOrderLoader = false
      state.postPlaceKioskOrderSuccess = false
      state.postPlaceKioskOrderError = action.payload.response.data.message
    },
    resetPostPlaceKioskOrder(state) {
      state.postPlaceKioskOrderLoader = false
      state.postPlaceKioskOrderSuccess = false
      state.postPlaceKioskOrderHash = ''
      state.postPlaceKioskOrderError = ''
    },
    postKioskItemPayment(state, action) {
      state.postKioskItemPaymentLoader = true
      state.postKioskItemPaymentSuccess = false
      state.postKioskItemPaymentError = ''
    },
    postKioskItemPaymentSuccess(state, action) {
      state.postKioskItemPaymentLoader = false
      state.postKioskItemPaymentHash = action.payload.hash
      state.txnHash = action.payload?.hash
      state.postKioskItemPaymentSuccess = action.payload.success
    },
    postKioskItemPaymentFailure(state, action) {
      state.postKioskItemPaymentLoader = false
      state.postKioskItemPaymentSuccess = false
      state.postKioskItemPaymentError = action.payload.response.data.message
    },
    getKioskItemDetail(state, action) {
      state.KioskItemDetailLoader = true
      state.isGetKioskItemDetailSuccess = false
      state.isGetKioskItemDetailError = ''
    },
    getKioskItemDetailSuccess(state, action) {
      state.KioskItemDetailLoader = false
      state.KioskItemDetail = action.payload.data
      state.isGetKioskItemDetailSuccess = true
    },
    getKioskItemDetailFailure(state, action) {
      state.KioskItemDetailLoader = false
      state.isGetKioskItemDetailError = action.payload.response.data.message
    },
    resetKioskItemDetail(state) {
      state.KioskItemDetail = []
    },
    sendTransOtp(state) {
      state.sendTransOtpLoader = true
      state.sendTransOtpSuccessData = false
      state.sendTransOtpErrorData = ''
      state.sendTransOtpSuccessDataMessage = ''
    },
    sendTransOtpSuccess(state, action) {
      state.sendTransOtpLoader = false
      state.sendTransOtpSuccessData = action.payload.success
      state.sendTransOtpSuccessDataMessage = 'success'
    },
    sendTransOtpFailure(state, action) {
      state.sendTransOtpLoader = false
      state.sendTransOtpSuccessData = false
      state.sendTransOtpErrorData = action?.payload?.response?.data?.message
      state.sendTransOtpSuccessDataMessage = ''
      state.blockedTimeLeft = action?.payload?.response?.data?.time_left
    },
    resetSendTransOtp(state) {
      state.sendTransOtpLoader = false
      state.sendTransOtpSuccessData = false
      state.sendTransOtpErrorData = ''
      state.sendTransOtpSuccessDataMessage = ''
      state.isTransactionError = ''
      state.transferAmountError = ''
    },
    postUploadFile(state, action) {
      state.postUploadFileLoader = true
      state.postUploadFileSuccessData = false
      state.postUploadFileError = ''
      state.postUploadFileSuccessDataLink = ''
    },
    postUploadFileSuccess(state, action) {
      state.postUploadFileLoader = false
      state.postUploadFileSuccessDataLink = action.payload.link
      state.postUploadFileSuccessData = true
    },
    postUploadFileFailure(state, action) {
      console.log({ action })
      state.postUploadFileLoader = false
      state.postUploadFileSuccessData = false
      state.postUploadFileSuccessDataLink = ''
      state.postUploadFileError = action.payload?.response?.data?.message || ''
    },
    resetPostUploadFile(state) {
      state.postUploadFileLoader = false
      state.postUploadFileSuccessData = false
      state.postUploadFileError = ''
      state.postUploadFileSuccessDataLink = ''
    },
    getDigitalItem(state, action) {
      state.getDigitalItemLoader = true
      state.getDigitalItemSuccess = false
      state.getDigitalItemError = ''
    },
    getDigitalItemSuccess(state, action) {
      state.getDigitalItemLoader = false
      state.getDigitalItemSuccessData = action.payload.response
      state.getDigitalItemSuccess = true
    },
    getDigitalItemFailure(state, action) {
      state.getDigitalItemLoader = false
      state.getDigitalItemSuccess = false
      state.getDigitalItemSuccessData = ''
      state.getDigitalItemError = action.payload.response.data.message
    },
    //setSharePopWallet
    setSharePopWallet(state, action) {
      console.log('setSharePopWallet', action.payload)
      state.sharePopWallet = action.payload
    },
    // get referral data
    getReferralData(state) {
      state.referralDataLoader = true
      state.referralDataError = ''
      state.referralDataSuccess = null
    },
    getReferralDataSuccess(state, action) {
      // console.log('referralData', action.payload)
      state.referralDataLoader = false
      state.referralDataSuccess = action.payload
      state.referralDataError = ''
    },
    getReferralDataFailure(state, action) {
      state.referralDataLoader = false
      state.referralDataError = action.payload.response.data.message
    },
    postReferralPayout(state) {
      state.postReferralPayoutLoader = true
      state.postReferralPayoutSuccess = ''
      state.postReferralPayoutHash = ''
      state.postReferralPayoutError = ''
    },
    postReferralPayoutSuccess(state, action) {
      // console.log('postReferralPayoutSuccess', action)
      state.postReferralPayoutLoader = false
      // state.postReferralPayoutHash = action.payload.hash
      // state.isTransferTxnHash = action.payload.hash
      state.postReferralPayoutSuccess = action.payload.message
    },
    postReferralPayoutFailure(state, action) {
      console.log('postReferralPayoutFailure', action)
      state.postReferralPayoutLoader = false
      state.postReferralPayoutSuccess = ''
      state.postReferralPayoutHash = ''
      state.postReferralPayoutError =
        action?.payload?.response?.data?.message || 'Some error occured'
    },
    resetPostReferralPayout(state) {
      state.postReferralPayoutLoader = false
      state.postReferralPayoutSuccess = ''
      state.postReferralPayoutHash = ''
      state.postReferralPayoutError = ''
    },
    // get check-watchlist
    getCheckWatchList(state) {
      state.checkWatchListLoader = true
      state.checkWatchListSuccess = false
      state.checkWatchListError = ''
    },
    getCheckWatchListSuccess(state, action) {
      // console.log('check-watchlist', action?.payload)
      state.checkWatchListLoader = false
      state.checkWatchListSuccess = action?.payload?.watchlist
      state.checkWatchListError = ''
    },
    getCheckWatchListFailure(state, action) {
      state.checkWatchListLoader = false
      state.checkWatchListSuccess = false
      state.checkWatchListError = action?.payload?.response?.data?.message
    },
    // post add and remove watchlist
    postWatchList(state) {
      state.watchListLoader = true
      state.watchListDataSuccess = false
      state.watchListSuccess = ''
      state.watchListError = ''
    },
    postWatchListSuccess(state, action) {
      console.log('watchlist', action?.payload)
      state.watchListLoader = false
      state.watchListSuccess = action?.payload?.message
      state.watchListDataSuccess = true
      state.watchListError = ''
    },
    postWatchListFailure(state, action) {
      // console.log('watchlist error', action)
      state.watchListLoader = false
      state.watchListDataSuccess = false
      state.watchListSuccess = ''
      state.watchListError = action?.payload?.response?.data?.message
    },
    resetPostWatchList(state) {
      state.watchListLoader = false
      state.watchListDataSuccess = false
      state.watchListSuccess = ''
      state.watchListError = ''
    },
    getGeneralSettings(state) {
      state.generalSettingsLoading = true
      state.generalSettingsData = null
      state.generalSettingsError = ''
    },
    getGeneralSettingsSuccess(state, action) {
      // console.log('generalSettingsData', action?.payload)
      state.generalSettingsLoading = false
      state.generalSettingsData = action?.payload
      state.centralContract = action?.payload?.central_contract
      state.centralContractAbi = action?.payload?.central_contract_abi
      state.centralNftContract = action?.payload?.central_nft_contract
      state.centralNftContractAbi = action?.payload?.central_nft_contract_abi
      state.showGenesisRequired = action?.payload?.show_genesis_required
      state.newBuySellForm = action?.payload?.buy_sell_form
      // state.newBuySellForm = 0
      state.generalSettingsError = ''
    },
    getGeneralSettingsFailure(state, action) {
      state.generalSettingsLoading = false
      state.generalSettingsData = null
      state.generalSettingsError = action?.payload?.response?.data?.message
    },
    resetGeneralSettings(state) {
      state.generalSettingsLoading = false
      state.generalSettingsData = null
      state.generalSettingsError = ''
    },
    getWatchListPlayer(state) {
      state.watchListLoading = true
      state.watchListData = []
      state.watchListError = ''
    },
    getWatchListPlayerSuccess(state, action) {
      console.log('watchListPlayer', action.payload)
      state.watchListLoading = false
      state.watchListData = action?.payload?.results
      state.watchListError = ''
    },
    getWatchListPlayerFailure(state, action) {
      state.watchListLoading = false
      state.watchListData = []
      state.watchListError = action?.payload?.response?.data?.message
    },
    // get latest trade on player detail page
    getLatestTrade(state, action) {
      state.latestTradeLoader = true
      state.isNotificationError = ''
    },
    getLatestTradeSuccess(state, action) {
      // console.log('getLatestTradeSuccess', action.payload)
      state.latestTradeLoader = false
      state.getLatestTradeData = action.payload.data
      state.getLatestTradeCount = action.payload.count
      state.nextLatestTradeUrl = action.payload.next
      state.previousLatestTradeUrl = action.payload.previous
      state.isLatestTradeError = ''
    },
    getLatestTradeFailure(state, action) {
      state.latestTradeLoader = false
      state.isLatestTradeError = action.payload.message
    },
    // get latest trade history on player detail page
    getLatestTradeHistory(state, action) {
      if (action.payload.loader) {
        state.latestTradeHistoryLoader = true
      }
    },
    getLatestTradeHistorySuccess(state, action) {
      state.latestTradeHistoryLoader = false
      state.latestTradeHistoryData = action.payload.data
      // state.latestTradeHistoryData = [
      //   {
      //     amountcoins: 4.9999,
      //     totalamountmatic: 2.78944421,
      //     tradetimestamp: '2024-01-04T11:29:33',
      //     direction: -1,
      //     name: 'Philipp Degen',
      //     detailpageurl: 'philipp-degen',
      //     ticker: 'PHDE',
      //     wallet: '0x29ab0eef9770b58cd3445706f00abd764f5cf204',
      //     username: 'Scout801',
      //     avatar: 'group-16',
      //     lifetimelevel: 0,
      //     exchangeRateUSD: {
      //       fromticker: 'MATIC',
      //       toticker: 'USD',
      //       ratetimestamp: 1704729900,
      //       rate: 0.80687704,
      //       '24h_rate': 0.83201377,
      //     },
      //     totalamountusd: 2.2507384874099388,
      //   },
      // ]
      state.isLatestTradeError = ''
    },
    getLatestTradeHistoryFailure(state, action) {
      state.latestTradeHistoryLoader = false
      state.isLatestTradeError = action.payload.message
    },
    showLatestTrade(state, action) {
      // console.log('showLatestPop', action)
      state.showLatestTransaction = action?.payload?.showLatestTransaction
    },
    resetLatestTrade(state) {
      state.latestTradeLoader = false
      state.getLatestTradeData = []
      state.getLatestTradeCount = 0
      state.nextLatestTradeUrl = ''
      state.previousLatestTradeUrl = ''
      state.isLatestTradeError = ''
    },
    resetUserRankingList(state) {
      state.isUserRankingListSuccess = false
      state.isUserRankingListError = ''
      state.userRankingList = []
    },
    getUserRankingList(state, action) {
      state.loadingUserRankingList = true
      state.isUserRankingListSuccess = false
      state.isUserRankingListError = ''
    },
    getUserRankingListSuccess(state, action) {
      state.loadingUserRankingList = false
      state.userRankingList = action.payload.results
      state.userRankingListCount = action.payload.count
      state.nextUserRankingListUrl = action.payload.next
      state.isUserRankingListSuccess = true
      state.isUserRankingListError = ''
    },
    getTourUserRankingList(state) {
      state.loadingUserRankingList = false
      state.userRankingList = DummyUserList
      state.isUserRankingListSuccess = true
      state.isUserRankingListError = ''
    },
    getUserRankingListFailure(state, action) {
      state.loadingUserRankingList = false
      state.isUserRankingListSuccess = false
      state.isUserRankingListError = action.payload.message
    },
    resetUserPlayerCoinList(state) {
      state.isUserPlayerCoinListSuccess = false
      state.isUserPlayerCoinListError = ''
      state.userPlayerCoinList = []
    },
    getUserPlayerCoinList(state, action) {
      state.loadingUserPlayerCoinList = true
      state.isUserPlayerCoinListSuccess = false
      state.isUserPlayerCoinListError = ''
    },
    getUserPlayerCoinListSuccess(state, action) {
      state.loadingUserPlayerCoinList = false
      state.isUserPlayerCoinListSuccess = true
      state.userPlayerCoinList = action.payload.results
      state.userPlayerCoinListCount = action.payload.count
      state.nextUserPlayerCoinListUrl = action.payload.next
      state.isUserPlayerCoinListError = ''
    },
    getUserPlayerCoinListFailure(state, action) {
      state.loadingUserPlayerCoinList = false
      state.isUserPlayerCoinListSuccess = false
      state.isUserPlayerCoinListError = action.payload.message
    },
    getUserPublicPlayerCoinList(state, action) {
      state.loadingUserPlayerCoinList = true
      state.isUserPlayerCoinListSuccess = false
      state.isUserPlayerCoinListError = ''
    },
    getUserPublicPlayerCoinListSuccess(state, action) {
      state.loadingUserPlayerCoinList = false
      state.isUserPlayerCoinListSuccess = true
      state.userPlayerCoinList = action.payload.results
      state.userPlayerCoinListCount = action.payload.count
      state.nextUserPlayerCoinListUrl = action.payload.next
      state.isUserPlayerCoinListError = ''
    },
    getTourUserPublicPlayerCoinList(state) {
      state.loadingUserPlayerCoinList = false
      state.isUserPlayerCoinListSuccess = true
      state.userPlayerCoinList = DummyUserPlayerList
      state.userPlayerCoinListCount = DummyUserPlayerList.length
      state.isUserPlayerCoinListError = ''
    },
    getUserPublicPlayerCoinListFailure(state, action) {
      state.loadingUserPlayerCoinList = false
      state.isUserPlayerCoinListSuccess = false
      state.isUserPlayerCoinListError = action.payload.message
    },
    getUserNftList(state, action) {
      state.loadingUserNftList = true
      state.isUserNftListSuccess = false
      state.isUserNftListError = ''
    },
    getUserNftListSuccess(state, action) {
      state.loadingUserNftList = false
      state.isUserNftListSuccess = true
      state.userNftList = action.payload.results
      state.userNftListCount = action.payload.count
      state.nextUserNftListUrl = action.payload.next
      state.isUserNftListError = ''
    },
    getUserNftListFailure(state, action) {
      state.loadingUserNftList = false
      state.isUserNftListSuccess = false
      state.isUserNftListError = action.payload.message
    },
    getUserPublicNftList(state, action) {
      state.loadingUserNftList = true
      state.isUserNftListSuccess = false
      state.isUserNftListError = ''
    },
    getUserPublicNftListSuccess(state, action) {
      state.loadingUserNftList = false
      state.isUserNftListSuccess = true
      state.userNftList = action.payload.results
      state.userNftListCount = action.payload.count
      state.nextUserNftListUrl = action.payload.next
      state.isUserNftListError = ''
    },
    getUserPublicNftListFailure(state, action) {
      state.loadingUserNftList = false
      state.isUserNftListSuccess = false
      state.isUserNftListError = action.payload.message
    },
    getUserProfile(state) {
      state.loader = true
      state.isUserProfileError = ''
    },
    getUserProfileSuccess(state, action) {
      state.loader = false
      state.userProfile = action.payload
      state.isUserProfileError = ''
    },
    getUserProfileFailure(state, action) {
      state.loader = false
      state.isUserProfileError = action.payload.message
    },
    getUserPublicProfile(state, action) {
      state.loader = true
      state.isUserPublicProfileError = ''
    },
    getUserPublicProfileSuccess(state, action) {
      state.loader = false
      state.userPublicProfile = action.payload
      state.isUserPublicProfileError = ''
    },
    getTourUserPublicProfile(state) {
      state.loader = false
      state.userPublicProfile = DummyUser
      state.isUserPublicProfileError = ''
    },
    getUserPublicProfileFailure(state, action) {
      state.loader = false
      state.isUserPublicProfileError = action.payload.message
    },
    resetUserProfileData(state) {
      state.userPublicProfile = null
    },
    // post add and remove cartoon
    postCartoon(state) {
      state.cartoonLoader = true
      state.cartoonDataSuccess = false
      state.cartoonSuccess = ''
      state.cartoonError = ''
    },
    postCartoonSuccess(state, action) {
      console.log('cartoon', action?.payload)
      state.cartoonLoader = false
      state.cartoonSuccess = action?.payload?.message
      state.cartoonDataSuccess = action?.payload?.success
      state.cartoonError = ''
    },
    postCartoonFailure(state, action) {
      // console.log('cartoon error', action)
      state.cartoonLoader = false
      state.cartoonDataSuccess = false
      state.cartoonSuccess = ''
      state.cartoonError = action?.payload?.response?.data?.message
    },
    // get status of cartoonizing
    getCartoonizeStatus(state, action) {
      state.cartoonStatusLoader = false
      state.cartoonStatusError = ''
    },
    getCartoonizeStatusSuccess(state, action) {
      state.cartoonStatusLoader = true
      state.cartoonStatusData = action?.payload?.cartoonizing
      state.cartoonStatusSuccess = action?.payload?.sucess
    },
    getCartoonizeStatusFailure(state, action) {
      state.cartoonStatusLoader = true
      state.cartoonStatusError = action?.payload?.message
    },
    initCartoonizeStatus(state) {
      state.cartoonStatusData = true
      state.cartoonStatusError = ''
    },
    // get fan club account list
    getFanClub(state) {
      state.fanClubLoader = true
      state.fanClubError = ''
    },
    getFanClubSuccess(state, action) {
      state.fanClubLoader = false
      state.fanClubData = action?.payload?.results
      state.fanClubCount = action?.payload?.count
      state.nextFanClubUrl = action?.payload?.next
      state.previousFanClubUrl = action?.payload?.previous
      state.isFetchPlayerSuccess = 'players fetched successfully'
      state.fanClubError = ''
    },
    getFanClubFailure(state, action) {
      state.fanClubData = []
      state.fanClubLoader = false
      state.fanClubError = action?.payload?.message
    },
    getGlobalCardSetting(state) {
      state.customcardsetting = 2
    },
    getGlobalCardSettingSuccess(state, action) {
      state.customcardsetting = action?.payload?.customcardsetting
    },
    getGlobalCardSettingFailure(state, action) {
      state.customcardsetting = 2
    },
    openSideMenu(state, action) {
      state.openMenu = action?.payload?.openMenu
    },
    handlePlayerMode(state, action) {
      state.playerMode = action?.payload?.playerMode
    },
    handleLandingNavigate(state, action) {
      state.landingNavigateIndex = action?.payload?.landingNavigateIndex
    },

    // get Nft Image
    getNftImage(state) {
      state.getNftImageLoader = true
      state.getNftImageError = ''
    },
    getNftImageSuccess(state, action) {
      state.getNftImageLoader = false
      state.getNftImageData = action?.payload?.data
      state.getNftImageError = ''
    },
    getNftImageFailure(state, action) {
      state.getNftImageLoader = false
      state.getNftImageData = ''
      state.getNftImageError = action?.payload?.response?.data?.message
    },
    //  claim free xp
    postClaimFreeXp(state, action) {
      state.postClaimFreeXpLoader = true
      state.postClaimFreeXpSuccess = false
      state.postClaimFreeXpError = ''
    },
    postClaimFreeXpSuccess(state, action) {
      state.postClaimFreeXpLoader = false
      state.postClaimFreeXpHash = action.payload.hash
      state.txnHash = action.payload?.hash
      state.postClaimFreeXpSuccess = action.payload.success
    },
    postClaimFreeXpFailure(state, action) {
      state.postClaimFreeXpLoader = false
      state.postClaimFreeXpSuccess = false
      state.postClaimFreeXpError = action.payload.response.data.message
      state.isTransactionError = action.payload.response.data.message
    },

    goLiveLoadingDis(state, action) {
      state.goLiveLoading = action?.payload?.goLiveLoading
    },
    // get block per second
    getBlockPerSecond(state) {
      state.blockLoader = true
      state.blockError = ''
    },
    getBlockPerSecondSuccess(state, action) {
      state.blockLoader = false
      state.blockPerSecond = action?.payload?.blockpersec
      state.blockError = ''
    },
    getBlockPerSecondFailure(state, action) {
      state.blockPerSecond = null
      state.blockLoader = false
      state.blockError = action?.payload?.message
    },
    // get owner list of minted and autogenerated  nft
    getOwnerList(state, action) {
      state.ownerListLoader = true
      state.ownerListError = ''
    },
    getOwnerListSuccess(state, action) {
      // console.log('ownerListData', action?.payload)
      state.ownerListLoader = false
      state.ownerListData = action?.payload?.data?.results
      state.ownerListError = ''
    },
    getOwnerListFailure(state, action) {
      state.ownerListData = []
      state.ownerListLoader = false
      state.ownerListError = action?.payload?.message
    },
    showPlayerShareXp(state, action) {
      state.showPlayerShareXpValue = action?.payload?.showPlayerShareXpValue
    },
    // get player shares hold for specific player share
    getPlayerShares(state, action) {
      state.playerShareLoader = true
      state.playerShareError = ''
    },
    getPlayerSharesSuccess(state, action) {
      state.playerShareLoader = false
      if (action?.payload?.data.length > 0) {
        state.playerShareHold = action?.payload?.data[0]?.balance
        state.playerShareStaked = action?.payload?.data[0]?.stakingbalance
      }
      state.playerShareError = ''
    },
    getPlayerSharesFailure(state, action) {
      state.playerShareHold = 0
      state.playerShareStaked = 0
      state.playerShareLoader = false
      state.playerShareError = action?.payload?.message
    },
    getPlayerSharesInit(state) {
      state.playerShareHold = 0
      state.playerShareStaked = 0
    },
    getUserXp(state, action) {
      state.loadingXp = true
      state.isXpNotificationVisible = false
      state.earnedXp = 0
      state.isFirstLoadingXp = action?.payload ?? false
    },
    getUserXpSuccess(state, action) {
      state.loadingXp = false
      if (action?.payload?.success) {
        const actualXp = (state.xpRate * action?.payload?.xp) / 1000
        if (state.totalXp < actualXp) {
          state.earnedXp = actualXp - state.totalXp
          state.totalXp = actualXp
          if (!state.isFirstLoadingXp) {
            state.isXpNotificationVisible = true
          }
          state.isFirstLoadingXp = false
        }
      }
    },
    getUserXpFailure(state, action) {
      state.loadingXp = false
    },
    getUserXpRate(state) {
      state.loadingXp = true
      state.xpRate = 1000
    },
    getUserXpRateSuccess(state, action) {
      state.loadingXp = false
      state.xpRate = action?.payload?.data
    },
    getUserXpRateFailure(state, action) {
      state.loadingXp = false
    },
    resetUserXp(state) {
      state.isXpNotificationVisible = false
      state.earnedXp = 0
    },

    // get get-claimable-xp
    getClaimableXp(state, action) {
      state.claimableXpLoader = true
      state.claimableXpError = ''
      state.claimableXpData = []
    },
    getClaimableXpSuccess(state, action) {
      // console.log('claimableXpHold', action?.payload?.data)
      state.claimableXpLoader = false
      state.claimableXpData = action?.payload?.data
      state.claimableXpError = ''
    },
    getClaimableXpFailure(state, action) {
      state.claimableXpData = []
      state.claimableXpLoader = false
      state.claimableXpError = action?.payload?.message
    },

    // get getNextAvailabilityForActivity
    getNextAvailabilityForActivity(state) {
      state.nextAvailabilityForActivityLoader = true
      state.nextAvailabilityForActivityError = ''
      state.nextAvailabilityForActivityData = []
    },
    getNextAvailabilityForActivitySuccess(state, action) {
      // console.log('getNextAvailabilityForActivityHold', action?.payload?.data)
      state.nextAvailabilityForActivityLoader = false
      state.nextAvailabilityForActivityData = action?.payload?.data
      state.nextAvailabilityForActivityError = ''
    },
    getNextAvailabilityForActivityFailure(state, action) {
      state.nextAvailabilityForActivityData = []
      state.nextAvailabilityForActivityLoader = false
      state.nextAvailabilityForActivityError = action?.payload?.message
    },
    // get draftingReallocationPercentage
    getDraftingReallocationPercentage(state, action) {
      state.draftingReallocationPercentageLoader = true
      state.draftingReallocationPercentageError = ''
    },
    getDraftingReallocationPercentageSuccess(state, action) {
      // console.log('getdraftingReallocationPercentageHold', action?.payload?.data)
      state.draftingReallocationPercentageLoader = false
      state.draftingReallocationPercentageData = action?.payload?.data
      state.draftingReallocationPercentageError = ''
    },
    getDraftingReallocationPercentageFailure(state, action) {
      state.draftingReallocationPercentageData = 0
      state.draftingReallocationPercentageLoader = false
      state.draftingReallocationPercentageError = action?.payload?.message
    },

    // get playerPayoutAddress
    getPlayerPayoutAddress(state, action) {
      state.playerPayoutAddressLoader = true
      state.playerPayoutAddressError = ''
    },
    getPlayerPayoutAddressSuccess(state, action) {
      // console.log('getplayerPayoutAddressHold', action?.payload?.data)
      state.playerPayoutAddressLoader = false
      state.playerPayoutAddressData = action?.payload?.data
      state.playerPayoutAddressError = ''
    },
    getPlayerPayoutAddressFailure(state, action) {
      state.playerPayoutAddressData = ''
      state.playerPayoutAddressLoader = false
      state.playerPayoutAddressError = action?.payload?.message
    },

    // get getClaimableCount
    getClaimableCount(state, action) {
      state.claimableCountLoader = true
      state.claimableCountError = ''
    },
    getClaimableCountSuccess(state, action) {
      // console.log('getClaimableCountHold', action?.payload?.data)
      state.claimableCountLoader = false
      state.claimableCountData = action?.payload?.data
      state.claimableCountError = ''
    },
    getClaimableCountFailure(state, action) {
      state.claimableCountData = ''
      state.claimableCountLoader = false
      state.claimableCountError = action?.payload?.message
    },

    // get getStakingRewardXP
    getStakingRewardXp(state, action) {
      state.stakingRewardXpLoader = true
      state.stakingRewardXpError = ''
    },
    getStakingRewardXpSuccess(state, action) {
      // console.log('getStakingRewardXpHold', action?.payload?.data)
      state.stakingRewardXpLoader = false
      state.stakingRewardXpData = action?.payload?.data
      state.stakingRewardXpError = ''
    },
    getStakingRewardXpFailure(state, action) {
      state.stakingRewardXpData = ''
      state.stakingRewardXpLoader = false
      state.stakingRewardXpError = action?.payload?.message
    },
    resetStakingRewardXp(state) {
      console.log('rsrxp')
      state.stakingRewardXpLoader = false
      state.stakingRewardXpData = null
    },
    // get getNextPossibleClaim
    getNextPossibleClaim(state, action) {
      state.nextPossibleClaimLoader = true
      state.nextPossibleClaimError = ''
    },
    getNextPossibleClaimSuccess(state, action) {
      // console.log('getNextPossibleClaim', action?.payload?.data)
      state.nextPossibleClaimLoader = false
      state.nextPossibleClaimData = action?.payload?.data
      state.nextPossibleClaimError = ''
    },
    getNextPossibleClaimFailure(state, action) {
      state.nextPossibleClaimData = ''
      state.nextPossibleClaimLoader = false
      state.nextPossibleClaimError = action?.payload?.message
    },

    // get balanceOfAllowance
    balanceOfAllowance(state, action) {
      state.balanceOfAllowanceLoader = true
      state.balanceOfAllowanceError = ''
    },
    balanceOfAllowanceSuccess(state, action) {
      state.balanceOfAllowanceLoader = false
      state.balanceOfAllowanceData = action?.payload?.data
      state.balanceOfAllowanceError = ''
    },
    balanceOfAllowanceFailure(state, action) {
      state.balanceOfAllowanceData = ''
      state.balanceOfAllowanceLoader = false
      state.balanceOfAllowanceError = action?.payload?.message
    },
    resetBalanceOfAllowance(state) {
      state.balanceOfAllowanceData = ''
      state.balanceOfAllowanceLoader = false
    },
    setNagivated(state, action) {
      state.isNavigated = action.payload
    },
    setPrivyWallets(state, action) {
      state.privyWallets = action.payload
    },

    // get app_qualification_setting
    getQualificationSetting(state) {
      state.QualificationSettingLoader = true
      state.QualificationSettingError = ''
    },
    getQualificationSettingSuccess(state, action) {
      console.log('getQualificationSetting', action)
      let inviteValue = ''
      if (localStorage.getItem('invite_code')) {
        inviteValue = localStorage.getItem('invite_code')
      } else if (window.location.pathname.includes('invite')) {
        inviteValue = window.location?.pathname?.split('/')?.pop()
      }
      state.QualificationSettingLoader = false
      state.QualificationSettingData = action?.payload?.appqualificationstatus
      if (localStorage.getItem('bypassAppQualification')) {
        state.QualificationSettingData = 3
      }
      state.enablecreditcardpurchase = action?.payload?.enablecreditcardpurchase
      state.appGoLiveTimestamp = action?.payload?.appgolive
      state.genesisGoLiveTimestamp = action?.payload?.genesisgolive
      // localStorage.setItem(
      //   'qualification_value',
      //   state.QualificationSettingData,
      // )
      localStorage.setItem(
        'qualification',
        action?.payload?.appqualificationstatus,
      )
      state.QualificationSettingError = ''
      state.qualifiedPublicKey = action?.payload?.user?.publickey
      state.qualifiedInviteLinked = action?.payload?.user?.invite_linked
      console.log({ qualVal: state.QualificationSettingData, action })
      if (
        // state.QualificationSettingData === 1 &&
        [1].includes(state.QualificationSettingData) &&
        action?.payload?.user &&
        localStorage.getItem('accessToken') &&
        action?.payload?.user?.invite_linked === false &&
        !localStorage.getItem('referral_code') &&
        !state.isLoggedOut
      ) {
        console.log('showin_invite_now')
        state.isInvitationPopupShown = true
      } else if (
        inviteValue &&
        inviteValue.length === 8 &&
        [0, 1].includes(state.QualificationSettingData) &&
        action?.payload?.user &&
        localStorage.getItem('accessToken') &&
        action?.payload?.user?.invite_linked === false &&
        !localStorage.getItem('referral_code') &&
        !state.isLoggedOut
      ) {
        console.log('showin_invite_because_of_link')
        state.isInvitationPopupShown = true
      }
      if (
        action?.payload?.appqualificationstatus === 0 &&
        action?.payload?.user?.invite_linked === true
      ) {
        state.linkInviteSuccessData = true
      }
    },
    getQualificationSettingFailure(state, action) {
      // state.QualificationSettingData = ''
      state.QualificationSettingLoader = false
      state.QualificationSettingError = action?.payload?.message
    },
    verifyInviteCode(state, action) {
      state.isInviteCodeVerifying = true
      state.verifyInviteCodeSuccessData = ''
      state.verifyReferCodeSuccessData = ''
      state.verifyInviteCodeError = ''
      state.codeType = action.payload.code_type
    },
    verifyInviteCodeSuccess(state, action) {
      console.log({ action })
      state.isInviteCodeVerifying = false
      if (state.codeType === 1) {
        state.verifyInviteCodeSuccessData = action.payload.referral_valid
        state.verifyReferCodeSuccessData = ''
      } else if (state.codeType === 2) {
        state.verifyReferCodeSuccessData = action.payload.referral_valid
        if (action.payload.referral_valid === false) {
          state.isLastReferralInputInvalid = true
        } else if (action.payload.referral_valid === true) {
          state.isLastReferralInputInvalid = false
        }
        state.verifyInviteCodeSuccessData = ''
      }
      state.verifyInviteCodeError = ''
    },
    verifyInviteCodeFailure(state, action) {
      state.verifyInviteCodeSuccessData = ''
      state.verifyReferCodeSuccessData = ''
      state.isInviteCodeVerifying = false
      state.verifyInviteCodeError = action?.payload?.message
    },
    linkUserInviteCode(state, action) {
      state.linkInviteLoading = true
      state.linkInviteSuccessData = ''
      state.linkInviteError = ''
      state.isFireShownOnInviteLinkSuccess = ''
    },
    linkUserInviteSuccess(state, action) {
      console.log({ action })
      state.linkInviteLoading = false
      state.linkInviteSuccessData = action.payload
      state.isFireShownOnInviteLinkSuccess = action.payload
      state.linkInviteError = ''
      // state.isInvitationPopupShown = false
    },
    toggleInvitePopup(state, action) {
      state.isInvitationPopupShown = action.payload //!state.isInvitationPopupShown
      // state.linkInviteSuccessData = ''
    },
    linkUserInviteFailure(state, action) {
      console.log({ action })
      state.linkInviteSuccessData = ''
      state.linkInviteLoading = false
      state.linkInviteError = action?.payload?.message
      state.isFireShownOnInviteLinkSuccess = ''
    },
    // get referral data
    getPlayerReferralData(state) {
      state.playerReferralDataLoader = true
      state.playerReferralDataError = ''
    },
    getPlayerReferralDataSuccess(state, action) {
      console.log('playerReferralData', action.payload)
      state.playerReferralDataLoader = false
      state.playerReferralDataSuccess = action?.payload
      state.playerReferralDataError = ''
    },
    getPlayerReferralDataFailure(state, action) {
      state.playerReferralDataLoader = false
      state.playerReferralDataError = action.payload.response.data.message
    },
    cloudFlareCheck(state, action) {
      // console.log('cloudFlareCheck', action.payload)
      state.cloudFlareError = action.payload
    },
    cloudFlareTokenReset(state, action) {
      // console.log('cloudFlareTokenReset', action.payload)
      state.cloudFlareTokenReset = action.payload
    },
    setAddToHomeScreen(state, action) {
      state.isShownAddToHomePopup = action.payload
    },
    setReferralLinkCode(state, action) {
      state.referralLinkCode = action.payload
    },
    showLanding(state, action) {
      state.isLandingShown = action.payload
    },
    storePwaPrompt(state, action) {
      state.pwaPrompt = action.payload
    },
    setShowMore(state, action) {
      console.log('setShowMore', action?.payload)
      state.showMore = action?.payload
      if (action?.payload === false) {
        state.getLiveNotificationData = []
      }
    },
    // post kioskItemTempOrder
    postKioskItemTempOrder(state, action) {
      state.kioskItemTempLoader = true
      state.kioskItemTempError = ''
      state.timerFinished = false
    },
    postKioskItemTempOrderSuccess(state, action) {
      // console.log('postKioskItemTempOrderSuccess', action?.payload)
      state.kioskItemTempLoader = false
      state.kioskItemTempData = action?.payload?.expiry_in_sec
      state.kioskItemTempError = ''
    },
    postKioskItemTempOrderFailure(state, action) {
      state.kioskItemTempData = 0
      state.kioskItemTempLoader = false
      state.kioskItemTempError = action?.payload?.message
    },
    // post CheckItemTempOrder
    postCheckItemTempOrder(state, action) {
      state.checkItemTempLoader = true
      state.checkItemTempError = ''
    },
    postCheckItemTempOrderSuccess(state, action) {
      console.log('postCheckItemTempOrderSuccess', action?.payload)
      state.checkItemTempLoader = false
      state.checkItemTempData = action?.payload?.hash
      state.checkItemTempError = ''
    },
    postCheckItemTempOrderFailure(state, action) {
      state.checkItemTempData = ''
      state.checkItemTempLoader = false
      state.checkItemTempError = action?.payload?.message
    },
    setTimerFinished(state, action) {
      state.timerFinished = action?.payload
    },
    resetPostKioskItem(state) {
      state.kioskItemTempData = 0
      state.checkItemTempData = ''
    },
    // get KioskItemCategoriesList
    kioskItemCategoriesList(state) {
      state.itemCategoriesListLoader = true
      state.itemCategoriesListError = ''
    },
    kioskItemCategoriesListSuccess(state, action) {
      console.log('kioskItemCategoriesListSuccess', action?.payload)
      state.itemCategoriesListLoader = false
      state.itemCategoriesListData = action?.payload?.data
      state.itemCategoriesListError = ''
    },
    kioskItemCategoriesListFailure(state, action) {
      state.itemCategoriesListData = []
      state.itemCategoriesListLoader = false
      state.itemCategoriesListError = action?.payload?.message
    },
    deleteKioskImage(state) {
      state.deleteKioskImageLoader = true
      state.deleteKioskImageError = ''
    },
    deleteKioskImageSuccess(state, action) {
      state.deleteKioskImageLoader = false
      state.deleteKioskImageError = ''
      state.deleteKioskImageData = action?.payload?.data
    },
    deleteKioskImageFailure(state, action) {
      state.deleteKioskImageLoader = false
      state.deleteKioskImageData = []
      state.deleteKioskImageError = action.payload.response.data.message
    },
    resetDeleteKioskImage(state) {
      state.deleteKioskImageLoader = false
      state.deleteKioskImageError = ''
      state.deleteKioskImageData = []
    },
    checkTradingStatus(state) {
      state.checkTradingStatusLoader = true
      state.checkTradingStatusError = ''
    },
    checkTradingStatusSuccess(state, action) {
      console.log('checkTradingStatus', action?.payload)
      state.checkTradingStatusLoader = false
      state.checkTradingStatusError = ''
      state.checkTradingStatusData = action?.payload?.trading_status
    },
    checkTradingStatusFailure(state, action) {
      state.checkTradingStatusLoader = false
      state.checkTradingStatusData = true
      state.checkTradingStatusError = action?.payload?.message
    },
    tradingStatusExternal(state, action) {
      state.checkTradingStatusLoader = action?.payload?.loader
      state.checkTradingStatusData = action?.payload?.status
    },
    setShowTourModal(state, action) {
      state.showTourModal = action?.payload
    },
    setTourStep(state, action) {
      state.tourStep = action?.payload
    },
    setHideTourHeader(state, action) {
      state.hideTourHeader = action?.payload
    },
    setTourCategoryId(state, action) {
      state.tourCategoryId = action?.payload
    },
    getTourCategories(state) {
      state.isGetTourCategoriesSuccess = false
      state.isGetTourCategoriesError = ''
    },
    getTourCategoriesSuccess(state, action) {
      state.isGetTourCategoriesSuccess = true
      state.isTourXPClaimed = action?.payload?.apptour_xp_claimed
      const categories = action?.payload?.data.reduce(function (result, item) {
        result[item.categoryId] = true
        return result
      }, {})
      state.tourCategories = { ...state.tourCategories, ...categories }
    },
    getTourCategoriesFailure(state, action) {
      state.isGetTourCategoriesError = action?.payload?.message
    },
    setTourCategories(state, action) {
      state.tourCategories = action?.payload
    },
    setFixedFooter(state, action) {
      state.fixedFooter = action?.payload
    },
    getKioskCategories(state) {
      state.kioskCategoriesLoader = true
      state.kioskCategoriesData = []
      state.kioskCategoriesError = ''
    },
    getKioskCategoriesSuccess(state, action) {
      state.kioskCategoriesLoader = false
      state.kioskCategoriesData = action?.payload?.data
      state.kioskCategoriesError = ''
    },
    getKioskCategoriesFailure(state, action) {
      state.kioskCategoriesLoader = false
      state.kioskCategoriesData = []
      state.kioskCategoriesError = action?.payload?.response?.data?.message
    },
    getKioskCategoriesDetail(state, action) {
      state.kioskCategoriesDetailLoader = true
      state.kioskCategoriesDetailSuccess = []
      state.kioskCategoriesDetailError = ''
    },
    getKioskCategoriesDetailSuccess(state, action) {
      state.kioskCategoriesDetailLoader = false
      state.kioskCategoriesDetailSuccess = action?.payload?.results
      state.kioskCategoriesDetailError = ''
    },
    getKioskCategoriesDetailFailure(state, action) {
      state.kioskCategoriesDetailLoader = false
      state.kioskCategoriesDetailSuccess = []
      state.kioskCategoriesDetailError =
        action?.payload?.response?.data?.message
    },
    makeAppInstall(state, action) {
      state.appInstallFlag = action.payload
    },
  },
})

export const {
  getKioskCategoriesDetail,
  getKioskCategoriesDetailSuccess,
  getKioskCategoriesDetailFailure,
  makeAppInstall,
  getKioskCategories,
  getKioskCategoriesSuccess,
  getKioskCategoriesFailure,
  tradingStatusExternal,
  checkTradingStatus,
  checkTradingStatusSuccess,
  checkTradingStatusFailure,
  deleteKioskImage,
  deleteKioskImageSuccess,
  deleteKioskImageFailure,
  resetDeleteKioskImage,
  resetKioskItemDetail,
  kioskItemCategoriesList,
  kioskItemCategoriesListSuccess,
  kioskItemCategoriesListFailure,
  resetPostKioskItem,
  setTimerFinished,
  postKioskItemTempOrder,
  postKioskItemTempOrderSuccess,
  postKioskItemTempOrderFailure,
  postCheckItemTempOrder,
  postCheckItemTempOrderSuccess,
  postCheckItemTempOrderFailure,
  setShowMore,
  cloudFlareTokenReset,
  cloudFlareCheck,
  getPlayerReferralData,
  getPlayerReferralDataSuccess,
  getPlayerReferralDataFailure,
  setSharePopWallet,
  getQualificationSetting,
  getQualificationSettingSuccess,
  getQualificationSettingFailure,
  balanceOfAllowance,
  balanceOfAllowanceSuccess,
  balanceOfAllowanceFailure,
  resetBalanceOfAllowance,
  getNextPossibleClaim,
  getNextPossibleClaimSuccess,
  getNextPossibleClaimFailure,
  getStakingRewardXp,
  getStakingRewardXpSuccess,
  getStakingRewardXpFailure,
  resetStakingRewardXp,
  getClaimableCount,
  getClaimableCountSuccess,
  getClaimableCountFailure,
  getPlayerPayoutAddress,
  getPlayerPayoutAddressSuccess,
  getPlayerPayoutAddressFailure,
  getDraftingReallocationPercentage,
  getDraftingReallocationPercentageSuccess,
  getDraftingReallocationPercentageFailure,
  getNextAvailabilityForActivity,
  getNextAvailabilityForActivitySuccess,
  getNextAvailabilityForActivityFailure,
  getClaimableXp,
  getClaimableXpSuccess,
  getClaimableXpFailure,
  getPlayerShares,
  getPlayerSharesSuccess,
  getPlayerSharesFailure,
  getPlayerSharesInit,
  showPlayerShareXp,
  getOwnerList,
  getOwnerListSuccess,
  getOwnerListFailure,
  getBlockPerSecond,
  getBlockPerSecondSuccess,
  getBlockPerSecondFailure,
  goLiveLoadingDis,
  postClaimFreeXp,
  postClaimFreeXpSuccess,
  postClaimFreeXpFailure,
  getNftImage,
  getNftImageSuccess,
  getNftImageFailure,
  openSideMenu,
  handleLandingNavigate,
  handlePlayerMode,
  getFanClub,
  getFanClubSuccess,
  getFanClubFailure,
  getCartoonizeStatus,
  getCartoonizeStatusSuccess,
  getCartoonizeStatusFailure,
  initCartoonizeStatus,
  postCartoon,
  postCartoonSuccess,
  postCartoonFailure,
  getLatestTrade,
  getLatestTradeSuccess,
  getLatestTradeFailure,
  getLatestTradeHistory,
  getLatestTradeHistorySuccess,
  getLatestTradeHistoryFailure,
  resetLatestTrade,
  showLatestTrade,
  getWatchListPlayer,
  getWatchListPlayerSuccess,
  getWatchListPlayerFailure,
  postWatchList,
  postWatchListSuccess,
  postWatchListFailure,
  resetPostWatchList,
  getCheckWatchList,
  getCheckWatchListSuccess,
  getCheckWatchListFailure,
  resetExternalWalletSuccess,
  getHeaderBalance,
  getHeaderBalanceSuccess,
  getHeaderBalanceFailure,
  postReferralPayout,
  postReferralPayoutSuccess,
  postReferralPayoutFailure,
  resetPostReferralPayout,
  getReferralData,
  getReferralDataSuccess,
  getReferralDataFailure,
  getDigitalItem,
  getDigitalItemSuccess,
  getDigitalItemFailure,
  postUploadFile,
  postUploadFileSuccess,
  postUploadFileFailure,
  resetPostUploadFile,
  sendTransOtp,
  sendTransOtpSuccess,
  sendTransOtpFailure,
  resetSendTransOtp,
  getKioskItemDetail,
  getKioskItemDetailSuccess,
  getKioskItemDetailFailure,
  postKioskItemPayment,
  postKioskItemPaymentSuccess,
  postKioskItemPaymentFailure,
  postPlaceKioskOrder,
  postPlaceKioskOrderSuccess,
  postPlaceKioskOrderFailure,
  resetPostPlaceKioskOrder,
  getCheckPlayerCoinBal,
  getCheckPlayerCoinBalSuccess,
  getCheckPlayerCoinBalFailure,
  postFulfillKioskOrder,
  postFulfillKioskOrderSuccess,
  postFulfillKioskOrderFailure,
  resetPostFulfillKioskOrder,
  getPlayerKioskList,
  getPlayerKioskListSuccess,
  getPlayerKioskListFailure,
  getKioskOrderDetail,
  getKioskOrderDetailSuccess,
  getKioskOrderDetailFailure,
  resetKioskOrderDetail,
  getPendingKioskList,
  getPendingKioskListSuccess,
  getPendingKioskListFailure,
  getFulfilledKioskList,
  getFulfilledKioskListSuccess,
  getFulfilledKioskListFailure,
  showKioskItemDetail,
  walletConnectCheck,
  userEmail,
  selectedTheme,
  showVotingMobile,
  togglePayForItem,
  storeBalance,
  getCurrencyList,
  getCurrencyListSuccess,
  getCurrencyListFailure,
  postResendUserSettingsWhatsApp,
  postResendUserSettingsWhatsAppSuccess,
  postResendUserSettingsWhatsAppFailure,
  postChangeUserSettingsWhatsAppNumber,
  postChangeUserSettingsWhatsAppNumberSuccess,
  postChangeUserSettingsWhatsAppNumberFailure,
  resetChangeUserSettingsWhatsAppNumber,
  postUserSettingsVerifyWhatsApp,
  postUserSettingsVerifyWhatsAppSuccess,
  resetPostUserSettingsVerifyWhatsApp,
  postUserSettingsVerifyWhatsAppFailure,
  getUserSettings,
  getUserSettingsSuccess,
  getUserSettingsFailure,
  setUserSettingsSuccess,
  postUserSettings,
  postUserSettingsSuccess,
  postUserSettingsFailure,
  postPlayerSettings,
  postPlayerSettingsSuccess,
  postPlayerSettingsFailure,
  postChangeWhatsAppNumber,
  postChangeWhatsAppNumberSuccess,
  postChangeWhatsAppNumberFailure,
  resetChangeWhatsAppNumber,
  postChangeWhatsAppNumberEmpty,
  postResendWhatsApp,
  postResendWhatsAppSuccess,
  postResendWhatsAppFailure,
  breakLiveNotifications,
  postVerifyWhatsApp,
  postVerifyWhatsAppSuccess,
  resetPostVerifyWhatsApp,
  postVerifyWhatsAppFailure,
  getLiveNotifications,
  getLiveNotificationsSuccess,
  getLiveNotificationsFailure,
  getNotificationsCount,
  getNotificationsCountSuccess,
  getNotificationsCountFailure,
  getAllNotifications,
  getAllNotificationsSuccess,
  getAllNotificationsFailure,
  resetAllNotificationsList,
  getNotificationsSettings,
  getNotificationsSettingsSuccess,
  getNotificationsSettingsFailure,
  postNotificationsSettings,
  postNotificationsSettingsSuccess,
  postNotificationsSettingsFailure,
  getPlayerImage,
  getPlayerImageSuccess,
  getPlayerImageFailure,
  postPlayerImage,
  postPlayerImageSuccess,
  postPlayerImageFailure,
  getWalletCrypto,
  getWalletCryptoSuccess,
  getWalletCryptoFailure,
  getWalletSeed,
  getWalletSeedSuccess,
  getWalletSeedFailure,
  setSocialHandlesLinks,
  setSocialHandlesLinksSuccess,
  setSocialHandlesLinksFailure,
  setActiveTab,
  login,
  loginSuccess,
  loginFailure,
  loginReset,
  loginWithOtp,
  loginWithOtpSuccess,
  loginWithOtpFailure,
  testSuccess,
  loginWithWallet,
  loginWithWalletSuccess,
  loginWithWalletFailure,
  loginWithWalletCookie,
  loadNft,
  setBlogLoaded,
  getNft,
  setCurTab,
  getWalletDetails,
  getWalletSuccess,
  getWalletFailure,
  setWalletAddress,
  setWalletSuccessInit,
  createWallet,
  createWalletSuccess,
  createWalletFailure,
  signUp,
  signUpSuccess,
  signUpFailure,
  resendEmail,
  resendEmailSuccess,
  resendEmailFailure,
  forgotPassword,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,
  verifyEmail,
  verifyEmailSuccess,
  verifyEmailFailure,
  signout,
  logout,
  logoutFailure,
  logoutSuccess,
  setLoading,
  changePassword,
  emailConfirmation,
  resendEmailConfirmation,
  resetSentEmailVerification,
  resetOtp,
  emailConfirmReset,
  closeEmailVerification,
  refreshToken,
  refreshTokenSuccess,
  refreshTokenFailure,
  resetUserName,
  getUserDetails,
  getUserDetailsSuccess,
  getUserDetailsFailure,
  showSignupForm,
  forceShowPopup,
  showWalletForm,
  showNftDetailForm,
  showPurchaseForm,
  showStakingForm,
  showNftForm,
  showGenesisNftForm,
  hideGenesisNftForm,
  setStakeFormShowed,
  showPlayerSelectionForm,
  resetFormPassword,
  changeNftValue,
  changeNftValueSuccess,
  changeNftValueFailure,
  sendMatics,
  sendMaticsSuccess,
  sendMaticsFailure,
  resetSendMatics,
  sendMaticsReset,
  resetSecretInputAttempts,
  restrictSecretInput,
  transaction,
  transactionSuccess,
  transactionFailure,
  resetTransaction,
  sendMaticsMetamask,
  exportKey,
  exportKeySuccess,
  exportKeyError,
  exportKeyReset,
  exportKeyRestrict,
  getWalletAddress,
  getWalletAddressSuccess,
  getWalletAddressFailure,
  resetWallet,
  getCountries,
  getCountriesSuccess,
  getCountriesFailure,
  getNotification,
  getNotificationSuccess,
  getNotificationFailure,
  fetchPurchaseDetails,
  fetchPurchaseDetailsSuccess,
  fetchPurchaseDetailsFailure,
  removeMandatory,
  getIpAddress,
  getIpAddressSuccess,
  getIpAddressFailure,
  getIpLocaleCurrency,
  getIpLocaleCurrencySuccess,
  getIpLocaleCurrencyFailure,
  checkEUCountry,
  checkEUCountrySuccess,
  checkEUCountryFailure,
  getIpBasedLocale,
  getIpBasedLocaleSuccess,
  getIpBasedLocaleError,
  getFactsheetUrl,
  getFactsheetUrlSuccess,
  getFactsheetUrlError,
  getSelectedLanguage,
  getSelectedLanguageSuccess,
  setSelectedLanguage,
  setSelectedLanguageSuccess,
  resendOtp,
  resendOtpSuccess,
  resendOtpError,
  resetResendOtp,
  setVideoUrl,
  getWalletChart,
  getWalletChartSuccess,
  getWalletChartFailure,
  getPlayerCoinChart,
  getPlayerCoinChartSuccess,
  getPlayerCoinChartFailure,
  transferToWallet,
  transferToWalletSuccess,
  transferToWalletReset,
  transferToWalletFailure,
  getTransferableAmount,
  getTransferableAmountSuccess,
  getTransferableAmountFailure,
  getFiatCurrencyList,
  getFiatCurrencyListSuccess,
  getFiatCurrencyListFailure,
  getCurrencyRate,
  getCurrencyRateSuccess,
  getCurrencyRateFailure,
  getEuroCurrencyRate,
  getEuroCurrencyRateSuccess,
  handleChangeSecret,
  sendChangeSecretOtp,
  sendChangeSecretOtpSuccess,
  sendChangeSecretOtpFailure,
  resetSendChangeSecretOtp,
  changeSecret,
  changeSecretSuccess,
  changeSecretFailure,
  resetChangeSecret,
  restrictSecretChange,
  getGeneralSettings,
  getGeneralSettingsSuccess,
  getGeneralSettingsFailure,
  resetGeneralSettings,
  getLiveBalance,
  getLiveBalanceSuccess,
  getLiveBalanceFailure,
  getUserRankingList,
  getUserRankingListSuccess,
  getTourUserRankingList,
  resetUserRankingList,
  getUserRankingListFailure,
  getUserPlayerCoinList,
  getUserPlayerCoinListSuccess,
  getUserPlayerCoinListFailure,
  resetUserPlayerCoinList,
  getUserPublicPlayerCoinList,
  getUserPublicPlayerCoinListSuccess,
  getUserPublicPlayerCoinListFailure,
  getTourUserPublicPlayerCoinList,
  getUserNftList,
  getUserNftListSuccess,
  getUserNftListFailure,
  getUserPublicNftList,
  getUserPublicNftListSuccess,
  getUserPublicNftListFailure,
  getUserProfile,
  getUserProfileSuccess,
  getUserProfileFailure,
  getUserPublicProfile,
  getUserPublicProfileSuccess,
  getUserPublicProfileFailure,
  getTourUserPublicProfile,
  resetUserProfileData,
  getGlobalCardSetting,
  getGlobalCardSettingSuccess,
  getGlobalCardSettingFailure,
  getUserXp,
  getUserXpSuccess,
  getUserXpFailure,
  getUserXpRate,
  getUserXpRateSuccess,
  getUserXpRateFailure,
  resetUserXp,
  setNagivated,
  setPrivyWallets,
  verifyInviteCode,
  verifyInviteCodeSuccess,
  verifyInviteCodeFailure,
  linkUserInviteCode,
  linkUserInviteSuccess,
  toggleInvitePopup,
  linkUserInviteFailure,
  setAddToHomeScreen,
  setReferralLinkCode,
  showLanding,
  storePwaPrompt,
  setShowTourModal,
  setTourStep,
  setHideTourHeader,
  setTourCategoryId,
  getTourCategories,
  getTourCategoriesSuccess,
  getTourCategoriesFailure,
  setTourCategories,
  setFixedFooter,
} = authenticationSlice.actions
export default authenticationSlice.reducer
