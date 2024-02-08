import React from 'react'
import { useTranslation } from 'react-i18next'
import Faq from '@components/Page/Faq'
import { useNavigate } from 'react-router-dom'

const Faqs: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="about-content">
      <div className="about-section">
        <span className="blog-title faq-title capitalize">{t(`faq's`)}</span>
        <Faq showButton={true} />
        <div className="get-more-btn" onClick={() => navigate('/faqs')}>
          {t('show more')}
        </div>
      </div>
    </div>
  )
}

export default Faqs
