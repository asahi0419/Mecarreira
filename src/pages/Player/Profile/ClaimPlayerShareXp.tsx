import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { isMobile, getFlooredAnyFixed } from '@utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { claimXP } from '@root/apis/playerCoins/playerCoinsSlice'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import { ethers } from 'ethers'
import {
  getClaimableXp,
  getPlayerShares,
  showPlayerShareXp,
} from '@root/apis/onboarding/authenticationSlice'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import { POLYGON_NETWORK_RPC_URL } from '@root/constants'
import Web3 from 'web3'
import { PriceItem } from '@pages/PurchaseNft/components/PurchaseSummary'
import approxIconBlack from '@assets/images/approximation_black.webp'
import approxIcon from '@assets/images/approximation.webp'
import maticIcon from '@assets/images/matic-token-icon.webp'
import { useWalletHelper } from '@utils/WalletHelper'
const ClaimPlayerShareXp: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [txnError, setTxnError] = useState('')
  const [txnHash, setTxnHash] = useState('')
  const [showBottomPopup, setShowBottomPopup] = useState(false)
  const [apiAction, setApiAction] = useState('')
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const [claimLoader, setClaimLoader] = useState(false)
  const [claimableXp, setClaimableXp] = useState(0)
  const [lastClaimPrice, setLastClaimPrice] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [ownedShares, setOwnedShares] = useState(0)
  const [difference, setDifference] = useState(0)
  const { centralContract, centralContractAbi, getPlayerDetailsSuccessData } =
    useSelector((state: RootState) => state.playercoins)

  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    playerShareHold,
    showPlayerShareXpValue,
    playerShareLoader,
    selectedThemeRedux,
    claimableXpData,
    playerShareStaked,
  } = authenticationData

  const { getWeb3Provider, callWeb3Method } = useWalletHelper()

  const handleSubmit = (arg: any) => {
    setShowBottomPopup(true)
    if (localStorage.getItem('loginId')) {
      setApiAction('claimXP')
      return
    }
    let promise
    if (getPlayerDetailsSuccessData?.playercontract) {
      const playerContract = Web3.utils.toChecksumAddress(
        getPlayerDetailsSuccessData?.playercontract,
      )
      promise = callWeb3Method('claimXP', centralContract, centralContractAbi, [
        playerContract,
      ])
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
  const [getXp, setGetXp] = useState(false)
  const handleClose = () => {
    dispatch(showPlayerShareXp({ showPlayerShareXpValue: false }))
    setGetXp(true)
    if (loginInfo) {
      setTimeout(() => {
        getClaimableXpExternal()
      }, 2000)
    } else if (loginId) {
      setTimeout(() => {
        getClaimableXPInternal()
      }, 2000)
    }
    setShowBottomPopup(false)
    setTxnError('')
    setTxnHash('')
  }

  const handleNftApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('user_secret', user_secret)
    if (apiAction === 'claimXP') {
      formData.append(
        'playercontract',
        getPlayerDetailsSuccessData?.playercontract,
      )
      dispatch(claimXP(formData))
    }
  }
  const getClaimableXpExternal = async () => {
    setClaimLoader(true)
    setGetXp(false)
    const provider = await getWeb3Provider()

    console.log(
      '========================== GETTING CLAIMABLE XP ==========================',
    )
    console.log(
      'Issue: Owned shares value in "getClaimableXp" contract call response is coming different than one from DB',
    )
    console.log('Response of "getClaimableXp" call is as shown below')

    console.log(
      'central contract used to create contract instance --->',
      centralContract,
    )
    console.log(
      'central contract ABI used to create contract instance --->',
      centralContractAbi,
    )
    console.log(
      'wallet address used to create contract instance --->',
      loginInfo,
    )

    const getClaimableAvailability = new ethers.Contract(
      centralContract,
      centralContractAbi,
      provider.getSigner(loginInfo!),
    )
    const externalWallet = Web3.utils.toChecksumAddress(
      getPlayerDetailsSuccessData?.playercontract,
    )
    console.log(
      'player contract passed to getClaimableXp method of contract--->',
      externalWallet,
    )

    try {
      const getAvailability = await getClaimableAvailability?.getClaimableXp(
        externalWallet,
      )

      const getClaimableXp =
        parseInt(getAvailability[0]._hex) / 1000000000000000000
      const lastClaimPrice =
        parseInt(getAvailability[3]._hex) / 1000000000000000000
      const currentPrice =
        parseInt(getAvailability[2]._hex) / 1000000000000000000
      const ownedShares = parseInt(getAvailability[1]._hex)
      const difference = currentPrice - lastClaimPrice

      console.log('---->', {
        getAvailability,
        getClaimableXp,
        lastClaimPrice,
        currentPrice,
        ownedShares,
        difference,
        externalWallet,
      })

      console.log('---->', JSON.stringify(getAvailability))
      console.log(
        'hex at index 1 of above response = ',
        getAvailability[1]._hex,
      )
      console.log(
        'owned shares calculated by converting hex to number using parseFloat(hex) ==>',
        parseFloat(getAvailability[1]._hex),
      )
      console.log(
        'central contract ABI used to create contract instance --->',
        centralContractAbi,
      )
      console.log('========================xxxx============================')
      setClaimableXp(getClaimableXp)
      setLastClaimPrice(lastClaimPrice)
      setCurrentPrice(currentPrice)
      setOwnedShares(playerShareStaked)
      setDifference(difference)
      setClaimLoader(false)
    } catch (error) {
      console.log('error', error)
    }
  }
  // INTERNAL_API_INTEGRATION
  useEffect(() => {
    if (claimableXpData.length > 0) {
      const getClaimableXpInternal =
        parseInt(claimableXpData[0]) / 1000000000000000000
      const lastClaimPriceInternal =
        parseInt(claimableXpData[3]) / 1000000000000000000
      const currentPriceInternal =
        parseInt(claimableXpData[2]) / 1000000000000000000
      const ownedSharesInternal = parseInt(claimableXpData[1])
      const differenceInternal = currentPriceInternal - lastClaimPriceInternal

      console.log('getClaimableXp Internal Contract call on popup load', {
        claimableXpData,
        getClaimableXpInternal,
        lastClaimPriceInternal,
        currentPriceInternal,
        ownedSharesInternal,
        differenceInternal,
      })
      setClaimableXp(getClaimableXpInternal)
      setLastClaimPrice(lastClaimPriceInternal)
      setCurrentPrice(currentPriceInternal)
      setOwnedShares(playerShareStaked)
      setDifference(differenceInternal)
      setClaimLoader(false)
    }
  }, [claimableXpData])

  const getClaimableXPInternal = async () => {
    setClaimLoader(true)
    setGetXp(false)
    // INTERNAL_API_INTEGRATION
    dispatch(
      getClaimableXp({
        playerContract: getPlayerDetailsSuccessData?.playercontract,
      }),
    )
    // const userWalletAddressUnder = await localStorage.getItem(
    //   'userWalletAddress',
    // )
    // const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
    //   POLYGON_NETWORK_RPC_URL,
    // )
    // const getClaimableAvailability = new ethers.Contract(
    //   centralContract,
    //   centralContractAbi,
    //   simpleRpcProvider.getSigner(userWalletAddressUnder!),
    // )
    // const internalWallet = Web3.utils.toChecksumAddress(
    //   getPlayerDetailsSuccessData?.playercontract,
    // )
    // try {
    //   const getAvailability = await getClaimableAvailability?.getClaimableXp(
    //     internalWallet,
    //   )
    //   const getClaimableXp =
    //     parseInt(getAvailability[0]._hex) / 1000000000000000000
    //   const lastClaimPrice =
    //     parseInt(getAvailability[3]._hex) / 1000000000000000000
    //   const currentPrice =
    //     parseInt(getAvailability[2]._hex) / 1000000000000000000
    //   const ownedShares = parseInt(getAvailability[1]._hex)
    //   const difference = currentPrice - lastClaimPrice

    //   console.log('getClaimableXp', {
    //     getAvailability,
    //     getClaimableXp,
    //     lastClaimPrice,
    //     currentPrice,
    //     ownedShares,
    //     difference,
    //   })
    //   setClaimableXp(getClaimableXp)
    //   setLastClaimPrice(lastClaimPrice)
    //   setCurrentPrice(currentPrice)
    //   setOwnedShares(ownedShares)
    //   setDifference(difference)
    //   setClaimLoader(false)
    // } catch (error) {
    //   console.log('error', error)
    // }
  }
  useEffect(() => {
    if ((centralContract && showPlayerShareXpValue) || getXp) {
      dispatch(
        getPlayerShares({
          playerContract: getPlayerDetailsSuccessData?.playercontract,
        }),
      )
      if (loginInfo) {
        getClaimableXpExternal()
      } else if (loginId) {
        getClaimableXPInternal()
      }
    }
  }, [centralContract, centralContractAbi, showPlayerShareXpValue, getXp])

  return (
    <div className="flex-middle" style={{ cursor: 'unset' }}>
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
        {claimLoader || playerShareLoader ? (
          <div className="flex_container" style={{ marginTop: '300px' }}>
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        ) : (
          <div
            className="bid-body-container"
            style={isMobile() ? { position: 'relative', height: '500px' } : {}}
          >
            <div
              className="bid-list-container"
              style={{
                marginTop:
                  claimableXp >= 1 && isMobile()
                    ? '0px'
                    : claimableXp >= 1 && !isMobile()
                    ? '120px'
                    : claimableXp < 1 && isMobile()
                    ? '0px'
                    : '150px',
              }}
            >
              {claimableXp >= 1 ? (
                <p
                  className="nft-boost-desc"
                  style={{ padding: '0px 30px' }}
                >{`${t('you_hold')} ${getFlooredAnyFixed(
                  playerShareStaked,
                  2,
                )} ${t('shares_of')} ${getPlayerDetailsSuccessData?.name} $${
                  getPlayerDetailsSuccessData?.ticker
                } ${t('and_are_eligible_for')}`}</p>
              ) : (
                <p
                  className="nft-boost-desc"
                  style={{ padding: '0px 30px' }}
                >{`${t('you_hold')} ${getFlooredAnyFixed(
                  playerShareStaked,
                  2,
                )} ${t('shares_of')} ${getPlayerDetailsSuccessData?.name} $${
                  getPlayerDetailsSuccessData?.ticker
                } ${t('and_are_not_eligible')}`}</p>
              )}
              {claimableXp >= 1 ? (
                <div className="boost_xp_box">
                  +{Math.floor(claimableXp.toFixed(2)).toLocaleString()} XP
                </div>
              ) : null}
              <div
                className="list_of_data"
                style={{
                  marginTop: claimableXp >= 1 ? '' : '50px',
                }}
              >
                <>
                  <PriceItem
                    label={t('last claim price')}
                    valueLeftIcon={maticIcon}
                    valueRightIcon={''}
                    value={lastClaimPrice.toFixed(3)}
                    isLoading={false}
                  />
                  <div className="divide pricing-list-divider"></div>
                </>
                <>
                  <PriceItem
                    label={t('current price')}
                    valueLeftIcon={maticIcon}
                    valueRightIcon={''}
                    value={currentPrice.toFixed(3)}
                    isLoading={false}
                  />
                  <div className="divide pricing-list-divider"></div>
                </>
                <>
                  <PriceItem
                    label={t('difference')}
                    valueLeftIcon={''}
                    valueRightIcon={''}
                    value={difference.toFixed(3)}
                    isLoading={false}
                  />
                  <div className="divide pricing-list-divider"></div>
                </>
                <>
                  <PriceItem
                    label={t('shares owned')}
                    valueLeftIcon={''}
                    valueRightIcon={''}
                    value={getFlooredAnyFixed(playerShareStaked, 2)}
                    isLoading={false}
                    toFixed={true}
                  />
                  <div className="divide pricing-list-divider"></div>
                </>
                <>
                  <PriceItem
                    label={t('difference_multiply_shares')}
                    valueLeftIcon={''}
                    valueRightIcon={''}
                    value={
                      claimableXp
                        ? `${Math.floor(claimableXp.toFixed(2))} XP`
                        : '0.00 XP'
                    }
                    isLoading={false}
                    bold={true}
                  />
                  <div className="divide pricing-list-divider"></div>
                </>
              </div>
              {claimableXp >= 1 ? (
                <button
                  className={classNames(
                    'nft-btn',
                    claimableXp >= 1 ? '' : 'btn-disabled',
                  )}
                  style={{
                    position: 'absolute',
                    bottom: claimableXp >= 1 && isMobile() ? '-30px' : '60px',
                    left: '12.5%',
                    right: '12.5%',
                    textTransform: 'uppercase',
                  }}
                  onClick={() => {
                    if (claimableXp >= 1) {
                      handleSubmit('')
                    }
                  }}
                >
                  {t('claim')}
                </button>
              ) : null}
            </div>
            <div
              className="nft-close-link mt-20 mb-0 m-0auto"
              onClick={() => {
                dispatch(showPlayerShareXp({ showPlayerShareXpValue: false }))
              }}
              style={{
                position: 'absolute',
                bottom: claimableXp >= 1 && isMobile() ? '-50px' : '40px',
                left: '46%',
              }}
            >
              {t('close')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClaimPlayerShareXp
