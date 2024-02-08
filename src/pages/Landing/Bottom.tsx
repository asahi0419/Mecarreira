import React from 'react'
import { useTranslation } from 'react-i18next'
import ContactUs from '@components/Page/Navigation/ContactUs'
import SocialGroup from '@components/Page/Navigation/SocialGroup'
import classNames from 'classnames'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import DownloadAppOption from '@components/DownloadAppOption'
import { getBrowserName, isPwa } from '@utils/helpers'

const Bottom: React.FC = () => {
  const loginInfo = localStorage.getItem('loginInfo')
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const currentBrowser = getBrowserName()
  const { selectedThemeRedux } = authenticationData
  return (
    <div
      className={classNames(
        'bottom',
        selectedThemeRedux === 'Black' ? 'footer-black' : '',
      )}
    >
      <div>
        <SocialGroup showAppInstallOption />
        <div className="bottom-line first-line"></div>
        <span className="blog-title company-title h-2">meCarreira.com</span>
        <span className="blog-content company-content pg-lg">
          {t('Empower your football journey and turn your passion')}
        </span>
        <ContactUs isFooter />
        <div className="bottom-line"></div>
        <div className="blog-content copyright pg-lg">
          © {new Date().getFullYear()} meCarreira.com
        </div>
        <div className="genesis-pweredby-ticket">
          <img src="/img/poweredby.webp" alt="matic-icon"></img>
        </div>
      </div>
    </div>
  )
}

export default Bottom
