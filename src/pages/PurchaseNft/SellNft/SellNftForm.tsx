/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'
import classnames from 'classnames'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Web3 from 'web3'
import SearchInput from '@components/Form/SearchInput'
import { getCircleColor, sleep, truncateDecimals } from '@utils/helpers'
import WalletIcon from '@assets/icons/icon/wallet.webp'
import { Input } from '@components/Form'
import Spinner from '@components/Spinner'
import PurchaseSummary from '../components/PurchaseSummary'
import PurchaseButton from '../components/PurchaseButton'
import '@assets/css/pages/PurchaseNft.css'
import SubmitButton from '@components/Button/SubmitButton'
import { useDispatch, useSelector } from 'react-redux'
import {
  balanceOfAllowance,
  checkTradingStatus,
  getUserXp,
  getWalletDetails,
  setActiveTab,
  showSignupForm,
  showWalletForm,
  tradingStatusExternal,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import classNames from 'classnames'
import {
  fetchSinglePlayerStats,
  resetStatsError,
  fetchSinglePlayer24hStats,
  resetSinglePlayersStats,
} from '@root/apis/playerStats/playerStatsSlice'
import { isMobile } from '@utils/helpers'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import {
  fetchPlayersBalance,
  getPlayer1Contract,
  getTxnConfirm,
  initPlayer1ContractStatus,
  resetTxnConfirmationData,
  sellTokens,
  sellPlayerCoinsInCurrency,
  approveTradeCurrency,
  approveProExchange,
  getPlayerDetails,
  setTxnConfirmSuccess,
  setTxnConfirmError,
  getDefaultMatic,
} from '@root/apis/playerCoins/playerCoinsSlice'
import BottomPopup from '@components/Dialog/BottomPopup'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import { getFlooredFixed } from '@utils/helpers'
import {
  IsDevelopment,
  POLYGON_NETWORK_RPC_URL,
  BASE_EXPLORE_URL,
} from '@root/constants'
import ApprovePaymentOptionPrompt from '../components/ApprovePaymentOptionPrompt'
import SellOptions from '../components/SellOptions'
import ImageComponent from '@components/ImageComponent'
import ArrowDownFilled from '@components/Svg/ArrowDownFilled'
import ArrowUpFilled from '@components/Svg/ArrowUpFilled'
import PlayerImage from '@components/PlayerImage'
import { ConnectContext } from '@root/WalletConnectProvider'
import { useWalletHelper } from '@utils/WalletHelper'
interface Props {
  playerData?: any
  onClosePopup: any
}

const sellNftInterval: any = null
let txnCheckInterval: any = null
let player24hChangeSell: any = null
let timeout: any = null

const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
} as React.CSSProperties

const DefaultSell = props => {
  const {
    walletType,
    isLoadingMatic,
    txnHash,
    txnError,
    handleAbortPurchase,
    txnConfirmResp,
    isTxnChecking,
    handleCloseBottomPopup,
    getInstance,
  } = props
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux, generalSettingsData } = authenticationData

  // const privyDialogRef = useRef(null)
  // useEffect(() => {
  //   const handleMutations = mutationsList => {
  //     mutationsList.forEach(mutation => {
  //       if (mutation.type === 'childList') {
  //         const privyDialog = document.getElementById('privy-dialog')
  //         if (privyDialog) {
  //           privyDialogRef.current = privyDialog
  //         }
  //         const privyDialogExist = privyDialogRef.current
  //         if (privyDialogExist) {
  //           if (!document.body.contains(privyDialogExist)) {
  //             handleCloseBottomPopup()
  //           }
  //         }
  //       }
  //     })
  //   }
  //   const observer = new MutationObserver(handleMutations)
  //   observer.observe(document.body, { childList: true, subtree: true })
  //   return () => {
  //     observer.disconnect()
  //   }
  // }, [])

  return (
    <section className="new-draft vertical-flex buy-fly">
      {walletType ? (
        <>
          <ImageComponent
            loading="lazy"
            src={
              walletType === 'Metamask'
                ? MetamaskIcon
                : walletType === 'Privy'
                ? WalletIcon
                : CoinbaseIcon
            }
            className="draftee-metamaskicon"
            alt="metamask-icon"
          />
          {walletType === 'Privy' ? (
            <div className="input-label approve-blockchain internal-mechanism-note">
              {t('sending_transaction_to_the_blockchain')}
            </div>
          ) : (
            <div className="input-label approve-blockchain">
              {t('please approve the blockchain transaction') +
                ' ' +
                walletType}
            </div>
          )}
        </>
      ) : (
        <div>
          <ImageComponent
            loading="lazy"
            src={WalletIcon}
            className="draftee-metamaskicon"
            alt="metamask-icon"
          />
        </div>
      )}
      {isLoadingMatic && !txnHash && !txnError ? (
        <div className="checkout-loader-wrapper draftee-propmt mt-40">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <div className="close-button" onClick={handleAbortPurchase}>
            {t('close')}
          </div>
        </div>
      ) : (
        <>
          {txnHash ? (
            <div
              style={{ height: '50px' }}
              className={classNames(
                'add-draftee-success',
                'web3action-success',
                'mt-20',
              )}
            >
              <div className="check-container-txn">
                <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                {txnConfirmResp.length === 0 ? (
                  <div className={classNames('spinner check-spinner')}></div>
                ) : (
                  <>
                    {txnConfirmResp[0]?.haserror === 0 ? (
                      <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                    ) : (
                      <CancelOutlinedIcon className="response-icon error-icon" />
                    )}
                  </>
                )}
              </div>
              <span>{t('transaction sent')}</span>
              {txnConfirmResp.length > 0 ? (
                <span
                  style={{
                    fontSize: isMobile() ? '20px' : '17px',
                    margin: 'unset',
                  }}
                  className={classNames(
                    txnConfirmResp[0]?.haserror === 0
                      ? 'txn-confirm-success'
                      : 'txn-confirm-error',
                  )}
                >
                  {!isTxnChecking && txnConfirmResp[0]?.haserror === 0
                    ? t('transaction confirmed')
                    : !isTxnChecking && txnConfirmResp[0]?.haserror === 1
                    ? t('transaction failed')
                    : ''}
                </span>
              ) : (
                <span
                  style={{
                    fontSize: isMobile() ? '20px' : '17px',
                    color: 'var(--primary-text-color)',
                  }}
                >
                  {t('confirming transaction') + '...'}
                </span>
              )}
              {txnHash && (
                <a
                  className="tx-link button-box"
                  href={`${BASE_EXPLORE_URL}/tx/${txnHash}`}
                  target="_blank"
                >
                  {t('show transaction')}
                </a>
              )}
            </div>
          ) : (
            <div className="txn-err-wrapper">
              <CancelOutlinedIcon className="response-icon error-icon" />
              <span>{t('transaction failed')}</span>
              <div className="input-feedback">{txnError}</div>
            </div>
          )}
          <div
            className={classNames('close-button')}
            onClick={handleCloseBottomPopup}
          >
            {t('close')}
          </div>
        </>
      )}
      <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
    </section>
  )
}

