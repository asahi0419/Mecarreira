import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import '@assets/css/components/WalletModal.css'
import { useTranslation } from 'react-i18next'
import masterCardIcon from '@assets/images/mastercard-large.webp'
import visaIcon from '@assets/images/visa-pay.webp'
import applyPayIcon from '@assets/images/apple-pay.webp'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { v4 as uuidv4 } from 'uuid'
import WertWidget from '@wert-io/widget-initializer'
import {
  getQualificationSetting,
  getWalletDetails,
} from '@root/apis/onboarding/authenticationSlice'
import DialogBox from '@components/Dialog/DialogBox'
import { isMobile } from '@utils/helpers'
import classNames from 'classnames'
import ImageComponent from '@components/ImageComponent'
import { THEME_COLORS } from '@root/constants'

interface Props {
  isOpen: boolean
  onClose: any
}
let wertTimeout: any = null

const DepositModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const [wertLoading, setWertLoading] = useState<any>(false)
  const [widgetInitiated, setWidgetInitiated] = useState(false)
  const dispatch = useDispatch()

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    userWalletData: { address },
    currencyRate,
    selectedThemeRedux,
    enablecreditcardpurchase,
  } = authenticationData

  const currency = 'USD'

  const handleWertTopup = amount => {
    if (!enablecreditcardpurchase) {
      return
    }
    setWertLoading(true)
    clearTimeout(wertTimeout)
    const options = {
      // partner_id: '01G2A9N1TZ18NWM0EGCYFX9E33',
      partner_id: process.env.REACT_APP_WERT_PARTNER_ID,
      origin: process.env.REACT_APP_WERT_ORIGIN,
      container_id: 'topup-box',
      address: address,
      click_id: uuidv4(), // unique id of purhase in your system
      width: 370,
      height: 550,
      color_background: THEME_COLORS[selectedThemeRedux]['PrimaryBackground'],
      color_buttons: THEME_COLORS[selectedThemeRedux]['SecondaryForeground'],
      color_buttons_text: THEME_COLORS[selectedThemeRedux]['PrimaryBackground'],
      color_main_text: THEME_COLORS[selectedThemeRedux]['SecondaryText'],
      currency: currency,
      commodity: 'MATIC',
      currency_amount: amount / currencyRate,
      network:
        process.env.REACT_APP_POLYGON_NETWORK === 'MAINNET'
          ? 'network'
          : 'mumbai',
      listeners: {
        loaded: () => console.log('loaded'),
        position: (data: any) => console.log('topup_step:', data.step),
        close: (evt: any) => console.log('topup_CLOSE_WERT:', evt),
        error: (error: any) => console.log('topup_ERROR_WERT:', error),
      },
    }
    const wertTopupWidget = new WertWidget(options)
    console.log('-------wertData-------', options)
    wertTopupWidget.mount()

    const purchaseBox = document.getElementById('topup-box')
    const iframe = purchaseBox.getElementsByTagName('iframe')[0]
    if (iframe) {
      purchaseBox.removeChild(iframe)
    }
    const iframeLength = document.getElementsByTagName('iframe').length
    document.getElementsByTagName('iframe')[iframeLength - 1].style.position =
      'relative'
    document
      .getElementById('topup-box')
      .append(document.getElementsByTagName('iframe')[iframeLength - 1])

    wertTimeout = setTimeout(() => {
      setWidgetInitiated(true)
      setWertLoading(false)
    }, 1000)
  }

  const handleHideWert = () => {
    dispatch(getWalletDetails())
    setWidgetInitiated(false)
  }

  useEffect(() => {
    if (widgetInitiated) {
      document.body.style.overflow = 'hidden'
      if (isMobile()) {
        document.body.style.position = 'fixed'
      }
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
    }
  }, [widgetInitiated])

  return (
    <div
      id="depositModal"
      className={classnames('deposit-modal', isOpen ? 'show' : '')}
    >
      <DialogBox
        isOpen={widgetInitiated}
        onClose={handleHideWert}
        parentClass={isMobile() ? 'flex-dialog' : ''}
      >
        <div id="topup-box" className="wert-widget-wrapper"></div>
        <div className="bottom-close">
          <div className="close-button green-line-btn" onClick={handleHideWert}>
            {t('close')}
          </div>
        </div>
      </DialogBox>
      <div className="wallet-modal-content deposit-modal-content">
        <button className="wallet-modal-close">
          <span onClick={onClose}>&times;</span>
        </button>
        <div className="deposit-title-wrapper">
          <span>{t('top up account')}</span>
          <div className="footer-icons">
            <ImageComponent
              className="card-logo"
              src={applyPayIcon}
              style={{ height: '36px', marginRight: '-7px' }}
              alt=""
            />
            <ImageComponent
              className="card-logo"
              src={visaIcon}
              style={{ height: '35px' }}
              alt=""
            />
            <ImageComponent
              className="card-logo"
              src={masterCardIcon}
              style={{ height: '43px' }}
              alt=""
            />
          </div>
        </div>
        <div className="deposit-amount-wrapper">
          {wertLoading ? (
            <div className="flex-center m-auto">
              <div className="loading-spinner">
                <div className="spinner size-small"></div>
              </div>
            </div>
          ) : (
            <>
              <span
                className={enablecreditcardpurchase ? '' : 'bg-grey-color'}
                onClick={() => handleWertTopup(20)}
              >
                20 {currency}
              </span>
              <span
                className={enablecreditcardpurchase ? '' : 'bg-grey-color'}
                onClick={() => handleWertTopup(50)}
              >
                50 {currency}
              </span>
              <span
                className={enablecreditcardpurchase ? '' : 'bg-grey-color'}
                onClick={() => handleWertTopup(100)}
              >
                100 {currency}
              </span>
              <span
                className={enablecreditcardpurchase ? '' : 'bg-grey-color'}
                onClick={() => handleWertTopup(200)}
              >
                200 {currency}
              </span>
              <span
                className={enablecreditcardpurchase ? '' : 'bg-grey-color'}
                onClick={handleWertTopup}
              >
                {t('other amount')}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DepositModal
