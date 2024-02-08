import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import BottomPopup from '@components/Dialog/BottomPopup'
import Send from './Send'
import Confirmed from './Confirmed'
import { useTranslation } from 'react-i18next'
import Stake from './Stake'
import classNames from 'classnames'
import {
  checkTokenId,
  getCircleColor,
  getFlooredNumber,
  getPlayerLevelName,
  isMobile,
} from '@utils/helpers'
import Spinner from '@components/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  bidOnAuction,
  claimNft,
  closeAction,
  consumeNft,
  drawWinner,
  enrollRaffle,
  getBids,
  getMinStaking,
  getPlayer1Contract,
  getStakingBalance,
  nftTransfer,
  resetBids,
} from '@root/apis/playerCoins/playerCoinsSlice'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import { getFlooredFixed, isUserWallet } from '@utils/helpers'
import { BigNumber, ethers } from 'ethers'
import {
  setStakeFormShowed,
  showNftForm,
  showSignupForm,
  getOwnerList,
  showNftDetailForm,
  getClaimableCount,
} from '@root/apis/onboarding/authenticationSlice'
import { NFT_STATUS, PLAYER_STATUS } from '@root/constants'
import { fetchNFTData } from '@root/apis/gallery/gallerySlice'
import SendNft from './SendNft'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import ImageComponent from '@components/ImageComponent'
import PlayerImage from '@components/PlayerImage'
import NftDetail from './NftDetail'
import { POLYGON_NETWORK_RPC_URL, BASE_EXPLORE_URL } from '@root/constants'
import Web3 from 'web3'
import '@assets/css/components/XPProgressBar.css'
import { ProgressBar } from 'react-progressbar-fancy'
import genesis_silver from '@assets/images/genesis/genesis_silver.jpeg'
import genesis_diamond from '@assets/images/genesis/genesis_diamond.jpeg'
import genesis_gold from '@assets/images/genesis/genesis_gold.jpeg'
import genesis_bronze from '@assets/images/genesis/genesis_bronze.jpeg'
import genesis_wood from '@assets/images/genesis/genesis_wood.jpg'
import { useWalletHelper } from '@utils/WalletHelper'

interface Props {
  nft: any
  isBid?: boolean
  isEndable?: boolean
}

