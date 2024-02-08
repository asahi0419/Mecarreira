import React from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import '@assets/css/components/SubmitButton.css'
import { isMobile } from '@utils/helpers'

interface Props {
  isLoading?: boolean
  isDisabled?: boolean | null
  disableLoading?: boolean | null
  title?: string
  className?: string
  onPress: () => void
  rewardPerc?: boolean
  noSubmit?: boolean
  launch?: boolean
}

const SubmitButton: React.FC<Props> = props => {
  const {
    isLoading = false,
    disableLoading = false,
    isDisabled,
    title,
    className = '',
    onPress,
    rewardPerc,
    noSubmit = false,
    launch,
  } = props
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { loader } = authenticationData

  const loading = !disableLoading && (loader || isLoading)

  return (
    <>
      {!noSubmit ? (
        <div
          id="submit-btn"
          className={classNames(
            'loading-spinner-container mb-40 mt-40',
            loading ? 'show' : '',
          )}
        >
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <div
          className={classNames(
            'spinner size-small',
            isLoading ? '' : 'hidden',
          )}
        ></div>
      )}

      {!noSubmit ? (
        <button
          type="submit"
          className={classNames(
            `form-submit-btn ${className}`,
            loading ? 'hide' : '',
            isDisabled ? 'btn-disabled' : '',
          )}
          disabled={isDisabled ?? false}
          onClick={onPress}
          style={
            rewardPerc
              ? { width: '120px', height: '30px', padding: '18px 60px' }
              : launch
              ? { width: isMobile() ? '' : '320px', padding: '24px 30px' }
              : {}
          }
        >
          {title}
        </button>
      ) : (
        <div
          className={classNames(
            `form-submit-btn ${className}`,
            loading ? 'hide' : '',
            isDisabled ? 'btn-disabled' : '',
          )}
          onClick={onPress}
          style={
            rewardPerc
              ? { width: '120px', height: '30px', padding: '18px 60px' }
              : {}
          }
        >
          {title}
        </div>
      )}
    </>
  )
}

export default SubmitButton
