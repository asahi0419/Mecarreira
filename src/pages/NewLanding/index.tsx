/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import Header from './Header'
import Video from './Video'
import Heading from './Heading'
import Benefits from './Benefits'
import HowItWorks from './HowItWorks'
import Players from './Players'
import AboutUsEn from './AboutUsEn'
import Faqs from './Faqs'
import NewsLetter from '@pages/Landing/NewsLetter'
import Bottom from '@pages/Landing/Bottom'
import '@assets/css/pages/NewLanding.css'
import '@assets/css/pages/Landing.css'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import {
  showSignupForm,
  showWalletForm,
  resetSentEmailVerification,
  userEmail,
  walletConnectCheck,
  handleChangeSecret,
  setNagivated,
  setActiveTab,
  handlePlayerMode,
  toggleInvitePopup,
  forceShowPopup,
  selectedTheme,
  handleLandingNavigate,
  setShowMore,
} from '@root/apis/onboarding/authenticationSlice'
import DialogBox from '@components/Dialog/DialogBox'
import OnboardingForm from '@pages/Onboarding/OnboardingForm'
import WalletForm from '@pages/Wallet/WalletForm'
import WalletDialog from '@components/Dialog/WalletDialog'
import { isMobile, isPwa } from '@utils/helpers'
import WalletConnectConfirm from '@components/Page/WalletConnectConfirm'
import { renderFireCanvas } from '@utils/renderCanvas'
import { subscribe } from '@utils/events'
import { HOMEROUTE, THEME_COLORS } from '@root/constants'
import LandingBanner from './LandingBanner'
import Secondbanner from './SecondBanner'
import Passion from './Passion'
import Potential from './Potential'
import OfficialMember from './OfficialMember'
import { Scrollbar } from 'smooth-scrollbar-react'
import '@splidejs/react-splide/css'
import TurnStileWidget from '@components/CloudFlareCaptcha'
import Playerslist from '@pages/NewLanding/PlayersList'
import { InviteException } from '..'
import { ConnectContext } from '@root/WalletConnectProvider'
import { useLogin, usePrivy, useWallets } from '@privy-io/react-auth'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import TopTradesForm from '@pages/TopTrades/TopTradesForm'
import {
  getTopTrades,
  resetTopTrades,
} from '@root/apis/playerCoins/playerCoinsSlice'

let navigateTimeout: any = null

