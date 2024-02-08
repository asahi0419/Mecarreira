/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import DialogBox from '@components/Dialog/DialogBox'
import ApiActionPrompt from '@components/Dialog/ApiActionprompt'
import Web3ActionPrompt from '@pages/PlayerDashboard/PlayerCoin/web3Actionprompt'
import { isMobile } from '@utils/helpers'
import {
  getGeneralSettings,
  getNextAvailabilityForActivity,
  postClaimFreeXp,
} from '@root/apis/onboarding/authenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { ethers } from 'ethers'
import { POLYGON_NETWORK_RPC_URL } from '@root/constants'
import Web3 from 'web3'
import { toast } from 'react-hot-toast'
import { useWalletHelper } from '@utils/WalletHelper'
const FreeXp: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [livePromptActive, setLivePromptActive] = useState(false)
  const [txnErr, setTxnErr] = useState('')
  const [txnHashInner, setTxnHash] = useState('')
  const [promptDialog, setPromptDialog] = useState('')
  const [web3Action, setWeb3Action] = useState('')
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const [loader, setLoader] = useState(false)
  const [getAvailability, setGetAvailability] = useState(0)
  const [blockNumber, setBlockNumber] = useState(0)

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    centralContract,
    centralContractAbi,
    nextAvailabilityForActivityData,
  } = authenticationData

  const playerCoinData: any = useSelector(
    (state: RootState) => state.playercoins,
  )
  const { txnConfirmSuccess, txnConfirmResp } = playerCoinData

  const { getWeb3Provider } = useWalletHelper()

  const handleRemovePrompt = () => {
    setLivePromptActive(false)
    setTxnErr('')
    setTxnHash('')
    setPromptDialog('')
    setWeb3Action('')
  }

  const handleCancelGoLive = () => {
    setLivePromptActive(false)
    setTxnErr('')
    setTxnHash('')
  }

  const handleGetFreeXpInternal = (user_secret: any) => {
    // console.log('handleGetFreeXpInternal')
    try {
      const formData = new FormData()
      formData.append('user_secret', user_secret)
      dispatch(postClaimFreeXp(formData))
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetFreeXpExternal = async () => {
    console.log('handleGetFreeXpExternal')
    try {
      const provider = await getWeb3Provider()
      const generalContract = new ethers.Contract(
        centralContract, // contract address of Router
        centralContractAbi,
        provider.getSigner(loginInfo!), // signer of the currently logged in user wallet address
      )
      const type = 0
      const tx = await generalContract.beActive(type, {
        gasLimit: ethers.utils.hexlify(1000000),
      })
      setTxnHash(tx.hash)
      // console.log('txnHash', tx)
    } catch (err: any) {
      console.log('error', err)
      const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
      if (isErrorGasEstimation) {
        console.log('error not enough balance')
        setTxnErr(t('not enough funds to pay for blockchain transaction'))
      } else {
        console.log('error reason message')
        setTxnErr(err.reason || err.message)
      }
    }
  }

  const handleGetFreeXp = () => {
    if (blockNumber > getAvailability) {
      setLivePromptActive(true)
    } else {
      toast.error(t('You can only claim once within a 24-hour period.'))
    }
  }

  const checkFreeXpAvailabilityExternal = async () => {
    const provider = await getWeb3Provider()
    const getNextAvailability = new ethers.Contract(
      centralContract, // contract address of Router
      centralContractAbi, //  contract abi of Router
      provider.getSigner(loginInfo!),
    )
    const type = 0
    try {
      const getAvailability =
        await getNextAvailability.getNextAvailabilityForActivity(type)
      const value = parseInt(getAvailability._hex)
      setGetAvailability(value)
      const currentBlockNumber = await provider.getBlockNumber()
      setBlockNumber(currentBlockNumber)
      setLoader(false)
      // console.log('getAvailability', {
      //   getAvailability,
      //   value,
      //   currentBlockNumber,
      // })
    } catch (error) {
      console.log('error', error)
    }
  }
  // INTERNAL_API_INTEGRATION
  useEffect(() => {
    fetchBlockData()
  }, [nextAvailabilityForActivityData])

  const fetchBlockData = async () => {
    if (nextAvailabilityForActivityData) {
      const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
        POLYGON_NETWORK_RPC_URL,
      )
      const currentBlockNumber = await simpleRpcProvider.getBlockNumber()
      setBlockNumber(currentBlockNumber)
      setGetAvailability(nextAvailabilityForActivityData)
      setLoader(false)
      console.log('nextAvailabilityForActivityData', {
        nextAvailabilityForActivityData,
        currentBlockNumber,
      })
    }
  }

  const checkFreeXpAvailabilityInternal = async () => {
    // INTERNAL_API_INTEGRATION
    dispatch(getNextAvailabilityForActivity())
    return
    // const userWalletAddressUnder = await localStorage.getItem(
    //   'userWalletAddress',
    // )
    // const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
    //   POLYGON_NETWORK_RPC_URL,
    // )
    // const getNextAvailability = new ethers.Contract(
    //   centralContract, // contract address of Router
    //   centralContractAbi, //  contract abi of Router
    //   simpleRpcProvider.getSigner(userWalletAddressUnder!),
    // )
    // const type = 0
    // try {
    //   const getAvailability =
    //     await getNextAvailability.getNextAvailabilityForActivity(type)
    //   const value = parseInt(getAvailability._hex)
    //   setGetAvailability(value)
    //   const currentBlockNumber = await simpleRpcProvider.getBlockNumber()
    //   setBlockNumber(currentBlockNumber)
    //   setLoader(false)
    //   console.log('getAvailability', {
    //     getAvailability,
    //     value,
    //     currentBlockNumber,
    //   })
    // } catch (error) {
    //   console.log('error', error)
    // }
  }

  useEffect(() => {
    if (
      (loginInfo && centralContract) ||
      (loginInfo && txnConfirmSuccess) ||
      (loginInfo && txnConfirmResp[0]?.haserror === 0)
    ) {
      checkFreeXpAvailabilityExternal()
    }
    if (
      (loginId && centralContract) ||
      (loginId && txnConfirmSuccess) ||
      (loginId && txnConfirmResp[0]?.haserror === 0)
    ) {
      checkFreeXpAvailabilityInternal()
    }
  }, [centralContract, txnConfirmSuccess, txnConfirmResp])

  useEffect(() => {
    dispatch(getGeneralSettings())
    // setLoader(true)
  }, [])

  return (
    <AppLayout headerClass="home">
      {isMobile() && livePromptActive ? (
        <>
          {localStorage.getItem('loginId') ? (
            <ApiActionPrompt
              hideWalletAddress={false}
              promptText={t('are you certain proceed')}
              onSuccess={handleGetFreeXpInternal}
              onClose={handleCancelGoLive}
              customClass={
                isMobile() ? 'go-live-web3 purchase-pc-bottomwrapper' : ''
              }
              paddingClass={'p-20 mt-80'}
            />
          ) : (
            <Web3ActionPrompt
              txnHash={txnHashInner}
              errorMsg={txnErr}
              promptText={t('are you certain proceed')}
              onSuccess={handleGetFreeXpExternal}
              onClose={handleCancelGoLive}
              walletAddress={''}
              operationMode={'add'}
              customClass={isMobile() ? 'exwallet-bottomwrapper' : ''}
              paddingClass={'p-20 mt-80'}
            />
          )}
        </>
      ) : (
        <div className="freeXp_container">
          <div className="freeXp_wrapper">
            <div
              className="new-draft-title launch-select"
              style={{ textTransform: 'uppercase' }}
            >
              {t('free_xp_24')}
            </div>
            {/* <div className="sub_title_freeXp text-center mt-30 mb-30">
              {t('collect_xp_24')}
            </div> */}
            {/* {isUnavailable ? (
          <div className="input-feedback p-0">
            {t('your attempts were exhausted')}
          </div>
        ) : null} */}
            <div className="flex_container">
              {/* <div className="custom-btn shine">{t('get_your_freeXp')}</div> */}
              {loader ? (
                <div className="loading-spinner mt-40">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div
                  className={classNames(
                    'button-box button2 custom-btn',
                    // isUnavailable ? 'disabled' : '',
                  )}
                  style={{
                    background: blockNumber > getAvailability ? '' : '#f54f4f',
                    border: blockNumber > getAvailability ? '' : '#f54f4f',
                  }}
                  onClick={handleGetFreeXp}
                >
                  {t('get_your_freeXp')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!isMobile() && (
        <DialogBox
          isOpen={livePromptActive}
          onClose={handleRemovePrompt}
          contentClass="onboarding-popup"
        >
          {localStorage.getItem('loginId') ? (
            <ApiActionPrompt
              hideWalletAddress={false}
              promptText={t('are you certain proceed')}
              onSuccess={handleGetFreeXpInternal}
              onClose={handleCancelGoLive}
              customClass={
                isMobile() ? 'go-live-web3 purchase-pc-bottomwrapper' : ''
              }
              paddingClass={'p-20'}
            />
          ) : (
            <Web3ActionPrompt
              txnHash={txnHashInner}
              errorMsg={txnErr}
              promptText={t('are you certain proceed')}
              onSuccess={handleGetFreeXpExternal}
              onClose={handleCancelGoLive}
              walletAddress={''}
              operationMode={'add'}
              customClass={isMobile() ? 'exwallet-bottomwrapper' : ''}
              paddingClass={'p-20'}
            />
          )}
        </DialogBox>
      )}
    </AppLayout>
  )
}

export default FreeXp
