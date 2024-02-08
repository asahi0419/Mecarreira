import React from 'react'
import classNames from 'classnames'
// import '@assets/css/components/Spinner.css'
import { useTranslation } from 'react-i18next'
import approxIcon from '@assets/images/approximation.webp'
import dollarIcon from '@assets/images/dollar_mecarreira.webp'
import dollarIconGold from '@assets/images/dollar_mecarreiraGold.webp'
import dollarIconLadies from '@assets/images/dollar_mecarreiraLadies.webp'
import maticIcon from '@assets/images/matic-token-icon.webp'
import Spinner from '@components/Spinner'
import ImageComponent from '@components/ImageComponent'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'

interface Props {
  logoSet: any
  labelBottom: string
  label2Bottom: string
  valueBottom: string
  defaultClassName?: string
  unit: string
  isInsufficientMatics?: boolean
  isInactive?: boolean
  title: string
  className?: string
  isCryptoLoading?: boolean
  isDisabled?: boolean
  onSelect?: () => void
  showBalance?: boolean
}

const PaymentMethodCard: React.FC<Props> = props => {
  const { t } = useTranslation()
  const {
    onSelect,
    logoSet,
    isInsufficientMatics,
    labelBottom,
    label2Bottom,
    valueBottom,
    isCryptoLoading = false,
    isDisabled = false,
    showBalance = true,
    defaultClassName = 'method-card',
  } = props

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData

  return (
    <div
      className={classNames(
        defaultClassName,
        isInsufficientMatics || isDisabled ? 'method-disabled' : '',
      )}
      onClick={onSelect}
    >
      {!isCryptoLoading ? (
        <>
          <div className="h-4">{props?.title}</div>
          <div className="pay-logo-wrapper">
            {logoSet.map((item: any) => (
              <ImageComponent
                key={item.id}
                src={item?.img}
                className={item.class}
                alt=""
              />
            ))}
          </div>
          {isInsufficientMatics ? (
            <div className="danger-funds">{t('Not enough balance')}</div>
          ) : (
            <div className="pay-details-wrapper">
              <div
                className={classNames(
                  'pay-detail',
                  isDisabled ? 'method-disabled' : '',
                )}
              >
                {labelBottom}
              </div>
              {label2Bottom && (
                <div className="label2Bottom">{label2Bottom}</div>
              )}
              {showBalance && (
                <div
                  className={classNames(
                    'pay-detail flex_container',
                    isDisabled ? 'method-disabled' : '',
                  )}
                >
                  <ImageComponent
                    src={approxIcon}
                    className="approx-icon"
                    alt=""
                  />
                  <span>
                    {!isNaN(parseFloat(valueBottom)) ? valueBottom : '0.00'}
                  </span>
                  <ImageComponent
                    src={
                      props?.unit === 'matic'
                        ? maticIcon
                        : selectedThemeRedux === 'Gold'
                        ? dollarIconGold
                        : selectedThemeRedux === 'Ladies'
                        ? dollarIconLadies
                        : dollarIcon
                    }
                    className="currency-icon"
                    alt=""
                  />
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="spinner-wrapper purchase-loader">
          <Spinner
            className="purchase-spinner"
            spinnerStatus={isCryptoLoading}
            title={t('awaiting Confirmation')}
          />
        </div>
      )}
    </div>
  )
}

export default PaymentMethodCard
