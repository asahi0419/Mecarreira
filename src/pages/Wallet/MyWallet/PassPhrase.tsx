import React, { useContext, useEffect, useState } from 'react'
import { Formik } from 'formik'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import classnames from 'classnames'
import * as Yup from 'yup'
import SubmitButton from '@components/Button/SubmitButton'
import FormInput from '@components/Form/FormInput'
import {
  resetSendMatics,
  restrictSecretInput,
  sendMatics,
  sendMaticsReset,
} from '@root/apis/onboarding/authenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { ConnectContext } from '@root/WalletConnectProvider'
import Spinner from '@components/Spinner'
import {
  getPurchaseReceipt,
  clearLastTransaction,
} from '@root/apis/purchase/purchaseSlice'
import classNames from 'classnames'
import { encrypt } from '@utils/helpers'
interface Props {
  onClose: () => void
  transactionData: any
}

const initialValues = {
  passphrase: '',
}
let interval: any = null
let timeout: any = null

const PassPhrase: React.FC<Props> = ({ onClose, transactionData }) => {
  const isRestrictedSecret = localStorage.getItem('secret_restricted')
  let countDown: any = null
  clearTimeout(timeout)
  const dispatch = useDispatch()
  const [state, setState] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const purchaseTransactionData = useSelector(
    (state: RootState) => state.purchases,
  )
  const { isPurchaseReceiptSuccess } = purchaseTransactionData

  const {
    passphraseLoader,
    isSendMaticSuccess,
    isSendingMatic,
    sendMaticTxnId,
    isSendMaticError,
    secretInputAttempts,
    selectedThemeRedux,
  } = authenticationData
  const { transactionStatus, initialize } = useContext(ConnectContext)

  const submitTransaction = async (values: any) => {
    const reqParams = {
      ...transactionData,
      user_secret: encrypt(values.passphrase),
    }
    if (!isSendingMatic) {
      dispatch(sendMatics(reqParams))
    }
  }

  const startTrackingTransaction = () => {
    dispatch(getPurchaseReceipt(sendMaticTxnId))
  }

  useEffect(() => {
    if (isRestrictedSecret === 'true') {
      dispatch(restrictSecretInput())
    }
    return () => {
      clearInterval(interval)
      clearInterval(countDown)
    }
  }, [])

  useEffect(() => {
    if (sendMaticTxnId) {
      const startTime = new Date().getTime()
      interval = setInterval(function () {
        if (new Date().getTime() - startTime > 60000) {
          clearInterval(interval)
          return
        }
        //do whatever here..
        startTrackingTransaction()
      }, 10000)
      startTrackingTransaction()
    }
  }, [isSendMaticSuccess, isSendMaticError, sendMaticTxnId])

  useEffect(() => {
    if (transactionStatus === 'success') {
      initialize()
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }, [transactionStatus])

  useEffect(() => {
    if (isPurchaseReceiptSuccess) {
      clearInterval(interval)
      timeout = setTimeout(() => {
        dispatch(clearLastTransaction())
        dispatch(resetSendMatics())
        onClose()
      }, 2000)
    }
  }, [isPurchaseReceiptSuccess])

  useEffect(() => {
    if (secretInputAttempts < 1) {
      initCountDown()
      localStorage.setItem('secret_restricted', 'true')
    }
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
        dispatch(sendMaticsReset())
        clearInterval(countDown)
        localStorage.removeItem('secret_restricted')
      }
    }, 1000)
  }

  return (
    <section className="wallet-container">
      <div className={classnames(isPurchaseReceiptSuccess ? 'hidden' : '')}>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={submitTransaction}
          validationSchema={Yup.object().shape({
            passphrase: Yup.string().required(t('secret passphrase Required')),
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
                      {t('enter your secret passphrase to unlock your wallet')}
                    </h2>
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
                    <div className="space-block">
                      <div
                        className={classnames(
                          'input-feedback text-center otp-error m-0',
                          isSendMaticError ? '' : 'hidden',
                        )}
                      >
                        {isSendMaticError}
                        {isSendMaticError
                          .toLowerCase()
                          .includes('incorrect secret key') ? (
                          <>
                            <br />
                            {t('you have')} {secretInputAttempts}{' '}
                            {t('attempts left')}
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="bottom-button-box">
                      <div className="passphrase-divider mb-20">
                        <div
                          className={classnames(
                            'submit-wrapper',
                            passphraseLoader || isSendMaticSuccess
                              ? 'hidden'
                              : '',
                          )}
                        >
                          <SubmitButton
                            isDisabled={!dirty}
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
                        <div
                          className={classnames(
                            'passphrase-progress-wrapper mt-40',
                            passphraseLoader && !isSendMaticSuccess
                              ? 'show'
                              : '',
                          )}
                        >
                          <div className="spinner"></div>
                        </div>
                        <div
                          className={classnames(
                            'spinner-wrapper purchase-spinner',
                            !passphraseLoader && isSendMaticSuccess
                              ? ''
                              : 'hidden',
                          )}
                        >
                          <Spinner
                            spinnerStatus={true}
                            title={t('awaiting Confirmation')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )
          }}
        </Formik>
      </div>
      <div
        className={classNames(
          'passphrase-container',
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
        <div className="green-line-btn deposit-cancel" onClick={onClose}>
          {t('close')}
        </div>
      </div>
      <div
        className={classNames(
          'mt-40 mb-40 transaction-success',
          isPurchaseReceiptSuccess ? '' : 'hidden',
        )}
      >
        <div className="check-container">
          <CheckCircleOutlinedIcon className="response-icon success-icon txn-success" />
        </div>
        <a href="#" className="resend-link no-click text-center">
          {t('transaction successful')}
        </a>
      </div>
    </section>
  )
}

export default PassPhrase
