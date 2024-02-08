import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react'
import classnames from 'classnames'

import { Header, Footer } from '@components/index'
import LandingHeader from '@pages/NewLanding/Header'
import ContactUs from './Navigation/ContactUs'
import { useTranslation } from 'react-i18next'
import PlayerModal from '@pages/Landing/PlayerModal'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import $ from 'jquery'
import { RootState } from '@root/store/rootReducers'
import {
  showSignupForm,
  showWalletForm,
  showNftForm,
  showPurchaseForm,
  showStakingForm,
  resetSentEmailVerification,
  showPlayerSelectionForm,
  togglePayForItem,
  userEmail,
  walletConnectCheck,
  handleChangeSecret,
  showKioskItemDetail,
  resetPostFulfillKioskOrder,
  resetPostUploadFile,
  showLatestTrade,
  resetLatestTrade,
  showPlayerShareXp,
  getPlayerShares,
  showGenesisNftForm,
  hideGenesisNftForm,
  resetStakingRewardXp,
  selectedTheme,
  setShowMore,
} from '@root/apis/onboarding/authenticationSlice'
import DialogBox from '@components/Dialog/DialogBox'
import OnboardingForm from '@pages/Onboarding/OnboardingForm'
import WalletForm from '@pages/Wallet/WalletForm'
import WalletDialog from '@components/Dialog/WalletDialog'
import TabGroup from '@components/Page/TabGroup'
import SellNftForm from '@pages/PurchaseNft/SellNft/SellNftForm'
import BuyNftForm from '@pages/PurchaseNft/BuyNft/BuyNftForm'
import StakedForm from '@pages/Wallet/PlayerCoins/StakedForm'
import NftView from '@pages/PlayerNft/NftView'
import {
  getPlayerSelection,
  getSelectedPlayer,
  getSelectedPlayerDone,
  resetIsGetEANftsBalanceSuccess,
  setShowNewDraftPopupRedux,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { isMobile } from '@utils/helpers'
import PayForItems from '@pages/Wallet/MyWallet/PayForItems'
import WalletConnectConfirm from '@components/Page/WalletConnectConfirm'
import SocialGroup from './Navigation/SocialGroup'
import ChangeSecretForm from '@pages/Landing/UserSettings/Components/ChangeSecretForm'
import { default as KioskOrderDetailForm } from '../Card/KioskOrderDetail'
import KioskItemDetail from '../Card/KioskItemDetail'
import { ConnectContext } from '@root/WalletConnectProvider'
import {
  resetGenesisNFTData,
  resetNftData,
} from '@root/apis/gallery/gallerySlice'
import { publish } from '@utils/events'
import LatestTradeInfo from '@pages/Player/Profile/LatestTradeInfo'
import NewDraft from '@pages/PlayerDashboard/Drafts/NewDraft'
import FanClubList from '@pages/LaunchCoin/FanClubList'
import ClaimPlayerShareXp from '@pages/Player/Profile/ClaimPlayerShareXp'
import GenesisNftView from '@pages/PlayerNft/GenesisNftView'
import useQualificationStatus from '@utils/hooks/qualificationStatusHook'
import TurnStileWidget from '@components/CloudFlareCaptcha'
import { THEME_COLORS } from '@root/constants'
import { toast } from 'react-hot-toast'
import NewBuyForm from '@pages/PurchaseNft/BuyNft/NewBuyForm'
import NewSellForm from '@pages/PurchaseNft/SellNft/NewSellForm'
interface Props {
  children: React.ReactNode
  className?: string
  headerStatus?: string
  headerClass?: string
  containerClass?: string
  footerStatus?: string
  noPageFooter?: boolean
  hasShadow?: boolean
  pageFooterClass?: string
  noModal?: boolean
}
const AppLayout: React.FC<Props> = ({
  children,
  className,
  headerStatus,
  headerClass,
  containerClass,
  footerStatus,
  noPageFooter,
  hasShadow,
  pageFooterClass,
  noModal = false,
}) => {
  const [y, setY] = useState(window.scrollY)
  const [navigationStatus, setNavigationStatus] = useState(true)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  // console.log({ location })
  const [isInvitePropmptShown, isPageAccessRestricted] =
    useQualificationStatus()

  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    isSignupFormVisible,
    isWalletFormVisible,
    isPurchaseFormVisible,
    isStakingFormVisible,
    isNftFormVisible,
    isGenesisNftFormVisible,
    genesisNft,
    isPlayerSelectionFormVisible,
    nft,
    playerData,
    isMandatory,
    isPayForItemVisible,
    selectedThemeRedux,
    invalidDevice,
    walletConnectConfirmPopUp,
    showChangeSecret,
    showKioskItemDetails,
    showKioskItemDetailsBuy,
    KioskOrderDetail,
    showLatestTransaction,
    showPlayerShareXpValue,
    stakingRewardXpData,
    QualificationSettingData,
    isInvitationPopupShown,
    getLiveNotificationData,
    showMore,
    newBuySellForm,
  } = authenticationData

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    playerList,
    isGetSelectedPlayerSuccess,
    showFanClubList,
    getPlayerDetailsSuccessData,
    isGetEANftsBalanceSuccess,
  } = playerCoinData

  const [isTabHidden, setTabHidden] = useState(false)

  const { disconnect } = useContext(ConnectContext)

  const handleNavigation = useCallback(
    e => {
      const window = e.currentTarget
      if (y > window.scrollY) {
        setNavigationStatus(true)
      } else if (y < window.scrollY) {
        setNavigationStatus(false)
      }
      setY(window.scrollY)
    },
    [y],
  )

  useEffect(() => {
    setY(window.scrollY)
    window.addEventListener('scroll', handleNavigation)
    if (!window.location.href.includes('/app')) {
      ;['Light', 'Dark', 'Gold', 'Ladies', 'Black'].forEach(theme =>
        document.body.classList.remove(theme),
      )
      dispatch(
        selectedTheme({
          selectedThemeRedux: 'Dark',
        }),
      )
    }

    return () => {
      window.removeEventListener('scroll', handleNavigation)
    }
  }, [handleNavigation])

  // useEffect(() => {
  //   $('#applayoutId').last().addClass(['app-layout-wrapper'])
  //   setTimeout(() => {
  //     $('#applayoutId').removeClass('app-layout-wrapper')
  //   }, 1000)
  // }, [])
  const handleSubmit = async () => {
    dispatch(showSignupForm())
  }

  const handleClose = () => {
    if (showPlayerShareXpValue) {
      dispatch(showPlayerShareXp({ showPlayerShareXpValue: false }))
      return
    }
    console.log({ stakingRewardXpData })
    if (stakingRewardXpData) {
      dispatch(resetStakingRewardXp())
    }
    if (showFanClubList) {
      dispatch(setShowNewDraftPopupRedux({ showFanClubList: false }))
      return
    }
    if (showLatestTransaction) {
      dispatch(showLatestTrade({ showLatestTransaction: false }))
      dispatch(resetLatestTrade())
      return
    }
    if (isSignupFormVisible) {
      dispatch(showSignupForm())
      dispatch(resetSentEmailVerification())
    } else if (isWalletFormVisible) {
      dispatch(showWalletForm({}))
    } else if (isPurchaseFormVisible) {
      publish('resumeTicker')
      setTabHidden(false)
      dispatch(showPurchaseForm({}))
      if (getPlayerDetailsSuccessData) {
        dispatch(
          getPlayerShares({
            playerContract: getPlayerDetailsSuccessData?.playercontract,
          }),
        )
      }
    } else if (isStakingFormVisible) {
      dispatch(showStakingForm({}))
    } else if (isNftFormVisible) {
      dispatch(resetNftData())
      dispatch(showNftForm({}))
      if (localStorage.getItem('previousPath') === 'nftView') {
        localStorage.removeItem('previousPath')
      }
    } else if (isPlayerSelectionFormVisible) {
      dispatch(showPlayerSelectionForm())
    } else if (isPayForItemVisible) {
      dispatch(togglePayForItem({ visible: false }))
    } else if (invalidDevice) {
      dispatch(
        userEmail({
          invalidDevice: false,
        }),
      )
    } else if (walletConnectConfirmPopUp) {
      console.log('showing_connect_confirm4')
      dispatch(walletConnectCheck({ walletConnectConfirmPopUp: false }))
      disconnect()
    } else if (showChangeSecret) {
      dispatch(handleChangeSecret(false))
    } else if (showKioskItemDetails) {
      dispatch(showKioskItemDetail({ showKioskItemDetails: false }))
      dispatch(resetPostFulfillKioskOrder())
      dispatch(resetPostUploadFile())
    } else if (showKioskItemDetailsBuy) {
      dispatch(showKioskItemDetail({ showKioskItemDetailsBuy: false }))
      dispatch(resetPostFulfillKioskOrder())
      dispatch(resetPostUploadFile())
    }
  }

  const handlePurchaseOpen = (value: string) => {
    if (
      !localStorage.getItem('loginInfo') &&
      !localStorage.getItem('loginId')
    ) {
      dispatch(showSignupForm())
    } else {
      dispatch(
        showPurchaseForm({
          mode: value.toUpperCase(),
          playerData: playerData,
        }),
      )
    }
  }

  const handleCreditCardSelect = (value: string) => {
    // if (value === 'hide') {
    //   setTabHidden(true)
    // } else {
    //   setTabHidden(false)
    // }
  }

  const handlePlayerSelect = (index: number) => {
    dispatch(getSelectedPlayer(playerList[index].playercontract))
    dispatch(showPlayerSelectionForm())
  }

  useEffect(() => {
    if (isGetSelectedPlayerSuccess) {
      dispatch(getSelectedPlayerDone())
      console.log('test1x')
      if (window.location.href.includes('/app')) {
        navigate('/app/player-dashboard')
      } else {
        navigate('/player-dashboard')
      }
    }
  }, [isGetSelectedPlayerSuccess])

  useEffect(() => {
    if (
      isSignupFormVisible ||
      isWalletFormVisible ||
      isPurchaseFormVisible ||
      isStakingFormVisible ||
      isNftFormVisible ||
      isPlayerSelectionFormVisible
    ) {
      document.body.style.overflow = 'hidden'
      if (isMobile()) {
        document.body.style.position = 'fixed'
      }
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
    }
    if (
      localStorage.getItem('isPlayerSelectionFormVisible') &&
      !isPlayerSelectionFormVisible
    ) {
      dispatch(getPlayerSelection())
    }
  }, [
    isSignupFormVisible,
    isWalletFormVisible,
    isPurchaseFormVisible,
    isStakingFormVisible,
    isNftFormVisible,
    isPlayerSelectionFormVisible,
  ])

  useEffect(() => {
    // if (type == 'popup') { // type should be updated
    //   $('body').css('overflow', 'hidden')
    // } else {
    //   $('body').css('overflow', 'auto')
    // }
    if (
      showKioskItemDetails ||
      showKioskItemDetailsBuy ||
      showLatestTransaction ||
      showPlayerShareXpValue
      // showWalletForm
    ) {
      $('body').css('overflow', 'hidden')
    } else {
      $('body').css('overflow', 'auto')
    }
  }, [
    showKioskItemDetails,
    showKioskItemDetailsBuy,
    showLatestTransaction,
    showPlayerShareXpValue,
    // showWalletForm,
  ])

  const [showHeader, setShowHeader] = useState(false)

  useEffect(() => {
    // window.addEventListener('scroll', function () {
    //   const yScrollPosition = window.scrollY
    //   if (yScrollPosition >= 100) {
    //     setShowHeader(true)
    //   } else {
    //     setShowHeader(false)
    //   }
    // })
    const currentURL = window.location.href
    if (currentURL === '/' || currentURL.includes('/genesis')) {
      setShowHeader(false)
    } else {
      setShowHeader(true)
    }
  }, [])

  useEffect(() => {
    if (
      getLiveNotificationData.length > 0 &&
      !showMore &&
      window.location.pathname !== '/'
    ) {
      console.log('setShowMore1', showMore)
      dispatch(setShowMore(true))
    }
  }, [getLiveNotificationData])

  return (
    <div id="applayoutId">
      {/*
          GEN6: found out that in built onClose in Header component below on line number
          338 is working for NFt details. 
        */}
      {showMore &&
        window.location.pathname !== '/app/notifications' &&
        window.location.pathname !== '/' && (
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
                marginBottom: isMobile() ? '115px' : '50px',
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
                marginBottom: isMobile() ? '70px' : '',
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
        )}
      {!window.location.href.includes('/app') ||
      (isInvitationPopupShown && isMobile()) ? (
        <LandingHeader showHeader={showHeader} />
      ) : (
        <Header
          className={classnames(headerStatus)}
          headerClassName={classnames(headerClass)}
        />
      )}
      {isPlayerSelectionFormVisible && (
        <PlayerModal
          isOpen={isPlayerSelectionFormVisible}
          playerList={playerList}
          onClose={handleClose}
          onClick={handlePlayerSelect}
        />
      )}
      {(isSignupFormVisible || invalidDevice) && !noModal && (
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
      {showFanClubList && (
        <DialogBox
          isOpen={showFanClubList}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <FanClubList onClose={handleClose} />
        </DialogBox>
      )}
      {showLatestTransaction && (
        <DialogBox
          isOpen={showLatestTransaction}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <LatestTradeInfo />
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
      {isPurchaseFormVisible && (
        <DialogBox
          isOpen={isPurchaseFormVisible}
          onClose={handleClose}
          contentClass=""
          closeBtnClass="close-purchase"
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          {!isTabHidden && (
            <TabGroup
              defaultTab={isPurchaseFormVisible}
              tabSet={[t('buy').toUpperCase(), t('sell').toUpperCase()]}
              getSwitchedTab={handlePurchaseOpen}
            />
          )}
          {isPurchaseFormVisible === 'SELL' ? (
            newBuySellForm ? (
              <NewSellForm playerData={playerData} onClosePopup={handleClose} />
            ) : (
              <SellNftForm playerData={playerData} onClosePopup={handleClose} />
            )
          ) : newBuySellForm ? (
            <NewBuyForm
              playerData={playerData}
              onClosePopup={handleClose}
              onSelectCreditCard={handleCreditCardSelect}
            />
          ) : (
            <BuyNftForm
              playerData={playerData}
              onClosePopup={handleClose}
              onSelectCreditCard={handleCreditCardSelect}
            />
          )}
        </DialogBox>
      )}
      {isStakingFormVisible && (
        <DialogBox
          isOpen={isStakingFormVisible}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <StakedForm playerData={playerData} />
        </DialogBox>
      )}
      {isNftFormVisible && (
        <DialogBox
          isOpen={isNftFormVisible}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
          contentClass={isMobile() ? 'bg-secondary-color' : ''}
        >
          <NftView nft={nft} />
        </DialogBox>
      )}
      {/* 
        GEN5: POPUP FOR GENESIS NFT ( MOBILE ONLY; NFT object passed through 'showGenesisNftForm')
        is passed to GenesisNftView as genesisNftItemData)
        GenesisNftView utilizes tokenId from genesisNftItemData to fetch Genesis NFT details & show on popup
      */}
      {isGenesisNftFormVisible && (
        <DialogBox
          isOpen={isGenesisNftFormVisible}
          onClose={handleClose} // NOT WORKING
          parentClass={isMobile() ? 'flex-dialog' : ''}
          contentClass={isMobile() ? 'bg-secondary-color' : ''}
        >
          <GenesisNftView genesisNftItemData={genesisNft} />
        </DialogBox>
      )}
      {showPlayerShareXpValue && (
        <DialogBox
          isOpen={showPlayerShareXpValue}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
          contentClass={isMobile() ? 'bg-secondary-color' : ''}
        >
          <ClaimPlayerShareXp />
        </DialogBox>
      )}
      {(showKioskItemDetails || showKioskItemDetailsBuy) && (
        <DialogBox
          isOpen={showKioskItemDetails || showKioskItemDetailsBuy}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
          contentClass={classnames(
            'create-item-dilog',
            isMobile() ? 'bg-secondary-color no-scroll-vert' : '',
          )}
        >
          <>
            {/* <div className={classnames('kiosk_title')}>
              Order {KioskOrderDetail?.order}
            </div> */}
            <div className={classnames('rounded-corners')}>
              {showKioskItemDetailsBuy ? (
                <KioskItemDetail />
              ) : (
                <KioskOrderDetailForm />
              )}
            </div>
          </>
        </DialogBox>
      )}
      {isPayForItemVisible && (
        <DialogBox
          isOpen={isPayForItemVisible}
          onClose={handleClose}
          parentClass={classnames(
            'zIndex-999',
            isMobile() ? 'flex-dialog' : '',
          )}
          contentClass={classnames(
            'create-item-dilog',
            isMobile() ? 'bg-secondary-color2' : '',
          )}
        >
          <div className={classnames('dilog-container-mob')}>
            <PayForItems />
          </div>
        </DialogBox>
      )}
      {showChangeSecret && (
        <DialogBox
          isOpen={showChangeSecret}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <ChangeSecretForm />
        </DialogBox>
      )}
      <div className={classnames('content-wrap', className)}>
        <div
          className={classnames('container', isMobile() ? containerClass : '')}
        >
          {children}
        </div>
      </div>
      {!noPageFooter ? (
        <div
          className={classnames(
            'bottom row',
            pageFooterClass,
            hasShadow ? 'bottom-shadow' : '',
            selectedThemeRedux === 'Black' ? 'footer-black' : '',
          )}
          style={
            {
              // borderRadius: '0px',
              // backgroundColor: location.pathname.includes('player/')
              //   ? '#171923'
              //   : '#12131C',
              // backgroundColor: hasShadow ? '#222435' : '#12131C',
            }
          }
        >
          <div>
            <div className="bottom-line"></div>
            <SocialGroup showAppInstallOption={true} />
            <div className="bottom-line"></div>
            <span className="blog-title company-title h-2">meCarreira.com</span>
            <span className="blog-content company-content pg-lg">
              {t('Empower your football journey and turn your passion')}
            </span>
            <ContactUs isFooter={true} />
            <div className="bottom-line"></div>
            <div className="blog-content copyright pg-lg">
              © {new Date().getFullYear()} meCarreira.com
            </div>
            <div className="genesis-pweredby-ticket">
              <img src="/img/poweredby.webp" alt="matic-icon"></img>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <Footer
        className={classnames(footerStatus)}
        navigationStatus={navigationStatus}
      />
      <TurnStileWidget />
    </div>
  )
}

export default AppLayout
