import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ImageComponent from '@components/ImageComponent'
import classnames from 'classnames'
import { getCircleColor, isMobile, truncateDecimals } from '@utils/helpers'
import Typed from 'typed.js'
import DialogBox from '@components/Dialog/DialogBox'
import { DummyPlayer } from '@root/constants'
import PlayerImage from '@components/PlayerImage'
import ArrowUpFilled from '@components/Svg/ArrowUpFilled'
import { Input } from '@components/Form'
import Slider from '@material-ui/core/Slider'
import { setHideTourHeader } from '@root/apis/onboarding/authenticationSlice'
import { useDispatch } from 'react-redux'

interface Props {
  onComplete: () => void
}
const StakingTour: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [stakeAmount, setStakeAmount] = useState(0.0)
  const [value, setValue] = useState(0.0)

  useEffect(() => {
    setValue(
      truncateDecimals(((stakeAmount > 0 ? stakeAmount : 0) / 15) * 100, 2),
    )
  }, [stakeAmount])

  const [step, setStep] = useState(1)
  const [isFadeIn, setIsFadeIn] = useState(true)
  const [showButton, setShowButton] = useState(false)
  const handleVoid = () => console.log('')

  const typedRef = useRef(null)
  const subTypedRef = useRef(null)

  useEffect(() => {
    setShowButton(false)
    setIsFadeIn(true)
    if (subTypedRef && subTypedRef.current) {
      subTypedRef.current.innerHTML = ''
    }
    document.body.style.overflow = 'hidden'

    let string = ''
    if (step === 1) {
      window.scrollTo(0, 0)
      string = t('the_first_time_you_want')
      dispatch(setHideTourHeader(true))
    } else if (step === 2) {
      string = t('here_you_can_click')
    } else if (step === 3) {
      string = t('input_the_staking_amount')
    } else if (step === 4) {
      string = t('staked_tokens_are_locked')
    } else if (step === 5) {
      string = t('the_xp_earned')
    }
    const options = {
      strings: [string],
      typeSpeed: 25,
      backSpeed: 30,
      loop: false,
      showCursor: false,
      onStringTyped: () => {
        let subString = ''
        if (step === 1) {
          subString = t('click_on_approve')
        } else if (step === 3) {
          subString = t('select_max_button')
        } else {
          setShowButton(true)
        }
        if (subString) {
          const subOptions = {
            strings: [subString],
            typeSpeed: 25,
            backSpeed: 30,
            loop: false,
            showCursor: false,
          }
          const subTyped = new Typed(subTypedRef.current, subOptions)
          return () => {
            subTyped.destroy()
          }
        }
      },
    }
    const typed = new Typed(typedRef.current, options)
    // Cleanup: Destroy Typed instance on component unmount
    return () => {
      document.body.style.overflow = 'auto'
      if (typed) {
        typed.destroy()
      }
    }
  }, [step])

  const [timeLeft, setTimeLeft] = useState<number>(59)
  const [timeMinLeft, setTimeMinLeft] = useState<number>(59)
  const [timeHourLeft, setTimeHourLeft] = useState<number>(101)
  let intervalId: any = null
  useEffect(() => {
    if (timeLeft === 0 && timeMinLeft === 0) {
      setTimeHourLeft(prevTime => prevTime - 1)
    }
    if (timeLeft === 0) {
      setTimeLeft(59)
      setTimeMinLeft(prevTime => prevTime - 1)
    }
    if (timeMinLeft === 0) {
      setTimeMinLeft(59)
    }
    if (!timeLeft || !timeMinLeft) return

    intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1)
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [timeLeft, timeMinLeft])

  const handleNextStep = () => {
    if (step === 5) {
      onComplete()
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div className="staking-tour-wrapper">
      <div className="dark-overlay"></div>
      <div className="bright-rectangle no-animation">
        <DialogBox
          isOpen={true}
          onClose={handleVoid}
          contentClass="bg-dark-color"
          parentClass={classnames(
            'no-background',
            isMobile() ? 'flex-dialog' : '',
          )}
        >
          {step === 1 ? (
            <section className="staking-container">
              <h2 className="dark-area">
                {t('approve staking for')}
                <span
                  className={classnames(
                    'new-draft-title eth-address p-0',
                    'success',
                  )}
                >
                  {
                    <div className="currency_mark_wrapper kiosk-item-flag-buyItem stake-chip">
                      <div
                        className="currency_mark_img"
                        style={{
                          background: getCircleColor(DummyPlayer.playerlevelid),
                        }}
                      >
                        <PlayerImage
                          src={DummyPlayer?.playerpicturethumb}
                          className="img-radius_kiosk currency_mark"
                        />
                      </div>
                      <div className={isMobile() ? 'item-price-container' : ''}>
                        {!isMobile() ? (
                          <>
                            <span>
                              {DummyPlayer?.name || DummyPlayer?.name} $
                              {DummyPlayer?.ticker}
                            </span>
                          </>
                        ) : (
                          <> &nbsp;{DummyPlayer?.name}</>
                        )}
                      </div>
                    </div>
                  }
                  {t('and collect xp everyday')}
                </span>
              </h2>
              <div>
                <div
                  className={classnames(
                    'stake-button mt-0 mb-20',
                    'allow-staking-button',
                  )}
                  onClick={() => setStep(2)}
                >
                  {t('allow staking')}
                </div>
              </div>
            </section>
          ) : step === 2 ? (
            <section className="staking-container">
              <div className={classnames('staked', 'staked-pct-wrapper')}>
                <div className="nft-image-section dark-area">
                  <div className="image-border">
                    <ImageComponent
                      src={DummyPlayer?.playerpicturethumb}
                      alt=""
                      className="nft-image"
                    />
                  </div>
                  <div className="player-name">
                    <div className="staked-name">{DummyPlayer?.name}</div>
                    <div className="staked-name">{DummyPlayer?.ticker}</div>
                  </div>
                  <div className="player-detail-pricechange">
                    <ArrowUpFilled />
                    <div
                      style={{ fontSize: '24px' }}
                      className={classnames('number-color profit')}
                    >
                      1.93%
                    </div>
                  </div>
                </div>
                <div className="staked-amount-raw dark-area">
                  <span className="staked-label">{t('my coin staked: ')}</span>
                </div>
                <div className="staked-amount-raw">
                  <div className="staked-amount-wrapper dark-area">
                    <span className="staked-amount">0</span>
                    <span className="staked-amount usd-amount">
                      0 &nbsp;USD
                    </span>
                  </div>
                  <div className="staked-symbol-wrapper">
                    <span
                      className={classnames('minus-symbol', 'button-inactive')}
                    >
                      -
                    </span>
                    <span
                      className={classnames('plus-symbol', 'button-active')}
                    >
                      +
                    </span>
                  </div>
                </div>
                <div className="dark-area">
                  <div className="stake-label capitalize">{t('stake')}</div>
                  <div className={classnames('stake-input-container w-none')}>
                    <Input
                      type="number"
                      name="staked"
                      onChange={(evt: any) =>
                        setStakeAmount(
                          truncateDecimals(parseFloat(evt?.target?.value), 5),
                        )
                      }
                      value={stakeAmount}
                      className={classnames('input-stake-value')}
                      onBlur={handleVoid}
                      min={0}
                      max={9999}
                      onFocus={handleVoid}
                    />
                    <div className="ticker-holder">
                      <h6>{DummyPlayer?.ticker}</h6>
                    </div>
                  </div>
                  <div className="form-label-wrapper linear-flex-end w-none">
                    <label>{t('maximum coins available')}:</label>
                    <label className="form-label-active">15</label>
                  </div>
                </div>
                <div className="slider-bar dark-area">
                  <Slider
                    defaultValue={0.0}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    value={0.0}
                    disabled={false}
                    onChange={handleVoid}
                  />
                </div>
                <div className="slider-value mt-0 dark-area">0%</div>

                <div className="rate-group dark-area">
                  <div className={classnames('rate', 'button-inactive')}>
                    25%
                  </div>
                  <div
                    className={classnames('rate rate-50', 'button-inactive')}
                  >
                    50%
                  </div>
                  <div
                    className={classnames('rate rate-75', 'button-inactive')}
                  >
                    75%
                  </div>
                  <div className={classnames('rate', 'button-inactive')}>
                    {t('max')}
                  </div>
                </div>
                <p className="withdraw_title font-xs dark-area">
                  {t('Staked Tokens are locked for ')}
                  <span>101h 00m 36s</span>
                  {t(
                    ' and can only be withdrawn again once that period has ended',
                  )}
                </p>
              </div>
              <div
                className={classnames(
                  'stake-button mt-0 mb-20 button-inactive dark-area',
                )}
              >
                {t('stake')}
              </div>
            </section>
          ) : step === 3 ? (
            <section className="staking-container">
              <div className={classnames('staked', 'staked-pct-wrapper')}>
                <div className="nft-image-section  dark-area">
                  <div className="image-border">
                    <ImageComponent
                      src={DummyPlayer?.playerpicturethumb}
                      alt=""
                      className="nft-image"
                    />
                  </div>
                  <div className="player-name">
                    <div className="staked-name">{DummyPlayer?.name}</div>
                    <div className="staked-name">{DummyPlayer?.ticker}</div>
                  </div>
                  <div className="player-detail-pricechange">
                    <ArrowUpFilled />
                    <div
                      style={{ fontSize: '24px' }}
                      className={classnames('number-color profit')}
                    >
                      1.93%
                    </div>
                  </div>
                </div>
                <div className="staked-amount-raw  dark-area">
                  <span className="staked-label">{t('my coin staked: ')}</span>
                </div>
                <div className="staked-amount-raw  dark-area">
                  <div className="staked-amount-wrapper">
                    <span className="staked-amount">0</span>
                    <span className="staked-amount usd-amount">
                      0 &nbsp;USD
                    </span>
                  </div>
                  <div className="staked-symbol-wrapper">
                    <span
                      className={classnames('minus-symbol', 'button-inactive')}
                    >
                      -
                    </span>
                    <span
                      className={classnames('plus-symbol', 'button-active')}
                    >
                      +
                    </span>
                  </div>
                </div>
                <div>
                  <div className="stake-label capitalize">{t('stake')}</div>
                  <div className={classnames('stake-input-container w-none')}>
                    <Input
                      type="number"
                      name="staked"
                      onChange={(evt: any) =>
                        setStakeAmount(
                          truncateDecimals(parseFloat(evt?.target?.value), 5),
                        )
                      }
                      value={stakeAmount}
                      className={classnames('input-stake-value')}
                      onBlur={handleVoid}
                      min={0}
                      max={9999}
                      onFocus={handleVoid}
                    />
                    <div className="ticker-holder">
                      <h6>{DummyPlayer?.ticker}</h6>
                    </div>
                  </div>
                  <div className="form-label-wrapper linear-flex-end w-none">
                    <label>{t('maximum coins available')}:</label>
                    <label className="form-label-active">15</label>
                  </div>
                </div>
                <div className="slider-bar">
                  <Slider
                    defaultValue={0.0}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    value={value}
                    disabled={false}
                    onChange={handleVoid}
                  />
                </div>
                <div className="slider-value mt-0">{value}%</div>

                <div className="rate-group">
                  <div className={classnames('rate', 'button-inactive')}>
                    25%
                  </div>
                  <div
                    className={classnames('rate rate-50', 'button-inactive')}
                  >
                    50%
                  </div>
                  <div
                    className={classnames('rate rate-75', 'button-inactive')}
                  >
                    75%
                  </div>
                  <div
                    className={classnames('rate')}
                    onClick={() => setStakeAmount(15)}
                  >
                    {t('max')}
                  </div>
                </div>
                <p className="withdraw_title font-xs">
                  {t('Staked Tokens are locked for ')}
                  <span>101h 00m 36s</span>
                  {t(
                    ' and can only be withdrawn again once that period has ended',
                  )}
                </p>
              </div>
              <div
                className={classnames('stake-button mt-0 mb-20')}
                onClick={() => stakeAmount === 15 && setStep(4)}
              >
                {t('stake')}
              </div>
            </section>
          ) : step === 4 ? (
            <section className="staking-container">
              <div className={classnames('staked', 'staked-pct-wrapper')}>
                <div className="nft-image-section  dark-area">
                  <div className="image-border">
                    <ImageComponent
                      src={DummyPlayer?.playerpicturethumb}
                      alt=""
                      className="nft-image"
                    />
                  </div>
                  <div className="player-name">
                    <div className="staked-name">{DummyPlayer?.name}</div>
                    <div className="staked-name">{DummyPlayer?.ticker}</div>
                  </div>
                  <div className="player-detail-pricechange">
                    <ArrowUpFilled />
                    <div
                      style={{ fontSize: '24px' }}
                      className={classnames('number-color profit')}
                    >
                      1.93%
                    </div>
                  </div>
                </div>
                <div className="staked-amount-raw  dark-area">
                  <span className="staked-label">{t('my coin staked: ')}</span>
                </div>
                <div className="staked-amount-raw  dark-area">
                  <div className="staked-amount-wrapper">
                    <span className="staked-amount">15</span>
                    <span className="staked-amount usd-amount">
                      11.53 &nbsp;USD
                    </span>
                  </div>
                  <div className="staked-symbol-wrapper">
                    <span
                      className={classnames('minus-symbol', 'button-inactive')}
                    >
                      -
                    </span>
                    <span
                      className={classnames('plus-symbol', 'button-active')}
                    >
                      +
                    </span>
                  </div>
                </div>
                <div className="dark-area">
                  <div className="stake-label capitalize">{t('stake')}</div>
                  <div className={classnames('stake-input-container w-none')}>
                    <Input
                      type="number"
                      name="staked"
                      onChange={(evt: any) =>
                        setStakeAmount(
                          truncateDecimals(parseFloat(evt?.target?.value), 5),
                        )
                      }
                      value={stakeAmount}
                      className={classnames('input-stake-value')}
                      onBlur={handleVoid}
                      min={0}
                      max={9999}
                      onFocus={handleVoid}
                    />
                    <div className="ticker-holder">
                      <h6>{DummyPlayer?.ticker}</h6>
                    </div>
                  </div>
                  <div className="form-label-wrapper linear-flex-end w-none">
                    <label>{t('maximum coins available')}:</label>
                    <label className="form-label-active">15</label>
                  </div>
                </div>
                <div className="slider-bar dark-area">
                  <Slider
                    defaultValue={0.0}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    value={0.0}
                    disabled={false}
                    onChange={handleVoid}
                  />
                </div>
                <div className="slider-value mt-0 dark-area">0%</div>

                <div className="rate-group dark-area">
                  <div className={classnames('rate', 'button-inactive')}>
                    25%
                  </div>
                  <div
                    className={classnames('rate rate-50', 'button-inactive')}
                  >
                    50%
                  </div>
                  <div
                    className={classnames('rate rate-75', 'button-inactive')}
                  >
                    75%
                  </div>
                  <div className={classnames('rate', 'button-inactive')}>
                    {t('max')}
                  </div>
                </div>
                <>
                  <p className="withdraw_title">{t('you can unstake in')}</p>
                  <div style={{ height: '54px' }}>
                    <div className="secret-countdown">
                      {timeHourLeft}h &nbsp;
                      {timeMinLeft}m &nbsp;
                      {timeLeft}s
                    </div>
                  </div>
                </>
              </div>
              <div
                className={classnames(
                  'stake-button mt-0 mb-20 button-inactive dark-area',
                )}
              >
                {t('stake')}
              </div>
            </section>
          ) : (
            <section className="staking-container">
              <div className={classnames('staked', 'staked-pct-wrapper')}>
                <div className="nft-image-section dark-area">
                  <div className="image-border">
                    <ImageComponent
                      src={DummyPlayer?.playerpicturethumb}
                      alt=""
                      className="nft-image"
                    />
                  </div>
                  <div className="player-name">
                    <div className="staked-name">{DummyPlayer?.name}</div>
                    <div className="staked-name">{DummyPlayer?.ticker}</div>
                  </div>
                  <div className="player-detail-pricechange">
                    <ArrowUpFilled />
                    <div
                      style={{ fontSize: '24px' }}
                      className={classnames('number-color profit')}
                    >
                      1.93%
                    </div>
                  </div>
                </div>
                <div className="staked-amount-raw dark-area">
                  <span className="staked-label">{t('my coin staked: ')}</span>
                </div>
                <div className="staked-amount-raw dark-area">
                  <div className="staked-amount-wrapper">
                    <span className="staked-amount">15</span>
                    <span className="staked-amount usd-amount">
                      11.53 &nbsp;USD
                    </span>
                  </div>
                  <div className="staked-symbol-wrapper">
                    <span
                      className={classnames('minus-symbol', 'button-inactive')}
                    >
                      -
                    </span>
                    <span
                      className={classnames('plus-symbol', 'button-active')}
                    >
                      +
                    </span>
                  </div>
                </div>
                <div className="dark-area">
                  <div className="stake-label capitalize">{t('stake')}</div>
                  <div className={classnames('stake-input-container w-none')}>
                    <Input
                      type="number"
                      name="staked"
                      onChange={(evt: any) =>
                        setStakeAmount(
                          truncateDecimals(parseFloat(evt?.target?.value), 5),
                        )
                      }
                      value={stakeAmount}
                      className={classnames('input-stake-value')}
                      onBlur={handleVoid}
                      min={0}
                      max={9999}
                      onFocus={handleVoid}
                    />
                    <div className="ticker-holder">
                      <h6>{DummyPlayer?.ticker}</h6>
                    </div>
                  </div>
                  <div className="form-label-wrapper linear-flex-end w-none">
                    <label>{t('maximum coins available')}:</label>
                    <label className="form-label-active">15</label>
                  </div>
                </div>
                <div className="slider-bar dark-area">
                  <Slider
                    defaultValue={0.0}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    value={0.0}
                    disabled={false}
                    onChange={handleVoid}
                  />
                </div>
                <div className="slider-value mt-0 dark-area">0%</div>

                <div className="rate-group dark-area">
                  <div className={classnames('rate', 'button-inactive')}>
                    25%
                  </div>
                  <div
                    className={classnames('rate rate-50', 'button-inactive')}
                  >
                    50%
                  </div>
                  <div
                    className={classnames('rate rate-75', 'button-inactive')}
                  >
                    75%
                  </div>
                  <div className={classnames('rate', 'button-inactive')}>
                    {t('max')}
                  </div>
                </div>
                <div className="mt-30 xp_box">
                  <div>
                    <div className="xp_wrapper">
                      <p className="xp_title">{t('xp earned')}</p>
                      <div className="xp_value">37</div>
                    </div>
                  </div>
                  <button
                    className="form-submit-btn wallet-btn deposit-btn"
                    style={{ height: '40px' }}
                  >
                    {t('collect')}
                  </button>
                </div>
              </div>
              <div
                className={classnames(
                  'stake-button mt-0 mb-20 button-inactive dark-area',
                )}
              >
                {t('stake')}
              </div>
            </section>
          )}
        </DialogBox>
        <div
          className={classnames(
            `wallet-description staking-tokens-step${step}`,
            isFadeIn ? 'fade-in' : '',
          )}
        >
          <b ref={typedRef}></b>
          &nbsp;
          <b className="fg-primary-color" ref={subTypedRef}></b>
        </div>
        {showButton && (
          <div
            className={classnames(
              `fade-in staking-tokens-step${step}-btn`,
              step === 5 ? 'complete-btn' : 'continue-btn',
            )}
            onClick={handleNextStep}
          >
            {t(step === 5 ? 'complete' : 'continue')}
          </div>
        )}
      </div>
    </div>
  )
}

export default StakingTour
