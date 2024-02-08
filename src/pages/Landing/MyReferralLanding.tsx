import React, { useState, useCallback, useEffect, useContext } from 'react'
import classnames from 'classnames'

import { Header, Footer } from '@components/index'
import LandingHeader from '@pages/NewLanding/Header'
import ContactUs from '../../components/Page/Navigation/ContactUs'
import { useTranslation } from 'react-i18next'
import PlayerModal from '@pages/Landing/PlayerModal'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import $ from 'jquery'
import { RootState } from '@root/store/rootReducers'
import {
  setActiveTab,
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
} from '@root/apis/playerCoins/playerCoinsSlice'
import { isMobile } from '@utils/helpers'
import PayForItems from '@pages/Wallet/MyWallet/PayForItems'
import WalletConnectConfirm from '@components/Page/WalletConnectConfirm'
import SocialGroup from '../../components/Page/Navigation/SocialGroup'
import ChangeSecretForm from '@pages/Landing/UserSettings/Components/ChangeSecretForm'
import { default as KioskOrderDetailForm } from '../../components/Card/KioskOrderDetail'
import KioskItemDetail from '../../components/Card/KioskItemDetail'
import { ConnectContext } from '@root/WalletConnectProvider'
import { resetNftData } from '@root/apis/gallery/gallerySlice'
import Tutorials from './Tutorials'
import DraftedPlayers from './DraftedPlayers'
import classNames from 'classnames'
import VersusPlayers from './VersusPlayers'
import RatedPlayers from './RatedPlayers'
import Collectibles from './Collectibles'
import Kiosk from './Kiosk'
import Trending from './Trending'
import PlayerCarousel from './PlayerCarousel'
import HeaderTicker from './HeaderTicker'
import WalletModal from '@components/Dialog/WalletModal'
interface Props {
  children?: React.ReactNode
  className?: string
  headerStatus?: string
  headerClass?: string
  containerClass?: string
  footerStatus?: string
  noPageFooter?: boolean
  pageFooterClass?: string
}
let referralOnboardTime = null
const MyReferralLanding: React.FC<Props> = ({
  children,
  className,
  headerStatus,
  headerClass,
  containerClass,
  footerStatus,
  noPageFooter,
  pageFooterClass,
}) => {
  const [y, setY] = useState(window.scrollY)
  const [navigationStatus, setNavigationStatus] = useState(true)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    isSignupFormVisible,
    isWalletFormVisible,
    isPurchaseFormVisible,
    isStakingFormVisible,
    isNftFormVisible,
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
  } = authenticationData

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { playerList, isGetSelectedPlayerSuccess } = playerCoinData

  const [isTabHidden, setTabHidden] = useState(false)

  const { disconnect } = useContext(ConnectContext)
  const [showWalletModalNew, setShowWalletModalNew] = useState(false)
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

    return () => {
      window.removeEventListener('scroll', handleNavigation)
    }
  }, [handleNavigation])

  const locationParam = useLocation()

  useEffect(() => {
    $('#applayoutId').last().addClass(['app-layout-wrapper'])
    clearTimeout(referralOnboardTime)
    referralOnboardTime = setTimeout(() => {
      $('#applayoutId').removeClass('app-layout-wrapper')
      $('#referralRegisterBtn').trigger('click')
    }, 10000)
  }, [])
  const handleSubmit = async () => {
    console.log('test1')
    dispatch(showSignupForm())
  }

  const handleClose = () => {
    if (isSignupFormVisible) {
      console.log('test2')
      dispatch(showSignupForm())
      dispatch(resetSentEmailVerification())
    } else if (isWalletFormVisible) {
      dispatch(showWalletForm({}))
    } else if (isPurchaseFormVisible) {
      setTabHidden(false)
      dispatch(showPurchaseForm({}))
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
      console.log('showing_connect_confirm3')
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
      console.log('test3')
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
    if (value === 'hide') {
      setTabHidden(true)
    } else {
      setTabHidden(false)
    }
  }

  const handlePlayerSelect = (index: number) => {
    dispatch(getSelectedPlayer(playerList[index].playercontract))
    dispatch(showPlayerSelectionForm())
  }

  useEffect(() => {
    if (isGetSelectedPlayerSuccess) {
      dispatch(getSelectedPlayerDone())
      console.log('test3')
      navigate('/player-dashboard')
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
    if (showKioskItemDetails || showKioskItemDetailsBuy) {
      $('body').css('overflow', 'hidden')
    } else {
      $('body').css('overflow', 'auto')
    }
  }, [showKioskItemDetails, showKioskItemDetailsBuy])

  // useEffect(() => {
  //   dispatch(showSignupForm())
  //   dispatch(setActiveTab('register'))
  // }, [])
  const handleSignup = () => {
    if (
      !localStorage.getItem('loginInfo') &&
      !localStorage.getItem('loginId')
    ) {
      console.log('test4')
      dispatch(showSignupForm())
      dispatch(setActiveTab('register'))
    }
  }

  return (
    <div id="applayoutId">
      <Header
        className={classnames(headerStatus)}
        headerClassName={classnames(headerClass)}
      />
      <section className="header-ticker-section">
        <HeaderTicker />
      </section>
      {isPlayerSelectionFormVisible && (
        <PlayerModal
          isOpen={isPlayerSelectionFormVisible}
          playerList={playerList}
          onClose={handleClose}
          onClick={handlePlayerSelect}
        />
      )}
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
            <SellNftForm playerData={playerData} onClosePopup={handleClose} />
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
      {(showKioskItemDetails || showKioskItemDetailsBuy) && (
        <DialogBox
          isOpen={showKioskItemDetails || showKioskItemDetailsBuy}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
          contentClass={isMobile() ? 'bg-secondary-color' : 'dilog-wrapper'}
        >
          <>
            <div className={classnames('kiosk_title')}>
              Order {KioskOrderDetail?.order}
            </div>
            <div className={classnames('dilog-container', 'rounded-corners')}>
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
          contentClass={isMobile() ? 'bg-secondary-color' : ''}
        >
          <PayForItems />
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
      {showWalletModalNew && walletConnectConfirmPopUp === false && (
        <WalletModal
          isOpen={showWalletModalNew && walletConnectConfirmPopUp === false}
          onClick={() => setShowWalletModalNew(false)}
          onClose={() => setShowWalletModalNew(false)}
        />
      )}
      0
      <div className={classNames('app-landing-container')}>
        <button
          id="referralRegisterBtn"
          style={{ visibility: 'hidden' }}
          onClick={handleSignup}
        ></button>
        <section className="header-ticker-section">
          <HeaderTicker />
        </section>
        <section className={classNames('new-launches-nft')}>
          <PlayerCarousel showWalletModalNew={setShowWalletModalNew} />
        </section>
        <section className="players-trending-section">
          <Trending />
        </section>
        <section className="kiosk-section">
          <Kiosk />
          <div className="border-section"></div>
        </section>
        <section className={classNames('collectibles-section')}>
          <Collectibles />
          <div className="border-section"></div>
        </section>
        <section className="rated-players-section">
          <RatedPlayers />
          <div className="border-section"></div>
        </section>
        <section className={classNames('versus-players-section')}>
          <VersusPlayers />
          <div className="border-section"></div>
        </section>
        <section className="drafted-players-section">
          <DraftedPlayers />
          <div className="border-section"></div>
        </section>
        <section className="tutorials-section">
          <Tutorials />
          <div className="border-section"></div>
        </section>
      </div>
      {!noPageFooter ? (
        <div
          className={classnames('bottom', pageFooterClass)}
          style={{
            borderRadius: '0px',
            backgroundColor: location.pathname.includes('player/')
              ? '#171923'
              : '#12131C',
          }}
        >
          <div>
            <div className="bottom-line"></div>
            <SocialGroup />
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
    </div>
  )
}

export default MyReferralLanding
