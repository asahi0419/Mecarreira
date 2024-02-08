import React, { useState } from 'react'
import classnames from 'classnames'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import usdc from '@assets/images/usdc.webp'
import bitcoin from '@assets/images/wrapped-bitcoin.webp'
import tether from '@assets/images/tether.webp'
import ethereum from '@assets/images/ethereum-eth.webp'
import maticIcon from '@assets/images/matic-token-icon.webp'
import TooltipLabel from '@components/TooltipLabel'
import ImageComponent from '@components/ImageComponent'
import visaIcon from '@assets/images/visa-white.webp'
import visaIconBlack from '@assets/images/visa.webp'
import masterCardIcon from '@assets/images/mastercard-large.webp'
import ApplePayIcon from '@assets/images/apple_pay.webp'
import PaymentMethodCard from '@pages/PurchaseNft/components/PaymentMethodCard'
import { isMobile } from '@utils/helpers'
import { IsDevelopment } from '@root/constants'
interface Props {
  title: string
  address?: string
  isMaticDeposit?: boolean
  containerClassName?: string
  onSelect: () => void
  onClose: () => void
  isLoading?: boolean
  tourStep?: number
  onNextTour?: any
}

const Deposit: React.FC<Props> = ({
  containerClassName = '',
  title,
  address,
  isMaticDeposit = false,
  onSelect,
  onClose,
  isLoading,
  tourStep,
  onNextTour,
}) => {
  const [isAddressCopied, setAddressCopied] = useState(false)
  const { t } = useTranslation()
  const handleCopy = () => {
    setAddressCopied(!isAddressCopied)
    navigator.clipboard.writeText(address ?? 's')
  }
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    currencyListData: { payment_options = [] },
    selectedThemeRedux,
    enablecreditcardpurchase,
  } = authenticationData

  const [iUnderstand, setIUnderstand] = useState(true)
  const handleIUnderstand = () => {
    if (tourStep === 4) {
      onNextTour()
    }
    setIUnderstand(false)
  }

  return (
    <section
      className={classnames(
        'wallet-container deposit-address-container deposit',
        containerClassName,
      )}
    >
      {tourStep === 6 && <div className="dark-overlay"></div>}
      <div
        className={classnames(
          'fullwidth m0-auto mb-0 wallet-heading mt-0 passphrase-heading',
          tourStep === 6 ? 'bright-area' : '',
        )}
        style={{ lineHeight: '0%' }}
      >
        <p className="sub-title">{t('money_deposit')}</p>
      </div>
      <div className={classnames('mt-20', tourStep === 6 ? 'bright-area' : '')}>
        <PaymentMethodCard
          title=""
          defaultClassName={classNames(
            'address-box m0-auto method-card topup-option-wrapper',
            enablecreditcardpurchase ? '' : 'method-disabled',
          )}
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
            { id: 2, img: masterCardIcon, class: 'mc-method-logo' },
            { id: 3, img: ApplePayIcon, class: 'mc-method-logo' },
          ]}
          labelBottom={t('load_up_your_balance_with')}
          label2Bottom={t('credit_card_or_apple_pay')}
          showBalance={false}
          // unit="dollar"
          onSelect={onSelect}
          isCryptoLoading={isLoading}
          isDisabled={false}
          // isInsufficientMatics={isFundsInsufficient}
        />
      </div>
      <div
        className={classnames(
          'fullwidth m0-auto mb-0 wallet-heading mt-40 passphrase-heading',
          tourStep === 5 ? 'bright-area' : '',
        )}
        style={{ lineHeight: '0%' }}
      >
        <p className="sub-title">{title}</p>
      </div>
      {!isMaticDeposit ? (
        <p className="wallet-text form-note private-key-alert ">
          {t('do never share this key with anyone')}
          <br />
          {t('this key alone, can access your crypto')}
        </p>
      ) : null}
      {iUnderstand || tourStep === 6 ? ( // For last step of deposit tour, it should show this part
        <>
          {tourStep === 4 && <div className="dark-overlay"></div>}
          <div
            className={classnames(
              'crypto_deposit_warning',
              tourStep === 4 ? 'bright-area' : '',
            )}
          >
            <p className="warning_text">
              {t('only_cryptocurrencies_i_understand')}
            </p>
            <button
              onClick={handleIUnderstand}
              className="form-submit-btn wallet-btn withdraw __web-inspector-hide-shortcut__ mt-10"
            >
              {t('i_understand')}
            </button>
          </div>
        </>
      ) : (
        <>
          {tourStep === 5 && <div className="dark-overlay"></div>}
          <div
            className={classnames(
              'crypto_deposit',
              tourStep === 5 ? 'bright-area' : '',
            )}
          >
            <div className="address-box m0-auto">
              <p>{address}</p>
              <div className="flex-center">
                <div
                  className="copy-button tooltip"
                  onClick={() => handleCopy()}
                  onMouseLeave={() => setAddressCopied(false)}
                >
                  <span
                    className={classnames(
                      'tooltiptext',
                      isAddressCopied ? 'tooltip-visible' : '',
                    )}
                  >
                    {t('copied')}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <p className="accepted_cryptocurrencies_text">
                {t('accepted_cryptocurrencies')}
              </p>
              <div className="accepted_cryptocurrencies mb-10">
                <TooltipLabel title="Matic">
                  <div style={{ cursor: 'pointer' }}>
                    <ImageComponent
                      className="proxy_icon"
                      src={maticIcon}
                      alt=""
                    />
                  </div>
                </TooltipLabel>
                {payment_options.map((element, index) => {
                  return (
                    <TooltipLabel key={index} title={element?.name}>
                      <div key={index} style={{ cursor: 'pointer' }}>
                        <ImageComponent
                          className="proxy_icon"
                          style={
                            (element?.ticker === 'USDT' &&
                              selectedThemeRedux === 'Dark') ||
                            (element?.ticker === 'WBTC' &&
                              selectedThemeRedux === 'Dark')
                              ? { width: '48px', height: '48px' }
                              : {}
                          }
                          src={
                            element?.ticker === 'WETH'
                              ? ethereum
                              : element?.ticker === 'USDT'
                              ? tether
                              : element?.ticker === 'USDC'
                              ? usdc
                              : element?.ticker === 'WBTC'
                              ? bitcoin
                              : maticIcon
                          }
                          alt=""
                        />
                      </div>
                    </TooltipLabel>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
      <div
        className={classNames(
          'green-line-btn',
          isMaticDeposit ? 'export-deposit-key' : 'export-pk-cancel',
        )}
        style={isMobile() ? { margin: '10px 0px 20px 0px' } : {}}
        onClick={onClose}
      >
        {t('close')}
      </div>
    </section>
  )
}

export default Deposit
