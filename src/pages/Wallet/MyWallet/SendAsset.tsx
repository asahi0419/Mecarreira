import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import '@assets/css/pages/Wallet.css'
import BottomPopup from '@components/Dialog/BottomPopup'
import Send from './Send'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import WalletIcon from '@assets/icons/icon/privy-logo.png'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  fetchPlayersBalance,
  getTxnConfirm,
  resetTxnConfirmationData,
  setTxnConfirmError,
  setTxnConfirmSuccess,
  transferCoins,
} from '@root/apis/playerCoins/playerCoinsSlice'
import {
  transferToWallet,
  sendTransOtp,
  resetTransaction,
  transferToWalletReset,
  resetSendTransOtp,
  getWalletAddress,
  getWalletDetails,
  getUserXp,
} from '@root/apis/onboarding/authenticationSlice'
import { isMobile } from '@utils/helpers'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import SendCurrency from './SendCurrency'
import classNames from 'classnames'
import ImageComponent from '@components/ImageComponent'
import { ConnectContext } from '@root/WalletConnectProvider'
import { useWalletHelper } from '@utils/WalletHelper'
import { BASE_EXPLORE_URL } from '@root/constants'

interface Props {
  mode: string
  isOpen: boolean
  txnHash: string
  txnError: string
  isLoadingMatic: boolean
  onSend: any
  address?: string
  isMaticDeposit?: boolean
  containerClassName?: string
  onCloseSend: any
  onClose: any
  playerData?: any
}
let txnCheckInterval: any = null
const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
} as React.CSSProperties

