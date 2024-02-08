/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, useContext, useCallback } from 'react'
import SearchBar from '@components/SearchBar'
import PlayerItem from './PlayerItem'
import DialogBox from '@components/Dialog/DialogBox'
import StakedForm from './StakedForm'
import { isMobile } from '@utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchPlayersBalance,
  resetPlayersBalance,
  getPlayerDetails,
} from '@root/apis/playerCoins/playerCoinsSlice'
import {
  getPlayerCoinChart,
  resetStakingRewardXp,
  showPurchaseForm,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { getUsdRate } from '@root/apis/purchase/purchaseSlice'
import {
  fetchPlayerCoinStats,
  fetchPlayersStatsHT,
} from '@root/apis/playerStats/playerStatsSlice'
import SendAsset from '../MyWallet/SendAsset'
import { ConnectContext } from '@root/WalletConnectProvider'
import {
  sendMaticsReset,
  showStakingForm,
} from '@root/apis/onboarding/authenticationSlice'
import { ethers } from 'ethers'
import MultiChart from '@components/MultiChart'
import PeriodBar from '@components/PeriodBar'
import classnames from 'classnames'
// mui
import { Dialog } from '@material-ui/core'
import Stack from '@mui/material/Stack'
// css
import '@assets/css/pages/Wallet.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import debounce from 'lodash.debounce'
import { useWalletHelper } from '@utils/WalletHelper'
let intervalId: any = null
let usdRateInterval: any = null
interface Props {
  onChartView: any
}

const PlayerCoins: React.FC<Props> = ({ onChartView }) => {
  const [showFormPopup, setShowFormPopup] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [optedId, setOptedId] = useState(NaN)
  const [traverseTokens, setTraverseTokens] = useState([])
  const [isSendCoin, setSendCoin] = useState<boolean>(false)
  const [isLoadingMatic, setLoadingMatic] = useState(false)
  const [playerDetails, setPlayerDetails] = useState(null)
  const [txnHash, setTxnHash] = useState('')
  const [txnError, setTxnError] = useState('')
  const [stakee, setStakee] = useState(-1)
  const [sendData, setSendData] = useState<any>(null)
  const [chartView, setChartView] = useState(false)
  const [xAxisData, setXAxisData] = useState<any>([])
  const [series, setSeries] = useState([])
  const [coinAction, setCoinAction] = useState('')
  const [chartPeriod, setChartPeriod] = useState('7D')
  const dispatch = useDispatch()
  const loginInfo = localStorage.getItem('loginInfo')
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerCoinStatsData, fetchPlayerStatsRateDataHT } =
    playerStatsData
  const { t } = useTranslation()
  const {
    fetchBalancePlayersProgress,
    fetchBalancePlayersSuccess,
    fetchBalancePlayersData,
    fetchBalancePlayersError,
    isStakingOnlySelected,
    getPlayerDetailsSuccessData,
  } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    userWalletData: { address },
    playerCoinChartData,
    isGetPlayerCoinChartSuccess,
    loadingChart,
    stakingRewardXpData,
    selectedThemeRedux,
  } = authenticationData
  const { token = [] } = fetchBalancePlayersData

  const { sendTokenWithWallet } = useWalletHelper()

  const getCount = () => {
    if (chartPeriod === '7D') return 7
    else if (chartPeriod === '1M') return 30
    else if (chartPeriod === '3M') return 30 * 3
    else if (chartPeriod === '1Y') return 1 * 365
    else if (chartPeriod === 'YTD') {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 0)
      const diff = now.getTime() - start.getTime()
      const oneDay = 1000 * 60 * 60 * 24
      return Math.floor(diff / oneDay)
    } else if (chartPeriod === 'ALL') return 99999
    else return 12
  }

  useEffect(() => {
    if (chartPeriod === 'ALL') {
      dispatch(getPlayerCoinChart('all=true'))
    } else {
      const date_min = new Date()
      date_min.setDate(date_min.getDate() - getCount())
      dispatch(
        getPlayerCoinChart('date_min=' + date_min.toISOString().substr(0, 10)),
      )
    }
  }, [chartPeriod])

  const handleClose = (event: any) => {
    event.stopPropagation()
    if (stakingRewardXpData) {
      dispatch(resetStakingRewardXp())
    }
    setShowFormPopup(false)
    setStakee(-1)
    const reqParams = {
      address: loginInfo || address,
    }
    dispatch(fetchPlayersBalance(reqParams))
  }

  const handleStake = (item: any, playerItem: any) => {
    clearInterval(usdRateInterval)
    setPlayerDetails(playerItem)
    dispatch(showWalletForm({}))
    dispatch(
      showStakingForm({
        playerData: playerItem,
      }),
    )
  }
  const handleSearch = (value: string | undefined) => {
    const traverseTemp: any = []
    let i: number
    const filter = value?.toUpperCase()

    for (i = 0; i < token?.length; i++) {
      if (token[i]?.name?.toUpperCase()?.indexOf(filter) > -1) {
        traverseTemp?.push(token[i])
      } else {
        traverseTemp?.filter((item: any) => item?.name === token[i]?.name)
      }
    }
    setTraverseTokens(traverseTemp)
  }
  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])
  useEffect(() => {
    if (isGetPlayerCoinChartSuccess) {
      const seriesValues: any = []
      let data: any = []
      let xAxisDataValues: any = []
      for (const player in playerCoinChartData) {
        if (playerCoinChartData[player][0]?.playername === 'Matic') {
          continue
        }
        data = []
        xAxisDataValues = []
        playerCoinChartData[player].forEach((item: any) => {
          data.push(item.balanceusd ?? 0)
          xAxisDataValues.push(item?.dateintime)
        })
        seriesValues.push({
          name: playerCoinChartData[player][0]?.playername,
          type: 'line',
          data: data.reverse(),
        })
      }
      setXAxisData(xAxisDataValues.reverse())
      setSeries(seriesValues)
    }
  }, [isGetPlayerCoinChartSuccess])

  useEffect(() => {
    if (traverseTokens.length > 0 && !playerDetails) {
      const tokensSet: any = traverseTokens.map((item: any) => item?.contract)
      dispatch(
        fetchPlayersStatsHT({
          contracts: tokensSet,
          query: 'simple',
        }),
      )
      clearInterval(usdRateInterval)
      usdRateInterval = setInterval(() => {
        dispatch(
          fetchPlayersStatsHT({
            contracts: tokensSet,
            query: 'simple',
          }),
        )
      }, 20000)
    }
  }, [traverseTokens, playerDetails])

  const handleGetPriceStats = () => {
    const playersSet: number[] = token.map((item: any) => item?.contract)
    if (playersSet?.length > 0) {
      dispatch(fetchPlayerCoinStats(playersSet))
    }
  }

  useEffect(() => {
    dispatch(getUsdRate())
    return () => {
      clearInterval(intervalId)
      clearInterval(usdRateInterval)
      // dispatch(resetPlayersBalance())
      // if (document.getElementById('walletModalContent')) {
      //   document.getElementById('walletModalContent').style.width = '375px'
      //   document.getElementById('walletModalContent').style.height = '790px'
      //   document.getElementsByClassName('wallet-container')[0].style.height =
      //     '100%'
      // }
    }
  }, [])

  useEffect(() => {
    const reqParams = {
      address: loginInfo || address,
    }
    clearInterval(intervalId)
    setTraverseTokens([])
    dispatch(fetchPlayersBalance(reqParams))
  }, [isStakingOnlySelected])

  useEffect(() => {
    if (token?.length > 0) {
      if (!hasCompleted) {
        handleGetPriceStats()
        setHasCompleted(true)
      }
      clearInterval(intervalId)
      intervalId = setInterval(() => {
        handleGetPriceStats()
      }, 20000)
      setTraverseTokens(token)
    }
  }, [token])

  useEffect(() => {
    clearInterval(usdRateInterval)
    clearInterval(intervalId)
    if (!document.hidden) {
      if (traverseTokens.length > 0 && !playerDetails) {
        usdRateInterval = setInterval(() => {
          const tokensSet: any = traverseTokens.map(
            (item: any) => item?.contract,
          )
          dispatch(
            fetchPlayersStatsHT({
              contracts: tokensSet,
              query: 'simple',
            }),
          )
        }, 20000)
      }
      if (token?.length > 0) {
        intervalId = setInterval(() => {
          handleGetPriceStats()
        }, 20000)
      }
    }
  }, [document.hidden])

  const onMoreClick = (checked: boolean, id: number) => {
    if (checked) {
      setOptedId(id)
    } else {
      setOptedId(NaN)
    }
  }
  const getStatData = (playerContract: any) => {
    let index = null
    if (fetchPlayerCoinStatsData && fetchPlayerCoinStatsData.length > 0) {
      index = fetchPlayerCoinStatsData?.findIndex((item: any) => {
        if (item.player && playerContract) {
          return (
            ethers.utils.getAddress(item?.player) ===
            ethers.utils.getAddress(playerContract)
          )
        } else {
          return -1
        }
      })
      if (index > -1) {
        return {
          coin_issued: fetchPlayerCoinStatsData[index]?.coin_issued,
          matic: fetchPlayerCoinStatsData[index]?.matic,
          usd_rate: fetchPlayerCoinStatsData[index]?.exchangeRateUSD?.rate,
        }
      } else {
        return {
          coin_issued: '', //fetchPlayerCoinStatsData[0]?.coin_issued,
          matic: '', //fetchPlayerCoinStatsData[0]?.matic,
          usd_rate: '', //fetchPlayerCoinStatsRateData[0]?.exchangeRateUSD?.rate,
        }
      }
    }

    return {
      coin_issued: '000',
      matic: '000',
      usd_rate: '000',
    }
  }

  const handleContainerClick = (evt: any) => {
    evt.preventDefault()
    setOptedId(NaN)
  }

  useEffect(() => {
    if (getPlayerDetailsSuccessData && ['BUY', 'SELL'].includes(coinAction)) {
      dispatch(showWalletForm({}))
      dispatch(
        showPurchaseForm({
          mode: coinAction,
          playerData: getPlayerDetailsSuccessData,
        }),
      )
    }
  }, [getPlayerDetailsSuccessData])

  const handlePlayerCallback = (val: string, data: any) => {
    setCoinAction(val.toUpperCase())
    console.log('data_being_stored_in_variable_before_buy', { val, data })
    if (val === 'send') {
      setSendCoin(true)
      setSendData(data)
    } else if (val === 'buy' || val === 'sell') {
      if (data?.detailpageurl) {
        dispatch(getPlayerDetails(data?.detailpageurl))
      }
    }
  }

  useEffect(() => {
    console.log('send_data_changed:', { sendData })
  }, [sendData])

  const handleCloseSecret = () => {
    setSendCoin(false)
    setSendCoin(false)
  }

  const handleCloseBottomPopup = () => {
    setLoadingMatic(false)
    setSendCoin(false)
    setTxnHash('')
    setTxnError('')
    // setSendData(null)
    const reqParams = {
      address: loginInfo || address,
    }
    dispatch(fetchPlayersBalance(reqParams))
  }

  const handleFetchTransactionData = (data: any) => {
    setTxnHash('')
    setTxnError('')
    setLoadingMatic(true)
    if (loginInfo) {
      sendTokenWithWallet(
        data.to_address,
        sendData.contract,
        data.amount,
        loginInfo,
        (txnHash: any) => {
          setLoadingMatic(false)
          setTxnHash(txnHash)
        },
        (err: any) => {
          setLoadingMatic(false)
          const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
          if (err.message === '406') {
            setTxnError(t('this functionality unavailable for internal users'))
          }
          if (isErrorGasEstimation) {
            setTxnError(t('not enough funds to pay for blockchain transaction'))
          } else {
            setTxnError(err.reason || err.message)
          }
        },
      )
    } else {
      dispatch(sendMaticsReset())
    }
  }

  const handleSelectForStake = (coin: any, index: number) => {
    setStakee(index)
  }

  const handleChartView = () => {
    if (!isMobile()) {
      if (!chartView) {
        document.getElementById('walletModalContent').style.width =
          window.innerWidth >= 800 ? '60%' : `${window.innerWidth - 65}px`
        document.getElementById('walletModalContent').style.height = '70vh'
      } else {
        document.getElementById('walletModalContent').style.width = '375px'
        document.getElementById('walletModalContent').style.height = '790px'
        document.getElementsByClassName('wallet-container')[0].style.height =
          '100%'
      }
    }
    setTimeout(() => setChartView(!chartView), chartView ? 0 : 500)
    onChartView()
  }

  return (
    <>
      <div className="wallet-player-coins" style={{ width: '100%' }}>
        {!chartView && (
          <SearchBar
            isSwitchEnabled={true}
            mode="wallet"
            onEdit={optimizedHandleSearch}
            onClose={() => handleSearch('')}
            isFilterDisabled
          />
        )}
        {showFormPopup ? (
          <DialogBox
            isOpen={showFormPopup}
            onClose={handleClose}
            contentClass=""
            closeBtnClass="close-purchase"
          >
            <StakedForm playerData={playerDetails} />
          </DialogBox>
        ) : null}
        {isSendCoin ? (
          <SendAsset
            mode="playercoin"
            playerData={sendData}
            isOpen={isSendCoin}
            onSend={handleFetchTransactionData}
            onCloseSend={handleCloseSecret}
            onClose={handleCloseBottomPopup}
            txnError={txnError}
            txnHash={txnHash}
            isLoadingMatic={isLoadingMatic}
          />
        ) : null}
        {chartView ? (
          <div>
            {!isMobile() && (
              <div className="chart-modal-body-content">
                <Stack direction={'column'} justifyContent="center">
                  {loadingChart ? (
                    <div
                      className="balance-progress"
                      style={{ width: '100%', height: 'calc(60vh - 50px)' }}
                    >
                      <div
                        className={classnames(
                          'loading-spinner-container mt-80',
                          'show',
                        )}
                      >
                        <div className="loading-spinner">
                          <div className="spinner"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {series.length > 0 ? (
                        <div className="chart">
                          <MultiChart
                            xAxisData={xAxisData}
                            series={series}
                            chartOption={'Balance'}
                          />
                        </div>
                      ) : (
                        <div
                          className="blog-title yellow-color mt-30"
                          style={{ width: '100%', height: '300px' }}
                        >
                          {t('no data yet')}
                        </div>
                      )}
                    </>
                  )}
                  <PeriodBar
                    chartPeriod={chartPeriod}
                    setChartPeriod={setChartPeriod}
                  />
                </Stack>
              </div>
            )}
          </div>
        ) : (
          <div
            className={classNames(
              'dlg-content border-top m-0',
              'token-wrapper',
            )}
            style={{
              height: isMobile() ? 'calc(100vh - 190px)' : '560px',
              padding: isMobile() ? '0px 10px' : 'unset',
            }}
            onClick={handleContainerClick}
          >
            {traverseTokens?.length > 0 ? (
              traverseTokens?.map((item: any, index: number) => (
                <PlayerItem
                  isSendOpen={isSendCoin}
                  item={item}
                  activeIndex={stakee}
                  key={index}
                  index={index}
                  statData={getStatData(item?.contract)}
                  handleStake={(playerDetails: any) =>
                    handleStake(item, playerDetails)
                  }
                  handleMoreClick={checked => onMoreClick(checked, index)}
                  isOpted={optedId === index}
                  playerItemcallBack={(value: string) =>
                    handlePlayerCallback(value, item)
                  }
                  usdRate={fetchPlayerStatsRateDataHT.rate}
                  onStake={() => handleSelectForStake(item, index)}
                  onCancelStake={() => setStakee(-1)}
                />
              ))
            ) : (
              <div
                className="checkout-loader-wrapper"
                style={{ height: '100%', overflowX: 'hidden' }}
              >
                {((fetchBalancePlayersProgress &&
                  !fetchBalancePlayersSuccess) ||
                  !fetchPlayerCoinStatsData?.length) &&
                !fetchBalancePlayersError ? (
                  <>
                    {fetchBalancePlayersSuccess &&
                    traverseTokens?.length === 0 ? (
                      <div className="drafts-no-action-container no-new-draft heading-title unverified-alert">
                        <div>{t('no player coins found')}</div>
                      </div>
                    ) : (
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="drafts-no-action-container no-new-draft heading-title unverified-alert">
                    <div>{t('no player coins found')}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <Dialog
          open={chartView && isMobile()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={'md'}
          className="chart-dialog"
        >
          <div className="chart-modal-body">
            <div className="chart-modal-body-content">
              <Stack direction={'column'} justifyContent="center">
                {series.length > 1 ? (
                  <div className="chart">
                    <MultiChart
                      xAxisData={xAxisData}
                      series={series}
                      chartOption={'Balance'}
                    />
                    <PeriodBar
                      chartPeriod={chartPeriod}
                      setChartPeriod={setChartPeriod}
                    />
                  </div>
                ) : (
                  <div
                    className="blog-title yellow-color mt-30"
                    style={{ width: '700px', height: '300px' }}
                  >
                    {t('no data yet')}
                  </div>
                )}
                <div
                  className="mobile-back-button chart-back-button"
                  onClick={handleChartView}
                >
                  <ArrowBackIcon />
                </div>
              </Stack>
            </div>
          </div>
        </Dialog>
        {chartView ? (
          <div className="chart-back-button" onClick={handleChartView}>
            <ArrowBackIcon />
          </div>
        ) : (
          <div className="chart-view-button" onClick={handleChartView} />
        )}
      </div>
    </>
  )
}

export default PlayerCoins
