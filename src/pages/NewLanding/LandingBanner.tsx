import Socials from '@components/Page/Navigation/SocialGroup'
import React, { useState, useEffect } from 'react'
import { isMobile } from '@utils/helpers'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import RecordIcon from '@assets/icons/icon/record.png'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import Spinner from '@components/Spinner'

interface Props {
  onClickSubmit: () => void
  onRequestPlayerAccount: () => void
  scrollLoader: boolean
}

const LandingBanner: React.FC<Props> = ({
  onClickSubmit,
  onRequestPlayerAccount,
  scrollLoader,
}) => {
  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    appGoLiveTimestamp,
    genesisGoLiveTimestamp,
    QualificationSettingData,
  } = authenticationData

  const { t } = useTranslation()

  const navigate = useNavigate()
  let countDown: any = null

  const [state, setState] = useState({
    day: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  const [countDownEnd, setCountDownEnd] = useState(false)
  const [loadingTimer, setloadingTimer] = useState(true)

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const initCountDown = goLiveTimestamp => {
    countDown = setInterval(function () {
      const countDownDate = new Date(goLiveTimestamp * 1000).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now
      const day = ~~(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (distance < 0) {
        clearInterval(countDown)
        updateState({
          day: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        })
        setCountDownEnd(true)
      } else {
        updateState({
          day,
          hours,
          minutes,
          seconds,
        })
      }
    }, 1000)
  }

  useEffect(() => {
    // try {
    //   document.getElementById('backgroundVideo')?.play()
    // } catch (err) {
    //   alert(err)
    // }
  }, [])

  useEffect(() => {
    if (appGoLiveTimestamp > 0) {
      initCountDown(appGoLiveTimestamp)

      const countDownDate = new Date(appGoLiveTimestamp * 1000).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now

      if (distance < 0) {
        setCountDownEnd(true)
      }

      setloadingTimer(false)
    } else if (genesisGoLiveTimestamp > 0) {
      initCountDown(genesisGoLiveTimestamp)

      const countDownDate = new Date(genesisGoLiveTimestamp * 1000).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now

      if (distance < 0) {
        setCountDownEnd(true)
      }

      setloadingTimer(false)
    }
  }, [QualificationSettingData])

  const isLoggedIn =
    Boolean(localStorage.getItem('loginInfo')) ||
    Boolean(localStorage.getItem('loginId'))

  return (
    <div className="new-landing-banner">
      <video id="backgroundVideo" loop autoPlay muted playsInline>
        <source src="/videos/land-stock.mp4" type="video/mp4" />
      </video>
      <div className="genesis-land-root-wrapper">
        <div
          className={classNames(
            'new-landing-banner-container',
            // appGoLiveTimestamp > 0 ? 'full-width' : '',
            'full-width', // hide  genesis box temporarily
          )}
        >
          {scrollLoader ? (
            <Spinner
              spinnerStatus={true}
              className="new-landing-genesis-spinner"
            />
          ) : (
            <div className="new-landing-banner-text-wrapper">
              <div className="new-landing-banner-title">
                {t('Trade Football Players Like Stocks')}
              </div>
              <div className="new-landing-banner-subtitle">
                {t('Empower your football journey')}
                {window.innerWidth < 958 ||
                (window.innerWidth <= 2515 &&
                  window.innerWidth > 1200 &&
                  false) ? (
                  // && appGoLiveTimestamp <= 0 // hide  genesis box temporarily
                  ''
                ) : (
                  <br />
                )}
                {t('We bring Players')}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile() ? 'column' : 'row',
                }}
              >
                {/* {QualificationSettingData === 0 && isLoggedIn ? null : (
                <div
                  // className={`get-more-btn ${isLoggedIn ? 'disabled' : ''}`}
                  className="get-more-btn mr-20"
                  onClick={onClickSubmit}
                >
                  {isLoggedIn ? t('Launch App') : t('get started')}
                </div>
              )} */}
                <div
                  // className={`get-more-btn ${isLoggedIn ? 'disabled' : ''}`}
                  className="get-more-btn mr-20"
                  onClick={onClickSubmit}
                >
                  {isLoggedIn ? t('Launch App') : t('get started')}
                </div>
                {isLoggedIn ? (
                  <div
                    className={classNames(
                      'get-more-btn invitations_referrals_btn',
                      isMobile()
                        ? 'mt-10 ml-0'
                        : `${
                            QualificationSettingData === 0 && isLoggedIn
                              ? ''
                              : 'ml-20'
                          }`,
                    )}
                    style={{ backgroundColor: 'transparent' }}
                    onClick={onRequestPlayerAccount}
                  >
                    {t('request_player_account')}
                  </div>
                ) : null}
              </div>
            </div>
          )}
          <div
            className={classNames(
              'new-landing-banner-right-side',
              // appGoLiveTimestamp > 0 ? 'hidden' : '',
              'hidden', // hide  genesis box temporarily
            )}
          >
            {loadingTimer ? (
              <Spinner
                spinnerStatus={true}
                className="new-landing-genesis-spinner"
              />
            ) : (
              <div className="new-landing-banner-genesis-wrapper">
                <div className="new-landing-banner-genesis-title">
                  {loadingTimer ? (
                    <Spinner
                      spinnerStatus={true}
                      className="new-landing-genesis-spinner"
                    />
                  ) : countDownEnd ? (
                    <div>
                      {t('Now Live')}
                      <span className="genesis-mintedlive-title-icon">
                        <img src={RecordIcon} alt="live-icon"></img>
                      </span>
                    </div>
                  ) : (
                    t('Coming Next')
                  )}
                </div>
                <div className="new-landing-banner-genesis-desc">
                  {/* {t('GENESIS by meCarreira is a public sale of specialized')} */}
                </div>
                <div>
                  <div
                    className="genesis-land-mint-btn"
                    onClick={() => navigate('/genesis')}
                  >
                    {t('genesis by mecarreira')}
                  </div>
                </div>
                <div className="new-landing-banner-genesis-countdown-wrapper">
                  {countDownEnd ? (
                    <Socials />
                  ) : (
                    <div className="genesis-mintedlive-time-content">
                      <div className="genesis-mintedlive-timer">
                        <div className="genesis-mintedlive-timer-time">
                          {state.day.toString().padStart(2, '0')}
                        </div>
                        <div className="genesis-mintedlive-timer-time-unit">
                          {t('days')}
                        </div>
                        <div className="genesis-mintedlive-timer-time-unit-mobile">
                          {t('D')}
                        </div>
                      </div>
                      <div className="genesis-mintedlive-timer">
                        <div className="genesis-mintedlive-timer-time">
                          {state.hours.toString().padStart(2, '0')}
                        </div>
                        <div className="genesis-mintedlive-timer-time-unit">
                          {t('hours')}
                        </div>
                        <div className="genesis-mintedlive-timer-time-unit-mobile">
                          {t('H')}
                        </div>
                      </div>
                      <div className="genesis-mintedlive-timer">
                        <div className="genesis-mintedlive-timer-time">
                          {state.minutes.toString().padStart(2, '0')}
                        </div>
                        <div className="genesis-mintedlive-timer-time-unit">
                          {t('minutes')}
                        </div>
                        <div className="genesis-mintedlive-timer-time-unit-mobile">
                          {t('M')}
                        </div>
                      </div>
                      <div className="genesis-mintedlive-timer">
                        <div className="genesis-mintedlive-timer-time">
                          {state.seconds.toString().padStart(2, '0')}
                        </div>
                        <div className="genesis-mintedlive-timer-time-unit">
                          {t('seconds')}
                        </div>
                        <div className="genesis-mintedlive-timer-time-unit-mobile">
                          {t('S')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {!loadingTimer && !countDownEnd && appGoLiveTimestamp > 0 && (
          <div className="genesis-mintedlive-countdown-box">
            <div className="genesis-mintedlive-time-label">
              {t('app launching in')}
            </div>
            <div className="genesis-mintedlive-time-content">
              <div className="genesis-mintedlive-timer">
                <div className="genesis-mintedlive-timer-time">
                  {state.day.toString().padStart(2, '0')}
                </div>
                <div className="genesis-mintedlive-timer-time-unit">
                  {t('days')}
                </div>
                <div className="genesis-mintedlive-timer-time-unit-mobile">
                  {t('D')}
                </div>
              </div>
              <div className="genesis-mintedlive-timer">
                <div className="genesis-mintedlive-timer-time">
                  {state.hours.toString().padStart(2, '0')}
                </div>
                <div className="genesis-mintedlive-timer-time-unit">
                  {t('hours')}
                </div>
                <div className="genesis-mintedlive-timer-time-unit-mobile">
                  {t('H')}
                </div>
              </div>
              <div className="genesis-mintedlive-timer">
                <div className="genesis-mintedlive-timer-time">
                  {state.minutes.toString().padStart(2, '0')}
                </div>
                <div className="genesis-mintedlive-timer-time-unit">
                  {t('minutes')}
                </div>
                <div className="genesis-mintedlive-timer-time-unit-mobile">
                  {t('M')}
                </div>
              </div>
              <div className="genesis-mintedlive-timer">
                <div className="genesis-mintedlive-timer-time">
                  {state.seconds.toString().padStart(2, '0')}
                </div>
                <div className="genesis-mintedlive-timer-time-unit">
                  {t('seconds')}
                </div>
                <div className="genesis-mintedlive-timer-time-unit-mobile">
                  {t('S')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LandingBanner
