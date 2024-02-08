import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import PlayerDashboardForm from './PlayerDashboardForm'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import { useDispatch, useSelector } from 'react-redux'
import {
  getPlayerData,
  setDefaultSelectedPlayer,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { RootState } from '@root/store/rootReducers'
import {
  getWalletDetails,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { initTagManager, isMobile } from '@utils/helpers'
import Header from '@pages/NewLanding/Header'
import classNames from 'classnames'

const LandingPlayerDashboard: React.FC = () => {
  const dispatch = useDispatch()

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { playerList, isGetPlayerSuccess } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const { isNoWallet, userName, walletDetailAddress, openMenu } =
    authenticationData
  useEffect(() => {
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
  }, [])

  useEffect(() => {
    // if (!openMenu) {
    //   console.log('fetching_player_data2')
    //   dispatch(getPlayerData({}))
    // }
    if (accessToken) {
      dispatch(getPlayerData({}))
    }
  }, [accessToken])

  useEffect(() => {
    if (userName) {
      if (accessToken && !walletDetailAddress) {
        dispatch(getWalletDetails()) // COMMENTED FOR PROD
      }
    }
  }, [userName])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

  useEffect(() => {
    if (isGetPlayerSuccess && playerList.length <= 1) {
      dispatch(setDefaultSelectedPlayer())
    }
  }, [isGetPlayerSuccess])

  return (
    <div className={classNames('content-wrap')}>
      <div className={classNames('container')}>
        <Header showHeader={true} />
        <PlayerDashboardForm />
      </div>
    </div>
  )
}

export default LandingPlayerDashboard
