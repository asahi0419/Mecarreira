import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router'
import debounce from 'lodash.debounce'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined'
import SettingsIcon from '@mui/icons-material/Settings'
import { AppLogo, Container } from '..'
import { RootState } from '@root/store/rootReducers'
import Logo from '@assets/images/logo-min.webp'
import '@assets/css/layout/Header.css'
import { useWeb3React } from '@web3-react/core'
import {
  setActiveTab,
  showSignupForm,
  showWalletForm,
  showNftForm,
  showPurchaseForm,
  showStakingForm,
  togglePayForItem,
  showVotingMobile,
  handleChangeSecret,
  showKioskItemDetail,
  walletConnectCheck,
  setWalletSuccessInit,
  resetPostFulfillKioskOrder,
  resetPostUploadFile,
  userEmail,
  getHeaderBalance,
  showLatestTrade,
  openSideMenu,
  showPlayerShareXp,
  hideGenesisNftForm,
  getPlayerShares,
} from '@root/apis/onboarding/authenticationSlice'
import {
  persistDrafteePlayer,
  resetPlayerDetails,
  searchTickerPlayers,
  showCreteKioskItemForm,
  storeActiveTabBeforeLeaving,
  setShowNewDraftPopupRedux,
  resetCreatePlayerSuccess,
  resetIsGetEANftsBalanceSuccess,
  toggleStakingCoins,
} from '@root/apis/playerCoins/playerCoinsSlice'
import {
  resetGenesisNFTData,
  showGalleryDetail,
  showGalleryForm,
} from '@root/apis/gallery/gallerySlice'
import SearchIcon from '@mui/icons-material/Search'
import SearchInput from '@components/Form/SearchInput'
import {
  convertToFixed,
  getCircleColor,
  getCountryCode,
  isMobile,
} from '@utils/helpers'
import PlayerImage from '@components/PlayerImage'
import Profile from '../../assets/icons/icon/profileIcon.svg'
import ImageComponent from '@components/ImageComponent'
import { HOMEROUTE } from '@root/constants'
import classNames from 'classnames'
interface Props {
  className?: string
  headerClassName?: string
}
const Header: React.FC<Props> = ({ className, headerClassName }) => {
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location: any = useLocation()
  const pathname = location.pathname
  const [isSearchEnabledHeader, setSearchEnabledHeader] = useState(false)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { isGalleryFormVisible, isGalleryDetailVisible } = useSelector(
    (state: RootState) => state.gallery,
  )
  const {
    isSignupFormVisible,
    isWalletFormVisible,
    isPurchaseFormVisible,
    isStakingFormVisible,
    isNftFormVisible,
    nativeAmount,
    nftMobile,
    isPayForItemVisible,
    newVotingCreate,
    playerCoinSettingsMobileView,
    showChangeSecret,
    showKioskItemDetails,
    showKioskItemDetailsBuy,
    walletConnectConfirmPopUp,
    showLatestTransaction,
    invalidDevice,
    openMenu,
    isGenesisNftFormVisible,
    tourCategoryId,
    tourStep,
    hideTourHeader,
  } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    playersListDataTP,
    isLoadingTP,
    isCreateKioskItemFormVisible,
    showFanClubList,
    getPlayerDetailsSuccessData,
  } = playerCoinData
  const {
    isNoWallet,
    getNotificationCountData,
    isGetAddressWalletSuccess,
    isGetHeaderBalanceSuccess,
    getUserSettingsData,
    ipLocaleCurrency,
    isGetUserSettingsSuccess,
    selectedThemeRedux,
    showPlayerShareXpValue,
  } = authenticationData

  const [currencySymbol, setCurrencySymbol] = useState(
    getUserSettingsData?.currency ?? ipLocaleCurrency ?? 'USD',
  )

  useEffect(() => {
    if (isGetUserSettingsSuccess && isGetHeaderBalanceSuccess) {
      setCurrencySymbol(
        getUserSettingsData?.currency ?? ipLocaleCurrency ?? 'USD',
      )
      dispatch(setWalletSuccessInit())
    }
  }, [isGetHeaderBalanceSuccess])

  const { account } = useWeb3React()

  const handleGoBack = () => {
    if (showPlayerShareXpValue) {
      dispatch(showPlayerShareXp({ showPlayerShareXpValue: false }))
      return
    }
    {
      /*
        GEN7: On clicking on Close icon, its checked if Genesis NFt details api response is fetched
        & Genesis NFT UI is visible. if it is, the variables having Genesis nft detail are cleared & user is taken back
        to wallet with Toggle Button refreshed to further call Genesis or non genesis nft list &
        display updated data
      */
    }
    if (isGenesisNftFormVisible) {
      dispatch(hideGenesisNftForm())
      dispatch(resetGenesisNFTData())
      dispatch(toggleStakingCoins(false))
      return
    }
    if (openMenu) {
      dispatch(openSideMenu({ openMenu: false }))
      return
    }
    if (pathname.includes('fan-player-dashboard')) {
      navigate('/app/launch-your-coin')
      return
    }
    if (showFanClubList) {
      dispatch(setShowNewDraftPopupRedux({ showFanClubList: false }))
      return
    }
    if (isPayForItemVisible) {
      dispatch(togglePayForItem({ visible: false }))
      return
    }
    if (invalidDevice) {
      dispatch(
        userEmail({
          invalidDevice: false,
        }),
      )
      return
    }
    if (isCreateKioskItemFormVisible && isMobile()) {
      dispatch(showCreteKioskItemForm({ show: false }))
      return
    }
    if (showKioskItemDetails && isMobile()) {
      dispatch(showKioskItemDetail({ showKioskItemDetails: false }))
      dispatch(resetPostFulfillKioskOrder())
      dispatch(resetPostUploadFile())
      return
    }
    if (showKioskItemDetailsBuy && isMobile()) {
      dispatch(showKioskItemDetail({ showKioskItemDetailsBuy: false }))
      dispatch(resetPostUploadFile())
      return
    }
    if (walletConnectConfirmPopUp && isMobile()) {
      console.log('showing_connect_confirm5')
      dispatch(walletConnectCheck({ walletConnectConfirmPopUp: false }))
      return
    }
    if (showLatestTransaction && isMobile()) {
      dispatch(showLatestTrade({ showLatestTransaction: false }))
      return
    }
    if (pathname.includes('/player-dashboard')) {
      dispatch(storeActiveTabBeforeLeaving({ activeTab: '' }))
    }
    if (playerCoinSettingsMobileView) {
      dispatch(showVotingMobile({ playerCoinSettingsMobileView: false }))
    }
    if (newVotingCreate) {
      dispatch(showVotingMobile({ newVotingCreate: false }))
    }
    if (nftMobile) {
      dispatch(showNftForm({ nftMobile: false }))
      return
    }
    if (isGalleryDetailVisible) {
      dispatch(showGalleryDetail(false))
      return
    }
    if (isGalleryFormVisible) {
      dispatch(showGalleryForm(false))
      return
    }
    if (isSignupFormVisible) {
      dispatch(showSignupForm())
      return
    }
    if (isNftFormVisible) {
      dispatch(showNftForm({}))
      return
    }
    if (isWalletFormVisible) {
      dispatch(showWalletForm({}))
      dispatch(resetIsGetEANftsBalanceSuccess({}))
      return
    }
    if (isPurchaseFormVisible) {
      dispatch(showPurchaseForm({}))
      if (getPlayerDetailsSuccessData) {
        dispatch(
          getPlayerShares({
            playerContract: getPlayerDetailsSuccessData?.playercontract,
          }),
        )
      }
      return
    }
    if (isStakingFormVisible) {
      dispatch(showStakingForm({}))
      if (pathname.includes('/player/') && getPlayerDetailsSuccessData) {
        console.log('token_balance_refreshed_mob', {
          getPlayerDetailsSuccessData,
        })
        dispatch(
          getPlayerShares({
            playerContract: getPlayerDetailsSuccessData?.playercontract,
          }),
        )
      }
      return
    }
    if (showChangeSecret) {
      dispatch(handleChangeSecret(false))
      return
    }
    if (localStorage.getItem('previousPath') === 'nftView') {
      navigate(HOMEROUTE)
      localStorage.removeItem('previousPath')
      return
    }
    if (pathname.includes('/player-dashboard')) {
      if (localStorage.getItem('previousPath') === '/launch-your-coin') {
        navigate(HOMEROUTE)
        return
      }
    }
    if (
      pathname.includes('/all-players') ||
      pathname.includes('/launch-your-coin') ||
      pathname.includes('/nfts') ||
      pathname.includes('/otp-whatsapp')
    ) {
      dispatch(resetCreatePlayerSuccess())
    }
    if (pathname.includes('/otp-whatsapp')) {
      dispatch(resetCreatePlayerSuccess())
      navigate(HOMEROUTE)
    } else {
      if (pathname.includes('/signup')) {
        dispatch(setActiveTab('register'))
      } else if (pathname.includes('/draft_confirmation')) {
        dispatch(persistDrafteePlayer({ playerUrl: '' }))
      } else if (pathname.includes('/player-dashboard')) {
        dispatch(storeActiveTabBeforeLeaving({ activeTab: '' }))
      }
      if (location?.pathname.includes('/staked')) {
        dispatch(resetPlayerDetails())
        return navigate(HOMEROUTE)
      }

      // resetPlayerDetails
      if (
        pathname?.state?.from === '/' ||
        pathname.includes('/season') ||
        pathname.includes('/my_settings') ||
        pathname.includes('/my_items') ||
        pathname.includes('/my_watchlist') ||
        pathname.includes('/tutorials') ||
        pathname.includes('/how-it-works') ||
        pathname.includes('/nfts') ||
        pathname.includes('/kiosk') ||
        pathname.includes('/all-players') ||
        pathname.includes('/all-users') ||
        pathname.includes('/faqs') ||
        pathname.includes('/get-early-access') ||
        pathname.includes('/terms-conditions') ||
        pathname.includes('/privacy-policy') ||
        pathname.includes('/blog') ||
        pathname.includes('/careers') ||
        pathname.includes('/disclaimer') ||
        pathname.includes('/contact-us') ||
        pathname.includes('/freeXp') ||
        pathname.includes('/player/')
      ) {
        navigate(HOMEROUTE)
      } else {
        navigate(-1)
      }
      if (pathname.includes('/user-otp-whatsapp')) {
        navigate(-1)
      }
    }
  }

  if (
    localStorage.getItem('wallet') === 'Trust' ||
    localStorage.getItem('wallet') === 'WalletConnect'
  ) {
    if (account) {
      localStorage.setItem('loginInfo', account ?? '')
    }
  }

  const openSettings = () => {
    navigate('/app/notifications_settings')
  }
  const handleSearchHeader = () => {
    setSearchEnabledHeader(true)
  }
  const handleCloseHeader = () => {
    setSearchEnabledHeader(false)
    setLoading(false)
  }
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSearchParams = (value: string | undefined) => {
    // if (value.length >= 3) {
    //   setLoading(true)
    //   if (value) {
    //     dispatch(searchTickerPlayers({ search: value }))
    //   } else {
    //     dispatch(searchTickerPlayers({ search: '' }))
    //   }
    // }
    if (value.length >= 3 || (value.length === 0 && searchTerm.length > 0)) {
      setSearchTerm(value)
      setLoading(true)
      dispatch(searchTickerPlayers({ search: value }))
    }
  }

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden'
      if (isMobile()) {
        document.body.style.position = 'fixed'
      }
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
    }
  }, [loading])

  const optimisedHandleChange = useCallback(
    debounce(handleSearchParams, 500),
    [],
  )

  const includeLanding = !window.location.href.includes('/app')

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

  const handleClickUserAvatar = () => {
    if (openMenu) {
      dispatch(openSideMenu({ openMenu: false }))
    }
    navigate(`/app/user/${getUserSettingsData?.username}`)
  }

  return (
    <header
      className={classnames(
        `${selectedThemeRedux}`,
        (tourCategoryId || tourStep || pathname.includes('/tour')) &&
          !hideTourHeader
          ? 'tour-header'
          : '',
      )}
    >
      <Container>
        {(pathname === '/' || pathname === '/app' || pathname === '/staking') &&
        !openMenu ? (
          <div style={{ position: 'relative', height: '60px' }}>
            {isSignupFormVisible ||
            isWalletFormVisible ||
            isPurchaseFormVisible ||
            isStakingFormVisible ||
            invalidDevice ||
            showKioskItemDetails ||
            showKioskItemDetailsBuy ||
            isNftFormVisible ||
            (showPlayerShareXpValue && isMobile()) ||
            (showLatestTransaction && isMobile()) ||
            (showFanClubList && isMobile()) ? (
              <a
                onClick={handleGoBack}
                style={{
                  visibility: isNoWallet && !loginInfo ? 'hidden' : 'visible',
                }}
              >
                <CloseIcon className="icon-color" />
              </a>
            ) : isSearchEnabledHeader ? (
              <div
                style={{
                  zIndex: '600',
                  position: 'fixed',
                  top: '10px',
                  width: isMobile() ? '100%' : '',
                }}
              >
                <SearchInput
                  type="text"
                  placeholder={t('please enter the search words.')}
                  className={classnames(
                    isMobile()
                      ? 'in-menu-search-header_mobile'
                      : 'in-menu-search-header dash-search',
                  )}
                  onChange={handleSearchParams}
                  onClose={handleCloseHeader}
                />
              </div>
            ) : (
              <SearchIcon className="icon-color" onClick={handleSearchHeader} />
            )}
            <div className={classnames('header', headerClassName)}>
              {isSignupFormVisible ||
              isWalletFormVisible ||
              isPurchaseFormVisible ||
              isStakingFormVisible ||
              isNftFormVisible ||
              invalidDevice ||
              showKioskItemDetails ||
              showKioskItemDetailsBuy ||
              (walletConnectConfirmPopUp && isMobile()) ||
              (showPlayerShareXpValue && isMobile()) ||
              (showLatestTransaction && isMobile()) ||
              (showFanClubList && isMobile()) ? (
                <a
                  onClick={handleGoBack}
                  style={{
                    visibility: isNoWallet && !loginInfo ? 'hidden' : 'visible',
                  }}
                >
                  <CloseIcon className="icon-color" />
                </a>
              ) : (
                <SearchIcon
                  className="icon-color"
                  onClick={handleSearchHeader}
                />
              )}
              {loading ? (
                <div
                  className="player_list_container h-100"
                  style={isMobile() ? { left: '5.5%', width: '89%' } : {}}
                >
                  {playersListDataTP.length > 0 && !isLoadingTP ? (
                    playersListDataTP.map(el => {
                      return (
                        <div
                          className="player_list"
                          style={{ gridGap: '10px', gap: '10px' }}
                          onClick={() =>
                            navigate(`/app/player/${el?.detailpageurl}`)
                          }
                        >
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <div
                              className="profile_pic"
                              style={{
                                background: getCircleColor(el?.playerlevelid),
                              }}
                            >
                              <PlayerImage
                                src={
                                  el?.playerpicturethumb
                                    ? el?.playerpicturethumb
                                    : Profile
                                }
                                className="profile_pic_inner"
                              />
                            </div>
                            <p>
                              {el?.playername} <span>{`$${el?.ticker}`}</span>
                            </p>
                          </div>
                          <span
                            className={`fi fi-${getCountryCode(
                              el?.nationality_id || el?.country_id,
                            )}`}
                            style={{ marginLeft: '0px' }}
                          ></span>
                        </div>
                      )
                    })
                  ) : isLoadingTP && playersListDataTP.length === 0 ? (
                    <div
                      className="loading-spinner"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '100px auto',
                      }}
                    >
                      <div className="spinner two"></div>
                    </div>
                  ) : (
                    <p style={{ textAlign: 'center' }}>
                      {t('No Player Found')}
                    </p>
                  )}
                </div>
              ) : (
                ''
              )}
              <ArrowBackIcon className="sub-menu-btn icon-color" />
              {/* {console.log({ isGetHeaderBalanceSuccess })} */}
              {isMobile() && isSearchEnabledHeader ? (
                ''
              ) : loginId || loginInfo ? (
                <div className="wallet-address">
                  {isGetHeaderBalanceSuccess ? (
                    <div className="header-user-image">
                      <div
                        className="image-border"
                        onClick={handleClickUserAvatar}
                      >
                        <div
                          className={classNames(
                            'nft-image',
                            `${getUserSettingsData?.avatar ?? 'group-0'}`,
                          )}
                        />
                      </div>
                      <h6 className="header-title">
                        <b onClick={() => dispatch(showWalletForm({}))}>
                          {parseFloat(nativeAmount).toLocaleString()}
                        </b>
                        &nbsp;
                        {currencySymbol}
                      </h6>
                    </div>
                  ) : (
                    <div className="spinner three"></div>
                  )}
                </div>
              ) : (
                <AppLogo className={classnames(className)} />
              )}
              {isMobile() && isSearchEnabledHeader ? (
                ''
              ) : (
                <div className="right_side_notification">
                  {loginId || loginInfo ? (
                    <Link to="/app/notifications">
                      <div className="live_notification_wrapper">
                        {getNotificationCountData > 0 ? (
                          <div
                            className="live_notification"
                            style={{ fontSize: isMobile() ? '8px' : '10px' }}
                          >
                            {getNotificationCountData > 0
                              ? getNotificationCountData
                              : ''}
                          </div>
                        ) : (
                          ''
                        )}
                        <NotificationsOutlinedIcon
                          style={{ margin: '22px 0px' }}
                          className="icon-color main-menu-btn"
                        />
                      </div>
                    </Link>
                  ) : (
                    ''
                  )}
                  {/* <Link to="/menu">
                    <DehazeOutlinedIcon
                      style={{
                        margin: isMobile() ? '22px' : '22px',
                      }}
                      className="icon-color main-menu-btn"
                    />
                  </Link> */}
                  <div
                    onClick={() => {
                      dispatch(openSideMenu({ openMenu: true }))
                    }}
                  >
                    <DehazeOutlinedIcon
                      style={{
                        margin: isMobile() ? '22px' : '22px',
                      }}
                      className="icon-color main-menu-btn"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : pathname === '/app/notifications' ? (
          <div
            className={classnames(
              'header',
              authenticationData.userName || loginId ? 'user-header' : '',
              `${selectedThemeRedux}`,
            )}
          >
            <ArrowBackIcon
              className="icon-color"
              onClick={() => handleGoBack()}
            />
            {loginId || loginInfo ? (
              <div className="wallet-address">
                {isGetHeaderBalanceSuccess ? (
                  <div className="header-user-image">
                    <div
                      className="image-border"
                      onClick={handleClickUserAvatar}
                    >
                      <div
                        className={classNames(
                          'nft-image',
                          `${getUserSettingsData?.avatar ?? 'group-0'}`,
                        )}
                      />
                    </div>
                    <h6 className="header-title">
                      <b onClick={() => dispatch(showWalletForm({}))}>
                        {parseFloat(nativeAmount).toLocaleString()}
                      </b>
                      &nbsp;
                      {currencySymbol}
                    </h6>
                  </div>
                ) : (
                  <div className="spinner four"></div>
                )}
              </div>
            ) : (
              <a onClick={handleClickLogo}>
                <ImageComponent
                  loading="lazy"
                  src={Logo}
                  alt=""
                  className="logo-img"
                />
              </a>
            )}
            <SettingsIcon
              className="icon-color"
              onClick={() => openSettings()}
            />
          </div>
        ) : pathname.includes('/language') || openMenu ? (
          <div className={classnames('header menu-language-background')}>
            {!openMenu ? (
              <a onClick={handleGoBack}>
                <ArrowBackIcon className="icon-color" />
              </a>
            ) : (
              <a href="" style={{ width: '50px' }}></a>
            )}
            {loginId || loginInfo ? (
              <div className="wallet-address">
                {isGetHeaderBalanceSuccess ? (
                  <div className="header-user-image">
                    <div
                      className="image-border"
                      onClick={handleClickUserAvatar}
                    >
                      <div
                        className={classNames(
                          'nft-image',
                          `${getUserSettingsData?.avatar ?? 'group-0'}`,
                        )}
                      />
                    </div>
                    <h6 className="header-title">
                      <b onClick={() => dispatch(showWalletForm({}))}>
                        {parseFloat(nativeAmount).toLocaleString()}
                      </b>
                      &nbsp;
                      {currencySymbol}
                    </h6>
                  </div>
                ) : (
                  <div className="spinner five"></div>
                )}
              </div>
            ) : (
              <div className={classnames('logo', className)}>
                <a onClick={handleClickLogo}>
                  <ImageComponent
                    loading="lazy"
                    src={Logo}
                    alt=""
                    className="logo-img"
                  />
                </a>
              </div>
            )}
            {!openMenu ? (
              // <Link to="/menu">
              //   <DehazeOutlinedIcon className="icon-color main-menu-btn" />
              // </Link>
              <div
                onClick={() => {
                  dispatch(openSideMenu({ openMenu: true }))
                }}
              >
                <DehazeOutlinedIcon className="icon-color main-menu-btn" />
              </div>
            ) : (
              <CloseIcon className="icon-color" onClick={handleGoBack} />
            )}
          </div>
        ) : (
          <div className={classnames('header')}>
            <a
              onClick={handleGoBack}
              style={{
                visibility: isNoWallet && !loginInfo ? 'hidden' : 'visible',
              }}
            >
              {isSignupFormVisible ||
              isWalletFormVisible ||
              isPurchaseFormVisible ||
              isStakingFormVisible ||
              isNftFormVisible ||
              isGalleryFormVisible ||
              nftMobile ||
              showChangeSecret ||
              isCreateKioskItemFormVisible ||
              pathname.includes('/otp-whatsapp') ||
              pathname.includes('/user-otp-whatsapp') ||
              (isPayForItemVisible && isMobile()) ||
              pathname.includes('/draft_new_player') ||
              (newVotingCreate && isMobile()) ||
              pathname.includes('/player-share') ||
              (playerCoinSettingsMobileView && isMobile()) ||
              (showKioskItemDetails && isMobile()) ||
              (showKioskItemDetailsBuy && isMobile()) ||
              isSignupFormVisible ||
              isWalletFormVisible ||
              isPurchaseFormVisible ||
              isStakingFormVisible ||
              isNftFormVisible ||
              (showPlayerShareXpValue && isMobile()) ||
              (showLatestTransaction && isMobile()) ||
              (showFanClubList && isMobile()) ? (
                <CloseIcon className="icon-color" />
              ) : (
                <ArrowBackIcon className="icon-color" />
              )}
            </a>
            {loginId || loginInfo ? (
              <div className="wallet-address">
                {pathname.includes('/draft_new_player') ? (
                  <h6 className="header-title">{t('find players')}</h6>
                ) : (
                  <>
                    {isGetHeaderBalanceSuccess ? (
                      <div className="header-user-image">
                        <div
                          className="image-border"
                          onClick={handleClickUserAvatar}
                        >
                          <div
                            className={classNames(
                              'nft-image',
                              `${getUserSettingsData?.avatar ?? 'group-0'}`,
                            )}
                          />
                        </div>
                        <h6 className="header-title">
                          <b onClick={() => dispatch(showWalletForm({}))}>
                            {parseFloat(nativeAmount).toLocaleString()}
                          </b>
                          &nbsp;
                          {currencySymbol}
                        </h6>
                      </div>
                    ) : (
                      <div className="spinner one"></div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className={classnames('logo', className)}>
                <a onClick={handleClickLogo}>
                  <ImageComponent
                    loading="lazy"
                    src={Logo}
                    alt=""
                    className="logo-img"
                  />
                </a>
              </div>
            )}
            <div>
              <div className="right_side_notification">
                {loginId || loginInfo ? (
                  <Link to="/app/notifications">
                    <div className="live_notification_wrapper">
                      {getNotificationCountData > 0 ? (
                        <div
                          className="live_notification"
                          style={{ fontSize: isMobile() ? '8px' : '10px' }}
                        >
                          {getNotificationCountData > 0
                            ? getNotificationCountData
                            : ''}
                        </div>
                      ) : (
                        ''
                      )}
                      <NotificationsOutlinedIcon
                        style={{ margin: '22px 0px' }}
                        className="icon-color main-menu-btn"
                      />
                    </div>
                  </Link>
                ) : (
                  ''
                )}
                {/* <Link to="/menu">
                  <DehazeOutlinedIcon
                    style={{
                      margin: isMobile() ? '22px' : '22px',
                    }}
                    className="icon-color"
                  />
                </Link> */}
                <div
                  onClick={() => {
                    dispatch(openSideMenu({ openMenu: true }))
                  }}
                >
                  <DehazeOutlinedIcon
                    style={{
                      margin: isMobile() ? '22px' : '22px',
                    }}
                    className="icon-color"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header
