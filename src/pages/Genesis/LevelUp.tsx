import React from 'react'
import { useTranslation } from 'react-i18next'

const LevelUp: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="genesis-levelup root-section">
      <div className="genesis-utility-root">
        <div className="genesis-levelup-content">
          <div className="genesis-common-collection-desc">
            <div className="genesis-common-collection-title">
              <b>{t('Post-Launch: ')}</b>
              {t('Trading is key')}
            </div>
            <div>{t('Earn tier points')}</div>
          </div>
          <div className="genesis-useupgrade-img"></div>
        </div>
      </div>
    </div>
  )
}

export default LevelUp
