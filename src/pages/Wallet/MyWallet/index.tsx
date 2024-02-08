/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import SubmitButton from '@components/Button/SubmitButton'
import IosShareIcon from '@mui/icons-material/IosShare'
import '@assets/css/pages/Wallet.css'
import BottomPopup from '@components/Dialog/BottomPopup'
import PassPhrase from './PassPhrase'
import Deposit from './Deposit'
import {
  getFlooredFixed,
  isMobile,
  truncateDecimals,
  asyncLocalStorage,
} from '@utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import $ from 'jquery'
import {
  exportKeyReset,
  getWalletAddress,
  getWalletChart,
  getWalletDetails,
  sendMaticsMetamask,
  sendMaticsReset,
  getWalletCrypto,
  showWalletForm,
  storeBalance,
  getUserXp,
  balanceOfAllowance,
  setSharePopWallet,
  getQualificationSetting,
  logout as emailLogout,
  openSideMenu,
  resetGeneralSettings,
  resetBalanceOfAllowance,
  resetWallet,
  resetSendChangeSecretOtp,
} from '@root/apis/onboarding/authenticationSlice'
import ArrowDownFilled from '@components/Svg/ArrowDownFilled'
import ArrowUpFilled from '@components/Svg/ArrowUpFilled'
import { RootState } from '@root/store/rootReducers'
import ExportPrivateKey from './ExportPrivateKey'
import { ConnectContext } from '@root/WalletConnectProvider'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import WalletIcon from '@assets/icons/icon/wallet.webp'
import SendAsset from './SendAsset'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import {
  fetchPlayersBalance,
  getSendMaticTxnConfirm,
  resetCoinLaunch,
  resetPlayerData,
  resetTxnConfirmationData,
} from '@root/apis/playerCoins/playerCoinsSlice'
import Chart from '@pages/Player/Profile/Chart'
import { v4 as uuidv4 } from 'uuid'
import classNames from 'classnames'
import WertWidget from '@wert-io/widget-initializer'
import PeriodBar from '@components/PeriodBar'
// mui
import { Dialog } from '@material-ui/core'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReactCanvasConfetti from 'react-canvas-confetti'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import { useNavigate } from 'react-router-dom'
import usdc from '@assets/images/usdc.webp'
import bitcoin from '@assets/images/wrapped-bitcoin.webp'
import tether from '@assets/images/tether.webp'
import ethereum from '@assets/images/ethereum-eth.webp'
import {
  POLYGON_NETWORK_RPC_URL,
  THEME_COLORS,
  BASE_EXPLORE_URL,
} from '@root/constants'
import { ethers } from 'ethers'
import DialogBox from '@components/Dialog/DialogBox'
import ImageComponent from '@components/ImageComponent'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import WalletPaymentOptions from './components/PaymentOptions'
import HeaderTickerSkeleton from '@components/Card/HeaderTickerSkeleton'
import { useWalletHelper } from '@utils/WalletHelper'
import InvitationsReferrals from './InvitationsReferrals'
import { usePrivy } from '@privy-io/react-auth'
import LogoutIcon from '@mui/icons-material/Logout'
interface Props {
  onSubmit: any
  onChartView: any
  tourStep?: number
  onNextTour?: any
}
const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
} as React.CSSProperties
let wertTimeout: any = null
let txnCheckInterval: any = null
let currencyContractTran: any = null
let myInterval: any = null
let exportPrivyTimeout: any = null

// let consentTimeout: any = null

