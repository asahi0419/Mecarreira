import React from 'react'
import classNames from 'classnames'
// import '@assets/css/components/Spinner.css'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import masterCardIcon from '@assets/images/mastercard.webp'
import visaIcon from '@assets/images/visa.webp'
import ImageComponent from '@components/ImageComponent'

interface Props {
  disabled?: boolean
  className?: string
  onPress: () => void
}

const CreditCardButton: React.FC<Props> = props => {
  const { t } = useTranslation()
  const { disabled, className = '', onPress } = props
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { loadingBuy, selectedThemeRedux } = authenticationData

  return (
    <>
      <div
        className={classNames('spinner size-small', loadingBuy ? '' : 'hidden')}
      ></div>
      <div
        className={classNames(
          `purchase-btn ${className}`,
          disabled || loadingBuy ? 'hide' : '',
        )}
        onClick={onPress}
      >
        <span>{t('buy with')}</span>
        <ImageComponent className="card-logo" src={visaIcon} alt="" />
        <ImageComponent className="card-logo" src={masterCardIcon} alt="" />
      </div>
    </>
  )
}

export default CreditCardButton
