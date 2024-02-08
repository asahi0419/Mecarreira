import React, { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Logo from '@assets/images/logo-min.webp'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { isMobile } from '@utils/helpers'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import Spinner from '@components/Spinner'
import useQualificationStatus from '@utils/hooks/qualificationStatusHook'

let redirectTimeout = null
export function RootLayout() {
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    QualificationSettingData,
    qualifiedPublicKey,
    qualifiedInviteLinked,
  } = authenticationData

  const [isPageAccessRestricted] = useQualificationStatus()

  const handleAccess = () => {
    console.log('HAReload')
    window.location.href = '/'
  }

  useEffect(() => {
    clearTimeout(redirectTimeout)
    if (
      ([1, 2, 3].includes(QualificationSettingData) &&
        getIsAccessRestricted()) ||
      QualificationSettingData === 0
    ) {
      redirectTimeout = setTimeout(() => {
        handleAccess()
      }, 5000)
    }
  }, [QualificationSettingData])

  const getIsAccessRestricted = () => {
    if (parseInt(QualificationSettingData) === 0) {
      // isPageAccessRestricted = true
      return true
    } else if (parseInt(QualificationSettingData) === 1) {
      if (!localStorage.getItem('loginInfo')) {
        // isPageAccessRestricted = true
        return true
      } else {
        // isPageAccessRestricted = false
        if (qualifiedInviteLinked === false) {
          // isPageAccessRestricted = true
          return true
        } else {
          // isPageAccessRestricted = false
          return false
        }
      }
    } else if (parseInt(QualificationSettingData) === 2) {
      if (!qualifiedPublicKey) {
        // isPageAccessRestricted = true
        return true
      } else {
        // isPageAccessRestricted = false
        return false
      }
    } else if (parseInt(QualificationSettingData) === 3) {
      // isPageAccessRestricted = false
      return false
    }
  }

  return (
    <>
      {QualificationSettingData === null ||
      QualificationSettingData === undefined ? (
        <div className="main_content_wrapper">
          <div className="denied_header">
            <ArrowBackIcon onClick={handleAccess} className="icon-color" />
            <img src={Logo} style={{ width: '120px' }} alt="" />
            <div className="icon-color" style={{ margin: '32px' }}>
              {' '}
            </div>
          </div>
          <div
            className={classNames(
              'main_content',
              isMobile() ? 'main_content_mobile' : 'main_content_desktop',
            )}
          >
            <div>
              <img src={Logo} style={{ width: '120px' }} alt="" />
            </div>
            <div className="access_denied_heading m-0">
              {t('checking status')}
            </div>
            <div className="bottom-caption-wrapper">
              <span
                className="blog-content bottom-content pg-lg text-left"
                style={{ fontSize: '20px' }}
              >
                {t('please wait')}..
              </span>
            </div>
            <div style={{ marginTop: '-40px' }}>
              <Spinner spinnerStatus={true} title={''} />
            </div>
          </div>
        </div>
      ) : ([1, 2, 3].includes(QualificationSettingData) &&
          getIsAccessRestricted()) ||
        QualificationSettingData === 0 ? (
        <div className="main_content_wrapper">
          <div className="denied_header">
            <ArrowBackIcon onClick={handleAccess} className="icon-color" />
            <img src={Logo} style={{ width: '120px' }} alt="" />
            <div className="icon-color" style={{ margin: '32px' }}>
              {' '}
            </div>
          </div>
          <div
            className={classNames(
              'main_content',
              isMobile() ? 'main_content_mobile' : 'main_content_desktop',
            )}
          >
            <div>
              <img src={Logo} style={{ width: '120px' }} alt="" />
            </div>
            <div className="access_denied_heading">
              {t('you do not have app access')}
            </div>
            <div
              className={classNames('green-line-btn mt-40')}
              style={{
                color: '#6bc909',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => handleAccess()}
            >
              {t('back to homepage')}
            </div>
          </div>
        </div>
      ) : ([1, 2, 3].includes(QualificationSettingData) &&
          !getIsAccessRestricted()) ||
        QualificationSettingData === 3 ? (
        <Outlet />
      ) : null}
    </>
  )
}
