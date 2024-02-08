import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Routes as GroupRoutes,
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  useLocation,
} from 'react-router-dom'
import i18n from '@root/i18n'
import { useDispatch, useSelector } from 'react-redux'
import {
  About,
  Landing,
  Notification,
  NotificationSettings,
  Menu,
  Language,
  Staked,
  Onboarding,
  EmailVerification,
  ResetPassword,
  ChangePassword,
  CreateWallet,
  Player,
  User,
  UserList,
  PlayerList,
  PlayerDashboard,
  PlayerNft,
  Blog,
  BlogDetail,
  NftList,
  Kiosk,
  Scouts,
  NftGallery,
  Faqs,
  LaunchCoin,
  Seasons,
  GetEarlyAccess,
  Genesis,
  InviteException,
} from '@pages/index'
import TermsConditions from '@pages/Terms&Policy/TermsConditions'
import PrivacyPolicy from '@pages/Terms&Policy/PrivacyPolicy'
import CookiePolicy from '@pages/Terms&Policy/CookiePolicy'
import ProtocolDisclaimer from '@pages/Terms&Policy/ProtocolDisclaimer'
import Careers from '@pages/Careers'
import ContactUs from '@pages/Careers/ContactUs'
import HowItWorks from '@pages/Terms&Policy/HowItWorks'
import PageNotFound from '@pages/NotFound'
import {
  Languages,
  POLYGON_NETWORK_PARAMS,
  THEME_COLORS,
  tempLanguages,
} from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import DialogBox from '@components/Dialog/DialogBox'
import NewsLetter from '@pages/Landing/NewsLetter'
import ReactGA from 'react-ga4'
import {
  getIpAddress,
  getNotification,
  getSelectedLanguage,
  logout as emailLogout,
  setWalletAddress,
  getWalletAddress,
  signout,
  getLiveNotifications,
  showWalletForm,
  getNotificationsCount,
  getUserSettings,
  getCurrencyRate,
  setUserSettingsSuccess,
  selectedTheme,
  getIpLocaleCurrency,
  loginWithWallet,
  resetExternalWalletSuccess,
  exportKeyReset,
  resetWallet,
  resetSendChangeSecretOtp,
  getHeaderBalance,
  getCountries,
  getGeneralSettings,
  getGlobalCardSetting,
  openSideMenu,
  getBlockPerSecond,
  getUserProfile,
  resetUserXp,
  getUserXp,
  setPrivyWallets,
  loginWithWalletCookie,
  getQualificationSetting,
  resetGeneralSettings,
  resetBalanceOfAllowance,
  toggleInvitePopup,
  setAddToHomeScreen,
  storePwaPrompt,
  setShowMore,
  getUserXpRate,
  makeAppInstall,
  getEuroCurrencyRate,
  checkEUCountry,
} from '@root/apis/onboarding/authenticationSlice'
import NewDraftPage from '@pages/PlayerDashboard/Drafts/NewDraftPage'
import Web3ActionPage from '@pages/PlayerDashboard/Drafts/Web3ActionPage'
import { ConnectContext } from '@root/WalletConnectProvider'
import ConfirmGoLive from '@pages/PlayerDashboard/PlayerCoin/confirmGoLive'
import TutorialsPage from '@pages/Landing/Tutorials/TutorialPage'
import {
  getPlayerDataInit,
  getItemsPrice,
  getUserPayedItems,
  checkPlayerStatus,
  resetPlayerData,
  resetCoinLaunch,
  getSeasonDetails,
  getApprovedCountriesForPlayerCreation,
  fetchPlayersBalance,
} from '@root/apis/playerCoins/playerCoinsSlice'
import SharePlayer from '@pages/Player/Profile/SharePlayer'
import PlayerImageShare from '@pages/Player/Profile/PlayerImageShare'
import { useTranslation } from 'react-i18next'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CloseIcon from '../assets/icons/icon/closeIcon.svg'
import TrophyIcon from '../assets/images/trophy.webp'
import { toast } from 'react-hot-toast'
import {
  asyncLocalStorage,
  getBrowserName,
  getCircleColor,
  isMobile,
  isPwa,
  toXPNumberFormat,
  truncateDecimalsStr,
} from '@utils/helpers'
import VerifyWhatsApp from '@pages/PlayerDashboard/PlayerCoinRequest/VerifyWhatsApp'
import UserMySettingsWrapper from '@pages/Landing/UserSettings/UserMySettingsWrapper'
import UserMyItemsWrapper from '@pages/Landing/UserSettings/UserMyItemsWrapper'
import VerifyUserWhatsApp from '@pages/Landing/UserSettings/VerifyUserWhatsApp'
import DigitalItemDownload from '@components/Card/DigitalItemDownload'
import MyReferralLanding from '@pages/Landing/MyReferralLanding'
import { useIdleTimer } from 'react-idle-timer'
import { subscribe } from '@utils/events'
import ImageComponent from '@components/ImageComponent'
import MyWatchList from '@pages/Landing/MyWatchList'
import '@assets/css/theme/LightTheme.css'
import '@assets/css/theme/LadiesTheme.css'
import '@assets/css/theme/BlackTheme.css'
import LaunchOptions from '@pages/LaunchCoin/LaunchOptions'
import FreeXp from '@pages/FreeXp/FreeXp'
import ShowNftImage from '@pages/NftImage/ShowNftImage'
import XPProgressBar from '@components/XPProgressBar'
import useSound from 'use-sound'
// import xpSound  from '@assets/sounds/xpSound.mp3'
import xpSound from '../assets/sounds/xpSound.mp3'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { getRequestAuth } from '@root/apis/axiosClientAuth'
import CookiePolicyModal from '@components/CookiePolicy/CookiePolicyModal'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useWalletHelper } from '@utils/WalletHelper'
import Cookies from 'universal-cookie'
import BottomPopup from '@components/Dialog/BottomPopup'
import WalletDialog from '@components/Dialog/WalletDialog'
import TabGroup from '@components/Page/TabGroup'
import useQualificationStatus from '@utils/hooks/qualificationStatusHook'
import { makeGetRequest, makeGetRequestAdvance } from '@root/apis/axiosClient'
import Referral from '@pages/Landing/Referral'
import LandingPlayerDashboard from '@pages/PlayerDashboard/LandingPlayerDashboard'
import InviteLanding from '@pages/NewLanding/InviteLanding'
import TurnStileWidget from '@components/CloudFlareCaptcha'
import { RootLayout } from '@pages/Access/AccessDenied'
import classNames from 'classnames'
import AddToHomeScreen from '@pages/Landing/AddToHomeScreen'
import FactSheetDownload from '@pages/Terms&Policy/FactSheetDownload'
import KioskCategoriesDetail from '@pages/Landing/KioskCategoriesDetail'
import TopTrades from '@pages/TopTrades'

