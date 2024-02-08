/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { all, call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import { v4 as uuidv4 } from 'uuid'
import {
  login,
  loginSuccess,
  loginFailure,
  loginWithOtp,
  loginWithOtpSuccess,
  loginWithOtpFailure,
  loginWithWallet,
  loginWithWalletSuccess,
  loginWithWalletFailure,
  getSelectedLanguage,
  getSelectedLanguageSuccess,
  setSelectedLanguage,
  setSelectedLanguageSuccess,
  getWalletDetails,
  signUp,
  signUpSuccess,
  signUpFailure,
  resendEmail,
  resendEmailSuccess,
  resendEmailFailure,
  forgotPassword,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  logout,
  logoutSuccess,
  logoutFailure,
  resetPassword,
  setLoading,
  changePassword,
  emailConfirmation,
  refreshToken,
  refreshTokenSuccess,
  getUserDetails,
  getUserDetailsSuccess,
  getUserDetailsFailure,
  showSignupForm,
  resetPasswordSuccess,
  resetPasswordFailure,
  verifyEmail,
  verifyEmailSuccess,
  verifyEmailFailure,
  getWalletSuccess,
  getWalletFailure,
  createWalletSuccess,
  createWalletFailure,
  createWallet,
  changeNftValueSuccess,
  changeNftValueFailure,
  changeNftValue,
  sendMatics,
  sendMaticsSuccess,
  sendMaticsFailure,
  exportKey,
  exportKeySuccess,
  exportKeyError,
  getWalletAddress,
  getWalletAddressSuccess,
  getWalletAddressFailure,
  getCountriesSuccess,
  getCountriesFailure,
  getCountries,
  getNotificationSuccess,
  getNotificationFailure,
  getNotification,
  getIpAddressFailure,
  getIpAddress,
  getIpBasedLocale,
  getIpBasedLocaleSuccess,
  getIpBasedLocaleError,
  getIpLocaleCurrency,
  getIpLocaleCurrencySuccess,
  getIpLocaleCurrencyFailure,
  checkEUCountry,
  checkEUCountrySuccess,
  checkEUCountryFailure,
  getFactsheetUrl,
  getFactsheetUrlSuccess,
  getFactsheetUrlError,
  resendOtpSuccess,
  resendOtpError,
  resendOtp,
  getWalletSeed,
  getWalletSeedSuccess,
  getWalletSeedFailure,
  setSocialHandlesLinks,
  setSocialHandlesLinksSuccess,
  setSocialHandlesLinksFailure,
  transferToWallet,
  transferToWalletSuccess,
  transferToWalletFailure,
  getTransferableAmount,
  getTransferableAmountSuccess,
  getTransferableAmountFailure,
  getWalletCrypto,
  getWalletCryptoSuccess,
  getWalletCryptoFailure,
  getWalletChart,
  getWalletChartSuccess,
  getWalletChartFailure,
  getPlayerCoinChart,
  getPlayerCoinChartSuccess,
  getPlayerCoinChartFailure,
  getPlayerImage,
  getPlayerImageSuccess,
  getPlayerImageFailure,
  postPlayerImage,
  postPlayerImageSuccess,
  postPlayerImageFailure,
  getNotificationsSettings,
  getNotificationsSettingsSuccess,
  getNotificationsSettingsFailure,
  postNotificationsSettings,
  postNotificationsSettingsSuccess,
  postNotificationsSettingsFailure,
  getAllNotifications,
  getAllNotificationsSuccess,
  getAllNotificationsFailure,
  getNotificationsCount,
  getNotificationsCountSuccess,
  getNotificationsCountFailure,
  getLiveNotifications,
  getLiveNotificationsSuccess,
  getLiveNotificationsFailure,
  postResendWhatsApp,
  postResendWhatsAppSuccess,
  postResendWhatsAppFailure,
  postVerifyWhatsApp,
  postVerifyWhatsAppSuccess,
  postVerifyWhatsAppFailure,
  postChangeWhatsAppNumber,
  postChangeWhatsAppNumberSuccess,
  postChangeWhatsAppNumberFailure,
  postPlayerSettings,
  postPlayerSettingsSuccess,
  postPlayerSettingsFailure,
  postUserSettings,
  postUserSettingsSuccess,
  postUserSettingsFailure,
  getUserSettings,
  getUserSettingsSuccess,
  getUserSettingsFailure,
  postUserSettingsVerifyWhatsApp,
  postUserSettingsVerifyWhatsAppSuccess,
  postUserSettingsVerifyWhatsAppFailure,
  postChangeUserSettingsWhatsAppNumber,
  postChangeUserSettingsWhatsAppNumberSuccess,
  postChangeUserSettingsWhatsAppNumberFailure,
  postResendUserSettingsWhatsApp,
  postResendUserSettingsWhatsAppSuccess,
  postResendUserSettingsWhatsAppFailure,
  getCurrencyList,
  getCurrencyListSuccess,
  getCurrencyListFailure,
  getFiatCurrencyList,
  getFiatCurrencyListSuccess,
  getFiatCurrencyListFailure,
  getCurrencyRate,
  getCurrencyRateSuccess,
  getCurrencyRateFailure,
  getEuroCurrencyRate,
  getEuroCurrencyRateSuccess,
  sendChangeSecretOtpSuccess,
  sendChangeSecretOtpFailure,
  sendChangeSecretOtp,
  changeSecretSuccess,
  changeSecretFailure,
  changeSecret,
  getPendingKioskList,
  getPendingKioskListSuccess,
  getPendingKioskListFailure,
  getFulfilledKioskList,
  getFulfilledKioskListSuccess,
  getFulfilledKioskListFailure,
  getKioskOrderDetail,
  getKioskOrderDetailSuccess,
  getKioskOrderDetailFailure,
  getPlayerKioskList,
  getPlayerKioskListSuccess,
  getPlayerKioskListFailure,
  postFulfillKioskOrder,
  postFulfillKioskOrderSuccess,
  postFulfillKioskOrderFailure,
  getCheckPlayerCoinBal,
  getCheckPlayerCoinBalSuccess,
  getCheckPlayerCoinBalFailure,
  postPlaceKioskOrder,
  postPlaceKioskOrderSuccess,
  postPlaceKioskOrderFailure,
  postKioskItemPayment,
  postKioskItemPaymentSuccess,
  postKioskItemPaymentFailure,
  getKioskItemDetail,
  getKioskItemDetailSuccess,
  getKioskItemDetailFailure,
  sendTransOtp,
  sendTransOtpSuccess,
  sendTransOtpFailure,
  postUploadFile,
  postUploadFileSuccess,
  postUploadFileFailure,
  getDigitalItem,
  getDigitalItemSuccess,
  getDigitalItemFailure,
  getReferralData,
  getReferralDataSuccess,
  getReferralDataFailure,
  postReferralPayout,
  postReferralPayoutSuccess,
  postReferralPayoutFailure,
  getHeaderBalance,
  getHeaderBalanceSuccess,
  getHeaderBalanceFailure,
  signout,
  getCheckWatchList,
  getCheckWatchListSuccess,
  getCheckWatchListFailure,
  postWatchList,
  postWatchListSuccess,
  postWatchListFailure,
  getGeneralSettings,
  getGeneralSettingsSuccess,
  getGeneralSettingsFailure,
  getWatchListPlayer,
  getWatchListPlayerSuccess,
  getWatchListPlayerFailure,
  getLatestTrade,
  getLatestTradeSuccess,
  getLatestTradeFailure,
  getLatestTradeHistory,
  getLatestTradeHistorySuccess,
  getLatestTradeHistoryFailure,
  getLiveBalance,
  getLiveBalanceSuccess,
  getLiveBalanceFailure,
  getUserRankingList,
  getUserRankingListSuccess,
  getUserRankingListFailure,
  getUserPlayerCoinList,
  getUserPlayerCoinListSuccess,
  getUserPlayerCoinListFailure,
  getUserPublicPlayerCoinList,
  getUserPublicPlayerCoinListSuccess,
  getUserPublicPlayerCoinListFailure,
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
  postCartoon,
  postCartoonSuccess,
  postCartoonFailure,
  getCartoonizeStatus,
  getCartoonizeStatusSuccess,
  getCartoonizeStatusFailure,
  getFanClub,
  getFanClubSuccess,
  getFanClubFailure,
  getGlobalCardSetting,
  getGlobalCardSettingSuccess,
  getGlobalCardSettingFailure,
  getNftImage,
  getNftImageSuccess,
  getNftImageFailure,
  postClaimFreeXp,
  postClaimFreeXpSuccess,
  postClaimFreeXpFailure,
  getBlockPerSecond,
  getBlockPerSecondSuccess,
  getBlockPerSecondFailure,
  getOwnerList,
  getOwnerListSuccess,
  getOwnerListFailure,
  getPlayerShares,
  getPlayerSharesSuccess,
  getPlayerSharesFailure,
  getUserXp,
  getUserXpSuccess,
  getUserXpFailure,
  getUserXpRate,
  getUserXpRateSuccess,
  getUserXpRateFailure,
  getClaimableXp,
  getClaimableXpSuccess,
  getClaimableXpFailure,
  getNextAvailabilityForActivity,
  getNextAvailabilityForActivitySuccess,
  getNextAvailabilityForActivityFailure,
  getDraftingReallocationPercentage,
  getDraftingReallocationPercentageSuccess,
  getDraftingReallocationPercentageFailure,
  getPlayerPayoutAddress,
  getPlayerPayoutAddressSuccess,
  getPlayerPayoutAddressFailure,
  getClaimableCount,
  getClaimableCountSuccess,
  getClaimableCountFailure,
  getStakingRewardXp,
  getStakingRewardXpSuccess,
  getStakingRewardXpFailure,
  getNextPossibleClaim,
  getNextPossibleClaimSuccess,
  getNextPossibleClaimFailure,
  balanceOfAllowance,
  balanceOfAllowanceSuccess,
  balanceOfAllowanceFailure,
  getQualificationSetting,
  getQualificationSettingSuccess,
  getQualificationSettingFailure,
  verifyInviteCodeSuccess,
  verifyInviteCodeError,
  verifyInviteCode,
  verifyInviteCodeFailure,
  linkUserInviteCode,
  linkUserInviteSuccess,
  linkUserInviteFailure,
  testSuccess,
  getPlayerReferralData,
  getPlayerReferralDataSuccess,
  getPlayerReferralDataFailure,
  postKioskItemTempOrder,
  postKioskItemTempOrderSuccess,
  postKioskItemTempOrderFailure,
  postCheckItemTempOrder,
  postCheckItemTempOrderSuccess,
  postCheckItemTempOrderFailure,
  kioskItemCategoriesList,
  kioskItemCategoriesListSuccess,
  kioskItemCategoriesListFailure,
  deleteKioskImage,
  deleteKioskImageSuccess,
  deleteKioskImageFailure,
  checkTradingStatus,
  checkTradingStatusSuccess,
  checkTradingStatusFailure,
  getTourCategories,
  getTourCategoriesSuccess,
  getTourCategoriesFailure,
  getKioskCategories,
  getKioskCategoriesSuccess,
  getKioskCategoriesFailure,
  getKioskCategoriesDetail,
  getKioskCategoriesDetailSuccess,
  getKioskCategoriesDetailFailure,
} from './authenticationSlice'
import {
  postRequest,
  getRequest,
  makeGetRequest,
  makeGetRequestAdvance,
} from '../axiosClient'
import { handleException } from '../apiHelper'
import {
  getRequestAuth,
  getRequestAuthQ,
  postRequestAuth,
  putRequestAuth,
} from '../axiosClientAuth'
import axios from 'axios'
import { API_CONSTANTS as constants } from '@root/constants'

function* loginAPI(action) {
  window.localStorage.removeItem('ISLAUNCHCLICKED')
  try {
    const response = yield call(() =>
      postRequest('accounts/login/', action.payload),
    )
    yield put(loginSuccess(response.data))
    if (response?.data?.is_email_verified) {
      yield put(getUserDetails())
    }
  } catch (error) {
    yield put(loginFailure(error))
    handleException(error)
  }
}

function* loginWithWalletAPI(action) {
  try {
    const url = window.location.href
    const parts = url.split('/')
    const [, lastPart, secondLastPart] = parts.slice(-3)
    const address = localStorage.getItem('externalWalletAddress')
    const wallet = action.payload?.privy_id ? 'Privy' : 'Wallet'
    console.log({ lastPart, secondLastPart, parts })
    let referralValue = null
    if (
      lastPart === 'invite' &&
      [0, 2, 3].includes(parseInt(localStorage.getItem('qualification')))
    ) {
      referralValue = secondLastPart
    }
    const payload = {
      address: address,
      referral: referralValue,
      wallet_type: wallet === 'Privy' ? 1 : 2,
    }
    if (wallet === 'Privy') {
      payload.email = action.payload?.email
      payload.privy_id = action.payload?.privy_id
      console.log('for test loginWithWalletAPI', payload)
      console.log('action.payload?.email:', action.payload?.email)
      console.log('action.payload?.privy_id:', action.payload?.privy_id)
    }
    const response = yield call(() =>
      postRequest('accounts/login-metamask/', payload),
    )
    yield put(testSuccess(response.data))
    yield put(loginWithWalletSuccess(response.data))
    yield put(getNotificationsCount())
  } catch (error) {
    console.log('LOGINWALLETERR::', error)
    yield put(loginWithWalletFailure(error))
  }
}

function* getSelectedLanguageAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('accounts/selected-language/'),
    )
    yield put(getSelectedLanguageSuccess(response.data))
  } catch (error) {
    // handleException(error)
    yield put(getSelectedLanguageSuccess(null))
  }
}

