import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Formik } from 'formik'
import classnames from 'classnames'
import * as Yup from 'yup'
import SubmitButton from '@components/Button/SubmitButton'
import FormInput from '@components/Form/FormInput'
import {
  restrictSecretInput,
  resetSecretInputAttempts,
  resetTransaction,
  transferToWalletReset,
  sendTransOtp,
  getUserXp,
} from '@root/apis/onboarding/authenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import Spinner from '@components/Spinner'
import classNames from 'classnames'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import { isMobile } from '@utils/helpers'
import WalletIcon from '@assets/images/wallet-icon.webp'
import WalletIconGold from '@assets/images/wallet-iconGold.webp'
import WalletIconLadies from '@assets/images/wallet-iconLadies.webp'
import BottomPopup from './BottomPopup'
import { ethers } from 'ethers'
import { encrypt } from '@utils/helpers'
import {
  getTxnConfirm,
  getSendMaticTxnConfirm,
  resetTxnConfirmationData,
  resetSendMaticTxnConfirm,
} from '@root/apis/playerCoins/playerCoinsSlice'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { POLYGON_NETWORK_RPC_URL, BASE_EXPLORE_URL } from '@root/constants'
import OtpInput from 'react-otp-input'
import ImageComponent from '@components/ImageComponent'
import { useWalletHelper } from '@utils/WalletHelper'

const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
} as React.CSSProperties
interface Props {
  showPopup: boolean
  onSubmit: any
  onClose: any
  paymentMode?: string
  customClass?: string
  myReferral?: boolean
  noPasswordForm?: boolean
}

const initialValues = {
  passphrase: '',
  otp: '',
}

let timeout: any = null

let txnCheckInterval: any = null
let contractTxnTrace: any = null

