import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Home from '@assets/icons/icon/home.webp'
import ImageComponent from '@components/ImageComponent'
import classnames from 'classnames'
import FooterNav from '@components/Page/FooterNav'
import { getCircleColor, isMobile, toXPNumberFormat } from '@utils/helpers'
import WalletForm from '@pages/Wallet/WalletForm'
import WalletDialog from '@components/Dialog/WalletDialog'
import TabGroup from '@components/Page/TabGroup'
import MyWallet from '@pages/Wallet/MyWallet'
import DialogBox from '@components/Dialog/DialogBox'
import { DummyPlayer, THEME_COLORS } from '@root/constants'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PlayerImage from '@components/PlayerImage'
import { Formik } from 'formik'
import TooltipLabel from '@components/TooltipLabel'
import { Input } from '@components/Form'
import maticIcon from '@assets/images/matic-token-icon.webp'
import visaIcon from '@assets/images/visa-white.webp'
import visaIconBlack from '@assets/images/visa.webp'
import WalletIcon from '@assets/icons/icon/wallet.webp'
import masterCardIcon from '@assets/images/mastercard-large.webp'
import ApplePayIcon from '@assets/images/apple_pay.webp'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import VerifiedIcon from '@assets/icons/icon/verified.png'
import ArrowUpFilled from '@components/Svg/ArrowUpFilled'
import * as Yup from 'yup'
import PurchaseSummary from '@pages/PurchaseNft/components/PurchaseSummary'
import PurchaseButton from '@pages/PurchaseNft/components/PurchaseButton'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import Typed from 'typed.js'
import BottomPopup from '@components/Dialog/BottomPopup'
import PaymentMethodCard from '@pages/PurchaseNft/components/PaymentMethodCard'
import PaymentOptionMatic from '@pages/PurchaseNft/components/PaymentOptionMatic'
import PaymentOption from '@pages/PurchaseNft/components/PaymentOption'
import ReactCanvasConfetti from 'react-canvas-confetti'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import toast from 'react-hot-toast'
import useSound from 'use-sound'
import xpSound from '@assets/sounds/xpSound.mp3'
import XPProgressBar from '@components/XPProgressBar'
// import xpSound from '../assets/sounds/xpSound.mp3'
import TrophyIcon from '@assets/images/trophy.webp'
import { setHideTourHeader } from '@root/apis/onboarding/authenticationSlice'

