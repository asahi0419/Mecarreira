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
  getHeaderBalance,
  getWalletDetails,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { initTagManager } from '@utils/helpers'

const PlayerDashboard: React.FC = () => {
  const dispatch = useDispatch()

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { playerList, isGetPlayerSuccess } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const {
    isNoWallet,
    userName,
    walletDetailAddress,
    openMenu,
    qualifiedInviteLinked,
    isGetHeaderBalanceSuccess,
  } = authenticationData
  useEffect(() => {
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
  }, [])

  useEffect(() => {
    if (!openMenu) {
      console.log('fetching_player_data1')
      dispatch(getPlayerData({}))
    }
    if (qualifiedInviteLinked && !isGetHeaderBalanceSuccess) {
      dispatch(getHeaderBalance())
    }
  }, [])

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
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <PlayerDashboardForm />
    </AppLayout>
  )
}

export default PlayerDashboard
