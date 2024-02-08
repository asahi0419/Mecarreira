import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onChangeView: (v: boolean) => void
}
const Secondbanner: React.FC<Props> = ({ onChangeView }) => {
  const { t } = useTranslation()
  const [isPlayerView, setIsPlayerView] = useState(false)

  const handleClick = value => {
    setIsPlayerView(value)
    onChangeView(value)
  }

  return (
    <div className="new-landing-banner player-creation-container">
      <div className="new-landing-second-banner-container">
        <div className="new-landing-second-banner-text-wrapper">
          <div className="new-landing-second-banner-title">
            <span>{t('HAVE YOU EVER WATCHED')}</span>
            <p>{t('THIS PLAYER IS DESTINED')}</p>
          </div>
          <div className="new-landing-second-banner-subtitle">
            {t('Trade players like you would')}
            {window.innerWidth >= 3286 ? <br /> : ''}
            {t("Whether you're a seasoned trader")}
          </div>
          <div className="new-landing-second-banner-btn-group">
            <div
              className={`get-more-btn player-btn ${
                isPlayerView ? '' : 'disabled'
              }`}
              onClick={() => handleClick(true)}
            >
              {t('I am a footballer')}
            </div>
            <div
              className={`get-more-btn scout-btn ${
                isPlayerView ? 'disabled' : ''
              }`}
              onClick={() => handleClick(false)}
            >
              {t('Become a Scout')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Secondbanner