const MyWallet: React.FC<Props> = ({ onChartView, tourStep, onNextTour }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(true)
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const walletType = localStorage.getItem('wallet')
  const [isSendMatic, setSendMatic] = useState(false)
  const [web3CallInProgress, setWeb3CallInProgress] = useState(false)
  const [isDepositSelected, setDepositSelected] = useState(false)
  const [isRefferalSelected, setRefferalSelected] = useState(false)
  const [transactionData, setTransactionData] = useState(null)
  const [isSecretAcquired, setAquireSecret] = useState(false)
  const [isExportKeyOpted, setExportKeyOpted] = useState(false)
  const [txnHash, setTxnHash] = useState('')
  const [txnError, setTxnError] = useState('')
  const [isLoadingMatic, setIsLoadingMatic] = useState(false)
  const [chartView, setChartView] = useState(false)
  const [widgetInitiated, setWidgetInitiated] = useState(false)
  const [xAxisData, setXAxisData] = useState<any>([])
  const [series, setSeries] = useState<any>([])
  const [wertLoading, setWertLoading] = useState<any>(false)
  const [isEmpty, setIsEmpty] = useState<any>(true)
  const [chartPeriod, setChartPeriod] = useState('7D')

  //privy export wallet
  const { ready, authenticated, user, exportWallet, logout } = usePrivy()
  const { connectStatus, disconnect } = useContext(ConnectContext)

  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated

  // Check that your user has an embedded wallet
  // const hasEmbeddedWallet = !!user.linkedAccounts.find(
  //   account => account.type === 'wallet' && account.walletClient === 'privy',
  // )

  // confetti
  const refAnimationInstance = useRef<any>(null)

  const getInstance = useCallback(instance => {
    refAnimationInstance.current = instance
  }, [])

  const playerCoinData: any = useSelector(
    (state: RootState) => state.playercoins,
  )
  const { isTxnChecking, txnConfirmSuccess } = playerCoinData

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    loader,
    userWalletData: { address, balance, prctChange },
    nativeAmount,
    walletChartData,
    isGetWalletChartSuccess,
    loadingChart,
    getUserSettingsData,
    ipLocaleCurrency,
    currencyListData: { payment_options, contract_abi },
    selectedThemeRedux,
    generalSettingsData,
    balanceOfAllowanceData,
    balanceOfAllowanceLoader,
    privyWallets,
    sharePopWallet,
    QualificationSettingData,
    qualifiedInviteLinked,
    isWalletFormVisible,
  } = authenticationData

  const { getBalance, getWeb3Provider, sendWithWallet } = useWalletHelper()

  const currencySymbol =
    getUserSettingsData?.currency ?? ipLocaleCurrency ?? 'USD'

  const [WETH, setWETH] = useState('0.00000')
  const [USDT, setUSDT] = useState('0.00000')
  const [USDC, setUSDC] = useState('0.00000')
  const [WBTC, setWBTC] = useState('0.00000')
  const [externalBalanceFetched, setExternalBalanceFetched] = useState(false)

  const balanceOfCurrencyList = async el => {
    const currencyContract = el?.contract
    const ticker = el?.ticker

    if (loginInfo) {
      const web3Provider = await getWeb3Provider()

      const providerSigner = web3Provider.getSigner(loginInfo!)
      const playerContract = new ethers.Contract(
        currencyContract, // contract address of Router
        contract_abi, //  contract abi of Router
        providerSigner,
        // provider.getSigner(loginInfo!),
      )

      try {
        const balanceTx = await playerContract.balanceOf(loginInfo)
        let balance: any = null
        if (ticker === 'WBTC') {
          balance = parseInt(balanceTx._hex) / 100000000
        } else {
          balance = parseInt(balanceTx._hex) / 1000000000000000000
        }
        const balance1 = balance.toString()
        if (ticker === 'WETH') {
          balance1 === '0'
            ? setWETH('0.00000')
            : setWETH(parseFloat(balance1).toFixed(5))
          dispatch(
            storeBalance({
              ticker: ticker,
              balance:
                balance1 === '0' ? '0.00000' : parseFloat(balance1).toFixed(5),
            }),
          )
        } else if (ticker === 'USDT') {
          balance1 === '0'
            ? setUSDT('0.00000')
            : setUSDT(parseFloat(balance1).toFixed(5))
          dispatch(
            storeBalance({
              ticker: ticker,
              balance:
                balance1 === '0' ? '0.00000' : parseFloat(balance1).toFixed(5),
            }),
          )
        } else if (ticker === 'USDC') {
          balance1 === '0'
            ? setUSDC('0.00000')
            : setUSDC(parseFloat(balance1).toFixed(5))
          dispatch(
            storeBalance({
              ticker: ticker,
              balance:
                balance1 === '0' ? '0.00000' : parseFloat(balance1).toFixed(5),
            }),
          )
        } else if (ticker === 'WBTC') {
          balance1 === '0'
            ? setWBTC('0.00000')
            : setWBTC(parseFloat(balance1).toFixed(5))
          dispatch(
            storeBalance({
              ticker: ticker,
              balance:
                balance1 === '0' ? '0.00000' : parseFloat(balance1).toFixed(5),
            }),
          )
        }
        setExternalBalanceFetched(true)
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
    } else if (loginId) {
      console.log('balanceOfCurrencyList_NO_RUN_FOR_INTERNAL_USER')
      return
      // const userWalletAddressUnder = localStorage.getItem('userWalletAddress')
      // try {
      //   const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
      //     POLYGON_NETWORK_RPC_URL,
      //   )
      //   const playerContract = new ethers.Contract(
      //     currencyContract, // contract address of Router
      //     contract_abi, //  contract abi of Router
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
      //   if (ticker === 'WETH') {
      //     balance1 === '0'
      //       ? setWETH('0.00000')
      //       : setWETH(parseFloat(balance1).toFixed(5))
      //     dispatch(
      //       storeBalance({
      //         ticker: ticker,
      //         balance:
      //           balance1 === '0' ? '0.00000' : parseFloat(balance1).toFixed(5),
      //       }),
      //     )
      //   } else if (ticker === 'USDT') {
      //     balance1 === '0'
      //       ? setUSDT('0.00000')
      //       : setUSDT(parseFloat(balance1).toFixed(5))
      //     dispatch(
      //       storeBalance({
      //         ticker: ticker,
      //         balance:
      //           balance1 === '0' ? '0.00000' : parseFloat(balance1).toFixed(5),
      //       }),
      //     )
      //   } else if (ticker === 'USDC') {
      //     balance1 === '0'
      //       ? setUSDC('0.00000')
      //       : setUSDC(parseFloat(balance1).toFixed(5))
      //     dispatch(
      //       storeBalance({
      //         ticker: ticker,
      //         balance:
      //           balance1 === '0' ? '0.00000' : parseFloat(balance1).toFixed(5),
      //       }),
      //     )
      //   } else if (ticker === 'WBTC') {
      //     balance1 === '0'
      //       ? setWBTC('0.00000')
      //       : setWBTC(parseFloat(balance1).toFixed(5))
      //     dispatch(
      //       storeBalance({
      //         ticker: ticker,
      //         balance:
      //           balance1 === '0' ? '0.00000' : parseFloat(balance1).toFixed(5),
      //       }),
      //     )
      //   }
      // } catch (err: any) {
      //   setTxnError(err.reason || err.message)
      // }
    }
  }
  useEffect(() => {
    if (payment_options) {
      if (loginInfo) {
        payment_options?.map(el => balanceOfCurrencyList(el))
      } else if (loginId) {
        dispatch(
          balanceOfAllowance({
            spender: generalSettingsData?.proxy_contract_coins,
          }),
        )
      }
    }
  }, [payment_options])

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
      dispatch(getWalletChart('all=true'))
    } else {
      const date_min = new Date()
      date_min.setDate(date_min.getDate() - getCount())
      dispatch(
        getWalletChart('date_min=' + date_min.toISOString().substr(0, 10)),
      )
    }
  }, [chartPeriod])

  useEffect(() => {
    // getElementInjection()
    const _getBalance = async () => {
      if (loginInfo) {
        await getBalance()
      }
    }
    _getBalance()
    const reqParams = {
      address: loginInfo || address,
    }

    if (QualificationSettingData === 1) {
      if ((loginInfo || loginId) && qualifiedInviteLinked) {
        dispatch(fetchPlayersBalance(reqParams))
      }
    } else {
      if (loginInfo || loginId) {
        dispatch(fetchPlayersBalance(reqParams))
      }
    }

    dispatch(getWalletCrypto())

    return () => {
      console.log('--------unmount step 1------')
      clearInterval(txnCheckInterval)
      console.log('--------unmount step 2------')
      dispatch(resetTxnConfirmationData())
      console.log('--------unmount step 3------')
      if (document.getElementById('walletModalContent')) {
        console.log('--------unmount step 4------')
        document.getElementById('walletModalContent').style.width = '375px'
        console.log('--------unmount step 5------')
        document.getElementById('walletModalContent').style.height = '790px'
      }
    }
  }, [])

  useEffect(() => {
    if (isGetWalletChartSuccess) {
      const seriesValues: any = []
      const xAxisDataValues: any = []
      walletChartData.forEach((item: any) => {
        if (item?.usdbalance ?? 0 > 0) {
          setIsEmpty(false)
        }
        seriesValues.push(item?.usdbalance ?? 0)
        xAxisDataValues.push(
          item?.date.split('-')[2] + '/' + item?.date.split('-')[1],
        )
      })
      setXAxisData(xAxisDataValues.reverse())
      setSeries(seriesValues.reverse())
    }
  }, [isGetWalletChartSuccess])

  useEffect(() => {
    if (txnConfirmSuccess) {
      clearInterval(txnCheckInterval)
      fire()
      dispatch(getUserXp(false))
    }
  }, [txnConfirmSuccess])

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
    if (txnHash) {
      handleTxnCheck()
    }
  }, [txnHash])

  const handleCloseBottomPopup = () => {
    setIsLoadingMatic(false)
    setTxnHash('')
    setTxnError('')
    setWeb3CallInProgress(false)
    setSendMatic(false)
    if (loginInfo) {
      dispatch(getWalletAddress(loginInfo))
    } else {
      dispatch(getWalletDetails())
    }
  }

  const handleTxnCheck = () => {
    dispatch(getSendMaticTxnConfirm(txnHash))
    txnCheckInterval = setInterval(() => {
      dispatch(getSendMaticTxnConfirm(txnHash))
    }, 10000)
  }

  useEffect(() => {
    clearInterval(txnCheckInterval)
    if (!document.hidden) {
      if (txnHash) {
        handleTxnCheck()
      }
    }
  }, [document.hidden])

  const handleRefreshBalance = async (event: any) => {
    event.preventDefault()
    if (loginInfo) {
      dispatch(getWalletAddress(loginInfo))
      await getBalance()
    } else {
      dispatch(getWalletDetails())
    }
  }

  const handleSendMatic = () => {
    setTxnError('') //revert
    setTxnHash('')
    setSendMatic(true)
  }

  const sendCurrencyWithWallet = async (
    assetType: string,
    receiverAddress: string,
    amount: number,
    successCallback?: any,
    errorCallBack?: any,
  ) => {
    for (let i = 0; i < payment_options?.length; i++) {
      if (payment_options[i]?.ticker === assetType) {
        currencyContractTran = payment_options[i]?.contract
      }
    }
    const provider = await getWeb3Provider()
    const tokenContract = new ethers.Contract(
      currencyContractTran, // player contract address of the player coin
      contract_abi, // player contract abi of the player coin
      provider.getSigner(loginInfo!), // signer of the currently logged in user wallet address
    )
    let valueAmount: any = amount
    if (assetType === 'WBTC') {
      valueAmount = ethers.utils.hexlify(amount * 100000000)
    } else {
      valueAmount = ethers.utils.parseEther(amount.toString())._hex
    }
    try {
      const txn = await tokenContract.transfer(receiverAddress, valueAmount, {
        gasLimit: ethers.utils.hexlify(300000),
      })
      successCallback(txn.hash)
    } catch (err: any) {
      errorCallBack(err.reason || err.message)
    }
  }

  const handleFetchTransactionData = (data: any) => {
    setIsLoadingMatic(true)
    if (loginInfo) {
      setWeb3CallInProgress(true)
      dispatch(sendMaticsMetamask())
      if (data.assetType === 'MATIC') {
        sendWithWallet(
          data.to_address,
          data.amount,
          txnHash => {
            setIsLoadingMatic(false)
            setTxnHash(txnHash)
          },
          error => {
            setIsLoadingMatic(false)
            setTxnError(error.message)
          },
        )
      } else {
        sendCurrencyWithWallet(
          data?.assetType,
          data?.to_address,
          data?.amount,
          txnHash => {
            setIsLoadingMatic(false)
            setTxnHash(txnHash)
          },
          error => {
            setIsLoadingMatic(false)
            setTxnError(error.message)
          },
        )
      }
      setTimeout(() => {
        handleCloseSecret()
        dispatch(sendMaticsReset())
      }, 2000)
    } else {
      setTransactionData(data)
      setAquireSecret(true)
      dispatch(sendMaticsReset())
    }
  }

  const handleCloseSecret = () => {
    setAquireSecret(false)
    setSendMatic(false)
    setDepositSelected(false)
  }

  const handleCloseInvitationsReferrals = () => {
    if (sharePopWallet) {
      dispatch(setSharePopWallet(false))
    } else {
      setRefferalSelected(false)
    }
  }

  const handleCloseExport = () => {
    setExportKeyOpted(false)
    setSendMatic(false)
    dispatch(exportKeyReset())
  }

  const handleExportKey = (evt: any) => {
    evt.preventDefault()
    setExportKeyOpted(true)
    setSendMatic(true)
  }

  const getWertHeight = () => {
    return Math.floor((window.innerHeight * 66.71) / 100)
  }

  const getCommoditiesSet = () => {
    if (process.env.REACT_APP_POLYGON_NETWORK === 'MAINNET') {
      return '[{"commodity":"MATIC","network":"polygon"}]'
    }
    return '[{"commodity":"MATIC","network":"mumbai"}]'
  }

  const handleWertTopup = () => {
    setWertLoading(true)
    clearTimeout(wertTimeout)
    const options = {
      // partner_id: '01G2A9N1TZ18NWM0EGCYFX9E33',
      partner_id: process.env.REACT_APP_WERT_PARTNER_ID,
      origin: process.env.REACT_APP_WERT_ORIGIN,
      container_id: 'topup-box',
      address: address,
      click_id: uuidv4(), // unique id of purhase in your system
      width: 370,
      height: getWertHeight(), //445,
      color_background: THEME_COLORS[selectedThemeRedux]['PrimaryBackground'],
      color_buttons: THEME_COLORS[selectedThemeRedux]['SecondaryForeground'],
      color_buttons_text: '#212435',
      color_main_text: THEME_COLORS[selectedThemeRedux]['SecondaryText'],
      currency: 'USD',
      // commodity: 'MATIC',
      // network: 'mumbai',
      // commodities: '[{"commodity":"MATIC","network":"mumbai"}]',
      commodities: getCommoditiesSet(),
      listeners: {
        loaded: () => console.log('loaded'),
        position: (data: any) => console.log('topup_step:', data.step),
        close: (evt: any) => console.log('topup_CLOSE_WERT:', evt),
        error: (error: any) => console.log('topup_ERROR_WERT:', error),
      },
    }
    const purchaseBox = document.getElementById('topup-box')
    const iframe = purchaseBox.getElementsByTagName('iframe')[0]
    if (iframe) {
      purchaseBox.removeChild(iframe)
    }
    console.log('-------wertData-------', options)
    const wertTopupWidget = new WertWidget(options)
    wertTopupWidget.mount()
    const iframeLength = document.getElementsByTagName('iframe').length
    document.getElementsByTagName('iframe')[iframeLength - 1].style.position =
      'relative'
    document
      .getElementById('topup-box')
      .append(document.getElementsByTagName('iframe')[iframeLength - 1])

    wertTimeout = setTimeout(() => {
      setWidgetInitiated(true)
      setWertLoading(false)
    }, 5000)
  }

  const handleHideWert = () => {
    console.log('HHW')
    dispatch(getWalletDetails())
    dispatch(getWalletAddress(loginInfo))
    if (loginInfo) {
      dispatch(getWalletAddress(loginInfo))
    } else {
      dispatch(getWalletDetails())
    }
    setWidgetInitiated(false)
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
      }
    }
    setTimeout(
      () => {
        setChartView(!chartView)
      },
      chartView ? 0 : 500,
    )
    onChartView()
  }

  useEffect(() => {
    if (
      isSendMatic ||
      isDepositSelected ||
      isExportKeyOpted ||
      isRefferalSelected ||
      widgetInitiated
    ) {
      document.getElementById('walletModal').style.overflow = 'hidden'
    } else {
      document.getElementById('walletModal').style.overflow = ''
    }
  }, [
    isDepositSelected,
    isExportKeyOpted,
    widgetInitiated,
    isSendMatic,
    isRefferalSelected,
  ])

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

  const currentURL = window.location.href
  const includesGenesis = currentURL.includes('/genesis')
  const includeLanding = !currentURL.includes('/app')
  const [privateKey, setPrivateKey] = useState(false)

  // const handleChangePrivySecurityContent = () => {
  //   console.log('--------privateKey step 1------')
  //   // Select the element by its class
  //   const elementToHide: any = document.querySelector('.sc-Nxspf.ilwUHP')
  //   const transferElement: any = document.querySelector('.sc-hCPjZK.fHvBtL h3')

  //   console.log('--------privateKey step 2------')
  //   const paragraphElement: any = document.querySelector('.sc-uVWWZ.cljBpi p')
  //   const buttonCopy: any = document.querySelector('#__next')

  //   if (buttonCopy) {
  //     buttonCopy.style.overflow = 'hidden'
  //   }

  //   console.log('--------privateKey step 3------', {
  //     elementToHide,
  //     transferElement,
  //     paragraphElement,
  //     buttonCopy,
  //   })
  //   // Check if the element is found
  //   if (paragraphElement) {
  //     // Replace the text content
  //     paragraphElement.textContent = `${t(
  //       'This is your private key for your Polygon Wallet. This key alone is your wallet and you should store it somewhere safe as anyone with this key can access all your funds',
  //     )}`
  //     paragraphElement.style.margin = '20px 0px'
  //   }

  //   console.log('--------privateKey step 4------', { transferElement })
  //   // Check if the element exists before updating its text content
  //   if (transferElement) {
  //     // Change the text content
  //     transferElement.textContent = `${t('Security Advice')}`
  //   }

  //   console.log('--------privateKey step 5------', { elementToHide })
  //   // Check if the element exists before trying to hide it
  //   if (elementToHide) {
  //     // Hide the element by setting display to 'none'
  //     elementToHide.style.display = 'none'
  //   }
  //   console.log('--------privateKey step 6------', {
  //     transferElement,
  //     paragraphElement,
  //   })
  //   if (transferElement) {
  //     transferElement.style.visibility = 'visible'
  //   }
  //   if (paragraphElement) {
  //     paragraphElement.style.visibility = 'visible'
  //   }
  //   console.log('--------privateKey step 7------')
  //   // setPrivateKey(false)
  //   console.log('--------privateKey step 8------')
  // }

  // useEffect(() => {
  //   console.log({ privateKey })
  //   if (privateKey) {
  //     try {
  //       clearTimeout(consentTimeout)
  //       consentTimeout = setTimeout(() => {
  //         handleChangePrivySecurityContent()
  //       }, 700)
  //       // handleChangePrivySecurityContent()
  //     } catch (err) {
  //       console.log('privy_modal_err::', err)
  //     }
  //   }
  // }, [privateKey])

  const handleDeposit = () => {
    dispatch(getQualificationSetting())
    if (tourStep === 3) {
      onNextTour()
    }
    setDepositSelected(true)
  }

  const getElementInjection = () => {
    clearInterval(myInterval)
    // const transferElement: any = document.querySelector('.sc-hCPjZK.fHvBtL h3')
    // const paragraphElement: any = document.querySelector('.sc-uVWWZ.cljBpi p')
    myInterval = setInterval(() => {
      // const modalLink = document.querySelector('.cookie-policy-link-text')
      const transferElement: any = document.querySelector(
        '.sc-hCPjZK.fHvBtL h3',
      )
      const paragraphElement: any = document.querySelector('.sc-uVWWZ.cljBpi p')
      console.log({ transferElement, paragraphElement })
      if (transferElement && paragraphElement) {
        transferElement.textContent = `${t('Security Advice')}`
        paragraphElement.textContent = `${t(
          'This is your private key for your Polygon Wallet. This key alone is your wallet and you should store it somewhere safe as anyone with this key can access all your funds',
        )}`
        clearInterval(myInterval)
        // modalLink.textContent = `${t('Security Advice')}`
      }
    }, 100)
  }

  const handleExportPrivyKey = () => {
    getElementInjection()
    clearTimeout(exportPrivyTimeout)
    exportPrivyTimeout = setTimeout(() => {
      exportWallet()
    }, 1000)
    // setTimeout(() => {
    //   console.log('--------exportWallet step3 ----------')
    //   setPrivateKey(true)
    // }, 2000)
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
      dispatch(emailLogout({ reqParams, location: 'Header.tsx_line178' }))
      localStorage.removeItem('userWalletAddress')
      dispatch(openSideMenu({ openMenu: false }))
    })
    window.dispatchEvent(new Event('refresh_menu'))
    localStorage.setItem('logg', 'out')
    if (isWalletFormVisible) {
      dispatch(showWalletForm({}))
    }
  }

  return (
    <>
      <div
        className={classnames(
          'purchase-container wallet-wrapper',
          isMobile() ? 'mobile-wrapper' : '',
        )}
        style={{ height: '480px' }}
      >
        {isSendMatic && !isExportKeyOpted ? (
          <SendAsset
            mode="matic"
            isOpen={isSendMatic && !isExportKeyOpted}
            onSend={handleFetchTransactionData}
            onCloseSend={handleCloseSecret}
            onClose={handleCloseBottomPopup}
            txnError={txnError}
            txnHash={txnHash}
            isLoadingMatic={isLoadingMatic}
          />
        ) : null}
        <BottomPopup
          mode={`wallet ${isMobile() ? 'exwallet-bottomwrapper' : ''}`}
          isOpen={isSecretAcquired || web3CallInProgress}
        >
          {isSecretAcquired && !walletType ? (
            <PassPhrase
              onClose={() => handleCloseSecret()}
              transactionData={transactionData}
            />
          ) : walletType && web3CallInProgress ? (
            <section className="vertical-flex buy-fly">
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
              {isLoadingMatic && !txnHash && !txnError ? (
                <div className="checkout-loader-wrapper draftee-propmt mt-40">
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                  <div
                    className="close-button"
                    onClick={handleCloseBottomPopup}
                  >
                    {t('close')}
                  </div>
                </div>
              ) : (
                <>
                  {txnHash ? (
                    <div
                      style={{ height: '50px' }}
                      className={classnames(
                        'add-draftee-success',
                        'web3action-success',
                        'mt-20',
                      )}
                    >
                      <div className="check-container-txn">
                        <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                        {!txnConfirmSuccess ? (
                          <div
                            className={classnames('spinner check-spinner')}
                          ></div>
                        ) : (
                          <>
                            {txnConfirmSuccess ? (
                              <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                            ) : (
                              <CancelOutlinedIcon className="response-icon error-icon" />
                            )}
                          </>
                        )}
                      </div>
                      <span>{t('transaction sent')}</span>
                      {txnConfirmSuccess ? (
                        <span
                          style={{
                            fontSize: isMobile() ? '20px' : '17px',
                            margin: 'unset',
                          }}
                          className={classnames(
                            txnConfirmSuccess
                              ? 'txn-confirm-success'
                              : 'txn-confirm-error',
                          )}
                        >
                          {!isTxnChecking && txnConfirmSuccess === 0
                            ? t('transaction confirmed')
                            : !isTxnChecking && txnConfirmSuccess === 1
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
                    className="close-button"
                    onClick={handleCloseBottomPopup}
                  >
                    {t('close')}
                  </div>
                </>
              )}
              <ReactCanvasConfetti
                refConfetti={getInstance}
                style={canvasStyles}
              />
            </section>
          ) : null}
        </BottomPopup>
        <BottomPopup mode="wallet" isOpen={isDepositSelected}>
          {isDepositSelected ? (
            <Deposit
              isMaticDeposit
              title={t('my MATIC Deposit Address')}
              address={address}
              isLoading={wertLoading}
              onSelect={() => handleWertTopup()}
              onClose={() => handleCloseSecret()}
              tourStep={tourStep}
              onNextTour={onNextTour}
            />
          ) : null}
        </BottomPopup>
        <BottomPopup mode="wallet wallet_referral" isOpen={isRefferalSelected}>
          {isRefferalSelected ? (
            <InvitationsReferrals
              isMaticDeposit
              title={t('Invitations & Referrals')}
              address={address}
              containerClassName={'invitations_referrals_container'}
              onClose={() => handleCloseInvitationsReferrals()}
            />
          ) : null}
        </BottomPopup>
        {isExportKeyOpted ? (
          <BottomPopup mode="wallet" isOpen={isExportKeyOpted}>
            <ExportPrivateKey onClose={() => handleCloseExport()} />
          </BottomPopup>
        ) : null}
        {isMobile() ? (
          <DialogBox
            isOpen={widgetInitiated}
            onClose={() => console.log('')}
            parentClass={isMobile() ? 'flex-dialog' : ''}
          >
            <div id="topup-box"></div>
            {/* <div
              className={classNames(
                'green-line-btn',
                isMobile() ? 'close-button-wert' : 'close-button',
              )}
              onClick={() => handleHideWert()}
            >
              {t('close')}
            </div> */}
          </DialogBox>
        ) : (
          <BottomPopup
            mode={isMobile() ? 'wallet wert-topup' : 'wallet'}
            isOpen={widgetInitiated}
            usage="wertwallet"
          >
            <div id="topup-box" className={'wert-widget-wrapper'}></div>
            <div
              className={classNames(
                'green-line-btn',
                isMobile() ? 'close-button-wert' : 'close-button',
              )}
              onClick={() => handleHideWert()}
            >
              {t('close')}
            </div>
          </BottomPopup>
        )}
        {loader ? (
          <div className="balance-progress">
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
        ) : chartView ? (
          <div className="chart-modal-body-box">
            {!isMobile() && (
              <div className="chart-modal-body-content">
                <Stack direction={'column'} justifyContent="center">
                  {loadingChart ? (
                    <div
                      className="balance-progress"
                      style={{ height: 'calc(60vh - 50px)' }}
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
                      {series.length > 0 && !isEmpty ? (
                        <div className="chart">
                          <Chart
                            xAxisData={xAxisData}
                            series={series}
                            chartOption={'Balance'}
                          />
                        </div>
                      ) : (
                        <div className="blog-title yellow-color mt-180 mb-80">
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
          <>
            {includesGenesis || includeLanding ? (
              <div
                className="my_profile_wrapper"
                style={{ justifyContent: 'space-between' }}
              >
                <ImageComponent
                  loading="lazy"
                  src={
                    walletType === 'Metamask'
                      ? MetamaskIcon
                      : walletType === 'Privy'
                      ? WalletIcon
                      : CoinbaseIcon
                  }
                  className="wallet_icon"
                  alt="metamask-icon"
                />
                <div style={{ width: '75%' }}>
                  <p
                    className="nft_owner_link"
                    style={{ textDecoration: 'none', width: '100%' }}
                  >
                    {walletType === 'Privy'
                      ? getUserSettingsData?.email
                      : localStorage.getItem('externalWalletAddress')}
                  </p>
                </div>
                <LogoutIcon
                  className="logout-icon"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDisconnect()}
                />
              </div>
            ) : (
              <div className="my_profile_wrapper">
                <div className="avatar_border">
                  <div
                    className={classNames(
                      'avatar_image',
                      getUserSettingsData?.avatar
                        ? getUserSettingsData?.avatar
                        : 'group-6',
                    )}
                  ></div>
                </div>
                <div style={{ width: '70%' }}>
                  <p
                    className="nft_owner_link"
                    style={{ textDecoration: 'none' }}
                  >
                    {getUserSettingsData?.username}
                  </p>
                </div>
                <div
                  style={{ height: '24px' }}
                  onClick={() => {
                    dispatch(showWalletForm({}))
                    navigate(`/app/user/${getUserSettingsData?.username}`)
                  }}
                >
                  <VisibilityIcon className="profile_view_icon" />
                </div>
                <div
                  style={{ height: '20px' }}
                  onClick={() => {
                    dispatch(showWalletForm({}))
                    navigate(`/app/my_settings`)
                  }}
                >
                  <EditIcon
                    style={{ width: '20px', height: '20px' }}
                    className="profile_view_icon"
                  />
                </div>
              </div>
            )}

            <div
              className={classNames(
                widgetInitiated ? 'balance-card' : 'balance-card z-100',
                includesGenesis || includeLanding ? 'mt-20' : '',
              )}
            >
              <div style={{ display: 'flex' }}>
                <h2 className="wallet-heading total-balance">
                  {parseFloat(nativeAmount).toLocaleString()}&nbsp;
                  {currencySymbol}
                </h2>
                <div
                  className="player-detail-pricechange wallet-heading total-balance"
                  style={{ marginLeft: '5px' }}
                >
                  {!isNaN(prctChange) && prctChange >= 0 ? (
                    <ArrowUpFilled />
                  ) : (
                    <ArrowDownFilled />
                  )}
                  <div
                    style={{ fontSize: '22px' }}
                    className={classnames(
                      'number-color',
                      !isNaN(prctChange) && prctChange >= 0 ? 'profit' : 'loss',
                    )}
                  >
                    {getFlooredFixed(
                      !isNaN(prctChange) && prctChange < 0
                        ? prctChange * -1
                        : prctChange ?? 0,
                      2,
                    )}
                    %
                  </div>
                </div>
              </div>
              <p className="wallet-text eth-amt">
                {!isNaN(balance) && balance !== null
                  ? ' ' +
                    getFlooredFixed(parseFloat(balance.toLocaleString()), 4)
                  : '0.00'}{' '}
                MATIC
              </p>
              <div className="balance-control-wrapper">
                <p onClick={handleRefreshBalance}>{t('refresh')}</p>
              </div>
            </div>
            {localStorage.getItem('wallet') === 'Privy' && (
              <div className="wallet-btn-container mb-20">
                <button
                  className="form-submit-btn wallet-btn deposit-btn security_backup"
                  onClick={() => handleExportPrivyKey()}
                  disabled={!isAuthenticated}
                >
                  {t('security_backup')}
                </button>
              </div>
            )}
            <div className="wallet-btn-container">
              {/* {wertLoading ? (
                <div className="wallet-btn no-background">
                  <div className="loading-spinner">
                    <div className="spinner size-small"></div>
                  </div>
                </div>
              ) : (
                <SubmitButton
                  isDisabled={false}
                  title={t('buy')}
                  className="wallet-btn disabled-btn"
                  onPress={() => handleWertTopup()}
                />
              )} */}
              <SubmitButton
                isDisabled={false}
                title={t('withdraw')}
                className="wallet-btn withdraw"
                onPress={() => handleSendMatic()}
              />
              <SubmitButton
                isDisabled={false}
                title={t('deposit')}
                className={classnames(
                  'wallet-btn deposit-btn',
                  tourStep === 3 ? 'bright-area position-static' : '',
                )}
                onPress={handleDeposit}
              />
              {tourStep === 3 && <div className="dark-overlay"></div>}
            </div>
            <div className="wallet-btn-container mb-20">
              <div
                className="invitations_referrals_btn mt-20"
                onClick={() => setRefferalSelected(true)}
              >
                {t('Invitations & Referrals')}
              </div>
            </div>
            <div
              className="export-key-text payment_options_balance"
              style={{
                margin: '20px 0px 10px 0px',
                textDecorationLine: 'none',
                cursor: 'default',
              }}
            >
              {loginInfo ? (
                <WalletPaymentOptions balances={{ WETH, USDC, USDT, WBTC }} />
              ) : loginId ? (
                <>
                  {balanceOfAllowanceLoader ? (
                    <>
                      {Array(4)
                        .fill(null)
                        .map(() => (
                          <HeaderTickerSkeleton customClass="paymethods-placeholder" />
                        ))}
                    </>
                  ) : (
                    <>
                      <WalletPaymentOptions />
                    </>
                  )}
                </>
              ) : null}
            </div>
            {!loginInfo ? (
              <>
                <div className="export-key-text" onClick={handleExportKey}>
                  {' '}
                  <IosShareIcon />
                  <span>{t('Export Backup')}</span>
                </div>
                <p
                  className={classnames(
                    'wallet-text form-note save-pk',
                    isMobile() ? 'mb-40' : '',
                  )}
                  style={{ marginTop: '10px' }}
                >
                  {t('IMPORTANT')}: {t('you must store this backup somewhere')}
                </p>
              </>
            ) : null}
          </>
        )}
        <Dialog
          open={chartView && isMobile()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={'md'}
          className="chart-dialog"
        >
          <div className={classnames('chart-modal-body')}>
            <div className="chart-modal-body-content">
              <Stack direction={'column'} justifyContent="center">
                {series.length > 0 && !isEmpty ? (
                  <div className="chart">
                    <Chart
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
                <PeriodBar
                  chartPeriod={chartPeriod}
                  setChartPeriod={setChartPeriod}
                />
                <div
                  className="mobile-back-button chart-back-button"
                  onClick={() => {
                    handleChartView()
                    setShowSettings(true)
                  }}
                >
                  <ArrowBackIcon />
                </div>
              </Stack>
            </div>
          </div>
        </Dialog>

        {includesGenesis || includeLanding ? (
          ''
        ) : chartView ? (
          <div
            className="chart-back-button"
            onClick={() => {
              handleChartView()
              setShowSettings(true)
            }}
          >
            <ArrowBackIcon />
          </div>
        ) : (
          <div
            className="chart-view-button"
            onClick={() => {
              handleChartView()
              setShowSettings(false)
            }}
          />
        )}
        {includesGenesis || includeLanding ? (
          ''
        ) : showSettings ? (
          <div
            className="chart-view-button"
            style={{
              left: '40px',
              background: 'var(--primary-foreground-color)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => {
              dispatch(showWalletForm({}))
              navigate('/app/my_settings')
            }}
          >
            <ManageAccountsIcon
              style={{
                color: selectedThemeRedux === 'Black' ? 'white' : '#171923',
                width: '40px',
                height: '40px',
              }}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default MyWallet
