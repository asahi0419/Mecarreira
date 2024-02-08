import React, { useState, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { asyncLocalStorage, isMobile } from '@utils/helpers'
import AppLogo from '@components/Page/AppLogo'
import Container from '@components/Container'
import CheckIcon from '@mui/icons-material/Check'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import i18n from '@root/i18n'
import { useRef } from 'react'
import WalletModal from '@components/Dialog/WalletModal'
import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import { usePrivy } from '@privy-io/react-auth'
import { ConnectContext } from '@root/WalletConnectProvider'
import {
  resetCoinLaunch,
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
} from '@root/apis/onboarding/authenticationSlice'

interface MobileHeaderProps {
  handleClose?: () => void
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ handleClose }) => {
  return (
    <header>
      <Container>
        <div className="header">
          <a
            style={{
              visibility: 'hidden',
            }}
          >
            <CloseIcon className="icon-color" />
          </a>
          <AppLogo className="mt-7" noLink />
          <a>
            <CloseIcon className="icon-color" onClick={() => handleClose()} />
          </a>
        </div>
      </Container>
    </header>
  )
}

interface HeaderProps {
  showHeader?: boolean
}

const Header: React.FC<HeaderProps> = ({ showHeader }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location: any = useLocation()
  const pathname = location.pathname

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { walletConnectConfirmPopUp } = authenticationData
  // const [scrolled, setScrolled] = useState(false)

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 100) {
  //       setScrolled(true)
  //     } else {
  //       setScrolled(false)
  //     }
  //   }

  //   window.addEventListener('scroll', handleScroll)
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])

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
  const [showWalletModalNew, setShowWalletModalNew] = useState(false)
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

  const handleDisconnect = async () => {
    localStorage.removeItem('ISGOLIVECLICKED')
    localStorage.removeItem('secret_restricted')
    localStorage.removeItem('secret_change_restricted')
    localStorage.removeItem('launchMode')
    if (authenticated || localStorage.getItem('wallet') === 'Privy') {
      logout()
    }
    localStorage.removeItem('wallet')
    disconnect()
    dispatch(resetPlayerData())
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
      dispatch(emailLogout({ reqParams, location: 'Header.tsx_line178' }))
      localStorage.removeItem('userWalletAddress')
      dispatch(openSideMenu({ openMenu: false }))
    })
    window.dispatchEvent(new Event('refresh_menu'))
    localStorage.setItem('logg', 'out')
  }

  return (
    <header>
      <Container>
        {showWalletModalNew && walletConnectConfirmPopUp === false && (
          <WalletModal
            isOpen={showWalletModalNew && walletConnectConfirmPopUp === false}
            onClick={() => setShowWalletModalNew(false)}
            onClose={() => setShowWalletModalNew(false)}
          />
        )}
        <div
          className={`genesis-header-container ${showHeader ? 'scrolled' : ''}`}
        >
          <div className="genesis-header">
            <a onClick={() => navigate('/')}>
              <AppLogo noLink />
            </a>

            <div className="menu-items">
              {/* <div className="language-item">
                <div
                  className="language-title"
                  onClick={() => setShowLanguage(true)}
                  onBlur={() => setShowLanguage(false)}
                  style={{ display: 'flex' }}
                >
                  {t('language')}
                </div>
                {showLanguage && (
                  <div className="language-content">
                    {languages.map((item, index: number) => (
                      <div
                        className="language"
                        key={index}
                        onClick={() => changeLanguage(item.name, item.symbol)}
                      >
                        <div>{item.name}</div>
                        <div className="check-icon">
                          {lang === item.symbol && (
                            <CheckIcon fontSize="small" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div> */}
              {/* <div
                className="menu-item"
                onClick={() => navigate('/marketplace')}
              >
                {t('Marketplace')}
              </div> */}
              {Boolean(localStorage.getItem('loginInfo')) ||
              Boolean(localStorage.getItem('loginId')) ? (
                <>
                  <LogoutIcon
                    className="logout-icon icon-color"
                    onClick={() => handleDisconnect()}
                  />
                  <div
                    className="connect-btn"
                    onClick={() => dispatch(showWalletForm({}))}
                  >
                    {t('my wallet')}
                  </div>
                </>
              ) : (
                <div
                  className="connect-btn"
                  onClick={() => {
                    console.log('header_connect_clickedSSF')
                    dispatch(setActiveTab('register'))
                    dispatch(showSignupForm())
                  }}
                >
                  {t('connect')}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