interface Props {
  onComplete: () => void
}
const TradeTourBuy: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData

  const { paymentOptions } = useSelector(
    (state: RootState) => state.playercoins,
  )

  const [step, setStep] = useState(1)
  const [isFadeIn, setIsFadeIn] = useState(true)
  const [showButton, setShowButton] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const handleVoid = () => console.log('')
  const handleClick = value => {
    // Remove 'fade-in'
    setIsFadeIn(false)
    setStep(value)
  }
  const [playXpSound] = useSound(xpSound)

  const handleComplete = () => {
    toast.dismiss(`level_xpToast`)
    toast.dismiss(`xpToast`)
    onComplete()
  }

  const toastXp = () => {
    toast(
      <div
        className="notification-container"
        style={{
          display: 'flex',

          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          margin: '0 0 22px',
          width: '100%',
          padding: '5px',
        }}
        onClick={() => toast.dismiss(`xpToast`)}
      >
        <div style={{ cursor: 'pointer', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <XPProgressBar
              level={2}
              nextLevelXp={34}
              levelIncrement={3}
              currentXp={345}
              index={3}
            />
            <p
              style={{
                fontFamily: 'Rajdhani-semibold',
                fontSize: '24px',
                fontWeight: '600',
                lineHeight: ' 18px',
                color: 'var(--primary-foreground-color)',
                margin: '0px',
                background: 'linear-gradient(to right, #ff00ff, #00ffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '-15px',
                paddingBottom: '5px',
              }}
            >
              {t('you earned')} &nbsp;{toXPNumberFormat(23)} <i> XP </i>
              &nbsp;
            </p>
          </div>
        </div>
      </div>,
      {
        id: `xpToast`,
        duration: 700000,
        position: 'top-center',

        // Styling
        style: {
          minWidth: isMobile() ? '100%' : '500px',
          color: THEME_COLORS[selectedThemeRedux]['PrimaryText'],
          background: THEME_COLORS[selectedThemeRedux]['SecondaryBackground'],
          // marginRight: isMobile() ? '' : '20px',
          borderImage: 'linear-gradient(to right, #ff00ff, #00ffff)',
          borderImageSlice: 1,
          borderRadius: '10px',
          backgroundImage: `linear-gradient(${THEME_COLORS[selectedThemeRedux]['SecondaryBackground']}, ${THEME_COLORS[selectedThemeRedux]['SecondaryBackground']}), linear-gradient(to right, #ff00ff, #00ffff)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
          padding: '1px',
          border: '1px solid transparent',
        },
      },
    )
  }

  const toastLevelUp = () => {
    toast(
      <div
        className="notification-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          margin: '10px',
          width: '100%',
          padding: '5px',
        }}
        onClick={() => toast.dismiss(`level_xpToast`)}
      >
        <ImageComponent style={{ height: '80px' }} src={TrophyIcon} alt="" />
        <div style={{ cursor: 'pointer' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile() ? '0' : '10px',
              flexDirection: isMobile() ? 'column' : 'row',
            }}
          >
            <p
              style={{
                fontFamily: 'Rajdhani-semibold',
                fontSize: '24px',
                fontWeight: '600',
                lineHeight: ' 18px',
                color: 'var(--primary-foreground-color)',
                background: 'linear-gradient(to right, #ff00ff, #00ffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
              }}
            >
              {t('you justed reached')}
            </p>
            <b className="gold-color" style={{ fontSize: '24px' }}>
              {` ${t('level')} 3 `}{' '}
            </b>
          </div>
        </div>
      </div>,
      {
        id: `level_xpToast`,
        duration: 700000,
        position: 'top-center',

        // Styling
        style: {
          minWidth: isMobile() ? '100%' : '500px',
          color: THEME_COLORS[selectedThemeRedux]['PrimaryText'],
          background: THEME_COLORS[selectedThemeRedux]['SecondaryBackground'],
          // marginRight: isMobile() ? '' : '20px',
          borderImage: 'linear-gradient(to right, #ff00ff, #00ffff)',
          borderImageSlice: 1,
          borderRadius: '10px',
          backgroundImage: `linear-gradient(${THEME_COLORS[selectedThemeRedux]['SecondaryBackground']}, ${THEME_COLORS[selectedThemeRedux]['SecondaryBackground']}), linear-gradient(to right, #ff00ff, #00ffff)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
          padding: '1px',
          border: '1px solid transparent',
        },
      },
    )
  }
  const typedRef = useRef(null)
  const subTypedRef = useRef(null)

  useEffect(() => {
    setShowButton(false)
    setIsFadeIn(true)

    let string = ''
    if (step === 1) {
      string = t('here_you_enter_amount')
      dispatch(setHideTourHeader(true))
    } else if (step === 2) {
      string = t('we_display_the_price')
    } else if (step === 3) {
      string = t('now_hit_buy')
    } else if (step === 4) {
      string = t('choose_your_payment_method')
    } else if (step === 5) {
      string = t('click_on_the_polygon')
    } else if (step === 6) {
      string = t('your_buy_transaction')
      setTimeout(() => {
        setShowLoading(false)
        fire()
      }, 2000)
    } else if (step === 7) {
      string = t('gain_xp_for_your_buy_order')
      playXpSound()
      toastXp()
      playXpSound()
      toastLevelUp()
    }
    const options = {
      strings: [string],
      typeSpeed: 25,
      backSpeed: 30,
      loop: false,
      showCursor: false,
      onStringTyped: () => {
        if (step === 2 || step === 4 || step === 6 || step === 7) {
          setShowButton(true)
        } else if (step === 1) {
          const subOptions = {
            strings: [t('for_now_please_enter')],
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
      if (typed) {
        typed.destroy()
      }
    }
  }, [step])

  const [inputAmount, setInputAmount] = useState('1')

  const canvasStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  } as React.CSSProperties

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

  return (
    <div className="trade-tour-wrapper">
      <div className="dark-overlay"></div>
      <div className="bright-rectangle no-animation">
        {step === 1 ? (
          <>
            <DialogBox
              isOpen={true}
              onClose={handleVoid}
              contentClass="bg-dark-color"
              closeBtnClass="close-purchase"
              parentClass={classnames(
                'no-background',
                isMobile() ? 'flex-dialog' : '',
              )}
            >
              <div className="dark-area">
                <TabGroup
                  defaultTab={t('buy').toUpperCase()}
                  tabSet={[t('buy').toUpperCase(), t('sell').toUpperCase()]}
                  getSwitchedTab={handleVoid}
                />
              </div>
              <div
                className={classnames(
                  'no-background',
                  isMobile()
                    ? 'purchase-container-mobile'
                    : 'purchase-container',
                )}
              >
                <div className={classnames('purchase-wrappper')}>
                  <div className="player-title-section dark-area">
                    <div className="player-title-bar">
                      <div className="player-title-wrapper mt-20">
                        <ChevronRightIcon className="icon-color" />
                        <div>
                          <div
                            className="currency_mark_img"
                            style={{
                              background: getCircleColor(
                                DummyPlayer?.playerlevelid,
                              ),
                              alignItems: 'center',
                              width: '52px',
                              height: '52px',
                            }}
                          >
                            <PlayerImage
                              src={DummyPlayer?.playerpicturethumb}
                              className="img-radius_kiosk currency_mark"
                            />
                          </div>
                        </div>
                        <div className="player-text-container">
                          <h6>{DummyPlayer?.name}</h6>
                          <h6>{DummyPlayer?.ticker}</h6>
                        </div>
                      </div>
                      <div className="player-detail-pricechange">
                        <ArrowUpFilled />
                        <div
                          style={{ fontSize: '24px' }}
                          className={classnames('number-color', 'profit')}
                        >
                          2.87%
                        </div>
                      </div>
                    </div>
                  </div>
                  <Formik
                    enableReinitialize={true}
                    initialValues={{ price: inputAmount }}
                    onSubmit={handleVoid}
                    validationSchema={Yup.object().shape({
                      price: Yup.string().required(t('required')),
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
                          onSubmit={(event: any) => event.preventDefault()}
                          autoComplete={'off'}
                          onKeyDown={(event: any) => event.key !== 'Enter'}
                        >
                          <div className="purchase-form">
                            <div className="form-label-wrapper share-info-wrapper dark-area">
                              <ImageComponent
                                src={VerifiedIcon}
                                alt=""
                                loading="lazy"
                                title={t('official')}
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  cursor: 'pointer',
                                }}
                              />
                              <label
                                htmlFor="playerPrice"
                                className="share-info-label light-blue"
                              >
                                {t('you are buying member shares')}
                              </label>
                            </div>
                            <div
                              className={classnames('purchase-input-container')}
                            >
                              <Input
                                id="buy_price"
                                name="price"
                                type={isMobile() ? 'number' : 'number'}
                                placeholder={t('amount')}
                                className={classnames('input-box')}
                                value={inputAmount}
                                maxLength={10}
                                onChange={(event: any) => {
                                  // setInputChanged(event.target.value)
                                  const value = event.target.value
                                  const decimalMatch = value.match(/\.\d*$/)
                                  if (
                                    decimalMatch &&
                                    decimalMatch[0].length - 1 > 5
                                  ) {
                                    return
                                  }
                                  handleChange(event)
                                  if (value !== '' || value > 0) {
                                    setInputAmount(value)
                                    if (value === '10') {
                                      setStep(2)
                                    }
                                  }
                                }}
                                // onFocus={getCallback}
                                onBlur={handleBlur}
                                onFocus={() => console.log('')}
                              />
                              <h6>{DummyPlayer?.ticker}</h6>
                            </div>
                          </div>
                          <div className="dark-area">
                            <PurchaseSummary
                              estimatedValue={'0.57'}
                              totalValue={'2.536'}
                              priceImpact={'0.04'}
                              priceImpactStyle={'number-color profit'}
                              inProgress={false}
                              usdRate={0.81}
                              initCallback={handleVoid}
                              stopCalculating={false}
                              activeIndex={0}
                              setActiveIndex={handleVoid}
                              handleClosePopup={handleVoid}
                              showEarlyAccessNft={false}
                              blockDiff={0}
                              // setTokenId={setTokenId}
                              setTokenId={handleVoid}
                              setEarlyCheckBox={handleVoid}
                              isLoadingEarlyAccessNft={false}
                            />
                          </div>
                          <div
                            className={classnames(
                              'purchase-submit-wrapper dark-area',
                              'btn-purchase',
                            )}
                          >
                            <PurchaseButton
                              title={'buy'}
                              onPress={handleSubmit}
                              disabled={false}
                              className={'caps'}
                            />

                            <div
                              className={classnames(
                                'supported-methods-wrapper',
                                isMobile() ? 'mb-20' : '',
                              )}
                            >
                              <div className="methods-heading">
                                {t('accepted payment methods')}
                              </div>
                              <div className="methods-wrapper">
                                <TooltipLabel title="MATIC">
                                  <img
                                    src={maticIcon}
                                    alt=""
                                    className="method-matic"
                                  />
                                </TooltipLabel>
                                <TooltipLabel title="Visa">
                                  <img
                                    src={
                                      selectedThemeRedux === 'Light'
                                        ? visaIconBlack
                                        : visaIcon
                                    }
                                    alt=""
                                    className="method-visa"
                                  />
                                </TooltipLabel>
                                <TooltipLabel title="Master Card">
                                  <img
                                    src={masterCardIcon}
                                    alt=""
                                    className="method-mc"
                                  />
                                </TooltipLabel>
                                <TooltipLabel title="Apple Pay">
                                  <img
                                    src={ApplePayIcon}
                                    alt="applepay"
                                    className="method-mc"
                                  />
                                </TooltipLabel>
                              </div>
                            </div>
                          </div>
                        </form>
                      )
                    }}
                  </Formik>
                </div>
              </div>
            </DialogBox>
            <div
              className={classnames(
                'wallet-description buy-token-input',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
              &nbsp;
              <b className="fg-primary-color" ref={subTypedRef}></b>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <DialogBox
              isOpen={true}
              onClose={handleVoid}
              contentClass="bg-dark-color"
              closeBtnClass="close-purchase"
              parentClass={classnames(
                'no-background',
                isMobile() ? 'flex-dialog' : '',
              )}
            >
              <div className="dark-area">
                <TabGroup
                  defaultTab={t('buy').toUpperCase()}
                  tabSet={[t('buy').toUpperCase(), t('sell').toUpperCase()]}
                  getSwitchedTab={handleVoid}
                />
              </div>
              <div
                className={classnames(
                  'no-background',
                  isMobile()
                    ? 'purchase-container-mobile'
                    : 'purchase-container',
                )}
              >
                <div className={classnames('purchase-wrappper')}>
                  <div className="player-title-section dark-area">
                    <div className="player-title-bar">
                      <div className="player-title-wrapper mt-20">
                        <ChevronRightIcon className="icon-color" />
                        <div>
                          <div
                            className="currency_mark_img"
                            style={{
                              background: getCircleColor(
                                DummyPlayer?.playerlevelid,
                              ),
                              alignItems: 'center',
                              width: '52px',
                              height: '52px',
                            }}
                          >
                            <PlayerImage
                              src={DummyPlayer?.playerpicturethumb}
                              className="img-radius_kiosk currency_mark"
                            />
                          </div>
                        </div>
                        <div className="player-text-container">
                          <h6>{DummyPlayer?.name}</h6>
                          <h6>{DummyPlayer?.ticker}</h6>
                        </div>
                      </div>
                      <div className="player-detail-pricechange">
                        <ArrowUpFilled />
                        <div
                          style={{ fontSize: '24px' }}
                          className={classnames('number-color', 'profit')}
                        >
                          2.87%
                        </div>
                      </div>
                    </div>
                  </div>
                  <Formik
                    enableReinitialize={true}
                    initialValues={{ price: inputAmount }}
                    onSubmit={handleVoid}
                    validationSchema={Yup.object().shape({
                      price: Yup.string().required(t('required')),
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
                          onSubmit={(event: any) => event.preventDefault()}
                          autoComplete={'off'}
                          onKeyDown={(event: any) => event.key !== 'Enter'}
                        >
                          <div className="purchase-form dark-area">
                            <div className="form-label-wrapper share-info-wrapper">
                              <ImageComponent
                                src={VerifiedIcon}
                                alt=""
                                loading="lazy"
                                title={t('official')}
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  cursor: 'pointer',
                                }}
                              />
                              <label
                                htmlFor="playerPrice"
                                className="share-info-label light-blue"
                              >
                                {t('you are buying member shares')}
                              </label>
                            </div>
                            <div
                              className={classnames('purchase-input-container')}
                            >
                              <Input
                                id="buy_price"
                                name="price"
                                type={isMobile() ? 'number' : 'number'}
                                placeholder={t('amount')}
                                className={classnames('input-box')}
                                value={inputAmount}
                                maxLength={10}
                                onChange={handleChange}
                                // onFocus={getCallback}
                                onBlur={handleBlur}
                                onFocus={() => console.log('')}
                              />
                              <h6>{DummyPlayer?.ticker}</h6>
                            </div>
                          </div>
                          <div>
                            <PurchaseSummary
                              estimatedValue={'0.57'}
                              totalValue={'2.536'}
                              priceImpact={'0.04'}
                              priceImpactStyle={'number-color profit'}
                              inProgress={false}
                              usdRate={0.81}
                              initCallback={handleVoid}
                              stopCalculating={false}
                              activeIndex={0}
                              setActiveIndex={handleVoid}
                              handleClosePopup={handleVoid}
                              showEarlyAccessNft={false}
                              blockDiff={0}
                              // setTokenId={setTokenId}
                              setTokenId={handleVoid}
                              setEarlyCheckBox={handleVoid}
                              isLoadingEarlyAccessNft={false}
                            />
                          </div>
                          <div
                            className={classnames(
                              'purchase-submit-wrapper',
                              'btn-purchase',
                              'dark-area',
                            )}
                          >
                            <PurchaseButton
                              title={'buy'}
                              onPress={handleVoid}
                              disabled={false}
                              className={'caps'}
                            />

                            <div
                              className={classnames(
                                'supported-methods-wrapper dark-area',
                                isMobile() ? 'mb-20' : '',
                              )}
                            >
                              <div className="methods-heading">
                                {t('accepted payment methods')}
                              </div>
                              <div className="methods-wrapper">
                                <TooltipLabel title="MATIC">
                                  <img
                                    src={maticIcon}
                                    alt=""
                                    className="method-matic"
                                  />
                                </TooltipLabel>
                                <TooltipLabel title="Visa">
                                  <img
                                    src={
                                      selectedThemeRedux === 'Light'
                                        ? visaIconBlack
                                        : visaIcon
                                    }
                                    alt=""
                                    className="method-visa"
                                  />
                                </TooltipLabel>
                                <TooltipLabel title="Master Card">
                                  <img
                                    src={masterCardIcon}
                                    alt=""
                                    className="method-mc"
                                  />
                                </TooltipLabel>
                                <TooltipLabel title="Apple Pay">
                                  <img
                                    src={ApplePayIcon}
                                    alt="applepay"
                                    className="method-mc"
                                  />
                                </TooltipLabel>
                              </div>
                            </div>
                          </div>
                        </form>
                      )
                    }}
                  </Formik>
                </div>
              </div>
            </DialogBox>
            <div
              className={classnames(
                'wallet-description price-per-player',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
            {showButton && (
              <div
                className="continue-btn price-per-player-btn fade-in"
                onClick={() => setStep(3)}
              >
                {t('continue')}
              </div>
            )}
          </>
        ) : step === 3 ? (
          <>
            <DialogBox
              isOpen={true}
              onClose={handleVoid}
              contentClass="bg-dark-color"
              closeBtnClass="close-purchase"
              parentClass={classnames(
                'no-background',
                isMobile() ? 'flex-dialog' : '',
              )}
            >
              <div className="dark-area">
                <TabGroup
                  defaultTab={t('buy').toUpperCase()}
                  tabSet={[t('buy').toUpperCase(), t('sell').toUpperCase()]}
                  getSwitchedTab={handleVoid}
                />
              </div>
              <div
                className={classnames(
                  'no-background',
                  isMobile()
                    ? 'purchase-container-mobile'
                    : 'purchase-container',
                )}
              >
                <div className={classnames('purchase-wrappper')}>
                  <div className="player-title-section dark-area">
                    <div className="player-title-bar">
                      <div className="player-title-wrapper mt-20">
                        <ChevronRightIcon className="icon-color" />
                        <div>
                          <div
                            className="currency_mark_img"
                            style={{
                              background: getCircleColor(
                                DummyPlayer?.playerlevelid,
                              ),
                              alignItems: 'center',
                              width: '52px',
                              height: '52px',
                            }}
                          >
                            <PlayerImage
                              src={DummyPlayer?.playerpicturethumb}
                              className="img-radius_kiosk currency_mark"
                            />
                          </div>
                        </div>
                        <div className="player-text-container">
                          <h6>{DummyPlayer?.name}</h6>
                          <h6>{DummyPlayer?.ticker}</h6>
                        </div>
                      </div>
                      <div className="player-detail-pricechange">
                        <ArrowUpFilled />
                        <div
                          style={{ fontSize: '24px' }}
                          className={classnames('number-color', 'profit')}
                        >
                          2.87%
                        </div>
                      </div>
                    </div>
                  </div>
                  <Formik
                    enableReinitialize={true}
                    initialValues={{ price: inputAmount }}
                    onSubmit={handleVoid}
                    validationSchema={Yup.object().shape({
                      price: Yup.string().required(t('required')),
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
                          onSubmit={(event: any) => event.preventDefault()}
                          autoComplete={'off'}
                          onKeyDown={(event: any) => event.key !== 'Enter'}
                        >
                          <div className="purchase-form dark-area">
                            <div className="form-label-wrapper share-info-wrapper">
                              <ImageComponent
                                src={VerifiedIcon}
                                alt=""
                                loading="lazy"
                                title={t('official')}
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  cursor: 'pointer',
                                }}
                              />
                              <label
                                htmlFor="playerPrice"
                                className="share-info-label light-blue"
                              >
                                {t('you are buying member shares')}
                              </label>
                            </div>
                            <div
                              className={classnames('purchase-input-container')}
                            >
                              <Input
                                id="buy_price"
                                name="price"
                                type={isMobile() ? 'number' : 'number'}
                                placeholder={t('amount')}
                                className={classnames('input-box')}
                                value={inputAmount}
                                maxLength={10}
                                onChange={handleChange}
                                // onFocus={getCallback}
                                onBlur={handleBlur}
                                onFocus={() => console.log('')}
                              />
                              <h6>{DummyPlayer?.ticker}</h6>
                            </div>
                          </div>
                          <div className="dark-area">
                            <PurchaseSummary
                              estimatedValue={'0.57'}
                              totalValue={'2.536'}
                              priceImpact={'0.04'}
                              priceImpactStyle={'number-color profit'}
                              inProgress={false}
                              usdRate={0.81}
                              initCallback={handleVoid}
                              stopCalculating={false}
                              activeIndex={0}
                              setActiveIndex={handleVoid}
                              handleClosePopup={handleVoid}
                              showEarlyAccessNft={false}
                              blockDiff={0}
                              // setTokenId={setTokenId}
                              setTokenId={handleVoid}
                              setEarlyCheckBox={handleVoid}
                              isLoadingEarlyAccessNft={false}
                            />
                          </div>
                          <div
                            className={classnames(
                              'purchase-submit-wrapper',
                              'btn-purchase',
                            )}
                          >
                            <PurchaseButton
                              title={'buy'}
                              onPress={() => setStep(4)}
                              disabled={false}
                              className={'caps'}
                            />

                            <div
                              className={classnames(
                                'supported-methods-wrapper dark-area',
                                isMobile() ? 'mb-20' : '',
                              )}
                            >
                              <div className="methods-heading">
                                {t('accepted payment methods')}
                              </div>
                              <div className="methods-wrapper">
                                <TooltipLabel title="MATIC">
                                  <img
                                    src={maticIcon}
                                    alt=""
                                    className="method-matic"
                                  />
                                </TooltipLabel>
                                <TooltipLabel title="Visa">
                                  <img
                                    src={
                                      selectedThemeRedux === 'Light'
                                        ? visaIconBlack
                                        : visaIcon
                                    }
                                    alt=""
                                    className="method-visa"
                                  />
                                </TooltipLabel>
                                <TooltipLabel title="Master Card">
                                  <img
                                    src={masterCardIcon}
                                    alt=""
                                    className="method-mc"
                                  />
                                </TooltipLabel>
                                <TooltipLabel title="Apple Pay">
                                  <img
                                    src={ApplePayIcon}
                                    alt="applepay"
                                    className="method-mc"
                                  />
                                </TooltipLabel>
                              </div>
                            </div>
                          </div>
                        </form>
                      )
                    }}
                  </Formik>
                </div>
              </div>
            </DialogBox>
            <div
              className={classnames(
                'wallet-description click-buy-button',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
          </>
        ) : step === 4 ? (
          <>
            <DialogBox
              isOpen={true}
              onClose={handleVoid}
              contentClass="bg-dark-color"
              closeBtnClass="close-purchase"
              parentClass={classnames(
                'no-background',
                isMobile() ? 'flex-dialog' : '',
              )}
            >
              <div className="dark-area">
                <TabGroup
                  defaultTab={t('buy').toUpperCase()}
                  tabSet={[t('buy').toUpperCase(), t('sell').toUpperCase()]}
                  getSwitchedTab={handleVoid}
                />
              </div>
              <div
                className={classnames(
                  'no-background',
                  isMobile()
                    ? 'purchase-container-mobile'
                    : 'purchase-container',
                )}
              >
                <BottomPopup
                  mode={`wallet ${isMobile() ? 'exwallet-bottomwrapper' : ''}`}
                  contentClass={'bg-dark-color'}
                  isOpen={true}
                >
                  <div className="available-methods-container">
                    <div
                      className="terms-subtitle ct-h4 select-pay-title h-none"
                      style={{ marginBottom: '10px !important' }}
                    >
                      {t('select payment method')}
                    </div>
                    <div
                      className="methods-box dark-area"
                      style={{
                        height: isMobile() ? '82%' : 'calc(min(490px, 59vh))',
                        marginTop: '20px',
                      }}
                    >
                      <PaymentMethodCard
                        title=""
                        logoSet={[
                          {
                            id: 1,
                            img:
                              selectedThemeRedux === 'Light' ||
                              selectedThemeRedux === 'Ladies' ||
                              selectedThemeRedux === 'Black'
                                ? visaIconBlack
                                : visaIcon,
                            class: 'visa-method-logo',
                          },
                          {
                            id: 2,
                            img: masterCardIcon,
                            class: 'mc-method-logo',
                          },
                          {
                            id: 3,
                            img: ApplePayIcon,
                            class: 'mc-method-logo',
                          },
                        ]}
                        labelBottom={t('total estimated in USD')}
                        valueBottom={'5.116'}
                        unit="dollar"
                        onSelect={handleVoid}
                        isDisabled={false}
                        label2Bottom={''}
                      />
                      <PaymentOptionMatic
                        valueBottom={'5.19717'}
                        onSelect={handleVoid}
                        isInsufficientMatics={false}
                      />
                      {paymentOptions.length > 0 &&
                        paymentOptions.map((el, ind) => {
                          return (
                            <PaymentOption
                              key={ind}
                              element={el}
                              optionIndex={ind}
                              WETHTotalSum={0}
                              USDTTotalSum={0}
                              USDCTotalSum={0}
                              WBTCTotalSum={0}
                              payItem={paymentOptions[ind]}
                              handleBuyWithPaymentMethod={handleVoid}
                              handleApproveMethod={handleVoid}
                            />
                          )
                        })}
                    </div>
                    <div
                      className="deposit-cancel dark-area"
                      style={{ marginTop: '10px !important' }}
                      onClick={handleVoid}
                    >
                      {t('close')}
                    </div>
                  </div>
                </BottomPopup>
                <div className={classnames('purchase-wrappper dark-area')}>
                  <div className="player-title-section">
                    <div className="player-title-bar">
                      <div className="player-title-wrapper mt-20">
                        <ChevronRightIcon className="icon-color" />
                        <div>
                          <div
                            className="currency_mark_img"
                            style={{
                              background: getCircleColor(
                                DummyPlayer?.playerlevelid,
                              ),
                              alignItems: 'center',
                              width: '52px',
                              height: '52px',
                            }}
                          >
                            <PlayerImage
                              src={DummyPlayer?.playerpicturethumb}
                              className="img-radius_kiosk currency_mark"
                            />
                          </div>
                        </div>
                        <div className="player-text-container">
                          <h6>{DummyPlayer?.name}</h6>
                          <h6>{DummyPlayer?.ticker}</h6>
                        </div>
                      </div>
                      <div className="player-detail-pricechange">
                        <ArrowUpFilled />
                        <div
                          style={{ fontSize: '24px' }}
                          className={classnames('number-color', 'profit')}
                        >
                          2.87%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogBox>
            <div
              className={classnames(
                'wallet-description select-payment-method',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
            {showButton && (
              <div
                className="continue-btn select-payment-method-btn fade-in"
                onClick={() => setStep(5)}
              >
                {t('continue')}
              </div>
            )}
          </>
        ) : step === 5 ? (
          <>
            <DialogBox
              isOpen={true}
              onClose={handleVoid}
              contentClass="bg-dark-color"
              closeBtnClass="close-purchase"
              parentClass={classnames(
                'no-background',
                isMobile() ? 'flex-dialog' : '',
              )}
            >
              <div className="dark-area">
                <TabGroup
                  defaultTab={t('buy').toUpperCase()}
                  tabSet={[t('buy').toUpperCase(), t('sell').toUpperCase()]}
                  getSwitchedTab={handleVoid}
                />
              </div>
              <div
                className={classnames(
                  'no-background',
                  isMobile()
                    ? 'purchase-container-mobile'
                    : 'purchase-container',
                )}
              >
                <BottomPopup
                  mode={`wallet ${isMobile() ? 'exwallet-bottomwrapper' : ''}`}
                  contentClass="bg-dark-color"
                  isOpen={true}
                >
                  <div className="available-methods-container">
                    <div
                      className="terms-subtitle ct-h4 select-pay-title h-none dark-area"
                      style={{ marginBottom: '10px !important' }}
                    >
                      {t('select payment method')}
                    </div>
                    <div
                      className="methods-box"
                      style={{
                        height: isMobile() ? '82%' : 'calc(min(490px, 59vh))',
                        marginTop: '20px',
                      }}
                    >
                      <div className="dark-area fullwidth">
                        <PaymentMethodCard
                          title=""
                          logoSet={[
                            {
                              id: 1,
                              img:
                                selectedThemeRedux === 'Light' ||
                                selectedThemeRedux === 'Ladies' ||
                                selectedThemeRedux === 'Black'
                                  ? visaIconBlack
                                  : visaIcon,
                              class: 'visa-method-logo',
                            },
                            {
                              id: 2,
                              img: masterCardIcon,
                              class: 'mc-method-logo',
                            },
                            {
                              id: 3,
                              img: ApplePayIcon,
                              class: 'mc-method-logo',
                            },
                          ]}
                          labelBottom={t('total estimated in USD')}
                          valueBottom={'5.116'}
                          unit="dollar"
                          onSelect={handleVoid}
                          isDisabled={false}
                          label2Bottom={''}
                        />
                      </div>
                      <PaymentOptionMatic
                        valueBottom={'5.19717'}
                        onSelect={() => setStep(6)}
                        isInsufficientMatics={false}
                      />
                      <div className="dark-area">
                        {paymentOptions.length > 0 &&
                          paymentOptions.map((el, ind) => {
                            return (
                              <PaymentOption
                                key={ind}
                                element={el}
                                optionIndex={ind}
                                WETHTotalSum={0}
                                USDTTotalSum={0}
                                USDCTotalSum={0}
                                WBTCTotalSum={0}
                                payItem={paymentOptions[ind]}
                                handleBuyWithPaymentMethod={handleVoid}
                                handleApproveMethod={handleVoid}
                              />
                            )
                          })}
                      </div>
                    </div>
                    <div
                      className="deposit-cancel dark-area"
                      style={{ marginTop: '10px !important' }}
                      onClick={handleVoid}
                    >
                      {t('close')}
                    </div>
                  </div>
                </BottomPopup>
                <div className={classnames('purchase-wrappper dark-area')}>
                  <div className="player-title-section">
                    <div className="player-title-bar">
                      <div className="player-title-wrapper mt-20">
                        <ChevronRightIcon className="icon-color" />
                        <div>
                          <div
                            className="currency_mark_img"
                            style={{
                              background: getCircleColor(
                                DummyPlayer?.playerlevelid,
                              ),
                              alignItems: 'center',
                              width: '52px',
                              height: '52px',
                            }}
                          >
                            <PlayerImage
                              src={DummyPlayer?.playerpicturethumb}
                              className="img-radius_kiosk currency_mark"
                            />
                          </div>
                        </div>
                        <div className="player-text-container">
                          <h6>{DummyPlayer?.name}</h6>
                          <h6>{DummyPlayer?.ticker}</h6>
                        </div>
                      </div>
                      <div className="player-detail-pricechange">
                        <ArrowUpFilled />
                        <div
                          style={{ fontSize: '24px' }}
                          className={classnames('number-color', 'profit')}
                        >
                          2.87%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogBox>
            <div
              className={classnames(
                'wallet-description click-on-polygon',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
          </>
        ) : step === 6 ? (
          <>
            <DialogBox
              isOpen={true}
              onClose={handleVoid}
              contentClass="bg-dark-color"
              closeBtnClass="close-purchase"
              parentClass={classnames(
                'no-background',
                isMobile() ? 'flex-dialog' : '',
              )}
            >
              <div className="dark-area">
                <TabGroup
                  defaultTab={t('buy').toUpperCase()}
                  tabSet={[t('buy').toUpperCase(), t('sell').toUpperCase()]}
                  getSwitchedTab={handleVoid}
                />
              </div>
              <div
                className={classnames(
                  'no-background',
                  isMobile()
                    ? 'purchase-container-mobile'
                    : 'purchase-container',
                )}
              >
                <BottomPopup
                  mode={`wallet ${isMobile() ? 'exwallet-bottomwrapper' : ''}`}
                  contentClass="bg-dark-color"
                  isOpen={true}
                >
                  <section className="new-draft vertical-flex buy-fly">
                    <ImageComponent
                      loading="lazy"
                      src={MetamaskIcon}
                      className="draftee-metamaskicon dark-area"
                      alt="metamask-icon"
                    />
                    <div className="input-label approve-blockchain dark-area">
                      {t('please approve the blockchain transaction') +
                        ' Metamask'}
                    </div>

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
                        {showLoading ? ( //2s duration
                          <div
                            className={classnames('spinner check-spinner')}
                          />
                        ) : (
                          <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                        )}
                      </div>
                      <span>{t('transaction sent')}</span>
                      {!showLoading ? ( //2s duration
                        <span
                          style={{
                            fontSize: isMobile() ? '20px' : '17px',
                            margin: 'unset',
                          }}
                          className="txn-confirm-success"
                        >
                          {t('transaction confirmed')}
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
                      <a className="tx-link button-box" target="_blank">
                        {t('show transaction')}
                      </a>
                    </div>
                    <div
                      className="close-button dark-area"
                      onClick={handleVoid}
                    >
                      {t('close')}
                    </div>
                    <ReactCanvasConfetti
                      refConfetti={getInstance}
                      style={canvasStyles}
                    />
                  </section>
                </BottomPopup>
                <div className={classnames('purchase-wrappper dark-area')}>
                  <div className="player-title-section">
                    <div className="player-title-bar">
                      <div className="player-title-wrapper mt-20">
                        <ChevronRightIcon className="icon-color" />
                        <div>
                          <div
                            className="currency_mark_img"
                            style={{
                              background: getCircleColor(
                                DummyPlayer?.playerlevelid,
                              ),
                              alignItems: 'center',
                              width: '52px',
                              height: '52px',
                            }}
                          >
                            <PlayerImage
                              src={DummyPlayer?.playerpicturethumb}
                              className="img-radius_kiosk currency_mark"
                            />
                          </div>
                        </div>
                        <div className="player-text-container">
                          <h6>{DummyPlayer?.name}</h6>
                          <h6>{DummyPlayer?.ticker}</h6>
                        </div>
                      </div>
                      <div className="player-detail-pricechange">
                        <ArrowUpFilled />
                        <div
                          style={{ fontSize: '24px' }}
                          className={classnames('number-color', 'profit')}
                        >
                          2.87%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogBox>
            <div
              className={classnames(
                'wallet-description transaction-sent',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
            {showButton && (
              <div
                className="continue-btn transaction-sent-btn fade-in"
                onClick={() => setStep(7)}
              >
                {t('continue')}
              </div>
            )}
          </>
        ) : (
          <>
            <DialogBox
              isOpen={true}
              onClose={handleVoid}
              contentClass="bg-dark-color"
              closeBtnClass="close-purchase"
              parentClass={classnames(
                'no-background',
                isMobile() ? 'flex-dialog' : '',
              )}
            >
              <div className="dark-area">
                <TabGroup
                  defaultTab={t('buy').toUpperCase()}
                  tabSet={[t('buy').toUpperCase(), t('sell').toUpperCase()]}
                  getSwitchedTab={handleVoid}
                />
              </div>
              <div
                className={classnames(
                  'no-background',
                  isMobile()
                    ? 'purchase-container-mobile'
                    : 'purchase-container',
                )}
              >
                <BottomPopup
                  mode={`wallet ${isMobile() ? 'exwallet-bottomwrapper' : ''}`}
                  contentClass="bg-dark-color dark-area"
                  isOpen={true}
                >
                  <section className="new-draft vertical-flex buy-fly">
                    <ImageComponent
                      loading="lazy"
                      src={MetamaskIcon}
                      className="draftee-metamaskicon"
                      alt="metamask-icon"
                    />
                    <div className="input-label approve-blockchain">
                      {t('please approve the blockchain transaction') +
                        ' Metamask'}
                    </div>

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
                        <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                      </div>
                      <span>{t('transaction sent')}</span>
                      <span
                        style={{
                          fontSize: isMobile() ? '20px' : '17px',
                          margin: 'unset',
                        }}
                        className="txn-confirm-success"
                      >
                        {t('transaction confirmed')}
                      </span>
                      <a className="tx-link button-box" target="_blank">
                        {t('show transaction')}
                      </a>
                    </div>
                    <div className="close-button" onClick={handleVoid}>
                      {t('close')}
                    </div>
                    <ReactCanvasConfetti
                      refConfetti={getInstance}
                      style={canvasStyles}
                    />
                  </section>
                </BottomPopup>
                <div className={classnames('purchase-wrappper dark-area')}>
                  <div className="player-title-section">
                    <div className="player-title-bar">
                      <div className="player-title-wrapper mt-20">
                        <ChevronRightIcon className="icon-color" />
                        <div>
                          <div
                            className="currency_mark_img"
                            style={{
                              background: getCircleColor(
                                DummyPlayer?.playerlevelid,
                              ),
                              alignItems: 'center',
                              width: '52px',
                              height: '52px',
                            }}
                          >
                            <PlayerImage
                              src={DummyPlayer?.playerpicturethumb}
                              className="img-radius_kiosk currency_mark"
                            />
                          </div>
                        </div>
                        <div className="player-text-container">
                          <h6>{DummyPlayer?.name}</h6>
                          <h6>{DummyPlayer?.ticker}</h6>
                        </div>
                      </div>
                      <div className="player-detail-pricechange">
                        <ArrowUpFilled />
                        <div
                          style={{ fontSize: '24px' }}
                          className={classnames('number-color', 'profit')}
                        >
                          2.87%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogBox>
            <div
              className={classnames(
                'wallet-description awarded-xp',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
            {showButton && (
              <div
                className="continue-btn awarded-xp-btn fade-in"
                onClick={handleComplete}
              >
                {t('continue')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TradeTourBuy