const NftForm: React.FC<Props> = ({ nft, isBid, isEndable }) => {
  const [showPopup, setShowPopup] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [showBidList, setShowBidList] = useState(false)
  const [showOwners, setShowOwners] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let countDown: any = null
  const [txnError, setTxnError] = useState('')
  const [txnHash, setTxnHash] = useState('')
  const [showBottomPopup, setShowBottomPopup] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [isHighestBidder, setIsHighestBidder] = useState(false)
  const [apiAction, setApiAction] = useState('')
  const [amount, setAmount] = useState('0')
  const loginInfo = localStorage.getItem('loginInfo')
  const {
    isLoading,
    bidList,
    stakingBalance,
    stakingcontract,
    stakingcontractabi,
    nftcontract,
    nftcontractabi,
    isGetStakingBalanceSuccess,
    isGetPlayer1ContractSuccess,
    isGetBidsSuccess,
    centralContract,
    minStakingSuccessData,
    centralContractAbi,
  } = useSelector((state: RootState) => state.playercoins)
  const accessToken = localStorage.getItem('accessToken')

  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    isNftFormBid,
    isNftEndable,
    isStakeFormShowed,
    userWalletData: { balance },
    isWalletFormVisible,
    ownerListLoader,
    ownerListData,
    ownerListError,
    isNftFormVisible,
    claimableCountData,
    claimableCountLoader,
  } = authenticationData
  const { winChances } = useSelector((state: RootState) => state.gallery)

  const walletAddress = useSelector(
    (state: RootState) => state.authentication.walletAddress,
  )

  const { getWeb3Provider, callWeb3Method } = useWalletHelper()

  const handleSubmit = (arg: any) => {
    if (nft?.statusid?.id < NFT_STATUS.MINTED) {
      if (isEnded) {
        handleEnd()
        return
      }
      if (isHighestBidder) {
        return
      }
    }
    setShowPopup(false)
    setOpenBoost(false)
    setShowBottomPopup(true)
    setAmount(arg)
    if (localStorage.getItem('loginId')) {
      setApiAction(
        nft?.alreadyclaimed && openBoost
          ? 'consumeNFT'
          : nft?.statusid?.id === 6 && claimableCount > 0 && nft?.claimable
          ? 'claimNFT'
          : nft?.statusid?.id === NFT_STATUS.AUCTION
          ? 'bidOnAuction'
          : 'safeTransferFrom',
      )
      return
    }
    let promise
    if (nft?.statusid?.id === NFT_STATUS.AUCTION) {
      const exp = ethers.BigNumber.from('10').pow(13)
      const bidAmount = ethers.BigNumber.from(
        Math.floor(arg * Math.pow(10, 5)),
      ).mul(exp)
      promise = callWeb3Method(
        'bidOnAuction',
        stakingcontract,
        stakingcontractabi,
        [nft?.auctionid, bidAmount],
      )
    } else if (nft?.alreadyclaimed && openBoost) {
      const nftContract = Web3.utils.toChecksumAddress(nftcontract)
      promise = callWeb3Method(
        'consumeNft',
        centralContract,
        centralContractAbi,
        [nftContract, nft?.tokenid, 1],
      )
    } else if (
      nft?.statusid?.id === 6 &&
      claimableCount > 0 &&
      nft?.claimable
    ) {
      promise = callWeb3Method('claimNFT', nftcontract, nftcontractabi, [
        nft?.tokenid,
      ])
    } else {
      promise = callWeb3Method(
        'safeTransferFrom',
        nftcontract,
        nftcontractabi,
        [localStorage.getItem('loginInfo'), arg, nft?.tokenid, 1, 0x0],
      )
    }
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
      })
      .catch((err: any) => {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      })
  }

  const handleParticipate = () => {
    if (nft?.isclosed) {
      return
    }
    if (!validateLogin()) {
      return
    }
    if (isParticipated()) {
      return
    }
    if (isEnded) {
      handleEnd()
      return
    }
    setShowBottomPopup(true)
    if (localStorage.getItem('loginId')) {
      setApiAction('enrollToRaffle')
      return
    }
    const promise = callWeb3Method(
      'enrollToRaffle',
      stakingcontract,
      stakingcontractabi,
      [],
    )
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
      })
      .catch((err: any) => {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      })
  }

  const handleEnd = () => {
    if (!validateLogin()) {
      return
    }
    setShowBottomPopup(true)

    if (localStorage.getItem('loginId')) {
      setApiAction(
        nft?.statusid?.id === NFT_STATUS.AUCTION
          ? 'closeAuction'
          : 'drawRandomRaffleWinner',
      )
      return
    }
    const promise = callWeb3Method(
      nft?.statusid?.id === NFT_STATUS.AUCTION
        ? 'closeAuction'
        : 'drawRandomRaffleWinner',
      stakingcontract,
      stakingcontractabi,
      [
        nft?.statusid?.id === NFT_STATUS.AUCTION
          ? nft?.auctionid
          : BigNumber.from(Math.floor(Math.random() * 999999)),
      ],
    )
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
      })
      .catch((err: any) => {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      })
  }

  const gotoPlayer = () => {
    dispatch(showNftForm({}))
    navigate(`/app/player/${nft.detailpageurl}`)
  }

  const [state, setState] = useState({
    day: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const initCountDown = () => {
    countDown = setInterval(function () {
      const countDownDate = new Date(nft?.blockdeadline).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now
      const day = ~~(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (distance < 0) {
        clearInterval(countDown)
        updateState({
          day: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        })
      } else {
        updateState({
          day,
          hours,
          minutes,
          seconds,
        })
      }
    }, 1000)
  }

  useEffect(() => {
    document.body.style.backgroundColor = '#171923'
    dispatch(getPlayer1Contract({ url: nft?.detailpageurl }))
    dispatch(showNftDetailForm({ isNftDetailFormVisible: true }))
    dispatch(getMinStaking())

    if (loginInfo || accessToken) {
      dispatch(getStakingBalance(nft?.playercontract))
    }
    const isEndedAuction =
      new Date(nft?.blockdeadline).getTime() <= new Date().getTime()
    setIsEnded(isEndedAuction)
    if (isBid || isNftFormBid) {
      if (nft?.statusid?.id === NFT_STATUS.AUCTION && !isEndedAuction) {
        setShowPopup(true)
      }
    }
    return () => {
      clearInterval(countDown)
      document.body.style.backgroundColor = '#222435'
      dispatch(showNftDetailForm({ isNftDetailFormVisible: false }))
      dispatch(resetBids())
    }
  }, [])

  console.log('preies', { minStakingSuccessData })

  useEffect(() => {
    if (
      isGetStakingBalanceSuccess &&
      isGetPlayer1ContractSuccess &&
      isStakeFormShowed
    ) {
      if (nft?.isclosed) {
        return
      }
      if ((isBid || isNftFormBid) && nft?.statusid?.id === NFT_STATUS.RAFFLE) {
        dispatch(setStakeFormShowed())
        if (!validateLogin()) {
          return
        }
        if (stakingBalance > 0) {
          handleParticipate()
        } else if (!isEnded) {
          setShowPopup(true)
        }
      }
      if (isEndable || isNftEndable) {
        dispatch(setStakeFormShowed())
        handleEnd()
      }
    }
  }, [isGetStakingBalanceSuccess, isGetPlayer1ContractSuccess])

  useEffect(() => {
    if (isEnded) {
      setShowPopup(false)
    }
  }, [isEnded])

  useEffect(() => {
    if (nft?.blockdeadline) {
      initCountDown()
    }
    dispatch(
      getBids(
        'player_contract=' +
          nft?.playercontract +
          '&auction_id=' +
          nft?.auctionid,
      ),
    )
  }, [nft])

  useEffect(() => {
    if (isGetBidsSuccess && bidList.length > 0) {
      if (bidList[0].address?.toLowerCase() === walletAddress.toLowerCase()) {
        setShowPopup(false)
        setIsHighestBidder(true)
      }
    }
  }, [isGetBidsSuccess])

  const handleViewImage = () => {
    const image = new Image()
    image.src =
      'data:image/png;base64,' +
      (nft?.artwork ? nft.artwork : nft?.artwork_thumb)
    const w = window.open('')
    w?.document.write(image.outerHTML)
  }

  const handleShowBids = () => {
    setShowBidList(true)
  }
  const handleShowOwners = () => {
    setShowOwners(true)
  }
  const handleClose = () => {
    dispatch(fetchNFTData({ id: nft?.id }))
    setShowBottomPopup(false)
    setTxnError('')
    setTxnHash('')
  }

  const handleShowPopup = () => {
    if (nft?.isclosed) {
      return
    }
    if (!validateLogin()) {
      return
    }
    if (isEnded && nft?.statusid?.id < NFT_STATUS.MINTED) {
      handleEnd()
      return
    }
    setShowPopup(true)
  }

  const validateLogin = () => {
    if (
      !localStorage.getItem('loginInfo') &&
      !localStorage.getItem('loginId')
    ) {
      dispatch(showNftForm({}))
      dispatch(showSignupForm())
      return false
    }
    return true
  }

  const handleShowExplorer = () => {
    window.open(
      `${BASE_EXPLORE_URL}/token/${nft?.nftcontract}?a=${nft?.tokenid}#inventory`,
      '_blank',
    )
  }

  const handleNftApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('user_secret', user_secret)
    formData.append('contract', nft?.playercontract)
    if (apiAction === 'bidOnAuction') {
      formData.append('auction_id', nft?.auctionid ?? 0)
      formData.append('amount', amount)
      dispatch(bidOnAuction(formData))
    } else if (apiAction === 'closeAuction') {
      formData.append('auction_id', nft?.auctionid ?? 0)
      formData.append('amount', amount)
      dispatch(closeAction(formData))
    } else if (apiAction === 'drawRandomRaffleWinner') {
      dispatch(drawWinner(formData))
    } else if (apiAction === 'safeTransferFrom') {
      formData.append('nft_id', nft?.tokenid)
      formData.append('amount', '1')
      formData.append('address', amount)
      dispatch(nftTransfer(formData))
    } else if (apiAction === 'enrollToRaffle') {
      dispatch(enrollRaffle(formData))
    } else if (apiAction === 'claimNFT') {
      formData.append('playercontract', nft?.playercontract)
      formData.append('tokenid', nft?.tokenid)
      dispatch(claimNft(formData))
    } else if (apiAction === 'consumeNFT') {
      formData.append('playercontract', nft?.playercontract)
      formData.append('tokenid', nft?.tokenid)
      dispatch(consumeNft(formData))
    }
  }

  const isParticipated = () => {
    const currentUserCoins = winChances[0]?.coinsparticipateduser
    if (parseInt(currentUserCoins) > 0) {
      return true
    }
    return false
  }

  const getRaffleData = () => {
    if (
      !localStorage.getItem('loginInfo') &&
      !localStorage.getItem('loginId')
    ) {
      return {
        label: t('coins_participating'),
        value: getFlooredFixed(winChances[0]?.coinsparticipating, 2).toString(),
        suffix: '',
      }
    } else {
      if (isParticipated()) {
        return {
          label: t('your_winning_chance'),
          value: getFlooredFixed(
            winChances[0]?.chancetowinparticipated,
            2,
          ).toString(),
          suffix: '%',
        }
      } else if (winChances[0]?.chancetowinstaked) {
        return {
          label: t('your_winning_chance'),
          value: getFlooredFixed(
            winChances[0]?.chancetowinstaked,
            2,
          ).toString(),
          suffix: '%',
        }
      } else if (
        !winChances[0]?.chancetowinstaked &&
        winChances[0]?.aschancetowinholding
      ) {
        return {
          label: t('stake_coins_for_chance'),
          value: getFlooredFixed(
            winChances[0]?.aschancetowinholding,
            2,
          ).toString(),
          suffix: '%',
        }
      } else if (
        !winChances[0]?.chancetowinstaked &&
        !winChances[0]?.aschancetowinholding
      ) {
        if (
          (winChances[0]?.coinsstakeduser ||
            winChances[0]?.coinsholdinguser ||
            balance) &&
          winChances[0]?.coinsparticipating < 1
        ) {
          return {
            label: t('your_winning_chance'),
            value: '100',
            suffix: '%',
          }
        }
        return {
          label: t('coins_participating'),
          value: getFlooredFixed(
            winChances[0]?.coinsparticipating,
            2,
          ).toString(),
          suffix: '',
        }
      }
    }
  }
  const loginId = localStorage.getItem('loginId')
  const [claimLoader, setClaimLoader] = useState(false)
  const [claimableCount, setClaimableCount] = useState(0)
  const [minStakeAmount, setMinStakeAmount] = useState('0')

  const getClaimableCountExternal = async () => {
    setClaimLoader(true)
    const provider = await getWeb3Provider()
    const getClaimableAvailability = new ethers.Contract(
      nftcontract,
      nftcontractabi,
      provider.getSigner(loginInfo!),
    )
    try {
      const getAvailability = await getClaimableAvailability?.getClaimableCount(
        nft?.tokenid,
      )

      const getClaimableCount = parseInt(getAvailability._hex)

      console.log('getClaimableCount', {
        getAvailability,
        getClaimableCount,
      })
      setClaimableCount(getClaimableCount)
      setClaimLoader(false)
    } catch (error) {
      console.log('error', error)
      getClaimableCountExternal()
    }
  }
  // INTERNAL_API_INTEGRATION
  useEffect(() => {
    if (claimableCountData !== null) {
      setClaimableCount(claimableCountData)
      setClaimLoader(false)
      console.log('getClaimableCount', {
        claimableCountData,
      })
    }
  }, [claimableCountData])
  const getClaimableCountInternal = async () => {
    setClaimLoader(true)
    // INTERNAL_API_INTEGRATION
    dispatch(
      getClaimableCount({ nftContract: nftcontract, tokenId: nft?.tokenid }),
    )
    // const userWalletAddressUnder = await localStorage.getItem(
    //   'userWalletAddress',
    // )
    // const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
    //   POLYGON_NETWORK_RPC_URL,
    // )
    // const getClaimableAvailability = new ethers.Contract(
    //   nftcontract,
    //   nftcontractabi,
    //   simpleRpcProvider.getSigner(userWalletAddressUnder!),
    // )
    // try {
    //   const getAvailability = await getClaimableAvailability?(
    //     nft?.tokenid,
    //   )
    //   const getClaimableCount = parseInt(getAvailability._hex)

    //   console.log('getClaimableCount', {
    //     getAvailability,
    //     getClaimableCount,
    //   })
    //   setClaimableCount(getClaimableCount)
    //   setClaimLoader(false)
    // } catch (error) {
    //   console.log('error', error)
    // }
  }
  useEffect(() => {
    if (nft?.statusid?.id === 6 && nftcontract) {
      if (loginInfo) {
        getClaimableCountExternal()
      } else if (loginId) {
        getClaimableCountInternal()
      }
    }
  }, [nft?.tokenid, nftcontract, nftcontractabi, nft?.statusid?.id])

  useEffect(() => {
    if (showOwners) {
      dispatch(
        getOwnerList({ nftContract: nftcontract, tokenId: nft?.tokenid }),
      )
    }
  }, [showOwners, nftcontract])

  const getBottomMargin = () => {
    if ([3, 4, 5].includes(nft?.statusid?.id || nft?.statusid)) {
      return '0px'
    } else if (nft?.statusid?.id === 6) {
      if (
        (nft?.statusid?.id === 6 && nft?.alreadyclaimed) ||
        (claimableCount > 0 && nft?.claimable)
      ) {
        if (isMobile()) {
          return '0px'
        }
        return '20px'
      } else {
        return
      }
    } else {
      if (isMobile()) {
        return '0px'
      }
      return '20px'
    }
  }
  const [openBoost, setOpenBoost] = useState(false)
  const handleOpenBoost = () => {
    setOpenBoost(true)
  }
  // useEffect(() => {
  //   dispatch(showNftDetailForm({ isNftDetailFormVisible: true }))
  //   return () => {
  //     dispatch(showNftDetailForm({ isNftDetailFormVisible: false }))
  //   }
  // }, [])

  const getGenesisNftImage = (statusId: number) => {
    if (statusId === 5) {
      return genesis_diamond
    } else if (statusId === 4) {
      return genesis_gold
    } else if (statusId === 3) {
      return genesis_silver
    } else if (statusId === 2) {
      return genesis_bronze
    } else if (statusId === 1) {
      return genesis_wood
    }
  }

  return (
    <div
      className="nft-container flex-middle"
      style={{ cursor: 'unset', marginBottom: getBottomMargin() }}
    >
      {showBottomPopup &&
        (localStorage.getItem('loginInfo') ? (
          <Web3BottomPopup
            showPopup={showBottomPopup}
            txnHash={txnHash}
            txnErr={txnError}
            onClose={handleClose}
            customClass={isMobile() ? 'exwallet-bottomwrapper' : ''}
          />
        ) : (
          <ApiBottomPopup
            showPopup={showBottomPopup}
            onSubmit={handleNftApi}
            onClose={handleClose}
            customClass="purchase-pc-bottomwrapper"
          />
        ))}
      <div>
        {nft?.isGenesisNFT ? (
          <div className="nft-image-cover">
            <ImageComponent
              loading="lazy"
              src={getGenesisNftImage(nft?.statusid)}
              alt=""
              className="nft-image"
              // onClick={handleViewImage}
            />
          </div>
        ) : (
          <div className="nft-image-cover">
            <ImageComponent
              loading="lazy"
              src={
                'data:image/png;base64, ' +
                (nft?.artwork ? nft.artwork : nft?.artwork_thumb)
              }
              alt=""
              className="nft-image"
              onClick={handleViewImage}
            />
            {nft?.quantity > 0 ? (
              <div className="coins_issued_over_nft">
                {nft?.balance > 0 ? (
                  <span
                    style={{
                      color: '#6bc909 !important',
                      background: '#6bc909 !important',
                    }}
                  >
                    {nft?.balance}
                  </span>
                ) : null}
                <span
                  className={classNames(
                    getPlayerLevelName(nft?.nftlevel) === 'Diamond'
                      ? 'nft_level_diamond'
                      : getPlayerLevelName(nft?.nftlevel) === 'Gold'
                      ? 'nft_level_gold'
                      : getPlayerLevelName(nft?.nftlevel) === 'Silver'
                      ? 'nft_level_silver'
                      : getPlayerLevelName(nft?.nftlevel) === 'Bronze'
                      ? 'nft_level_bronze'
                      : '',
                  )}
                >
                  {nft?.balance > 0 ? '/' : null}
                  {nft?.quantity}
                </span>
              </div>
            ) : (
              <></>
            )}
            {nft?.xp > 0 ? (
              <div
                className="xp_over_nft_form"
                style={{ top: isMobile() ? '315px' : '325px' }}
              >
                <span
                  className={classNames(
                    getPlayerLevelName(nft?.nftlevel) === 'Diamond'
                      ? 'nft_level_diamond'
                      : getPlayerLevelName(nft?.nftlevel) === 'Gold'
                      ? 'nft_level_gold'
                      : getPlayerLevelName(nft?.nftlevel) === 'Silver'
                      ? 'nft_level_silver'
                      : getPlayerLevelName(nft?.nftlevel) === 'Bronze'
                      ? 'nft_level_bronze'
                      : '',
                  )}
                >
                  {parseFloat(nft?.xp.toFixed(0)).toLocaleString()} XP
                </span>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}

        <div className="nft-info-wrapper">
          <div className="nft-info">
            {nft?.isGenesisNFT ? (
              <div
                className={classNames(
                  'nft-info-title',
                  getPlayerLevelName(nft?.statusid) === 'Diamond'
                    ? 'nft_level_diamond'
                    : getPlayerLevelName(nft?.statusid) === 'Gold'
                    ? 'nft_level_gold'
                    : getPlayerLevelName(nft?.statusid) === 'Silver'
                    ? 'nft_level_silver'
                    : getPlayerLevelName(nft?.statusid) === 'Bronze'
                    ? 'nft_level_bronze'
                    : '',
                )}
              >
                {nft?.name || nft?.nameg}&nbsp;
                {checkTokenId(nft?.tokenid)}
              </div>
            ) : nft?.statusid?.id === 6 ? (
              <div
                className={classNames(
                  'nft-info-title',
                  getPlayerLevelName(nft?.nftlevel) === 'Diamond'
                    ? 'nft_level_diamond'
                    : getPlayerLevelName(nft?.nftlevel) === 'Gold'
                    ? 'nft_level_gold'
                    : getPlayerLevelName(nft?.nftlevel) === 'Silver'
                    ? 'nft_level_silver'
                    : getPlayerLevelName(nft?.nftlevel) === 'Bronze'
                    ? 'nft_level_bronze'
                    : '',
                )}
              >
                {`${t('nft_title_for_status_id_6')}`}&nbsp;
                {checkTokenId(nft?.tokenid)}
              </div>
            ) : (
              <div
                className={classNames(
                  'nft-info-title',
                  getPlayerLevelName(nft?.nftlevel) === 'Diamond'
                    ? 'nft_level_diamond'
                    : getPlayerLevelName(nft?.nftlevel) === 'Gold'
                    ? 'nft_level_gold'
                    : getPlayerLevelName(nft?.nftlevel) === 'Silver'
                    ? 'nft_level_silver'
                    : getPlayerLevelName(nft?.nftlevel) === 'Bronze'
                    ? 'nft_level_bronze'
                    : '',
                )}
              >
                {nft?.name}&nbsp;{checkTokenId(nft?.tokenid)}
              </div>
            )}
            {!nft?.isGenesisNFT ? (
              <div className="nft-info-by" onClick={() => gotoPlayer()}>
                {t('by')}: <a>{nft?.playername}</a>
              </div>
            ) : null}
          </div>
          {nft?.isGenesisNFT ? (
            <div className="progress-bar-wrapper mt-20">
              <div className="genesis-progress-label">
                <span>level</span>
                <span>+xp needed</span>
              </div>
              <ProgressBar
                className="space"
                // label={''}
                primaryColor={'#f40bff'}
                secondaryColor={'#0bf4ff'}
                darkTheme
                score={80}
              />
            </div>
          ) : null}
          <div className="nft-separate-line"></div>
          {nft?.isGenesisNFT ? (
            <div className="flex_container_space_between mb-10 mt-20">
              <div className="owners_wrapper center_owner">
                <p className="title_text_owner">Unlocks Initial</p>
                <p className="title_text_owner unlock_param">7</p>
              </div>
              <div className="owners_wrapper center_owner">
                <p className="title_text_owner">Remaining</p>
                <p className="title_text_owner unlock_param">4</p>
              </div>
            </div>
          ) : null}
          {nft?.blockdeadline && nft?.statusid?.id < NFT_STATUS.MINTED ? (
            <>
              <div className="fullwidth">
                <div className="nft-bid-info-header">
                  <div>{t('ending in')}</div>
                  {nft?.statusid?.id !== NFT_STATUS.RAFFLE ? (
                    <div>{t('current Bid')}</div>
                  ) : (
                    <div>{getRaffleData()?.label}</div>
                  )}
                </div>
                <div
                  className={classNames(
                    'nft-bid-info-body',
                    nft?.statusid?.id === NFT_STATUS.RAFFLE
                      ? 'yellow-color'
                      : '',
                  )}
                >
                  <div>
                    {state.day}d {state.hours}h {state.minutes}m {state.seconds}
                    s
                  </div>
                  {nft?.statusid?.id !== NFT_STATUS.RAFFLE ? (
                    <div>{nft?.bid ?? 0}</div>
                  ) : (
                    <div className="yellow-color">
                      {getRaffleData()?.value + getRaffleData()?.suffix}
                    </div>
                  )}
                </div>
              </div>
              <div className="nft-separate-line mb-20"></div>
            </>
          ) : (
            ''
          )}
          {claimLoader || claimableCountLoader
            ? null
            : nft?.statusid?.id === 6 && (
                <p className="available_center_on_items">
                  {t('claiming_available')}: {nft?.totalbalance}
                  <br></br>
                  {nft?.claimable || nft?.alreadyclaimed ? null : (
                    <span className="hint_claim">
                      {t('hint_text') +
                        ' ' +
                        minStakingSuccessData +
                        ' ' +
                        t('shares')}
                    </span>
                  )}
                </p>
              )}
          {claimLoader || claimableCountLoader ? (
            <div
              className={classNames(
                'main_claim_wrapper',
                isMobile() ? 'mt-20' : 'mt-20 mb-20',
              )}
            >
              <div className="flex_container">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              </div>
            </div>
          ) : // : nft?.statusid?.id === 6 &&
          //   claimableCount > 0 &&
          //   nft?.alreadyclaimed ? (
          //   <div
          //     className={classNames(
          //       'main_claim_wrapper',
          //       isMobile() ? 'mt-20' : 'mt-40 mb-40',
          //     )}
          //   >
          //     <div className="inner_claim_wrapper">
          //       <p className="available_center_on_items">
          //         {t('claiming_available')}: {claimableCount}
          //       </p>
          //       <div className={classNames('nft-btn', 'btn-disabled')}>
          //         {t('already_claimed')}
          //       </div>
          //     </div>
          //   </div>
          // )
          nft?.statusid?.id === 6 && claimableCount > 0 && nft?.claimable ? (
            <div
              className={classNames(
                'main_claim_wrapper',
                isMobile() ? 'mt-20' : 'mt-20 mb-20',
              )}
            >
              <div className="inner_claim_wrapper">
                {/* <p className="available_center_on_items">
                  {t('claiming_available')}: {claimableCount}
                </p> */}
                <div
                  className={classNames(
                    'nft-btn',
                    // nft?.isclosed ? 'btn-disabled' : '',
                  )}
                  onClick={handleSubmit}
                >
                  {t('claim_for_free')}
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          {nft?.statusid?.id === NFT_STATUS.RAFFLE ? (
            <>
              {isParticipated() ? (
                <div className="nft-bid-info-body flex-center yellow-color">
                  {t('you have already participated')}
                </div>
              ) : (
                <button
                  className={classNames(
                    'nft-btn bg-yellow-color',
                    nft?.isclosed ? 'btn-disabled-yellow' : '',
                  )}
                  onClick={
                    stakingBalance > 0 ? handleParticipate : handleShowPopup
                  }
                >
                  {t(
                    nft?.isclosed
                      ? 'closed'
                      : isEnded
                      ? 'draw winner'
                      : stakingBalance > 0
                      ? 'participate'
                      : 'stake to win',
                  )}
                </button>
              )}
            </>
          ) : nft?.statusid?.id === NFT_STATUS.AUCTION ? (
            <>
              {isHighestBidder ? (
                <div className="nft-bid-info-body flex-center">
                  {t('you are the highest bidder')}
                </div>
              ) : (
                <button
                  className={classNames(
                    'nft-btn',
                    nft?.isclosed ? 'btn-disabled' : '',
                  )}
                  onClick={handleShowPopup}
                >
                  {nft?.isclosed
                    ? 'closed'
                    : t(isEnded ? 'close auction' : 'place bid')}
                </button>
              )}
              <button className="nft-btn btn-disabled" onClick={handleShowBids}>
                {t('show bids')}
              </button>
            </>
          ) : nft?.statusid?.id === NFT_STATUS.MINTED ||
            nft?.statusid?.id === 6 ||
            nft?.statusid === 5 ? (
            <>
              {/* <button
                className="nft-btn btn-active mt-20"
                onClick={handleShowExplorer}
              >
                {t('show_owners')}
              </button> */}
              {isUserWallet(nft?.owner) ? (
                <>
                  <button
                    className="nft-btn"
                    style={{ margin: '20px auto 0' }}
                    onClick={handleShowPopup}
                  >
                    {t('send')}
                  </button>
                  <button
                    className="nft-btn"
                    style={{ background: '#c9a009' }}
                    onClick={handleOpenBoost}
                  >
                    {t('boost')}
                  </button>
                </>
              ) : (
                <button
                  className="nft-btn btn-active mt-20"
                  onClick={handleShowExplorer}
                >
                  {t('show on explorer')}
                </button>
              )}
            </>
          ) : (
            ''
          )}
          {!nft?.isGenesisNFT &&
          (nft?.statusid?.id === NFT_STATUS.MINTED ||
            nft?.statusid?.id === 6) ? (
            <div className="flex_container_space_between mb-10">
              <div className="owners_wrapper">
                <p className="title_text_owner">{t('owners')}</p>
                <p
                  className="title_text_owner blue_underline"
                  onClick={handleShowOwners}
                >
                  {t('show')}
                </p>
              </div>
              <div className="owners_wrapper">
                <p className="title_text_owner">{t('minted_on')}</p>
                <p className="title_text_owner">
                  {new Date(nft?.mintdate * 1000)
                    .toISOString()
                    .slice(0, 16)
                    .replace('T', ' ')}
                </p>
              </div>
            </div>
          ) : (
            ''
          )}
          <BottomPopup
            mode={nft?.statusid?.id === NFT_STATUS.RAFFLE ? 'stake' : 'nft'}
            isOpen={showPopup}
          >
            {showPopup ? (
              <>
                {nft?.statusid?.id === NFT_STATUS.RAFFLE ? (
                  <Stake
                    detailpageurl={nft?.detailpageurl}
                    isPro={nft?.playerstatusid === PLAYER_STATUS.PRO}
                    onClose={() => {
                      setShowPopup(false)
                    }}
                  />
                ) : nft?.statusid?.id === NFT_STATUS.AUCTION ? (
                  <Send
                    onSubmit={handleSubmit}
                    onClose={() => {
                      setShowPopup(false)
                    }}
                  />
                ) : (
                  <SendNft
                    onSubmit={handleSubmit}
                    onClose={() => {
                      setShowPopup(false)
                    }}
                  />
                )}
              </>
            ) : null}
          </BottomPopup>
          <BottomPopup mode="nft" isOpen={isConfirmed}>
            {isConfirmed ? (
              <Confirmed
                onClose={() => {
                  setIsConfirmed(false)
                }}
              />
            ) : null}
          </BottomPopup>
          <BottomPopup
            mode={`nft ${isMobile() ? 'bids-mobile-wrapper' : ''}`}
            isOpen={showBidList || showOwners || openBoost}
          >
            {showBidList || showOwners || openBoost ? (
              <section
                className={classNames(
                  'wallet-container',
                  showOwners ? 'owner_list_container' : 'bid-list-container',
                )}
                style={{ position: 'relative' }}
              >
                {showOwners ? (
                  <div
                    className="bid-body-container"
                    style={{ border: 'none', height: '580px' }}
                  >
                    {ownerListLoader ? (
                      <div
                        className="flex_container"
                        style={{ marginTop: '200px' }}
                      >
                        <div className="loading-spinner">
                          <div className="spinner"></div>
                        </div>
                      </div>
                    ) : ownerListData.length > 0 ? (
                      ownerListData?.map((item: any, index: number) => (
                        <>
                          {item?.username !== null ? (
                            <div
                              className="flex_container owner_list_wrapper owner_user"
                              onClick={() => {
                                dispatch(showNftForm({}))
                                navigate(`/app/user/${item?.username}`)
                              }}
                            >
                              <div className="number_index">{index + 1}</div>
                              <div className="avatar_border">
                                <div
                                  className={classNames(
                                    'avatar_image',
                                    item?.avatar,
                                  )}
                                ></div>
                              </div>
                              <div className="user_name_wrapper">
                                <div className="owner_user_name">
                                  {item?.username}
                                </div>
                                <div className="owner_user_name">
                                  <span style={{ color: '#f3b127' }}>
                                    {item?.seasonallevel}
                                  </span>{' '}
                                  /{' '}
                                  <span style={{ color: '#6bc909' }}>
                                    {getFlooredNumber(item?.xp.toFixed(0))} XP
                                  </span>
                                </div>
                              </div>
                              <div className="number_index">
                                {item?.balance}
                              </div>
                            </div>
                          ) : (
                            <div className="flex_container_space_between owner_list_wrapper">
                              <p className="number_index">{index + 1}</p>
                              <p className="owner_address">
                                <a
                                  href={`${BASE_EXPLORE_URL}/address/${item?.address}`}
                                  target="_blank"
                                >
                                  {item?.address}
                                </a>
                              </p>
                              <p className="number_index">
                                {getFlooredNumber(item?.balance)}
                              </p>
                            </div>
                          )}
                        </>
                      ))
                    ) : (
                      <div className="bid-list-title">{t('no_owner')}</div>
                    )}
                  </div>
                ) : openBoost ? (
                  <div className="wallet-container">
                    <p className="nft-boost-desc">{t('boost_desc')}</p>
                    <div className="boost_xp_box">
                      +{getFlooredNumber(nft?.xp.toFixed(0))} XP
                    </div>
                    <button
                      className={classNames(
                        'nft-btn',
                        nft?.xp >= 1 ? '' : 'btn-disabled',
                      )}
                      style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '12.5%',
                        right: '12.5%',
                      }}
                      onClick={() => {
                        if (nft?.xp >= 1) {
                          handleSubmit('')
                        }
                      }}
                    >
                      {t('collect_xp')}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bid-header-container">
                      {bidList.length > 0 && (
                        <div className="stake-bid-header">
                          {t('current bids')}
                        </div>
                      )}
                    </div>
                    {isLoading ? (
                      <Spinner
                        className="bid-loader"
                        spinnerStatus={isLoading}
                        title={''}
                      />
                    ) : bidList.length > 0 ? (
                      <div className="bid-body-container">
                        {bidList.map((item: any, index: number) => (
                          <div className="nft-bid-item" key={index}>
                            <div className="nft-bid-item-no">#{index + 1}</div>
                            <div className="nft-bid-item-amount">
                              {item.bid ?? '0.00'}
                            </div>
                            <div className="nft-bid-item-date">
                              {new Date(item.biddate * 1000)
                                .toISOString()
                                .slice(0, 16)
                                .replace('T', ' ') ?? '2000.01.01'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bid-list-title">{t('no bids yet')}</div>
                    )}
                  </>
                )}
                <div
                  className="nft-close-link mt-20 mb-0 m-0auto"
                  onClick={() => {
                    setShowBidList(false)
                    setShowOwners(false)
                    setOpenBoost(false)
                  }}
                  style={{ position: 'absolute', bottom: '20px', left: '45%' }}
                >
                  {t('close')}
                </div>
              </section>
            ) : null}
          </BottomPopup>
        </div>
      </div>
    </div>
  )
}

export default NftForm
