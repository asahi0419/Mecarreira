import React, { useState, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { ConnectContext } from '@root/WalletConnectProvider'
import { AppLayout } from '@components/index'
import MenuItem from '@components/Page/Navigation/MenuItem'
import SocialGroup from '@components/Page/Navigation/SocialGroup'
import ContactUs from '@components/Page/Navigation/ContactUs'
import { MenuItems } from '@root/constants'
import {
  exportKeyReset,
  getFactsheetUrl,
  logout as emailLogout,
  resetWallet,
  showSignupForm,
  showWalletForm,
  showNftForm,
  showPurchaseForm,
  showStakingForm,
  resetSendChangeSecretOtp,
  resetGeneralSettings,
  openSideMenu,
  handleLandingNavigate,
  resetUserName,
  resetBalanceOfAllowance,
  setNagivated,
  getQualificationSetting,
} from '@root/apis/onboarding/authenticationSlice'
import {
  asyncLocalStorage,
  getBrowserName,
  isMobile,
  isPwa,
} from '@utils/helpers'
import { RootState } from '@root/store/rootReducers'
import { useLocation, useNavigate } from 'react-router'
import '@assets/css/layout/Menu.css'
import {
  resetCoinLaunch,
  resetPlayerData,
} from '@root/apis/playerCoins/playerCoinsSlice'
import WalletModal from '@components/Dialog/WalletModal'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import useForceUpdate from '@utils/hooks/forceUpdater'
import classNames from 'classnames'
import { usePrivy } from '@privy-io/react-auth'
import DownloadAppOption from '@components/DownloadAppOption'

const Menu: React.FC = () => {
  const { t } = useTranslation()
  const currentBrowser = getBrowserName()
  const navigate = useNavigate()
  const [optionsMenu, setOptionsMenu] = useState(MenuItems)
  const [showWalletModalNew, setShowWalletModalNew] = useState(false)

  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    isSignupFormVisible,
    isWalletFormVisible,
    isPurchaseFormVisible,
    isStakingFormVisible,
    isNftFormVisible,
    walletConnectConfirmPopUp,
    openMenu,
    QualificationSettingData,
  } = authenticationData
  const { connectStatus, disconnect } = useContext(ConnectContext)
  const forceUpdate = useForceUpdate()
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  let selectedLanguage = localStorage.getItem('languageName')
  if (selectedLanguage === null) {
    selectedLanguage = 'English'
  }

  const { authenticated, logout } = usePrivy()

  const onStorageUpdate = e => {
    const { key, newValue } = e
    console.log('storage--', key, newValue)
    // if (key === 'logg' && newValue === 'out') {
    //   forceUpdate()
    //   forceUpdate()
    //   forceUpdate()
    //   forceUpdate()
    //   forceUpdate()
    //   forceUpdate()
    // }
  }

  useEffect(() => {
    if (isMobile()) {
      if (isSignupFormVisible) {
        dispatch(showSignupForm())
      }
      if (isWalletFormVisible) {
        dispatch(showWalletForm({}))
      }
      if (isPurchaseFormVisible) {
        dispatch(showPurchaseForm({}))
      }
      if (isStakingFormVisible) {
        dispatch(showStakingForm({}))
      }
      if (isNftFormVisible) {
        dispatch(showNftForm({}))
      }
    }
    if (connectStatus && !loginInfo) {
      disconnect()
      dispatch(resetUserName())
    }
    window.addEventListener('storage', onStorageUpdate)
    return () => {
      window.removeEventListener('storage', onStorageUpdate)
    }
  }, [])

  // window.addEventListener('refresh_menu', () => {
  //   console.log('refresh_menu_called')
  //   forceUpdate()
  // })

  useEffect(() => {
    // dispatch(getQualificationSetting())
    // dispatch(getFactsheetUrl()) //commented on 27Oct'23 for console error removal
    if (!loginInfo && !loginId) {
      const menuTemp = MenuItems.filter(
        item =>
          ![
            'notification Settings',
            'change password',
            'my Settings',
            'my items',
            'my watchlist',
            // 'i am a player',
          ].includes(item.title),
      )
      setOptionsMenu(menuTemp)
    } else if (loginInfo) {
      const menuTemp = MenuItems.filter(
        item => !['change password'].includes(item.title),
      )
      setOptionsMenu(menuTemp)
    } else if (loginId) {
      setOptionsMenu(MenuItems)
    }
    // window.history.replaceState(null, 'Buy', '/')
  }, [loginInfo, loginId])

  const handleShowLogin = () => {
    dispatch(showSignupForm())
  }

  const handleLogout = async () => {
    localStorage.removeItem('ISGOLIVECLICKED')
    localStorage.removeItem('ISLAUNCHCLICKED')
    localStorage.removeItem('secret_restricted')
    localStorage.removeItem('launchMode')
    localStorage.removeItem('secret_change_restricted')
    window.localStorage.removeItem('ISLAUNCHCLICKED')
    asyncLocalStorage.getItem('refreshToken').then(token => {
      const reqParams = {
        refresh_token: token,
      }
      dispatch(resetCoinLaunch())
      dispatch(resetPlayerData())
      dispatch(resetWallet())
      dispatch(resetSendChangeSecretOtp())
      // dispatch(emailLogout(reqParams))
      dispatch(emailLogout({ reqParams, location: 'MenuIndex.tsx_line165' }))
      dispatch(exportKeyReset())
      dispatch(resetGeneralSettings())
      dispatch(resetBalanceOfAllowance())
      localStorage.removeItem('userWalletAddress')
      setTimeout(() => {
        navigate('/' + (parseInt(QualificationSettingData) === 3 ? 'app' : ''))
      }, 1000)
      dispatch(openSideMenu({ openMenu: false }))
    })
    window.dispatchEvent(new Event('refresh_menu'))
    localStorage.setItem('logg', 'out')
  }

  const navigateLandingPage = index => {
    dispatch(openSideMenu({ openMenu: false }))
    dispatch(handleLandingNavigate({ landingNavigateIndex: index }))
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
      dispatch(emailLogout({ reqParams, location: 'MenuIndex.tsx_line203' }))
      localStorage.removeItem('userWalletAddress')
      setTimeout(() => {
        navigate('/' + (parseInt(QualificationSettingData) === 3 ? 'app' : ''))
      }, 1000)
      dispatch(openSideMenu({ openMenu: false }))
    })
    window.dispatchEvent(new Event('refresh_menu'))
    localStorage.setItem('logg', 'out')
  }

  const closeMenu = () => {
    dispatch(openSideMenu({ openMenu: false }))
    return
  }

  useEffect(() => {
    if (openMenu) {
      const body = document.body
      body.style.overflow = 'hidden'
    } else {
      const body = document.body
      body.style.overflow = 'auto'
      setTimeout(() => {
        body.style.overflow = 'auto'
      }, 100)
    }
  }, [openMenu])

  const handleRequestPlayerCreation = () => {
    if (!loginInfo && !loginId) {
      dispatch(showSignupForm())
      return
    }
    dispatch(openSideMenu({ openMenu: false }))
    navigate('/player-dashboard')
  }

  const handleGenesis = () => {
    dispatch(openSideMenu({ openMenu: false }))
    navigate('/genesis')
  }

  return (
    <>
      {openMenu ? (
        <AppLayout
          className={classNames(
            'menu',
            !window.location.href.includes('/app') ? 'new-landing-menu' : '',
          )}
          footerStatus="footer-status"
          containerClass="fullwidth"
          noPageFooter={true}
          noModal={true}
        >
          {!window.location.href.includes('/app') ? (
            <div className="menu-items new-landing-menu mt-0">
              {/* <div className="bottom-line" style={{ margin: '20px 0' }} />

              <div
                className="notification-title"
                onClick={() => navigateLandingPage(0)}
              >
                <div className="link-title">{t('get started')}</div>
                <div className="selected-value-row">
                  <div className="grey-color">
                    <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                  </div>
                </div>
              </div>

              <div
                className="notification-title"
                onClick={() => navigateLandingPage(1)}
              >
                <div className="link-title">{t('Choose Mode')}</div>
                <div className="selected-value-row">
                  <div className="grey-color">
                    <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                  </div>
                </div>
              </div>

              {playerMode ? (
                <>
                  <div
                    className="notification-title"
                    onClick={() => navigateLandingPage(2)}
                  >
                    <div className="link-title">{t('Take Your Potential')}</div>
                    <div className="selected-value-row">
                      <div className="grey-color">
                        <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                      </div>
                    </div>
                  </div>
                  <div
                    className="notification-title"
                    onClick={() => navigateLandingPage(3)}
                  >
                    <div className="link-title">{t('Launch Official')}</div>
                    <div className="selected-value-row">
                      <div className="grey-color">
                        <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="notification-title"
                    onClick={() => navigateLandingPage(4)}
                  >
                    <div className="link-title">{t('Turn Your Passion')}</div>
                    <div className="selected-value-row">
                      <div className="grey-color">
                        <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                      </div>
                    </div>
                  </div>
                  <div
                    className="notification-title"
                    onClick={() => navigateLandingPage(5)}
                  >
                    <div className="link-title">{t('How It Works')}</div>
                    <div className="selected-value-row">
                      <div className="grey-color">
                        <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div
                className="notification-title"
                onClick={() => navigateLandingPage(6)}
              >
                <div className="link-title">{t('about us')}</div>
                <div className="selected-value-row">
                  <div className="grey-color">
                    <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                  </div>
                </div>
              </div>

              <div
                className="notification-title"
                onClick={() => navigateLandingPage(7)}
              >
                <div className="link-title">{t('faq')}</div>
                <div className="selected-value-row">
                  <div className="grey-color">
                    <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                  </div>
                </div>
              </div> */}

              {/* <div className="notification-title">
                <div className="link-title">{t('blog')}</div>
                <div className="selected-value-row">
                  <div className="grey-color">
                    <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                  </div>
                </div>
              </div> */}
              {/* <div
                className="notification-title"
                onClick={() => navigate('/language', { state: { from: '/' } })}
              >
                <div className="link-title focussed">{t('language')}</div>
                <div className="selected-value-row">
                  <div className="selected-value active">
                    {selectedLanguage}
                  </div>
                  <div className="fg-primary-color">
                    <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                  </div>
                </div>
              </div> */}
              <div
                className="get-more-btn invitations_referrals_btn m-auto"
                style={{ backgroundColor: 'transparent' }}
                onClick={handleRequestPlayerCreation}
              >
                {t('request_player_account')}
              </div>
              <div className="genesis-land-mint-btn" onClick={handleGenesis}>
                {t('genesis by mecarreira')}
              </div>
              <div className="bottom-line" style={{ margin: '20px 0' }} />
              <ContactUs />
              <div className="bottom-line" style={{ margin: '20px 0' }} />
              <SocialGroup />
            </div>
          ) : (
            <>
              {showWalletModalNew && walletConnectConfirmPopUp === false && (
                <WalletModal
                  isOpen={
                    showWalletModalNew && walletConnectConfirmPopUp === false
                  }
                  onClick={() => setShowWalletModalNew(false)}
                  onClose={() => setShowWalletModalNew(false)}
                />
              )}
              {connectStatus || Boolean(loginInfo) ? (
                <div
                  className={`button-box ${
                    Boolean(loginInfo) ? 'grey-color grey-border-color' : ''
                  }`}
                  onClick={handleDisconnect}
                >
                  {t('sign out')}
                </div>
              ) : (
                !Boolean(loginId) && (
                  <div
                    className={classnames(
                      'button-box',
                      authenticationData.userName ? 'hidden' : '',
                      'text-center',
                    )}
                    style={{ padding: '14px' }}
                    onClick={() => setShowWalletModalNew(true)}
                  >
                    {t('connect wallet')}
                  </div>
                )
              )}
              {loginId || authenticationData.userName ? (
                <div className="button-box" onClick={handleLogout}>
                  {t('log out')}
                </div>
              ) : (
                !Boolean(loginInfo) && (
                  <div className="button-box" onClick={handleShowLogin}>
                    {t('sign up / sign in')}
                  </div>
                )
              )}
              <div className="menu-items">
                {optionsMenu.map((item, index) => {
                  if (item.title === 'seasons') {
                    return (
                      <div key={index} onClick={closeMenu}>
                        <div
                          style={{
                            borderBottom: '1px solid #56596a',
                            margin: '18px 0px',
                          }}
                        ></div>
                        <MenuItem
                          item={item}
                          key={index}
                          index={index}
                          isMenu={true}
                          rootClass="divider-next"
                        />
                      </div>
                    )
                  } else {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          item.title === 'factsheet' ||
                          item.title === 'theme' ||
                          (item.title === 'change password' && !isMobile())
                            ? ''
                            : closeMenu()
                        }}
                        style={{ margin: '16px 0' }}
                      >
                        <MenuItem
                          item={item}
                          key={index}
                          index={index}
                          isMenu={true}
                          rootClass=" "
                        />
                      </div>
                    )
                  }
                })}
              </div>
              <div className="bottom-line"></div>
              <ContactUs />
              <div className="bottom-line"></div>
              <SocialGroup />
              {window.location.href.includes('/app') &&
              !isPwa() &&
              ['Chrome', 'Safari'].includes(currentBrowser) ? (
                <>
                  <div className="bottom-line"></div>
                  <DownloadAppOption />
                </>
              ) : null}
              <br />
              <br />
            </>
          )}
        </AppLayout>
      ) : (
        ''
      )}
    </>
  )
}

export default Menu
