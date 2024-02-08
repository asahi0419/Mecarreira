import React, { useEffect, useState } from 'react'
import Slider from '@material-ui/core/Slider'
import { Input } from '@components/Form'
import {
  getCircleColor,
  getFlooredFixed,
  isMobile,
  pad,
  truncateDecimals,
} from '@utils/helpers'
import Spinner from '@components/Spinner'
import '@assets/css/pages/Staking.css'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import classnames from 'classnames'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { ethers } from 'ethers'
import {
  allowStaking,
  clearLoadedStakingStatus,
  fetchPlayersBalance,
  getPlayer1Contract,
  getStakingBalance,
  getStakingReward,
  getStakingStatus,
  staking,
  unstaking,
  claimReward,
} from '@root/apis/playerCoins/playerCoinsSlice'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import classNames from 'classnames'
import ImageComponent from '@components/ImageComponent'
import ArrowUpFilled from '@components/Svg/ArrowUpFilled'
import ArrowDownFilled from '@components/Svg/ArrowDownFilled'
import { fetchSinglePlayer24hStats } from '@root/apis/playerStats/playerStatsSlice'
import { POLYGON_NETWORK_RPC_URL } from '@root/constants'
import {
  getBlockPerSecond,
  getNextPossibleClaim,
  getPlayerShares,
  getStakingRewardXp,
  resetStakingRewardXp,
} from '@root/apis/onboarding/authenticationSlice'
import PlayerImage from '@components/PlayerImage'
import { isNullOrUndefined } from 'util'
import { useWalletHelper } from '@utils/WalletHelper'
interface Props {
  playerData?: any
}
let blockCountDown: any = null
let stake24hChange: any = null
let resetTimer: any = null

