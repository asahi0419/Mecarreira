import React, { useContext, useEffect, useState, useRef } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import OtpInput from 'react-otp-input'
import classNames from 'classnames'
import MetamaskButton from '@components/Button/MetamaskButton'
import CoinbaseButton from '@components/Button/CoinbaseButton'
import TrustButton from '@components/Button/TrustButton'
import FormInput from '../../../components/Form/FormInput'
import { RequestParams as OnboardingProps } from '@root/types'
import SubmitButton from '@components/Button/SubmitButton'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import { ConnectContext } from '@root/WalletConnectProvider'
import {
  login,
  loginReset,
  loginWithWallet,
  loginWithOtp,
  resetSentEmailVerification,
  resetOtp,
  setActiveTab,
  resendEmail,
  resendOtp,
  resetResendOtp,
  showSignupForm,
  walletConnectCheck,
} from '@root/apis/onboarding/authenticationSlice'
import { isNumeric } from '@utils/helpers'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { isMobile } from '@utils/helpers'
import WalletConnectButton from '@components/Button/WalletConnectButton'
import { PASSWORD_REGEX } from '@root/constants'
import { useLogin, usePrivy } from '@privy-io/react-auth'
import BottomPopup from '@components/Dialog/BottomPopup'

interface Props {
  getSubmit?: any //(v?: boolean) => void
  handleLinkClick?: any
}

