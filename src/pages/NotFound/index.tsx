import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '@components/Page/AppLayout'
import { useTranslation } from 'react-i18next'

const NotFound: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <AppLayout className="home" headerStatus="showHeader" footerStatus="hidden">
      <section
        className="verification-container fullwidth"
        style={{ height: '110vh' }}
      >
        <div
          className="email-verification-container not-found"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h2 className="page-heading">{t('404! page not found')}</h2>
          <div
            className="button-box button1"
            onClick={() => {
              navigate('/')
            }}
          >
            {t('go to home')}
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default NotFound
