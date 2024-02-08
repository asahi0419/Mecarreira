import React from 'react'
import classNames from 'classnames'
// import '@assets/css/components/Spinner.css'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

interface Props {
  disabled?: boolean
  title?: string
  className?: string
  onPress: () => void
}

const PurchaseButton: React.FC<Props> = props => {
  const { t } = useTranslation()
  const { disabled, title = '', className = '', onPress } = props
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
        // type="submit"
        disabled={disabled}
        className={classNames(
          `purchase-btn ${className}`,
          disabled || loadingBuy ? 'hide' : '',
        )}
        onClick={onPress}
      >
        {t(title)}
      </div>
    </>
  )
}

export default PurchaseButton