const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: '-90%',
  left: 0,
} as React.CSSProperties

let liveInterval: any = null
let trackAccountInterval: any = null
let debounceTimeDiff: any = null
let a2hsTimeout: any = null
let pwaInstallTimer: any = null

const Routes: React.FC = () => {
  // const { dataPersisted, persistData } = useDataPersist
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID // OUR_TRACKING_ID

  ReactGA.initialize(TRACKING_ID)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const showSignupPopup = useSelector(
    (state: RootState) => state.authentication.isSignupFormVisible,
  )
  const tokenExpired = useSelector(
    (state: RootState) => state.playercoins.tokenExpired,
  )
  const allowShowAddToHomeScreenPopup = useSelector(
    (state: RootState) => state.playercoins.allowShowAddToHomeScreenPopup,
  )
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [showFormPopup, setShowFormPopup] = useState(false)
  const [activeTab, setActiveTab] = useState('Invitations')
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)
  const { ready, authenticated, user, logout } = usePrivy()
  const { wallets } = useWallets()
  // const isRestricted = useQualificationStatus()
  const [isInvitePropmptShown, isPageAccessRestricted] =
    useQualificationStatus()
  const cookies = new Cookies()
  const {
    delay,
    ipLocaleData,
    loadSelectedLanguage,
    selectedLanguage,
    isLoggedOut,
    walletAddress,
    walletDetailAddress,
    getLiveNotificationData,
    isWalletFormVisible,
    isGetUserSettingsSuccess,
    getUserSettingsData,
    ipLocaleCurrency,
    selectedThemeRedux,
    externalWalletError,
    externalWalletSuccess,
    isVisibleModal,
    userName,
    isUserNewVerified,
    currencyRate,
    isGetCurrencyRateSuccess,
    stateAccessToken,
    openMenu,
    userProfile,
    isXpNotificationVisible,
    earnedXp,
    totalXp,
    privyWallets,
    QualificationSettingData,
    isInvitationPopupShown,
    linkInviteSuccessData,
    cloudFlareError,
    cloudFlareTokenReset,
    isLandingShown,
    showMore,
    dontShowLiveNotifications,
    breakRequestCount,
    appInstallFlag,
    pwaPrompt,
  } = authenticationData
  const currentBrowser = getBrowserName()
  const [playXpSound] = useSound(xpSound)
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const authToken = localStorage.getItem('accessToken')
  const { initialConnect, disconnect, checkChainId, loggedInAddress } =
    useContext(ConnectContext)

  const { getEthereumProvider } = useWalletHelper()

  const currentURL = window.location.href
  const includesGenesis = currentURL.includes('/genesis')

  const [cookieValue, setCookieValue] = useState(cookies.get('authInfo'))
  // const [prompt, setPrompt] = useState(null)
  const [showInvitePopup, setShowInvitePopup] = useState(false)
  // const [showAddToHomeScreenPopup, setShowAddToHomeScreenPopup] = useState(
  //   !localStorage.getItem('added_home'),
  // )
  // const [showAddToHomeScreenPopup, setShowAddToHomeScreenPopup] = useState(
  //   // window.location.origin.includes('app') &&
  //   !localStorage.getItem('added_home'),
  // )
  const [showAddToHomeScreenPopup, setShowAddToHomeScreenPopup] =
    useState(false)

  // useEffect(() => {
  //   // Check main domain cookie every 5s and if changed, update localstorage values
  //   const checkCookieValue = () => {
  //     const cookieLoginData = cookies.get('authInfo')
  //     // if cookie is removed : logout
  //     // console.log(
  //     //   '========= checkCookieValue ==========',
  //     //   cookieLoginData,
  //     //   cookieValue,
  //     // )
  //     if (cookieLoginData === undefined && cookieValue !== undefined) {
  //       // console.log(
  //       //   '========= logout with cookie update ==========',
  //       //   cookieLoginData,
  //       //   cookieValue,
  //       // )
  //       setCookieValue(undefined)
  //       console.log('logoutTestHDC1--', { cookieLoginData, cookieValue })
  //       handleDisconnect()
  //     } else if (
  //       cookieLoginData !== cookieValue ||
  //       (!localStorage.getItem('loginInfo') && !localStorage.getItem('loginId'))
  //     ) {
  //       // if cookieis changed or first rendering with login : login
  //       if (cookieLoginData !== undefined) {
  //         console.log('========= updated Cookie info ==========')
  //         setCookieValue(cookieLoginData)
  //         const decodedCookieValue = decodeURIComponent(cookieLoginData)
  //         const cookieData = JSON.parse(decodedCookieValue)
  //         let isLoggedIn = false
  //         if (!localStorage.getItem('accessToken')) {
  //           isLoggedIn = true
  //         }
  //         localStorage.setItem('accessToken', cookieData.accessToken)
  //         localStorage.setItem('loginInfo', cookieData.loginInfo)
  //         localStorage.setItem('wallet', cookieData.wallet)
  //         localStorage.setItem(
  //           'externalWalletAddress',
  //           cookieData.externalWalletAddress,
  //         )
  //         localStorage.setItem('privy:token', cookieData.privyToken)
  //         localStorage.setItem(
  //           'privy:refresh_token',
  //           cookieData.privyRefreshToken,
  //         )
  //         localStorage.setItem('privy:connections', cookieData.privyConnections)
  //         dispatch(loginWithWalletCookie())
  //         // if privy login from other domain, it has to refresh since hook values are not updated after update of localstorage
  //         if (cookieData.wallet === 'Privy' && isLoggedIn) {
  //           // window.location.reload()  //temporarily
  //         }
  //       }
  //     }
  //   }
  //   // checkCookieValue()
  //   const intervalId = setInterval(checkCookieValue, 5000)
  //   return () => clearInterval(intervalId)
  // }, [cookieValue])

  const initiatePwaWatcher = () => {
    if (window.location.href.includes('/app')) {
      clearInterval(pwaInstallTimer)
      pwaInstallTimer = setInterval(() => {
        pwaInstallWatcher()
      }, 5000)
    }
  }

  useEffect(() => {
    // ReactGA.pageview(window.location.pathname + window.location.search)
    // ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
    // dispatch(getQualificationSetting())
    initiatePwaWatcher()
    dispatch(getCountries())
    dispatch(getGlobalCardSetting())
    // dispatch(getNotification())
    initialConnect()
    dispatch(getIpAddress())
    //if (window?.location?.pathname === '/') { //this should be called in any page because of header
    dispatch(getIpLocaleCurrency())
    dispatch(getEuroCurrencyRate())
    dispatch(checkEUCountry())
    //}
    if (localStorage.getItem('loginInfo')) {
      dispatch(setWalletAddress(localStorage.getItem('loginInfo')))
    }
    // if (authToken && !userProfile) {
    //   dispatch(getUserXp(true))
    //   dispatch(getUserProfile())
    // }
    dispatch(getApprovedCountriesForPlayerCreation())
    if (!window.location.href.includes('/app')) {
      document.title = 'Trade Football Players like Stocks and earn Rewards'
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      document.querySelector("meta[name='description']")!.setAttribute(
        'content',
        /* eslint-disable-next-line max-len */
        t('buy player coins of your favourite football players'),
      )
    }
    window.addEventListener('refresh_menu', () => {
      console.log('refresh_menu_called')
      // forceUpdate()
    })

    if (localStorage.getItem('tempSecret')) {
      localStorage.removeItem('tempSecret')
    }

    const handler = e => {
      try {
        e.preventDefault()
        // Save the event because you'll need to trigger it later.
        // deferredPrompt = e
        console.log('we are being triggered :D')
        setSupportsPWA(true)
        setPromptInstall(e)
        // storePromptInstall(e)
        dispatch(storePwaPrompt(e))
      } catch (error) {
        console.error('handlerErr', error)
      }
    }
    window.addEventListener('beforeinstallprompt', handler)
    // return () => window.removeEventListener('transitionend', handler)
    dispatch(getSeasonDetails(null))
    return () => {
      clearInterval(liveInterval)
      clearInterval(trackAccountInterval)
      window.removeEventListener('transitionend', handler)
    }
  }, [])

  const handleCreatePrivySession = () => {
    dispatch(setPrivyWallets(wallets))
    console.log('for test route_1', { user, authenticated, ready, wallets })
    if (showFormPopup || showInvitePopup) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    if (authenticated && user?.wallet) {
      console.log('for test route user', { user, authenticated, ready })

      localStorage.setItem('externalWalletAddress', user.wallet.address)

      if (
        !localStorage.getItem('accessToken') &&
        !localStorage.getItem('loginInfo')
      ) {
        console.log('for test loginWithWallet privy', user?.id)
        let email = user?.email?.address
        if (!email) {
          const alternativeEmails = [
            user?.apple?.email,
            user?.google?.email,
            user?.linkedin?.email,
            user?.discord?.email,
          ]

          for (const altEmail of alternativeEmails) {
            if (altEmail) {
              email = altEmail
              break // Exit the loop once a non-null email is found
            }
          }
        }
        dispatch(loginWithWallet({ email, privy_id: user?.id }))
      }

      localStorage.setItem('loginInfo', user.wallet.address)
      localStorage.setItem('wallet', 'Privy')
    }
  }

  // For privy login, get JWT token
  useEffect(() => {
    clearTimeout(debounceTimeDiff)
    debounceTimeDiff = setTimeout(() => {
      handleCreatePrivySession()
    }, 1500)
  }, [wallets, authenticated])

  useEffect(() => {
    const embeddedWallet = wallets.find(
      wallet => wallet.walletClientType === 'privy',
    )
    if (embeddedWallet) {
      const switchNetwork = async () => {
        const provider = await embeddedWallet.getEthereumProvider()
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: POLYGON_NETWORK_PARAMS.chainId }],
        })
      }
      switchNetwork()
    }
  }, [privyWallets.length])

  const onIdle = () => {
    // clearInterval(liveInterval)
  }

  // const onActive = () => {
  //   clearInterval(liveInterval)
  //   if (!document.hidden && !isVisibleModal && (loginId || loginInfo)) {
  //     liveInterval = setInterval(() => {
  //       dispatch(getLiveNotifications())
  //     }, 30000)
  //   }
  // }

  const onAction = () => {
    /**/
  }

  const onActive = () => {
    /**/
  }

  useIdleTimer({
    onIdle,
    onActive,
    onAction,
    timeout: 6000,
    throttle: 500,
  })

  useEffect(() => {
    clearInterval(liveInterval)
    if (
      (loginId && authToken && window.location.pathname.includes('/app')) ||
      (loginInfo && authToken && window.location.pathname.includes('/app'))
    ) {
      if (localStorage.getItem('loggedIn')) {
        dispatch(getLiveNotifications(false))
      } else {
        dispatch(getLiveNotifications(true))
        localStorage.setItem('loggedIn', true)
      }
      liveInterval = setInterval(() => {
        console.log('')
        dispatch(getLiveNotifications(false))
      }, 20000)
    }
  }, [loginId, loginInfo, authToken, window.location.pathname.includes('/app')])

  useEffect(() => {
    if ((loggedInAddress || loginInfo) && !document.hidden) {
      clearInterval(trackAccountInterval)
      if (localStorage.getItem('wallet') !== 'Privy') {
        trackAccountInterval = setInterval(() => {
          trackAccountChange()
        }, 2000)
      }
    } else {
      clearInterval(trackAccountInterval)
    }
  }, [loggedInAddress, loginInfo, document.hidden])

  useEffect(() => {
    if (delay > 0) {
      setTimeout(() => {
        showAccessPopup()
      }, delay * 1000)
    }
  }, [delay])

  useEffect(() => {
    if (externalWalletError !== '') {
      // toast.error('EWE' + externalWalletError, {
      //   duration: 4000,
      // })
      disconnect()
    }
    console.log({ externalWalletError })
  }, [externalWalletError])

  useEffect(() => {
    if (cloudFlareError !== '') {
      toast.error(cloudFlareError, {
        duration: 4000,
      })
    }
  }, [cloudFlareError])

  useEffect(() => {
    subscribe('externalWalletSuccess', () => {
      setTimeout(() => {
        toast.success(t('successfully connected!'), {
          duration: 1000,
        })
      }, 1000)
    })
  }, [])

  useEffect(() => {
    if (authToken) {
      dispatch(getSelectedLanguage())
    }
  }, [authToken])

  useEffect(() => {
    // if (!includeLanding) {
    //   dispatch(getQualificationSetting())
    // }
    dispatch(getQualificationSetting())
    if (authToken || stateAccessToken) {
      dispatch(getUserXpRate())
      dispatch(checkPlayerStatus())
      dispatch(
        fetchPlayersBalance({
          address: loginInfo,
        }),
      )
      if (!isLoggedOut) {
        if (!userProfile) {
          dispatch(getUserXp(true))
          dispatch(getUserProfile())
        }
      }
    } else if (loginId) {
      dispatch(checkPlayerStatus())
    }
  }, [loginId, loginInfo, isLoggedOut, stateAccessToken])

  useEffect(() => {
    if ((loginId || loginInfo) && authToken) {
      dispatch(getItemsPrice())
      dispatch(getUserPayedItems())
      dispatch(getUserSettings())
      dispatch(getGeneralSettings())
      dispatch(getBlockPerSecond())
      if (openMenu) {
        dispatch(openSideMenu({ openMenu: false }))
        return
      }
    } else {
      dispatch(setUserSettingsSuccess())
    }
  }, [loginId, loginInfo, authToken])

  useEffect(() => {
    if (isGetUserSettingsSuccess && ipLocaleCurrency) {
      dispatch(
        getCurrencyRate(getUserSettingsData?.currency ?? ipLocaleCurrency),
      )
    }
  }, [isGetUserSettingsSuccess, ipLocaleCurrency])

  useEffect(() => {
    if (loadSelectedLanguage) {
      const index = tempLanguages.findIndex(
        item => item.symbol === (selectedLanguage ?? 'en'),
      )
      if (index > -1) {
        i18n.changeLanguage(tempLanguages[index].symbol)
        localStorage.setItem('languageName', tempLanguages[index].name)
        localStorage.setItem('language', tempLanguages[index].symbol)
      }
    }
  }, [loadSelectedLanguage])

  useEffect(() => {
    console.log('---- tokenExpired ----', tokenExpired)
    if (tokenExpired) {
      if (isWalletFormVisible) {
        dispatch(showWalletForm({}))
      }
      if (localStorage.getItem('loginId')) {
        dispatch(emailLogout({}))
      } else {
        dispatch(signout())
        if (authenticated) {
          console.log('logoutTest--', { tokenExpired, authenticated })
          logout()
        }
      }
    }
  }, [tokenExpired])

  useEffect(() => {
    if (
      ipLocaleData.length > 0 &&
      !selectedLanguage &&
      !localStorage.getItem('language')
    ) {
      const lang = Languages.findIndex(
        item => item.symbol === ipLocaleData[0].code,
      )
      if (lang > -1) {
        if (ipLocaleData[0].code === 'de') {
          // i18n.changeLanguage(ipLocaleData[0].code)
          // localStorage.setItem('languageName', ipLocaleData[0].native)
          // localStorage.setItem('language', ipLocaleData[0].code)
          i18n.changeLanguage('en')
          localStorage.setItem('languageName', 'English')
          localStorage.setItem('language', 'en')
        } else {
          i18n.changeLanguage('en')
          localStorage.setItem('languageName', 'English')
          localStorage.setItem('language', 'en')
        }
      } else {
        i18n.changeLanguage('en')
        localStorage.setItem('languageName', 'English')
        localStorage.setItem('language', 'en')
      }
    }
  }, [ipLocaleData])

  useEffect(() => {
    if (showFormPopup || showInvitePopup) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [showFormPopup, showInvitePopup])

  useEffect(() => {
    if (localStorage.getItem('activatedAccessPopup') !== 'true') {
      if (showSignupPopup) {
        localStorage.setItem('activatedAccessPopup', 'signup')
      } else {
        localStorage.setItem('activatedAccessPopup', 'false')
      }
    }
  }, [showSignupPopup])

  // useEffect(() => {
  //   console.log({ isInvitationPopupShown })
  //   if (isInvitationPopupShown) {
  //     // setTimeout(() => {
  //     setShowInvitePopup(true)
  //     // }, 1500)
  //   } else {
  //     setShowInvitePopup(false)
  //   }
  // }, [isInvitationPopupShown])

  // useEffect(() => {
  //   if (tokenExpired) {
  //     setShowInvitePopup(false)
  //   }
  // }, [tokenExpired])

  const showAccessPopup = () => {
    if (
      localStorage.getItem('activatedAccessPopup') !== 'true' &&
      localStorage.getItem('activatedAccessPopup') !== 'signup'
    ) {
      setShowFormPopup(true)
    }
    localStorage.setItem('activatedAccessPopup', 'true')
  }

  const trackAccountChange = async () => {
    try {
      const wallet = localStorage.getItem('wallet')
      if (wallet) {
        const web3Provider = await getEthereumProvider()
        const accounts = await web3Provider.request({
          method: 'eth_requestAccounts',
        })
        const account = accounts[0]
        const current = localStorage.getItem('loginInfo')
        if (current && account.toLowerCase() !== current?.toLowerCase()) {
          console.log('---- Account Switched ----', {
            current,
            account,
            accounts,
          })
          if (isWalletFormVisible) {
            dispatch(showWalletForm({}))
          }
          handleDisconnect()
        }
      }
    } catch (error) {
      console.log('---- Account Switched Error ----', error)
    }
  }

  const handleDisconnect = async () => {
    localStorage.removeItem('ISGOLIVECLICKED')
    localStorage.removeItem('secret_restricted')
    localStorage.removeItem('secret_change_restricted')
    if (authenticated || localStorage.getItem('wallet') === 'Privy') {
      console.log('logoutTest1--', {
        l1: localStorage.getItem('wallet'),
        authenticated,
      })
      logout()
    }
    localStorage.removeItem('wallet')
    disconnect()
    dispatch(resetPlayerData())
    dispatch(exportKeyReset())
    localStorage.removeItem('ISLAUNCHCLICKED')
    asyncLocalStorage.getItem('accessToken').then(token => {
      const reqParams = {
        refresh_token: token,
      }
      dispatch(resetCoinLaunch())
      dispatch(resetPlayerData())
      dispatch(resetWallet())
      dispatch(resetSendChangeSecretOtp())
      dispatch(emailLogout({ reqParams, location: 'route.tsx_line2016' }))
      localStorage.removeItem('userWalletAddress')
      if (location.pathname !== '/' && !includesGenesis) {
        setTimeout(() => {
          location.pathname = '/'
          // navigate('/')
        }, 1000)
      }
    })
    if (authenticated) {
      console.log('logoutTest2--', { authenticated })
      logout()
    }
  }

  useEffect(() => {
    // update footbar when switching wallet on metamask, NOT PRIVY
    if (localStorage.getItem('wallet') !== 'Privy') {
      if (
        walletAddress &&
        localStorage.getItem('loginInfo') &&
        isGetCurrencyRateSuccess
      ) {
        dispatch(getPlayerDataInit())
        if (!isFirstLoad) {
          console.log('logMeta', { walletAddress, stateAccessToken })
          if (!localStorage.getItem('accessToken')) {
            console.log('for test loginWithWallet 111')
            dispatch(loginWithWallet(null))
          }
          dispatch(checkPlayerStatus())
        }
        setIsFirstLoad(false)
        if (walletDetailAddress !== walletAddress) {
          dispatch(getWalletAddress(walletAddress))
        }
      }
    }
  }, [walletAddress])

  useEffect(() => {
    console.log({
      QualificationSettingData,
      pot: localStorage.getItem('qualification_value'),
    })
    if (
      QualificationSettingData &&
      localStorage.getItem('qualification_value') &&
      QualificationSettingData !==
        parseInt(localStorage.getItem('qualification_value'))
    ) {
      localStorage.setItem('qualification_value', QualificationSettingData)
      console.log('session had to be terminated')
      handleDisconnect()
    }
  }, [QualificationSettingData])

  useEffect(() => {
    if (userName || isUserNewVerified) {
      if (
        stateAccessToken &&
        isGetCurrencyRateSuccess &&
        !walletDetailAddress
      ) {
        dispatch(getHeaderBalance())
      } else if (authToken && isGetCurrencyRateSuccess) {
        dispatch(getHeaderBalance())
      }
    } else if (loginInfo) {
      if (
        stateAccessToken &&
        isGetCurrencyRateSuccess &&
        walletDetailAddress !== loginInfo
      ) {
        dispatch(getHeaderBalance())
      } else if (authToken && isGetCurrencyRateSuccess) {
        dispatch(getHeaderBalance())
      }
    }
  }, [
    userName,
    stateAccessToken,
    isGetCurrencyRateSuccess,
    linkInviteSuccessData,
  ])

  useEffect(() => {
    if (isLoggedOut) {
      clearInterval(liveInterval)
    }
  }, [isLoggedOut])

  const handleOnHomeScreen = async (evt: any, choice: string) => {
    dispatch(makeAppInstall(false))
    if (choice === 'yes') {
      onGetPWA(evt)
      // localStorage.setItem('added_home', 'yes')
      // dispatch(setAddToHomeScreen(false))
      // setShowAddToHomeScreenPopup(false)
    } else {
      initiatePwaWatcher()
      // sessionStorage.setItem('added_home', 'no')
      dispatch(setAddToHomeScreen(false))
      setShowAddToHomeScreenPopup(false)
      localStorage.setItem('a2hsprompt_hidden', new Date().getTime().toString())
    }
  }

  const onGetPWA = evt => {
    try {
      evt.preventDefault()
      if (!pwaPrompt) {
        console.log('no_propmpt')
        return
      }
      pwaPrompt.prompt()
      // promptInstall.prompt()
      pwaPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt')
          localStorage.setItem('added_home', 'yes')
          localStorage.setItem(
            'a2hsprompt_hidden',
            new Date().getTime().toString(),
          )
          localStorage.setItem('added_home', 'yes')
          dispatch(setAddToHomeScreen(false))
          setShowAddToHomeScreenPopup(false)
        } else {
          console.log('User dismissed the A2HS prompt')
        }
        // promptInstall = null
        // setPromptInstall(null)
      })
      /*
      // hide our user interface that shows our A2HS button
      btnAdd.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
      */
    } catch (error) {
      console.error('clickBait--', error)
    }
  }

  // const touchStartX = useRef(null)

  // const handleTouchStart = e => {
  //   touchStartX.current = e.touches[0].clientX
  // }

  // const handleTouchMove = e => {
  //   if (touchStartX.current) {
  //     const touchEndX = e.touches[0].clientX
  //     const deltaX = touchEndX - touchStartX.current

  //     // Adjust the threshold as needed
  //     const swipeThreshold = 50

  //     if (deltaX > swipeThreshold) {
  //       // Swipe right detected, remove the toast
  //       dispatch(setShowMore(false))
  //       toast.remove()
  //       touchStartX.current = null // Reset touch start position
  //     } else if (deltaX < -swipeThreshold) {
  //       // Swipe left detected, remove the toast
  //       dispatch(setShowMore(false))
  //       toast.remove()
  //       touchStartX.current = null // Reset touch start position
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (
  //     // allowShowAddToHomeScreenPopup &&
  //     // isLandingShown &&
  //     window.location.href.includes('/app') &&
  //     !isPwa() &&
  //     ['Chrome', 'Safari'].includes(currentBrowser)
  //   ) {
  //     clearTimeout(a2hsTimeout)
  //     if (localStorage.getItem('a2hsprompt_hidden')) {
  //       const currentTime = new Date().getTime()
  //       const a2hsTimeStamp = parseInt(
  //         localStorage.getItem('a2hsprompt_hidden'),
  //       )
  //       const hrDiff = (currentTime - a2hsTimeStamp) / (1000 * 3600)
  //       if (hrDiff >= 0.0333333 && !localStorage.getItem('added_home')) {
  //         a2hsTimeout = setTimeout(() => {
  //           setShowAddToHomeScreenPopup(true)
  //           localStorage.removeItem('a2hsprompt_hidden')
  //         }, 4000)
  //       }
  //     } else {
  //       a2hsTimeout = setTimeout(() => {
  //         setShowAddToHomeScreenPopup(true)
  //       }, 4000)
  //     }
  //   }
  // }, [allowShowAddToHomeScreenPopup])

  const pwaInstallWatcher = () => {
    if (
      // allowShowAddToHomeScreenPopup &&
      // isLandingShown &&
      window.location.href.includes('/app') &&
      !isPwa() &&
      ['Chrome', 'Safari'].includes(currentBrowser)
    ) {
      clearTimeout(a2hsTimeout)
      if (localStorage.getItem('a2hsprompt_hidden')) {
        const currentTime = new Date().getTime()
        const a2hsTimeStamp = parseInt(
          localStorage.getItem('a2hsprompt_hidden'),
        )
        const hrDiff = (currentTime - a2hsTimeStamp) / (1000 * 3600)
        if (hrDiff >= 3 && !localStorage.getItem('added_home')) {
          a2hsTimeout = setTimeout(() => {
            clearInterval(pwaInstallTimer)
            setShowAddToHomeScreenPopup(true)
            localStorage.removeItem('a2hsprompt_hidden')
          }, 4000)
        }
      } else {
        a2hsTimeout = setTimeout(() => {
          clearInterval(pwaInstallTimer)
          setShowAddToHomeScreenPopup(true)
        }, 4000)
      }
    }
  }

  useEffect(() => {
    if (appInstallFlag) {
      // a2hsTimeout = setTimeout(() => {
      //   setShowAddToHomeScreenPopup(true)
      //   localStorage.removeItem('a2hsprompt_hidden')
      // }, 4000)
      setShowAddToHomeScreenPopup(true)
      localStorage.removeItem('a2hsprompt_hidden')
    }
  }, [appInstallFlag])

  useEffect(() => {
    // setInterval(() => {
    //   dispatch(getNotificationsCount())
    // }, 15000)
    console.log({ getLiveNotificationData })
    if (
      getLiveNotificationData.length > 0 &&
      window.location.pathname.includes('/app') &&
      !window.location.pathname.includes('/notifications')
    ) {
      getLiveNotificationData.map((item: any, index: any) =>
        toast(
          <div
            style={{
              width: isMobile() ? '90%' : '',
              display: 'flex',
              justifyContent: isMobile() ? 'flex-start' : 'space-between',
              alignItems: 'center',
              gap: '20px',
              margin: isMobile() ? '2px 0' : '10px 0',
            }}
            // onTouchStart={handleTouchStart}
            // onTouchMove={handleTouchMove}
          >
            {!isMobile() && (
              <ImageComponent
                onClick={() => {
                  console.log('deletingIndex--', index)
                  toast.remove()
                  dispatch(setShowMore(false))
                }}
                className={classNames(
                  'close_icon_notification',
                  isMobile() ? 'close_icon_notification_mobile' : '',
                )}
                src={CloseIcon}
                alt=""
              />
            )}
            <div
              className="img-compact"
              style={{
                background: getCircleColor(item?.playerlevelid),
              }}
            >
              <ImageComponent
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
                src={item.playerpicturethumb || item.playerpicture}
                alt=""
                onClick={() => {
                  window
                    ?.open(
                      `${window.location.origin}/app/player/${item.detailpageurl}`,
                      '_blank',
                    )
                    ?.focus()
                }}
              />
            </div>
            <div
              onClick={() => {
                window
                  ?.open(
                    `${window.location.origin}/app/player/${item.detailpageurl}`,
                    '_blank',
                  )
                  ?.focus()
              }}
              style={{ cursor: 'pointer', width: isMobile() ? '72%' : '' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Rajdhani-semibold',
                    fontSize: '18px',
                    fontWeight: '600',
                    lineHeight: ' 18px',
                    color: 'var(--primary-foreground-color)',
                    margin: '0px',
                  }}
                >
                  {item.title}
                </p>
                <ArrowForwardIosIcon
                  className="text-secondary-color"
                  style={{
                    fontSize: '12px',
                  }}
                />
              </div>
              <div
                className="text-secondary-color"
                style={{
                  width: isMobile() ? '90%' : '320px',
                  fontFamily: 'Rajdhani-regular',
                  fontSize: '16px',
                  fontWeight: '400',
                  marginTop: isMobile() ? '5px' : '0px',
                }}
              >
                {item.title === 'New Vote'
                  ? `${item.playername} ${t(
                      'has a new vote that will end in',
                    )} ${item.hrs} ${t('hour')} `
                  : item.title === 'New Raffle'
                  ? `${item.playername} ${t(
                      'has just launched a new raffle that ends in',
                    )} ${item.hrs} ${t('hour')}. ${t('participate now!')}`
                  : item.title === 'Go Live'
                  ? `${item.playername} ${t(
                      'has gone live and is available for trading',
                    )}`
                  : item.title === 'Gone PRO!'
                  ? `${item.playername} ${t(
                      'is now PRO! Stake your coins and unlock your rewards',
                    )}`
                  : item.title === 'New Auction'
                  ? `${item.playername} ${t(
                      'has just launched a new auction that ends in',
                    )} ${item.hrs} ${t('hour')}`
                  : item.title === 'New NFT minted'
                  ? `${item.playername} ${t('has minted a new NFT with id')} ${
                      item.tokenid
                    }`
                  : item.body}
                {item.title === 'New Vote' ? (
                  <b className="text-primary-color">{item.question}</b>
                ) : (
                  ''
                )}
              </div>
              <div
                style={{
                  fontFamily: 'Rajdhani-semibold',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '14px',
                  marginTop: '5px',
                }}
              >
                {/* {item.timestamp} */}
                {item?.timestamp &&
                  item?.timestamp?.substring(0, 19).replace('T', ' ')}
              </div>
            </div>
          </div>,
          {
            id: 0,
            duration: Infinity,
            position: 'bottom-right',

            // Styling
            style: {
              minWidth: isMobile() ? '100%' : '450px',
              maxWidth: isMobile() ? '100%' : '450px',
              border: '1px solid var(--primary-foreground-color)',
              padding: '5px 0px',
              color: THEME_COLORS[selectedThemeRedux]['PrimaryText'],
              background:
                THEME_COLORS[selectedThemeRedux]['SecondaryBackground'],
              marginRight: isMobile() ? '' : '20px',
              marginBottom:
                isMobile() && window.location.pathname !== '/'
                  ? '160px'
                  : '90px',
              marginTop:
                isMobile() && window.location.pathname !== '/'
                  ? '-160px'
                  : '-90px',
            },
          },
        ),
      )
    }
  }, [getLiveNotificationData])

  const toastXp = xpInfo => {
    toast(
      <div
        className="notification-container"
        style={{
          display: 'flex',

          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          margin: '0 0 22px',
          width: '100%',
          padding: '5px',
        }}
        onClick={() => toast.dismiss(`xp${totalXp}`)}
      >
        <div style={{ cursor: 'pointer', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <XPProgressBar
              level={xpInfo?.lifetimelevel}
              nextLevelXp={xpInfo?.next_level_xp}
              levelIncrement={xpInfo?.level_increment}
              currentXp={totalXp}
              index={3}
            />
            <p
              style={{
                fontFamily: 'Rajdhani-semibold',
                fontSize: '24px',
                fontWeight: '600',
                lineHeight: ' 18px',
                color: 'var(--primary-foreground-color)',
                margin: '0px',
                background: 'linear-gradient(to right, #ff00ff, #00ffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '-15px',
                paddingBottom: '5px',
              }}
            >
              {t('you earned')} &nbsp;{toXPNumberFormat(earnedXp)} <i> XP </i>
              &nbsp;
            </p>
          </div>
        </div>
      </div>,
      {
        id: `xp${totalXp}`,
        duration: 7000,
        position: 'top-center',

        // Styling
        style: {
          minWidth: isMobile() ? '100%' : '500px',
          color: THEME_COLORS[selectedThemeRedux]['PrimaryText'],
          background: THEME_COLORS[selectedThemeRedux]['SecondaryBackground'],
          // marginRight: isMobile() ? '' : '20px',
          borderImage: 'linear-gradient(to right, #ff00ff, #00ffff)',
          borderImageSlice: 1,
          borderRadius: '10px',
          backgroundImage: `linear-gradient(${THEME_COLORS[selectedThemeRedux]['SecondaryBackground']}, ${THEME_COLORS[selectedThemeRedux]['SecondaryBackground']}), linear-gradient(to right, #ff00ff, #00ffff)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
          padding: '1px',
          border: '1px solid transparent',
        },
      },
    )
  }

  const toastLevelUp = xpInfo => {
    toast(
      <div
        className="notification-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          margin: '10px',
          width: '100%',
          padding: '5px',
        }}
        onClick={() => toast.dismiss(`level_xp${totalXp}`)}
      >
        <ImageComponent style={{ height: '80px' }} src={TrophyIcon} alt="" />
        <div style={{ cursor: 'pointer' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile() ? '0' : '10px',
              flexDirection: isMobile() ? 'column' : 'row',
            }}
          >
            <p
              style={{
                fontFamily: 'Rajdhani-semibold',
                fontSize: '24px',
                fontWeight: '600',
                lineHeight: ' 18px',
                color: 'var(--primary-foreground-color)',
                background: 'linear-gradient(to right, #ff00ff, #00ffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
              }}
            >
              {t('you justed reached')}
            </p>
            <b className="gold-color" style={{ fontSize: '24px' }}>
              {` ${t('level')} ${xpInfo?.lifetimelevel} `}{' '}
            </b>
          </div>
        </div>
      </div>,
      {
        id: `level_xp${totalXp}`,
        duration: 7000,
        position: 'top-center',

        // Styling
        style: {
          minWidth: isMobile() ? '100%' : '500px',
          color: THEME_COLORS[selectedThemeRedux]['PrimaryText'],
          background: THEME_COLORS[selectedThemeRedux]['SecondaryBackground'],
          // marginRight: isMobile() ? '' : '20px',
          borderImage: 'linear-gradient(to right, #ff00ff, #00ffff)',
          borderImageSlice: 1,
          borderRadius: '10px',
          backgroundImage: `linear-gradient(${THEME_COLORS[selectedThemeRedux]['SecondaryBackground']}, ${THEME_COLORS[selectedThemeRedux]['SecondaryBackground']}), linear-gradient(to right, #ff00ff, #00ffff)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
          padding: '1px',
          border: '1px solid transparent',
        },
      },
    )
  }

  useEffect(() => {
    if (dontShowLiveNotifications && breakRequestCount > 0) {
      console.log('hiding_live_notifications_on_notifications_page')
      toast.remove()
      dispatch(setShowMore(false))
    }
  }, [dontShowLiveNotifications, breakRequestCount])

  useEffect(() => {
    console.log(
      'DEBUG Xp Animation',
      isXpNotificationVisible,
      userProfile,
      totalXp,
      earnedXp,
    )
    if (isXpNotificationVisible && userProfile && totalXp > 0) {
      console.log('DEBUG Xp Animation Started')
      if (totalXp < userProfile?.next_level_xp) {
        playXpSound()
        toastXp(userProfile)
        dispatch(resetUserXp())
      } else {
        const fetchUserBasicData = async () => {
          const result = await makeGetRequestAdvance(
            'accounts/user-basic-data/',
          )
          if (result?.data) {
            toastXp(result?.data)
            playXpSound()
            setTimeout(() => {
              if (result?.data?.lifetimelevel > 1) {
                toastLevelUp(result?.data)
                playXpSound()
                fire()
              }
            }, 2000)
            dispatch(resetUserXp())
            dispatch(getUserProfile())
          }
        }
        fetchUserBasicData().catch(console.error)
      }
    }
  }, [isXpNotificationVisible])

  // confetti
  const refAnimationInstance = useRef<any>(null)

  const getInstance = useCallback(instance => {
    refAnimationInstance.current = instance
  }, [])

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0 },
        particleCount: Math.floor(200 * particleRatio),
      })
  }, [])

  const fire = useCallback(() => {
    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })
  }, [makeShot])

  const valueOfTheme = localStorage.getItem('theme')
  useEffect(() => {
    ;['Light', 'Dark', 'Gold', 'Ladies', 'Black'].forEach(theme =>
      document.body.classList.remove(theme),
    )
    if (window.location.href.includes('/app')) {
      document.body.classList.add(valueOfTheme ?? 'Dark')
      dispatch(
        selectedTheme({
          selectedThemeRedux: valueOfTheme === null ? 'Dark' : valueOfTheme,
        }),
      )
    } else {
      dispatch(
        selectedTheme({
          selectedThemeRedux: 'Dark',
        }),
      )
    }
  }, [valueOfTheme, window.location.href.includes('/app')])

  useEffect(() => {
    if (selectedThemeRedux) {
      document.documentElement.style.setProperty(
        '--primary-background-color',
        THEME_COLORS[selectedThemeRedux]['PrimaryBackground'],
      )
      document.documentElement.style.setProperty(
        '--secondary-background-color',
        THEME_COLORS[selectedThemeRedux]['SecondaryBackground'],
      )
      document.documentElement.style.setProperty(
        '--third-background-color',
        THEME_COLORS[selectedThemeRedux]['ThirdBackground'],
      )
      document.documentElement.style.setProperty(
        '--primary-text-color',
        THEME_COLORS[selectedThemeRedux]['PrimaryText'],
      )
      document.documentElement.style.setProperty(
        '--secondary-text-color',
        THEME_COLORS[selectedThemeRedux]['SecondaryText'],
      )
      document.documentElement.style.setProperty(
        '--primary-icon-color',
        THEME_COLORS[selectedThemeRedux]['PrimaryIcon'],
      )
      document.documentElement.style.setProperty(
        '--primary-foreground-color',
        THEME_COLORS[selectedThemeRedux]['PrimaryForeground'],
      )
      document.documentElement.style.setProperty(
        '--secondary-foreground-color',
        THEME_COLORS[selectedThemeRedux]['SecondaryForeground'],
      )
      document.documentElement.style.setProperty(
        '--primary-shadow-color',
        THEME_COLORS[selectedThemeRedux]['PrimaryShadow'],
      )
      document.documentElement.style.setProperty(
        '--primary-tab-color',
        THEME_COLORS[selectedThemeRedux]['PrimaryTab'],
      )
    }
  }, [selectedThemeRedux])

  const [showOverlayer, setShowOverlayer] = useState(false)
  const handleOverlayer = boolean => {
    setShowOverlayer(boolean)
  }

  return (
    <>
      {cloudFlareTokenReset ? <TurnStileWidget /> : null}
      <Router>
        <DialogBox
          isOpen={showFormPopup && !showSignupPopup}
          onClose={() => setShowFormPopup(false)}
          contentClass={isMobile() ? 'notification-pop' : 'notification-popup'}
          closeBtnClass="close-notification"
          parentClass="none-backdrop-filter"
        >
          <NewsLetter
            isNotification={true}
            onClose={() => setShowFormPopup(false)}
          />
        </DialogBox>
        {showAddToHomeScreenPopup ? (
          <DialogBox
            // isOpen={isMobile() && window.location.origin.includes('app')}
            // isOpen={isMobile()}
            // isOpen={
            //   showAddToHomeScreenPopup ||
            //   (browserName === 'Chrome' && !isMobile())
            // }
            isOpen={showAddToHomeScreenPopup}
            onClose={() => handleOnHomeScreen(null, 'no')}
            contentClass={
              isMobile() ? 'notification-pop pwa-pop' : 'pwa-pop-desktop'
            }
            closeBtnClass="close-notification d-none"
            parentClass="none-backdrop-filter top-zIndex"
          >
            <AddToHomeScreen
              promptEvt={pwaPrompt}
              onAccept={evt => handleOnHomeScreen(evt, 'yes')}
              onCancel={() => handleOnHomeScreen(null, 'no')}
            />
          </DialogBox>
        ) : null}
        {!window.location.href.includes('/app') ? (
          ''
        ) : (
          <>
            <ReactCanvasConfetti
              refConfetti={getInstance}
              style={canvasStyles}
            />
          </>
        )}
        <CookiePolicyModal handleOverlayer={handleOverlayer} />
        <div className={showOverlayer ? 'overlay' : ''}></div>

        <Menu />

        <GroupRoutes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Onboarding />} />
          <Route
            path="/player-dashboard"
            element={<LandingPlayerDashboard />}
          />
          <Route path="/referral/:id" element={<Referral />} />
          <Route path="/invite/:id" element={<InviteLanding />} />
          <Route path="/genesis" element={<Genesis />} />
          <Route path="/files/:fileName" element={<FactSheetDownload />} />
          <Route path="/otp-whatsapp" element={<VerifyWhatsApp />} />
          <Route path="/user-otp-whatsapp" element={<VerifyUserWhatsApp />} />
          <Route element={<RootLayout />}>
            <Route path="/app" element={<About />} />
            <Route path="/app/player/:id" element={<Player />} />
            <Route path="/app/player-dashboard" element={<PlayerDashboard />} />
            <Route path="/app/notifications" element={<Notification />} />
            <Route
              path="/app/notifications_settings"
              element={<NotificationSettings />}
            />
            <Route
              path="/app/my_settings"
              element={<UserMySettingsWrapper />}
            />
            <Route path="/app/my_items" element={<UserMyItemsWrapper />} />
            <Route path="/app/my_watchlist" element={<MyWatchList />} />
            <Route path="/app/staked" element={<Staked />} />
            <Route path="/app/tutorials" element={<TutorialsPage />} />
            <Route path="/app/player-share" element={<PlayerImageShare />} />
            <Route path="/app/player/share/:id" element={<SharePlayer />} />
            <Route
              path="/app/accounts/resetPassword/:uid/:token"
              element={<ResetPassword />}
            />
            <Route path="/app/wallet" element={<CreateWallet />} />
            <Route path="/app/all-players" element={<PlayerList />} />
            <Route
              path="/app/fan-player-dashboard"
              element={<PlayerDashboard />}
            />
            <Route
              path="/app/fan-player-dashboard/:detail/:id"
              element={<PlayerDashboard />}
            />
            <Route path="/app/draft_new_player" element={<NewDraftPage />} />
            <Route
              path="/app/draft_confirmation"
              element={<Web3ActionPage />}
            />
            <Route path="/app/confirm_go_live" element={<ConfirmGoLive />} />
            <Route path="/app/how-it-works" element={<HowItWorks />} />
            <Route path="/app/kiosk" element={<Kiosk />} />
            <Route path="/app/scouts" element={<Scouts />} />
            <Route path="/app/launch-your-coin" element={<LaunchCoin />} />
            <Route path="/app/launch-options" element={<LaunchOptions />} />
            <Route path="/app/user/:name" element={<User />} />
            <Route path="/app/all-users" element={<UserList />} />
            <Route path="/app/top-trades" element={<TopTrades />} />
            <Route path="/app/season/:id" element={<Seasons />} />
            <Route path="/app/get-early-access" element={<GetEarlyAccess />} />
            <Route path="/app/language" element={<Language />} />
            <Route path="/app/menu" element={<Menu />} />
            <Route
              path="/app/kiosk/:id/:hash"
              element={<DigitalItemDownload />}
            />
            <Route path="/app/invite/:id" element={<MyReferralLanding />} />
            <Route path="/app/freeXp" element={<FreeXp />} />
            <Route path="/app/nft/:ticker/:id" element={<ShowNftImage />} />
            <Route path="/app/signup" element={<Onboarding />} />
            <Route path="/app/otp-whatsapp" element={<VerifyWhatsApp />} />
            <Route
              path="/app/user-otp-whatsapp"
              element={<VerifyUserWhatsApp />}
            />
            <Route
              path="/app/accounts/verify/email/:refreshToken/:jwtToken"
              element={<EmailVerification />}
            />
            <Route
              path="/app/accounts/resetPassword/:uid/:token"
              element={<ResetPassword />}
            />
            <Route
              path="/app/accounts/changePassword"
              element={<ChangePassword />}
            />
            <Route
              path="/app/kiosk_category_items/:id"
              element={<KioskCategoriesDetail />}
            />
          </Route>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<ProtocolDisclaimer />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/nfts" element={<NftList />} />
          <Route path="*" element={<PageNotFound />} />
        </GroupRoutes>
      </Router>
    </>
  )
}

export default Routes
