import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import '@assets/css/components/Spinner.css'
import { useTranslation } from 'react-i18next'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

interface Props {
  spinnerStatus?: boolean
  className?: string
  title?: string
  timeout?: boolean
  component?: string
}

const Spinner: React.FC<Props> = props => {
  const { t } = useTranslation()
  const {
    spinnerStatus,
    className = '',
    title,
    timeout,
    component = '',
  } = props
  const [isTimeout, setIsTimeout] = useState(false)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { selectedThemeRedux } = authenticationData
  useEffect(() => {
    timeout &&
      setTimeout(() => {
        setIsTimeout(true)
      }, 10000)
  }, [])

  return (
    <div
      className={classnames(
        'spinner-container',
        className,
        spinnerStatus ? 'show' : '',
      )}
    >
      {isTimeout && component !== 'PlayerCoinRequest' ? (
        <div className="blog-title yellow-color">{t('no_data_found')}</div>
      ) : (
        <>
          <span>{title}</span>
          <div className="spinner mt-10"></div>
        </>
      )}
    </div>
  )
}

export default Spinner
