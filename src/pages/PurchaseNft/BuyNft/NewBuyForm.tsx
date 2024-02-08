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
import Web3 from 'web3'
import { ethers } from 'ethers'
import { Buffer } from 'buffer/'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  IsDevelopment,
  jsonRpcBuy,
  jsonRpcBuy2,
  POLYGON_NETWORK_RPC_URL,
  THEME_COLORS,
  BASE_EXPLORE_URL,
} from '@root/constants'
import { Input } from '@components/Form'
import SearchInput from '@components/Form/SearchInput'
import {
  isMobile,
  sleep,
  truncateDecimals,
  getFlooredFixed,
  getCircleColor,
  toKPIIntegerFormat,
} from '@utils/helpers'
import NewPurchaseSummary from '../components/NewPurchaseSummary'
import PurchaseButton from '../components/PurchaseButton'
import { useDispatch, useSelector } from 'react-redux'
import {
  getWalletDetails,
  setActiveTab,
  showSignupForm,
  showWalletForm,
  getGeneralSettings,
  getLiveBalance,
  getUserXp,
  balanceOfAllowance,
  getQualificationSetting,
  checkTradingStatus,
  tradingStatusExternal,
  getEuroCurrencyRate,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import '@assets/css/pages/PurchaseNft.css'
import classNames from 'classnames'
import {
  fetchSinglePlayer24hStats,
  fetchSinglePlayerStats,
  resetStatsError,
} from '@root/apis/playerStats/playerStatsSlice'
import WertWidget from '@wert-io/widget-initializer'
import TooltipLabel from '@components/TooltipLabel'
import maticIcon from '@assets/images/matic-token-icon.webp'
import usFlagIcon from '@assets/images/us-icon.webp'
import euFlagIcon from '@assets/images/eu-icon.webp'
import visaIcon from '@assets/images/visa-white.webp'
import visaIconBlack from '@assets/images/visa.webp'
import WalletIcon from '@assets/icons/icon/wallet.webp'
import masterCardIcon from '@assets/images/mastercard-large.webp'
import ApplePayIcon from '@assets/images/apple_pay.webp'
import BottomPopup from '@components/Dialog/BottomPopup'
import PaymentMethodCard from '../components/PaymentMethodCard'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import {
  approveTradeCurrency,
  buyPlayerCoinsInCurrency,
  buyTokens,
  fetchPlayersBalance,
  getDefaultMatic,
  getPlayer2Contract,
  getPlayerCoinContract,
  getPlayerDetails,
  getTxnConfirm,
  getUserEarlyAccessNft,
  initPlayer1ContractStatus,
  resetBuyformPlayerContract,
  resetBuyTxnHash,
  resetPlayer1Contract,
  resetTxnConfirmationData,
  setTxnConfirmError,
  setTxnConfirmSuccess,
} from '@root/apis/playerCoins/playerCoinsSlice'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import VerifiedIcon from '@assets/icons/icon/verified.png'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import PurchasePrompt from '../components/PurchasePrompt'
import PaymentOption from '../components/PaymentOption'
import PaymentOptionMatic from '../components/PaymentOptionMatic'
import ImageComponent from '@components/ImageComponent'
import ArrowDownFilled from '@components/Svg/ArrowDownFilled'
import ArrowUpFilled from '@components/Svg/ArrowUpFilled'
import { ConnectContext } from '@root/WalletConnectProvider'
import PlayerImage from '@components/PlayerImage'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { postRequestAuth } from '@root/apis/axiosClientAuth'
import { useWalletHelper } from '@utils/WalletHelper'
import { makeGetRequestAdvance } from '@root/apis/axiosClient'
import { MenuItem } from '@mui/material'
import Select from '@mui/material/Select'
import axios from 'axios'

interface Props {
  playerData?: any
  onClosePopup: any
  onSelectCreditCard?: any
}

interface signinData {
  address: string
  commodity: string
  commodity_amount: any
  sc_address: string
  sc_input_data: string
  network: string
}
interface WertOptions {
  partner_id?: string
  container_id?: string
  currency?: string
  commodities?: any
  click_id: any
  origin?: string
  extra?: any
  listeners?: any
  color_background?: string
  color_buttons?: string
  color_buttons_text?: string
  color_secondary_buttons?: string
  color_secondary_buttons_text?: string
  color_main_text?: string
  color_secondary_text?: string
  color_icons?: string
  color_links?: string
  color_success?: string
  color_warning?: string
  color_error?: string
  signature: any
}

const jsonInterface: any = [
  {
    inputs: [
      { internalType: 'address', name: '_playerContract', type: 'address' },
      { internalType: 'address', name: '_buyOnBehalf', type: 'address' },
      { internalType: 'uint256', name: '_exp', type: 'uint256' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
    ],
    name: 'callMeCarreiraContract',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]
let txnCheckInterval: any = null
let buyInternalTrace: any = null
let payLoadingTimeout: any = null
const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
} as React.CSSProperties
const buyNftInterval: any = null
let player24hChange: any = null
let balanceFetchInterval: any = null
const NewBuyForm: React.FC<Props> = ({
  playerData = null,
  onClosePopup,
  onSelectCreditCard = null,
}) => {
  // @ts-ignore
  // window.Buffer = Buffer
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const walletType = localStorage.getItem('wallet')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [isPayLoading, setPayLoading] = useState(false)
  const [minToken, setMinToken] = useState('0')
  const [isSearchEnabled, setSearchEnabled] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [txnHash, setTxnHash] = useState('')
  const [txnError, setTxnError] = useState('')
  const [stopCalculation, setStopCalculation] = useState(false)
  const [totalSum, setTotalSum] = useState('0')
  const [inProgress, setInProgress] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [inputAmount, setInputAmount] = useState('1')
  const [showApiBottomPopup, setShowApiBottomPopup] = useState(false)
  const [widgetInitiated, setWidgetInitiated] = useState(false)
  const [toBuy, setToBuy] = useState(false)
  const [usdTotal, setUsdTotal] = useState('')
  const [isLoadingMatic, setIsLoadingMatic] = useState(false)
  const [isDisabledMethod, setIsDisabledMethod] = useState(false)
  const [isPurchaseLoading, setPurchaseLoading] = useState(false)
  const [isTradeBuyLoading, setTradeBuyLoading] = useState(false)
  const [count, setCount] = useState(0)
  const [buyDisabled, setBuyDisabled] = useState(true)
  const [delayedLaunching, setDelayedLaunching] = useState(true)
  const [isLoadingTrade, setIsLoadingTrade] = useState(false)
  const [inputChanged, setInputChanged] = useState('')
  const [currencyChanged, setCurrencyChanged] = useState(false)
  const [originalPrice, setOriginalPrice] = useState<any>('')
  const userWalletAddress = localStorage.getItem('userWalletAddress')
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const userWalletAddressUnder = localStorage.getItem('userWalletAddress')
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const {
    fetchSinglePlayerStatsBuy,
    fetchSinglePlayerStatsError,
    amountPassed,
    isProgress,
    fetchSinglePlayer24hStatsData = [],
  } = playerStatsData
  const {
    playerCoinContract,
    playerCoinContractabi,
    isGetPlayerCoinContractSuccess,
    isGetPlayerCoinContractError,
    player1contract,
    player1contractabi,
    player2contract,
    isTxnChecking,
    txnConfirmResp,
    routerabi,
    paymentOptions,
    proxyContract,
    proxyContractAbi,
    routerContract,
    player2contractabi,
    wmatic,
    purchaseContractLoading,
    approvePaymentOptionSuccess,
    getPlayerDetailsSuccessData,
    centralContract, // contract address of Router
    centralContractAbi,
    sharetype,
    isGetPlayer2ContractSuccess,
    sellInCurrencyTxnHash,
    buyInCurrencyTxnHash,
    buyFormPlayerContract,
    buyFormPlayer2contractabi,
    purchaseFormDefaultMatic,
    fetchBalancePlayersData,
  } = useSelector((state: RootState) => state.playercoins)
  const { token = [] } = fetchBalancePlayersData

  const { getWeb3Provider, getBalance } = useWalletHelper()

  const [paymentOptionsTest, setPaymentOptionsTest] = useState(
    new Array(4).fill(null),
  )

  const [showEarlyAccessNft, setShowEarlyAccessNft] = useState(false)
  const [blockDiff, setBlockDiff] = useState(0)
  const [tokenId, setTokenId] = useState(0)
  const [earlyCheckBox, setEarlyCheckBox] = useState(false)
  const [isLoadingEarlyAccessNft, setIsLoadingEarlyAccessNft] = useState(true)

  const [WETHTotalSum, setWETHTotalSum] = useState('')
  const [WBTCTotalSum, setWBTCTotalSum] = useState('')
  const [USDTTotalSum, setUSDTTotalSum] = useState('')
  const [USDCTotalSum, setUSDCTotalSum] = useState('')
  const [isDone, setDone] = useState(false)
  const [approveFly, setApproveFly] = useState(false)
  const [Ticker, setTicker] = useState('')
  const [contract, setContract] = useState('')
  const { getTxnStatus, getBlockNumber } = useContext(ConnectContext)

  const [activeIndex, setActiveIndex] = useState(0)

  const [maxPurchaseAmount, setMaxPurchaseAmount] = useState(-1)
  const [maxPurchaseMatic, setMaxPurchaseMatic] = useState(1)
  const [maxPurchaseMaticTrue, setMaxPurchaseMaticTrue] = useState(false)
  const [maxCoins, setMaxCoins] = useState('0.00')

  const {
    loader,
    userWalletData: { address, balance },
    internalBalanceLive,
    selectedThemeRedux,
    generalSettingsData,
    balanceOfAllowanceData,
    enablecreditcardpurchase,
    checkTradingStatusLoader,
    checkTradingStatusData,
    euroRate,
    isEULocale,
  } = authenticationData
  const isFundsInsufficient = parseFloat(balance || '0') < parseFloat(totalSum)

  const [currency, setCurrency] = useState(isEULocale ? 'EUR' : 'USD')

  const inputRef: any = useRef(null)

  const handleWrapperClick = () => {
    // Set the cursor focus on the input field
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }
  const handleClose = () => {
    setSearchEnabled(false)
  }

  const percentageRef = useRef<any>(null)
  const getPercentageEst = (player: any) => {
    if (player) {
      const oldNumber =
        player['24h_change'] * player?.exchangeRateUSD['24h_rate']
      const newNumber = player['matic'] * player?.exchangeRateUSD['rate']
      const decreaseValue = oldNumber - newNumber
      const percentage = (Math.abs(decreaseValue) / oldNumber) * 100
      let outputPercentage

      if (!isNaN(percentage)) {
        if (isFinite(percentage)) {
          outputPercentage = percentage
        } else {
          outputPercentage = 0.0
        }
      } else {
        outputPercentage = 0.0
      }
      const output = {
        oldNumber,
        newNumber,
        orgPct: percentage,
        percentage: outputPercentage, //isNaN(percentage) ? 0.0 : percentage,
      }
      return output
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

  useEffect(() => {
    const currentContract = playerData?.playercontract
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
    if (approvePaymentOptionSuccess) {
      if (paymentOptions.length === 4) {
        checkApprovedWrapper()
      }
    }
  }, [approvePaymentOptionSuccess])

  useEffect(() => {
    if (!generalSettingsData) {
      dispatch(getGeneralSettings())
    }
  }, [generalSettingsData])

  useEffect(() => {
    if (getPlayerDetailsSuccessData) {
      if (!isDone) {
        setPercentageDifference()
        setDone(true)
      }
    }
    // console.log({ getPlayerDetailsSuccessData })
  }, [getPlayerDetailsSuccessData])

  const setPercentageDifference = () => {
    if (getPlayerDetailsSuccessData) {
      const { exchangeRateUSD, matic } = getPlayerDetailsSuccessData
      // const lastRecordedPrice: any = exchangeRateUSD?.rate * matic
      // const lastRecordedPrice: any = matic
      setOriginalPrice(matic)
    }
  }

  const getPricePercentageDifference = () => {
    if (fetchSinglePlayerStatsBuy.length > 0 && purchaseFormDefaultMatic) {
      const { exchangeRateUSD, matic_without_fee, matic } =
        fetchSinglePlayerStatsBuy[0]
      // const currentPrice = exchangeRateUSD?.rate * matic
      const currentPrice = matic_without_fee || matic
      const priceDiff = currentPrice - purchaseFormDefaultMatic
      const priceDiffPercentage: any =
        (priceDiff / purchaseFormDefaultMatic) * 100
      // return priceDiffPercentage.toFixed(3)
      const re = new RegExp('^-?\\d+(?:.\\d{0,' + (3 || -1) + '})?')
      // console.log({ currentPrice, purchaseFormDefaultMatic, originalPrice })
      return priceDiffPercentage?.toString()?.match(re)[0] || ''
    } else {
      return ''
    }
  }

  useEffect(() => {
    // setPercentageDifference()
    handlePercentageAnimation()
  }, [fetchSinglePlayer24hStatsData])

  const getMyBalance = () => {
    const reqParams = {
      address: loginInfo || address,
    }
    dispatch(fetchPlayersBalance(reqParams))
    if (playerData?.playercontract) {
      dispatch(
        fetchSinglePlayer24hStats({ contracts: playerData?.playercontract }),
      )
    }
  }

  useEffect(() => {
    dispatch(getPlayer2Contract(playerData?.detailpageurl))
    dispatch(getDefaultMatic(playerData?.detailpageurl))
    dispatch(getEuroCurrencyRate())
    getMyBalance()
    setTimeout(() => {
      setDelayedLaunching(false)
    }, 4000)
    // dispatch(getPlayerDetails(playerData?.detailpageurl))
    if (!getPlayerDetailsSuccessData) {
      dispatch(getPlayerDetails(playerData?.detailpageurl))
    }
    clearInterval(balanceFetchInterval)
    balanceFetchInterval = setInterval(() => {
      if (loginId) {
        dispatch(getLiveBalance())
      } else {
        _getBalance()
      }
    }, 5000)
    // setPercentageDifference()
    return () => {
      clearInterval(player24hChange)
      clearInterval(txnCheckInterval)
      clearInterval(balanceFetchInterval)
      clearInterval(buyNftInterval)
      dispatch(resetStatsError())
      dispatch(resetTxnConfirmationData())
      dispatch(resetPlayer1Contract())
      dispatch(resetBuyformPlayerContract())
      // localStorage.removeItem('currentCoinPrice')
    }
  }, [])

  useEffect(() => {
    if (
      buyFormPlayerContract &&
      buyFormPlayer2contractabi &&
      (loginInfo || loginId)
    ) {
      checkEarlyAccessNft()
    }
  }, [buyFormPlayerContract, buyFormPlayer2contractabi])

  useEffect(() => {
    if (showEarlyAccessNft && (loginInfo || loginId)) {
      getLaunchedBlock()
      dispatch(getUserEarlyAccessNft())
    }
  }, [showEarlyAccessNft])

  const checkEarlyAccessNft = async () => {
    try {
      if (loginInfo) {
        const provider = await getWeb3Provider()
        const playerContract = new ethers.Contract(
          buyFormPlayerContract, // contract address of Router
          buyFormPlayer2contractabi, //  contract abi of Router
          provider.getSigner(loginId ? userWalletAddressUnder! : loginInfo!), // signer of the currently logged in user wallet address
        )
        try {
          const result = await playerContract.getMaxPurchase()
          const limit = Number(result._hex) / 10 ** 18
          setMaxPurchaseMatic(Math.floor(limit))
          setMaxPurchaseMaticTrue(true)
        } catch (err: any) {
          console.log({ err })
        }

        let result = await playerContract.genesisRequired()
        console.log({ result, player2contract })
        if (!result) {
          setIsLoadingEarlyAccessNft(false)
          return false
        }

        const generalContract = new ethers.Contract(
          centralContract, // contract address of Router
          centralContractAbi,
          provider.getSigner(loginId ? userWalletAddressUnder! : loginInfo!), // signer of the currently logged in user wallet address
        )
        result = await generalContract.genesisEnabled()
        console.log({ result, player2contract })
        if (!result) {
          setIsLoadingEarlyAccessNft(false)
          return false
        }
      } else {
        let result = await makeGetRequestAdvance(
          `players/early_access_passed/?player_contract=${player2contract}`,
        )
        if (result?.data?.data) {
          setIsLoadingEarlyAccessNft(false)
          return false
        }

        result = await makeGetRequestAdvance('players/early_access_enabled')
        if (result?.data?.data === false) {
          setIsLoadingEarlyAccessNft(false)
          return false
        }
      }
      setShowEarlyAccessNft(true)
    } catch (err: any) {
      console.log({ err })
      setIsLoadingEarlyAccessNft(false)
    }
  }

  const getLaunchedBlock = async () => {
    try {
      const currentBlack = await getBlockNumber()
      const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
        POLYGON_NETWORK_RPC_URL,
      )
      const playerContract = new ethers.Contract(
        player2contract, // contract address of Router
        player2contractabi, //  contract abi of Router
        simpleRpcProvider.getSigner(
          loginId ? userWalletAddressUnder! : loginInfo!,
        ), // signer of the currently logged in user wallet address
      )
      const launchedBlock = await playerContract.launchedBlock()

      const generalContract = new ethers.Contract(
        centralContract, // contract address of Router
        centralContractAbi,
        simpleRpcProvider.getSigner(
          loginId ? userWalletAddressUnder! : loginInfo!,
        ), // signer of the currently logged in user wallet address
      )
      const earlyAccessPeriod = await generalContract.genesisPeriod()
      setBlockDiff(
        Number(earlyAccessPeriod) +
          Number(launchedBlock._hex) -
          Number(currentBlack),
      )
    } catch (err: any) {
      console.log({ err })
    }
    setIsLoadingEarlyAccessNft(false)
  }

  useEffect(() => {
    if (txnHash) {
      handleTxnCheck()
    }
  }, [txnHash])

  useEffect(() => {
    if (buyInCurrencyTxnHash && loginId) {
      dispatch(getTxnConfirm(buyInCurrencyTxnHash))
      clearInterval(buyInternalTrace)
      buyInternalTrace = setInterval(async () => {
        console.log('gsmtxc')
        dispatch(getTxnConfirm(buyInCurrencyTxnHash))
      }, 5000)
    }
  }, [buyInCurrencyTxnHash])

  const handleTxnCheck = () => {
    if (loginInfo) {
      getTxnStatus(txnHash)
        .then(txn => dispatch(setTxnConfirmSuccess(txn?.status)))
        .catch(() => dispatch(setTxnConfirmError()))
    } else {
      dispatch(getTxnConfirm(txnHash))
      clearInterval(txnCheckInterval)
      txnCheckInterval = setInterval(() => {
        dispatch(getTxnConfirm(txnHash))
      }, 10000)
    }
  }
  const [paymentMode, setPaymentMode] = useState('')

  useEffect(() => {
    console.log({ txnConfirmResp })
    if (
      txnConfirmResp[0]?.haserror === 0 ||
      txnConfirmResp[0]?.haserror === 1 ||
      txnConfirmResp?.message === 'Transaction failed' ||
      txnConfirmResp?.message === 'Transaction success'
    ) {
      console.log('fail_finish')
      clearInterval(txnCheckInterval)
      clearInterval(buyInternalTrace)
    }
  }, [txnConfirmResp])

  useEffect(() => {
    if (isPayLoading) {
      clearTimeout(payLoadingTimeout)
      payLoadingTimeout = setTimeout(() => {
        setPayLoading(false)
      }, 1000)
    }
  }, [isPayLoading])

  const handleBuy = async () => {
    setTradeBuyLoading(false)
    if (loginInfo) {
      getBalance()
    }
    if (loginId || loginInfo) {
      if (address || loginInfo || userWalletAddress) {
        setStopCalculation(true)
        await clearInterval(buyNftInterval)
        setToBuy(true)
        setPayLoading(true)
      } else {
        // return
        toast.error(t('please create a wallet first'))
        dispatch(showWalletForm({ isMandatory: true }))
      }
    } else {
      toast.error(t('please login to continue'))
      if (!isMobile()) {
        await handleClosePopup()
      }
      dispatch(setActiveTab('login'))
      dispatch(showSignupForm())
    }
  }

  const handleClosePopup = () => {
    onClosePopup()
  }

  const handleGetPriceStats = (playersData: any) => {
    const { exchangeRateUSD, matic } = playerData
    const rpcAmt =
      parseInt(
        Math.ceil(2 / parseFloat(getPlayerDetailsSuccessData?.matic)).toFixed(
          3,
        ),
      ) + 1
    if (['', '0'].includes(inputAmount)) {
      setInputAmount(minToken)
    }
    dispatch(
      fetchSinglePlayerStats({
        contracts: playersData,
        query: 'RPC',
        formType: 'BUY',
        amount:
          parseFloat(inputAmount) > 0
            ? getPlayerCoins()
            : parseFloat(minToken) > 0
            ? minToken
            : 1,
      }),
    )
  }

  useEffect(() => {
    if (playerData.playercontract) {
      // handleGetPriceStats([playerData.playercontract])
      clearInterval(buyNftInterval)
      clearInterval(player24hChange)
      player24hChange = setInterval(() => {
        dispatch(
          fetchSinglePlayer24hStats({ contracts: playerData.playercontract }),
        )
      }, 30000)
    }
  }, [playerData])

  useEffect(() => {
    clearInterval(txnCheckInterval)
    clearInterval(player24hChange)
    if (!document.hidden) {
      if (txnHash) {
        handleTxnCheck()
      }
      if (playerData.playercontract) {
        player24hChange = setInterval(() => {
          dispatch(
            fetchSinglePlayer24hStats({ contracts: playerData.playercontract }),
          )
        }, 30000)
      }
    }
  }, [document.hidden])

  const calculateTotal = async () => {
    setCount(count + 1)
    let total: any = null
    if (inputAmount !== '0' && inputAmount !== '') {
      total = parseFloat(inputAmount)
      if (currency !== 'MATIC') {
        total =
          total /
          parseFloat(fetchSinglePlayerStatsBuy[0]?.exchangeRateUSD?.rate)
        if (currency === 'EUR') {
          total = total / euroRate
        }
      }
    } else {
      total = 0
    }

    const absTotal = parseFloat(total).toFixed(5) //truncateDecimals(total, 4)
    const WETHTotal = parseFloat(fetchSinglePlayerStatsBuy[0]?.WETH).toFixed(8)
    const WBTCTotal = parseFloat(fetchSinglePlayerStatsBuy[0]?.WBTC).toFixed(8)
    const USDTTotal = parseFloat(fetchSinglePlayerStatsBuy[0]?.USDT).toFixed(8)
    const USDCTotal = parseFloat(fetchSinglePlayerStatsBuy[0]?.USDC).toFixed(8)
    setTotalSum(absTotal.toString())
    setWETHTotalSum(WETHTotal.toString())
    setWBTCTotalSum(WBTCTotal.toString())
    setUSDTTotalSum(USDTTotal.toString())
    setUSDCTotalSum(USDCTotal.toString())
  }

  const getPlayerCoins = () => {
    if (!fetchSinglePlayerStatsBuy[0]?.matic || parseFloat(totalSum) <= 0) {
      return '1.00'
    }
    let total: any = null
    if (inputAmount !== '0' && inputAmount !== '') {
      total = parseFloat(inputAmount)
      if (currency !== 'MATIC') {
        total =
          total /
          parseFloat(fetchSinglePlayerStatsBuy[0]?.exchangeRateUSD?.rate)
        if (currency === 'EUR') {
          total = total / euroRate
        }
      }
    } else {
      total = 0
    }
    if (total > maxPurchaseMatic) {
      total = maxPurchaseMatic
    }
    return getFlooredFixed(
      total / parseFloat(fetchSinglePlayerStatsBuy[0]?.matic),
      4,
    )
  }

  const _getBalance = async () => {
    if (loginInfo) {
      await getBalance()
    }
  }

  useEffect(() => {
    getBuyDetails()
    dispatch(getQualificationSetting())
    if (localStorage.getItem('loginId')) {
      dispatch(getWalletDetails()) //COMMENTED FOR PROD
    }
  }, [])
  const [defaultAmount, setDefaultAmount] = useState(false)

  const { callWeb3Method } = useWalletHelper()
  const [buyMatic, setBuyMatic] = useState(1)
  const [buyMaticTrue, setBuyMaticTrue] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('loginId')) {
      return
    }
    console.log({ centralContract, centralContractAbi })
    if (centralContract && centralContractAbi) {
      const promise = callWeb3Method(
        'minBuyMatic',
        centralContract,
        centralContractAbi,
        [],
      )
      promise
        .then((txn: any) => {
          // setTxnHash(txn.hash)
          const minBuyMatic = parseInt(txn?._hex) / 1000000000000000000
          console.log('minBuyMatic', { txn, minBuyMatic })
          setBuyMatic(minBuyMatic)
          setBuyMaticTrue(true)
        })
        .catch((err: any) => {
          console.log('minBuyTokenERr::', err)
          if (err.message === '406') {
            console.log(t('this functionality unavailable for internal users'))
          } else {
            console.log(err.reason || err.message)
          }
        })
    }
  }, [centralContract, centralContractAbi])

  useEffect(() => {
    calculateTotal()
    if (fetchSinglePlayerStatsBuy.length > 0 && buyMaticTrue) {
      const minAmt: any =
        parseInt(
          Math.ceil(
            buyMatic / parseFloat(fetchSinglePlayerStatsBuy[0]?.matic),
          ).toFixed(3),
        ) + 1
      if (parseInt(inputAmount) === 1) {
        setMinToken(parseFloat(minAmt).toFixed(0))
        setDefaultAmount(true)
      }
    }
    if (fetchSinglePlayerStatsBuy.length > 0 && maxPurchaseMaticTrue) {
      setMaxPurchaseAmount(
        Math.floor(
          maxPurchaseMatic / parseFloat(fetchSinglePlayerStatsBuy[0]?.matic),
        ),
      )
    }
  }, [fetchSinglePlayerStatsBuy[0], buyMaticTrue, maxPurchaseMaticTrue])

  useEffect(() => {
    if (defaultAmount) {
      setInputAmount(inputChanged || minToken)
    }
  }, [defaultAmount, minToken])

  useEffect(() => {
    if (inputChanged || currencyChanged) {
      dispatch(
        fetchSinglePlayerStats({
          contracts: [playerData.playercontract],
          query: 'RPC',
          formType: 'BUY',
          amount:
            parseFloat(inputAmount) > 0
              ? getPlayerCoins()
              : parseFloat(inputChanged)
              ? inputChanged
              : 1,
        }),
      )
    } else if (inputAmount === '') {
      // dispatch(
      //   fetchSinglePlayerStats({
      //     contracts: [playerData.playercontract],
      //     query: 'RPC',
      //     formType: 'BUY',
      //     amount: 1,
      //   }),
      // )
    }
    if (
      parseInt(amountPassed) === 1 &&
      inputAmount &&
      parseInt(inputAmount) !== 1
    ) {
      console.log('nbhrpcCall3', { inputAmount, amountPassed })
      dispatch(
        fetchSinglePlayerStats({
          contracts: [playerData.playercontract],
          query: 'RPC',
          formType: 'BUY',
          amount: parseFloat(getPlayerCoins()),
        }),
      )
    }
  }, [inputAmount, inputChanged, currency])

  const getBuyDetails = async () => {
    setInProgress(true)
    for (let i = 0; i < 2; i++) {
      await sleep(i * 1000)
    }
    setInProgress(false)
  }

  const getCallback = () => {
    handleGetPriceStats([playerData.playercontract])
  }

  const handleWertInput = async () => {
    if (parseFloat(totalSum) > 1.9) {
      if (enablecreditcardpurchase) {
        try {
          onSelectCreditCard('hide')
          setInProgress(true)
          setWidgetInitiated(true)
          setToBuy(false)
          const web3 = new Web3(Web3.givenProvider)
          const meCarreiraContract = new web3.eth.Contract(
            jsonInterface,
            generalSettingsData?.proxy_contract,
          )
          const staticWei = Web3.utils.toWei(getPlayerCoins(), 'ether')
          const web3jsSc = meCarreiraContract.methods
            .callMeCarreiraContract(
              player2contract,
              loginInfo,
              staticWei,
              tokenId,
            )
            .encodeABI()

          const signOptions: signinData = {
            address: loginInfo,
            commodity: 'MATIC',
            commodity_amount: truncateDecimals(parseFloat(totalSum), 2),
            network:
              process.env.REACT_APP_POLYGON_NETWORK === 'MAINNET'
                ? 'network'
                : 'mumbai',
            sc_address: generalSettingsData?.proxy_contract,
            sc_input_data: web3jsSc,
          }

          const result = await postRequestAuth(
            'players/get_wert_signature/',
            signOptions,
          )
          if (!result?.data?.success) {
            console.log('Failed signedData with API', result?.data)
            toast.error('Failed to generate signature')
          }

          const widgetOptions: WertOptions = {
            partner_id: process.env.REACT_APP_WERT_PARTNER_ID,
            container_id: 'purchase-box',
            // skip_init_navigation: true,
            click_id: uuidv4(),
            currency: 'USD',
            origin: process.env.REACT_APP_WERT_ORIGIN,
            color_background:
              THEME_COLORS[selectedThemeRedux]['PrimaryBackground'],
            color_buttons:
              THEME_COLORS[selectedThemeRedux]['SecondaryForeground'],
            color_buttons_text:
              THEME_COLORS[selectedThemeRedux]['PrimaryBackground'],
            color_main_text: THEME_COLORS[selectedThemeRedux]['SecondaryText'],
            signature: result?.data.signed_data.toUpperCase(),
            listeners: {
              position: (data: any) => console.log('step:', data),
              close: (evt: any) => handleCloseToast(),
              error: (error: any) => console.log('ERROR_WERT:', error),
              loaded: () => {
                // iframeElement[0].style.zIndex = 'unset'
              },
            },
          }

          const wertData = {
            ...signOptions,
            ...widgetOptions,
          }

          console.log('-------wertData-------', wertData)

          const wertWidget = new WertWidget(wertData)

          let mountTime: any = null
          clearTimeout(mountTime)
          wertWidget.mount()

          const purchaseBox = document.getElementById('purchase-box')
          const iframe = purchaseBox.getElementsByTagName('iframe')[0]
          if (iframe) {
            purchaseBox.removeChild(iframe)
          }
          const iframeLength = document.getElementsByTagName('iframe').length
          document.getElementsByTagName('iframe')[
            iframeLength - 1
          ].style.position = 'relative'
          document
            .getElementById('purchase-box')
            .append(document.getElementsByTagName('iframe')[iframeLength - 1])

          mountTime = setTimeout(() => {
            setInProgress(false)
          }, 5000)
        } catch (error) {
          console.log('werterror---', error)
        }
      } else {
        toast.error(t('this feature is not yet enabled'))
      }
    } else {
      toast.error(t('minimum 2 MATIC required'))
    }
  }

  const handleMaticSend = () => {
    if (IsDevelopment) {
      setTxnError('')
      setTxnHash('')
      setIsDisabledMethod(true)
      const data = {
        url: playerData?.detailpageurl,
      }
      dispatch(getPlayerCoinContract(data))
      if (walletType) {
        setPurchaseLoading(true)
        setIsLoadingMatic(true) // revert
        setLoaded(true)
      } else {
        setToBuy(false)
        setShowApiBottomPopup(true)
        return
      }
    } else {
      toast.error(t('this feature is not yet enabled'))
    }
  }

  const buyforExternalWallet = async () => {
    const provider = await getWeb3Provider()
    const playerContract = new ethers.Contract(
      playerCoinContract, // player contract address of the player coin
      playerCoinContractabi, // player contract abi of the player coin
      provider.getSigner(loginInfo!), // signer of the currently logged in user wallet address
    )
    try {
      const exp = await playerContract.getBuyPriceMatic(
        ethers.utils.parseEther(totalSum),
      )
      const options = {
        value: ethers.utils.parseEther(totalSum),
        _exp: Web3.utils.toWei(
          Number(Number(exp._hex) / 10 ** 18).toString(),
          'ether',
        ),
        _tokenId: tokenId,
      }
      const tx = await playerContract.buyToken(options._exp, options._tokenId, {
        gasLimit: ethers.utils.hexlify(2000000),
        value: options.value,
      })
      setIsLoadingMatic(false)
      setIsDisabledMethod(false)
      setTxnHash(tx.hash)
      // dispatch(clearPlayer1ContractSuccess())
    } catch (err: any) {
      console.log('txnErrBuy', err)
      if (`${err}`.includes('gas required exceeds allowance')) {
        setTxnError('Insufficient funds to pay Gas fees')
      }
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

  const handleBuyApi = (user_secret: any) => {
    const formData = new FormData()
    if (paymentMode === '') {
      formData.append('contract', playerData?.playercontract)
      formData.append('user_secret', user_secret)
      formData.append('amount', totalSum)
      formData.append('token_id', tokenId.toString())
      formData.append(
        'player_coins',
        parseInt(inputAmount) === 0 ? '1' : getPlayerCoins(),
      )
      dispatch(buyTokens(formData))
    } else if (paymentMode === 'approve') {
      formData.append('user_secret', user_secret)
      formData.append('player_contract', playerData?.playercontract)
      formData.append('currency_contract', contract)
      formData.append('form_type', 'BUY')
      dispatch(approveTradeCurrency(formData))
    } else if (paymentMode === 'buyInternal') {
      console.log('HBAPI')
      try {
        const buyingAmount: any =
          Ticker === 'WETH'
            ? WETHTotalSum
            : Ticker === 'USDT'
            ? USDTTotalSum
            : Ticker === 'USDC'
            ? USDCTotalSum
            : Ticker === 'WBTC'
            ? WBTCTotalSum
            : '0.001'
        formData.append('user_secret', user_secret)
        formData.append('player_contract', playerData?.playercontract)
        formData.append('amount', buyingAmount)
        formData.append('ticker', Ticker)
        formData.append('expected_amount', getPlayerCoins())
        formData.append('token_id', tokenId.toString())
        dispatch(buyPlayerCoinsInCurrency(formData))
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleCloseBottomPopup = () => {
    if (txnConfirmResp.length > 0 && txnConfirmResp[0]?.haserror === 0) {
      setInputAmount(minToken)
      getMyBalance()
    }
    clearInterval(txnCheckInterval)
    setPurchaseLoading(false)
    setTxnHash('')
    setTxnError('')
    handleCloseToast()
    dispatch(resetTxnConfirmationData())
    dispatch(getDefaultMatic(playerData?.detailpageurl))
  }

  useEffect(() => {
    if (loaded && isGetPlayerCoinContractSuccess) {
      if (loginInfo) {
        if (
          playerData?.playerstatusid?.id === 5 ||
          playerData?.playerlevelid === 5
        ) {
          // buyforExternalWalletPro()
          buyforExternalWallet()
        } else {
          buyforExternalWallet()
        }
      }
      dispatch(initPlayer1ContractStatus())
    }
  }, [isGetPlayerCoinContractSuccess, isGetPlayerCoinContractError])

  const fetchLiveTotalUsd = (value: string) => {
    setUsdTotal(value)
  }

  const handleCloseToast = () => {
    setStopCalculation(false)
    setToBuy(false)
    setIsLoadingMatic(false)
    setIsDisabledMethod(false)
    setApproveFly(false)
  }

  const handleAbortPurchase = () => {
    setPurchaseLoading(false)
    setIsLoadingMatic(false)
    handleCloseToast()
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
      if (showEarlyAccessNft) {
        setTimeout(() => dispatch(getUserEarlyAccessNft()), 1000)
      }
    }
  }, [isTxnChecking, txnConfirmResp[0]])
  const onTradeBuy = async el => {
    setTradeBuyLoading(true)
    setIsLoadingTrade(true)
    setTxnHash('')
    setTxnError('')
    if (el?.isMethodApproved) {
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        proxyContract, // contract address of Router
        proxyContractAbi, //  contract abi of Router
        provider.getSigner(loginInfo!), // signer of the currently logged in user wallet address
      )
      const playerContractAddress = Web3.utils.toChecksumAddress(
        player1contract || player2contract,
      )
      try {
        const options = {
          amount: ethers.utils.parseEther(
            el?.ticker === 'WETH'
              ? WETHTotalSum
              : el?.ticker === 'USDT'
              ? USDTTotalSum
              : el?.ticker === 'USDC'
              ? USDCTotalSum
              : el?.ticker === 'WBTC'
              ? WBTCTotalSum
              : '0.001',
          ),
          playerContract: player1contract || player2contract,
          buyOnBehalf: loginInfo,
          token: el?.ticker,
          poolFee: IsDevelopment
            ? el?.ticker === 'USDT'
              ? '100'
              : '3000'
            : '0',
          exp: ethers.utils.parseEther(getPlayerCoins()),
          tokenId: tokenId,
        }
        const tx = await playerContract.tradeBuy(
          playerContractAddress,
          // options.buyOnBehalf,
          options.token,
          options.amount,
          options.poolFee,
          options.exp,
          options.tokenId,
          {
            gasLimit: ethers.utils.hexlify(1000000),
          },
        )
        setPurchaseLoading(true)
        setIsLoadingMatic(false)
        setIsLoadingTrade(false)
        setIsDisabledMethod(false)
        setApproveFly(false)
        setTxnHash(tx.hash)
      } catch (err: any) {
        console.log('txnErrTradeBuy', err)
        setIsLoadingTrade(false)
        setTxnError(err.reason || err.message)
      }
    }
  }

  const checkApproved = async (el, ind) => {
    const currencyContract = el?.contract
    const ticker = el?.ticker
    if (walletType) {
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        currencyContract, // contract address of Router
        player2contractabi, //  contract abi of Router
        provider.getSigner(loginInfo!),
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

        const tx = await playerContract.allowance(loginInfo, proxyContract)
        const number = parseInt(tx._hex)
        const restData: any = paymentOptionsTest
        restData[ind] = {
          ...el,
          isMethodApproved: number > 0 ? true : false,
          availableBalance: balance1,
        }
        setPaymentOptionsTest(restData)
      } catch (err: any) {
        console.log('txnerror13', err)
        setTxnError(err.reason || err.message)
      }
    } else if (loginId) {
      console.log('CHECKAPPROVED_NO_RUN_FOR_INTERNAL_USER')
    }
  }

  const checkApprovedWrapper = async () => {
    console.log('CHECKAPPROVEDCALLED')
    try {
      if (loginInfo) {
        console.log('CAW---CHECKAPPROVEDCALL')
        for (let i = 0; i < paymentOptions.length; i++) {
          await sleep(100)
          checkApproved(paymentOptions[i], i)
        }
      } else if (loginId) {
        console.log('CAW---BALANCEOFALLOWANCE')
        dispatch(
          balanceOfAllowance({
            spender: generalSettingsData?.proxy_contract_coins,
          }),
        )
      }
    } catch (err) {
      console.log('cawerr', err)
    }
  }

  useEffect(() => {
    if (paymentOptions.length === 4) {
      checkApprovedWrapper()
    }
  }, [paymentOptions])

  useEffect(() => {
    if (balanceOfAllowanceData && paymentOptions) {
      const temp = paymentOptions.map(item => {
        return {
          ...item,
          isMethodApproved:
            balanceOfAllowanceData[item.ticker].allowance > 0 ? true : false,
          availableBalance: balanceOfAllowanceData[item.ticker].balanceof,
        }
      })
      setPaymentOptionsTest(temp)
    }
  }, [paymentOptions, balanceOfAllowanceData])

  const handleBuyWithPaymentMethod = (el: any) => {
    if (el?.isMethodApproved) {
      if (loginInfo) {
        onTradeBuy(el)
      } else {
        onBuyForInternal(el)
      }
    }
  }

  const onBuyForInternal = (el: any) => {
    setPaymentMode('buyInternal')
    setContract(playerData?.playercontract)
    setTicker(el?.ticker)
    setToBuy(false)
    setShowApiBottomPopup(true)
  }

  const handleApproveMethod = (el: any) => {
    if (loginInfo) {
      setShowApiBottomPopup(false)
      setPaymentMode('approve')
      setContract(el?.contract)
      setTicker(el?.ticker)
      setApproveFly(true)
    } else {
      setPaymentMode('approve')
      setContract(el?.contract)
      setTicker(el?.ticker)
      setToBuy(false)
      setShowApiBottomPopup(true)
    }
  }

  const handleBottomClose = () => {
    setPaymentMode('')
    setInputAmount(minToken)
    getMyBalance()
    setShowApiBottomPopup(false)
    setStopCalculation(false)
    dispatch(resetBuyTxnHash())
    dispatch(getDefaultMatic(playerData?.detailpageurl))
    if (approvePaymentOptionSuccess && paymentOptions.length === 4) {
      checkApprovedWrapper()
    }
    dispatch(getPlayerDetails(playerData?.detailpageurl))
  }

  const getPriceImpactstyle = () => {
    if (getPricePercentageDifference() < 0) {
      return 'number-color loss'
    }
    return 'number-color profit'
  }

  const getWalletBalance = () => {
    const currentBalance: string = localStorage.getItem('balance') ?? '0'
    if (loginInfo) {
      if (parseFloat(currentBalance) < parseFloat(totalSum)) {
        return true
      } else {
        return false
      }
    } else if (loginId && internalBalanceLive !== null) {
      if (Number(internalBalanceLive) < Number(totalSum)) {
        // console.log('true totalSum')
        return true
      } else {
        return false
      }
    }
  }

  const getUsdTotal = () => {
    try {
      const usdTotal: any =
        parseFloat(totalSum) *
        fetchSinglePlayerStatsBuy[0]?.exchangeRateUSD?.rate
      const absTotal: any = getFlooredFixed(parseFloat(usdTotal), 3) //truncateDecimals(usdTotal, 3)
      return absTotal
    } catch (err) {
      return ''
    }
  }

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
    <div
      className={classNames(
        'new-purchase-container buy-form',
        isMobile() ? 'purchase-container-mobile' : 'purchase-container',
        widgetInitiated ? 'rounded-corners' : '',
      )}
    >
      <HotToaster />
      {isMobile() ? (
        <div
          id="purchase-box"
          className={classnames(widgetInitiated ? 'wert-widget-wrapper' : '')}
        />
      ) : (
        <BottomPopup
          mode={isMobile() ? 'wallet wert-topup' : 'wallet'}
          isOpen={widgetInitiated}
        >
          <div id="purchase-box" className={'wert-widget-wrapper'}>
            <div
              className={classnames(
                'loading-spinner-container mt-240 position-absolute',
                inProgress ? 'show' : '',
              )}
            >
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            </div>
          </div>
          <div
            className={classNames(
              'green-line-btn',
              isMobile() ? 'close-button-wert' : 'close-button',
            )}
            onClick={() => {
              setWidgetInitiated(false)
              setStopCalculation(false)
            }}
          >
            {t('close')}
          </div>
        </BottomPopup>
      )}
      {!fetchSinglePlayerStatsError ? (
        <div
          className={classnames(
            'balance-progress',
            loader ||
              inProgress ||
              isLoadingEarlyAccessNft ||
              fetchSinglePlayerStatsBuy[0]?.matic === undefined
              ? ''
              : 'hidden',
          )}
        >
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
          onSubmit={handleBuyApi}
          paymentMode={paymentMode}
          onClose={() => handleBottomClose()}
          customClass="purchase-pc-bottomwrapper"
        />
      )}
      <BottomPopup
        mode={`wallet ${isMobile() ? 'exwallet-bottomwrapper' : ''}`}
        isOpen={toBuy}
      >
        {isPurchaseLoading || isTradeBuyLoading ? (
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

            {(isLoadingMatic && !txnHash && !txnError) || isLoadingTrade ? (
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
                        <div
                          className={classNames('spinner check-spinner')}
                        ></div>
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
                <div className="close-button" onClick={handleCloseBottomPopup}>
                  {t('close')}
                </div>
              </>
            )}
            <ReactCanvasConfetti
              refConfetti={getInstance}
              style={canvasStyles}
            />
          </section>
        ) : showApiBottomPopup ? (
          ''
        ) : approveFly ? (
          <PurchasePrompt
            promptText={`Allow Trading with ${Ticker} ?`}
            walletAddress={'nbxavcwv253468754cwncbcjhsb'}
            actionMode="approveFly"
            onClose={() => {
              setApproveFly(false)
            }}
            contract={contract}
            callBack={checkApprovedWrapper}
          />
        ) : (
          <div className="available-methods-container">
            <div
              className="terms-subtitle ct-h4 select-pay-title h-none"
              style={{ marginBottom: '10px !important' }}
            >
              {t('select payment method')}
            </div>
            <div
              className="methods-box"
              style={{
                height: isMobile() ? '82%' : 'calc(min(490px, 59vh))',
                marginTop: '20px',
              }}
            >
              <PaymentMethodCard
                title=""
                logoSet={[
                  {
                    id: 1,
                    img:
                      selectedThemeRedux === 'Light' ||
                      selectedThemeRedux === 'Ladies' ||
                      selectedThemeRedux === 'Black'
                        ? visaIconBlack
                        : visaIcon,
                    class: 'visa-method-logo',
                  },
                  { id: 2, img: masterCardIcon, class: 'mc-method-logo' },
                  { id: 3, img: ApplePayIcon, class: 'mc-method-logo' },
                ]}
                labelBottom={t('total estimated in USD')}
                // valueBottom={usdTotal}
                valueBottom={getUsdTotal()}
                unit="dollar"
                onSelect={handleWertInput}
                isDisabled={isDisabledMethod}
                label2Bottom={''} // isInsufficientMatics={isFundsInsufficient}
              />
              <PaymentOptionMatic
                valueBottom={totalSum}
                onSelect={handleMaticSend}
                isInsufficientMatics={getWalletBalance()}
              />
              {paymentOptions.length > 0 &&
                fetchSinglePlayerStatsBuy.length > 0 &&
                paymentOptionsTest?.map((el, ind) => {
                  return (
                    <PaymentOption
                      key={ind}
                      element={el}
                      optionIndex={ind}
                      WETHTotalSum={WETHTotalSum}
                      USDTTotalSum={USDTTotalSum}
                      USDCTotalSum={USDCTotalSum}
                      WBTCTotalSum={WBTCTotalSum}
                      payItem={paymentOptionsTest[ind]}
                      handleBuyWithPaymentMethod={() =>
                        handleBuyWithPaymentMethod(el)
                      }
                      handleApproveMethod={() => handleApproveMethod(el)}
                    />
                  )
                })}
            </div>
            <div
              className="deposit-cancel"
              style={{ marginTop: '10px !important' }}
              onClick={handleCloseToast}
            >
              {t('close')}
            </div>
          </div>
        )}
      </BottomPopup>
      <div
        className={classnames(
          'purchase-wrappper',
          (loader ||
            inProgress ||
            isLoadingEarlyAccessNft ||
            fetchSinglePlayerStatsBuy[0]?.matic === undefined) &&
            !fetchSinglePlayerStatsError
            ? 'hidden'
            : '',
        )}
      >
        <div className="player-title-section">
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
                    <h6>{playerData?.name}</h6>
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
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={{ price: inputAmount }}
          onSubmit={async () => {
            handleBuy()
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
            } = props
            return (
              <form
                onSubmit={(event: any) => event.preventDefault()}
                autoComplete={'off'}
                onKeyDown={(event: any) => event.key !== 'Enter'}
              >
                <div className="purchase-form">
                  <div className="form-label-wrapper share-info-wrapper">
                    {sharetype === 0 ? (
                      <>
                        <InfoOutlinedIcon
                          sx={{
                            color: '#c9a009 !important',
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                          }}
                        />
                        <label
                          htmlFor="playerPrice"
                          className="share-info-label golden"
                        >
                          {t('you are buying fanclub shares')}
                        </label>
                      </>
                    ) : !sharetype ? (
                      ''
                    ) : (
                      <>
                        <ImageComponent
                          src={VerifiedIcon}
                          alt=""
                          loading="lazy"
                          title={t('official')}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                          }}
                        />
                        <label
                          htmlFor="playerPrice"
                          className="share-info-label light-blue"
                        >
                          {t('you are buying member shares')}
                        </label>
                      </>
                    )}
                  </div>
                  <div
                    className={classNames(
                      'purchase-input-container',
                      isCalculating ? 'input-disabled' : '',
                    )}
                    onClick={handleWrapperClick}
                  >
                    <Select
                      className="currency-select"
                      value={currency}
                      onChange={evt => {
                        setCurrencyChanged(true)
                        setCurrency(evt.target.value)
                      }}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      // sx={{
                      //   width: '105px',
                      // }}
                    >
                      <MenuItem
                        value={'USD'}
                        sx={{
                          display: 'flex',
                          gap: '10px',
                          minWidth: '130px',
                          alignItems: 'center',
                          color: 'black',
                        }}
                      >
                        <ImageComponent
                          src={usFlagIcon}
                          alt=""
                          className="currency-item-img"
                        />
                        <div className="currency-item-symbol">USD</div>
                      </MenuItem>
                      <MenuItem
                        value={'EUR'}
                        sx={{
                          display: 'flex',
                          gap: '10px',
                          minWidth: '130px',
                          alignItems: 'center',
                          color: 'black',
                        }}
                      >
                        <ImageComponent
                          src={euFlagIcon}
                          alt=""
                          className="currency-item-img"
                        />
                        <div className="currency-item-symbol">EUR</div>
                      </MenuItem>
                      <MenuItem
                        value={'MATIC'}
                        sx={{
                          display: 'flex',
                          gap: '10px',
                          minWidth: '130px',
                          alignItems: 'center',
                          color: 'black',
                        }}
                      >
                        <ImageComponent
                          src={maticIcon}
                          alt=""
                          className="currency-item-img"
                        />
                        <div className="currency-item-symbol">MATIC</div>
                      </MenuItem>
                    </Select>
                    <Input
                      id="buy_price"
                      inputRef={inputRef}
                      name="price"
                      type={isMobile() ? 'number' : 'number'}
                      placeholder={t('amount')}
                      className={classnames(
                        'input-box',
                        isCalculating ? 'input-disabled' : '',
                      )}
                      value={inputAmount}
                      maxLength={10}
                      onChange={(event: any) => {
                        const value = event.target.value
                        const decimalMatch = value.match(/\.\d*$/)
                        if (!isCalculating) {
                          if (decimalMatch && decimalMatch[0].length - 1 > 5) {
                            return
                          }
                          handleChange(event)
                          if (value < 0) {
                            setInputAmount('1')
                            setInputChanged('1')
                          } else {
                            setInputAmount(value)
                            setInputChanged(value)
                          }
                          setDelayedLaunching(false)
                        }
                      }}
                      onBlur={handleBlur}
                      onFocus={() => console.log('')}
                    />
                  </div>
                  {minToken &&
                  defaultAmount &&
                  (parseFloat(getPlayerCoins()) < parseFloat(minToken) ||
                    !getPlayerCoins()) ? (
                    <div className="mt-5 min_matic_error">
                      {t('minimum_purchase_of') +
                        ' ' +
                        minToken +
                        ' ' +
                        t('member_shares_is_required')}
                    </div>
                  ) : !isProgress &&
                    maxPurchaseAmount > 0 &&
                    parseFloat(getPlayerCoins()) > maxPurchaseAmount ? (
                    <div className="mt-5 min_matic_error">
                      {t('You can maximum buy') +
                        ' ' +
                        toKPIIntegerFormat(maxPurchaseAmount) +
                        ' ' +
                        t('Member Token at this moment')}
                    </div>
                  ) : null}
                </div>
                <NewPurchaseSummary
                  estimatedValue={fetchSinglePlayerStatsBuy[0]?.matic}
                  coinIssued={fetchSinglePlayer24hStatsData[0]?.coin_issued}
                  maxCoins={maxCoins}
                  totalValue={totalSum}
                  priceImpact={getPricePercentageDifference()}
                  priceImpactStyle={getPriceImpactstyle()}
                  inProgress={isCalculating}
                  usdRate={fetchSinglePlayerStatsBuy[0]?.exchangeRateUSD?.rate}
                  initCallback={getCallback}
                  stopCalculating={stopCalculation}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  handleClosePopup={handleClosePopup}
                  showEarlyAccessNft={showEarlyAccessNft && blockDiff > 0}
                  blockDiff={blockDiff}
                  setTokenId={val => {
                    console.log({ tokenId: val })
                    setTokenId(val)
                  }}
                  setEarlyCheckBox={setEarlyCheckBox}
                  isLoadingEarlyAccessNft={isLoadingEarlyAccessNft}
                />
                {!checkTradingStatusData && (
                  <div className="flex-center">
                    <div className="trading_disabled_btn">
                      {t('trading_disabled')}
                    </div>
                  </div>
                )}
                <div
                  className={classNames(
                    'purchase-submit-wrapper',
                    'btn-purchase',
                  )}
                >
                  {checkTradingStatusLoader ? (
                    <div className="flex-center m-auto">
                      <div className="loading-spinner">
                        <div className="spinner size-small"></div>
                      </div>
                    </div>
                  ) : (
                    <PurchaseButton
                      title={'buy'}
                      onPress={handleSubmit}
                      disabled={!checkTradingStatusData}
                      className={classnames(
                        fetchSinglePlayerStatsError ||
                          purchaseContractLoading ||
                          !inputAmount ||
                          parseFloat(getPlayerCoins()) < parseFloat(minToken) ||
                          (maxPurchaseAmount > 0 &&
                            parseFloat(getPlayerCoins()) > maxPurchaseAmount) ||
                          (showEarlyAccessNft && blockDiff > 0 && !tokenId) ||
                          isLoadingEarlyAccessNft ||
                          (earlyCheckBox && !tokenId)
                          ? 'purchase-btn-inactive'
                          : '',
                        'caps',
                      )}
                    />
                  )}
                  {fetchSinglePlayerStatsError && (
                    <div className="input-feedback text-center">
                      {fetchSinglePlayerStatsError}
                    </div>
                  )}
                  <div
                    className={classnames(
                      'supported-methods-wrapper',
                      isMobile() ? 'mb-20' : '',
                    )}
                  >
                    <div className="methods-heading">
                      {t('accepted payment methods')}
                    </div>
                    <div className="methods-wrapper">
                      <TooltipLabel title="MATIC">
                        <img src={maticIcon} alt="" className="method-matic" />
                      </TooltipLabel>
                      <TooltipLabel title="Visa">
                        <img
                          src={
                            selectedThemeRedux === 'Light'
                              ? visaIconBlack
                              : visaIcon
                          }
                          alt=""
                          className="method-visa"
                        />
                      </TooltipLabel>
                      <TooltipLabel title="Master Card">
                        <img
                          src={masterCardIcon}
                          alt=""
                          className="method-mc"
                        />
                      </TooltipLabel>
                      <TooltipLabel title="Apple Pay">
                        <img
                          src={ApplePayIcon}
                          alt="applepay"
                          className="method-mc"
                        />
                      </TooltipLabel>
                    </div>
                  </div>
                </div>
              </form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default NewBuyForm
