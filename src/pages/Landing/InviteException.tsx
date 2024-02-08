/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import AppLayout from '@components/Page/AppLayout'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { Input } from '@components/Form'
import classNames from 'classnames'
import ArrowDown from '@components/Svg/ArrowDown'
import ArrowUp from '@components/Svg/ArrowUp'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import TelegramIcon from '@mui/icons-material/Telegram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { SocialUrls } from '@root/constants'
import ImageComponent from '@components/ImageComponent'
import Discord from '@components/Svg/Discord'
import { asyncLocalStorage, isMobile } from '@utils/helpers'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LandingHeader from '@pages/NewLanding/Header'
import ReactCanvasConfetti from 'react-canvas-confetti'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import {
  exportKeyReset,
  linkUserInviteCode,
  resetSendChangeSecretOtp,
  resetWallet,
  verifyInviteCode,
  logout as emailLogout,
  toggleInvitePopup,
  loginWithWallet,
} from '@root/apis/onboarding/authenticationSlice'
import {
  checkPlayerStatus,
  resetCoinLaunch,
  resetPlayerData,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { usePrivy } from '@privy-io/react-auth'
import { ConnectContext } from '@root/WalletConnectProvider'
import TabGroup from '@components/Page/TabGroup'

const InviteException: React.FC = () => {
  const canvasStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  } as React.CSSProperties
  const { t } = useTranslation()
  const [isEarlyAccess, setIsEarlyAccess] = useState(true)
  const [defaultInviteCode, setDefaultInviteCode] = useState('')
  const { ready, authenticated, user, logout } = usePrivy()
  const { initialConnect, disconnect, checkChainId, loggedInAddress } =
    useContext(ConnectContext)
  useEffect(() => {
    window.scrollTo(0, 0)
    if (window.location.pathname.includes('invite')) {
      try {
        const referralId = window.location?.pathname?.split('/')?.pop()
        setDefaultInviteCode(referralId)
        dispatch(checkPlayerStatus())
        setTimeout(() => {
          dispatch(
            verifyInviteCode({
              referral: referralId,
              code_type: 1,
            }),
          )
        }, 1000)
      } catch (error) {
        console.log('inviteerr--', error)
      }
    }
    // if (localStorage.getItem('invite_code')) {
    //   setDefaultInviteCode(localStorage.getItem('invite_code'))
    //   dispatch(
    //     verifyInviteCode({
    //       referral: localStorage.getItem('invite_code'),
    //     }),
    //   )
    // }
  }, [])

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const dispatch = useDispatch()

  const {
    isInviteCodeVerifying,
    verifyInviteCodeSuccessData,
    linkInviteLoading,
    linkInviteError,
    linkInviteSuccessData,
    isFireShownOnInviteLinkSuccess,
    QualificationSettingData,
    externalWalletSuccess,
  } = authenticationData

  const refAnimationInstance1 = useRef<any>(null)

  const getInstance = useCallback(instance => {
    refAnimationInstance1.current = instance
  }, [])

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance1.current &&
      refAnimationInstance1.current({
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
    if (linkInviteSuccessData) {
      localStorage.removeItem('invite_code')
      // setTimeout(() => {
      //   fire()
      // }, 5000)
      if (linkInviteSuccessData && isFireShownOnInviteLinkSuccess) {
        // fire()
      }
    }
  }, [linkInviteSuccessData, isFireShownOnInviteLinkSuccess])

  const getTranslation = (text: string) => {
    const translation = t(text)
    if (translation === text) {
      return text
    } else {
      return translation
    }
  }

  const handleSubscribe = (values: any) => {
    console.log({
      externalWalletSuccess,
      locWallet: localStorage.getItem('wallet'),
    })
    if (!externalWalletSuccess && localStorage.getItem('wallet')) {
      dispatch(loginWithWallet(null))
    }
    dispatch(linkUserInviteCode({ referral: values?.inviteCode }))
  }

  const handleOpenUrl = (social: string) => {
    if (social === 'twitter') {
      window.open(SocialUrls.twitter)
    } else if (social === 'discord') {
      window.open(SocialUrls.discord)
    } else if (social === 'instagram') {
      window.open(SocialUrls.instagram)
    } else if (social === 'youtube') {
      window.open(SocialUrls.youtubeEn)
    } else if (social === 'tiktok') {
      window.open(SocialUrls.tiktok)
    } else if (social === 'telegram') {
      window.open(SocialUrls.telegram)
    }
  }

  const getVerificationStatusMessage = () => {
    if (isInviteCodeVerifying) {
      return { msg: t('verifying'), flag: '' }
    } else if (
      verifyInviteCodeSuccessData === true ||
      verifyInviteCodeSuccessData === 'true'
    ) {
      return { msg: t('valid code'), flag: 'invite-success' }
    } else if (
      verifyInviteCodeSuccessData === false ||
      verifyInviteCodeSuccessData === 'false'
    ) {
      return { msg: t('invalid code'), flag: 'invite-error' }
    }
    return {}
  }

  const handleLogout = () => {
    dispatch(toggleInvitePopup(false))
    localStorage.removeItem('ISGOLIVECLICKED')
    localStorage.removeItem('secret_restricted')
    localStorage.removeItem('invite_code')
    localStorage.removeItem('secret_change_restricted')
    if (authenticated || localStorage.getItem('wallet') === 'Privy') {
      console.log('logoutTest1--', {
        l1: localStorage.getItem('wallet'),
        authenticated,
      })
      logout()
    }
    localStorage.removeItem('wallet')
    disconnect()
    dispatch(resetPlayerData())
    dispatch(exportKeyReset())
    localStorage.removeItem('ISLAUNCHCLICKED')
    asyncLocalStorage.getItem('accessToken').then(token => {
      const reqParams = {
        refresh_token: token,
      }
      dispatch(resetCoinLaunch())
      dispatch(resetPlayerData())
      dispatch(resetWallet())
      dispatch(resetSendChangeSecretOtp())
      dispatch(
        emailLogout({ reqParams, location: 'inviteException.tsx_line245' }),
      )
      localStorage.removeItem('userWalletAddress')
      if (location.pathname !== '/') {
        setTimeout(() => {
          location.pathname = '/'
          // navigate('/')
        }, 1000)
      }
    })
    if (authenticated) {
      console.log('logoutTest2--', { authenticated })
      logout()
    }
  }

  const handleClose = () => {
    dispatch(toggleInvitePopup(false))
  }

  return (
    <>
      {/* <LandingHeader /> */}
      <div className="fullwidth">
        <TabGroup
          defaultTab={'invitation'}
          tabSet={['invitation']}
          tabClassName="wallet-tab"
        />
      </div>
      <div
        className={classNames(
          isMobile()
            ? `purchase-container-mobile fullwidth overflow-none`
            : 'purchase-container',
          linkInviteSuccessData
            ? 'staking-container mobile-link-success-wrapper'
            : '',
        )}
      >
        {linkInviteSuccessData && QualificationSettingData === 0 ? (
          <>
            <h2
              className="text-center"
              style={{ margin: isMobile() ? '45px auto auto auto' : '' }}
            >
              <span
                className={classNames(
                  'new-draft-title eth-address p-0',
                  'success',
                )}
                style={{ wordBreak: 'unset', textTransform: 'none' }}
              >
                {t('thank you')}
                <br />
                {t('you will get automatic access')}
              </span>
            </h2>
            <ReactCanvasConfetti
              refConfetti={getInstance}
              style={canvasStyles}
            />
            <div
              className="deposit-cancel log-out text-center"
              onClick={handleClose}
              style={{ bottom: '80px' }}
            >
              {t('close')}
            </div>
          </>
        ) : (
          <>
            <div className="newsletter-wrapper invite-prompt">
              <span className="blog-title bottom-title ct-h1 d-none">
                {t('don’t miss out')}
              </span>
              <div className="bottom-caption-wrapper">
                <span
                  className="blog-content bottom-content pg-lg text-left"
                  style={{ fontSize: '20px' }}
                >
                  {t('we_are_in_beta_phase')}
                </span>
              </div>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  inviteCode: defaultInviteCode,
                }}
                onSubmit={async values => {
                  handleSubscribe(values)
                }}
                validationSchema={Yup.object().shape({
                  inviteCode: Yup.string()
                    .required(t('required'))
                    .min(8, t('invalid code'))
                    .max(8, t('invalid code')),
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
                  } = props
                  return (
                    <form
                      onSubmit={handleSubmit}
                      autoComplete={'off'}
                      className="loop-stay-form"
                    >
                      <div className="balance-card">
                        <div
                          className="field-wrapper mt-10"
                          style={{ width: '100%' }}
                        >
                          <div className="input-label mb-10">
                            {t('enter invitation code')}
                          </div>
                          <div
                            className="textinput-wrapper"
                            style={{ width: '100%' }}
                          >
                            <Input
                              allowAlphaNumeric
                              id="email_address"
                              name="inviteCode"
                              type="text"
                              maxLength={8}
                              value={values.inviteCode}
                              placeholder={t('invitation code')}
                              // onChange={handleChange}
                              onChange={(event: any) => {
                                handleChange(event)
                                if (event.target.value.length === 8) {
                                  dispatch(
                                    verifyInviteCode({
                                      referral: event.target.value,
                                      code_type: 1,
                                    }),
                                  )
                                }
                              }}
                              onBlur={handleBlur}
                            />
                          </div>
                          <div className="invite-validation-wrapper">
                            <div style={{ flex: 1 }}>
                              {errors.inviteCode && touched.inviteCode && (
                                <div className="input-feedback">
                                  {errors.inviteCode}
                                </div>
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              {values.inviteCode.length === 8 ? (
                                <div
                                  className={classNames(
                                    'code-verification-status',
                                    getVerificationStatusMessage()?.flag,
                                  )}
                                >
                                  <div className="ms-2 me-auto">
                                    {getVerificationStatusMessage()?.msg}
                                  </div>
                                  {isInviteCodeVerifying ? (
                                    <div
                                      className={classNames(
                                        'spinner size-small',
                                      )}
                                    ></div>
                                  ) : verifyInviteCodeSuccessData === true ||
                                    verifyInviteCodeSuccessData === 'true' ? (
                                    <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                                  ) : verifyInviteCodeSuccessData === false ||
                                    verifyInviteCodeSuccessData === 'false' ? (
                                    <CancelOutlinedIcon className="response-icon error-icon" />
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={classNames(
                          'purchase-submit-wrapper',
                          'early-access-container',
                          'mt-0',
                        )}
                      >
                        <div className="accordion">
                          <div className="item">
                            <div
                              className="title"
                              onClick={() => setIsEarlyAccess(!isEarlyAccess)}
                            >
                              <div className="early-access-title">
                                {t('dont have invite code')}
                              </div>
                              {isEarlyAccess ? (
                                <ArrowUp customFill="#b08d10" />
                              ) : (
                                <ArrowDown customFill="#b08d10" />
                              )}
                            </div>
                            <div
                              className={
                                isEarlyAccess ? 'content show' : 'content'
                              }
                            >
                              <div className="methods-heading mt-20">
                                {t('visit our socials')}
                              </div>
                              <div className="social-group">
                                <InstagramIcon
                                  className="social-icons"
                                  onClick={() => handleOpenUrl('instagram')}
                                />
                                <TwitterIcon
                                  className="social-icons"
                                  onClick={() => handleOpenUrl('twitter')}
                                />
                                <YouTubeIcon
                                  className="social-icons"
                                  onClick={() => handleOpenUrl('youtube')}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {false ? (
                        <span className="button-box-loading">
                          <div className="loading-spinner">
                            <div className="spinner"></div>
                          </div>
                        </span>
                      ) : (
                        <>
                          <span className="button-line newsletter-submit fullwidth">
                            {linkInviteLoading ? (
                              <div
                                className={classNames('spinner', 'mt-20')}
                              ></div>
                            ) : (
                              <div
                                className={classNames(
                                  'button-box submit-btn-box',
                                  'fullwidth',
                                  errors.inviteCode ||
                                    values.inviteCode.length < 8 ||
                                    [false, 'false'].includes(
                                      verifyInviteCodeSuccessData,
                                    )
                                    ? 'purchase-btn-inactive'
                                    : verifyInviteCodeSuccessData
                                    ? 'button-box-active'
                                    : '',
                                )}
                                onClick={handleSubmit}
                              >
                                {t('access')}
                              </div>
                            )}
                          </span>
                        </>
                      )}
                      {linkInviteError && (
                        <div className="input-feedback text-center">
                          {linkInviteError}
                        </div>
                      )}
                      {/* {linkInviteSuccessData && (
                    <div
                      className="input-feedback text-center"
                      style={{ color: '#6bc909' }}
                    >
                      {linkInviteSuccessData?.message}
                    </div>
                  )} */}
                      {/* <div
                    className="deposit-cancel log-out text-center"
                    onClick={handleLogout}
                  >
                    {t('log out')}
                  </div> */}
                      <div style={{ height: '10px' }}></div>
                    </form>
                  )
                }}
              </Formik>
            </div>
            <div
              className="deposit-cancel log-out text-center"
              onClick={handleLogout}
            >
              {t('log out')}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default React.memo(InviteException)
