import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ImageComponent from '@components/ImageComponent'
import classnames from 'classnames'
import { getCircleColor, isMobile, toXPNumberFormat } from '@utils/helpers'
import TabGroup from '@components/Page/TabGroup'
import DialogBox from '@components/Dialog/DialogBox'
import { DummyPlayer, THEME_COLORS } from '@root/constants'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PlayerImage from '@components/PlayerImage'
import { Formik } from 'formik'
import { Input } from '@components/Form'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
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
import ReactCanvasConfetti from 'react-canvas-confetti'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import usdc from '@assets/images/usdc.webp'
import bitcoin from '@assets/images/wrapped-bitcoin.webp'
import tether from '@assets/images/tether.webp'
import ethereum from '@assets/images/ethereum-eth.webp'
import maticIcon from '@assets/images/matic-token-icon.webp'
import { setHideTourHeader } from '@root/apis/onboarding/authenticationSlice'

interface Props {
  onComplete: () => void
}
const TradeTourSell: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData

  const paymentOptions = [
    {
      ticker: 'WETH',
      name: 'Wrapped Ether',
      contract: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
      decimals: 18,
    },
    {
      ticker: 'USDT',
      name: 'US Tether',
      contract: '0x820d3301753fD6A5df51E565266eB7E085BAaEF0',
      decimals: 18,
    },
    {
      ticker: 'USDC',
      name: 'USDC',
      contract: '0x880172B02586165Bb02dF6a66c1fcFE9E113A9E8',
      decimals: 18,
    },
    {
      ticker: 'WBTC',
      name: 'Wrapped Bitcoin',
      contract: '0xf98e6a5d6bfa9eaEE157917Dde03B55F70C3a0bf',
      decimals: 8,
    },
  ]

  const [step, setStep] = useState(1)
  const [isFadeIn, setIsFadeIn] = useState(true)
  const [showButton, setShowButton] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const handleVoid = () => console.log('')

  const typedRef = useRef(null)

  useEffect(() => {
    setShowButton(false)
    setIsFadeIn(true)

    let string = ''
    if (step === 1) {
      string = t('you_can_enter_the_amount')
      dispatch(setHideTourHeader(true))
    } else if (step === 2) {
      string = t('click_on_sell_to_continue')
    } else if (step === 3) {
      string = t('choose_a_payout_in')
    } else if (step === 4) {
      string = t('confirm_your_choice')
    } else if (step === 5) {
      string = t('your_sell_transaction')
      setTimeout(() => {
        setShowLoading(false)
        fire()
      }, 2000)
    } else if (step === 6) {
      string = t('you_have_now_seen')
    }
    const options = {
      strings: [string],
      typeSpeed: 25,
      backSpeed: 30,
      loop: false,
      showCursor: false,
      onStringTyped: () => {
        if (step === 3 || step === 5 || step === 6) {
          setShowButton(true)
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
                  defaultTab={t('sell').toUpperCase()}
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
                            <div className="form-label-wrapper align-end">
                              <label>{t('maximum coins to sell')}:</label>
                              <label className="form-label-active">10</label>
                            </div>
                          </div>
                          <div className="dark-area">
                            <PurchaseSummary
                              estimatedValue={'0.534'}
                              totalValue={'2.673'}
                              priceImpact={'-0.61'}
                              priceImpactStyle={'number-color loss'}
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
                              title={'sell'}
                              onPress={handleSubmit}
                              disabled={false}
                              className={'sell-btn caps'}
                            />
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
                  defaultTab={t('sell').toUpperCase()}
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
                            <div className="form-label-wrapper align-end">
                              <label>{t('maximum coins to sell')}:</label>
                              <label className="form-label-active">10</label>
                            </div>
                          </div>
                          <div className="dark-area">
                            <PurchaseSummary
                              estimatedValue={'0.534'}
                              totalValue={'2.673'}
                              priceImpact={'-0.61'}
                              priceImpactStyle={'number-color loss'}
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
                              title={'sell'}
                              onPress={() => setStep(3)}
                              disabled={false}
                              className={'sell-btn caps'}
                            />
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
                'wallet-description click-sell-button',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
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
                  defaultTab={t('sell').toUpperCase()}
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
                      {'How you want to be paid ?'}
                    </div>
                    <div
                      className="methods-box dark-area"
                      style={{
                        height: isMobile() ? '82%' : 'calc(min(490px, 59vh))',
                        marginTop: '20px',
                      }}
                    >
                      <PaymentMethodCard
                        title={t('cryptocurrency (matic)')}
                        isCryptoLoading={false}
                        logoSet={[
                          { id: 3, img: maticIcon, class: 'matic-method-logo' },
                        ]}
                        labelBottom={'total estimated'}
                        valueBottom={'2.77768'}
                        unit="matic"
                        onSelect={handleVoid}
                        label2Bottom={''}
                      />
                      {paymentOptions.length > 0 &&
                        paymentOptions.map((el, ind) => {
                          return (
                            <div
                              key={ind}
                              className={classnames('proxy_method_wrapper')}
                              style={{ border: '1px solid #abacb5' }}
                              onClick={handleVoid}
                            >
                              <div className="proxy_method">
                                <div className="proxy_icon">
                                  <ImageComponent
                                    className="proxy_icon"
                                    src={
                                      el?.ticker === 'WETH'
                                        ? ethereum
                                        : el?.ticker === 'USDT'
                                        ? tether
                                        : el?.ticker === 'USDC'
                                        ? usdc
                                        : el?.ticker === 'WBTC'
                                        ? bitcoin
                                        : maticIcon
                                    }
                                    alt=""
                                  />
                                </div>
                                <div>
                                  <div className="h-4">{el?.name}</div>
                                  <div className="pay-detail">{el?.ticker}</div>
                                </div>
                              </div>
                              <div>
                                <button
                                  className="purchase-btn"
                                  style={{
                                    width: '80px',
                                    height: '40px',
                                    margin: '0px',
                                    padding: '0px',
                                  }}
                                >
                                  {t('approve')}
                                </button>
                              </div>
                            </div>
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
                className="continue-btn select-payment-method-sell-btn fade-in"
                onClick={() => setStep(4)}
              >
                {t('continue')}
              </div>
            )}
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
                  defaultTab={t('sell').toUpperCase()}
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
                      {'How you want to be paid ?'}
                    </div>
                    <div
                      className="methods-box"
                      style={{
                        height: isMobile() ? '82%' : 'calc(min(490px, 59vh))',
                        marginTop: '20px',
                        overflow: 'hidden',
                      }}
                    >
                      <div className="fullwidth">
                        <PaymentMethodCard
                          title={t('cryptocurrency (matic)')}
                          isCryptoLoading={false}
                          logoSet={[
                            {
                              id: 3,
                              img: maticIcon,
                              class: 'matic-method-logo',
                            },
                          ]}
                          labelBottom={'total estimated'}
                          valueBottom={'2.77768'}
                          unit="matic"
                          onSelect={() => setStep(5)}
                          label2Bottom={''}
                        />
                      </div>
                      {paymentOptions.length > 0 &&
                        paymentOptions.map((el, ind) => {
                          return (
                            <div
                              key={ind}
                              className={classnames(
                                'proxy_method_wrapper dark-area',
                              )}
                              style={{ border: '1px solid #abacb5' }}
                              onClick={handleVoid}
                            >
                              <div className="proxy_method">
                                <div className="proxy_icon">
                                  <ImageComponent
                                    className="proxy_icon"
                                    src={
                                      el?.ticker === 'WETH'
                                        ? ethereum
                                        : el?.ticker === 'USDT'
                                        ? tether
                                        : el?.ticker === 'USDC'
                                        ? usdc
                                        : el?.ticker === 'WBTC'
                                        ? bitcoin
                                        : maticIcon
                                    }
                                    alt=""
                                  />
                                </div>
                                <div>
                                  <div className="h-4">{el?.name}</div>
                                  <div className="pay-detail">{el?.ticker}</div>
                                </div>
                              </div>
                              <div>
                                <button
                                  className="purchase-btn"
                                  style={{
                                    width: '80px',
                                    height: '40px',
                                    margin: '0px',
                                    padding: '0px',
                                  }}
                                >
                                  {t('approve')}
                                </button>
                              </div>
                            </div>
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
                'wallet-description click-on-polygon-sell',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
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
                  defaultTab={t('sell').toUpperCase()}
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
                onClick={() => setStep(6)}
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
                  defaultTab={t('sell').toUpperCase()}
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
                className="complete-btn awarded-xp-sell-btn fade-in"
                onClick={onComplete}
              >
                {t('complete')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TradeTourSell
