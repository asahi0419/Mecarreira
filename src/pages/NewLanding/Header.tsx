import React, { useState, useContext, useEffect } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined'
import { asyncLocalStorage, isMobile } from '@utils/helpers'
import AppLogo from '@components/Page/AppLogo'
import Container from '@components/Container'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import i18n from '@root/i18n'
import { useRef } from 'react'
import LogoutIcon from '@mui/icons-material/Logout'
import { usePrivy } from '@privy-io/react-auth'
import { ConnectContext } from '@root/WalletConnectProvider'
import {
  resetCoinLaunch,
  resetPlayerCoinData,
  resetPlayerData,
} from '@root/apis/playerCoins/playerCoinsSlice'
import {
  exportKeyReset,
  logout as emailLogout,
  resetWallet,
  resetSendChangeSecretOtp,
  resetGeneralSettings,
  openSideMenu,
  resetUserName,
  setActiveTab,
  setNagivated,
  setSelectedLanguage,
  showSignupForm,
  showWalletForm,
  resetBalanceOfAllowance,
  resetSentEmailVerification,
  toggleInvitePopup,
} from '@root/apis/onboarding/authenticationSlice'
import useQualificationStatus from '@utils/hooks/qualificationStatusHook'
import { MenuOpen } from '@mui/icons-material'

interface Props {
  className?: string
  headerClassName?: string
  showHeader?: boolean
}