function* setSelectedLanguageAPI(action) {
  try {
    let response
    if (action.payload.hasSelected) {
      response = yield call(() =>
        putRequestAuth('accounts/selected-language/', {
          language: action.payload.language,
        }),
      )
    } else {
      response = yield call(() =>
        // postRequestAuth('accounts/selected-language/', { //commented because it doesn't work
        putRequestAuth('accounts/selected-language/', {
          language: action.payload.language,
        }),
      )
    }
    yield put(setSelectedLanguageSuccess(response.data))
  } catch (error) {
    console.log({ error })
    // handleException(error)
  }
}

function* loginWithOtpAPI(action) {
  try {
    const response = yield call(() =>
      postRequest('accounts/login/', action.payload),
    )
    yield put(loginWithOtpSuccess(response.data))
    // refreshTokenSuccess(resp)
    yield put(refreshTokenSuccess(response.data))
    yield put(getNotificationsCount())

    if (response?.data?.is_email_verified) {
      yield put(getUserDetails())
    }
  } catch (error) {
    yield put(loginWithOtpFailure(error))
    handleException(error)
  }
}

function* signUpAPI(action) {
  try {
    const response = yield call(() =>
      postRequest('accounts/signup/', action.payload),
    )
    yield put(signUpSuccess(action.payload.email))
  } catch (error) {
    yield put(signUpFailure(error))
    handleException(error)
  }
}

