import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input'
import classNames from 'classnames'
import SubmitButton from '@components/Button/SubmitButton'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import {
  postVerifyWhatsApp,
  postResendWhatsApp,
  postChangeWhatsAppNumber,
  resetChangeWhatsAppNumber,
} from '@root/apis/onboarding/authenticationSlice'
import { getPlayerData } from '@root/apis/playerCoins/playerCoinsSlice'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { isMobile } from '@utils/helpers'
import PhoneInput from 'react-phone-number-input'
import ImageComponent from '@components/ImageComponent'
import { width } from '@mui/system'
import EditIcon from '@components/Svg/EditIcon'

let timer: any = null
let countDown: any = null
interface Props {
  isOpen?: boolean
}
const OtpWhatsApp: React.FC<Props> = ({ isOpen }) => {
  const [otpNumber, setOtpNumber] = useState('')
  const [otpValidationError, setOtpValidationError] = useState('')
  const navigate = useNavigate()

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    isOtpLoginError,
    otpAttempts,
    isVerifyWhatsAppError,
    isResendWhatsAppError,
    postVerifyWhatsAppData,
    postResendWhatsAppData,
    resendWhatsAppLoader,
    changeWhatsAppLoader,
    isChangeWhatsAppError,
    postChangeWhatsAppData,
    isVerifyWhatsAppTimeLeft,
    isResendWhatsAppTimeLeft,
    selectedThemeRedux,
  } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    allPlayersData,
    isLoadingPlayerList,
    isVerifyingWhatsapp,
    allFanPlayersDataCheckStatus,
  } = playerCoinData

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
    if (allPlayersData[0]?.time_left?.length > 0) {
      getTime(allPlayersData[0]?.time_left)
    }
    if (isVerifyWhatsAppTimeLeft) {
      getTime(isVerifyWhatsAppTimeLeft)
    }
    if (isResendWhatsAppTimeLeft) {
      getTime(isResendWhatsAppTimeLeft)
    }
  }, [allPlayersData[0], isVerifyWhatsAppTimeLeft, isResendWhatsAppTimeLeft])

  const onChangeOtp = (otp: string) => {
    setOtpNumber(otp)
  }

  useEffect(() => {
    setOtpValidationError('')
  }, [otpNumber])
  const [whatsAppVerify, setWhatsAppVerifyLoading] = useState(false)

  async function handleLoginWithOtp() {
    if (otpNumber?.length !== 4) {
      setOtpValidationError(t('please enter a valid OTP'))
    } else if (otpNumber?.length === 4) {
      setOtpValidationError('')
      const req = {
        OTP: otpNumber,
        player_id: allPlayersData[0].id,
      }
      setWhatsAppVerifyLoading(true)
      dispatch(postVerifyWhatsApp(req))
    }
  }
  const launchMode = localStorage.getItem('launchMode')
  useEffect(() => {
    if (
      postVerifyWhatsAppData === 'Number Verified' &&
      !isMobile() &&
      launchMode !== 'Fan'
    ) {
      setOtpValidationError('')
      console.log('fetching_player_data25')
      dispatch(getPlayerData({ afterWhatsApp: true }))
    } else if (postVerifyWhatsAppData === 'Number Verified' && isMobile()) {
      console.log('fetching_player_data26')
      dispatch(getPlayerData({}))
      if (!localStorage.getItem('launchMode')) {
        if (allFanPlayersDataCheckStatus) {
          if (allFanPlayersDataCheckStatus === 2) {
            navigate('/app/fan-player-dashboard')
          } else if (allFanPlayersDataCheckStatus < 2) {
            navigate('/player-dashboard')
          }
        } else {
          navigate('/player-dashboard')
        }
      } else {
        if (localStorage.getItem('launchMode') === 'Fan') {
          navigate('/app/fan-player-dashboard')
        } else {
          navigate('/player-dashboard')
        }
      }
      // if (localStorage.getItem('launchMode') === 'Fan' || allFanPlayersDataCheckStatus === 2) {
      //   navigate('/app/fan-player-dashboard')
      // } else {
      //   navigate('/player-dashboard')
      // }
    }
  }, [postVerifyWhatsAppData])

  useEffect(() => {
    if (isMobile()) {
      console.log('fetching_player_data27')
      dispatch(getPlayerData({}))
    }
    return () => {
      clearInterval(countDown)
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setOpenEditNumber(false)
    }
  }, [isOpen])

  const [resend, setResend] = useState(false)
  const handleResend = () => {
    const req = {
      player_id: allPlayersData[0].id,
      language: localStorage.getItem('language'),
    }
    dispatch(postResendWhatsApp(req))
    if (!resendWhatsAppLoader) {
      setTime(30)
      setResend(true)
      setOtpValidationError('')
    }
  }
  const [time, setTime] = useState(30)
  const initSecondsTimer = () => {
    let hou = 0
    let sec = 30
    clearInterval(timer)
    setResend(false)
    timer = setInterval(function () {
      sec--
      setTime(sec)
      if (sec === 0) {
        if (hou > 0) {
          hou--
          sec = 60
          setTime(sec)
        }
        //sec = 60;
        if (hou === 0 && sec === 0) {
          //hou = 2;
          clearInterval(timer)
        }
      }
    }, 1000)
  }
  useEffect(() => {
    if (time > 0) {
      initSecondsTimer()
    }
  }, [])
  useEffect(() => {
    if (resend) {
      initSecondsTimer()
    }
  }, [resend])

  const [openEditNumber, setOpenEditNumber] = useState(false)
  const [editWhatsAppNumber, setEditWhatsAppNumber] = useState<any>('')
  const [editMobileValidationError, setEditMobileValidationError] = useState('')
  useEffect(() => {
    setEditMobileValidationError('')
  }, [editWhatsAppNumber])

  useEffect(() => {
    if (!openEditNumber) {
      initSecondsTimer()
    }
  }, [isLoadingPlayerList])

  useEffect(() => {
    if (!openEditNumber) {
      initSecondsTimer()
    }
  }, [openEditNumber])
  const handleEditNumber = () => {
    if (editWhatsAppNumber?.length < 6 || editWhatsAppNumber?.length > 16) {
      setEditMobileValidationError(t('phone number is not valid'))
    } else {
      const req = {
        player_id: allPlayersData[0].id,
        whastapp_number: editWhatsAppNumber,
        language: localStorage.getItem('language'),
      }
      setEditMobileValidationError('')
      dispatch(postChangeWhatsAppNumber(req))
    }
  }

  const onEditNumber = async () => {
    await dispatch(resetChangeWhatsAppNumber())
    setOpenEditNumber(true)
    setEditMobileValidationError('')
  }

  useEffect(() => {
    if (
      allPlayersData[0]?.playerstatusid?.id > 1 &&
      allPlayersData[0]?.whatsappverified === 1
    ) {
      setOpenEditNumber(true)
    }
  }, [allPlayersData[0]])

  useEffect(() => {
    if (
      postChangeWhatsAppData === 'WhatsApp Number Changed' &&
      allPlayersData[0]?.playerstatusid?.id < 2
    ) {
      setOpenEditNumber(false)
      console.log('fetching_player_data28')
      dispatch(getPlayerData({}))
    }
    if (
      postChangeWhatsAppData === 'WhatsApp Number Changed' &&
      allPlayersData[0]?.playerstatusid?.id > 1
    ) {
      setOpenEditNumber(false)
      console.log('fetching_player_data29')
      dispatch(getPlayerData({}))
    }
  }, [postChangeWhatsAppData])

  useEffect(() => {
    if (postResendWhatsAppData === 'OTP Successfully sent') {
      setOtpNumber('')
    }
  }, [postResendWhatsAppData])

  useEffect(() => {
    if (allPlayersData[0]?.whatsappverified === 1 || isVerifyWhatsAppError) {
      setWhatsAppVerifyLoading(false)
    }
  }, [allPlayersData[0], isVerifyWhatsAppError])

  return isVerifyingWhatsapp ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="loading-spinner"
        style={{ marginTop: isMobile() ? '372px' : '270px' }}
      >
        <div className="spinner"></div>
      </div>
    </div>
  ) : openEditNumber ? (
    <div
      className="enter-number-title"
      style={{ textAlign: 'center', overflow: 'auto' }}
    >
      <div className={classNames('otp-form')} style={{ padding: '0 30px' }}>
        <h2 className="page-heading">{t('enter new number')}</h2>
        <PhoneInput
          international
          name="mobile_no"
          value={editWhatsAppNumber}
          placeholder={t('enter new number')}
          onChange={e => setEditWhatsAppNumber(e)}
        />
        {changeWhatsAppLoader ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="loading-spinner" style={{ marginTop: '30px' }}>
              <div className="spinner"></div>
            </div>
          </div>
        ) : (
          <SubmitButton
            title={t('update number')}
            className="btn-done verify-btn update-number-btn"
            onPress={() => handleEditNumber()}
          />
        )}
        {allPlayersData[0]?.playerstatusid?.id > 1 ? (
          ''
        ) : (
          <p
            style={{
              textDecoration: 'underline',
              color: 'var(--secondary-foreground-color)',
              cursor: 'pointer',
            }}
            onClick={() => {
              setOpenEditNumber(false)
            }}
          >
            {t('back')}
          </p>
        )}
        {postChangeWhatsAppData && (
          <p className="page-text resend-link fullwidth mt-20">
            {postChangeWhatsAppData}
          </p>
        )}
        {isChangeWhatsAppError && (
          <div className="input-feedback text-center mt-20 width-unset">
            {isChangeWhatsAppError}
          </div>
        )}
        {editMobileValidationError && (
          <div className="input-feedback text-center mt-20 width-unset">
            {editMobileValidationError}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div
      className="enter-number-title"
      style={{
        textAlign: 'center',
        overflow: 'auto',
        height: '790px',
      }}
    >
      <div className={classNames('otp-form')}>
        <h2 className="page-heading">{t('enter OTP')}</h2>
        <p className="page-text mt-40 mb-40">
          {t('please enter the OTP')} {t('received on your')}
          <br />
          {t('registered WhatsApp.')} {isMobile() ? <br /> : ''}
          <span style={{ color: 'var(--secondary-foreground-color)' }}>
            {' '}
            {allPlayersData[0]?.mobilenumber
              ? allPlayersData[0]?.mobilenumber
              : ''}
          </span>{' '}
          <span
            style={{
              cursor: 'pointer',
            }}
            onClick={() => onEditNumber()}
          >
            <EditIcon width="13px" height="13px" />
          </span>
        </p>
        {blockTimeHour > 0 || blockTimeMin > 0 || blockTimeSec > 0 ? (
          <div style={{ marginTop: '40px' }}>
            <p
              style={{
                color: 'red',
                fontFamily: 'Rajdhani-bold',
                fontSize: '18px',
                fontWeight: '400',
              }}
            >
              {t('player temporarily blocked')}
            </p>
            <span className="secret-countdown" style={{ color: 'red' }}>
              {blockTimeHour}h {blockTimeMin}m {blockTimeSec}s
            </span>
          </div>
        ) : (
          <>
            <OtpInput
              value={otpNumber}
              onChange={onChangeOtp}
              numInputs={4}
              separator={<span></span>}
              inputStyle="input-box otp"
              containerStyle="otp-wrapper"
              isInputNum
            />
            {whatsAppVerify ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div className="loading-spinner" style={{ marginTop: '30px' }}>
                  <div className="spinner"></div>
                </div>
              </div>
            ) : (
              <div
                className="get-more-btn"
                onClick={() => handleLoginWithOtp()}
              >
                {t('verify')}
              </div>
            )}
            {isOtpLoginError ? (
              <div className="input-feedback text-center otp-error">
                {isOtpLoginError}
                {otpAttempts > 0
                  ? `. ${t('you have')} ${otpAttempts} ${t('attempts left')}.`
                  : ''}
              </div>
            ) : (
              <div className="input-feedback text-center otp-invalid-error mt-10">
                {otpValidationError}
              </div>
            )}
            {postVerifyWhatsAppData && (
              <p className="page-text resend-link fullwidth mt-20">
                {postVerifyWhatsAppData}
              </p>
            )}
            {isVerifyWhatsAppError && (
              <div className="input-feedback text-center otp-invalid-error mt-10">
                {isVerifyWhatsAppError}
              </div>
            )}
            {postResendWhatsAppData && (
              <p className="page-text resend-link fullwidth mt-20">
                {postResendWhatsAppData}
              </p>
            )}
            {isResendWhatsAppError && (
              <div className="input-feedback text-center otp-invalid-error mt-10">
                {isResendWhatsAppError}
              </div>
            )}
            {resendWhatsAppLoader ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              </div>
            ) : (
              <p className="page-text mt-40">
                {t('didn’t get the OTP?')}{' '}
                {time > 1 && !resendWhatsAppLoader ? (
                  <span className="secret-countdown">{time}s</span>
                ) : (
                  <span
                    className="resend-link otp-resend"
                    onClick={handleResend}
                  >
                    {t('resend')}
                  </span>
                )}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default OtpWhatsApp
