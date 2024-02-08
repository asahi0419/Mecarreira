import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import Home from '@assets/icons/icon/home.webp'
import { RootState } from '@root/store/rootReducers'
import FooterNav from './FooterNav'
import { useNavigate } from 'react-router-dom'
import {
  showPlayerSelectionForm,
  showSignupForm,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import '@assets/css/layout/Footer.css'
import {
  getPlayerSelection,
  getPlayerSelectionDone,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { HOMEROUTE, PLAYER_STATUS } from '@root/constants'
import ImageComponent from '@components/ImageComponent'

interface Props {
  className?: string
  navigationStatus: boolean
}

const Footer: React.FC<Props> = ({ className, navigationStatus }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const [showMyCoin, setShowMyCoin] = useState(false)
  const [walletLogined, setWalletLogined] = useState(false)

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { isLoggedOut, stateAccessToken, fixedFooter } = authenticationData

  const playerCoinData: any = useSelector(
    (state: RootState) => state.playercoins,
  )
  const {
    selectedPlayer,
    playerList,
    isGetPlayerSelectionSuccess,
    allPlayersDataCheckStatus,
    allPlayersDataCheckStatusFan,
    allFanPlayersDataCheckStatus,
    getPlayerDetailsSuccessData,
  } = playerCoinData

  const showMyCoinEnabled = localStorage.getItem('showMyCoin')
  const location = useLocation()

  useEffect(() => {
    if (showMyCoinEnabled) {
      setShowMyCoin(true)
    }
  }, [showMyCoinEnabled])

  useEffect(() => {
    if (
      ((loginInfo || loginId) &&
        allPlayersDataCheckStatus.length > 0 &&
        allPlayersDataCheckStatus[0].playerstatusid &&
        (['Pending', 'Verified', 'Deployed'].includes(
          allPlayersDataCheckStatus[0]?.playerstatusid?.playerstatusname,
        ) ||
          allPlayersDataCheckStatus[0]?.playerstatusid?.id >= 4)) ||
      selectedPlayer?.playerstatusid?.id >= PLAYER_STATUS.PENDING ||
      allFanPlayersDataCheckStatus
    ) {
      setShowMyCoin(true)
      localStorage.setItem('showMyCoin', 'true')
    } else {
      setShowMyCoin(false)
      localStorage.removeItem('showMyCoin')
    }
  }, [allPlayersDataCheckStatus])

  useEffect(() => {
    if (isGetPlayerSelectionSuccess) {
      dispatch(getPlayerSelectionDone())
      if (playerList.length > 1) {
        dispatch(showPlayerSelectionForm())
      } else {
        if (allFanPlayersDataCheckStatus === 2) {
          if (window.location.href.includes('/app')) {
            navigate('/app/fan-player-dashboard')
          }
        } else if (allFanPlayersDataCheckStatus === 1) {
          // console.log('test2')
          if (window.location.href.includes('/app')) {
            navigate('/app/player-dashboard')
          }
        }
      }
    }
  }, [isGetPlayerSelectionSuccess])

  useEffect(() => {
    if (loginInfo !== null || loginId !== null) {
      setWalletLogined(true)
    }

    if (!loginInfo && isLoggedOut) {
      setShowMyCoin(false)
    }

    if (!loginInfo && !loginId) {
      setShowMyCoin(false)
      setWalletLogined(false)
    } else {
      if (
        (allPlayersDataCheckStatus.length > 0 &&
          (['Pending', 'Verified', 'Deployed'].includes(
            allPlayersDataCheckStatus[0]?.playerstatusid?.playerstatusname,
          ) ||
            allPlayersDataCheckStatus[0]?.playerstatusid?.id >= 4)) ||
        allFanPlayersDataCheckStatus
      ) {
        setShowMyCoin(true)
      }
    }
  }, [loginInfo, loginId, isLoggedOut, stateAccessToken])

  useEffect(() => {
    if (authenticationData.userName) {
      setWalletLogined(true)
    } else {
      if (!loginInfo && !loginId) {
        setWalletLogined(false)
      }
    }
  }, [authenticationData])

  const onClickPlayer = async () => {
    if (location.pathname !== '/all-players') {
      navigate('/app/all-players')
    }
  }

  const onClickMyCoin = async () => {
    dispatch(getPlayerSelection())
  }

  const onClickNFTs = () => {
    if (location.pathname !== '/nfts') {
      navigate('/app/nfts')
    }
  }

  const onClickItems = () => {
    if (location.pathname !== '/kiosk') {
      navigate('/app/kiosk')
    }
  }

  const onClickSignin = () => {
    if (!loginId && walletLogined === false) {
      dispatch(showSignupForm())
    }
  }

  const onClickWallet = () => {
    dispatch(showWalletForm({}))
  }

  const onClickScouts = () => {
    if (location.pathname !== '/scouts') {
      navigate('/app/scouts')
    }
  }

  return (
    <footer
      className={classnames(
        'footer',
        className,
        navigationStatus || fixedFooter ? '' : 'navigation-status',
      )}
    >
      <div className="footer-wrapper">
        <div className={classnames('home-icon')}>
          <a onClick={() => navigate(HOMEROUTE)}>
            <ImageComponent
              loading="lazy"
              src={Home}
              alt=""
              className="home-img"
            />
          </a>
        </div>
        <div className="footer-nav">
          <FooterNav
            onClickPlayer={onClickPlayer}
            onClickMyCoin={onClickMyCoin}
            onClickNFTs={onClickNFTs}
            onClickItems={onClickItems}
            onClickScouts={onClickScouts}
            onClickSignin={onClickSignin}
            onClickWallet={onClickWallet}
            showMyCoin={showMyCoin}
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer
