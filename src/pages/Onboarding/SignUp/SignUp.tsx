import React, { useContext, useEffect, useRef, useState } from 'react'
import { Formik } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'
import { useDispatch, useSelector } from 'react-redux'
import {
  signUp,
  loginWithWallet,
  walletConnectCheck,
} from '@root/apis/onboarding/authenticationSlice'
import * as Yup from 'yup'
import MetamaskButton from '@components/Button/MetamaskButton'
import CoinbaseButton from '@components/Button/CoinbaseButton'
import TrustButton from '@components/Button/TrustButton'
import FormInput from '../../../components/Form/FormInput'
import SubmitButton from '@components/Button/SubmitButton'
import { RequestParams as OnboardingProps } from '@root/types'
import { RootState } from '@root/store/rootReducers'
import { ConnectContext } from '@root/WalletConnectProvider'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { PASSWORD_REGEX, RECAPTCHA_KEY } from '@root/constants'
import WalletConnectButton from '@components/Button/WalletConnectButton'
import { isMobile } from '@utils/helpers'
import { useLogin, usePrivy } from '@privy-io/react-auth'
import BottomPopup from '@components/Dialog/BottomPopup'

interface Props {
  onClose: () => void
}

const SignUp: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const url = window.location.href
  const parts = url.split('/')
  const [, lastPart, secondLastPart] = parts.slice(-3)
  const initialValues = {
    email: '',
    password: '',
    confirm_password: '',
    referral: lastPart === 'referral' ? secondLastPart : null,
  }
  const [loadCaptcha, setLoadCaptcha] = useState(false)
  const [isCaptchaError, setCaptchaError] = useState('')
  const loginId = localStorage.getItem('loginId')
  const loginInfo = localStorage.getItem('loginInfo')
  const privyToken = localStorage.getItem('privy:token')
  const [isFirstConnect, setIsFirstConnect] = useState(true)
  const [showPrivyModal, setShowPrivyModal] = useState(false)

  const { connectStatus, connect, verifyConnect } = useContext(ConnectContext)

  async function onSubmit(values: OnboardingProps) {
    setCaptchaError('')
    dispatch(signUp(values))
  }
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  useEffect(() => {
    // if (privyToken && !loginInfo) {
    //   localStorage.removeItem('privy:token')
    //   onClose()
    //   console.log('for test showSignupForm 132')
    // }
    // setTimeout(() => {
    //   setLoadCaptcha(true)
    // }, 1500)
  }, [])

  const { isSignupError, selectedThemeRedux } = authenticationData

  const handleConnectWallet = async wallet => {
    const verify = await verifyConnect(wallet)
    if (verify) {
      await connect(wallet)
    } else {
      console.log('showing_connect_confirm9', verify)
      if (wallet !== 'WalletConnect') {
        dispatch(
          walletConnectCheck({
            walletConnectConfirmPopUp: true,
            walletType: wallet,
          }),
        )
      }
    }
    if (isMobile()) {
      console.log('navigating 1 page back now')
      // setTimeout(() => {
      //   navigate(-1)
      // }, 1000)
    }
  }

  useEffect(() => {
    console.log({ connectStatus })
    setIsFirstConnect(false)
    if (!loginId && !isFirstConnect && connectStatus) {
      console.log('for test loginWithWallet 113')
      dispatch(loginWithWallet(null))
      if (localStorage.getItem('routeAfterLogin')) {
        const route = localStorage.getItem('routeAfterLogin')
        localStorage.removeItem('routeAfterLogin')
        route && navigate(route)
      }
      onClose()
    }
  }, [connectStatus])

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
  //---------------------------------  COMMENTED_TO_CONTINUE_WORKING_ON_REFERRAL_TASK ---------------------------------
  useEffect(() => {
    if (authenticated) {
      console.log('for test signup 11')
      onClose()
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
    setTimeout(() => {
      observer.observe(document.body, { childList: true, subtree: true })
    }, 1000)
    return () => {
      observer.disconnect()
    }
  }, [])

  //---------------------------------  COMMENTED_TO_CONTINUE_WORKING_ON_REFERRAL_TASK ---------------------------------

  return (
    <div id="id01" className="login-form">
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
        initialValues={initialValues}
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
          confirm_password: Yup.string()
            .required(t('confirm Password Required'))
            .oneOf([Yup.ref('password'), null], t('passwords must match')),
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
            <form autoComplete="off" className="mt-60" onSubmit={handleSubmit}>
              <span className="login-text-content">{t('new here?')}</span>
              <div className="login-form-container">
                {/* <div className="field-wrapper ">
                  <label>
                    <b>{t('email')}</b>
                  </label>
                  <FormInput
                    id="email"
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
                    <b>{t('choose Password')}</b>
                  </label>
                  <FormInput
                    id="password"
                    type="password"
                    placeholder={t('enter Password')}
                    name="password"
                    handleChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="field-wrapper">
                  <label>
                    <b>{t('confirm Password')}</b>
                  </label>
                  <FormInput
                    id="confirm_password"
                    type="password"
                    placeholder={t('enter Password')}
                    name="confirm_password"
                    handleChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.confirm_password && touched.confirm_password && (
                    <div className="input-feedback">
                      {errors.confirm_password}
                    </div>
                  )}
                </div> */}

                {loadCaptcha ? (
                  <>
                    <div className="captcha-wrapper">
                      <ReCAPTCHA
                        style={{ display: 'inline-block' }}
                        sitekey={RECAPTCHA_KEY}
                        size="invisible"
                      />
                    </div>
                    {isCaptchaError && (
                      <div className="input-feedback text-center">
                        {isCaptchaError}
                      </div>
                    )}
                  </>
                ) : null}
                {isSignupError && (
                  <div className="input-feedback text-center">
                    {isSignupError}
                  </div>
                )}
                <SubmitButton
                  // isDisabled={!isValid || !dirty}
                  isDisabled={false}
                  title={t('Create Account')}
                  className="signup-btn capitalize"
                  // onPress={handleSubmit}
                  onPress={handleLogin}
                />
                <div className={classNames('note-wrapper')}>
                  <span className="login-text-content">
                    {t('use own web3 wallet')}
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
                </div>
              </div>
            </form>
          )
        }}
      </Formik>
    </div>
  )
}

export default SignUp
