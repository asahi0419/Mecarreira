import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import '@assets/css/components/CookiePolicy.css'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

interface Props {
  handleOverlayer: (status: boolean) => void
}

const CookiePolicyModal: React.FC<Props> = ({ handleOverlayer }) => {
  const [accepted, setAccepted] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const cookies = new Cookies()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  useEffect(() => {
    const isAccepted = cookies.get('cookieAccepted')

    if (isAccepted || currentPath === '/cookie-policy') {
      setAccepted(true)
    } else {
      setAccepted(true)
    }
    setLoaded(true)
  })

  useEffect(() => {
    if (accepted) {
      handleOverlayer(false)
    } else {
      handleOverlayer(true)
    }
  }, [accepted])

  const acceptCookiePolicy = () => {
    try {
      const cookieValue = ['PC', 'FC', 'TC']
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
      cookies.set('cookieAccepted', cookieValue, {
        path: '/',
        expires: oneYearFromNow,
        domain: '.mecarreira.com',
      })
      setAccepted(true)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleCustomize = () => {
    handleOverlayer(false)
    navigate('/cookie-policy')
  }

  if (accepted) {
    return null // Render nothing if the cookie policy is already accepted
  }

  return (
    <div
      className={`cookie-policy-banner ${accepted ? 'accepted-banner' : ''} ${
        !loaded ? 'hidden' : ''
      }`}
    >
      <div className="cookie-policy-banner-content">
        <div className="cookie-policy-banner-text">
          {t('We use cookies and similar technologies')} &nbsp;
          <span
            className="cookie-policy-link-text"
            onClick={() => navigate('/cookie-policy')}
          >
            {t('cookie policy')}.
          </span>
        </div>
        <div className="cookie-policy-banner-buttons">
          <div
            className="cookie-policy-banner-custom-btn cookie-policy-banner-btn"
            onClick={() => handleCustomize()}
          >
            {t('Customize')}
          </div>
          <div
            className="cookie-policy-banner-enable-btn cookie-policy-banner-btn"
            onClick={() => acceptCookiePolicy()}
          >
            {t('Enable all')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicyModal
