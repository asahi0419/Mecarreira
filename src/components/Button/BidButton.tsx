import React from 'react'
import classNames from 'classnames'
import '@assets/css/components/SubmitButton.css'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'

interface Props {
  isLoading?: boolean
  isDisabled?: boolean
  title?: string
  className?: string
  onPress: any
  kiosk?: boolean
}

const BidButton: React.FC<Props> = props => {
  const { isLoading, isDisabled, title, className = '', onPress, kiosk } = props
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { selectedThemeRedux } = authenticationData
  return (
    <>
      <div
        className={classNames(
          'loading-spinner-container mb-40',
          isLoading ? 'show' : '',
          kiosk ? '' : 'mt-40',
        )}
      >
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
      <button
        type="submit"
        className={classNames(
          `form-submit-btn ${className}`,
          isLoading ? 'hide' : '',
          isDisabled ? 'btn-disabled' : '',
        )}
        disabled={isDisabled}
        onClick={onPress}
      >
        {title}
      </button>
    </>
  )
}

export default BidButton