const Login: React.FC<Props> = ({ getSubmit, handleLinkClick }) => {
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    resendOtpLoading,
    isOtpSent,
    isLoginError,
    isOtpLoginError,
    otpAttempts,
    isOtpLoginSuccess,
    isEmailResent,
    resendOtpSuccess,
    selectedThemeRedux,
    setLoginEmail,
    isSignupFormVisible,
    isForceShowPopupSelected,
  } = authenticationData
  const [isLoading, setLoading] = useState(false)
  const [otpNumber, setOtpNumber] = useState('')
  const [otpValidationError, setOtpValidationError] = useState('')
  const [state, setState] = useState({
    email: setLoginEmail || '',
    password: '',
  })
  const { connectStatus, connect, verifyConnect } = useContext(ConnectContext)
  const navigate = useNavigate()
  const updateState = (data: any) => setState(state => ({ ...state, ...data }))
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const loginId = localStorage.getItem('loginId')
  const loginInfo = localStorage.getItem('loginInfo')
  const privyToken = localStorage.getItem('privy:token')
  const [isFirstConnect, setIsFirstConnect] = useState(true)
  const [showPrivyModal, setShowPrivyModal] = useState(false)

  useEffect(() => {
    if (isOtpLoginSuccess) {
      dispatch(resetSentEmailVerification())
      dispatch(resetOtp())
      setTimeout(() => {
        if (isMobile()) {
          if (localStorage.getItem('routeAfterLogin')) {
            const route = localStorage.getItem('routeAfterLogin')
            localStorage.removeItem('routeAfterLogin')
            route && navigate(route)
          } else {
            getSubmit(true)
            console.log('for test showSignupForm 121')
          }
        } else {
          getSubmit(true)
          console.log('for test showSignupForm 122')
        }
      }, 1000)
    }
  }, [isOtpLoginSuccess])

  const handleOtpResend = (event: any) => {
    event.preventDefault()
    const reqParams = {
      email: state.email,
    }
    dispatch(resendOtp(reqParams))
  }

  useEffect(() => {
    // if (privyToken && !loginInfo) {
    //   localStorage.removeItem('privy:token')
    //   if (!isForceShowPopupSelected) {
    //     getSubmit(true)
    //   }
    //   console.log('for test showSignupForm 131', isSignupFormVisible)
    // }
    return clearForm()
  }, [])

  const clearForm = () => {
    setLoading(false)
    setOtpNumber('')
    dispatch(loginReset())
    dispatch(resetResendOtp())
  }

  async function onSubmit(values: OnboardingProps) {
    setOtpValidationError('')
    updateState({
      email: values.email,
      password: values.password,
    })
    dispatch(setActiveTab('login'))
    dispatch(login(values))
  }

  async function handleLoginWithOtp() {
    if (!isOtpLoginSuccess) {
      const reqParams = {
        email: state.email,
        password: state.password,
        otp: otpNumber,
      }
      if (otpNumber.length === 6 && isNumeric(otpNumber)) {
        await dispatch(loginWithOtp(reqParams))
      } else {
        setOtpValidationError(t('please enter a valid OTP'))
      }
    } else {
      dispatch(resetSentEmailVerification())
      setTimeout(() => {
        getSubmit(true)
        console.log('for test showSignupForm 123')
      }, 1000)
    }
  }

  const onChangeOtp = (otp: string) => {
    setOtpNumber(otp)
  }

  const cancelOtpLogin = () => {
    dispatch(loginReset())
    clearForm()
  }

  const handleConnectWallet = async wallet => {
    const verify = await verifyConnect(wallet)
    if (verify) {
      await connect(wallet)
    } else {
      console.log('showing_connect_confirm8')
      dispatch(
        walletConnectCheck({
          walletConnectConfirmPopUp: true,
          walletType: wallet,
        }),
      )
    }
    if (isMobile()) {
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    }
  }

  const showSignupPopup = useSelector(
    (state: RootState) => state.authentication.isSignupFormVisible,
  )

  useEffect(() => {
    setIsFirstConnect(false)
    if (!isMobile() && showSignupPopup && connectStatus) {
      console.log('for test showSignupForm 200')
      dispatch(showSignupForm())
    }
    if (!loginId && !isFirstConnect && connectStatus) {
      console.log('for test loginWithWallet 112')
      dispatch(loginWithWallet(null))
      if (localStorage.getItem('routeAfterLogin')) {
        const route = localStorage.getItem('routeAfterLogin')
        localStorage.removeItem('routeAfterLogin')
        route && navigate(route)
      }
    }
  }, [connectStatus])

  const handleResendLink = async (evt: any) => {
    evt.preventDefault()
    const reqParams = {
      email: state.email,
    }
    dispatch(resendEmail(reqParams))
  }

  const { ready, authenticated, createWallet } = usePrivy()

  // Wait until the Privy client is ready before taking any actions
  // if (!ready) {
  //   return null
  // }

  const { login } = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      console.log('for test useLogin', user, isNewUser, wasAlreadyAuthenticated)
      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounted
      createWallet()
    },
    onError: error => {
      console.log('for test useLogin', error)
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  })

  const handleLogin = () => {
    if (!isMobile() && ready) {
      setShowPrivyModal(true)
    }
    login()
  }

  useEffect(() => {
    if (authenticated) {
      getSubmit(true)
      console.log('for test showSignupForm 124')
    }
  }, [authenticated])

  const privyDialogRef = useRef(null)
  useEffect(() => {
    const handleMutations = mutationsList => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
          const privyDialog = document.getElementById('privy-dialog')
          if (privyDialog) {
            privyDialogRef.current = privyDialog
          }
          const privyDialogExist = privyDialogRef.current
          if (privyDialogExist) {
            if (!document.body.contains(privyDialogExist)) {
              setShowPrivyModal(false)
            }
          }
        }
      })
    }
    const observer = new MutationObserver(handleMutations)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div
        id="id01"
        className={classNames('login-form', isOtpSent ? 'hide' : '')}
      >
        <BottomPopup mode={'wallet'} noAnimation={true} isOpen={showPrivyModal}>
          {/* <div
            className={classNames(
              'green-line-btn',
              isMobile() ? 'close-button-wert' : 'close-button',
            )}
            onClick={() => {
              setShowPrivyModal(false)
            }}
          >
            {t('close')}
          </div> */}
        </BottomPopup>
        <Formik
          enableReinitialize={true}
          initialValues={{
            email: setLoginEmail || '',
            password: '',
          }}
          onSubmit={async values => {
            onSubmit(values)
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email(t('invalid email'))
              .required(t('email Required')),
            password: Yup.string()
              .required(t('password Required'))
              .min(8, t('password is too short - should be 8 chars minimum'))
              .matches(
                PASSWORD_REGEX,
                t(
                  'must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
                ),
              ),
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
              isValid,
              dirty,
            } = props
            return (
              <form
                autoComplete="off"
                onSubmit={handleSubmit}
                className="mt-60"
              >
                <span className="login-text-content">{t('account login')}</span>
                <div className="login-form-container">
                  {/* <div className="field-wrapper ">
                    <label>
                      <b>{t('email')}</b>
                    </label>
                    <FormInput
                      id="user_email"
                      type="text"
                      placeholder={t('enter Email')}
                      name="email"
                      value={values.email}
                      handleChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && touched.email && (
                      <div className="input-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="field-wrapper">
                    <label>
                      <b>{t('password')}</b>
                    </label>
                    <FormInput
                      id="user_password"
                      type="password"
                      placeholder={t('enter Password')}
                      name="password"
                      value={values.password}
                      handleChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && touched.password && (
                      <div className="input-feedback">{errors.password}</div>
                    )}
                  </div>
                  {isLoginError && (
                    <>
                      <div
                        className={classNames(
                          'input-feedback text-center mt-20',
                          isMobile() ? 'fullwidth' : '',
                        )}
                      >
                        {isLoginError}
                      </div>
                      {isLoginError === 'Email is not verified' ? (
                        <>
                          {isEmailResent ? (
                            <a
                              href="#"
                              className="resend-link no-click sent-success"
                            >
                              {isEmailResent}
                            </a>
                          ) : (
                            <p className="page-text semibold resend-verification mt-20 p-0">
                              {t('didn’t get the verification email?') + ' '}
                              <a
                                href="#"
                                className="resend-link"
                                onClick={handleResendLink}
                              >
                                {t('resend')}
                              </a>
                            </p>
                          )}
                        </>
                      ) : null}
                    </>
                  )} */}
                  <SubmitButton
                    isLoading={isLoading}
                    // isDisabled={!isValid || !dirty}
                    isDisabled={false}
                    title={t('Login')}
                    className="signup-btn"
                    onPress={handleLogin}
                  />
                  <div className={classNames('note-wrapper')}>
                    <span className="login-text-content">
                      {t('web3 login')}
                    </span>
                    <WalletConnectButton
                      onPress={() => handleConnectWallet('WalletConnect')}
                    />
                    <MetamaskButton
                      onPress={() => handleConnectWallet('Metamask')}
                    />
                    <CoinbaseButton
                      onPress={() => handleConnectWallet('Coinbase')}
                    />
                    <TrustButton onPress={() => handleConnectWallet('Trust')} />
                    {/* <p className="page-text font-16">
                      <a
                        href="#"
                        className="resend-link"
                        onClick={handleLinkClick}
                      >
                        {t('forgot Password?')}
                      </a>
                    </p> */}
                  </div>
                </div>
              </form>
            )
          }}
        </Formik>
      </div>
      <div
        className={classNames(
          'otp-form',
          'login-otp',
          isOtpSent ? 'show' : 'hide',
        )}
      >
        <h2 className="page-heading">{t('enter OTP')}</h2>
        <p className="page-text mt-40 mb-40">
          {t('please enter the OTP')}
          <br />
          {t('received on your')}
          <br />
          {t('registered E-mail ID.')}
        </p>
        <OtpInput
          value={otpNumber}
          onChange={onChangeOtp}
          numInputs={6}
          separator={<span></span>}
          inputStyle="input-box otp"
          containerStyle="otp-wrapper"
          isInputNum
        />
        {isOtpLoginError ? (
          <div className="input-feedback text-center otp-error">
            {isOtpLoginError}
            {otpAttempts > 0
              ? `. ${t('you have')} ${otpAttempts} ${t('attempts left')}.`
              : ''}
          </div>
        ) : (
          <div className="input-feedback text-center otp-invalid-error">
            {otpValidationError}
          </div>
        )}
        {isOtpLoginSuccess && (
          <p className="page-text resend-link fullwidth mt-20">
            {isOtpLoginSuccess}
          </p>
        )}
        <SubmitButton
          isDisabled={otpAttempts < 1}
          title={t('done')}
          className="btn-done verify-btn mt-40"
          onPress={() => handleLoginWithOtp()}
        />
        {otpAttempts < 1 && (
          <p className="page-text mt-40">
            <a href="#" className="resend-link" onClick={cancelOtpLogin}>
              {t('back to Login')}
            </a>
          </p>
        )}
        {resendOtpLoading ? (
          <div className="otp-loader">
            <div className="spinner mt-10">
              <div className="spinner"></div>
            </div>
          </div>
        ) : (
          <>
            {resendOtpSuccess ? (
              <p className="page-text mt-40">{resendOtpSuccess}</p>
            ) : (
              <p className="page-text mt-40">
                {t('didn’t get the OTP?')}{' '}
                <span
                  onClick={handleOtpResend}
                  className="resend-link otp-resend"
                >
                  {' '}
                  {t('resend')}
                </span>
              </p>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Login
