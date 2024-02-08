import React from 'react'
import { useTranslation } from 'react-i18next'

const Heading: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className="heading-container heading-title-wrapper">
      <div className="mt-60">
        <div className="heading-title capitalize">{t('players')}</div>
      </div>
      <div className="heading-desc">
        <div className="mt-10 pg-xl">{t('push_your_career')}</div>
      </div>
      <div>
        <div className="heading-title capitalize">{t('fans')}</div>
      </div>
      <div className="heading-desc">
        <div className="mt-10 pg-xl">{t('following_was_yesterday')}</div>
      </div>
      <div>
        <div className="heading-title capitalize">{t('business')}</div>
      </div>
      <div className="heading-desc">
        <div className="mt-10 pg-xl">{t('football_is_business')}</div>
      </div>
      <div>
        <div className="heading-title capitalize">{t('blockchain')}</div>
      </div>
      <div className="heading-desc">
        <div className="mt-10 pg-xl">{t('thanks_to_the_extensive_use')}</div>
      </div>
    </div>
  )
}

export default Heading
