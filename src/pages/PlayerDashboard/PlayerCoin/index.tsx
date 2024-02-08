/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'
import SubmitButton from '@components/Button/SubmitButton'
import ArrowDown from '@components/Svg/ArrowDown'
import ArrowUp from '@components/Svg/ArrowUp'
import CloseIcon from '@mui/icons-material/Close'
import FormInput from '@components/Form/FormInput'
import {
  POLYGON_NETWORK_RPC_URL,
  THEME_COLORS,
  BASE_EXPLORE_URL,
} from '@root/constants'
import Matic from '@components/Svg/Matic'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  fetchPlayersBalance,
  updatePlayerProfile,
  resetPlayerProfileMessage,
  resetInstaProfileRefetch,
  getPlayerData,
  getAddedAgents,
  launchCoin,
  addAdmin,
  addAgent,
  revokeAdmin,
  nativeWithdraw,
  playerTokenWithdraw,
  AddPayout,
  newRewardPercentage,
  resetNewRewardPercentageMessage,
  instaProfileRefetch,
  getTxnConfirm,
  setTxnConfirmSuccess,
  setTxnConfirmError,
  getPlayer1Contract,
  resetTxnConfirmationData,
} from '@root/apis/playerCoins/playerCoinsSlice'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import Resizer from 'react-image-file-resizer'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import ResponseAlert from '@components/ResponseAlert'
import toast from 'react-hot-toast'
import {
  getCountryNameNew,
  getPlayerLevelName,
  isMobile,
  sleep,
  truncateDecimals,
} from '@utils/helpers'
import DialogBox from '@components/Dialog/DialogBox'
import Web3ActionPrompt from './web3Actionprompt'
import classNames from 'classnames'
import { useNavigate } from 'react-router'
import ApiActionPrompt from '@components/Dialog/ApiActionprompt'
import {
  setSocialHandlesLinks,
  postPlayerSettings,
  resetChangeWhatsAppNumber,
  resetPostVerifyWhatsApp,
  showVotingMobile,
  postCartoon,
  getCartoonizeStatus,
  goLiveLoadingDis,
  getPlayerPayoutAddress,
  resetTransaction,
  initCartoonizeStatus,
} from '@root/apis/onboarding/authenticationSlice'
import Switch from 'react-ios-switch'
import OtpWhatsApp from '../PlayerCoinRequest/OtpWhatsApp'
import TooltipLabel from '@components/TooltipLabel'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Web3 from 'web3'
import MaskIcon from '@assets/images/mask.png'
import MaskIconWhite from '@assets/images/maskWhite.png'
import MaskIconEnabled from '@assets/images/maskEnabled.png'
import MaskIconEnabledGold from '@assets/images/maskEnabledGold.png'
import MaskIconEnabledLadies from '@assets/images/maskEnabledPink.png'
import InstagramProfile from '@assets/icons/icon/InstagramProfile.svg'
import InstagramProfileBlack from '@assets/icons/icon/InstagramProfileBlack.svg'
import ImageComponent from '@components/ImageComponent'
import Instagram from '@components/Svg/Instagram'
import PlayerImageProfile from '@pages/Player/Profile/components/PlayerImageProfile'
import EditIcon from '@components/Svg/EditIcon'
import YoutubeIcon from '@components/Svg/YoutubeIcon'
import { ConnectContext } from '@root/WalletConnectProvider'
import { useWalletHelper } from '@utils/WalletHelper'
import ShareIcon from '@assets/icons/icon/shareIcon.svg'
import ShareIconBlack from '@assets/icons/icon/ShareIconBlack.svg'
import LinkIcon from '@mui/icons-material/Link'