const Header: React.FC<Props> = ({
  className,
  headerClassName,
  showHeader,
}) => {
  const includeLanding = !window.location.href.includes('/app')
  // const includeLanding = process.env.REACT_APP_MODE === 'TESTING'
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location: any = useLocation()
  const pathname = location.pathname
  const [isInvitePropmptShown, isPageAccessRestricted] =
    useQualificationStatus()

  const languages = [
    {
      name: 'English',
      symbol: 'en',
    },
    {
      name: 'Deutsch',
      symbol: 'de',
    },
  ]

  const [lang, setLang] = useState(localStorage.getItem('language'))
  const [showLanguage, setShowLanguage] = useState(false)
  const [showCloseBtn, setShowCloseBtn] = useState(false)

  const { authenticated, logout } = usePrivy()
  const { connectStatus, disconnect } = useContext(ConnectContext)

  const selectedLanguage = useSelector(
    (state: RootState) => state.authentication.selectedLanguage,
  )

  if (lang === null) {
    setLang('en')
  }

  const changeLanguage = (name: string, lng: string) => {
    i18n.changeLanguage(lng)
    setLang(lng)
    localStorage.setItem('languageName', name)
    localStorage.setItem('language', lng)
    localStorage.setItem('isLocaleSet', 'true')
    if (localStorage.getItem('loginInfo')) {
      dispatch(
        setSelectedLanguage({ language: lng, hasSelected: !!selectedLanguage }),
      )
    }
    setShowLanguage(false)
  }

  const handleGoBack = () => {
    dispatch(openSideMenu({ openMenu: false }))
    if (isSignupFormVisible) {
      console.log('test51')
      dispatch(showSignupForm())
      dispatch(resetSentEmailVerification())
    } else if (isWalletFormVisible) {
      dispatch(showWalletForm({}))
    } else if (isInvitationPopupShown) {
      dispatch(toggleInvitePopup(false))
    }
    // if (location?.state?.from === '/') {
    //   navigate('/')
    // } else {
    //   navigate(-1)
    // }
  }

  const handleDisconnect = async () => {
    if (isInvitationPopupShown) {
      dispatch(toggleInvitePopup(false))
    }
    localStorage.removeItem('ISGOLIVECLICKED')
    localStorage.removeItem('secret_restricted')
    localStorage.removeItem('secret_change_restricted')
    localStorage.removeItem('launchMode')
    localStorage.removeItem('invite_code')
    if (authenticated || localStorage.getItem('wallet') === 'Privy') {
      logout()
    }
    localStorage.removeItem('wallet')
    disconnect()
    dispatch(resetPlayerData())
    dispatch(resetPlayerCoinData())
    dispatch(exportKeyReset())
    dispatch(resetGeneralSettings())
    dispatch(resetBalanceOfAllowance())
    localStorage.removeItem('ISLAUNCHCLICKED')
    asyncLocalStorage.getItem('accessToken').then(token => {
      const reqParams = {
        refresh_token: token,
      }
      dispatch(resetCoinLaunch())
      dispatch(resetPlayerData())
      dispatch(resetWallet())
      dispatch(resetSendChangeSecretOtp())
      // dispatch(emailLogout(reqParams))
      dispatch(
        emailLogout({ reqParams, location: 'NewLandingHeader.tsx_line146' }),
      )
      localStorage.removeItem('userWalletAddress')
      setTimeout(() => {
        navigate('/')
      }, 1000)
      dispatch(openSideMenu({ openMenu: false }))
    })
    window.dispatchEvent(new Event('refresh_menu'))
    localStorage.setItem('logg', 'out')
  }

  const windowSize = useRef(window.innerWidth)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    openMenu,
    isSignupFormVisible,
    isWalletFormVisible,
    isInvitationPopupShown,
  } = authenticationData
  const isLoggedIn =
    Boolean(localStorage.getItem('loginInfo')) ||
    Boolean(localStorage.getItem('loginId'))

  useEffect(() => {
    if (isMobile()) {
      if (
        isInvitationPopupShown ||
        isSignupFormVisible ||
        isWalletFormVisible
      ) {
        setShowCloseBtn(true)
      } else {
        setShowCloseBtn(false)
      }
    }
  }, [isInvitationPopupShown, isSignupFormVisible, isWalletFormVisible])

  const handleClickLogo = (
    event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>,
  ) => {
    if (!includeLanding) {
      navigate('/')
    } else if (pathname !== '/') {
      navigate('/')
    } else {
      const anchor = (
        (event.target as HTMLDivElement).ownerDocument || document
      ).querySelector('#get-started')

      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header>
      <Container>
        <div
          className={`new-header-container ${
            showHeader || showCloseBtn ? 'scrolled' : ''
          } ${openMenu ? 'no-transition' : ''}`}
        >
          {/* <canvas className="banner_canvas" style={{ opacity: 0 }}></canvas> */}
          <div
            className={classnames('new-header canvas_overlap', headerClassName)}
            // style={{ paddingLeft: !isMobile() && openMenu ? '90px' : '' }}
          >
            <a
              className={classnames(
                // isMobile() && !openMenu ? 'ml-10' : '',
                (openMenu || showCloseBtn) && isMobile()
                  ? 'm-auto menu-logo-margin'
                  : openMenu
                  ? 'm-auto'
                  : '', //'menu-logo-margin',
              )}
              onClick={handleClickLogo}
            >
              <AppLogo
                className={classnames(
                  className,
                  openMenu && includeLanding && !isMobile()
                    ? `ml-${isMobile() ? 30 : 60}`
                    : '',
                )}
                noLink
              />
            </a>
            <div className="new-header-right-menu">
              {showCloseBtn ? (
                <CloseIcon className="icon-color m-10" onClick={handleGoBack} />
              ) : isLoggedIn ? (
                <>
                  {openMenu && includeLanding ? null : (
                    <>
                      <LogoutIcon
                        className="logout-icon icon-color"
                        onClick={() => handleDisconnect()}
                      />
                      <div
                        className="connect-btn"
                        style={{ width: !isMobile() ? '173px' : null }}
                        onClick={() => dispatch(showWalletForm({}))}
                      >
                        {t('my wallet')}
                      </div>
                    </>
                  )}
                </>
              ) : null}
              {!showCloseBtn && (
                <>
                  {pathname.includes('/language') ||
                  openMenu ||
                  isInvitationPopupShown ? (
                    <CloseIcon
                      className={classnames(
                        'icon-color',
                        isMobile() ? 'm-10' : '',
                      )}
                      onClick={handleGoBack}
                    />
                  ) : (
                    <DehazeOutlinedIcon
                      style={{
                        margin: isMobile() ? '10px' : '22px',
                      }}
                      className="icon-color main-menu-btn"
                      onClick={() => dispatch(openSideMenu({ openMenu: true }))}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
