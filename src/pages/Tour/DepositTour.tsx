import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Home from '@assets/icons/icon/home.webp'
import ImageComponent from '@components/ImageComponent'
import classnames from 'classnames'
import FooterNav from '@components/Page/FooterNav'
import { isMobile } from '@utils/helpers'
import WalletForm from '@pages/Wallet/WalletForm'
import WalletDialog from '@components/Dialog/WalletDialog'
import TabGroup from '@components/Page/TabGroup'
import MyWallet from '@pages/Wallet/MyWallet'
import Typed from 'typed.js'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  getCurrencyList,
  setHideTourHeader,
} from '@root/apis/onboarding/authenticationSlice'

interface Props {
  onComplete: () => void
}
const DepositTour: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { nativeAmount, ipLocaleCurrency, getUserSettingsData } =
    authenticationData

  const [step, setStep] = useState(1)
  const [isFadeIn, setIsFadeIn] = useState(true)
  const [showButton, setShowButton] = useState(false)
  const handleVoid = () => console.log('')
  const handleClick = value => {
    // Remove 'fade-in'
    setIsFadeIn(false)
    setStep(value)
    if (value === 4) {
      dispatch(getCurrencyList())
    }
  }

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
      string = t('click_on_the_amount')
    } else if (step === 2) {
      string = t('alternatively_click')
    } else if (step === 3) {
      string = t('visit_your_deposit_center')
      dispatch(setHideTourHeader(true))
    } else if (step === 4) {
      string = t('you_can_deposit_various_cryptocurrencies')
    } else if (step === 5) {
      string = t('your_unique_blockchain_wallet_address')
    } else if (step === 6) {
      string = t('of_course_you_can_deposit')
    }
    const options = {
      strings: [string],
      typeSpeed: 25,
      backSpeed: 30,
      loop: false,
      showCursor: false,
      onStringTyped: () => {
        let subString = ''
        if (step === 2) {
          subString = t('Click on Wallet')
        } else if (step === 3) {
          subString = t('Click on Deposit')
        } else if (step === 4) {
          subString = t('Click on I Understand')
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

  return (
    <div className="deposit-tour-wrapper">
      <div className="dark-overlay"></div>
      <div
        className={classnames(
          step === 1 ? 'top-zIndex' : '',
          'bright-rectangle',
          `bright-rectangle-deposit-tour-step${step}`,
        )}
      >
        {step === 1 ? (
          <>
            <div className="wallet-address">
              <div
                className="header-user-image"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <div className="image-border">
                  <div
                    className={classnames(
                      'nft-image',
                      `${getUserSettingsData?.avatar ?? 'group-0'}`,
                    )}
                  ></div>
                </div>
                <h6
                  className="header-title"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '24px',
                  }}
                >
                  <b>{parseFloat(nativeAmount).toLocaleString()}</b>
                  &nbsp;
                  {getUserSettingsData?.currency ?? ipLocaleCurrency ?? 'USD'}
                </h6>
              </div>
            </div>
            <div
              className={classnames(
                'wallet-description visit-wallet',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
            {showButton && (
              <div
                className="continue-btn visit-wallet-btn fade-in"
                onClick={() => setStep(2)}
              >
                {t('continue')}
              </div>
            )}
          </>
        ) : step === 2 ? (
          <>
            <footer className={classnames('footer')}>
              <div className="footer-wrapper">
                <div className={classnames('home-icon')}>
                  <a>
                    <ImageComponent
                      loading="lazy"
                      src={Home}
                      alt=""
                      className="home-img"
                    />
                  </a>
                </div>
                <div className="footer-nav">
                  <FooterNav
                    onClickPlayer={handleVoid}
                    onClickMyCoin={handleVoid}
                    onClickNFTs={handleVoid}
                    onClickItems={handleVoid}
                    onClickScouts={handleVoid}
                    onClickSignin={handleVoid}
                    onClickWallet={() => handleClick(3)}
                    showMyCoin={!!localStorage.getItem('showMyCoin')}
                  />
                </div>
              </div>
            </footer>
            <div
              className={classnames(
                'wallet-description click-wallet',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
              &nbsp;
              <b className="fg-primary-color" ref={subTypedRef}></b>
            </div>
          </>
        ) : step === 3 ? (
          <>
            <WalletDialog
              isOpen={true}
              onClose={handleVoid}
              isMandatory={false}
              parentClass={isMobile() ? 'flex-dialog' : ''}
            >
              <section className="wallet-container">
                <div className="fullwidth">
                  <TabGroup
                    defaultTab={'balance'}
                    tabSet={['balance', 'shares', 'genesis']}
                    inactiveIndices={[]}
                    transformIndices={[]}
                    tabClassName="wallet-tab"
                    getSwitchedTab={handleVoid}
                  />
                </div>
                <MyWallet
                  onSubmit={handleVoid}
                  onChartView={handleVoid}
                  tourStep={step}
                  onNextTour={() => handleClick(4)}
                />
              </section>
            </WalletDialog>
            <div
              className={classnames(
                'wallet-description visit-deposit',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
              &nbsp;
              <b className="fg-primary-color" ref={subTypedRef}></b>
            </div>
          </>
        ) : step === 4 ? (
          <>
            <WalletDialog
              isOpen={true}
              onClose={handleVoid}
              isMandatory={false}
              parentClass={isMobile() ? 'flex-dialog' : ''}
            >
              <section className="wallet-container">
                <div className="fullwidth">
                  <TabGroup
                    defaultTab={'balance'}
                    tabSet={['balance', 'shares', 'genesis']}
                    inactiveIndices={[]}
                    transformIndices={[]}
                    tabClassName="wallet-tab"
                    getSwitchedTab={handleVoid}
                  />
                </div>
                <MyWallet
                  onSubmit={handleVoid}
                  onChartView={handleVoid}
                  tourStep={step}
                  onNextTour={() => handleClick(5)}
                />
              </section>
            </WalletDialog>
            <div
              className={classnames(
                'wallet-description various-deposit',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
              &nbsp;
              <b className="fg-primary-color" ref={subTypedRef}></b>
            </div>
          </>
        ) : step === 5 ? (
          <>
            <WalletDialog
              isOpen={true}
              onClose={handleVoid}
              isMandatory={false}
              parentClass={isMobile() ? 'flex-dialog' : ''}
            >
              <section className="wallet-container">
                <div className="fullwidth">
                  <TabGroup
                    defaultTab={'balance'}
                    tabSet={['balance', 'shares', 'genesis']}
                    inactiveIndices={[]}
                    transformIndices={[]}
                    tabClassName="wallet-tab"
                    getSwitchedTab={handleVoid}
                  />
                </div>
                <MyWallet
                  onSubmit={handleVoid}
                  onChartView={handleVoid}
                  tourStep={step}
                  onNextTour={() => handleClick(6)}
                />
              </section>
            </WalletDialog>
            <div
              className={classnames(
                'wallet-description crypto-deposit',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
            {showButton && (
              <div
                className="continue-btn fade-in crypto-deposit-btn"
                onClick={() => handleClick(6)}
              >
                {t('continue')}
              </div>
            )}
          </>
        ) : (
          <>
            <WalletDialog
              isOpen={true}
              onClose={handleVoid}
              isMandatory={false}
              parentClass={isMobile() ? 'flex-dialog' : ''}
            >
              <section className="wallet-container">
                <div className="fullwidth">
                  <TabGroup
                    defaultTab={'balance'}
                    tabSet={['balance', 'shares', 'genesis']}
                    inactiveIndices={[]}
                    transformIndices={[]}
                    tabClassName="wallet-tab"
                    getSwitchedTab={handleVoid}
                  />
                </div>
                <MyWallet
                  onSubmit={handleVoid}
                  onChartView={handleVoid}
                  tourStep={step}
                  onNextTour={onComplete}
                />
              </section>
            </WalletDialog>
            <div
              className={classnames(
                'wallet-description money-deposit',
                isFadeIn ? 'fade-in' : '',
              )}
            >
              <b ref={typedRef}></b>
            </div>
            {showButton && (
              <div
                className="complete-btn money-deposit-btn fade-in"
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

export default DepositTour
