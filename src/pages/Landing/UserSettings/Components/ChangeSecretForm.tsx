import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { Formik } from 'formik'
import * as Yup from 'yup'
import classNames from 'classnames'
import FormInput from '@components/Form/FormInput'
import { PASSWORD_REGEX } from '@root/constants'
import SubmitButton from '@components/Button/SubmitButton'
import {
  changeSecret,
  handleChangeSecret,
  resetSendChangeSecretOtp,
  sendChangeSecretOtp,
} from '@root/apis/onboarding/authenticationSlice'
import toast from 'react-hot-toast'
import { encrypt, isMobile } from '@utils/helpers'

const initialValues = {
  otp: '',
  old_secret: '',
  new_secret: '',
  confirm_new_secret: '',
}
let countDown: any = null

const ChangeSecretForm = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [state, setState] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  const [isOtpDisabled, setIsOtpDisabled] = useState(true)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    changeSecretOtpLoading,
    changeSecretOtpResponse,
    changeSecretOtpAttempts,
    changeSecretLoading,
    changeSecretError,
    changeSecretSuccess,
    changeSecretDone,
    changeSecretTimeLeft,
  } = authenticationData

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const onSubmit = values => {
    const reqParams = {
      otp: values.otp,
      old_secret: encrypt(values.old_secret),
      new_secret: encrypt(values.new_secret),
    }
    dispatch(changeSecret(reqParams))
  }

  const handleSendOtp = () => {
    dispatch(sendChangeSecretOtp())
  }

  useEffect(() => {
    if (changeSecretOtpResponse === 'OTP Send') {
      setIsOtpDisabled(false)
      toast.success(t('otp sent successfully'))
    }
  }, [changeSecretOtpResponse])

  useEffect(() => {
    return () => {
      clearInterval(countDown)
    }
  }, [])

  useEffect(() => {
    if (changeSecretOtpAttempts < 1) {
      initCountDown()
      localStorage.setItem('secret_change_restricted', 'true')
    }
  }, [changeSecretOtpAttempts])

  useEffect(() => {
    if (changeSecretSuccess === 'Secret Updated') {
      toast.success(t('secret updated successfully'))
    }
  }, [changeSecretSuccess])

  const initCountDown = () => {
    const apiMinutes = changeSecretTimeLeft.split(':')
    const countDownDate =
      new Date().getTime() + (apiMinutes[1] || 60) * 60 * 1000

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
        dispatch(resetSendChangeSecretOtp())
        clearInterval(countDown)
        localStorage.removeItem('secret_change_restricted')
      }
    }, 1000)
  }

  const handleCloseModal = () => {
    dispatch(handleChangeSecret(false))
  }

  return (
    <section className="onboarding-container">
      {changeSecretOtpAttempts < 1 ? (
        <div
          className={classNames(
            'passphrase-container mt-80',
            changeSecretOtpAttempts < 1 ? '' : 'hidden',
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
          <div
            className="green-line-btn deposit-cancel"
            style={{
              position: 'absolute',
              bottom: isMobile() ? '12vh' : '5vh',
              left: '0px',
            }}
            onClick={handleCloseModal}
          >
            {t('close')}
          </div>
        </div>
      ) : (
        <div id="id01" className={classNames('login-form', 'change-secret')}>
          <h2 className="page-heading mt-40">{t('change secret')}</h2>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={async values => {
              onSubmit(values)
            }}
            validationSchema={Yup.object().shape({
              otp: Yup.string().required(t('OTP required')),
              old_secret: Yup.string().required(t('old secret required')),
              new_secret: Yup.string()
                .required(t('new secret required'))
                .min(8, t('secret is too short - should be 8 chars minimum'))
                .matches(
                  PASSWORD_REGEX,
                  t(
                    'must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
                  ),
                ),
              confirm_new_secret: Yup.string()
                .required(t('confirm secret Required'))
                .oneOf([Yup.ref('new_secret'), null], t('secrets must match')),
            })}
          >
            {props => {
              const {
                touched,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
              } = props
              return (
                <form autoComplete="off" onSubmit={handleSubmit}>
                  <div className="login-form-container">
                    <p className="check_sign_text">
                      {t('we will send a code')}
                    </p>
                    <div className="field-wrapper">
                      <div className="change-secret-otp-wrapper">
                        <div className="percentage_value_wrapper">
                          <input
                            className="new_percentage_value"
                            disabled={
                              isOtpDisabled ||
                              (changeSecretDone && !isOtpDisabled)
                            }
                            name="otp"
                            id="otp"
                            type="number"
                            placeholder={
                              !isOtpDisabled ? t('otp goes here') : ''
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <SubmitButton
                          title={t('send')}
                          onPress={handleSendOtp}
                          className="m-0"
                          noSubmit
                          rewardPerc={true}
                          isLoading={changeSecretOtpLoading}
                          isDisabled={changeSecretDone}
                        />
                      </div>
                      {errors.otp && touched.otp && (
                        <div className="input-feedback">{errors.otp}</div>
                      )}
                    </div>
                    <div className="field-wrapper">
                      <label>
                        <b>{t('your current secret')}</b>
                      </label>
                      <FormInput
                        id="old_secret"
                        type="password"
                        placeholder={t('current secret')}
                        name="old_secret"
                        handleChange={handleChange}
                        onBlur={handleBlur}
                        disabled={changeSecretDone}
                      />
                    </div>
                    <div className="field-wrapper mt-40">
                      <label>
                        <b>{t('enter new secret twice')}</b>
                      </label>
                      <FormInput
                        id="new_secret"
                        type="password"
                        placeholder={t('new secret')}
                        name="new_secret"
                        handleChange={handleChange}
                        onBlur={handleBlur}
                        disabled={changeSecretDone}
                      />
                      {errors.new_secret && touched.new_secret && (
                        <div className="input-feedback">
                          {errors.new_secret}
                        </div>
                      )}
                    </div>
                    <div className="field-wrapper">
                      <FormInput
                        id="confirm_new_secret"
                        type="password"
                        placeholder={t('confirm new secret')}
                        name="confirm_new_secret"
                        handleChange={handleChange}
                        onBlur={handleBlur}
                        disabled={changeSecretDone}
                      />
                      {errors.confirm_new_secret &&
                        touched.confirm_new_secret && (
                          <div className="input-feedback">
                            {errors.confirm_new_secret}
                          </div>
                        )}
                    </div>
                    {changeSecretError ? (
                      <>
                        <div
                          className="input-feedback text-center otp-error"
                          style={{
                            margin: 'unset',
                            width: '300px',
                            marginTop: '10px',
                          }}
                        >
                          {changeSecretError}
                        </div>
                        <div
                          className="input-feedback text-center otp-error"
                          style={{
                            margin: 'unset',
                            width: '300px',
                          }}
                        >
                          {changeSecretOtpAttempts > 0
                            ? `${t('you have')} ${changeSecretOtpAttempts} ${t(
                                'attempts left',
                              )}.`
                            : ''}
                        </div>
                      </>
                    ) : null}
                    {changeSecretDone ? (
                      <div
                        className="close-button-draftee"
                        style={{
                          position: 'absolute',
                          left: '45%',
                          bottom: '-70px',
                        }}
                        onClick={handleCloseModal}
                      >
                        {t('close')}
                      </div>
                    ) : (
                      <SubmitButton
                        isLoading={changeSecretLoading}
                        title={t('confirm')}
                        className="signup-btn mt-40 mb-40"
                        onPress={handleSubmit}
                        isDisabled={changeSecretDone}
                      />
                    )}
                  </div>
                </form>
              )
            }}
          </Formik>
        </div>
      )}
    </section>
  )
}

export default ChangeSecretForm