function* forgotPasswordAPI(action) {
  try {
    const response = yield call(() =>
      postRequest('accounts/forgotPassword/', action.payload),
    )
    yield put(forgotPasswordSuccess(response.data))
  } catch (error) {
    handleException(error)
    yield put(forgotPasswordFailure(error))
  }
}
function* logoutAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('accounts/logout/', action.payload.reqParams),
    )
    yield put(logoutSuccess(response.data))
  } catch (error) {
    yield put(logoutFailure(error))
  }
}
function* resetPasswordAPI(action) {
  try {
    const response = yield call(() =>
      postRequest('accounts/resetPassword/', action.payload),
    )
    yield put(resetPasswordSuccess(response.data))
  } catch (error) {
    yield put(resetPasswordFailure(error))
    handleException(error)
  }
}

function* changePasswordAPI(action) {
  try {
    const response = yield call(() =>
      postRequest('accounts/change-password', action.payload),
    )
    yield put(setLoading(false, response.data))
  } catch (error) {
    yield put(setLoading(false))
    handleException(error)
  }
}

function* emailConfirmationAPI(action) {
  try {
    const response = yield call(() =>
      postRequest('accounts/change-password', action.payload),
    )
    yield put(setLoading(false, response))
  } catch (error) {
    yield put(setLoading(false))
    handleException(error)
  }
}

function* emailVerification(action) {
  try {
    const response = yield call(() =>
      postRequest('accounts/verify/email/', action.payload),
    )
    yield put(verifyEmailSuccess(response.data))
  } catch (error) {
    yield put(verifyEmailFailure(error))
    handleException(error)
  }
}

function* buyNftEstimation(action) {
  try {
    const response = yield call(() =>
      postRequest('accounts/verify/email/', action.payload),
    )
    yield put(changeNftValueSuccess(response.data))
  } catch (error) {
    yield put(changeNftValueFailure(error))
    handleException(error)
  }
}

function* resendEmailAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `accounts/resend/verificatonEmail/?email=${encodeURIComponent(
          action.payload.email,
        )}`,
      ),
    )
    yield put(resendEmailSuccess(response.data))
  } catch (error) {
    yield put(resendEmailFailure(error))
  }
}
function* refreshTokenAPI(action) {
  try {
    const response = yield call(() =>
      postRequest('accounts/api/token/refresh/', action.payload),
    )
    yield put(refreshTokenSuccess(response.data))
  } catch (e) {
    // yield put(refreshTokenFailure())
    // yield put(logout())
  }
}
function* getUserDetailsAPI() {
  try {
    const response = yield call(() => makeGetRequestAdvance('users/me'))
    yield put(getUserDetailsSuccess(response.data))
  } catch (e) {
    handleException(e)
    yield put(getUserDetailsFailure())
  }
}

function* getWalletDetailsApi() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `wallets/wallet/?id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(getWalletSuccess(response.data))
    // throw new UserException('token_not_valid')
  } catch (e) {
    yield put(getWalletFailure(e.response))
    handleException(e)
  }
}

function* getLiveBalanceApi() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `wallets/wallet/?id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(getLiveBalanceSuccess(response.data))
    // throw new UserException('token_not_valid')
  } catch (e) {
    yield put(getLiveBalanceFailure(e.response))
    handleException(e)
  }
}

function* getWalletCryptoApi() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('wallets/send-crypto/'),
    )
    yield put(getWalletCryptoSuccess(response.data))
    // throw new UserException('token_not_valid')
  } catch (e) {
    yield put(getWalletCryptoFailure(e))
    handleException(e)
  }
}

function* transferToWalletAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('wallets/send-crypto/', action.payload),
    )
    yield put(transferToWalletSuccess(response.data))
  } catch (e) {
    yield put(transferToWalletFailure(e.response))
    handleException(e)
  }
}
function* getTransferableAmountAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'wallets/send-crypto/?to_address=' + action.payload,
      ),
    )
    yield put(getTransferableAmountSuccess(response.data))
  } catch (e) {
    yield put(getTransferableAmountFailure(e))
    handleException(e)
  }
}

function* getCountriesApi() {
  try {
    const response = yield call(() => getRequest('wallets/country/'))
    yield put(getCountriesSuccess(response.data))
  } catch (e) {
    yield put(getCountriesFailure(e))
  }
}

function* getNotificationApi() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('accounts/get-notification/'),
    )
    yield put(getNotificationSuccess(response.data))
  } catch (e) {
    yield put(getNotificationFailure(e))
  }
}