let txnCheckInterval: any = null
const PlayerCoin = () => {
  const theme = localStorage.getItem('theme')
  const intervalRef = useRef(null)
  //----------------------------------------------------------
  const playerCoinData: any = useSelector(
    (state: RootState) => state.playercoins,
  )

  const {
    playerData,
    allPlayersData,
    player1contract,
    player1contractabi,
    nftcontract,
    stakingcontract,
    player2contract,
    player2contractabi,
    fetchBalancePlayersData,
    fetchBalancePlayersSuccess,
    fetchBalancePlayersError,
    selectedPlayer,
    isUpdatePlayerProfileSuccess,
    allAgentsData,
    AddPayoutData,
    instaProfileRefetchData,
    instaProfileRefetchDataSuccess,
    isinstaProfileRefetchError,
    isinstaProfileRefetchLoading,
    isInstaProfileLoading,
    defaultLoader,
    isTxnChecking,
    txnConfirmResp,
    txnConfirmSuccess,
    goLiveBtnClicked,
    pictureUploadLoader,
  } = playerCoinData

  const { getWeb3Provider, callWeb3Method } = useWalletHelper()

  const { transfermarkt_link } = playerData
  const { t } = useTranslation()
  const [currentValue, setCurrentValue] = useState<any>(0)
  const [tradingValue, setTradingValue] = useState(0)
  const [goLiveClicked, setGoLiveClicked] = useState(false)
  const [isPayout, setPayout] = useState(false)
  const [getPlayerDispatch, setGetPlayerDispatch] = useState(false)
  const [isRewardPerc, setRewardPerc] = useState(false)
  const [getRewardPerc, setGetRewardPerc] = useState(false)
  const dispatch = useDispatch()
  const [selected, setSelected] = useState(1)
  const [playerInfo, setPlayerInfo] = useState<any>()
  const [txnErr, setTxnErr] = useState('')
  const [withdrawAvailable, setWithdrawAvailable] = useState(false)
  const [inputData, setInputData] = useState<any>({})
  const inputFile = useRef<HTMLInputElement>(null)
  const [nftMedia, setNFTMedia] = useState<any>()
  const [isAdminActionInProgress, setAdminActionInProgress] =
    useState<boolean>(false)
  const [isGoLiveInProgress, setIsGoLiveInProgress] = useState<boolean>(false)
  const [cropStatus, setCropStatus] = useState(false)
  const [imageValidationError, setImageValidationError] = useState('')
  const [promptDialog, setPromptDialog] = useState('')
  const [web3Action, setWeb3Action] = useState('')
  const [imageWidth, setImageWidth] = useState(1)
  const [selectedAsset, setSelectedAsset] = useState<any>({ type: '' })
  const [isRemoveAdminPropmt, setRemoveAdminPrompt] = useState<boolean>(false)
  const [image, setImage] = useState('')
  const [ethAddress, setEthAddress] = useState('')
  const [cropper, setCropper] = useState<any>()
  const [livePromptActive, setLivePromptActive] = useState<boolean>(false)
  const [adminAccountErr, setAdminAccountErr] = useState<string>('')
  const [agentAccountErr, setAgentAccountErr] = useState<string>('')
  const [payoutErr, setPayoutErr] = useState<string>('')
  const [txnHashInner, setTxnHash] = useState('')
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const { getTxnStatus } = useContext(ConnectContext)

  const isGoLiveClicked = localStorage.getItem('ISGOLIVECLICKED')
  const goLiveChoice = localStorage.getItem('optedGoLive')

  const walletAddress = useSelector(
    (state: RootState) => state.authentication.walletAddress,
  )

  const [instagram, setInstagram] = useState('')
  const [twitter, setTwitter] = useState('')
  const [youtube, setYoutube] = useState('')
  const [instagramOriginal, setInstagramOriginal] = useState('')
  const [twitterOriginal, setTwitterOriginal] = useState('')
  const [youtubeOriginal, setYoutubeOriginal] = useState('')
  const [contractPlayer, setContractPlayer] = useState('')
  const [editable, setEditable] = useState(false)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    socialLoader,
    setSocialHandlesLinksDataMessage,
    setSocialHandlesSuccess,
    setSocialHandlesLinksError,
    playerSettingsLoader,
    isPlayerSettingsError,
    postPlayerSettingsData,
    postVerifyWhatsAppData,
    selectedThemeRedux,
    cartoonSuccess,
    cartoonLoader,
    cartoonStatusLoader,
    cartoonStatusData,
    passphraseLoader,
    txnHash,
    goLiveLoading,
    playerPayoutAddressData,
  } = authenticationData

  const formData = {
    player_contract: contractPlayer,
    twitter: twitter,
    youtube: youtube,
    instagram: instagram,
  }
  const formDataOriginal = {
    player_contract: contractPlayer,
    twitter: twitterOriginal,
    youtube: youtubeOriginal,
    instagram: instagramOriginal,
  }
  useEffect(() => {
    if (setSocialHandlesSuccess === true) {
      console.log('fetching_player_data5')
      dispatch(getPlayerData({}))
    }
  }, [setSocialHandlesSuccess])
  useEffect(() => {
    if (isUpdatePlayerProfileSuccess === 'success') {
      toast.success(t('profile picture updated successfully'))
      dispatch(resetPlayerProfileMessage())
    }
  }, [isUpdatePlayerProfileSuccess])

  const [goLiveLoader, setGoLiveLoader] = useState(false)
  useEffect(() => {
    console.log({ txnConfirmResp })
    if (
      txnConfirmResp[0]?.haserror === 0 ||
      txnConfirmResp[0]?.haserror === 1
    ) {
      clearInterval(txnCheckInterval)
      dispatch(resetTransaction())
      setGoLiveLoader(false)
      dispatch(goLiveLoadingDis({ goLiveLoading: false }))
      // dispatch(resetTxnConfirmationData())
      dispatch(
        getPlayer1Contract({
          url: playerInfo?.detailpageurl,
        }),
      )
    }
  }, [txnConfirmResp])

  console.log({ playerInfo })

  useEffect(() => {
    if (txnConfirmSuccess) {
      clearInterval(txnCheckInterval)
      setGoLiveLoader(false)
      dispatch(goLiveLoadingDis({ goLiveLoading: false }))
      dispatch(resetTxnConfirmationData())
      dispatch(
        getPlayer1Contract({
          url: playerInfo?.detailpageurl,
        }),
      )
    }
  }, [txnConfirmSuccess])
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
  useEffect(() => {
    if (txnHash) {
      handleTxnCheck()
    }
    console.log({ txnHash })
  }, [txnHash])

  useEffect(() => {
    clearInterval(txnCheckInterval)
    if (!document.hidden) {
      if (txnHash) {
        handleTxnCheck()
      }
    }
  }, [document.hidden])
  const [goLiveError, setGoLiveError] = useState('')
  const [liveDelayLoader, setLiveDelayLoader] = useState(false)

  useEffect(() => {
    if (allPlayersData[0]) {
      setLiveDelayLoader(false)
    }
  }, [allPlayersData[0]])

  useEffect(() => {
    if (
      (!isTxnChecking && txnConfirmResp[0]?.haserror === 1) ||
      txnConfirmSuccess
    ) {
      setLiveDelayLoader(false)
      setGoLiveError('An error occurred')
    }
  }, [isTxnChecking, txnConfirmResp[0]])

  useEffect(() => {
    if (
      (!isTxnChecking && txnConfirmResp[0]?.haserror === 0) ||
      txnConfirmSuccess
    ) {
      setTimeout(() => {
        console.log('Getting player data after launch')
        console.log('fetching_player_data6')
        dispatch(getPlayerData({}))
      }, 2000)
    }
  }, [isTxnChecking, txnConfirmResp[0], txnConfirmSuccess])

  useEffect(() => {
    if (isTxnChecking) {
      setGoLiveLoader(true)
    }
  }, [isTxnChecking])
  useEffect(() => {
    if (instaProfileRefetchDataSuccess === true) {
      toast.success(instaProfileRefetchData)
      console.log('fetching_player_data7')
      dispatch(getPlayerData({ isInstaLoading: true }))
      dispatch(resetInstaProfileRefetch())
    }
    if (isinstaProfileRefetchError) {
      toast.error(isinstaProfileRefetchError)
    }
  }, [
    instaProfileRefetchDataSuccess,
    instaProfileRefetchData,
    isinstaProfileRefetchError,
  ])

  const [whatsAppOtp, setWhatsAppOtp] = useState(false)
  const handleCloseWhatsAppOtpPop = () => {
    setWhatsAppOtp(false)
  }
  const handleOpenWhatsAppPop = async () => {
    console.log('fetching_player_data8')
    await dispatch(getPlayerData({}))
    await dispatch(resetPostVerifyWhatsApp())
    await dispatch(resetChangeWhatsAppNumber())
    setWhatsAppOtp(true)
  }
  useEffect(() => {
    if (allPlayersData) {
      if (allPlayersData[0]?.whatsappverified === 0) {
        setWhatsAppOtp(true)
      } else if (
        postVerifyWhatsAppData === 'Number Verified' &&
        allPlayersData[0]?.whatsappverified === 1
      ) {
        setWhatsAppOtp(false)
      }
    }
  }, [allPlayersData, postVerifyWhatsAppData])
  const [allowFanMessage, setAllowFanMessage] = useState(
    playerInfo?.allowfanmessages,
  )

  const onChangeToggle = (checked: boolean) => {
    setAllowFanMessage(checked)
  }

  const [dailyFanMessages, setDailyFanMessages] = useState(
    playerInfo?.dailyfanmessages,
  )
  const [costPerMessages, setCostPerMessages] = useState(
    playerInfo?.costpermessage,
  )
  const [rewardPercentageError, setRewardPercentageError] = useState('')
  const [editPercentageValue, setEditPercentageValue] = useState(true)
  useEffect(() => {
    if (currentValue > 50 || currentValue < 0 || currentValue === '') {
      setRewardPercentageError(t('input_between_0-50'))
      setEditPercentageValue(false)
    } else {
      setRewardPercentageError('')
      setEditPercentageValue(true)
    }
  }, [currentValue])
  const SetRewardPercentageInternal = user_secret => {
    const formDataReward = new FormData()
    formDataReward.append('user_secret', user_secret)
    formDataReward.append('player_contract', player1contract || player2contract)
    formDataReward.append('reward_percentage', currentValue)
    dispatch(newRewardPercentage(formDataReward))
  }
  const SetRewardPercentageExternal = async () => {
    setTxnErr('')
    setRewardPerc(true)
    const provider = await getWeb3Provider()
    const playerContract = new ethers.Contract(
      player1contract, // contract address of Router
      player1contractabi, //  contract abi of Router
      provider.getSigner(loginInfo!),
    )
    const currentValueMultiply = currentValue * 10
    try {
      const reward = await playerContract.setPlayerRewardPercentage(
        currentValueMultiply,
      )
      setTxnHash(reward.hash)
      setRewardPerc(false)
      setGetRewardPerc(true)
    } catch (err: any) {
      const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
      if (isErrorGasEstimation) {
        setTxnErr(t('not enough funds to pay for blockchain transaction'))
      } else {
        setTxnErr(err.reason || err.message)
      }
    }
  }
  useEffect(() => {
    setAllowFanMessage(playerInfo?.allowfanmessages)
    setDailyFanMessages(playerInfo?.dailyfanmessages)
    setCostPerMessages(playerInfo?.costpermessage)
  }, [playerInfo])
  const [editMySettings, setEditMySettings] = useState(false)
  const mySettingsData = {
    player_id: playerInfo?.id,
    allow_fan_message: allowFanMessage,
    daily_messages: dailyFanMessages,
    cost_per_messages: costPerMessages,
  }
  const mySettingsOriginalData = {
    player_id: playerInfo?.id,
    allow_fan_message: playerInfo?.allowfanmessages,
    daily_messages: playerInfo?.dailyfanmessages,
    cost_per_messages: playerInfo?.costpermessage,
  }
  useEffect(() => {
    const eq =
      JSON.stringify(mySettingsData) === JSON.stringify(mySettingsOriginalData)
    if (eq === false) {
      setEditMySettings(true)
    } else {
      setEditMySettings(false)
    }
  }, [mySettingsData, mySettingsOriginalData])
  useEffect(() => {
    if (postPlayerSettingsData === 'Player Settings Saved') {
      console.log('fetching_player_data9')
      dispatch(getPlayerData({}))
    }
  }, [postPlayerSettingsData])
  useEffect(() => {
    if (AddPayoutData) {
      setTimeout(() => {
        getPayoutAddressInternal()
      }, 5000)
    }
  }, [AddPayoutData])
  useEffect(() => {
    const eq = JSON.stringify(formData) === JSON.stringify(formDataOriginal)
    if (eq === false) {
      setEditable(true)
    }
  }, [formData, formDataOriginal])
  const navigate = useNavigate()

  useEffect(() => {
    if (allPlayersData) {
      setInstagram(
        allPlayersData[0]?.instagram != null
          ? allPlayersData[0]?.instagram
          : '',
      )
      setInstagramOriginal(
        allPlayersData[0]?.instagram != null
          ? allPlayersData[0]?.instagram
          : '',
      )
      setTwitter(
        allPlayersData[0]?.twitter != null ? allPlayersData[0]?.twitter : '',
      )
      setTwitterOriginal(
        allPlayersData[0]?.twitter != null ? allPlayersData[0]?.twitter : '',
      )
      setYoutube(
        allPlayersData[0]?.youtube != null ? allPlayersData[0]?.youtube : '',
      )
      setYoutubeOriginal(
        allPlayersData[0]?.youtube != null ? allPlayersData[0]?.youtube : '',
      )
      setContractPlayer(
        allPlayersData[0]?.playercontract
          ? allPlayersData[0]?.playercontract
          : '',
      )
    }
  }, [allPlayersData])

  let repeat: any = null

  const checkPlayerDetail = (isRepeat?: any) => {
    clearInterval(repeat)
    repeat = setInterval(() => {
      if (isRepeat === 'noReload') {
        console.log('fetching_player_data10')
        dispatch(getPlayerData({ isReloading: true }))
      } else {
        console.log('fetching_player_data11')
        dispatch(getPlayerData({}))
      }
    }, 5000)
  }

  useEffect(() => {
    clearInterval(repeat)
    if (!document.hidden) {
      if (txnHashInner) {
        checkPlayerDetail('noReload')
      }
    }
  }, [document.hidden])

  const getCropData = async () => {
    if (typeof cropper !== 'undefined') {
      if (nftMedia) {
        const url = cropper.getCroppedCanvas().toDataURL()
        const file = await dataUrlToFileUsingFetch(
          url,
          'output.webp',
          'image/png',
        )
        let imageFile: any
        Resizer.imageFileResizer(
          file,
          400,
          400,
          'PNG',
          100,
          0,
          output => {
            imageFile = output as File
            const formData = new FormData()
            formData.append('id', String(playerInfo?.id || selectedPlayer?.id))
            formData.append('playerpicture', imageFile)
            dispatch(updatePlayerProfile(formData))
            setImage('')
          },
          'file',
          800,
          800,
        )
      } else {
        setImage('')
      }
    }
    setImageWidth(1)
    setCropStatus(false)
  }

  const dataUrlToFileUsingFetch = async (
    url: string,
    fileName: string,
    mimeType: string,
  ) => {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    return new File([buffer], fileName, { type: mimeType })
  }

  const toggle = (i: number) => {
    if (selected === i) {
      return setSelected(0)
    }
    setSelected(i)
  }

  const handleGoLive = () => {
    if (!isMobile()) {
      setTxnErr('')
      setTxnHash('')
      setLivePromptActive(true)
      setGoLiveLoader(true)
      setLiveDelayLoader(true)
    } else {
      setGoLiveLoader(true)
      setLiveDelayLoader(true)
      navigate('/app/confirm_go_live')
    }
  }

  const handleLiving = () => {
    // console.log('golive', {
    //   player1contract,
    //   player1contractabi,
    //   nftcontract,
    //   stakingcontract,
    // })
    if (goLiveChoice) {
      localStorage.removeItem('optedGoLive')
    }
    setIsGoLiveInProgress(true)
    if (!player1contract) {
      return
    }
    const nftContract = Web3.utils.toChecksumAddress(nftcontract)
    const stakingContract = Web3.utils.toChecksumAddress(stakingcontract)
    const promise = callWeb3Method(
      'initialize',
      player1contract,
      player1contractabi,
      [nftContract, stakingContract],
    )
    promise
      .then(async (txn: any) => {
        setTxnHash(txn.hash)
        localStorage.setItem('ISGOLIVECLICKED', 'true')
        setIsGoLiveInProgress(false)
        checkPlayerDetail('noReload')
      })
      .catch((err: any) => {
        setIsGoLiveInProgress(false)
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

  useEffect(() => {
    if (allPlayersData && allPlayersData.length > 0 && !playerInfo) {
      // remove destructuring after api working successfully

      const playerDataNew = {
        ...selectedPlayer,
      }
      setPlayerInfo(playerDataNew)
      const reqParams = {
        address: playerDataNew?.playercontract,
      }
      if (
        playerInfo?.playerstatusid?.id === 5 ||
        playerInfo?.playerlevelid === 5
      ) {
        dispatch(fetchPlayersBalance(reqParams))
      }
      dispatch(getAddedAgents(playerDataNew?.playercontract))
    }
  }, [allPlayersData, playerInfo])

  useEffect(() => {
    if (playerInfo && selected === 5) {
      const reqParams = {
        address: selectedPlayer?.playercontract,
      }
      if (
        playerInfo?.playerstatusid?.id === 5 ||
        playerInfo?.playerlevelid === 5
      ) {
        dispatch(fetchPlayersBalance(reqParams))
      }
    }
  }, [playerInfo, selected])

  useEffect(() => {
    if (selectedPlayer?.id) {
      setPlayerInfo(selectedPlayer)
    }
  }, [selectedPlayer])

  const onSetNFTFile = (e: any) => {
    setImageValidationError('')
    // e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as any)
      const img = new Image() // Image constructor
      img.src = reader.result?.toString() ?? ''
      img.onload = () => {
        if (img.width === 0) {
          setImageWidth(200)
        } else {
          setImageWidth(img.width)
        }
      }
      img.onerror = () => {
        if (img.width === 0) {
          setImageWidth(200)
        } else {
          setImageWidth(img.width)
        }
      }
    }
    reader.readAsDataURL(files[0])
    if (files && files.length) {
      setNFTMedia(files[0])
    }
  }

  useEffect(() => {
    if (imageWidth > 1) {
      setCropStatus(true)
    }
  }, [imageWidth])

  const handleFileInput = () => {
    if (inputFile.current) {
      inputFile.current.click()
    }
  }

  const handleInstaRefetch = () => {
    if (playerInfo?.instagram) {
      dispatch(initCartoonizeStatus())
      dispatch(instaProfileRefetch({ id: playerInfo?.id }))
    } else {
      toast.error(t('please upload instagram profile url'))
    }
  }
  const handleCartoonToggle = () => {
    if (playerInfo?.cartoonfilter) {
      toast.error(t('Filter is mandatory'))
    } else {
      dispatch(postCartoon({ player_id: playerInfo?.id }))
    }
  }
  useEffect(() => {
    if (cartoonSuccess) {
      toast.success(cartoonSuccess)
      console.log('fetching_player_data12')
      dispatch(getPlayerData({}))
    }
  }, [cartoonSuccess])
  useEffect(() => {
    clearInterval(intervalRef.current)
    if (allPlayersData[0]?.cartoonizing || playerInfo?.cartoonizing) {
      // Start the interval when the component mounts
      intervalRef.current = setInterval(() => {
        if (playerInfo?.id) {
          dispatch(getCartoonizeStatus({ player_id: playerInfo?.id }))
        }
      }, 5000) // Runs every 5 second (5000 milliseconds)
    }
  }, [playerInfo?.cartoonizing, allPlayersData[0]?.cartoonizing])

  useEffect(() => {
    if (
      playerInfo?.cartoonizing === false ||
      allPlayersData[0]?.cartoonizing === false ||
      cartoonStatusData === false
    ) {
      clearInterval(intervalRef.current)
      console.log('fetching_player_data13', cartoonStatusData)
      dispatch(getPlayerData({}))
    }
  }, [
    playerInfo?.cartoonizing,
    cartoonStatusData,
    allPlayersData[0]?.cartoonizing,
  ])

  const handleChangeInput = (evt: any) => {
    const inputDataTemp: any = { ...inputData }
    inputDataTemp[evt.target.name] = evt.target.value
    setInputData(inputDataTemp)
    if (evt.target.value === '') {
      if (evt.target.name === 'agentAccount') {
        setAgentAccountErr(t(''))
      } else {
        setAdminAccountErr(t(''))
      }
    }
    if (evt.target.name === 'agentAccount') {
      setEthAddress(inputDataTemp?.agentAccount)
    } else {
      setEthAddress(inputDataTemp?.adminAccount)
    }
  }

  const handleClearInput = (feildname: string) => {
    const inputDataTemp: any = { ...inputData }
    inputDataTemp[feildname] = ''
    setInputData(inputDataTemp)
  }

  const handleAddAdminAccount = async () => {
    try {
      const isAddressValid = ethers.utils.getAddress(inputData?.adminAccount)
      if (isAddressValid) {
        dispatch(showVotingMobile({ playerCoinSettingsMobileView: true }))
        setRemoveAdminPrompt(true)
        setTxnErr('')
        setTxnHash('')
        setPromptDialog('')
        setWeb3Action('')
        setPromptDialog(
          t('are you sure you want to add this address as admin player'),
        )
        setWeb3Action('addAdmin')
        setAdminAccountErr('')
      } else {
        setAdminAccountErr(t('invalid etherium address'))
      }
    } catch (error) {
      setAdminAccountErr(t('invalid etherium address'))
    }
  }
  const handleAddPayoutAddress = async () => {
    try {
      const isAddressValid = ethers.utils.getAddress(rewardAddress)
      if (isAddressValid) {
        dispatch(showVotingMobile({ playerCoinSettingsMobileView: true }))
        setRemoveAdminPrompt(true)
        setTxnErr('')
        setTxnHash('')
        setPromptDialog('')
        setWeb3Action('')
        setPromptDialog(
          t(
            'are you sure you want to add this address as new payout address ?',
          ),
        )
        setWeb3Action('addPayout')
        setPayoutErr('')
      } else {
        setPayoutErr(t('invalid etherium address'))
      }
    } catch (error) {
      setPayoutErr(t('invalid etherium address'))
    }
  }

  const handleRewardPercentage = async () => {
    dispatch(showVotingMobile({ playerCoinSettingsMobileView: true }))
    setRemoveAdminPrompt(true)
    setTxnErr('')
    setTxnHash('')
    setPromptDialog('')
    setWeb3Action('')
    setPromptDialog(
      t('are you sure you want to add this value as new reward percentage ?'),
    )
    setWeb3Action('addRewardPerc')
  }

  const handleAddAgent = async () => {
    try {
      const isAddressValid = ethers.utils.getAddress(inputData.agentAccount)
      if (isAddressValid) {
        dispatch(showVotingMobile({ playerCoinSettingsMobileView: true }))
        setTxnErr('')
        setTxnHash('')
        setRemoveAdminPrompt(true)
        setPromptDialog(t('are you sure you want to add this address as agent'))
        setWeb3Action('setAgentAddress')
      } else {
        setAgentAccountErr(t('invalid etherium address'))
      }
    } catch (error) {
      setAgentAccountErr(t('invalid etherium address'))
    }
  }

  const handleRemoveAdmin = async (adminPlayer: any) => {
    const { address } = adminPlayer
    dispatch(showVotingMobile({ playerCoinSettingsMobileView: true }))
    setRemoveAdminPrompt(true)
    setTxnErr('')
    setTxnHash('')
    setWeb3Action('removeAdmin')
    setPromptDialog(t('are you sure you want to remove this admin player'))
    setEthAddress(address)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => {
      clearInterval(repeat)
      clearInterval(intervalRef.current)
      clearInterval(txnCheckInterval)
    }
  }, [])

  useEffect(() => {
    if (nftMedia) {
      const objectUrl = URL.createObjectURL(nftMedia)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [nftMedia])

  const handleMaticSelect = (evt: any) => {
    evt.stopPropagation()
    if (fetchBalancePlayersData?.matic > 0) {
      setWithdrawAvailable(true)
      setSelectedAsset({
        type: 'matic',
        amount: fetchBalancePlayersData?.matic,
      })
    } else {
      setSelectedAsset({})
      setWithdrawAvailable(false)
    }
  }

  const handleTokenSelect = (evt: any, token: any) => {
    evt.stopPropagation()
    if (token?.balance > 0 || token.stakingbalance > 0) {
      setWithdrawAvailable(true)
      setSelectedAsset({
        type: 'token',
        contract: token?.contract,
        tokenId: token.name,
        amount: token?.balance,
      })
    } else {
      setSelectedAsset({})
      setWithdrawAvailable(false)
    }
  }

  const getWithdrawPromptText = () => {
    let text =
      t('are you sure you want to withdraw') + ' ' + selectedAsset?.amount
    if (selectedAsset?.type === 'token') {
      text += ' tokens?'
    } else {
      text += ' MATIC?'
    }
    return text
  }

  const handleWithdraw = () => {
    if (['token', 'matic'].includes(selectedAsset.type)) {
      setAdminActionInProgress(true)
      setTxnErr('')
      setTxnHash('')
    }
  }

  const handleWithdrawSuccess = () => {
    const methodName =
      selectedAsset?.type === 'token'
        ? 'playerTokenWithdraw'
        : 'playerNativeWithdraw'
    const methodParam =
      selectedAsset?.type === 'token' ? [selectedAsset?.contract] : []
    const promise = callWeb3Method(
      methodName,
      player1contract,
      player1contractabi,
      methodParam,
    )
    promise
      .then((txn: any) => {
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

  const handleWithdrawSuccessApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('contract', selectedPlayer?.playercontract)
    formData.append('user_secret', user_secret)
    if (selectedAsset?.type === 'token') {
      dispatch(playerTokenWithdraw(formData))
    } else {
      dispatch(nativeWithdraw(formData))
    }
  }

  const handleRemoveAdminPrompt = () => {
    console.log('HRAP--', web3Action)
    const playerDataNew = {
      ...selectedPlayer,
    }
    dispatch(showVotingMobile({ playerCoinSettingsMobileView: false }))
    setRemoveAdminPrompt(false)
    setAdminActionInProgress(false)
    setLivePromptActive(false)
    setTxnErr('')
    setTxnHash('')
    setPromptDialog('')
    setWeb3Action('')
    if (web3Action === 'addAdmin') {
      handleClearInput('adminAccount')
      console.log('fetching_player_data14')
      dispatch(getPlayerData({}))
    } else if (web3Action === 'setAgentAddress') {
      handleClearInput('agentAccount')
      dispatch(getAddedAgents(playerDataNew?.playercontract))
    }
    const reqParams = {
      address: playerInfo?.playercontract, //playerDataNew?.playercontract,
    }
    if (
      playerInfo?.playerstatusid?.id === 5 ||
      playerInfo?.playerlevelid === 5
    ) {
      dispatch(fetchPlayersBalance(reqParams))
    }
  }

  const getDisabledWithdrawBtn = () => {
    if (
      playerInfo?.playerstatusid?.id === 5 ||
      playerInfo?.playerlevelid === 5
    ) {
      if (!withdrawAvailable) {
        return true
      }
      return false
    }
    return true
  }

  const getRequestParams = () => {
    const { adminAccount } = inputData
    if (web3Action === 'addAdmin') {
      return adminAccount
    } else if (web3Action === 'removeAdmin') {
      return ethAddress
    }
    return ''
  }
  const [rewardAddress, setRewardAddress] = useState('')
  const [payoutAddress, setPayoutAddress] = useState('')

  // INTERNAL_API_INTEGRATION
  useEffect(() => {
    if (playerPayoutAddressData) {
      setPayoutAddress(playerPayoutAddressData)
      console.log('playerPayoutAddressData', playerPayoutAddressData)
    }
  }, [playerPayoutAddressData])

  const getPayoutAddressInternal = async () => {
    // INTERNAL_API_INTEGRATION
    dispatch(
      getPlayerPayoutAddress({
        playerContract: player1contract || player2contract,
      }),
    )
    // const userWalletAddressUnder = await localStorage.getItem(
    //   'userWalletAddress',
    // )
    // const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
    //   POLYGON_NETWORK_RPC_URL,
    // )
    // const playerContract = new ethers.Contract(
    //   player1contract, // contract address of Router
    //   player1contractabi, //  contract abi of Router
    //   simpleRpcProvider.getSigner(userWalletAddressUnder!),
    // )
    // try {
    //   const reward = await playerContract.playerPayoutAddress()
    //   setPayoutAddress(reward)
    // } catch (error) {
    //   console.log('error', error)
    // }
  }
  // const getPayoutAddressExternal = async () => {
  //   const provider = await getWeb3Provider()
  //   const playerContract = new ethers.Contract(
  //     player1contract, // contract address of Router
  //     player1contractabi, //  contract abi of Router
  //     provider.getSigner(loginInfo!),
  //   )
  //   try {
  //     const reward = await playerContract.playerPayoutAddress()
  //     setPayoutAddress(reward)
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }
  const getPayoutAddressExternal = async () => {
    const provider = await getWeb3Provider()
    console.log({
      player1contract,
      player1contractabi,
      loginInfo,
      playerInfo,
    })
    const playerContract = new ethers.Contract(
      player1contract, // contract address of Router
      player1contractabi, //  contract abi of Router
      provider.getSigner(loginInfo!),
    )
    try {
      const reward = await playerContract.playerPayoutAddress()
      console.log({ reward })
      setPayoutAddress(reward)
    } catch (error) {
      console.log('error', error)
    }
  }
  const setRewardAddressForExternal = async () => {
    setTxnErr('')
    setPayout(true)
    const provider = await getWeb3Provider()
    const playerContract = new ethers.Contract(
      player1contract, // contract address of Router
      player1contractabi, //  contract abi of Router
      provider.getSigner(loginInfo!),
    )
    try {
      const address = Web3.utils.toChecksumAddress(rewardAddress)
      const reward = await playerContract.setPlayerPayoutAddress(address)
      setTxnHash(reward.hash)
      setPayout(false)
      setGetPlayerDispatch(true)
    } catch (err: any) {
      const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
      if (err.message === '406') {
        setTxnErr(t('this functionality unavailable for internal users'))
      }
      if (isErrorGasEstimation) {
        setTxnErr(t('not enough funds to pay for blockchain transaction'))
      } else {
        setTxnErr(err.reason || err.message)
      }
    }
  }

  const handleActionSuccess = async () => {
    for (let i = 0; i < 2; i++) {
      await sleep(i * 1000)
    }
    const reqparam: string = getRequestParams()
    let promise: any = null
    if (web3Action === 'addPayout') {
      setRewardAddressForExternal()
      return
    }
    if (web3Action === 'addRewardPerc') {
      SetRewardPercentageExternal()
      return
    }
    if (web3Action === 'setAgentAddress') {
      promise = callWeb3Method(
        'setAgentAddress',
        player1contract,
        player1contractabi,
        [inputData.agentAccount], //[adminAccount],
      )
    } else {
      promise = callWeb3Method(
        web3Action === 'addAdmin' ? 'setPlayerRole' : 'revokePlayerRole',
        player1contract,
        player1contractabi,
        [reqparam], //[adminAccount],
      )
    }
    promise
      ?.then((txn: any) => {
        setTxnHash(txn.hash)
        if (web3Action === 'setAgentAddress') {
          handleClearInput('agentAccount')
        } else {
          handleClearInput('adminAccount')
        }
      })
      .catch((err: any) => {
        if (web3Action === 'setAgentAddress') {
          handleClearInput('agentAccount')
        } else {
          handleClearInput('adminAccount')
        }
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

  const handleActionSuccessApi = (user_secret: any) => {
    const formData = new FormData()
    const reqparam: string = getRequestParams()
    formData.append('contract', selectedPlayer?.playercontract)
    formData.append('user_secret', user_secret)
    if (web3Action === 'addPayout') {
      const formData1 = new FormData()
      formData1.append('user_secret', user_secret)
      formData1.append('player_contract', selectedPlayer?.playercontract)
      formData1.append('payout_address', rewardAddress)
      dispatch(AddPayout(formData1))
    }
    if (web3Action === 'addRewardPerc') {
      SetRewardPercentageInternal(user_secret)
    }
    if (web3Action === 'addAdmin') {
      formData.append('address', reqparam)
      dispatch(addAdmin(formData))
    } else if (web3Action === 'setAgentAddress') {
      formData.append('agent_address', inputData.agentAccount)
      dispatch(addAgent(formData))
    } else if (web3Action === 'removeAdmin') {
      formData.append('address', reqparam)
      dispatch(revokeAdmin(formData))
    }
  }

  const handleCloseDialog: any = () => {
    setAdminActionInProgress(false)
    setTxnHash('')
    setTxnErr('')
    setPromptDialog('')
    const reqParams = {
      address: playerInfo?.playercontract, //playerDataNew?.playercontract,
    }
    if (
      playerInfo?.playerstatusid?.id === 5 ||
      playerInfo?.playerlevelid === 5
    ) {
      dispatch(fetchPlayersBalance(reqParams))
    }
  }

  const handleCancelGoLive = () => {
    console.log('HCGL---')
    setGoLiveLoader(false)
    setLivePromptActive(false)
    setIsGoLiveInProgress(false)
    setTxnErr('')
    setTxnHash('')
    dispatch(resetTransaction())
  }

  const handleLaunchCoinApi = (user_secret: any) => {
    localStorage.setItem('ISGOLIVECLICKED', 'true')
    setGoLiveClicked(true)
    try {
      const formData = new FormData()
      formData.append('contract', selectedPlayer?.playercontract)
      formData.append('user_secret', user_secret)
      dispatch(launchCoin(formData))
    } catch (error) {
      console.log(error)
    }
  }
  const getRewardPercentageExternal = async () => {
    console.log('getRewardPercentageExternal')
    // const provider = await getWeb3Provider()
    // const playerContractReward = new ethers.Contract(
    //   player1contract || player2contract, // contract address of Router
    //   player1contractabi || player2contractabi, //  contract abi of Router
    //   provider.getSigner(loginInfo!),
    // )
    // try {
    //   const getReward = await playerContractReward?.playerRewardPercentage()
    //   const getReward1 = await playerContractReward?.playerPayoutPercentage()
    //   const value = parseInt(getReward._hex) / 10
    //   const value1 = parseInt(getReward1._hex) / 10
    //   setCurrentValue(value)
    //   setTradingValue(value1)
    // } catch (error) {
    //   console.log('error', error)
    // }
  }

  const getRewardPercentageInternal = async () => {
    console.log('getRewardPercentageInternal')
    // const userWalletAddressUnder = await localStorage.getItem(
    //   'userWalletAddress',
    // )
    // const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
    //   POLYGON_NETWORK_RPC_URL,
    // )
    // const playerContractReward = new ethers.Contract(
    //   player1contract || player2contract, // contract address of Router
    //   player1contractabi || player2contractabi, //  contract abi of Router
    //   simpleRpcProvider.getSigner(userWalletAddressUnder!),
    // )
    // try {
    //   const getReward = await playerContractReward.playerRewardPercentage()
    //   const getReward1 = await playerContractReward.playerPayoutPercentage()
    //   const value = parseInt(getReward._hex) / 10
    //   const value1 = parseInt(getReward1._hex) / 10
    //   setCurrentValue(value)
    //   setTradingValue(value1)
    // } catch (error) {
    //   console.log('error', error)
    // }
  }
  useEffect(() => {
    if (loginInfo && playerInfo && player1contract) {
      // getRewardPercentageExternal()
      getPayoutAddressExternal()
    }
    if (loginId && player1contract && playerInfo) {
      // getRewardPercentageInternal()
      getPayoutAddressInternal()
    }
  }, [playerInfo, player1contract])
  const [openTooltip, setOpenTooltip] = useState(false)
  //----------------------------------------------------------

  return (
    <div className="player-coin fullheight">
      {!isMobile() && (
        <DialogBox
          isOpen={
            isRemoveAdminPropmt || livePromptActive || isAdminActionInProgress
          }
          onClose={handleRemoveAdminPrompt}
          contentClass="onboarding-popup"
        >
          {isRemoveAdminPropmt ? (
            <>
              {localStorage.getItem('loginId') ? (
                <ApiActionPrompt
                  promptText={promptDialog}
                  walletAddress={
                    web3Action === 'addPayout'
                      ? rewardAddress
                      : web3Action === 'addRewardPerc'
                      ? `${currentValue}%`
                      : ethAddress
                  }
                  hideWalletAddress={
                    web3Action === 'addPayout' || web3Action === 'addRewardPerc'
                      ? true
                      : false
                  }
                  onSuccess={handleActionSuccessApi}
                  onClose={handleRemoveAdminPrompt}
                  customClass="purchase-pc-bottomwrapper"
                />
              ) : (
                <Web3ActionPrompt
                  txnHash={txnHashInner}
                  errorMsg={txnErr}
                  promptText={promptDialog}
                  onSuccess={handleActionSuccess}
                  onClose={handleRemoveAdminPrompt}
                  walletAddress={
                    web3Action === 'addPayout'
                      ? rewardAddress
                      : web3Action === 'addRewardPerc'
                      ? `${currentValue}%`
                      : ethAddress
                  }
                  operationMode={
                    [
                      'addAdmin',
                      'setAgentAddress',
                      'addRewardPerc',
                      'addPayout',
                    ].includes(web3Action)
                      ? 'add'
                      : 'remove'
                  }
                  isPayout={isPayout}
                  isDispatch={getPlayerDispatch}
                  isRewardPerc={isRewardPerc}
                  getRewardPerc={getRewardPerc}
                  getRewardPercValue={getRewardPercentageExternal}
                  getPayoutAddress={getPayoutAddressExternal}
                  customClass={isMobile() ? 'exwallet-bottomwrapper' : ''}
                />
              )}
            </>
          ) : livePromptActive ? (
            <>
              {localStorage.getItem('loginId') ? (
                <ApiActionPrompt
                  hideWalletAddress={false}
                  promptText={t('you are about to switch on your player coin')}
                  onSuccess={handleLaunchCoinApi}
                  onClose={handleCancelGoLive}
                  customClass={
                    isMobile() ? 'go-live-web3 purchase-pc-bottomwrapper' : ''
                  }
                  noPasswordForm={true}
                />
              ) : (
                // <Web3ActionPrompt
                //   txnHash={txnHash}
                //   errorMsg={txnErr}
                //   promptText={t('you are about to switch on your player coin')}
                //   onSuccess={handleLiving}
                //   onClose={handleCancelGoLive}
                //   walletAddress={ethAddress}
                //   operationMode={'add'}
                //   customClass={isMobile() ? 'exwallet-bottomwrapper' : ''}
                // />
                <ApiActionPrompt
                  hideWalletAddress={false}
                  promptText={t('you are about to switch on your player coin')}
                  onSuccess={handleLaunchCoinApi}
                  onClose={handleCancelGoLive}
                  customClass={
                    isMobile() ? 'go-live-web3 purchase-pc-bottomwrapper' : ''
                  }
                  noPasswordForm={true}
                />
              )}
            </>
          ) : isAdminActionInProgress ? (
            <>
              {localStorage.getItem('loginId') ? (
                <ApiActionPrompt
                  promptText={getWithdrawPromptText()}
                  onSuccess={handleWithdrawSuccessApi}
                  onClose={handleCloseDialog}
                  customClass={
                    isMobile() ? 'go-live-web3 purchase-pc-bottomwrapper' : ''
                  }
                />
              ) : (
                <Web3ActionPrompt
                  txnHash={txnHashInner}
                  errorMsg={txnErr}
                  promptText={getWithdrawPromptText()}
                  onSuccess={handleWithdrawSuccess}
                  onClose={handleCloseDialog}
                  walletAddress={''}
                  operationMode={'add'}
                  customClass={isMobile() ? 'exwallet-bottomwrapper' : ''}
                />
              )}
            </>
          ) : null}
        </DialogBox>
      )}
      {isMobile() && (isRemoveAdminPropmt || isAdminActionInProgress) ? (
        isRemoveAdminPropmt ? (
          <>
            {localStorage.getItem('loginId') ? (
              <ApiActionPrompt
                promptText={promptDialog}
                onSuccess={handleActionSuccessApi}
                onClose={handleRemoveAdminPrompt}
                customClass={
                  isMobile() ? 'go-live-web3 purchase-pc-bottomwrapper' : ''
                }
              />
            ) : (
              <Web3ActionPrompt
                txnHash={txnHashInner}
                errorMsg={txnErr}
                promptText={promptDialog}
                onSuccess={handleActionSuccess}
                onClose={handleRemoveAdminPrompt}
                walletAddress={ethAddress}
                operationMode={
                  ['addAdmin', 'setAgentAddress'].includes(web3Action)
                    ? 'add'
                    : 'remove'
                }
                customClass={isMobile() ? 'exwallet-bottomwrapper' : ''}
              />
            )}
          </>
        ) : (
          <>
            {localStorage.getItem('loginId') ? (
              <ApiActionPrompt
                promptText={getWithdrawPromptText()}
                onSuccess={handleWithdrawSuccessApi}
                onClose={handleCloseDialog}
                customClass={
                  isMobile() ? 'go-live-web3 purchase-pc-bottomwrapper' : ''
                }
              />
            ) : (
              <Web3ActionPrompt
                txnHash={txnHashInner}
                errorMsg={txnErr}
                promptText={getWithdrawPromptText()}
                onSuccess={handleWithdrawSuccess}
                onClose={handleCloseDialog}
                walletAddress={''}
                operationMode={'add'}
                customClass={isMobile() ? 'exwallet-bottomwrapper' : ''}
              />
            )}
          </>
        )
      ) : (
        <>
          {!cropStatus && (
            <div className="player-avatar">
              <div className="icon-camera" onClick={handleFileInput}>
                <CameraAltOutlinedIcon className="icon-camera-svg" />
                <input
                  id="media"
                  name="nftMedia"
                  accept="image/*"
                  type="file"
                  autoComplete="off"
                  tabIndex={-1}
                  style={{ display: 'none' }}
                  ref={inputFile}
                  onChange={onSetNFTFile}
                />
              </div>
              {playerInfo?.instagram && (
                <div className="icon_insta" onClick={handleInstaRefetch}>
                  <ImageComponent
                    src={
                      selectedThemeRedux === 'Black'
                        ? InstagramProfileBlack
                        : InstagramProfile
                    }
                    width="23px"
                    height="23px"
                    alt="icon"
                  />
                </div>
              )}

              {playerInfo?.cartoonfilter ? (
                <TooltipLabel title={t('remove_cartoonize_player_profile')}>
                  <div className="mask_insta" onClick={handleCartoonToggle}>
                    <ImageComponent
                      src={
                        selectedThemeRedux === 'Black'
                          ? MaskIconWhite
                          : MaskIcon
                      }
                      width="23px"
                      height="23px"
                      alt="icon"
                    />
                  </div>
                </TooltipLabel>
              ) : (
                <TooltipLabel title={t('cartoonize_player_profile')}>
                  <div
                    className="mask_insta_enabled"
                    style={{
                      background:
                        theme === 'Ladies'
                          ? '#f5f5f5'
                          : theme === 'Light'
                          ? '#f5f5f5'
                          : '#222435',
                    }}
                    onClick={handleCartoonToggle}
                  >
                    <ImageComponent
                      src={
                        theme === 'Ladies'
                          ? MaskIconEnabledLadies
                          : theme === 'Gold'
                          ? MaskIconEnabledGold
                          : MaskIconEnabled
                      }
                      width="23px"
                      height="23px"
                      alt="icon"
                    />
                  </div>
                </TooltipLabel>
              )}
              {allPlayersData[0]?.playerpicture ||
              playerInfo?.playerpicturethumb ? (
                <div>
                  {pictureUploadLoader ||
                  isinstaProfileRefetchLoading ||
                  isInstaProfileLoading ||
                  cartoonLoader ||
                  defaultLoader ? (
                    <div
                      className="player-avatar-root"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="player-avatar-root">
                      {/* <ImageComponent
                        src={allPlayersData[0]?.playerpicture}
                        alt=""
                        className="player-avatar-picture"
                      /> */}
                      <PlayerImageProfile
                        src={
                          playerInfo?.playerpicturethumb ||
                          allPlayersData[0]?.playerpicture
                        }
                        alt=""
                        className="player-avatar-picture"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <PersonOutlineIcon className="player-avatar-svg" />
              )}
            </div>
          )}
          {allPlayersData[0]?.cartoonizing || playerInfo?.cartoonizing ? (
            <div className="cartoonizing_loader_wrapper">
              <p className="fg-primary-color">{t('cartoonizing..')}</p>
              <div className={classNames('spinner size-small_cartoon')}></div>
            </div>
          ) : null}
          {/* {goLiveError && (
            <div className="flex_container  error_occured_go_live">
              {goLiveError}
            </div>
          )} */}
          {/* {console.log({
            passphraseLoader,
            isTxnChecking,
            goLiveLoader,
            goLiveLoading,
            liveDelayLoader,
            playerInfo,
            isGoLiveClicked,
            isGoLiveInProgress,
          })} */}
          {/* //commented GO LIVE Button */}
          {/* {passphraseLoader ||
          isTxnChecking ||
          goLiveLoader ||
          goLiveLoading ||
          (playerInfo?.playerContract && playerInfo?.playerstatusid.id < 4) ||
          liveDelayLoader ? (
            <>
              <div className="new-draft-title">
                {t('switching on member shares')}
              </div>
              <div className="flex_container m-40auto">
                <div className={classNames('spinner')}></div>
              </div>
            </>
          ) : (
            <>
              {playerInfo?.playerstatusid.id < 4 &&
                !isGoLiveClicked &&
                !isGoLiveInProgress &&
                !goLiveLoading &&
                !liveDelayLoader && (
                  <>
                    {goLiveBtnClicked ||
                    localStorage.getItem('ISGOLIVECLICKED') ? (
                      <div className="flex_container m-40auto">
                        <div className={classNames('spinner')}></div>
                      </div>
                    ) : (
                      <SubmitButton
                        isDisabled={goLiveLoading}
                        title={t('go live')}
                        onPress={handleGoLive}
                        className="m-40auto"
                      />
                    )}
                  </>
                )}
            </>
          )} */}
          {imageValidationError && (
            <div className="input-feedback text-center mb-20">
              {imageValidationError}
            </div>
          )}
          {cropStatus && (
            <div className="cropper-container">
              <div style={{ width: '100%' }}>
                <Cropper
                  style={{ height: 400, width: '100%' }}
                  // zoomTo={imageWidth <= 1 ? 1 : 284.0 / imageWidth}
                  zoomTo={0}
                  initialAspectRatio={1 / 1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  // aspectRatio={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  // cropBoxResizable={true}
                  // draggable={false}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  onInitialized={instance => {
                    setCropper(instance)
                  }}
                  guides={true}
                />
                {/* <Cropper
                  // ref={cropperRef}
                  style={{ height: 400, width: '100%' }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  guides={true}
                /> */}
              </div>
              <div className="button-line">
                <button className="form-submit-btn" onClick={getCropData}>
                  {t('upload')}
                </button>
              </div>
            </div>
          )}
          {/* My Referral Codes */}
          {/* <div className="accordion">
            <div className="item" key={8}>
              <div className="title" onClick={() => toggle(8)}>
                <h2>{t('My Referral Codes')}</h2>
                {selected === 8 ? <ArrowUp /> : <ArrowDown />}
              </div>
              <div className={selected === 8 ? 'content show' : 'content'}>
                <div>
                  <div className="referral_code_wrapper">
                    <div
                      className="referral_code_enabled"
                      style={{
                        color:
                          selectedThemeRedux === 'Black' ? 'white' : 'black',
                      }}
                    >
                      ab35df5r
                    </div>
                    <div className="copy_share_icon_wrapper">
                      <div className="share_wrapper">
                        <LinkIcon
                          className="share_icon"
                          style={{
                            color:
                              selectedThemeRedux === 'Black'
                                ? 'white'
                                : 'black',
                          }}
                        />
                      </div>
                      <div className="share_wrapper">
                        <ImageComponent
                          className="share_icon"
                          src={
                            selectedThemeRedux === 'Black'
                              ? ShareIconBlack
                              : ShareIcon
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="referral_code_wrapper">
                    <div className="referral_code_disabled">ac95df4r</div>
                    <div>
                      <p>Thierno Bah ($THBA)</p>
                    </div>
                  </div>
                  <div className="referral_code_wrapper">
                    <div className="referral_code_disabled">ad85de3r</div>
                    <div>
                      <p>Alessandro Pecorelli ($ALPE)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="input-label">{t('player level')}</div>
          <div
            className={classNames(
              'input-label fg-primary-color mb-20',
              getPlayerLevelName(playerInfo?.playerlevelid) === 'Diamond'
                ? 'player_level_diamond'
                : getPlayerLevelName(playerInfo?.playerlevelid) === 'Gold'
                ? 'player_level_gold'
                : getPlayerLevelName(playerInfo?.playerlevelid) === 'Silver'
                ? 'player_level_silver'
                : getPlayerLevelName(playerInfo?.playerlevelid) === 'Bronze'
                ? 'player_level_bronze'
                : '',
            )}
          >
            {getPlayerLevelName(playerInfo?.playerlevelid)}
          </div>
          <div className="input-label">{t('player name')}</div>
          <div className="input-label player-value text-primary-color mb-20 name-label">
            {playerInfo?.givenname + ' ' + playerInfo?.surname}
          </div>
          <div className="input-label">{t('date of Birth')}</div>
          <div className="input-label player-value text-primary-color mb-20">
            {playerInfo?.dateofbirth}
          </div>
          {playerInfo?.email !== null && (
            <>
              <div className="input-label">
                {t('email address (not shared)')}
              </div>
              <div className="input-label player-value text-primary-color mb-20">
                {playerInfo?.email}
              </div>
            </>
          )}
          {playerInfo?.mobilenumber !== null && (
            <>
              <div className="input-label">
                {t('mobile phone number (not shared)')}
              </div>
              <div className="input-label player-value text-primary-color mb-20">
                {playerInfo?.mobilenumber}
              </div>
            </>
          )}
          <div className="input-label">{t('nationality')}</div>
          <div className="input-label player-value text-primary-color mb-20">
            {/* {playerInfo?.nationality?.countryname} */}
            {getCountryNameNew(
              playerInfo?.country_id || playerInfo?.nationality_id,
            )}
          </div>
          {playerInfo?.transfermarkt_link &&
            playerInfo?.transfermarkt_link !== 'undefined' && (
              <>
                <div className="input-label">
                  {t('transfermarkt link(optional)')}
                </div>
                <a
                  className="text-primary-color"
                  href={
                    (playerInfo.transfermarkt_link.includes('https')
                      ? ''
                      : 'https://') + playerInfo.transfermarkt_link
                  }
                  target="_blank"
                >
                  <p className="input-label player-value text-primary-color mb-20 transferMarkt-link">
                    {playerInfo
                      ? playerInfo?.transfermarkt_link
                      : transfermarkt_link}
                  </p>
                </a>
              </>
            )}
          <div className="accordion">
            <div className="item" key={1}>
              <div className="title" onClick={() => toggle(1)}>
                <h2>{t('my socials')}</h2>
                {selected === 1 ? <ArrowUp /> : <ArrowDown />}
              </div>
              <div className={selected === 1 ? 'content show' : 'content'}>
                <div>
                  <div
                    className={classNames(
                      isMobile()
                        ? 'social_media_field_mobile'
                        : 'social_media_field',
                    )}
                  >
                    <div className="social_icons_player svg-primary-color">
                      <Instagram />
                    </div>
                    <input
                      className={
                        isMobile()
                          ? 'social_media_link_mobile disabled-color'
                          : 'social_media_link disabled-color'
                      }
                      placeholder="https://www.instagram.com/username"
                      value={formData.instagram || ''}
                      onChange={e => setInstagram(e.target.value)}
                      type="link"
                      disabled
                    ></input>
                  </div>
                  <div className="input-feedback w-none">
                    {t(
                      'contact support if you have to change your social media links',
                    )}
                  </div>
                  {/* <p
                    className="error_occured_left"
                    style={{ fontSize: '16px', marginLeft: '50px' }}
                  >
                    {t(
                      'contact support if you have to change your social media links',
                    )}
                  </p> */}
                  {/* <div
                    className={classNames(
                      isMobile()
                        ? 'social_media_field_mobile'
                        : 'social_media_field',
                    )}
                  >
                    <div className="social_icons_player">
                      <YoutubeIcon />
                    </div>
                    <input
                      className={
                        isMobile()
                          ? 'social_media_link_mobile'
                          : 'social_media_link'
                      }
                      placeholder="https://www.youtube.com/channelname"
                      value={formData.youtube}
                      onChange={e => setYoutube(e.target.value)}
                      type="link"
                    ></input>
                  </div> */}
                  {setSocialHandlesLinksDataMessage ? (
                    <p className="successfully_saved">
                      {setSocialHandlesLinksDataMessage}
                    </p>
                  ) : setSocialHandlesLinksError ? (
                    <p className="error_occured_left">
                      {setSocialHandlesLinksError}
                    </p>
                  ) : (
                    ''
                  )}
                  {socialLoader ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div
                        className="stake-spin-container mt-10 w-0"
                        style={{ width: '75px' }}
                      >
                        <div className={classNames('spinner size-small')}></div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        className={classNames(
                          'social_handle_btn',
                          editable ? '' : 'btn-disabled',
                        )}
                        style={
                          isMobile() ? { width: '100%' } : { width: '70%' }
                        }
                        disabled={!editable}
                        onClick={() => {
                          dispatch(setSocialHandlesLinks(formData))
                        }}
                      >
                        {t('save')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="item" key={2}>
              <div className="title" onClick={() => toggle(2)}>
                <h2>{t('my contracts')}</h2>
                {selected === 2 ? <ArrowUp /> : <ArrowDown />}
              </div>
              <div className={selected === 2 ? 'content show' : 'content'}>
                <div>{t('player coin')}</div>
                <div className="contract-address">
                  <a
                    href={`${BASE_EXPLORE_URL}/address/${playerInfo?.playercontract}`}
                    target="_blank"
                  >
                    {playerInfo?.playercontract}
                  </a>
                </div>
                <div>{t('staking contract')}</div>
                <div className="contract-address">
                  <a
                    href={`${BASE_EXPLORE_URL}/address/${playerInfo?.stakingcontract}`}
                    target="_blank"
                  >
                    {playerInfo?.stakingcontract}
                  </a>
                </div>
                <div>{t('nft contract')}</div>
                <div className="contract-address">
                  <a
                    href={`${BASE_EXPLORE_URL}/address/${playerInfo?.nftcontract}`}
                    target="_blank"
                  >
                    {playerInfo?.nftcontract}
                  </a>
                </div>
              </div>
            </div> */}
            <div className="item" key={3}>
              <div className="title" onClick={() => toggle(3)}>
                <h2>{t('player admin access accounts')}</h2>
                {selected === 3 ? <ArrowUp /> : <ArrowDown />}
              </div>
              <div className={selected === 3 ? 'content show' : 'content'}>
                {walletAddress && playerInfo?.avaiable_admin?.length > 0 ? (
                  <>
                    {playerInfo?.avaiable_admin.map(
                      (item: any, index: number) => (
                        <div className="account-address" key={index}>
                          <a
                            href={`${BASE_EXPLORE_URL}/search?f=0&q=${item?.address}`}
                            target="_blank"
                          >
                            {item?.address}{' '}
                          </a>
                          {ethers.utils.getAddress(item?.address) !==
                          walletAddress ? (
                            <CloseIcon
                              className="red-color"
                              onClick={() => handleRemoveAdmin(item)}
                            />
                          ) : null}
                        </div>
                      ),
                    )}
                  </>
                ) : (
                  <div className="no-tokens-placeholder">
                    <span className="text-center mb-10 mt-10">
                      {t('no admin access accounts')}
                    </span>
                  </div>
                )}
                <div className="input-label text-primary-color add-admin-light">
                  {t('add new admin account')}
                </div>
                <FormInput
                  id="account"
                  type="text"
                  placeholder={
                    'e.g. 0x1EFEcb61A2f80Aa34d3b9218B564a64D05946290'
                  }
                  name="adminAccount"
                  value={inputData?.adminAccount}
                  handleChange={handleChangeInput}
                  onBlur={() => {
                    return
                  }}
                />
                {adminAccountErr && (
                  <div className="input-feedback">{adminAccountErr}</div>
                )}
                <div className="mb-20"></div>
                <SubmitButton
                  isDisabled={!inputData.adminAccount}
                  title={t('add admin account')}
                  onPress={handleAddAdminAccount}
                  className="m-0auto"
                />
              </div>
            </div>
            {/*---------------------------------------------------- ADD-AGENT ------------------------------------------*/}
            {/* <div className="item" key={4}>
              <div className="title" onClick={() => toggle(4)}>
                <h2>{t('my agent')}</h2>
                {selected === 4 ? <ArrowUp /> : <ArrowDown />}
              </div>
              <div className={selected === 4 ? 'content show' : 'content'}>
                {loginInfo && allAgentsData?.length > 0 ? (
                  <>
                    {allAgentsData.map((item: any, index: number) => (
                      <div className="account-address" key={index}>
                        <a
                          href={`${BASE_EXPLORE_URL}/search?f=0&q=${item?.address}`}
                          target="_blank"
                        >
                          {item?.address}{' '}
                        </a>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="no-tokens-placeholder">
                    <span className="text-center mb-10 mt-10">
                      {t('no agent accounts')}
                    </span>
                  </div>
                )}
                <div className="input-label text-primary-color">
                  {t('add new agent')}
                </div>
                <FormInput
                  id="agent"
                  type="text"
                  placeholder={
                    'e.g. 0x1EFEcb61A2f80Aa34d3b9218B564a64D05946290'
                  }
                  name="agentAccount"
                  value={inputData?.agentAccount}
                  handleChange={handleChangeInput}
                  onBlur={() => {
                    return
                  }}
                />
                {agentAccountErr && (
                  <div className="input-feedback">{agentAccountErr}</div>
                )}
                <div className="mb-20"></div>
                <SubmitButton
                  isDisabled={!inputData.agentAccount}
                  title={t('add agent')}
                  onPress={handleAddAgent}
                  className="m-0auto"
                />
              </div>
            </div> */}
            {/*---------------------------------------------------- cryptocurrency available on contract ------------------------------------------*/}
            {/* <div
              className={classNames(
                'item',
                playerInfo?.playerstatusid?.id === 5 ||
                  playerInfo?.playerlevelid === 5
                  ? ''
                  : 'hidden',
              )}
              key={5}
            >
              <div className="title" onClick={() => toggle(5)}>
                <h2>{t('cryptocurrency available on contract')}</h2>
                {selected === 5 ? <ArrowUp /> : <ArrowDown />}
              </div>
              <div
                className={classNames(
                  'contract-balance',
                  selected === 5 ? 'show' : 'hidden',
                )}
              >
                {fetchBalancePlayersSuccess ? (
                  <div className={selected === 5 ? 'content show' : 'content'}>
                    <div className="cryptocurrency-desc">
                      {t(
                        'those funds are currently on your contract and you have permission to withdraw them to your wallet.',
                      )}
                    </div>
                    <FormControl
                      style={{
                        maxHeight: '250px',
                        overflow: 'auto',
                        marginBottom: '10px',
                      }}
                      className="cryptocurrency_available"
                    >
                      {fetchBalancePlayersData?.matic ? (
                        <FormControlLabel
                          value="matic"
                          control={
                            <Radio
                              sx={{
                                color: 'var(--primary-foreground-color)',
                                '&.Mui-checked': {
                                  color: 'var(--primary-foreground-color)',
                                },
                              }}
                              checked={selectedAsset?.type === 'matic'}
                              disabled={fetchBalancePlayersData?.matic <= 0}
                              onChange={(evt: any) => handleMaticSelect(evt)}
                            />
                          }
                          label={
                            <div className="nft-item">
                              <div className="nft-image-section">
                                <div className="matic-logo">
                                  <Matic />
                                </div>
                                <div className="nft-name text-primary-color">
                                  {t('polygon_matic')}
                                </div>
                              </div>
                              <div className="nft-price-section">
                                <div className="text-primary-color">
                                  {truncateDecimals(
                                    fetchBalancePlayersData?.matic,
                                    5,
                                  )}
                                </div>
                              </div>
                            </div>
                          }
                        />
                      ) : null}
                      {fetchBalancePlayersData?.token?.length > 0 ? (
                        fetchBalancePlayersData?.token.map(
                          (item: any, index: number) => {
                            return (
                              <FormControlLabel
                                value={item.name}
                                key={index}
                                control={
                                  <Radio
                                    sx={{
                                      color: 'var(--primary-foreground-color)',
                                      '&.Mui-checked': {
                                        color:
                                          'var(--primary-foreground-color)',
                                      },
                                    }}
                                    checked={
                                      selectedAsset?.type === 'token' &&
                                      selectedAsset?.tokenId === item.name
                                    }
                                    disabled={item?.balance <= 0}
                                    onChange={(evt: any) =>
                                      handleTokenSelect(evt, item)
                                    }
                                  />
                                }
                                label={
                                  <div className="nft-item">
                                    <div className="nft-image-section">
                                      <div className="image-border">
                                        <ImageComponent
                                          src={item?.playerpicture}
                                          alt=""
                                          className="nft-image"
                                        />
                                      </div>
                                      <div className="nft-name">
                                        {item?.name}
                                      </div>
                                    </div>
                                    <div className="nft-price-section">
                                      <div className="text-primary-color">
                                        {truncateDecimals(item?.balance, 5)}
                                      </div>
                                    </div>
                                  </div>
                                }
                              />
                            )
                          },
                        )
                      ) : (
                        <div className="no-tokens-placeholder">
                          <span className="text-center mb-10 mt-10">
                            {t('no tokens available')}
                          </span>
                        </div>
                      )}
                    </FormControl>
                    {playerInfo?.playerstatusid?.id > 4 ? (
                      <SubmitButton
                        isDisabled={getDisabledWithdrawBtn()}
                        title={t('withdraw')}
                        onPress={() => handleWithdraw()}
                        className="m-0auto"
                      />
                    ) : null}
                  </div>
                ) : (
                  <div
                    className="checkout-loader-wrapper get-balance-loader"
                    style={{ marginTop: '25px' }}
                  >
                    {fetchBalancePlayersError ? (
                      <div className="txn-err-wrapper">
                        <ResponseAlert status={'Error'} />
                        <div className="input-feedback">
                          {t('couldnt fetch balance')}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="loading-spinner">
                          <div className="spinner">
                          </div>
                        </div>
                        <div className="loading-msg">
                          {t('fetching player balance')}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div> */}
            {/*---------------------------------------------------- Player Settings (My Settings) ------------------------------------------*/}
            {whatsAppOtp && isMobile() ? (
              navigate('/otp-whatsapp')
            ) : (
              <DialogBox
                isOpen={whatsAppOtp}
                onClose={() => {
                  handleCloseWhatsAppOtpPop()
                  console.log('fetching_player_data15')
                  dispatch(getPlayerData({}))
                }}
              >
                <OtpWhatsApp />
              </DialogBox>
            )}
            <div className="item" key={6}>
              <div
                className="title"
                onClick={() => {
                  playerInfo?.playerstatusid?.id === 5 ||
                  playerInfo?.playerlevelid === 5
                    ? ''
                    : ''
                }}
              >
                <h2
                  className={classNames(
                    playerInfo?.playerstatusid?.id !== 5
                      ? 'disabled-color'
                      : 'disabled-color',
                  )}
                >
                  {t('whatsapp_settings')}
                </h2>
                {selected === 6 ? <ArrowUp /> : <ArrowDown />}
              </div>
              <div className={selected === 6 ? 'content show' : 'content'}>
                <div>
                  <div className="my_settings_wrapper">
                    <p className="my_settings_title">
                      {t('allow fan message')}
                    </p>
                    <Switch
                      checked={allowFanMessage > 0 ? true : false}
                      offColor="#56596A"
                      onColor={
                        THEME_COLORS[selectedThemeRedux]['PrimaryForeground']
                      }
                      onChange={onChangeToggle}
                    />
                  </div>
                  <div className="my_settings_wrapper">
                    <p className="my_settings_title">{t('whats app number')}</p>
                    <div
                      className="my_settings_title"
                      style={{ color: 'var(--secondary-foreground-color)' }}
                    >
                      {playerInfo?.mobilenumber}{' '}
                      <EditIcon
                        width="13px"
                        height="13px"
                        onClick={() => {
                          handleOpenWhatsAppPop()
                        }}
                      />{' '}
                    </div>
                  </div>
                  <div className="my_settings_wrapper">
                    <p className="my_settings_title">
                      {t('daily fan messages')}
                    </p>
                    <input
                      className="my_settings_input"
                      value={dailyFanMessages || ''}
                      type="number"
                      onChange={e => setDailyFanMessages(e.target.value)}
                    />
                  </div>
                  <div className="my_settings_wrapper">
                    <p className="my_settings_title">{t('cost per message')}</p>
                    <input
                      className="my_settings_input"
                      value={costPerMessages || ''}
                      type="number"
                      onChange={e => setCostPerMessages(e.target.value)}
                    />
                  </div>
                  {postPlayerSettingsData && (
                    <p className="successfully_saved">
                      {postPlayerSettingsData}
                    </p>
                  )}
                  {isPlayerSettingsError && (
                    <p className="error_occured_left">
                      {isPlayerSettingsError}
                    </p>
                  )}
                  {playerSettingsLoader ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div
                        className="stake-spin-container mt-10 w-0"
                        style={{ width: '75px' }}
                      >
                        <div className={classNames('spinner size-small')}></div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        className={classNames(
                          'social_handle_btn',
                          editMySettings ? '' : 'btn-disabled',
                        )}
                        style={
                          isMobile() ? { width: '100%' } : { width: '70%' }
                        }
                        disabled={!editMySettings}
                        onClick={() => {
                          dispatch(postPlayerSettings(mySettingsData))
                        }}
                      >
                        {t('save')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/*---------------------------------------------------- Player Settings (Player Reward Address) ------------------------------------------*/}
            <div className="item" key={7}>
              <div className="title" onClick={() => toggle(7)}>
                <h2>{t('my_payout_settings')}</h2>
                {selected === 7 ? <ArrowUp /> : <ArrowDown />}
              </div>
              <div className={selected === 7 ? 'content show' : 'content'}>
                <div className="account-address">
                  <a
                    href={`${BASE_EXPLORE_URL}/search?f=0&q=${payoutAddress}`}
                    target="_blank"
                  >
                    {payoutAddress}{' '}
                  </a>
                </div>
                <div className="input-label text-primary-color">
                  {t('new_payout_address')}
                </div>
                <FormInput
                  id="account"
                  type="text"
                  placeholder={
                    'e.g. 0x1EFEcb61A2f80Aa34d3b9218B564a64D05946290'
                  }
                  name="rewardAddress"
                  value={rewardAddress}
                  handleChange={e => {
                    setRewardAddress(e.target.value)
                  }}
                  onBlur={() => {
                    return
                  }}
                />
                {payoutErr ? (
                  <div className="input-feedback">{payoutErr}</div>
                ) : null}
                <div className="mb-20"></div>
                <SubmitButton
                  isDisabled={!rewardAddress}
                  title={t('save_payout_address')}
                  onPress={handleAddPayoutAddress}
                  className="m-0auto"
                />
                {/* <div className="player_reward_percentage_title">
                  <div className="input-label">
                    {t('player_reward_percentage')}
                  </div>
                  <TooltipLabel
                    title={t('input_between_0-50')}
                    openTooltip={openTooltip}
                  >
                    <InfoOutlinedIcon
                      sx={{
                        color: 'var(--secondary-foreground-color)',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setOpenTooltip(true)
                        setTimeout(() => {
                          setOpenTooltip(false)
                        }, 5000)
                      }}
                    />
                  </TooltipLabel>
                </div>
                <div className="player_reward_percentage_wrapper">
                  <div className="percentage_value_wrapper">
                    <input
                      style={{ width: '70px' }}
                      className="new_percentage_value"
                      value={currentValue}
                      type="number"
                      onChange={e => {
                        setCurrentValue(e.target.value)
                        dispatch(resetNewRewardPercentageMessage())
                      }}
                    />
                    <p className="percentage_icon">%</p>
                  </div>
                  <SubmitButton
                    isDisabled={!editPercentageValue}
                    title={t('Save')}
                    onPress={handleRewardPercentage}
                    className="m-0auto"
                    rewardPerc={true}
                  />
                </div>
                {rewardPercentageError && (
                  <p className="error_occured_left">{rewardPercentageError}</p>
                )}

                <div className="player_reward_percentage_title">
                  <div className="input-label">{t('trading_percent')}</div>
                  <TooltipLabel
                    title={t('input_between_0-50')}
                    openTooltip={openTooltip}
                  >
                    <InfoOutlinedIcon
                      sx={{
                        color: 'var(--secondary-foreground-color)',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setOpenTooltip(true)
                        setTimeout(() => {
                          setOpenTooltip(false)
                        }, 5000)
                      }}
                    />
                  </TooltipLabel>
                </div>
                <div className="player_reward_percentage_wrapper">
                  <div className="percentage_value_wrapper">
                    <input
                      style={{ width: '70px', color: 'grey' }}
                      className="current_percentage_value"
                      value={tradingValue}
                      type="number"
                      onChange={e => {
                        setCurrentValue(e.target.value)
                        dispatch(resetNewRewardPercentageMessage())
                      }}
                    />
                    <p className="percentage_icon" style={{ color: 'grey' }}>
                      %
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      margin: '20px 0px',
                    }}
                  ></div>
                  <SubmitButton
                    isDisabled={true}
                    title={t('Save')}
                    onPress={handleRewardPercentage}
                    className="m-0auto"
                    rewardPerc={true}
                  />
                </div> */}
              </div>
            </div>
          </div>
          {isGoLiveInProgress ? (
            <div className="loading-spinner mb-40 flex-center">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              {txnHashInner && (
                <div className="txnhash-success-wrapper">
                  <ResponseAlert status={'Success'} />
                  <a
                    className="tx-link"
                    href={`${BASE_EXPLORE_URL}/tx/${txnHashInner}`}
                    target="_blank"
                  >
                    {t('show transaction')}
                  </a>
                </div>
              )}
            </>
          )}
          {/* {playerInfo?.playerstatusid.id < 4 &&
            !isGoLiveClicked &&
            !isGoLiveInProgress && (
              <SubmitButton
                isDisabled={false}
                title={t('go live')}
                onPress={handleGoLive}
                className="m-0auto"
              />
            )} */}
        </>
      )}
    </div>
  )
}

export default PlayerCoin