const SellNftForm: React.FC<Props> = ({ playerData = null, onClosePopup }) => {
  const walletType = localStorage.getItem('wallet')
  const dispatch = useDispatch()
  const location: any = useLocation()
  const { t } = useTranslation()
  const [paymentMode, setPaymentMode] = useState('')
  const [showCurrencyApprovalPrompt, setShowCurrencyApprovalPrompt] =
    useState(false)
  const [askForApprovalPro, setAskForApprovalPro] = useState(false)
  const [isSearchEnabled, setSearchEnabled] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [totalSum, setTotalSum] = useState('0')
  const [stopCalculation, setStopCalculation] = useState(false)
  const [playerInfo, setPlayerInfo] = useState<any>({})
  const [inProgress, setInProgress] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [inputAmount, setInputAmount] = useState('1')
  const [sellClicked, setSellClicked] = useState(false)
  const [txnHash, setTxnHash] = useState('')
  const [txnError, setTxnError] = useState('')
  const [maxCoins, setMaxCoins] = useState('')
  const [toBuy, setToBuy] = useState(false)
  const [maxSelected, setMaxSelected] = useState(false)
  const [isLoadingMatic, setIsLoadingMatic] = useState(false)
  const [localPlayerData, setLocalPlayerData] = useState<any>(null)
  const [showApiBottomPopup, setShowApiBottomPopup] = useState(false)
  const [showApproveBtn, setShowApproveBtn] = useState(false)
  const [paymentOptionsTest, setPaymentOptionsTest] = useState(
    new Array(4).fill(null),
  )
  const [WETHTotalSum, setWETHTotalSum] = useState('')
  const [WBTCTotalSum, setWBTCTotalSum] = useState('')
  const [USDTTotalSum, setUSDTTotalSum] = useState('')
  const [USDCTotalSum, setUSDCTotalSum] = useState('')
  const [Ticker, setTicker] = useState('')
  const [contract, setContract] = useState('')
  const [inputChanged, setInputChanged] = useState('')
  const [isDone, setDone] = useState(false)
  const [originalPrice, setOriginalPrice] = useState<any>('')
  // const [usdTotal, setUsdTotal] = useState('')

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    fetchBalancePlayersData,
    isTxnChecking,
    txnConfirmResp,
    routerabi,
    routerContract,
    wmatic,
    paymentOptionsSell,
    player2contract,
    player2contractabi,
    proxyContract,
    proxyContractAbi,
    approvePaymentOptionSuccess,
    purchaseContractLoading,
    getPlayerDetailsSuccessData,
    sellInCurrencyTxnHash,
    purchaseFormDefaultMatic,
  } = playerCoinData
  const { token = [] } = fetchBalancePlayersData
  const {
    fetchSinglePlayerStatsSell,
    fetchSinglePlayerStatsError,
    fetchSinglePlayer24hStatsData,
    isProgress,
  } = playerStatsData
  const {
    loader,
    userWalletData: { address },
    generalSettingsData,
    balanceOfAllowanceData,
    checkTradingStatusLoader,
    checkTradingStatusData,
  } = authenticationData
  const { getTxnStatus } = useContext(ConnectContext)
  const { getWeb3Provider } = useWalletHelper()

  const percentageRef = useRef<any>(null)
  const [isApproveRefresh, setApproveRefresh] = useState(false)
  const userWalletAddressUnder = localStorage.getItem('userWalletAddress')

  const inputRef: any = useRef(null)

  const handleWrapperClick = () => {
    // Set the cursor focus on the input field
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }
  const getPercentageEst = (player: any) => {
    let oldNumber: any = null,
      newNumber: any = null
    if (player) {
      oldNumber = player['24h_change'] * player?.exchangeRateUSD['24h_rate']
      newNumber = player['matic'] * player?.exchangeRateUSD['rate']
      const decreaseValue = oldNumber - newNumber
      const percentage = (Math.abs(decreaseValue) / oldNumber) * 100
      return {
        oldNumber,
        newNumber,
        percentage: percentage,
      }
    }
    return {
      oldNumber: 0,
      newNumber: 0,
      percentage: 0.0,
    }
  }
  const handlePercentageAnimation = () => {
    if (percentageRef?.current?.classList[1] === 'profit') {
      percentageRef?.current?.classList.remove('profit')
    } else if (percentageRef?.current?.classList[1] === 'loss') {
      percentageRef?.current?.classList.remove('loss')
    }
  }

  const sellWalletProxyApprove = async (payObject: any) => {
    setSellClicked(true)
    setApproveRefresh(true)
    if (walletType) {
      setIsLoadingMatic(true)
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        player1contract || player2contract, // contract address of Router
        player2contractabi || player1contractabi, //  contract abi of Router
        provider.getSigner(loginInfo!),
      )

      try {
        const options = {
          amountIn: ethers.utils.parseEther(
            '115792089237316195423570985008687907853269984665640564039457.584007913129639935',
          ),
        }
        const tx = await playerContract.approve(
          proxyContract,
          options.amountIn,
          {
            gasLimit: ethers.utils.hexlify(1000000),
          },
        )
        setTxnHash(tx.hash)
      } catch (err: any) {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      }
    } else {
      setPaymentMode('approve')
      setContract(payObject?.contract)
      setTicker(payObject?.ticker)
      setToBuy(false)
      setShowApiBottomPopup(true)
    }
  }
  useEffect(() => {
    handlePercentageAnimation()
  }, [fetchSinglePlayer24hStatsData])

  useEffect(() => {
    if (sellInCurrencyTxnHash) {
      setTxnHash(sellInCurrencyTxnHash)
    }
  }, [sellInCurrencyTxnHash])

  useEffect(() => {
    console.log('PAYOPT', { balanceOfAllowanceData, paymentOptionsSell })
    if (balanceOfAllowanceData && paymentOptionsSell.length > 0) {
      const temp = paymentOptionsSell.map(item => {
        return {
          ...item,
          isMethodApproved:
            balanceOfAllowanceData[item.ticker].allowance > 0 ? true : false,
          availableBalance: balanceOfAllowanceData[item.ticker].balanceof,
        }
      })
      setPaymentOptionsTest(temp)
    }
  }, [paymentOptionsSell, balanceOfAllowanceData])

  const checkApprovedWrapper = async () => {
    if (loginInfo) {
      for (let i = 0; i < paymentOptionsSell.length; i++) {
        checkApproved(paymentOptionsSell[i], i)
      }
    } else if (loginId) {
      dispatch(
        balanceOfAllowance({
          spender: generalSettingsData?.proxy_contract_coins,
        }),
      )
    }
  }

  const checkApproved = async (el, ind) => {
    // console.log('checkApproved', el?.ticker)
    const ticker = el?.ticker
    if (walletType) {
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        player1contract || player2contract, // contract address of Router
        player1contractabi || player2contractabi, //  contract abi of Router
        provider.getSigner(loginInfo!),
      )

      try {
        const tx = await playerContract.allowance(loginInfo, proxyContract)
        const number = parseInt(tx._hex)
        const testData: any = paymentOptionsTest
        testData[ind] = {
          ...el,
          isMethodApproved: number > 0 ? true : false,
        }
        console.log('PAYOPT1', { testData })
        setPaymentOptionsTest(testData)
        setApproveRefresh(false)
      } catch (err: any) {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      }
    } else {
      console.log('CHECKAPPROVED_NO_RUN_FOR_INTERNAL_USER')
      // try {
      //   const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
      //     POLYGON_NETWORK_RPC_URL,
      //   )
      //   const playerContract = new ethers.Contract(
      //     player1contract || player2contract, // contract address of Router
      //     player1contractabi || player2contractabi,
      //     simpleRpcProvider.getSigner(userWalletAddressUnder!),
      //   )
      //   const balanceTx = await playerContract.balanceOf(userWalletAddressUnder)
      //   let balance: any = null
      //   if (ticker === 'WBTC') {
      //     balance = parseInt(balanceTx._hex) / 100000000
      //   } else {
      //     balance = parseInt(balanceTx._hex) / 1000000000000000000
      //   }
      //   const balance1 = balance.toString()
      //   const tx = await playerContract.allowance(
      //     userWalletAddressUnder,
      //     proxyContract,
      //   )
      //   const number = parseInt(tx._hex)
      //   const testData: any = paymentOptionsTest
      //   testData[ind] = {
      //     ...el,
      //     isMethodApproved: number > 0 ? true : false,
      //     availableBalance: balance1,
      //   }
      //   setPaymentOptionsTest(testData)
      // } catch (err: any) {
      //   setTxnError(err.reason || err.message)
      // }
    }
  }

  useEffect(() => {
    if (paymentOptionsSell.length > 0) {
      checkApprovedWrapper()
    }
  }, [paymentOptionsSell])

  const {
    isGetPlayer1ContractSuccess,
    isGetPlayer1ContractError,
    player1contract,
    player1contractabi,
  } = useSelector((state: RootState) => state.playercoins)
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const userWalletAddress = localStorage.getItem('userWalletAddress')

  const handleClose = () => {
    setSearchEnabled(false)
  }

  const isFundsInsufficient =
    parseFloat(maxCoins) === 0 ||
    parseFloat(maxCoins || '0') < parseFloat(totalSum)

  useEffect(() => {
    if (location) {
      setPlayerInfo(location?.state?.profileData)
    }
  }, [location])

  useEffect(() => {
    setLocalPlayerData(playerData)
  }, [playerData])

  useEffect(() => {
    calculateTotal()
  }, [fetchSinglePlayerStatsSell[0]])

  useEffect(() => {
    if (approvePaymentOptionSuccess) {
      if (paymentOptionsSell.length > 0) {
        checkApprovedWrapper()
      }
    }
  }, [approvePaymentOptionSuccess])

  useEffect(() => {
    const currentContract =
      localPlayerData?.playercontract || playerData?.playercontract
    const availableToken = token.findIndex(
      (item: any) =>
        ethers.utils.getAddress(item.contract) ===
        ethers.utils.getAddress(currentContract),
    )
    if (availableToken > -1) {
      const walletIndex = token.findIndex(
        (item: any) =>
          ethers.utils.getAddress(item.contract) ===
          ethers.utils.getAddress(playerData?.playercontract),
      )
      setMaxCoins(token[walletIndex].balance)
    } else {
      setMaxCoins('0.00')
    }
  }, [token])

  useEffect(() => {
    if (
      playerData?.playercontract &&
      parseFloat(inputAmount) > 0 &&
      inputChanged
    ) {
      dispatch(
        fetchSinglePlayerStats({
          contracts: [playerData.playercontract],
          query: 'RPC',
          formType: 'SELL',
          amount: parseFloat(inputAmount) > 0 ? inputAmount : 1,
        }),
      )
    }
  }, [inputAmount, inputChanged])

  useEffect(() => {
    dispatch(getDefaultMatic(playerData?.detailpageurl))
    getBuyDetails()
    if (localStorage.getItem('loginId')) {
      dispatch(getWalletDetails()) //COMMENTED FOR PROD
    }
    getMyBalance()
    // moved_out_of_settimeout_to_avoid_crashing_on_opening_sell_form
    dispatch(getPlayer1Contract({ url: playerData?.detailpageurl }))
    // setTimeout(() => {
    //   dispatch(getPlayer1Contract({ url: playerData?.detailpageurl }))
    // }, 1000)
    if (
      playerData?.playerstatusid?.id === 5 ||
      playerData?.playerlevelid === 5
    ) {
      if (walletType) {
        getisProPlayerCoinApproved()
      } else {
        getisProPlayerCoinApprovedInternal()
      }
    }
    // dispatch(getPlayerDetails(playerData?.detailpageurl))
    if (!getPlayerDetailsSuccessData) {
      dispatch(getPlayerDetails(playerData?.detailpageurl))
    }
    // if (!getPlayerDetailsSuccessData) {
    //   dispatch(getPlayerDetails(playerData?.detailpageurl))
    // }
    return () => {
      dispatch(resetSinglePlayersStats())
      clearInterval(sellNftInterval)
      clearInterval(txnCheckInterval)
      clearInterval(player24hChangeSell)
      dispatch(resetStatsError())
      dispatch(resetTxnConfirmationData())
    }
  }, [])

  const getisProPlayerCoinApprovedInternal = async () => {
    try {
      const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
        POLYGON_NETWORK_RPC_URL,
      )
      const playerContract = new ethers.Contract(
        player1contract, // contract address of Router
        player1contractabi, //  contract abi of Router
        simpleRpcProvider.getSigner(userWalletAddressUnder!),
      )
      const checkApprove = await playerContract.allowance(
        userWalletAddressUnder,
        routerContract,
      )
      const number = parseInt(checkApprove._hex)
      if (number > 0) {
        setShowApproveBtn(false)
      } else {
        setShowApproveBtn(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getisProPlayerCoinApproved = async () => {
    try {
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        player1contract, // contract address of Router
        player1contractabi, //  contract abi of Router
        provider.getSigner(loginInfo!),
      )
      const checkApprove = await playerContract.allowance(
        loginInfo,
        routerContract,
      )
      const number = parseInt(checkApprove._hex)
      if (number > 0) {
        setShowApproveBtn(false)
      } else {
        setShowApproveBtn(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (txnHash) {
      handleTxnCheck()
    }
  }, [txnHash]) // revert

  useEffect(() => {
    if (
      txnConfirmResp[0]?.haserror === 0 ||
      txnConfirmResp[0]?.haserror === 1
    ) {
      clearInterval(txnCheckInterval)
      if (isApproveRefresh) {
        setTimeout(() => {
          checkApprovedWrapper()
        }, 2000)
      }
    }
  }, [txnConfirmResp])

  const handleTxnCheck = () => {
    if (loginInfo) {
      getTxnStatus(txnHash)
        .then(txn => dispatch(setTxnConfirmSuccess(txn?.status)))
        .catch(() => dispatch(setTxnConfirmError()))
    } else {
      dispatch(getTxnConfirm(txnHash))
      txnCheckInterval = setInterval(() => {
        dispatch(getTxnConfirm(txnHash))
      }, 10000)
    }
  }

  const getMyBalance = () => {
    const reqParams = {
      address: loginInfo || address,
    }
    dispatch(fetchPlayersBalance(reqParams))
  }

  const handleGetPriceStats = () => {
    const localPlayerContract = [localPlayerData?.playercontract]
    if (localPlayerData?.playercontract) {
      dispatch(
        fetchSinglePlayerStats({
          contracts: localPlayerContract,
          query: 'RPC',
          formType: 'SELL',
          amount: parseFloat(inputAmount) > 0 ? inputAmount : 1,
        }),
      )
    }
  }

  useEffect(() => {
    if (localPlayerData?.playercontract) {
      handleGetPriceStats()
    }
  }, [localPlayerData])

  useEffect(() => {
    if (playerData?.playercontract) {
      handleGetPriceStats()
      clearInterval(sellNftInterval)
      dispatch(
        fetchSinglePlayer24hStats({ contracts: playerData.playercontract }),
      )
      clearInterval(player24hChangeSell)
      player24hChangeSell = setInterval(() => {
        dispatch(
          fetchSinglePlayer24hStats({ contracts: playerData.playercontract }),
        )
      }, 20000)
    }
  }, [playerData])

  useEffect(() => {
    clearInterval(txnCheckInterval)
    clearInterval(player24hChangeSell)
    if (!document.hidden) {
      if (txnHash) {
        handleTxnCheck()
      }
      if (playerData.playercontract) {
        player24hChangeSell = setInterval(() => {
          dispatch(
            fetchSinglePlayer24hStats({ contracts: playerData.playercontract }),
          )
        }, 20000)
      }
    }
  }, [document.hidden])

  const handleSell = async () => {
    if (loginId || loginInfo) {
      if (address || loginInfo || userWalletAddress) {
        setToBuy(true)
        setTxnError('')
        setTxnHash('')
        setStopCalculation(true)
      } else {
        toast.error(t('please create a wallet first'))
        await handleClosePopup()
        dispatch(showWalletForm({ isMandatory: true }))
      }
    } else {
      toast.error(t('please login to continue'))
      await handleClosePopup()
      dispatch(setActiveTab('login'))
      dispatch(showSignupForm())
    }
  }
  const expectedAmount = Ticker => {
    if (Ticker === 'WETH') {
      return WETHTotalSum
    } else if (Ticker === 'USDC') {
      return USDCTotalSum
    } else if (Ticker === 'USDT') {
      return USDTTotalSum
    } else if (Ticker === 'WBTC') {
      return WBTCTotalSum
    }
  }
  const handleSellApi = (user_secret: any) => {
    const formData = new FormData()
    if (paymentMode === '') {
      formData.append('contract', player1contract)
      formData.append('user_secret', user_secret)
      formData.append('amount', inputAmount)
      formData.append('matics', totalSum)
      dispatch(sellTokens(formData))
    } else if (paymentMode === 'sellInternal') {
      formData.append('user_secret', user_secret)
      formData.append('player_contract', player1contract)
      formData.append('amount', inputAmount)
      formData.append('ticker', Ticker)
      formData.append('expected_amount', expectedAmount(Ticker))
      dispatch(sellPlayerCoinsInCurrency(formData))
    } else if (paymentMode === 'approve') {
      formData.append('user_secret', user_secret)
      formData.append('player_contract', playerData?.playercontract)
      formData.append('currency_contract', contract)
      formData.append('form_type', 'SELL')
      dispatch(approveTradeCurrency(formData))
    } else if (paymentMode === 'approveInternalPro') {
      formData.append('user_secret', user_secret)
      formData.append('player_contract', playerData?.playercontract)
      dispatch(approveProExchange(formData))
    }
  }

  const sellforExternalWallet = async () => {
    console.log('sellforExternalWallet_called')
    if (walletType) {
      console.log('sellforExternalWallet_called1', walletType)
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        player1contract,
        player1contractabi,
        provider.getSigner(loginInfo!),
      )

      try {
        console.log('sellforExternalWallet2_called')
        const options = {
          _exp: Web3.utils.toWei(totalSum, 'ether'),
        }
        const tx = await playerContract.sellToken(
          ethers.utils.parseEther(inputAmount),
          options._exp,
          {
            gasLimit: 2000000,
          },
        )
        setLoading(false)
        console.log('sellTokenTx--', tx)
        setTxnHash(tx.hash)
      } catch (err: any) {
        console.log('sellforExternalWalletErr::', err)
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      }
    } else {
      setTxnError(t('this functionality unavailable for internal users'))
    }
  }
  const sellForExternalWalletProApprove = async () => {
    if (walletType) {
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        player1contract, // contract address of Router
        player1contractabi, //  contract abi of Router
        provider.getSigner(loginInfo!),
      )

      try {
        const tx = await playerContract.approve(
          routerContract,
          ethers.utils.parseEther(
            '115792089237316195423570985008687907853269984665640564039457.584007913129639935',
          ),
          {
            gasLimit: ethers.utils.hexlify(1000000),
          },
        )
        setTxnHash(tx.hash)
      } catch (err: any) {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      }
    } else {
      setTxnError(t('this functionality unavailable for internal users'))
    }
  }
  const sellForExternalWalletPro = async () => {
    if (walletType) {
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        routerContract, // contract address of Router
        routerabi, //  contract abi of Router
        provider.getSigner(loginInfo!),
      )
      try {
        const options = {
          amountIn: ethers.utils.parseEther(inputAmount),
          amountOutMin: ethers.utils.parseEther('0'),
          path: [player1contract, wmatic],
          to: loginInfo,
          deadline: Math.floor(Date.now() / 1000) + 60 * 60,
        }
        const { amountIn, amountOutMin, path, to, deadline } = options
        const tx = await playerContract.swapExactTokensForETH(
          amountIn,
          amountOutMin,
          path,
          to,
          deadline,
          {
            gasLimit: ethers.utils.hexlify(1000000),
          },
        )
        setLoading(false)
        setTxnHash(tx.hash)
      } catch (err: any) {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      }
    } else {
      setTxnError(t('this functionality unavailable for internal users'))
    }
  }

  useEffect(() => {
    if (isGetPlayer1ContractSuccess) {
      if (loginInfo && sellClicked) {
        if (
          playerData?.playerstatusid?.id === 5 ||
          playerData?.playerlevelid === 5
        ) {
          //
        } else {
          sellforExternalWallet()
        }
      }
      dispatch(initPlayer1ContractStatus())
      if (
        playerData?.playerstatusid?.id === 5 ||
        playerData?.playerlevelid === 5
      ) {
        if (walletType) {
          getisProPlayerCoinApproved()
        } else {
          getisProPlayerCoinApprovedInternal()
        }
      }
    }
    if (isGetPlayer1ContractError) {
      toast.error(t('loading player contract failed'))
      setLoading(false)
    }
  }, [isGetPlayer1ContractSuccess, isGetPlayer1ContractError])

  const handleClosePopup = () => {
    onClosePopup()
  }

  const calculateTotal = async () => {
    let total: any = 0
    if (fetchSinglePlayerStatsSell[0]?.matic) {
      if (inputAmount !== '0' && inputAmount !== '') {
        total =
          parseFloat(fetchSinglePlayerStatsSell[0]?.matic) *
          parseFloat(inputAmount)
      } else {
        total = parseFloat(fetchSinglePlayerStatsSell[0]?.matic) * 0
      }
    }
    const absTotal = parseFloat(total).toFixed(5)
    const WETHTotal = parseFloat(fetchSinglePlayerStatsSell[0]?.WETH).toFixed(8)
    const WBTCTotal = parseFloat(fetchSinglePlayerStatsSell[0]?.WBTC).toFixed(8)
    const USDTTotal = parseFloat(fetchSinglePlayerStatsSell[0]?.USDT).toFixed(8)
    const USDCTotal = parseFloat(fetchSinglePlayerStatsSell[0]?.USDC).toFixed(8)
    // setIsCalculating(true)
    // for (let i = 0; i < 2; i++) {
    //   await sleep(i * 1000)
    // }
    // setIsCalculating(false)
    setTotalSum(absTotal.toString())
    setWETHTotalSum(WETHTotal.toString())
    setWBTCTotalSum(WBTCTotal.toString())
    setUSDTTotalSum(USDTTotal.toString())
    setUSDCTotalSum(USDCTotal.toString())
  }

  const getBuyDetails = async () => {
    setInProgress(true)
    for (let i = 0; i < 2; i++) {
      await sleep(i * 1000)
    }
    setInProgress(false)
  }

  const getCallback = () => {
    if (playerData?.playercontract) {
      handleGetPriceStats()
    }
  }

  const handleAbortPurchase = () => {
    setInputAmount(inputAmount)
    setIsLoadingMatic(false)
    handleCloseToast()
  }

  const handleCloseBottomPopup = async () => {
    setInputAmount('1')
    if (
      playerData?.playerstatusid?.id === 5 ||
      playerData?.playerlevelid === 5
    ) {
      setSellClicked(false)
      setIsLoadingMatic(false)
      setTxnHash('')
      setTxnError('')
      if (
        playerData?.playerstatusid?.id === 5 ||
        playerData?.playerlevelid === 5
      ) {
        await dispatch(getPlayer1Contract({ url: playerData?.detailpageurl }))
        if (walletType) {
          getisProPlayerCoinApproved()
        } else {
          getisProPlayerCoinApprovedInternal()
        }
      }
      setToBuy(false)
      setSellClicked(false)
      setStopCalculation(false)
      getMyBalance()
    } else if (isApproveRefresh) {
      setSellClicked(false)
      setIsLoadingMatic(false)
      setTxnHash('')
      setTxnError('')
    } else {
      setSellClicked(false)
      clearInterval(txnCheckInterval)
      setTxnHash('')
      setTxnError('')
      handleCloseToast()
      getMyBalance()
    }
    dispatch(getPlayerDetails(playerData?.detailpageurl))
    dispatch(getDefaultMatic(playerData?.detailpageurl))
    dispatch(resetTxnConfirmationData())
  }

  const handleCloseToast = () => {
    setToBuy(false)
    setStopCalculation(false)
    setIsLoadingMatic(false)
    setSellClicked(false)
    setApproveRefresh(false)
  }

  // confetti
  const refAnimationInstance = useRef<any>(null)

  const getInstance = useCallback(instance => {
    refAnimationInstance.current = instance
  }, [])

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      })
  }, [])

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    makeShot(0.2, {
      spread: 60,
    })

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [makeShot])

  useEffect(() => {
    if (!isTxnChecking && txnConfirmResp[0]?.haserror === 0) {
      fire()
      dispatch(getUserXp(false))
    }
  }, [isTxnChecking, txnConfirmResp[0]])

  const onTradeSell = async el => {
    setSellClicked(true)
    if (walletType) {
      setIsLoadingMatic(true) // revert
    }
    if (el?.isMethodApproved) {
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        proxyContract, // contract address of Router
        proxyContractAbi, //  contract abi of Router
        provider.getSigner(loginInfo!), // signer of the currently logged in user wallet address
      )
      try {
        const options = {
          amount: ethers.utils.parseEther(inputAmount), //inputAmount,
          playerContract: player1contract || player2contract,
          buyOnBehalf: loginInfo,
          token: el?.ticker,
          poolFee: IsDevelopment ? (el?.ticker === 'USDT' ? 100 : 3000) : 0,
          exp: ethers.utils.parseEther(expectedAmount(el?.ticker)),
        }
        const tx = await playerContract.tradeSell(
          options.playerContract,
          options.token,
          options.amount,
          options.poolFee,
          options.exp,
          {
            gasLimit: ethers.utils.hexlify(1000000),
          },
        )
        setIsLoadingMatic(false)
        setTxnHash(tx.hash)
      } catch (err: any) {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      }
    }
  }

  const onSellForInternal = (el: any) => {
    setPaymentMode('sellInternal')
    setContract(playerData?.playercontract)
    setTicker(el?.ticker)
    setToBuy(false)
    setShowApiBottomPopup(true)
  }

  const handleBottomClose = () => {
    console.log('closedBottom')
    getMyBalance()
    setInputAmount('1')
    setShowApiBottomPopup(false)
    setStopCalculation(false)
    setSellClicked(false)
    if (approvePaymentOptionSuccess) {
      checkApprovedWrapper()
    }
    if (
      playerData?.playerstatusid?.id === 5 ||
      playerData?.playerlevelid === 5
    ) {
      if (walletType) {
        getisProPlayerCoinApproved()
      } else {
        getisProPlayerCoinApprovedInternal()
      }
    }
    dispatch(getDefaultMatic(playerData?.detailpageurl))
  }

  const onMaticSell = async () => {
    setStopCalculation(true)
    setToBuy(false)
    setTxnError('')
    setTxnHash('')
    if (loginInfo) {
      if (
        playerData?.playerstatusid?.id === 5 ||
        playerData?.playerlevelid === 5
      ) {
        try {
          setToBuy(true)
          setSellClicked(true)
          setIsLoadingMatic(true)
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            // sellForExternalWalletPro()
            sellforExternalWallet()
          }, 2000)
        } catch (error) {
          console.log(error)
          toast.error(t('Unknown Error'))
        }
      } else {
        setToBuy(true)
      }
    } else {
      setShowApiBottomPopup(true)
    }
    setSellClicked(true)
    if (walletType) {
      setIsLoadingMatic(true) // revert
    }
    dispatch(getPlayer1Contract({ url: playerData?.detailpageurl }))
  }

  const handleApproveMethod = () => {
    setAskForApprovalPro(false)
    if (loginInfo) {
      setToBuy(true)
      if (
        playerData?.playerstatusid?.id === 5 ||
        playerData?.playerlevelid === 5
      ) {
        sellForExternalWalletProApprove()
      }
    } else {
      setShowApiBottomPopup(true)
    }
    setSellClicked(true)
    if (walletType) {
      setIsLoadingMatic(true) // revert
    }
  }

  const rejectApproveProposal = () => {
    setStopCalculation(false)
    setToBuy(false)
    setShowCurrencyApprovalPrompt(false)
  }

  const handleApproveExchange = async () => {
    setShowCurrencyApprovalPrompt(false)
    if (walletType) {
      setIsLoadingMatic(true)
      setSellClicked(true)
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        player1contract || player2contract, // contract address of Router
        player2contractabi || player1contractabi, //  contract abi of Router
        provider.getSigner(loginInfo!),
      )
      try {
        const options = {
          amountIn: ethers.utils.parseEther(
            '115792089237316195423570985008687907853269984665640564039457.584007913129639935',
          ),
        }
        const tx = await playerContract.approve(
          routerContract,
          options.amountIn,
        )
        setTxnHash(tx.hash)
      } catch (err: any) {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      }
    } else {
      setPaymentMode('approveInternalPro')
      setToBuy(false)
      setShowApiBottomPopup(true)
    }
  }

  const fetchLiveTotalUsd = (value: string) => {
    return null
  }

  const getPricePercentageDifference = () => {
    const originalPrice1 = getPlayerDetailsSuccessData?.matic
    if (fetchSinglePlayerStatsSell.length > 0 && purchaseFormDefaultMatic) {
      const { exchangeRateUSD, matic_without_fee, matic } =
        fetchSinglePlayerStatsSell[0]
      // const { exchangeRateUSD, matic } = getPlayerDetailsSuccessData
      // const currentPrice = exchangeRateUSD?.rate * matic
      const currentPrice = matic_without_fee || matic
      const priceDiff = currentPrice - purchaseFormDefaultMatic
      const priceDiffPercentage: any =
        (priceDiff / purchaseFormDefaultMatic) * 100
      const re = new RegExp('^-?\\d+(?:.\\d{0,' + (3 || -1) + '})?')
      return priceDiffPercentage.toString().match(re)[0] || ''
    } else {
      return ''
    }
  }

  // const setPercentageDifference = () => {
  //   if (getPlayerDetailsSuccessData) {
  //     const { exchangeRateUSD, matic } = getPlayerDetailsSuccessData
  //     // const lastRecordedPrice: any = exchangeRateUSD?.rate * matic
  //     const lastRecordedPrice: any = matic
  //     setOriginalPrice(lastRecordedPrice)
  //   }
  // }

  useEffect(() => {
    if (getPlayerDetailsSuccessData) {
      if (!isDone) {
        setPercentageDifference()
        setDone(true)
      }
    }
  }, [getPlayerDetailsSuccessData])

  const setPercentageDifference = () => {
    if (getPlayerDetailsSuccessData) {
      const { exchangeRateUSD, matic } = getPlayerDetailsSuccessData
      const lastRecordedPrice: any = matic
      setOriginalPrice(lastRecordedPrice)
    }
  }

  useEffect(() => {
    if (fetchSinglePlayerStatsSell[0]) {
      setInProgress(false)
    }
  }, [fetchSinglePlayerStatsSell[0]])

  const checkTradingStatusExternal = async () => {
    dispatch(tradingStatusExternal({ loader: true, status: true }))
    const provider = await getWeb3Provider()
    const checkTrading = new ethers.Contract(
      player2contract, // contract address of Router
      player2contractabi, //  contract abi of Router
      provider.getSigner(loginInfo!),
    )
    try {
      const getTradingStatus = await checkTrading.isRunning()

      console.log('getTradingStatus', {
        getTradingStatus,
      })
      dispatch(
        tradingStatusExternal({ loader: false, status: getTradingStatus }),
      )
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    if (player2contract && player2contractabi) {
      if (localStorage.getItem('wallet') === 'Privy' && loginInfo) {
        dispatch(checkTradingStatus(player2contract))
      } else if (loginInfo) {
        checkTradingStatusExternal()
      }
    }
  }, [player2contract, player2contractabi])

  return (
    <div className="purchase-container">
      {!fetchSinglePlayerStatsError ? (
        <div
          className={classnames(
            'balance-progress',
            loader || inProgress ? '' : 'hidden',
          )}
        >
          <HotToaster />
          <div
            className={classnames(
              'loading-spinner-container mb-40 mt-40',
              'show',
            )}
          >
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      ) : null}
      {showApiBottomPopup && (
        <ApiBottomPopup
          showPopup={showApiBottomPopup}
          onSubmit={handleSellApi}
          onClose={handleBottomClose}
          paymentMode={paymentMode}
          customClass="purchase-pc-bottomwrapper"
        />
      )}
      <BottomPopup
        mode={`wallet ${isMobile() ? 'exwallet-bottomwrapper' : ''}`}
        isOpen={toBuy}
      >
        {showCurrencyApprovalPrompt ? (
          <div
            className="remove-adminplayer-prompt-wrapper"
            style={{ marginRight: '20px', marginLeft: '20px' }}
          >
            <div className="new-draft-title">
              {t(
                'are you sure you want to approve the exchange to access this token',
              )}
              ?
            </div>
            <div style={{ marginTop: '60px' }}>
              <SubmitButton
                title={t('yes')}
                className="m-0auto mt-20"
                onPress={() => handleApproveExchange()}
              />
              <SubmitButton
                title={t('no')}
                className="m-0auto mt-20 btn-disabled"
                onPress={() => rejectApproveProposal()}
              />
            </div>
          </div>
        ) : (
          <>
            {sellClicked ? (
              <DefaultSell
                walletType={walletType}
                isLoadingMatic={isLoadingMatic}
                txnHash={txnHash}
                txnError={txnError}
                handleAbortPurchase={handleAbortPurchase}
                txnConfirmResp={txnConfirmResp}
                isTxnChecking={isTxnChecking}
                handleCloseBottomPopup={handleCloseBottomPopup}
                getInstance={getInstance}
              />
            ) : (
              <SellOptions
                isLoadingMatic={isLoadingMatic}
                totalSum={totalSum}
                isFundsInsufficient={isFundsInsufficient}
                paymentOptionsTest={paymentOptionsTest}
                fetchSinglePlayerStatsData={fetchSinglePlayerStatsSell}
                inputAmount={inputAmount}
                currencies={{
                  WETHTotalSum,
                  USDCTotalSum,
                  USDTTotalSum,
                  WBTCTotalSum,
                }}
                proxyContract={proxyContract}
                proxyContractAbi={proxyContractAbi}
                player1contract={player1contract}
                player2contract={player2contract}
                loginInfo={loginInfo}
                onCloseMenu={handleCloseBottomPopup}
                onMaticSell={() => onMaticSell()}
                onTradeSell={onTradeSell}
                onApprove={sellWalletProxyApprove}
                onSellForInternal={onSellForInternal}
              />
            )}
          </>
        )}
      </BottomPopup>
      {askForApprovalPro ? (
        <ApprovePaymentOptionPrompt
          promptText={t('are you sure you want to approve matic')}
          onSuccess={() => {
            handleApproveMethod()
          }}
          onClose={() => {
            setAskForApprovalPro(false)
            setSellClicked(false)
          }}
        />
      ) : (
        <div
          className={classnames(
            'purchase-wrappper',
            (loader || inProgress) && !fetchSinglePlayerStatsError
              ? 'hidden'
              : '',
          )}
        >
          <div className="player-title-bar">
            {isSearchEnabled ? (
              <SearchInput
                type="text"
                placeholder={`${t('please enter the search words')}.`}
                className="in-menu-search purchase-search"
                onChange={() => {
                  return
                }}
                onClose={handleClose}
              />
            ) : (
              <>
                <div className="player-title-wrapper mt-20">
                  <ChevronRightIcon className="icon-color" />
                  <div>
                    {/* <ImageComponent
                      // src={
                      //   playerData?.playerpicturethumb ||
                      //   playerData?.playerpicture ||
                      //   playerInfo?.playerpicturethumb
                      // }
                      // src={playerData?.playerpicture || playerData?.instagram}
                      src={
                        playerData?.playerpicture ||
                        playerData?.instagram ||
                        playerData?.playerpicturethumb
                      }
                      alt="pic"
                    /> */}
                    <div
                      className="currency_mark_img"
                      style={{
                        background: getCircleColor(playerData?.playerlevelid),
                        alignItems: 'center',
                        width: '52px',
                        height: '52px',
                      }}
                    >
                      <PlayerImage
                        src={
                          playerData?.playerpicture ||
                          playerData?.instagram ||
                          playerData?.playerpicturethumb
                        }
                        className="img-radius_kiosk currency_mark"
                      />
                    </div>
                  </div>
                  <div className="player-text-container">
                    <h6>{playerData?.name || playerInfo?.name}</h6>
                    <h6>{playerData?.ticker}</h6>
                  </div>
                </div>
                {fetchSinglePlayer24hStatsData.length > 0 ? (
                  <div className="player-detail-pricechange">
                    {getPercentageEst(fetchSinglePlayer24hStatsData[0])
                      .oldNumber ===
                    getPercentageEst(fetchSinglePlayer24hStatsData[0])
                      .newNumber ? (
                      <ArrowUpFilled />
                    ) : getPercentageEst(fetchSinglePlayer24hStatsData[0])
                        .oldNumber <
                      getPercentageEst(fetchSinglePlayer24hStatsData[0])
                        .newNumber ? (
                      <ArrowUpFilled />
                    ) : (
                      <ArrowDownFilled />
                    )}
                    <div
                      style={{ fontSize: '24px' }}
                      className={classnames(
                        'number-color',
                        getPercentageEst(fetchSinglePlayer24hStatsData[0])
                          ?.oldNumber <=
                          getPercentageEst(fetchSinglePlayer24hStatsData[0])
                            ?.newNumber
                          ? 'profit'
                          : 'loss',
                      )}
                    >
                      {getFlooredFixed(
                        getPercentageEst(fetchSinglePlayer24hStatsData[0])
                          ?.percentage,
                        2,
                      )}
                      %
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
          <Formik
            enableReinitialize={true}
            initialValues={{ price: inputAmount }}
            onSubmit={async () => {
              handleSell()
            }}
            validationSchema={Yup.object().shape({
              price: Yup.string().required(t('required')),
            })}
          >
            {props => {
              const {
                values,
                touched,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
              } = props
              return (
                <form
                  onSubmit={(event: any) => event.preventDefault()}
                  autoComplete={'off'}
                >
                  <div className="purchase-form">
                    {/* <div className="form-label-wrapper">
                      <label htmlFor="playerPrice" className="capitalize">
                        {t('sell')}
                      </label>
                      {errors.price && touched.price && (
                        <div className="input-feedback purchase-error">
                          {errors.price}
                        </div>
                      )}
                    </div> */}
                    <div
                      className={classNames(
                        'purchase-input-container',
                        isCalculating || maxSelected ? 'input-disabled' : '',
                      )}
                      onClick={handleWrapperClick}
                    >
                      <Input
                        inputRef={inputRef}
                        id="sell_price"
                        name="price"
                        type={isMobile() ? 'number' : 'number'}
                        placeholder={t('amount')}
                        // value={parseFloat(values.price).toLocaleString()}
                        value={values.price}
                        onBlur={handleBlur}
                        // onBlur={event => {
                        //   if (inputAmount === '0' || inputAmount === '') {
                        //     setInputAmount('1')
                        //     setInputChanged('1')
                        //   }
                        //   handleBlur(event)
                        // }}
                        maxLength={20}
                        onChange={(event: any) => {
                          const value = event.target.value
                          const decimalMatch = value.match(/\.\d*$/)
                          if (decimalMatch && decimalMatch[0].length - 1 > 5) {
                            return
                          }

                          setInputChanged(value)
                          handleChange(event)
                          setInputAmount(value)
                        }}
                        className={classnames(
                          'input-box',
                          isCalculating || maxSelected ? 'input-disabled' : '',
                        )}
                        disabled={maxSelected}
                        onFocus={() => console.log('')}
                      />
                      <h6>{playerData?.ticker}</h6>
                    </div>
                    {values.price === maxCoins ? (
                      <div className="form-label-wrapper align-end">
                        <label
                          className="reset-txt"
                          onClick={() => {
                            setFieldValue('price', '1')
                            setInputAmount('1')
                            setMaxSelected(false)
                          }}
                        >
                          {t('clear')}
                        </label>
                      </div>
                    ) : (
                      <div className="form-label-wrapper align-end">
                        <label>{t('maximum coins to sell')}:</label>
                        {isProgress ? (
                          <label className="form-label-active skeleton" />
                        ) : (
                          <label
                            className="form-label-active"
                            onClick={() => {
                              setFieldValue('price', maxCoins)
                              setInputAmount(maxCoins.toString())
                              setInputChanged(maxCoins.toString())
                              setMaxSelected(true)
                            }}
                          >
                            {maxCoins
                              ? truncateDecimals(parseFloat(maxCoins), 5)
                              : '0.00'}
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                  <PurchaseSummary
                    estimatedValue={fetchSinglePlayerStatsSell[0]?.matic}
                    totalValue={totalSum}
                    inProgress={isCalculating}
                    usdRate={
                      fetchSinglePlayerStatsSell[0]?.exchangeRateUSD?.rate
                    }
                    initCallback={getCallback}
                    stopCalculating={stopCalculation}
                    usdTotalCallback={fetchLiveTotalUsd}
                    priceImpact={getPricePercentageDifference()}
                    priceImpactStyle="number-color loss"
                    maxCoins={maxCoins}
                    isSelling
                  />
                  {isLoading ? (
                    <div className="spinner-wrapper purchase-loader">
                      <Spinner
                        className="purchase-spinner"
                        spinnerStatus={isLoading}
                        title={t('awaiting Confirmation')}
                      />
                    </div>
                  ) : null}
                  {!checkTradingStatusData && (
                    <div className="flex-center">
                      <div className="trading_disabled_btn">
                        {t('trading_disabled')}
                      </div>
                    </div>
                  )}
                  <div
                    className={classNames(
                      'purchase-submit-wrapper mb-20',
                      'btn-purchase',
                      isLoading ? 'hidden' : '',
                    )}
                  >
                    {showApproveBtn &&
                    (playerData?.playerstatusid?.id === 15 ||
                      playerData?.playerlevelid === 15) ? (
                      <button
                        type="submit"
                        className={classNames(`purchase-btn`)}
                        onClick={() => {
                          setShowCurrencyApprovalPrompt(true)
                          setToBuy(true)
                        }}
                      >
                        {t('approve')}
                      </button>
                    ) : checkTradingStatusLoader ? (
                      <div className="flex-center m-auto">
                        <div className="loading-spinner">
                          <div className="spinner size-small"></div>
                        </div>
                      </div>
                    ) : (
                      <PurchaseButton
                        disabled={isLoading || !checkTradingStatusData}
                        title={'sell'}
                        onPress={handleSubmit}
                        className={classnames(
                          (isCalculating && !stopCalculation) ||
                            purchaseContractLoading ||
                            parseFloat(maxCoins) < parseFloat(inputAmount) ||
                            parseFloat(inputAmount) <= 0 ||
                            !inputAmount.trim()
                            ? 'purchase-btn-inactive sell-btn-inactive'
                            : 'sell-btn',
                          'caps',
                        )}
                      />
                    )}
                    {fetchSinglePlayerStatsError && (
                      <div className="input-feedback text-center">
                        {fetchSinglePlayerStatsError}
                      </div>
                    )}
                  </div>
                </form>
              )
            }}
          </Formik>
        </div>
      )}
    </div>
  )
}

export default SellNftForm