const Landing: React.FC = () => {
  const { wallets } = useWallets()
  console.log({ wallets })
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedIn =
    Boolean(localStorage.getItem('loginInfo')) ||
    Boolean(localStorage.getItem('loginId'))
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const [showHeader, setShowHeader] = useState(false)
  const [showInvitePopup, setShowInvitePopup] = useState(false)
  const [scrollLoader, setScrollLoader] = useState(false)
  const { connectStatus } = useContext(ConnectContext)

  const {
    localeLoader,
    isSignupFormVisible,
    isWalletFormVisible,
    isMandatory,
    selectedThemeRedux,
    invalidDevice,
    walletConnectConfirmPopUp,
    showChangeSecret,
    QualificationSettingData,
    isLogging,
    playerMode,
    landingNavigateIndex,
    openMenu,
    linkInviteSuccessData,
    qualifiedInviteLinked,
    isInvitationPopupShown,
    externalWalletSuccess,
    isFireShownOnInviteLinkSuccess,
    // getLiveNotificationData,
    showMore,
  } = authenticationData

  const aboutusRef = useRef<any>()
  const faqRef = useRef<any>()

  useEffect(() => {
    document.body.style.backgroundColor = '#171923'
    if (window.location.pathname === '/' && window.location.hash !== '') {
      console.log('hasHashReload')
      setTimeout(() => {
        dispatch(setNagivated(true))
        navigate('/' + window.location.hash)
      }, 500)
    }
    // if (window.location.pathname !== '/') {
    //   navigate('/')
    // }
    const inviteCode = window.location?.pathname?.split('/')?.pop() || ''
    if (
      !isLoggedIn &&
      window.location.pathname.includes('invite') &&
      inviteCode?.length === 8
    ) {
      dispatch(setActiveTab('register'))
      setTimeout(() => {
        dispatch(showSignupForm())
        console.log('for test showSignupForm 111')
      }, 3000)
    }
    if (!isMobile()) {
      renderFireCanvas()
      setTimeout(() => {
        const evObj = document.createEvent('Events')
        evObj.initEvent('onClick', true, false)
        document.getElementById('canvas')?.dispatchEvent(evObj)
      }, 500)
    }

    ;['Light', 'Dark', 'Gold', 'Ladies', 'Black'].forEach(theme =>
      document.body.classList.remove(theme),
    )
    dispatch(
      selectedTheme({
        selectedThemeRedux: 'Dark',
      }),
    )
    dispatch(getTopTrades({ limit: 10 }))

    return () => {
      document.body.style.backgroundColor = '#222435'
      dispatch(handleLandingNavigate({ landingNavigateIndex: 0 }))
      dispatch(resetTopTrades())
    }
  }, [])

  useEffect(() => {
    // setIsFirstConnect(false)
    // if (!loginId && !isFirstConnect && connectStatus) {
    //   console.log('for test loginWithWallet 113')
    //   dispatch(loginWithWallet(null))
    //   if (localStorage.getItem('routeAfterLogin')) {
    //     const route = localStorage.getItem('routeAfterLogin')
    //     localStorage.removeItem('routeAfterLogin')
    //     route && navigate(route)
    //   }
    //   onClose()
    // }
  }, [connectStatus])

  useEffect(() => {
    if (isInvitationPopupShown) {
      // setTimeout(() => {
      setShowInvitePopup(true)
      // }, 1500)
    } else {
      setShowInvitePopup(false)
    }
  }, [isInvitationPopupShown])

  const setIsPlayerView = value => {
    dispatch(handlePlayerMode({ playerMode: value }))
  }
  useEffect(() => {
    clearTimeout(navigateTimeout)
    console.log({
      linkInviteSuccessData,
      qualifiedInviteLinked,
      externalWalletSuccess,
      QualificationSettingData,
    })
    if (
      (linkInviteSuccessData ||
        (qualifiedInviteLinked && QualificationSettingData === 1)) &&
      externalWalletSuccess &&
      QualificationSettingData !== 0
    ) {
      navigateTimeout = setTimeout(() => {
        // window.open('https://devapp.mecarreira.com/')
        if (isFireShownOnInviteLinkSuccess) {
          if (isPwa() && localStorage.getItem('a2hsprompt_hidden')) {
            console.log('---- PWA Opening App ----')
            window.location.href = '/app'
          } else {
            console.log('----  Opening App ----')
            navigate('/app')
          }
        }
        if (isInvitationPopupShown) {
          dispatch(toggleInvitePopup(false))
        }
      }, 2000)
    }
  }, [linkInviteSuccessData, qualifiedInviteLinked])

  const handleSubmit = async () => {
    console.log('for test showSignupForm 112', isSignupFormVisible)
    dispatch(showSignupForm())
  }

  const handleClose = () => {
    if (isSignupFormVisible) {
      console.log('login_complete')
      console.log('for test showSignupForm 113')
      dispatch(showSignupForm())
      dispatch(walletConnectCheck({ walletConnectConfirmPopUp: false }))
      dispatch(resetSentEmailVerification())
    } else if (isWalletFormVisible) {
      dispatch(showWalletForm({}))
    } else if (invalidDevice) {
      dispatch(
        userEmail({
          invalidDevice: false,
        }),
      )
    } else if (walletConnectConfirmPopUp) {
      console.log('showing_connect_confirm4')
      dispatch(walletConnectCheck({ walletConnectConfirmPopUp: false }))
    } else if (showChangeSecret) {
      dispatch(handleChangeSecret(false))
    }
  }

  useEffect(() => {
    if (isSignupFormVisible || isWalletFormVisible) {
      document.body.style.overflow = 'hidden'
      console.log('for test debugging overflow 9')
      if (isMobile()) {
        if (
          !(
            navigator.userAgent.includes('Safari') &&
            navigator.userAgent.includes('Mobile')
          )
        ) {
          // This is likely Safari on a mobile device
          document.body.style.position = 'fixed'
        } else {
          console.log(
            'You are using Safari on a mobile device.',
            navigator.userAgent,
          )
        }
      }
    } else {
      console.log('for test debugging overflow 9 - off')
      document.body.style.overflow = ''
      document.body.style.position = ''
    }
  }, [isSignupFormVisible, isWalletFormVisible])

  const handleLaunchApp = async () => {
    if (isLogging) {
      console.log('processing in login')
    } else if ([0, 1, 2, 3].includes(QualificationSettingData) && !isLoggedIn) {
      console.log('for test showSignupForm 114', isSignupFormVisible)
      dispatch(setActiveTab('register'))
      await dispatch(forceShowPopup(true))
      dispatch(showSignupForm())
    } else if (
      isLoggedIn &&
      QualificationSettingData === 1 &&
      qualifiedInviteLinked === false
    ) {
      console.log('NsL1', {
        isLoggedIn,
        QualificationSettingData,
        qualifiedInviteLinked,
      })
      dispatch(toggleInvitePopup(true))
    } else if (
      isLoggedIn &&
      QualificationSettingData === 0 &&
      qualifiedInviteLinked === false
    ) {
      console.log('NsL2', {
        isLoggedIn,
        QualificationSettingData,
        qualifiedInviteLinked,
      })
      // if (!qualifiedInviteLinked && QualificationSettingData === 0) {
      //   dispatch(toggleInvitePopup(true))
      // } else if ()
      // if (QualificationSettingData === 0)
      dispatch(toggleInvitePopup(true))
    } else if (
      QualificationSettingData === 0 &&
      isLoggedIn &&
      qualifiedInviteLinked
    ) {
      console.log('NsL3', {
        isLoggedIn,
        QualificationSettingData,
        qualifiedInviteLinked,
      })
      // dispatch(showWalletForm({}))
      dispatch(toggleInvitePopup(true))
    } else {
      setTimeout(() => {
        if (isPwa() && localStorage.getItem('a2hsprompt_hidden')) {
          console.log('---- PWA Opening App ----')
          window.location.href = '/app'
        } else {
          console.log('----  Opening App ----')
          navigate('/app')
        }
      }, 500)
    }
  }

  const scrollToDiv = () => {
    setScrollLoader(false)
    window.scrollTo({
      top:
        landingNavigateIndex === 6
          ? aboutusRef.current.offsetTop
          : faqRef.current.offsetTop,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (landingNavigateIndex > 0) {
      setScrollLoader(true)
      const timer = setTimeout(scrollToDiv, isMobile() ? 3000 : 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [landingNavigateIndex])

  useEffect(() => {
    console.log('landing_mounted')
    const handleScroll = () => {
      const currentScrollHeight = window.scrollY
      if (currentScrollHeight > 50) {
        setShowHeader(true)
      } else {
        setShowHeader(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (openMenu) {
      setShowHeader(true)
    } else {
      setShowHeader(false)
    }
  }, [openMenu])

  const initPlayerCreation = () => {
    navigate('/player-dashboard')
  }

  const handleCloseInvite = () => {
    dispatch(toggleInvitePopup(false))
    setShowInvitePopup(false)
    // handleTerminateSession()
  }

  const getIsMandatoryInvitePopup = () => {
    if (window.location.href.includes('app')) {
      return true
    } else {
      return false
    }
  }

  // useEffect(() => {
  //   if (getLiveNotificationData.length > 0 && !showMore) {
  //     console.log('setShowMore1', showMore)
  //     dispatch(setShowMore(true))
  //   }
  // }, [getLiveNotificationData])

  return (
    <>
      {/* {showMore && window.location.pathname !== '/app/notifications' && (
        <>
          <div
            style={{
              position: 'fixed',
              bottom: '10px',
              right: '16px',
              zIndex: '99999999',
              minWidth: isMobile() ? '91%' : '450px',
              maxWidth: isMobile() ? '91%' : '450px',
              border: '1px solid var(--primary-foreground-color)',
              padding: '10px 0px',
              color: THEME_COLORS[selectedThemeRedux]['PrimaryText'],
              background:
                THEME_COLORS[selectedThemeRedux]['SecondaryBackground'],
              marginRight: isMobile() ? '' : '20px',
              borderRadius: '8px',
              marginBottom:
                isMobile() && window.location.pathname !== '/'
                  ? '115px'
                  : '50px',
            }}
          >
            <p
              style={{
                fontFamily: 'Rajdhani-semibold',
                fontSize: '18px',
                fontWeight: '600',
                lineHeight: '18px',
                color: 'var(--primary-foreground-color)',
                margin: '0px',
                cursor: 'pointer',
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
              onClick={() => {
                // dispatch(setShowMore(false))
                toast.remove()
                navigate('/app/notifications')
              }}
            >
              {t('show_more')}
            </p>
          </div>
          <div
            style={{
              position: 'fixed',
              bottom: '10px',
              right: '16px',
              zIndex: '99999999',
              minWidth: isMobile() ? '91%' : '450px',
              maxWidth: isMobile() ? '91%' : '450px',
              border: '1px solid var(--primary-foreground-color)',
              padding: '10px 0px',
              color: THEME_COLORS[selectedThemeRedux]['PrimaryText'],
              background: 'var(--primary-foreground-color)',
              marginRight: isMobile() ? '' : '20px',
              borderRadius: '8px',
            }}
            onClick={() => {
              toast.remove()
              dispatch(setShowMore(false))
            }}
          >
            <p
              style={{
                fontFamily: 'Rajdhani-semibold',
                fontSize: '18px',
                fontWeight: '600',
                lineHeight: '18px',
                color: '#000',
                margin: '0px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {t('CLOSE ALL')}
            </p>
          </div>
        </>
      )} */}
      <TurnStileWidget />
      {(isSignupFormVisible || invalidDevice) && (
        <DialogBox
          isOpen={isSignupFormVisible || invalidDevice}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <OnboardingForm onSubmit={handleSubmit} onClose={handleClose} />
        </DialogBox>
      )}
      {walletConnectConfirmPopUp && (
        <DialogBox
          isOpen={walletConnectConfirmPopUp}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <WalletConnectConfirm />
        </DialogBox>
      )}
      {isWalletFormVisible && (
        <WalletDialog
          isOpen={isWalletFormVisible}
          onClose={handleClose}
          isMandatory={isMandatory ? true : false}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <WalletForm />
        </WalletDialog>
      )}
      {showInvitePopup ? (
        <WalletDialog
          isOpen={showInvitePopup}
          onClose={handleCloseInvite}
          // isMandatory={window.location.pathname === '/' ? false : true}
          isMandatory={getIsMandatoryInvitePopup()}
          parentClass={
            isMobile()
              ? `flex-dialog invite-prompt-modal ${
                  linkInviteSuccessData ? 'link_success_modal' : ''
                }`
              : ''
          }
        >
          <InviteException />
        </WalletDialog>
      ) : null}
      <Header showHeader={showHeader} />
      {/* {localeLoader && (
        <>
          <section id="#" className="intro-section">
            <div className="intro-team-nfts">
              <div className={classNames('home-load')}>
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              </div>
            </div>
          </section>
        </>
      )} */}
      <div
        className="new-landing-container"
        // style={{ display: localeLoader ? 'none' : 'block' }}
        // ref={divRef}
        // onScroll={handleScroll}
      >
        <div id="get-started">
          <LandingBanner
            scrollLoader={scrollLoader}
            onClickSubmit={handleLaunchApp}
            onRequestPlayerAccount={initPlayerCreation}
          />
        </div>
        <div id="players" className="players-list">
          <Playerslist />
        </div>
        <div className="top-trades-section">
          <TopTradesForm showmore={true} isLanding />
        </div>
        <div id="choose-mode">
          <Secondbanner onChangeView={setIsPlayerView} />
        </div>
        {playerMode ? (
          <>
            <div id="potential">
              <Potential />
            </div>
            <div
              id="launch-official"
              style={{ height: 0, background: '#222435' }}
            />
            <div className="players-section">
              <OfficialMember onClickSubmit={handleLaunchApp} />
            </div>
          </>
        ) : (
          <>
            <div id="passion">
              <Passion />
            </div>
            <div
              id="how-it-works"
              style={{
                height: 0,
                background: '#12131c',
              }}
            />
            <div className="how-it-works-section">
              <HowItWorks />
            </div>
          </>
        )}
        <div
          id="about-us"
          ref={aboutusRef}
          style={{
            height: 60,
            marginTop: isMobile() ? -40 : 0,
            backgroundColor: '#12131c',
          }}
        />
        <div className="about-us-section">
          <AboutUsEn />
        </div>
        <div
          id="faq"
          ref={faqRef}
          style={{ height: 70, backgroundColor: '#12131c' }}
        />
        <div className="about-section">
          <Faqs />
        </div>
        <div className="bottom-section">
          <Bottom />
        </div>
      </div>
    </>
  )
}

export default Landing