const currenciesData: string[] = []
const SendAsset: React.FC<Props> = ({
  mode,
  isOpen,
  onSend,
  isLoadingMatic,
  txnHash,
  txnError,
  playerData = null,
  onClose,
  onCloseSend,
}) => {
  const { getTxnStatus } = useContext(ConnectContext)
  const { getBalance } = useWalletHelper()
  const loginInfo = localStorage.getItem('loginInfo')
  const [web3CallInProgress, setWeb3CallInProgress] = useState(false)
  const [currencyIndex, setCurrencyIndex] = useState(0)
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [transferReqData, setTransferReqData] = useState<any>({})
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const walletType = localStorage.getItem('wallet')
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { player1contract, isTxnChecking, txnConfirmResp } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    userWalletData: { address },
    isTxnHash,
    currencyListData: { payment_options },
    selectedThemeRedux,
  } = authenticationData
  useEffect(() => {
    return () => {
      clearInterval(txnCheckInterval)
      dispatch(resetTxnConfirmationData())
    }
  }, [])

  useEffect(() => {
    currenciesData.push('MATIC')
    for (let i = 0; i < payment_options.length; i++) {
      currenciesData.push(payment_options[i]?.ticker)
    }
  }, [payment_options])

  useEffect(() => {
    if (txnHash) {
      handleTxnCheck()
    }
    if (isTxnHash) {
      handleTxnCheck()
    }
  }, [txnHash, isTxnHash])

  useEffect(() => {
    if (
      txnConfirmResp[0]?.haserror === 0 ||
      txnConfirmResp[0]?.haserror === 1
    ) {
      clearInterval(txnCheckInterval)
    }
  }, [txnConfirmResp])

  const handleTxnCheck = () => {
    if (loginInfo) {
      getTxnStatus(txnHash)
        .then(txn => dispatch(setTxnConfirmSuccess(txn?.status)))
        .catch(() => dispatch(setTxnConfirmError()))
    } else {
      dispatch(getTxnConfirm(txnHash || isTxnHash))
      txnCheckInterval = setInterval(() => {
        dispatch(getTxnConfirm(txnHash || isTxnHash))
      }, 10000)
    }
  }

  useEffect(() => {
    clearInterval(txnCheckInterval)
    if (!document.hidden) {
      if (txnHash) {
        handleTxnCheck()
      }
    }
  }, [document.hidden])

  const handleSendSubmit = (data: any) => {
    if (!loginInfo) {
      dispatch(sendTransOtp())
    }
    setWeb3CallInProgress(true)
    setTransferReqData({ ...data, ticker: currenciesData[data?.currencyIndex] })
    if (localStorage.getItem('loginInfo')) {
      onSend({ ...data, assetType: currenciesData[data?.currencyIndex] })
    } else {
      setToAddress(data.to_address)
      setAmount(data.amount)
    }
  }

  const handleSendClose = () => {
    onCloseSend()
  }
  const handleRefreshBalance = async () => {
    if (loginInfo) {
      dispatch(getWalletAddress(loginInfo))
      await getBalance()
    } else {
      dispatch(getWalletDetails())
    }
  }
  const handleCloseDialog = async () => {
    await dispatch(resetTransaction())
    await dispatch(transferToWalletReset())
    await dispatch(resetSendTransOtp())
    clearInterval(txnCheckInterval)
    setWeb3CallInProgress(false)
    onClose()
    handleRefreshBalance()
  }

  const handleSendApi = (user_secret: any, otp: any) => {
    if (mode === 'matic') {
      let reqParams: any = { ...transferReqData, user_secret, otp }
      if (transferReqData?.maxSelected && transferReqData?.ticker === 'MATIC') {
        delete reqParams?.amount
        reqParams = { ...reqParams, max: 'True' }
      } else {
        reqParams = { ...reqParams }
      }
      dispatch(transferToWallet(reqParams))
    } else {
      const formData = new FormData()
      console.log({
        user_secret,
        playerData,
        player1contract,
        toAddress,
        amount,
        otp,
      })
      formData.append('user_secret', user_secret)
      // if (mode === 'playercoin') {
      //   formData.append('contract', playerData?.contract)
      // } else {
      //   formData.append('contract', player1contract)
      // }
      // formData.append('contract', player1contract)
      formData.append('contract', playerData?.contract)
      formData.append('address', toAddress)
      formData.append('amount', amount)
      formData.append('otp', otp)
      dispatch(transferCoins(formData))
    }
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

  const handleChangeCurrency = (event: any) => {
    setCurrencyIndex(Number(event?.target?.value))
  }

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
  //             handleCloseDialog()
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
    <BottomPopup
      mode={`wallet ${isMobile() ? 'exwallet-bottomwrapper' : ''}`}
      isOpen={isOpen}
      contentClass="currency_drop_container-send"
    >
      {!web3CallInProgress ? (
        <>
          {mode === 'matic' ? (
            <SendCurrency
              assetType={
                playerData ? 'playerCoin' : currenciesData[currencyIndex]
              }
              onSubmit={handleSendSubmit}
              currenciesData={currenciesData}
              onClose={() => handleSendClose()}
              playerData={playerData}
              onChangeCurrency={handleChangeCurrency}
              isNoScroll
            />
          ) : (
            <Send
              assetType={
                playerData ? 'playerCoin' : currenciesData[currencyIndex]
              }
              onSubmit={handleSendSubmit}
              onClose={() => handleSendClose()}
              playerData={playerData}
              isNoScroll
            />
          )}
        </>
      ) : localStorage.getItem('loginInfo') ? (
        <section
          className="new-draft vertical-flex buy-fly"
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            textAlign: 'center',
          }}
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
              <div className="close-button" onClick={handleCloseDialog}>
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
                    {txnConfirmResp.length === 0 ? (
                      <div
                        className={classnames('spinner check-spinner')}
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
                      className={classnames(
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
              <div className="close-button" onClick={handleCloseDialog}>
                {t('close')}
              </div>
            </>
          )}
          <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        </section>
      ) : (
        <ApiBottomPopup
          showPopup={true}
          onSubmit={handleSendApi}
          onClose={handleCloseDialog}
          customClass="purchase-pc-bottomwrapper"
        />
      )}
    </BottomPopup>
  )
}

export default SendAsset
