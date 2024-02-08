import { makeAppInstall } from '@root/apis/onboarding/authenticationSlice'
import { getBrowserName, isPwa } from '@utils/helpers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

const DownloadAppOption = () => {
  const loginInfo = localStorage.getItem('loginInfo')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentBrowser = getBrowserName()

  const handleClick = () => {
    dispatch(makeAppInstall(true))
  }
  return (
    <>
      <div className="social-icons-group download-app-box">
        <span className="blog-title h-2 caps">{t('get the app')}</span>
        <div onClick={handleClick} className="button-box">
          {t('download')}
        </div>
      </div>
    </>
  )
}

export default React.memo(DownloadAppOption)