function* getWalletAddressApi(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `wallets/address-detail/?address=${
          action.payload
        }&id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(getWalletAddressSuccess(response.data))
  } catch (error) {
    yield put(getWalletAddressFailure(error))
  }
}
function* getHeaderBalanceApi() {
  // console.log('getHeaderBalanceApi')
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      yield put(signout())
    }
    const response = yield call(() =>
      makeGetRequestAdvance(
        `wallets/landing-page-wallet/?id=${uuidv4()}&timeStamp=${new Date().getTime()}`,
      ),
    )
    yield put(getHeaderBalanceSuccess(response.data))
  } catch (error) {
    yield put(getHeaderBalanceFailure(error))
  }
}
function* createWalletApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('wallets/wallet/', action.payload),
    )
    yield put(createWalletSuccess(response.data))
  } catch (error) {
    yield put(createWalletFailure(error))
    handleException(error)
  }
}

function* sendMaticApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('wallets/send-crypto/', action.payload),
    )
    yield put(sendMaticsSuccess(response.data))
  } catch (error) {
    yield put(sendMaticsFailure(error))
    handleException(error)
  }
}

function* exportPrivateKeyApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('wallets/privatekey/', action.payload),
    )
    yield put(exportKeySuccess(response.data))
  } catch (error) {
    yield put(exportKeyError(error))
    handleException(error)
  }
}

function* getIpAddressAPI(action) {
  try {
    const response = yield call(() =>
      axios.get('https://api.ipify.org?format=json'),
    )
    yield put(getIpBasedLocale(response.data))
  } catch (error) {
    yield put(getIpAddressFailure(error))
  }
}

function* getIpLocaleCurrencyAPI(action) {
  try {
    const response = yield call(() => axios.get('https://ipapi.co/currency'))
    yield put(getIpLocaleCurrencySuccess(response.data))
  } catch (error) {
    yield put(getIpLocaleCurrencyFailure(error))
  }
}

function* checkEUCountryAPI(action) {
  try {
    const response = yield call(() => axios.get('https://ipapi.co/in_eu'))
    yield put(checkEUCountrySuccess(response.data))
  } catch (error) {
    yield put(checkEUCountryFailure(error))
  }
}

function* getFactsheetUrlAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'accounts/factsheet/?language=' +
          (localStorage.getItem('language') ?? 'en'),
      ),
    )
    yield put(getFactsheetUrlSuccess(response.data))
  } catch (error) {
    yield put(getFactsheetUrlError(error))
  }
}

function* getIpBasedLocaleAPI(action) {
  const {
    payload: { ip },
  } = action
  try {
    const response = yield call(() =>
      axios.get(
        'https://api.ipstack.com/' +
          ip +
          '?access_key=e7c6e6e0d47453d03ef9c4bbbf16050a',
      ),
    )
    yield put(getIpBasedLocaleSuccess(response.data))
  } catch (error) {
    yield put(getIpBasedLocaleError(error))
  }
}

function* resendOtpAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `accounts/resend/otp/?email=${encodeURIComponent(
          action.payload.email,
        )}`,
      ),
    )
    yield put(resendOtpSuccess(response.data))
  } catch (error) {
    yield put(resendOtpError(error))
  }
}

function* setSignupFormVisible() {
  // yield put(showSignupForm(true))
}

function* getWalletSeedAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('wallets/wallet-seed/'),
    )
    yield put(getWalletSeedSuccess(response.data))
    // throw new UserException('token_not_valid')
  } catch (e) {
    yield put(getWalletSeedFailure(e))
    handleException(e)
  }
}
function* setSocialHandlesAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/social-handles/', action.payload),
    )
    yield put(setSocialHandlesLinksSuccess(response.data))
  } catch (error) {
    yield put(setSocialHandlesLinksFailure(error))
    // handleException(error)
  }
}
function* getWalletChartAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'wallets/wallet-balance-list/?' + action.payload ?? '',
      ),
    )
    yield put(getWalletChartSuccess(response.data))
  } catch (error) {
    yield put(getWalletChartFailure(error))
    handleException(error)
  }
}
function* getPlayerCoinChartAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/player-balance-history/?' + action.payload ?? '',
      ),
    )
    yield put(getPlayerCoinChartSuccess(response.data))
  } catch (error) {
    yield put(getPlayerCoinChartFailure(error))
    handleException(error)
  }
}
function* getPlayerImageAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/player-card/?detailpageurl=' + action.payload ?? '',
      ),
    )
    yield put(getPlayerImageSuccess(response.data))
  } catch (error) {
    yield put(getPlayerImageFailure(error))
  }
}

function* postPlayerImageAPI(action) {
  try {
    const response = yield call(() =>
      postRequest('players/player-card/', action.payload),
    )
    yield put(postPlayerImageSuccess(response.data))
  } catch (error) {
    yield put(postPlayerImageFailure(error))
  }
}

function* getNotificationsSettingsAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('accounts/notification-settings/'),
    )
    yield put(getNotificationsSettingsSuccess(response.data))
  } catch (error) {
    yield put(getNotificationsSettingsFailure(error))
    // handleException(error)
  }
}

function* postNotificationsSettingsAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('accounts/notification-settings/', action.payload),
    )
    yield put(postNotificationsSettingsSuccess(response.data))
    yield put(getNotificationsSettings())
  } catch (error) {
    yield put(postNotificationsSettingsFailure(error))
    // handleException(error)
  }
}
function* getAllNotificationsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `accounts/all-notification/?offset=${action?.payload?.offset}`,
      ),
    )
    yield put(getAllNotificationsSuccess(response.data))
    yield put(getNotificationsCount())
  } catch (error) {
    yield put(getAllNotificationsFailure(error))
    handleException(error)
  }
}

function* getNotificationsCountAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('accounts/notification-count/'),
    )
    yield put(getNotificationsCountSuccess(response.data))
  } catch (error) {
    yield put(getNotificationsCountFailure(error))
    handleException(error)
  }
}

function* getLiveNotificationsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `accounts/live-notification/?after_login=${action?.payload}`,
      ),
    )
    yield put(getLiveNotificationsSuccess(response.data))
  } catch (error) {
    yield put(getLiveNotificationsFailure(error))
    handleException(error)
  }
}

function* postVerifyWhatsAppAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/verify-whatsapp/', action.payload),
    )
    yield put(postVerifyWhatsAppSuccess(response.data))
  } catch (error) {
    yield put(postVerifyWhatsAppFailure(error))
    // handleException(error)
  }
}

function* postResendWhatsAppAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/resend-otp-whatsapp/', action.payload),
    )
    yield put(postResendWhatsAppSuccess(response.data))
  } catch (error) {
    yield put(postResendWhatsAppFailure(error))
    // handleException(error)
  }
}

function* postChangeWhatsAppNumberAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/change-whatsapp-number/', action.payload),
    )
    yield put(postChangeWhatsAppNumberSuccess(response.data))
  } catch (error) {
    yield put(postChangeWhatsAppNumberFailure(error))
    // handleException(error)
  }
}

function* postPlayerSettingsAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/player-settings/', action.payload),
    )
    yield put(postPlayerSettingsSuccess(response.data))
  } catch (error) {
    yield put(postPlayerSettingsFailure(error))
    // handleException(error)
  }
}

function* postUserSettingsAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('accounts/wallet-settings/', action.payload),
    )
    yield put(postUserSettingsSuccess(response.data))
  } catch (error) {
    yield put(postUserSettingsFailure(error))
    // handleException(error)
  }
}
function* getUserSettingsAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('accounts/wallet-settings/'),
    )
    yield put(getUserSettingsSuccess(response.data))
  } catch (error) {
    yield put(getUserSettingsFailure(error))
    // handleException(error)
  }
}

function* postUserSettingsVerifyWhatsAppAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('accounts/verify-whatsapp/', action.payload),
    )
    yield put(postUserSettingsVerifyWhatsAppSuccess(response.data))
  } catch (error) {
    yield put(postUserSettingsVerifyWhatsAppFailure(error))
    // handleException(error)
  }
}

function* postChangeUserSettingsWhatsAppNumberAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('accounts/change-whatsapp-number/', action.payload),
    )
    yield put(postChangeUserSettingsWhatsAppNumberSuccess(response.data))
  } catch (error) {
    yield put(postChangeUserSettingsWhatsAppNumberFailure(error))
    // handleException(error)
  }
}

function* postResendUserSettingsWhatsAppAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('accounts/resend-otp-whatsapp/', action.payload),
    )
    yield put(postResendUserSettingsWhatsAppSuccess(response.data))
  } catch (error) {
    yield put(postResendUserSettingsWhatsAppFailure(error))
    // handleException(error)
  }
}

function* getCurrencyListAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('wallets/currency-list/', action.payload),
    )
    yield put(getCurrencyListSuccess(response.data))
  } catch (error) {
    yield put(getCurrencyListFailure(error))
    // handleException(error)
  }
}

function* getFiatCurrencyListAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('wallets/fiat-currency-list/'),
    )
    yield put(getFiatCurrencyListSuccess(response.data))
  } catch (error) {
    yield put(getFiatCurrencyListFailure(error))
  }
}

function* getCurrencyRateAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'wallets/currency-rate-in-usd/?currency=' + action.payload,
      ),
    )
    yield put(getCurrencyRateSuccess(response.data))
  } catch (error) {
    yield put(getCurrencyRateFailure(error))
  }
}

function* getEuroCurrencyRateAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('wallets/currency-rate-in-usd/?currency=EUR'),
    )
    yield put(getEuroCurrencyRateSuccess(response.data))
  } catch (error) {}
}

function* getChangeSecretOtpApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('accounts/get-secret-change-otp/'),
    )
    yield put(sendChangeSecretOtpSuccess(response.data))
  } catch (error) {
    yield put(sendChangeSecretOtpFailure(error))
  }
}

function* changeSecretApi(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('accounts/secret-change/', action.payload),
    )
    yield put(changeSecretSuccess(response.data))
  } catch (error) {
    yield put(changeSecretFailure(error))
  }
}

function* getPendingKioskListAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/playerPendingKioskOrderList/?player_contract=' +
          action.payload,
      ),
    )
    yield put(getPendingKioskListSuccess(response.data))
  } catch (error) {
    console.log({ error })
    yield put(getPendingKioskListFailure(error))
  }
}

function* getFulfilledKioskListAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/playerFulfilledKioskOrderList/?player_contract=${action.payload.player_contract}&last_month=${action.payload.last_month}`,
      ),
    )
    yield put(getFulfilledKioskListSuccess(response.data))
  } catch (error) {
    yield put(getFulfilledKioskListFailure(error))
  }
}

function* getKioskOrderDetailAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/kioskOrderDetail/?hash=' + action.payload.hash,
      ),
    )
    yield put(getKioskOrderDetailSuccess(response.data))
  } catch (error) {
    yield put(getKioskOrderDetailFailure(error))
  }
}

function* getPlayerKioskListAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/playerKioskList/?player_contract=' + action.payload,
      ),
    )
    yield put(getPlayerKioskListSuccess(response.data))
  } catch (error) {
    yield put(getPlayerKioskListFailure(error))
  }
}

function* postFulfillKioskOrderAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/fulfillKioskOrder/', action.payload),
    )
    yield put(postFulfillKioskOrderSuccess(response.data))
  } catch (error) {
    yield put(postFulfillKioskOrderFailure(error))
  }
}

function* getCheckPlayerCoinBalAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        'players/checkWalletBalance/?player_contract=' + action.payload,
      ),
    )
    yield put(getCheckPlayerCoinBalSuccess(response.data))
  } catch (error) {
    yield put(getCheckPlayerCoinBalFailure(error))
  }
}

function* postPlaceKioskOrderAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/kioskItemOrder/', action.payload),
    )
    yield put(postPlaceKioskOrderSuccess(response.data))
  } catch (error) {
    yield put(postPlaceKioskOrderFailure(error))
  }
}

function* postKioskItemPaymentAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('players/kioskItemPayment/', action.payload),
    )
    yield put(postKioskItemPaymentSuccess(response.data))
  } catch (error) {
    yield put(postKioskItemPaymentFailure(error))
  }
}

function* getKioskItemDetailAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/kioskItem/?itemId=' + action.payload),
    )
    yield put(getKioskItemDetailSuccess(response.data))
  } catch (error) {
    yield put(getKioskItemDetailFailure(error))
  }
}

function* sendTransOtpAPI() {
  try {
    const response = yield call(() => postRequestAuth('accounts/send-otp/'))
    yield put(sendTransOtpSuccess(response.data))
  } catch (error) {
    console.log('transotperr', error)
    yield put(sendTransOtpFailure(error))
  }
}

function* postUploadFileAPI(action) {
  const hash = action.payload.get('hash')
  try {
    const response = yield call(() =>
      postRequestAuth('players/uploadKioskDigitalItem/', action.payload),
    )
    yield put(postUploadFileSuccess(response.data))
    yield put(getKioskOrderDetail({ hash, reload: false }))
  } catch (error) {
    yield put(postUploadFileFailure(error))
  }
}

function* getDigitalItemAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/sendKioskDigitalItem/?hash=${action?.payload?.hash}&playerDetailPageURL=${action?.payload?.detail_page}`,
      ),
    )
    yield put(getDigitalItemSuccess(response.data))
  } catch (error) {
    yield put(getDigitalItemFailure(error))
  }
}

function* getReferralDataAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`accounts/user-invite-data/`),
    )
    yield put(getReferralDataSuccess(response.data))
  } catch (error) {
    yield put(getReferralDataFailure(error))
  }
}

function* postReferralPayoutAPI(action) {
  console.log({ action })
  try {
    const response = yield call(() =>
      postRequestAuth('wallets/referral-payout/'),
    )
    yield put(postReferralPayoutSuccess(response.data))
  } catch (error) {
    yield put(postReferralPayoutFailure(error))
  }
}

function* getCheckWatchListAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/check-watchlist/?detailpageurl=${action.payload}`,
      ),
    )
    yield put(getCheckWatchListSuccess(response.data))
  } catch (error) {
    yield put(getCheckWatchListFailure(error))
  }
}

function* postWatchListAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth(`players/watchlist-player/`, action.payload),
    )
    yield put(postWatchListSuccess(response.data))
  } catch (error) {
    yield put(postWatchListFailure(error))
  }
}

function* getGeneralSettingsAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('accounts/general-settings/', action.payload),
    )
    yield put(getGeneralSettingsSuccess(response.data))
  } catch (error) {
    yield put(getGeneralSettingsFailure(error))
    // handleException(error)
  }
}

function* getWatchListPlayerAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('players/list-watchlist-players/', action.payload),
    )
    yield put(getWatchListPlayerSuccess(response.data))
  } catch (error) {
    yield put(getWatchListPlayerFailure(error))
  }
}

function* getLatestTradeAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/player_trades/?playercontract=${action?.payload?.player_contract}&offset=${action?.payload?.offset}`,
      ),
    )
    yield put(getLatestTradeSuccess(response.data))
  } catch (error) {
    yield put(getLatestTradeFailure(error))
    handleException(error)
  }
}

function* getLatestTradeHistoryAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/player_trades/?playercontract=${action?.payload?.player_contract}&offset=${action?.payload?.offset}`,
      ),
    )
    yield put(getLatestTradeHistorySuccess(response.data))
  } catch (error) {
    yield put(getLatestTradeHistoryFailure(error))
    handleException(error)
  }
}
function* getUserRankingListAPI(action) {
  try {
    const url = new URL(constants.HOST_URL + '/accounts/user-ranking-list/')
    const searchParams = url.searchParams
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams.set(paramSet[i], action.payload[paramSet[i]])
    }
    const response = yield call(() => makeGetRequestAdvance(url.toString()))
    yield put(getUserRankingListSuccess(response.data))
  } catch (error) {
    console.log(error)
    yield put(getUserRankingListFailure(error))
    handleException(error)
  }
}

function* getUserPlayerCoinListAPI(action) {
  try {
    let searchParams = ''
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams += `${i ? '&' : ''}${paramSet[i]}=${
        action.payload[paramSet[i]]
      }`
    }
    const response = yield call(() =>
      makeGetRequestAdvance(
        `accounts/user-player-coin-balance/?${searchParams}`,
      ),
    )
    yield put(getUserPlayerCoinListSuccess(response.data))
  } catch (error) {
    yield put(getUserPlayerCoinListFailure(error))
    handleException(error)
  }
}

function* getUserPublicPlayerCoinListAPI(action) {
  try {
    const url = new URL(
      constants.HOST_URL + '/accounts/user-public-player-coin-balance/',
    )
    const accessToken = localStorage.getItem('accessToken')
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
    yield put(getUserPublicPlayerCoinListSuccess(response.data))
  } catch (error) {
    yield put(getUserPublicPlayerCoinListFailure(error))
    handleException(error)
  }
}

function* getUserNftListAPI(action) {
  try {
    let searchParams = ''
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams += `${i ? '&' : ''}${paramSet[i]}=${
        action.payload[paramSet[i]]
      }`
    }
    const response = yield call(() =>
      makeGetRequestAdvance(`accounts/user-nfts/?${searchParams}`),
    )
    yield put(getUserNftListSuccess(response.data))
  } catch (error) {
    yield put(getUserNftListFailure(error))
    handleException(error)
  }
}

function* getUserPublicNftListAPI(action) {
  try {
    const url = new URL(constants.HOST_URL + '/accounts/user-public-nfts/')
    const accessToken = localStorage.getItem('accessToken')
    const searchParams = url.searchParams
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams.set(paramSet[i], action.payload[paramSet[i]])
    }
    const response = yield call(() =>
      axios.get(url.toString(), {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    )
    yield put(getUserPublicNftListSuccess(response.data))
  } catch (error) {
    yield put(getUserPublicNftListFailure(error))
    handleException(error)
  }
}
function* getUserProfileAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance('accounts/user-basic-data/'),
    )
    yield put(getUserProfileSuccess(response.data))
  } catch (error) {
    yield put(getUserProfileFailure(error))
    handleException(error)
  }
}

function* getUserPublicProfileAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `accounts/user-public-basic-data/?username=${action?.payload}`,
      ),
    )
    yield put(getUserPublicProfileSuccess(response.data))
  } catch (error) {
    yield put(getUserPublicProfileFailure(error))
    handleException(error)
  }
}

function* postCartoonAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth(`players/cartoon_filter_toggle/`, action.payload),
    )
    yield put(postCartoonSuccess(response.data))
  } catch (error) {
    yield put(postCartoonFailure(error))
  }
}
function* getCartoonizeStatusAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/check_cartoonizing_status/?player_id=${action?.payload?.player_id}`,
      ),
    )
    yield put(getCartoonizeStatusSuccess(response.data))
  } catch (error) {
    yield put(getCartoonizeStatusFailure(error))
  }
}

function* getFanClubAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/fan_club_player_list/?offset=${action?.payload?.offset}&limit=${action?.payload?.limit}&search=${action?.payload?.search}`,
      ),
    )
    yield put(getFanClubSuccess(response.data))
  } catch (error) {
    yield put(getFanClubFailure(error))
    handleException(error)
  }
}

function* getGlobalCardSettingAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`accounts/global-card-setting`),
    )
    yield put(getGlobalCardSettingSuccess(response.data))
  } catch (error) {
    yield put(getGlobalCardSettingFailure(error))
    handleException(error)
  }
}

function* getNftImageAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/nft/${action?.payload?.ticker}/${action?.payload?.id}`,
      ),
    )
    yield put(getNftImageSuccess(response.data))
  } catch (error) {
    yield put(getNftImageFailure(error))
  }
}

function* postClaimFreeXpAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('accounts/claim-daily-xp/', action.payload),
    )
    yield put(postClaimFreeXpSuccess(response.data))
  } catch (error) {
    yield put(postClaimFreeXpFailure(error))
  }
}

function* getBlockPerSecondAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`players/blockpersec/`),
    )
    yield put(getBlockPerSecondSuccess(response.data))
  } catch (error) {
    yield put(getBlockPerSecondFailure(error))
  }
}

function* getOwnerListAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/get_nft_owners/?nft_contract=${action?.payload?.nftContract}&token_id=${action?.payload?.tokenId}`,
      ),
    )
    yield put(getOwnerListSuccess(response.data))
  } catch (e) {
    yield put(getOwnerListFailure(e))
    handleException(e)
  }
}

function* getPlayerSharesAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `wallets/token-balance/?player_contract=${action?.payload?.playerContract}`,
      ),
    )
    yield put(getPlayerSharesSuccess(response.data))
  } catch (e) {
    yield put(getPlayerSharesFailure(e))
    handleException(e)
  }
}

function* getUserXpAPI() {
  try {
    const response = yield call(() => makeGetRequestAdvance(`accounts/user-xp`))
    yield put(getUserXpSuccess(response.data))
  } catch (error) {
    yield put(getUserXpFailure(error))
  }
}

function* getUserXpRateAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`players/xp_conv_pct_value`),
    )
    yield put(getUserXpRateSuccess(response.data))
  } catch (error) {
    yield put(getUserXpRateFailure(error))
  }
}

function* getClaimableXpAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `accounts/get-claimable-xp/?player=${action?.payload?.playerContract}`,
      ),
    )
    yield put(getClaimableXpSuccess(response.data))
  } catch (e) {
    yield put(getClaimableXpFailure(e))
    handleException(e)
  }
}

function* getNextAvailabilityForActivityAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `accounts/get-next-availablity-for-activity/?type=0`,
      ),
    )
    yield put(getNextAvailabilityForActivitySuccess(response.data))
  } catch (e) {
    yield put(getNextAvailabilityForActivityFailure(e))
    handleException(e)
  }
}

function* getDraftingReallocationPercentageAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/drafting_reallocation_percentage/?player_contract=${action?.payload?.playerContract}`,
      ),
    )
    yield put(getDraftingReallocationPercentageSuccess(response.data))
  } catch (e) {
    yield put(getDraftingReallocationPercentageFailure(e))
    handleException(e)
  }
}

function* getPlayerPayoutAddressAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/player_payout_address/?player_contract=${action?.payload?.playerContract}`,
      ),
    )
    yield put(getPlayerPayoutAddressSuccess(response.data))
  } catch (e) {
    yield put(getPlayerPayoutAddressFailure(e))
    handleException(e)
  }
}

function* getClaimableCountAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/get_claimable_count/?nft_contract=${action?.payload?.nftContract}&tokenid=${action?.payload?.tokenId}`,
      ),
    )
    yield put(getClaimableCountSuccess(response.data))
  } catch (e) {
    yield put(getClaimableCountFailure(e))
    handleException(e)
  }
}

function* getStakingRewardXpAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/get_staking_reward_xp/?staking_contract=${action?.payload?.stakingContract}`,
      ),
    )
    yield put(getStakingRewardXpSuccess(response.data))
  } catch (e) {
    yield put(getStakingRewardXpFailure(e))
    handleException(e)
  }
}

function* getNextPossibleClaimAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/get_next_possible_claim/?staking_contract=${action?.payload?.stakingContract}`,
      ),
    )
    yield put(getNextPossibleClaimSuccess(response.data))
  } catch (e) {
    yield put(getNextPossibleClaimFailure(e))
    handleException(e)
  }
}

function* balanceOfAllowanceAPI(action) {
  let response
  try {
    if (action?.payload?.playercontract) {
      response = yield call(() =>
        makeGetRequestAdvance(
          `wallets/balanceof_allowance/?spender=${action?.payload?.spender}&playercontract=${action?.payload?.playercontract}`,
        ),
      )
    } else {
      response = yield call(() =>
        makeGetRequestAdvance(
          `wallets/balanceof_allowance/?spender=${action?.payload?.spender}`,
        ),
      )
    }
    yield put(balanceOfAllowanceSuccess(response.data))
  } catch (e) {
    yield put(balanceOfAllowanceFailure(e))
    handleException(e)
  }
}

function* getQualificationSettingAPI() {
  try {
    const response = yield call(
      () =>
        // makeGetRequest(`accounts/app_qualification_setting/`),
        makeGetRequestAdvance(`accounts/app_qualification_setting/`, null),
      // makeRequest('/endpoint', 'GET', requestData);
    )
    yield put(getQualificationSettingSuccess(response.data))
  } catch (error) {
    yield put(getQualificationSettingFailure(error))
  }
}

function* verifyInviteCodeAPI(action) {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const url = new URL(
      constants.HOST_URL + '/accounts/check_user_wallet_code/',
    )
    const searchParams = url.searchParams
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams.set(paramSet[i], action.payload[paramSet[i]])
    }
    // const response = yield call(() =>
    //   axios.get(url.toString(), {
    //     withCredentials: true,
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }),
    // )
    const response = yield call(() => makeGetRequestAdvance(url.toString()))
    yield put(verifyInviteCodeSuccess(response.data))
  } catch (error) {
    console.log(error)
    yield put(verifyInviteCodeFailure(error))
  }
}

function* linkInviteAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth('accounts/link_user_invite/', action.payload),
    )
    yield put(linkUserInviteSuccess(response.data))
    yield put(getQualificationSetting())
  } catch (e) {
    yield put(linkUserInviteFailure(e.response.data))
  }
}

function* getPlayerReferralDataAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`accounts/referral-data/`),
    )
    yield put(getPlayerReferralDataSuccess(response.data))
  } catch (error) {
    yield put(getPlayerReferralDataFailure(error))
  }
}

function* postKioskItemTempOrderAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth(`players/kioskItemTempOrder/`, action.payload),
    )
    yield put(postKioskItemTempOrderSuccess(response.data))
  } catch (error) {
    yield put(postKioskItemTempOrderFailure(error))
  }
}

function* postCheckItemTempOrderAPI(action) {
  try {
    const response = yield call(() =>
      postRequestAuth(`players/checkItemTempOrder/`, action.payload),
    )
    yield put(postCheckItemTempOrderSuccess(response.data))
  } catch (error) {
    yield put(postCheckItemTempOrderFailure(error))
  }
}

function* kioskItemCategoriesListAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`players/KioskItemCategoriesList/`),
    )
    yield put(kioskItemCategoriesListSuccess(response.data))
  } catch (error) {
    yield put(kioskItemCategoriesListFailure(error))
  }
}

function* deleteKioskImageAPI(action) {
  try {
    const response = yield call(() =>
      putRequestAuth('players/kioskItem/', action.payload),
    )
    yield put(deleteKioskImageSuccess(response.data))
  } catch (error) {
    yield put(deleteKioskImageFailure(error))
  }
}

function* checkTradingStatusAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/check_trading_status/?player_contract=${action?.payload}`,
      ),
    )
    yield put(checkTradingStatusSuccess(response.data))
  } catch (e) {
    yield put(checkTradingStatusFailure(e))
    handleException(e)
  }
}

function* getTourCategoriesAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`accounts/wallet_app_tour_categories`),
    )
    yield put(getTourCategoriesSuccess(response.data))
  } catch (e) {
    yield put(getTourCategoriesFailure(e))
  }
}

function* getKioskCategoriesAPI() {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(`players/available_kiosk_item_categories/`),
    )
    yield put(getKioskCategoriesSuccess(response.data))
  } catch (e) {
    yield put(getKioskCategoriesFailure(e))
  }
}