const StakedForm: React.FC<Props> = ({ playerData = null }) => {
  const stakeInterval: any = null
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const location: any = useLocation()
  const [stakeAmount, setStakeAmount] = useState(0.0)
  const [isCountDown, setIsCountDown] = useState(false)
  const [balance, setBalance] = useState('0.00')
  const [value, setValue] = useState<number | number[]>(0.0)
  const [stakingButtonStatus, setStakingButtonStatus] = useState('')
  const [mode, setMode] = useState<string>('')
  const [playerInfo, setPlayerInfo] = useState<any>({})
  const [showBottomPopup, setShowBottomPopup] = useState(false)
  const [txnHash, setTxnHash] = useState<string>('')
  const [txnErr, setTxnErr] = useState('')
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    isLoading,
    loadedStakingStatus,
    stakingStatus,
    stakingcontract,
    stakingcontractabi,
    player1contract,
    player1contractabi,
    centralContract,
    centralContractAbi,
    txnConfirmResp,
    reward,
    fetchBalancePlayersData,
    fetchBalancePlayersSuccess,
    isHighestBidder,
    getPlayerDetailsSuccessData,
  } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    selectedThemeRedux,
    walletType,
    blockPerSecond,
    stakingRewardXpData,
    stakingRewardXpLoader,
    nextPossibleClaimData,
    userWalletData: { address },
  } = authenticationData
  const { token = [] } = fetchBalancePlayersData

  const { getWeb3Provider, callWeb3Method } = useWalletHelper()

  const [stakingMessage, setStakingMessage] = useState('')
  const [isMinusSelected, setIsMinusSelected] = useState(false)
  const [isMinusDisabled, setIsMinusDisabled] = useState(true)
  const [isPlusSelected, setIsPlusSelected] = useState(false)
  const [isPlusDisabled, setIsPlusDisabled] = useState(true)
  const [isClaimClicked, setIsClaimClicked] = useState(false)
  const [maxSelected, setMaxSelected] = useState(false)
  const [flyinClosed, setFlyinClosed] = useState(true)
  const [state, setState] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }
  const walletAddress = useSelector(
    (state: RootState) => state.authentication.walletAddress,
  )
  const accessToken = localStorage.getItem('accessToken')
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')

  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const {
    fetchSinglePlayerStatsData,
    fetchSinglePlayerStatsError,
    fetchSinglePlayer24hStatsData = [],
  } = playerStatsData

  useEffect(() => {
    // console.log('playerInfo', { playerInfo, playerData })
    const reqParams = {
      address: loginInfo || address,
    }
    if (playerInfo?.detailpageurl && playerData?.detailpageurl) {
      dispatch(fetchPlayersBalance(reqParams))
      dispatch(
        getStakingStatus(
          playerInfo?.detailpageurl || playerData?.detailpageurl,
        ),
      )
      dispatch(
        getPlayer1Contract({
          url: playerInfo?.detailpageurl || playerData?.detailpageurl,
        }),
      )
    }
    // staking reward not to be shown as of now
    // playerInfo?.playercontract &&
    //   dispatch(
    //     getStakingReward(
    //       playerInfo?.playercontract || playerData?.playercontract,
    //     ),
    //   )
    if (accessToken || loginInfo) {
      playerInfo?.playercontract &&
        dispatch(
          getStakingBalance(
            playerInfo?.playercontract || playerData?.playercontract,
          ),
        )
    }
    if (playerData.playercontract) {
      // handleGetPriceStats([playerData.playercontract])
      clearInterval(stakeInterval)
      dispatch(
        fetchSinglePlayer24hStats({ contracts: playerData.playercontract }),
      )
      clearInterval(stake24hChange)
      stake24hChange = setInterval(() => {
        dispatch(
          fetchSinglePlayer24hStats({ contracts: playerData.playercontract }),
        )
      }, 30000)
    }
  }, [playerInfo, playerData])

  useEffect(() => {
    loadedStakingStatus &&
      setStakingButtonStatus(stakingStatus ? 'stake' : 'allow staking')
    setMode(stakingStatus ? 'stake' : 'approveStaking')
  }, [loadedStakingStatus])

  useEffect(() => {
    if (playerInfo?.playercontract) {
      const availableToken = token.findIndex(
        (item: any) =>
          ethers.utils.getAddress(item.contract) ===
          ethers.utils.getAddress(
            playerInfo?.playercontract || playerData?.playercontract,
          ),
      )
      if (availableToken > -1) {
        const walletIndex: any = token.findIndex(
          (item: any) =>
            ethers.utils.getAddress(item.contract) ===
            ethers.utils.getAddress(playerInfo?.playercontract),
        )
        setBalance(token[walletIndex].balance)
        setStakedValue(token[walletIndex].stakingbalance)
        if (parseFloat(token[walletIndex].stakingbalance) <= 0 && loginInfo) {
          getMinimumStakingBlocks()
        } else {
          setMessageLoader(false)
        }
        if (parseFloat(token[walletIndex].stakingbalance) > 0 && loginInfo) {
          getNextPossibleClaimExternal()
        }
        if (parseFloat(token[walletIndex].stakingbalance) > 0 && loginId) {
          getNextPossibleClaimInternal()
        }
      } else if (fetchBalancePlayersSuccess) {
        setMessageLoader(false)
      }
    }
  }, [token])

  const getMinimumStakingBlocks = async () => {
    if (!stakingMessage && parseFloat(stakedValue) <= 0) {
      setMessageLoader(true)
      const provider = await getWeb3Provider()
      const generalContract = new ethers.Contract(
        centralContract, // contract address of Router
        centralContractAbi,
        provider.getSigner(loginInfo!),
      )

      const minimumStakingBlocks = await generalContract?.minimumStakingBlocks()

      const minimumStakingBlocksNumber = Math.floor(
        parseInt(minimumStakingBlocks._hex) / blockPerSecond,
      )

      const hh = Math.floor(minimumStakingBlocksNumber / 3600)
      const mm = Math.floor((minimumStakingBlocksNumber % 3600) / 60)
      const ss = minimumStakingBlocksNumber % 60
      setStakingMessage(hh + 'h ' + pad(mm) + 'm ' + pad(ss) + 's ')
      setMessageLoader(false)
    }
  }

  const pathname = window.location.pathname

  useEffect(() => {
    dispatch(getBlockPerSecond())
    return () => {
      if (pathname.includes('/player/') && getPlayerDetailsSuccessData) {
        console.log('token_balance_refreshed', { getPlayerDetailsSuccessData })
        dispatch(resetStakingRewardXp())
        dispatch(
          getPlayerShares({
            playerContract: getPlayerDetailsSuccessData?.playercontract,
          }),
        )
      }
    }
  }, [])

  const [xpLoader, setXpLoader] = useState(false)
  const [messageLoader, setMessageLoader] = useState(true)
  const [stakingRewardXp, setStakingRewardXp] = useState(0)
  // INTERNAL_API_INTEGRATION
  useEffect(() => {
    if (stakingRewardXpData !== null) {
      setStakingRewardXp(stakingRewardXpData / 1000000000000000000)
      console.log('stakingRewardXpData', stakingRewardXpData)
      setXpLoader(false)
    }
  }, [stakingRewardXpData])
  const getStakingRewardXPInternal = async () => {
    // INTERNAL_API_INTEGRATION
    dispatch(getStakingRewardXp({ stakingContract: stakingcontract }))
    setXpLoader(false)
    // setXpLoader(true)
    // const userWalletAddressUnder = await localStorage.getItem(
    //   'userWalletAddress',
    // )
    // const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
    //   POLYGON_NETWORK_RPC_URL,
    // )
    // const getNextAvailability = new ethers.Contract(
    //   stakingcontract, // contract address of Router
    //   stakingcontractabi, //  contract abi of Router
    //   simpleRpcProvider.getSigner(userWalletAddressUnder!),
    // )
    // try {
    //   const getStakingRewardXP = await getNextAvailability?.getStakingRewardXP()
    //   const getStakingRewardXPValue = parseInt(getStakingRewardXP._hex)

    //   console.log('getStakingRewardXPValue', {
    //     getStakingRewardXPValue,
    //   })
    //   setStakingRewardXp(getStakingRewardXPValue / 1000000000000000000)
    //   setXpLoader(false)
    // } catch (error) {
    //   console.log('error', error)
    // }
  }

  const getStakingRewardXPExternal = async () => {
    setXpLoader(true)
    const provider = await getWeb3Provider()
    const getNextAvailability = new ethers.Contract(
      stakingcontract, // contract address of Router
      stakingcontractabi, //  contract abi of Router
      provider.getSigner(loginInfo!),
    )
    try {
      const getStakingRewardXP = await getNextAvailability?.getStakingRewardXP()

      const getStakingRewardXPValue = parseInt(getStakingRewardXP._hex)

      console.log('getStakingRewardXPValue', {
        getStakingRewardXPValue,
      })
      setStakingRewardXp(getStakingRewardXPValue / 1000000000000000000)
    } catch (error) {
      console.log('error', error)
    }
    setXpLoader(false)
  }
  // INTERNAL_API_INTEGRATION
  useEffect(() => {
    const getStakingRewardXP = async () => {
      if (nextPossibleClaimData !== null) {
        const userWalletAddressUnder = await localStorage.getItem(
          'userWalletAddress',
        )
        const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
          POLYGON_NETWORK_RPC_URL,
        )
        const availabilityBlock = nextPossibleClaimData
        const currentBlockNumber = await simpleRpcProvider.getBlockNumber()

        console.log('getAvailability', {
          availabilityBlock,
          currentBlockNumber,
        })
        console.log('blockPerSecond', blockPerSecond)
        const diff = (availabilityBlock - currentBlockNumber) / blockPerSecond
        if (availabilityBlock < currentBlockNumber) {
          console.log('xp available')
          getStakingRewardXPInternal()
        } else {
          if (!txnErr) {
            setIsCountDown(true)
            console.log('Date diff', diff)
            const hh = Math.floor(diff / 3600)
            const mm = Math.floor((diff % 3600) / 60)
            const ss = diff % 60
            if (hh > 0 || mm > 0 || ss > 0) {
              console.log('GNPCI')
              initCountDown(hh, mm, ss)
            }
          }
        }
      }
      setXpLoader(false)
    }
    getStakingRewardXP()
  }, [nextPossibleClaimData])
  const getNextPossibleClaimInternal = async () => {
    // INTERNAL_API_INTEGRATION
    console.log('xgetClaimInternal')
    setXpLoader(true)
    await dispatch(getNextPossibleClaim({ stakingContract: stakingcontract }))
    // const userWalletAddressUnder = await localStorage.getItem(
    //   'userWalletAddress',
    // )
    // const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
    //   POLYGON_NETWORK_RPC_URL,
    // )
    // const getNextAvailability = new ethers.Contract(
    //   stakingcontract, // contract address of Router
    //   stakingcontractabi, //  contract abi of Router
    //   simpleRpcProvider.getSigner(userWalletAddressUnder!),
    // )
    // try {
    //   const getAvailability = await getNextAvailability?.getNextPossibleClaim(
    //     userWalletAddressUnder,
    //   )
    //   const availabilityBlock = parseInt(getAvailability._hex)
    //   const availabilityBlock = nextPossibleClaimData
    //   const currentBlockNumber = await simpleRpcProvider.getBlockNumber()

    //   console.log('getAvailability', {
    //     availabilityBlock,
    //     currentBlockNumber,
    //   })
    //   console.log('blockPerSecond', blockPerSecond)
    //   const diff = (availabilityBlock - currentBlockNumber) / blockPerSecond
    //   if (availabilityBlock < currentBlockNumber) {
    //     console.log('xp available')
    //     getStakingRewardXPInternal()
    //   } else {
    //     if (!txnErr) {
    //       setIsCountDown(true)
    //       console.log('Date diff', diff)
    //       const hh = Math.floor(diff / 3600)
    //       const mm = Math.floor((diff % 3600) / 60)
    //       const ss = diff % 60
    //       if (hh > 0 || mm > 0 || ss > 0) {
    //         console.log('GNPCI')
    //         initCountDown(hh, mm, ss)
    //         setXpLoader(false)
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.log('error', error)
    // }
  }
  const getNextPossibleClaimExternal = async () => {
    console.log('xgetClaimExternal')
    setXpLoader(true)
    const externalWalletAddress = await localStorage.getItem(
      'externalWalletAddress',
    )
    const provider = await getWeb3Provider()
    const getNextAvailability = new ethers.Contract(
      stakingcontract, // contract address of Router
      stakingcontractabi, //  contract abi of Router
      provider.getSigner(loginInfo!),
    )
    try {
      const getAvailability = await getNextAvailability?.getNextPossibleClaim(
        externalWalletAddress,
      )

      const availabilityBlock = parseInt(getAvailability._hex)
      const currentBlockNumber = await provider.getBlockNumber()

      console.log('getAvailability', {
        availabilityBlock,
        currentBlockNumber,
        stakingcontract, // contract address of Router
        stakingcontractabi,
      })
      console.log('blockPerSecond', blockPerSecond)
      const diff = (availabilityBlock - currentBlockNumber) / blockPerSecond
      if (availabilityBlock < currentBlockNumber) {
        console.log('xp available')
        getStakingRewardXPExternal()
      } else {
        console.log({ txnErr })
        setIsCountDown(true)
        console.log('Date diff', diff)
        const hh = Math.floor(diff / 3600)
        const mm = Math.floor((diff % 3600) / 60)
        const ss = diff % 60
        if (hh > 0 || mm > 0 || ss > 0) {
          console.log('GNPCE')
          initCountDown(hh, mm, ss)
        }
      }
    } catch (error) {
      console.log('error', error)
      setXpLoader(false)
      // getNextPossibleClaimExternal()
    }
    setXpLoader(false)
  }

  const initCountDown = (hh: number, mm: number, ss: number) => {
    console.log('ICD', { hh, mm, ss })
    const timeOffset = hh * 60 * 60 * 1000 + mm * 60 * 1000 + ss * 1000
    const countDownDate = new Date().getTime() + timeOffset
    // const countDownDate = new Date(blockTime).getTime() //+ 15 * 60 * 1000
    // Update the count down every 1 second
    blockCountDown = setInterval(function () {
      // Get today's date and time
      const now = new Date().getTime()

      // Find the distance between now and the count down date
      const distance = countDownDate < now ? 0 : countDownDate - now

      // Time calculations for hours, minutes and seconds
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 120)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      updateState({
        hours,
        minutes,
        seconds,
      })
      if (distance < 0) {
        clearInterval(blockCountDown)
        if (loginInfo) {
          console.log('insideInitCount')
          getNextPossibleClaimExternal()
        } else if (loginId) {
          getNextPossibleClaimInternal()
        }
      }
    }, 1000)
  }

  const handleClose = async () => {
    setShowBottomPopup(false)
    setTxnErr('')
    clearTimeout(resetTimer)
    const time = mode === 'stake' ? 9000 : 0
    if (txnConfirmResp[0]?.haserror === 0) {
      if (mode === 'stake') {
        await clearInterval(blockCountDown)
        setXpLoader(true)
      }
      resetTimer = setTimeout(() => {
        setFlyinClosed(false)
        updateState({
          hours: '00',
          minutes: '00',
          seconds: '00',
        })
        // if (txnConfirmResp[0]?.haserror === 0) {
        if (stakingButtonStatus === 'allow staking') {
          setStakingButtonStatus('stake')
        }
        const reqParams = {
          address: loginInfo || address,
        }
        dispatch(fetchPlayersBalance(reqParams))
        // playerInfo?.playercontract &&
        //   dispatch(getStakingReward(playerInfo?.playercontract))
        if (accessToken || loginInfo) {
          playerInfo?.playercontract &&
            dispatch(getStakingBalance(playerInfo?.playercontract))
        }
      }, time)
      if (mode === 'approveStaking') {
        clearInterval(blockCountDown)
        if (loginInfo) {
          getNextPossibleClaimExternal()
        } else if (loginId) {
          getNextPossibleClaimInternal()
        }
        // if (loginInfo) {
        //   getNextPossibleClaimExternal()
        // } else if (loginId) {
        //   getNextPossibleClaimInternal()
        // }
        setTxnHash('')
        setTxnErr('')
        setMode('stake')
      }
    }
    setTxnHash('')
    setTxnErr('')
  }

  const [stakedValue, setStakedValue] = useState('0.00')

  useEffect(() => {
    if (parseFloat(balance) > 0 && stakingButtonStatus === 'stake') {
      setIsPlusSelected(true)
    }
    if (stakingButtonStatus === 'stake' || stakingButtonStatus === 'unstake') {
      if (parseFloat(stakedValue) > 0) {
        setIsMinusDisabled(false)
      } else {
        setIsMinusDisabled(true)
      }
      if (parseFloat(balance) > 0) {
        setIsPlusDisabled(false)
      } else {
        setIsPlusDisabled(true)
      }
    }
  }, [stakedValue, balance, stakingButtonStatus])

  const onClickStaking = async () => {
    const exp = ethers.BigNumber.from('10').pow(13)
    if (stakingButtonStatus !== 'allow staking' && stakeAmount <= 0) {
      return
    }
    if (reward > 0 && stakingButtonStatus === 'stake') {
      return
    }
    setTxnErr('')
    setIsClaimClicked(false)
    setShowBottomPopup(true)
    if (localStorage.getItem('loginId')) {
      return
    }
    let promise
    if (stakingButtonStatus === 'allow staking') {
      promise = callWeb3Method(
        'oneTimeAddAllowance',
        player1contract,
        player1contractabi,
        [],
      )
    } else if (stakingButtonStatus === 'stake') {
      promise = callWeb3Method(
        'lockToken',
        stakingcontract,
        stakingcontractabi,
        [
          ethers.BigNumber.from(Math.floor(stakeAmount * Math.pow(10, 5))).mul(
            exp,
          ),
        ],
      )
    } else {
      promise = callWeb3Method(
        'unlockToken',
        stakingcontract,
        stakingcontractabi,
        [],
      )
    }
    promise
      .then(async (txn: any) => {
        setTxnHash(txn.hash)
        if (stakingButtonStatus === 'allow staking') {
          if (txnConfirmResp[0]?.haserror === 0) {
            setStakingButtonStatus('stake')
          }
        }
      })
      .catch((err: any) => {
        console.log('txnErrAddAllowance', err)
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnErr(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnErr(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnErr(err.reason || err.message)
        }
      })
  }

  const onClickClaim = async () => {
    setTxnErr('')
    setIsClaimClicked(true)
    setShowBottomPopup(true)
    if (localStorage.getItem('loginId')) {
      return
    }
    const promise = callWeb3Method(
      'claimStakingRewards',
      stakingcontract,
      stakingcontractabi,
      [],
    )
    promise
      .then(async (txn: any) => {
        setTxnHash(txn.hash)
      })
      .catch((err: any) => {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnErr(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnErr(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnErr(err.reason || err.message)
        }
      })
  }

  const handleStakingApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('user_secret', user_secret)
    if (isClaimClicked) {
      formData.append('contract', stakingcontract)
      dispatch(claimReward(formData))
    } else if (stakingButtonStatus === 'allow staking') {
      formData.append('contract', player1contract)
      dispatch(allowStaking(formData))
    } else if (stakingButtonStatus === 'stake') {
      formData.append('stakingcontract', stakingcontract)
      formData.append('amount', stakeAmount.toString())
      dispatch(staking(formData))
    } else {
      formData.append('stakingcontract', stakingcontract)
      dispatch(unstaking(formData))
    }
  }

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setValue(newValue)

    const value = parseFloat(newValue.toString())
    setStakeAmount(truncateDecimals((value / 100) * parseFloat(balance), 5))
  }
  const onChange = (v: any) => {
    const amount =
      parseFloat(v.target.value) >= 0
        ? parseFloat(v.target.value) > parseFloat(balance)
          ? parseFloat(balance)
          : parseFloat(v.target.value)
        : 0
    setStakeAmount(truncateDecimals(amount, 5))
    setValue(
      parseFloat(balance) === 0
        ? 0
        : truncateDecimals((amount / parseFloat(balance)) * 100, 2),
    )
  }

  const onClickMax = () => {
    if (!isPlusSelected) {
      return
    }
    setValue(100)
    setStakeAmount(truncateDecimals(parseFloat(balance), 5))
  }

  const onClick75 = () => {
    if (!isPlusSelected) {
      return
    }
    setValue(75)
    setStakeAmount(truncateDecimals(parseFloat(balance) * 0.75, 5))
  }

  const onClick50 = () => {
    if (!isPlusSelected) {
      return
    }
    setValue(50)
    setStakeAmount(truncateDecimals(parseFloat(balance) * 0.5, 5))
  }

  const onClick25 = () => {
    if (!isPlusSelected) {
      return
    }
    setValue(25)
    setStakeAmount(truncateDecimals(parseFloat(balance) * 0.25, 5))
  }

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

  useEffect(() => {
    if (playerData) {
      setPlayerInfo(playerData)
    }
    if (location?.state?.profileData) {
      setPlayerInfo(location?.state?.profileData)
    }
    return () => {
      dispatch(clearLoadedStakingStatus())
      clearInterval(stake24hChange)
      clearInterval(stakeInterval)
      clearInterval(blockCountDown)
    }
  }, [])

  const handlePlusClick = () => {
    if (isPlusDisabled || isPlusSelected) {
      return
    }
    setIsPlusSelected(true)
    setStakingButtonStatus('stake')
    setIsMinusSelected(false)
    setStakeAmount(0)
  }

  const handleMinusClick = () => {
    if (isMinusDisabled || isMinusSelected) {
      return
    }
    setIsPlusSelected(false)
    setStakingButtonStatus('unstake')
    setIsMinusSelected(true)
    setStakeAmount(parseFloat(stakedValue))
    setValue(0)
  }

  return (
    <section className="staking-container">
      {showBottomPopup &&
        (localStorage.getItem('loginInfo') ? (
          <Web3BottomPopup
            showPopup={showBottomPopup}
            txnHash={txnHash}
            txnErr={txnErr}
            customClass={isMobile() ? 'exwallet-bottomwrapper-block' : ''}
            onClose={handleClose}
          />
        ) : (
          <ApiBottomPopup
            showPopup={showBottomPopup}
            onSubmit={handleStakingApi}
            onClose={handleClose}
            customClass="purchase-pc-bottomwrapper"
          />
        ))}
      {!stakingButtonStatus ? (
        <div className="loading-spinner m-auto">
          <div className="spinner"></div>
        </div>
      ) : stakingButtonStatus === 'allow staking' ? (
        <>
          <h2>
            {t('approve staking for')}
            <span
              className={classNames(
                'new-draft-title eth-address p-0',
                'success',
              )}
            >
              {/* {` ${playerData?.name} $${playerData?.ticker} `} */}
              {/* {` ${playerData?.name} `} */}

              {
                <div className="currency_mark_wrapper kiosk-item-flag-buyItem stake-chip">
                  <div
                    className="currency_mark_img"
                    style={{
                      background: getCircleColor(
                        playerData?.playerlevelid || playerData?.playerlevelid,
                      ),
                    }}
                  >
                    <PlayerImage
                      src={playerData?.playerpicture}
                      className="img-radius_kiosk currency_mark"
                    />
                  </div>
                  <div className={isMobile() ? 'item-price-container' : ''}>
                    {!isMobile() ? (
                      <>
                        <span>
                          {playerData?.name || playerData?.name} $
                          {playerData?.ticker}
                        </span>
                      </>
                    ) : (
                      <> &nbsp;{playerData?.name}</>
                    )}
                  </div>
                </div>
              }
              {t('and collect xp everyday')}
            </span>
          </h2>
          {/* <div style={{ width: 'calc(100% - 40px)' }}>
            <h2>- {t('earn more coins every day')}</h2>
            <h2>- {t('vote')}</h2>
            <h2>- {t('win NFTs')}</h2>
            <h2>- {t('you can bid for NFTs')}</h2>
          </div> */}
        </>
      ) : (
        <div className={classNames('staked', 'staked-pct-wrapper')}>
          <div className="nft-image-section">
            <div className="image-border">
              <ImageComponent
                src={
                  playerInfo?.playerpicturethumb ||
                  playerInfo?.playerpicture ||
                  playerData?.playerpicturethumb
                }
                alt=""
                className="nft-image"
              />
            </div>
            <div className="player-name">
              <div className="staked-name">
                {playerInfo?.name || playerData?.name}
              </div>
              <div className="staked-name">
                {playerInfo?.ticker || playerData?.ticker}
              </div>
            </div>
            {fetchSinglePlayer24hStatsData.length > 0 ? (
              <div className="player-detail-pricechange">
                {getPercentageEst(fetchSinglePlayer24hStatsData[0])
                  .oldNumber ===
                getPercentageEst(fetchSinglePlayer24hStatsData[0]).newNumber ? (
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
          </div>
          <div className="staked-amount-raw">
            <span className="staked-label">{t('my coin staked: ')}</span>
          </div>
          <div className="staked-amount-raw">
            <div className="staked-amount-wrapper">
              <span className="staked-amount">
                {truncateDecimals(parseFloat(stakedValue), 5)}
              </span>
              <span className="staked-amount usd-amount">
                {truncateDecimals(
                  parseFloat(stakedValue) *
                    parseFloat(playerInfo?.matic) *
                    playerInfo?.exchangeRateUSD?.rate ?? 0,
                  4,
                )}
                &nbsp;USD
              </span>
            </div>
            <div className="staked-symbol-wrapper">
              <span
                className={classnames(
                  'minus-symbol',
                  isMinusSelected && 'button-active',
                  isMinusDisabled && 'button-inactive',
                )}
                onClick={handleMinusClick}
              >
                -
              </span>
              <span
                className={classnames(
                  'plus-symbol',
                  isPlusSelected && 'button-active',
                  isPlusDisabled && 'button-inactive',
                )}
                onClick={handlePlusClick}
              >
                +
              </span>
            </div>
          </div>
          <div>
            <div className="stake-label capitalize">
              {t(isMinusSelected ? 'unstake' : 'stake')}
            </div>
            <div
              className={classNames(
                'stake-input-container w-none',
                // maxSelected || !isPlusSelected ? 'input-disabled' : '',
              )}
            >
              <Input
                type="number"
                name="staked"
                onChange={e => onChange(e)}
                // disabled={!isPlusSelected}
                value={stakeAmount}
                className={classNames(
                  'input-stake-value',
                  // maxSelected || !isPlusSelected ? 'input-disabled' : '',
                )}
                onBlur={() => {
                  return
                }}
                min={0}
                max={parseFloat(balance)}
              />
              <div className="ticker-holder">
                <h6>{playerData?.ticker}</h6>
              </div>
            </div>
            {/* <div className="balance">
              {t('balance') + ': ' + truncateDecimals(parseFloat(balance), 5)}
            </div> */}
            {maxSelected ? (
              <div className="form-label-wrapper align-end linear-flex-end w-none">
                <label
                  className="reset-txt"
                  onClick={() => {
                    setStakeAmount(0.0)
                    setMaxSelected(false)
                  }}
                >
                  {t('clear')}
                </label>
              </div>
            ) : (
              <div className="form-label-wrapper linear-flex-end w-none">
                <label
                // style={{
                //   color:
                //     selectedThemeRedux === 'Dark' ||
                //     selectedThemeRedux === 'Gold'
                //       ? '#fff'
                //       : '#000',
                // }}
                >
                  {t('maximum coins available')}:
                </label>
                <label
                  className="form-label-active"
                  onClick={() => {
                    setStakeAmount(truncateDecimals(parseFloat(balance), 5))
                    setMaxSelected(true)
                  }}
                >
                  {balance ? truncateDecimals(parseFloat(balance), 5) : '0.00'}
                </label>
              </div>
            )}
          </div>
          <div className="slider-bar">
            <Slider
              defaultValue={0.0}
              aria-labelledby="discrete-slider-custom"
              step={1}
              value={typeof value === 'number' ? value : 0.0}
              disabled={!isPlusSelected}
              onChange={handleSliderChange}
            />
          </div>
          <div className="slider-value mt-0">{value}%</div>

          <div className="rate-group">
            <div
              className={classnames(
                'rate',
                !isPlusSelected && 'button-inactive',
              )}
              onClick={onClick25}
            >
              25%
            </div>
            <div
              className={classnames(
                'rate rate-50',
                !isPlusSelected && 'button-inactive',
              )}
              onClick={onClick50}
            >
              50%
            </div>
            <div
              className={classnames(
                'rate rate-75',
                !isPlusSelected && 'button-inactive',
              )}
              onClick={onClick75}
            >
              75%
            </div>
            <div
              className={classnames(
                'rate',
                !isPlusSelected && 'button-inactive',
              )}
              onClick={onClickMax}
            >
              {t('max')}
            </div>
          </div>
          {xpLoader || stakingRewardXpLoader || messageLoader ? (
            <div className="flex_container">
              <div className="loading-spinner mt-40">
                <div className="spinner"></div>
              </div>
            </div>
          ) : isPlusSelected && parseFloat(stakedValue) <= 0 ? (
            <p className="withdraw_title font-xs">
              {t('Staked Tokens are locked for ')}
              <span>{stakingMessage}</span>
              {t(' and can only be withdrawn again once that period has ended')}
            </p>
          ) : isCountDown ? (
            <>
              <p className="withdraw_title">{t('you can unstake in')}</p>
              <div style={{ height: '54px' }}>
                <div className="secret-countdown">
                  {state.hours}h {state.minutes}m {state.seconds}s
                </div>
              </div>
            </>
          ) : stakingRewardXp > 0 ? (
            <div className="mt-30 xp_box">
              <div>
                <div className="xp_wrapper">
                  <p className="xp_title">XP Earned</p>
                  <div className="xp_value">
                    {Math.floor(stakingRewardXp).toLocaleString()}
                  </div>
                </div>
              </div>
              {/* <div
                // className="collect_xp_button button2 custom-btn-staking"
                className="form-submit-btn button-box"
                style={{
                  width: '130px',
                  height: '30px',
                  margin: '0px 0px',
                  color: '#000',
                }}
                onClick={onClickClaim}
              >
                Collect
              </div> */}
              <button
                onClick={onClickClaim}
                className="form-submit-btn wallet-btn deposit-btn"
                style={{ height: '40px' }}
              >
                {t('collect')}
              </button>
            </div> // <>
          ) : //   <div className="staked-amount-raw mt-20">
          //     <span className="staked-label">{t('My Staking Reward: ')}</span>
          //   </div>
          //   <div className="staked-amount-raw staked-reward-row">
          //     <span className="staked-amount">
          //       {truncateDecimals(parseFloat(reward), 5)}
          //     </span>
          //     <span className="staked-amount usd-amount">
          //       {truncateDecimals(
          //         parseFloat(reward) *
          //           parseFloat(playerInfo?.matic) *
          //           playerInfo?.exchangeRateUSD?.rate ?? 0,
          //         4,
          //       )}
          //       &nbsp;USD
          //     </span>
          //   </div>
          // </>
          null}
        </div>
      )}
      {stakingButtonStatus && (
        <>
          {isLoading ? (
            <Spinner className="mt-0" spinnerStatus={isLoading} title={t('')} />
          ) : stakingButtonStatus === 'unstake' && isHighestBidder ? (
            <div className="staked-alert -center yellow-color">
              {t('you cannot unlock')}
            </div>
          ) : (
            <div>
              <div
                className={classnames(
                  'stake-button mt-0 mb-20',
                  (isPlusDisabled || reward > 0) &&
                    stakingButtonStatus === 'stake' &&
                    'button-inactive',
                  isPlusSelected && stakeAmount <= 0 && 'button-inactive',
                  isCountDown && stakingButtonStatus === 'unstake'
                    ? 'button-inactive'
                    : '',
                  reward > 0 && 'no-margin',
                  stakingButtonStatus === 'allow staking' &&
                    'allow-staking-button',
                )}
                onClick={onClickStaking}
              >
                {t(
                  reward > 0 && stakingButtonStatus === 'stake'
                    ? 'claim your reward first'
                    : stakingButtonStatus,
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default StakedForm