const ApiBottomPopup: React.FC<Props> = ({
  showPopup,
  onSubmit,
  onClose,
  paymentMode,
  customClass = '',
  myReferral,
  noPasswordForm,
}) => {
  const isRestrictedSecret = localStorage.getItem('secret_restricted')
  let countDown: any = null
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  clearTimeout(timeout)
  const dispatch = useDispatch()
  const [transactionInProgress, setTransactionInProgress] = useState(false)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    passphraseLoader,
    isTransactionSuccess,
    isTransactionError,
    txnHash,
    secretInputAttempts,
    isTransferTxnHash,
    transferAmountError,
    selectedThemeRedux,
    otpAttemptsLeft,
    sendTransOtpLoader,
    blockedTimeLeft,
    postReferralPayoutLoader,
    postReferralPayoutError,
    postReferralPayoutSuccess,
    postKioskItemPaymentLoader,
    isNftDetailFormVisible,
    postClaimFreeXpLoader,
  } = authenticationData

  const playerCoinData: any = useSelector(
    (state: RootState) => state.playercoins,
  )
  const showWalletPopup = useSelector(
    (state: RootState) => state.authentication.isWalletFormVisible,
  )
  const {
    txnHashN,
    isTxnChecking,
    txnConfirmResp,
    txnConfirmSuccess,
    isnewRewardPercentageLoading,
    isAddPayoutLoading,
    DraftingPercentageLoading,
    buyInCurrencyTxnHash,
    sellInCurrencyTxnHash,
    buyInCurrencyTransactionError,
  } = playerCoinData

  const { getWeb3Provider } = useWalletHelper()

  const [state, setState] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const [blockTimeHour, setBlockTimeHour] = useState(0)
  const [blockTimeMin, setBlockTimeMin] = useState(0)
  const [blockTimeSec, setBlockTimeSec] = useState(0)
  const initCountDownTest = (hh, mm, ss) => {
    const timeOffset = hh * 60 * 60 * 1000 + mm * 60 * 1000 + ss * 1000
    const countDownDate = new Date().getTime() + timeOffset

    // Update the count down every 1 second
    countDown = setInterval(function () {
      // Get today's date and time
      const now = new Date().getTime()

      // Find the distance between now and the count down date
      const distance = countDownDate < now ? 0 : countDownDate - now

      // Time calculations for hours, minutes and seconds
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      setBlockTimeHour(hours)
      setBlockTimeMin(minutes)
      setBlockTimeSec(seconds)
      if (distance < 0) {
        clearInterval(countDown)
      }
    }, 1000)
  }

  const getTime = timestring => {
    clearInterval(countDown)
    const timer = timestring.split(':')
    const hh = parseInt(timer[0])
    const mm = parseInt(timer[1])
    const ss = parseInt(timer[2])
    if (hh > 0 || mm > 0 || ss > 0) {
      initCountDownTest(hh, mm, ss)
    }
  }
  useEffect(() => {
    if (blockedTimeLeft) {
      getTime(blockedTimeLeft)
    }
  }, [blockedTimeLeft])
  const [contractTxnStatus, setContractTxnStatus] = useState('')
  const [otp, setOtp] = useState('')

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }
  const { t } = useTranslation()

  const handleSubmit = (values: any) => {
    onSubmit(encrypt(values.passphrase), otp)
  }
  useEffect(() => {
    if (myReferral && showPopup) {
      onSubmit()
    }
  }, [myReferral, showPopup])
  useEffect(() => {
    if (noPasswordForm && showPopup) {
      onSubmit()
    }
  }, [noPasswordForm, showPopup])
  useEffect(() => {
    if (isRestrictedSecret === 'true') {
      dispatch(restrictSecretInput())
    }
    return () => {
      clearInterval(countDown)
      dispatch(resetTransaction())
      dispatch(resetTxnConfirmationData())
      dispatch(transferToWalletReset())
      dispatch(resetSendMaticTxnConfirm())
    }
  }, [])

  useEffect(() => {
    if (isTransactionSuccess || isTransferTxnHash || isTxnChecking) {
      setTransactionInProgress(true)
    }
  }, [isTransactionSuccess, isTransferTxnHash, isTxnChecking])

  useEffect(() => {
    if (txnHash) {
      handleTxnCheck()
    }
    if (isTransferTxnHash) {
      handleTxnCheckMatic()
    }
    if (txnHashN) {
      handleTxnCheck()
    }
  }, [txnHash, isTransferTxnHash, txnHashN])

  useEffect(() => {
    if (
      txnConfirmResp[0]?.haserror === 0 ||
      txnConfirmResp[0]?.haserror === 1
    ) {
      clearInterval(txnCheckInterval)
    }
    console.log('TXSTOP--', { txnConfirmResp })
  }, [txnConfirmResp])

  useEffect(() => {
    console.log('TXSTOP1--', { txnConfirmSuccess })
    if (txnConfirmSuccess) {
      clearInterval(txnCheckInterval)
      clearInterval(contractTxnTrace)
      // INTERNAL_API_INTEGRATION
      setContractTxnStatus(txnConfirmSuccess)
    }
  }, [txnConfirmSuccess])

  useEffect(() => {
    if (['true', 'false'].includes(contractTxnStatus)) {
      clearInterval(contractTxnTrace)
    }
  }, [contractTxnStatus])

  const clearTxnTraces = () => {
    dispatch(resetTransaction())
    dispatch(resetTxnConfirmationData())
    dispatch(resetSendMaticTxnConfirm())
  }

  const closeBottomPopup = async () => {
    setContractTxnStatus('')
    await clearTxnTraces()
    onClose()
  }

  useEffect(() => {
    if (isTransactionSuccess) {
      timeout = setTimeout(() => {
        dispatch(resetTransaction())
        dispatch(resetTxnConfirmationData())
        setContractTxnStatus('')
        onClose()
      }, 10000)
    }
  }, [isTransactionSuccess])

  useEffect(() => {
    clearInterval(contractTxnTrace)
    clearInterval(txnCheckInterval)
    if (!document.hidden) {
      if (txnHash) {
        handleTxnCheck()
      }
      if (isTransferTxnHash) {
        handleTxnCheckMatic()
      }
      if (txnHashN) {
        handleTxnCheck()
      }
    }
    console.log('TXSTOP--DocHid--', document.hidden)
  }, [document.hidden])

  const handleTxnCheck = async () => {
    console.log({ paymentMode })
    try {
      if (
        (paymentMode && paymentMode === 'approve') ||
        paymentMode === 'buyInternal'
      ) {
        const provider = await getWeb3Provider()
        if (provider) {
          let txnConfirm: any = null
          contractTxnTrace = setInterval(async () => {
            txnConfirm = await provider.getTransactionReceipt(txnHash)
            setContractTxnStatus(txnConfirm?.status.toString())
          }, 5000)
        } else {
          // const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
          //   POLYGON_NETWORK_RPC_URL,
          // )
          // let txnConfirm: any = null
          console.log('txpABP1--', txnHash)
          contractTxnTrace = setInterval(async () => {
            // txnConfirm = await simpleRpcProvider.getTransactionReceipt(txnHash)
            // setContractTxnStatus(txnConfirm?.status > 0 ? 'true' : 'false')
            // INTERNAL_API_INTEGRATION
            // dispatch(getSendMaticTxnConfirm(txnHash))
            console.log('txpABP--', txnHash)
            dispatch(getTxnConfirm(txnHash))
          }, 5000)
        }
      } else {
        if (loginId) {
          dispatch(getTxnConfirm(txnHash || txnHashN))
          txnCheckInterval = setInterval(() => {
            dispatch(getTxnConfirm(txnHash || txnHashN))
          }, 10000)
        } else if (loginInfo) {
          let walletProvider = window.ethereum?.providers?.find(
            (provider: any) =>
              localStorage.getItem('wallet') === 'Metamask'
                ? provider.isMetaMask
                : localStorage.getItem('wallet') === 'Coinbase'
                ? provider.isCoinbaseWallet
                : provider.isTrustWallet,
          )
          if (!walletProvider) {
            if (
              (window.ethereum?.isMetaMask &&
                localStorage.getItem('wallet') === 'Metamask') ||
              (window.ethereum?.isCoinbaseWallet &&
                localStorage.getItem('wallet') === 'Coinbase')
            ) {
              walletProvider = window.ethereum
            }
          }
          if (walletProvider) {
            const provider = new ethers.providers.Web3Provider(walletProvider)
            let txnConfirm: any = null
            contractTxnTrace = setInterval(async () => {
              txnConfirm = await provider.getTransactionReceipt(txnHash)
              setContractTxnStatus(txnConfirm?.status.toString())
            }, 5000)
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleTxnCheckMatic = () => {
    dispatch(getSendMaticTxnConfirm(isTransferTxnHash))
    txnCheckInterval = setInterval(() => {
      dispatch(getSendMaticTxnConfirm(isTransferTxnHash))
    }, 10000)
  }

  useEffect(() => {
    if (secretInputAttempts < 1) {
      initCountDown()
      localStorage.setItem('secret_restricted', 'true')
      return () => {
        clearInterval(countDown)
        clearInterval(contractTxnTrace)
        clearInterval(txnCheckInterval)
      }
    }
    console.log('TXSTOP--', { secretInputAttempts })
  }, [secretInputAttempts])

  const initCountDown = () => {
    const countDownDate = new Date().getTime() + 15 * 60 * 1000

    // Update the count down every 1 second
    countDown = setInterval(function () {
      // Get today's date and time
      const now = new Date().getTime()

      // Find the distance between now and the count down date
      const distance = countDownDate < now ? 0 : countDownDate - now

      // Time calculations for hours, minutes and seconds
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      updateState({
        hours,
        minutes,
        seconds,
      })
      if (distance < 0) {
        dispatch(resetSecretInputAttempts())
        clearInterval(countDown)
        localStorage.removeItem('secret_restricted')
      }
    }, 1000)
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
    if (
      (!isTxnChecking && txnConfirmResp[0]?.haserror === 0) ||
      txnConfirmSuccess ||
      contractTxnStatus === 'true'
    ) {
      fire()
      dispatch(getUserXp(false))
    }
  }, [isTxnChecking, txnConfirmResp[0], txnConfirmSuccess, contractTxnStatus])

  const onChangeOtp = (otp: string) => {
    setOtp(otp)
  }
  useEffect(() => {
    clearInterval(countDown)
  }, [])

  return (
    <BottomPopup mode={'wallet ' + customClass} isOpen={showPopup}>
      {console.log({ transactionInProgress, myReferral, noPasswordForm })}
      <section className="api-bottom-popup new-drafts vertical-flex buy-fly">
        {!transactionInProgress && !myReferral && !noPasswordForm ? (
          <>
            {showWalletPopup ? (
              <>
                {blockTimeHour > 0 || blockTimeMin > 0 || blockTimeSec > 0 ? (
                  <div
                    style={{
                      marginTop: '100px',
                      position: 'relative',
                      height: '80%',
                    }}
                  >
                    <p
                      style={{
                        color: 'red',
                        fontFamily: 'Rajdhani-bold',
                        fontSize: '18px',
                        fontWeight: '400',
                      }}
                    >
                      {t('you temporarily blocked')}
                    </p>
                    <span className="secret-countdown" style={{ color: 'red' }}>
                      {blockTimeHour}h {blockTimeMin}m {blockTimeSec}s
                    </span>
                    {paymentMode === 'new-draft' && isMobile() ? (
                      <div
                        className="close-button-draftee"
                        style={{
                          position: 'absolute',
                          left: '45%',
                          bottom: '-70px',
                        }}
                        onClick={onClose}
                      >
                        {t('close')}
                      </div>
                    ) : (
                      <div
                        className="close-button-draftee"
                        style={{
                          position: 'absolute',
                          left: '45%',
                          bottom: '-70px',
                        }}
                        onClick={onClose}
                      >
                        {t('close')}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {sendTransOtpLoader ? (
                      <div
                        className="otp-loader"
                        style={{ marginTop: '200px' }}
                      >
                        <div className="spinner mt-10">
                          <div className="spinner"></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Formik
                          enableReinitialize={true}
                          initialValues={initialValues}
                          onSubmit={handleSubmit}
                          validationSchema={Yup.object().shape({
                            passphrase: Yup.string().required(
                              t('secret passphrase Required'),
                            ),
                          })}
                        >
                          {props => {
                            const {
                              dirty,
                              touched,
                              errors,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                            } = props
                            return (
                              <>
                                <form
                                  autoComplete="off"
                                  className={classnames(
                                    secretInputAttempts < 1 ? 'hidden' : '',
                                  )}
                                  onSubmit={handleSubmit}
                                >
                                  <div className="passphrase-container">
                                    <h2 className="wallet-heading mt-40 passphrase-heading w-none">
                                      {t(
                                        'enter your secret passphrase to unlock your wallet',
                                      )}
                                    </h2>
                                    <div className="internal-user-secret">
                                      <div className="dark">
                                        <label></label>
                                        <FormInput
                                          id="passphrase"
                                          type="password"
                                          placeholder={t('secret passphrase')}
                                          name="passphrase"
                                          handleChange={handleChange}
                                          onBlur={handleBlur}
                                        />
                                      </div>
                                      {errors.passphrase &&
                                        touched.passphrase && (
                                          <div className="input-feedback p-0">
                                            {errors.passphrase}
                                          </div>
                                        )}
                                      {showWalletPopup &&
                                      !isNftDetailFormVisible ? (
                                        <>
                                          <p className="page-text mt-40 mb-40">
                                            {t('please enter the OTP')}
                                            <br />
                                            {t('received on your')}
                                            <br />
                                            {t('registered E-mail ID.')}
                                          </p>
                                          <OtpInput
                                            value={otp}
                                            onChange={onChangeOtp}
                                            numInputs={6}
                                            separator={<span></span>}
                                            inputStyle="input-box otp"
                                            containerStyle="otp-wrapper"
                                            isInputNum
                                          />
                                          <>
                                            {sendTransOtpLoader ? (
                                              <p className="page-text mt-40">
                                                {t('sending')}...
                                              </p>
                                            ) : (
                                              <p className="page-text mt-40">
                                                {t('didn’t get the OTP?')}{' '}
                                                <span
                                                  onClick={() => {
                                                    dispatch(sendTransOtp())
                                                  }}
                                                  className="resend-link otp-resend"
                                                >
                                                  {' '}
                                                  {t('resend')}
                                                </span>
                                              </p>
                                            )}
                                          </>
                                        </>
                                      ) : null}
                                      <div
                                        className={classnames(
                                          showWalletPopup &&
                                            !isNftDetailFormVisible
                                            ? 'mt-20'
                                            : 'space-block mt-20',
                                        )}
                                      >
                                        <div
                                          className={classnames(
                                            'input-feedback fullWidth text-center',
                                            isTransactionError ||
                                              transferAmountError
                                              ? ''
                                              : 'hidden',
                                          )}
                                        >
                                          {isTransactionError
                                            .toLowerCase()
                                            .includes(
                                              'insufficient funds for gas',
                                            )
                                            ? 'Insufficient funds'
                                            : isTransactionError ||
                                              transferAmountError}
                                          {isTransactionError
                                            .toLowerCase()
                                            .includes('incorrect secret key') ||
                                          transferAmountError
                                            .toLowerCase()
                                            .includes('incorrect secret key') ||
                                          isTransactionError
                                            .toLowerCase()
                                            .includes('incorrect otp') ||
                                          transferAmountError
                                            .toLowerCase()
                                            .includes('incorrect otp') ? (
                                            <>
                                              <br />
                                              {t('you have')}{' '}
                                              {otpAttemptsLeft ||
                                                secretInputAttempts}{' '}
                                              {t('attempts left')}
                                            </>
                                          ) : null}
                                        </div>
                                      </div>
                                      <div
                                        className={classnames(
                                          'bottom-button-box',
                                          passphraseLoader ? 'h-0' : '',
                                        )}
                                      >
                                        <div className="passphrase-divider mb-20">
                                          <div
                                            className={classnames(
                                              'submit-wrapper',
                                              passphraseLoader ||
                                                isTransactionSuccess ||
                                                isnewRewardPercentageLoading ||
                                                isAddPayoutLoading ||
                                                DraftingPercentageLoading ||
                                                postKioskItemPaymentLoader
                                                ? 'hidden'
                                                : '',
                                            )}
                                          >
                                            <SubmitButton
                                              isDisabled={
                                                !dirty ||
                                                (otp.length < 6 &&
                                                  showWalletPopup &&
                                                  !isNftDetailFormVisible)
                                              }
                                              title={t('confirm')}
                                              className="mt-40 m-0auto"
                                              onPress={handleSubmit}
                                            />
                                            <div
                                              className="form-submit-btn btn-disabled mt-20 m-0auto"
                                              onClick={onClose}
                                            >
                                              {t('cancel')}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className={classnames(
                                          'spinner-wrapper purchase-spinner',
                                          passphraseLoader ||
                                            isnewRewardPercentageLoading ||
                                            isAddPayoutLoading ||
                                            DraftingPercentageLoading ||
                                            postKioskItemPaymentLoader
                                            ? ''
                                            : 'hidden',
                                        )}
                                      >
                                        <Spinner
                                          spinnerStatus={true}
                                          title={''}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </>
                            )
                          }}
                        </Formik>
                        <div
                          className={classNames(
                            'passphrase-container mt-80',
                            secretInputAttempts < 1 ? '' : 'hidden',
                          )}
                        >
                          <h2 className="wallet-heading passphrase-heading m-0">
                            {t('Your attempts were exhausted.')}
                          </h2>
                          <h2 className="wallet-heading passphrase-heading m-0">
                            {t('Please wait before you try again.')}
                          </h2>
                          <div className="secret-countdown">
                            {state.hours}h {state.minutes}m {state.seconds}s
                          </div>
                          {paymentMode === 'new-draft' && isMobile() ? (
                            <div
                              className="close-button-draftee"
                              onClick={onClose}
                            >
                              {t('close')}
                            </div>
                          ) : (
                            <div
                              className="close-button-draftee"
                              onClick={onClose}
                            >
                              {t('close')}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Formik
                  enableReinitialize={true}
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  validationSchema={Yup.object().shape({
                    passphrase: Yup.string().required(
                      t('secret passphrase Required'),
                    ),
                  })}
                >
                  {props => {
                    const {
                      dirty,
                      touched,
                      errors,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                    } = props
                    return (
                      <>
                        <form
                          autoComplete="off"
                          className={classnames(
                            secretInputAttempts < 1 ? 'hidden' : '',
                          )}
                          onSubmit={handleSubmit}
                        >
                          <div className="passphrase-container">
                            <h2 className="wallet-heading mt-40 passphrase-heading w-none">
                              {t(
                                'enter your secret passphrase to unlock your wallet',
                              )}
                            </h2>
                            <div className="internal-user-secret">
                              <div className="dark">
                                <label></label>
                                <FormInput
                                  id="passphrase"
                                  type="password"
                                  placeholder={t('secret passphrase')}
                                  name="passphrase"
                                  handleChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </div>
                              {errors.passphrase && touched.passphrase && (
                                <div className="input-feedback p-0">
                                  {errors.passphrase}
                                </div>
                              )}
                              {showWalletPopup && !isNftDetailFormVisible ? (
                                <>
                                  <p className="page-text mt-40 mb-40">
                                    {t('please enter the OTP')}
                                    <br />
                                    {t('received on your')}
                                    <br />
                                    {t('registered E-mail ID.')}
                                  </p>
                                  <OtpInput
                                    value={otp}
                                    onChange={onChangeOtp}
                                    numInputs={6}
                                    separator={<span></span>}
                                    inputStyle="input-box otp"
                                    containerStyle="otp-wrapper"
                                    isInputNum
                                  />
                                  <>
                                    {sendTransOtpLoader ? (
                                      <p className="page-text mt-40">
                                        {t('sending')}...
                                      </p>
                                    ) : (
                                      <p className="page-text mt-40">
                                        {t('didn’t get the OTP?')}{' '}
                                        <span
                                          onClick={() => {
                                            dispatch(sendTransOtp())
                                          }}
                                          className="resend-link otp-resend"
                                        >
                                          {' '}
                                          {t('resend')}
                                        </span>
                                      </p>
                                    )}
                                  </>
                                </>
                              ) : null}
                              <div
                                className={classnames(
                                  showWalletPopup && !isNftDetailFormVisible
                                    ? 'mt-20'
                                    : 'space-block mt-20',
                                )}
                              >
                                <div
                                  className={classnames(
                                    'input-feedback fullWidth text-center',
                                    isTransactionError ||
                                      transferAmountError ||
                                      buyInCurrencyTransactionError
                                      ? ''
                                      : 'hidden',
                                  )}
                                >
                                  {isTransactionError
                                    .toLowerCase()
                                    .includes('insufficient funds for gas')
                                    ? 'Insufficient funds'
                                    : isTransactionError || transferAmountError}
                                  {isTransactionError
                                    .toLowerCase()
                                    .includes('incorrect secret key') ||
                                  transferAmountError
                                    .toLowerCase()
                                    .includes('incorrect secret key') ||
                                  isTransactionError
                                    .toLowerCase()
                                    .includes('incorrect otp') ||
                                  transferAmountError
                                    .toLowerCase()
                                    .includes('incorrect otp') ||
                                  buyInCurrencyTransactionError ? (
                                    <>
                                      <br />
                                      <>
                                        {buyInCurrencyTransactionError ? (
                                          buyInCurrencyTransactionError
                                        ) : (
                                          <>
                                            {t('you have')}{' '}
                                            {otpAttemptsLeft ||
                                              secretInputAttempts}{' '}
                                            {t('attempts left')}
                                          </>
                                        )}
                                      </>
                                    </>
                                  ) : null}
                                </div>
                                {console.log({ buyInCurrencyTransactionError })}
                              </div>
                              <div
                                className={classnames(
                                  'bottom-button-box',
                                  passphraseLoader ? 'h-0' : '',
                                )}
                              >
                                <div className="passphrase-divider mb-20">
                                  <div
                                    className={classnames(
                                      'submit-wrapper',
                                      passphraseLoader ||
                                        isTransactionSuccess ||
                                        isnewRewardPercentageLoading ||
                                        isAddPayoutLoading ||
                                        DraftingPercentageLoading ||
                                        postKioskItemPaymentLoader ||
                                        postClaimFreeXpLoader
                                        ? 'hidden'
                                        : '',
                                    )}
                                  >
                                    <SubmitButton
                                      isDisabled={
                                        !dirty ||
                                        (otp.length < 6 &&
                                          showWalletPopup &&
                                          !isNftDetailFormVisible)
                                      }
                                      title={t('confirm')}
                                      className="mt-40 m-0auto"
                                      onPress={handleSubmit}
                                    />
                                    <div
                                      className="form-submit-btn btn-disabled mt-20 m-0auto"
                                      onClick={onClose}
                                    >
                                      {t('cancel')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={classnames(
                                  'spinner-wrapper purchase-spinner',
                                  passphraseLoader ||
                                    isnewRewardPercentageLoading ||
                                    isAddPayoutLoading ||
                                    DraftingPercentageLoading ||
                                    postKioskItemPaymentLoader ||
                                    postClaimFreeXpLoader
                                    ? ''
                                    : 'hidden',
                                )}
                              >
                                <Spinner spinnerStatus={true} title={''} />
                              </div>
                            </div>
                          </div>
                        </form>
                      </>
                    )
                  }}
                </Formik>
                <div
                  className={classNames(
                    'passphrase-container mt-80',
                    secretInputAttempts < 1 ? '' : 'hidden',
                  )}
                >
                  <h2 className="wallet-heading passphrase-heading m-0">
                    {t('Your attempts were exhausted.')}
                  </h2>
                  <h2 className="wallet-heading passphrase-heading m-0">
                    {t('Please wait before you try again.')}
                  </h2>
                  <div className="secret-countdown">
                    {state.hours}h {state.minutes}m {state.seconds}s
                  </div>
                  {paymentMode === 'new-draft' && isMobile() ? (
                    <div className="close-button-draftee" onClick={onClose}>
                      {t('close')}
                    </div>
                  ) : (
                    <div className="close-button-draftee" onClick={onClose}>
                      {t('close')}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : !transactionInProgress && postReferralPayoutLoader ? (
          <div
            style={{
              marginTop: '120px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        ) : postReferralPayoutError ? (
          <>
            <p style={{ marginTop: '120px', fontSize: '18px', color: 'red' }}>
              {postReferralPayoutError}
            </p>
            <div className="bottom-close">
              <div className="close-button-draftee" onClick={onClose}>
                {t('close')}
              </div>
            </div>
          </>
        ) : postReferralPayoutSuccess ? (
          <>
            <p
              style={{
                marginTop: '120px',
                fontSize: '18px',
                color: 'var(--primary-foreground-color)',
                padding: '0px 20px',
              }}
            >
              {postReferralPayoutSuccess}
            </p>
            <div className="bottom-close">
              <div className="close-button-draftee" onClick={onClose}>
                {t('close')}
              </div>
            </div>
          </>
        ) : (
          <div
            className={classNames(
              'purchase-submit-wrapper',
              'btn-purchase',
              'web3action-success mt-120',
            )}
          >
            <>
              <ImageComponent
                loading="lazy"
                src={
                  selectedThemeRedux === 'Gold'
                    ? WalletIconGold
                    : selectedThemeRedux === 'Ladies'
                    ? WalletIconLadies
                    : WalletIcon
                }
                alt="metamask-icon"
              />
              <div className="input-label approve-blockchain">&nbsp;</div>
            </>
            {console.log({ txnHash, txnConfirmResp })}
            <div className="check-container-txn">
              <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
              {((txnConfirmResp.length === 0 && txnHash) ||
                (txnConfirmResp.length === 0 && buyInCurrencyTxnHash) ||
                (txnConfirmResp.length === 0 && txnHashN) ||
                // (txnConfirmResp.length === 0 && sellInCurrencyTxnHash) ||
                (isTransferTxnHash && txnConfirmSuccess === false)) &&
              contractTxnStatus === '' ? (
                <div className={classNames('spinner check-spinner')}></div>
              ) : (
                <>
                  {(txnConfirmResp[0]?.haserror === 0 && txnHash) ||
                  (txnConfirmResp[0]?.haserror === 0 && txnHashN) ||
                  // (txnConfirmResp[0]?.haserror === 0 &&
                  //   sellInCurrencyTxnHash) ||
                  contractTxnStatus === 'true' ||
                  (isTransferTxnHash && txnConfirmSuccess === true) ||
                  txnConfirmSuccess ? (
                    <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                  ) : (
                    <CancelOutlinedIcon className="response-icon error-icon" />
                  )}
                </>
              )}
            </div>
            <span>{t('transaction sent')}</span>
            {txnConfirmResp.length > 0 ||
            isTransferTxnHash !== '' ||
            txnConfirmResp.message === 'Transaction failed' ||
            txnConfirmResp.message === 'Transaction success' ||
            ['true', 'false'].includes(contractTxnStatus) ||
            txnConfirmSuccess ? (
              <span
                style={{
                  fontSize: isMobile() ? '20px' : '17px',
                  margin: 'unset',
                }}
                className={classNames(
                  txnConfirmResp[0]?.haserror === 0 ||
                    txnConfirmSuccess ||
                    contractTxnStatus === 'true'
                    ? 'txn-confirm-success'
                    : 'txn-confirm-error',
                )}
              >
                {(!isTxnChecking && txnConfirmResp[0]?.haserror === 0) ||
                contractTxnStatus === 'true' ||
                txnConfirmResp.message === 'Transaction success' ||
                txnConfirmSuccess
                  ? t('transaction confirmed')
                  : (!isTxnChecking && txnConfirmResp[0]?.haserror === 1) ||
                    txnConfirmResp.message === 'Transaction failed' ||
                    contractTxnStatus === 'false'
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
            {txnHash && !isTransferTxnHash && !txnHashN ? (
              <a
                className="tx-link button-box"
                href={`${BASE_EXPLORE_URL}/tx/${txnHash}`}
                target="_blank"
              >
                {t('show transaction')}
              </a>
            ) : isTransferTxnHash && !txnHash && !txnHashN ? (
              <a
                className="tx-link button-box"
                href={`${BASE_EXPLORE_URL}/tx/${isTransferTxnHash}`}
                target="_blank"
              >
                {t('show transaction')}
              </a>
            ) : txnHashN && !isTransferTxnHash && !txnHash ? (
              <a
                className="tx-link button-box"
                href={`${BASE_EXPLORE_URL}/tx/${txnHashN}`}
                target="_blank"
              >
                {t('show transaction')}
              </a>
            ) : buyInCurrencyTxnHash ? (
              <a
                className="tx-link button-box"
                href={`${BASE_EXPLORE_URL}/tx/${buyInCurrencyTxnHash}`}
                target="_blank"
              >
                {t('show transaction')}
              </a>
            ) : sellInCurrencyTxnHash ? (
              <a
                className="tx-link button-box"
                href={`${BASE_EXPLORE_URL}/tx/${sellInCurrencyTxnHash}`}
                target="_blank"
              >
                {t('show transaction')}
              </a>
            ) : null}
            {paymentMode === 'new-draft' && isMobile() ? (
              <div className="close-button-draftee" onClick={onClose}>
                {t('close')}
              </div>
            ) : (
              <div className="bottom-close">
                <div
                  className="close-button-draftee"
                  onClick={closeBottomPopup}
                >
                  {t('close')}
                </div>
              </div>
            )}
          </div>
        )}
        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
      </section>
    </BottomPopup>
  )
}

export default ApiBottomPopup