function* getKioskCategoriesDetailAPI(action) {
  try {
    const response = yield call(() =>
      makeGetRequestAdvance(
        `players/kiosk_category_items/?kioskItemCategoryId=${action?.payload}`,
      ),
    )
    yield put(getKioskCategoriesDetailSuccess(response.data))
  } catch (error) {
    yield put(getKioskCategoriesDetailFailure(error))
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(getKioskCategoriesDetail, getKioskCategoriesDetailAPI),
    takeLatest(getKioskCategories, getKioskCategoriesAPI),
    takeLatest(checkTradingStatus, checkTradingStatusAPI),
    takeLatest(deleteKioskImage, deleteKioskImageAPI),
    takeLatest(kioskItemCategoriesList, kioskItemCategoriesListAPI),
    takeLatest(postKioskItemTempOrder, postKioskItemTempOrderAPI),
    takeLatest(postCheckItemTempOrder, postCheckItemTempOrderAPI),
    takeLatest(getPlayerReferralData, getPlayerReferralDataAPI),
    takeLatest(getQualificationSetting, getQualificationSettingAPI),
    takeLatest(balanceOfAllowance, balanceOfAllowanceAPI),
    takeLatest(getNextPossibleClaim, getNextPossibleClaimAPI),
    takeLatest(getStakingRewardXp, getStakingRewardXpAPI),
    takeLatest(getClaimableCount, getClaimableCountAPI),
    takeLatest(getPlayerPayoutAddress, getPlayerPayoutAddressAPI),
    takeLatest(
      getDraftingReallocationPercentage,
      getDraftingReallocationPercentageAPI,
    ),
    takeLatest(
      getNextAvailabilityForActivity,
      getNextAvailabilityForActivityAPI,
    ),
    takeLatest(getClaimableXp, getClaimableXpAPI),
    takeLatest(getPlayerShares, getPlayerSharesAPI),
    takeLatest(getOwnerList, getOwnerListAPI),
    takeLatest(getBlockPerSecond, getBlockPerSecondAPI),
    takeLatest(postClaimFreeXp, postClaimFreeXpAPI),
    takeLatest(getNftImage, getNftImageAPI),
    takeLatest(getFanClub, getFanClubAPI),
    takeLatest(getCartoonizeStatus, getCartoonizeStatusAPI),
    takeLatest(postCartoon, postCartoonAPI),
    takeLatest(getLatestTrade, getLatestTradeAPI),
    takeLatest(getLatestTradeHistory, getLatestTradeHistoryAPI),
    takeLatest(getWatchListPlayer, getWatchListPlayerAPI),
    takeLatest(postWatchList, postWatchListAPI),
    takeLatest(getCheckWatchList, getCheckWatchListAPI),
    takeLatest(getHeaderBalance, getHeaderBalanceApi),
    takeLatest(postReferralPayout, postReferralPayoutAPI),
    takeLatest(getReferralData, getReferralDataAPI),
    takeLatest(getDigitalItem, getDigitalItemAPI),
    takeLatest(postUploadFile, postUploadFileAPI),
    takeLatest(sendTransOtp, sendTransOtpAPI),
    takeLatest(getKioskItemDetail, getKioskItemDetailAPI),
    takeLatest(postKioskItemPayment, postKioskItemPaymentAPI),
    takeLatest(postPlaceKioskOrder, postPlaceKioskOrderAPI),
    takeLatest(getCheckPlayerCoinBal, getCheckPlayerCoinBalAPI),
    takeLatest(postFulfillKioskOrder, postFulfillKioskOrderAPI),
    takeLatest(getPlayerKioskList, getPlayerKioskListAPI),
    takeLatest(getKioskOrderDetail, getKioskOrderDetailAPI),
    takeLatest(getPendingKioskList, getPendingKioskListAPI),
    takeLatest(getFulfilledKioskList, getFulfilledKioskListAPI),
    takeLatest(login, loginAPI),
    takeLatest(loginWithWallet, loginWithWalletAPI),
    takeLatest(getSelectedLanguage, getSelectedLanguageAPI),
    takeLatest(setSelectedLanguage, setSelectedLanguageAPI),
    takeLatest(loginWithOtp, loginWithOtpAPI),
    takeLatest(signUp, signUpAPI),
    takeLatest(resendEmail, resendEmailAPI),
    takeLatest(forgotPassword, forgotPasswordAPI),
    takeLatest(logout, logoutAPI),
    takeLatest(resetPassword, resetPasswordAPI),
    takeLatest(changePassword, changePasswordAPI),
    takeLatest(emailConfirmation, emailConfirmationAPI),
    takeLatest(verifyEmail, emailVerification),
    takeLatest(refreshToken, refreshTokenAPI),
    takeLatest(getUserDetails, getUserDetailsAPI),
    takeEvery(getWalletDetails, getWalletDetailsApi),
    takeEvery(getLiveBalance, getLiveBalanceApi),
    takeEvery(getWalletCrypto, getWalletCryptoApi),
    takeEvery(getCountries, getCountriesApi),
    takeLatest(getNotification, getNotificationApi),
    takeLatest(showSignupForm, setSignupFormVisible),
    takeLatest(createWallet, createWalletApi),
    takeLatest(changeNftValue, buyNftEstimation),
    takeLatest(sendMatics, sendMaticApi),
    takeLatest(exportKey, exportPrivateKeyApi),
    takeLatest(getWalletAddress, getWalletAddressApi),
    takeLatest(getIpAddress, getIpAddressAPI),
    takeLatest(getIpBasedLocale, getIpBasedLocaleAPI),
    takeLatest(getIpLocaleCurrency, getIpLocaleCurrencyAPI),
    takeLatest(checkEUCountry, checkEUCountryAPI),
    takeLatest(getFactsheetUrl, getFactsheetUrlAPI),
    takeLatest(resendOtp, resendOtpAPI),
    takeLatest(getWalletSeed, getWalletSeedAPI),
    takeLatest(setSocialHandlesLinks, setSocialHandlesAPI),
    takeLatest(getWalletChart, getWalletChartAPI),
    takeLatest(getPlayerCoinChart, getPlayerCoinChartAPI),
    takeLatest(transferToWallet, transferToWalletAPI),
    takeLatest(getTransferableAmount, getTransferableAmountAPI),
    takeLatest(getPlayerImage, getPlayerImageAPI),
    takeLatest(postPlayerImage, postPlayerImageAPI),
    takeLatest(getNotificationsSettings, getNotificationsSettingsAPI),
    takeLatest(postNotificationsSettings, postNotificationsSettingsAPI),
    takeLatest(getAllNotifications, getAllNotificationsAPI),
    takeLatest(getNotificationsCount, getNotificationsCountAPI),
    takeLatest(getLiveNotifications, getLiveNotificationsAPI),
    takeLatest(postVerifyWhatsApp, postVerifyWhatsAppAPI),
    takeLatest(postResendWhatsApp, postResendWhatsAppAPI),
    takeLatest(postChangeWhatsAppNumber, postChangeWhatsAppNumberAPI),
    takeLatest(postPlayerSettings, postPlayerSettingsAPI),
    takeLatest(postUserSettings, postUserSettingsAPI),
    takeLatest(getUserSettings, getUserSettingsAPI),
    takeLatest(
      postUserSettingsVerifyWhatsApp,
      postUserSettingsVerifyWhatsAppAPI,
    ),
    takeLatest(
      postChangeUserSettingsWhatsAppNumber,
      postChangeUserSettingsWhatsAppNumberAPI,
    ),
    takeLatest(
      postResendUserSettingsWhatsApp,
      postResendUserSettingsWhatsAppAPI,
    ),
    takeLatest(getCurrencyList, getCurrencyListAPI),
    takeLatest(getFiatCurrencyList, getFiatCurrencyListAPI),
    takeLatest(getCurrencyRate, getCurrencyRateAPI),
    takeLatest(getEuroCurrencyRate, getEuroCurrencyRateAPI),
    takeLatest(sendChangeSecretOtp, getChangeSecretOtpApi),
    takeLatest(changeSecret, changeSecretApi),
    takeLatest(getGeneralSettings, getGeneralSettingsAPI),
    takeLatest(getUserRankingList, getUserRankingListAPI),
    takeLatest(getUserPlayerCoinList, getUserPlayerCoinListAPI),
    takeLatest(getUserPublicPlayerCoinList, getUserPublicPlayerCoinListAPI),
    takeLatest(getUserNftList, getUserNftListAPI),
    takeLatest(getUserPublicNftList, getUserPublicNftListAPI),
    takeLatest(getUserProfile, getUserProfileAPI),
    takeLatest(getUserPublicProfile, getUserPublicProfileAPI),
    takeLatest(getGlobalCardSetting, getGlobalCardSettingAPI),
    takeLatest(getUserXp, getUserXpAPI),
    takeLatest(getUserXpRate, getUserXpRateAPI),
    takeLatest(verifyInviteCode, verifyInviteCodeAPI),
    takeLatest(linkUserInviteCode, linkInviteAPI),
    takeLatest(getTourCategories, getTourCategoriesAPI),
  ])
}
