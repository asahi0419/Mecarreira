/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState, memo } from 'react'
import TabGroup from '@components/Page/TabGroup'
import CreateSecret from './CreateSecret'
import MyWallet from './MyWallet'
import PlayerCoins from './PlayerCoins'
import { useDispatch, useSelector } from 'react-redux'
import Nfts from './Nfts'
import { RootState } from '@root/store/rootReducers'
import {
  getWalletAddress,
  getWalletDetails,
  getCurrencyList,
  getUserSettings,
} from '@root/apis/onboarding/authenticationSlice'
import classNames from 'classnames'

const WalletForm: React.FC = () => {
  const currentURL = window.location.href
  const includesGenesis = currentURL.includes('/genesis')
  const includeLanding = !window.location.href.includes('/app')

  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(
    includesGenesis ? 'genesis by mecarreira' : 'balance',
  )
  const [isSecretForm, toggleSecretForm] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [isChartView, setIsChartView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    isWalletCreatedSuccess,
    userWalletData,
    walletLoading,
    isNoWallet,
    walletNotSetup,
    selectedThemeRedux,
    getUserSettingsLoader,
  } = authenticationData
  const loginInfo = localStorage.getItem('loginInfo')
  const accessToken = localStorage.getItem('accessToken')

  const handleGetTab = (tab: string) => {
    // dispatch(getWalletDetails())
    setActiveTab(tab)
  }
  //  GET_WALLET_API_NOT_TO_BE_USED_NOW
  React.useEffect(() => {
    if (accessToken) {
      if (loginInfo) {
        dispatch(getWalletAddress(loginInfo))
      } else {
        dispatch(getWalletDetails())
      }
    }
  }, [isWalletCreatedSuccess, loginInfo, accessToken])

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500)
    dispatch(getCurrencyList())
    dispatch(getUserSettings())
    return () => {
      if (document.getElementById('walletModalContent')) {
        document.getElementById('walletModalContent').style.width = '375px'
        document.getElementById('walletModalContent').style.height = '790px'
      }
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'balance') {
      toggleSecretForm(false)
      if (!authenticationData.userName && loginInfo) setIsWalletOpen(true)
      else setIsWalletOpen(false)
    }
    if (!isChartView || activeTab === 'genesis') {
      setIsChartView(false)
      if (document.getElementById('walletModalContent')) {
        document.getElementById('walletModalContent').style.width = '375px'
        document.getElementById('walletModalContent').style.height = '790px'
      }
    }
  }, [activeTab])

  const handleSecretSubmit = () => {
    toggleSecretForm(!isSecretForm)
    setIsWalletOpen(!isWalletOpen)
  }

  const handleWalletSubmit = () => {
    console.log('')
  }

  return (
    <section className="wallet-container">
      {!isChartView && (
        <div className="fullwidth">
          {isNoWallet &&
          !localStorage.getItem('loginInfo') &&
          !localStorage.getItem('loginId') ? (
            ''
          ) : (
            <TabGroup
              defaultTab={activeTab}
              tabSet={
                includeLanding
                  ? ['balance', 'genesis by mecarreira']
                  : ['balance', 'shares', 'genesis']
              }
              inactiveIndices={!userWalletData?.address ? [1, 2] : []}
              // fullWidth={includeLanding && !includesGenesis ? true : false}
              transformIndices={includesGenesis ? [1] : []}
              tabClassName="wallet-tab"
              getSwitchedTab={handleGetTab}
            />
          )}
        </div>
      )}
      {activeTab === 'shares' ? (
        <PlayerCoins
          isChartView={isChartView}
          onChartView={() => setIsChartView(!isChartView)}
        />
      ) : activeTab === 'balance' ? (
        <>
          {walletLoading || !isLoaded ? (
            <div className={classNames('wallet-spinner')}>
              <div className="wallet-activity-wrapper">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              </div>
            </div>
          ) : !userWalletData?.address && walletNotSetup ? (
            <CreateSecret onSubmit={handleSecretSubmit} />
          ) : (
            <MyWallet
              onSubmit={handleWalletSubmit}
              isChartView={isChartView}
              onChartView={() => setIsChartView(!isChartView)}
            />
          )}
        </>
      ) : (
        <Nfts />
      )}
    </section>
  )
}

export default memo(WalletForm)
