import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CheckIcon from '@mui/icons-material/Check'
import CheckeredFlagIcon from '@assets/icons/icon/checkered_flag.png'
import QuizIcon from '@mui/icons-material/Quiz'

const UseNFT: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="genesis-usenft root-section">
      <div className="genesis-utility-root">
        <div className="genesis-icontitle">
          <QuizIcon />
          <span>{t('How To Upgrade')}</span>
        </div>
        <div className="genesis-useupgrade-content">
          <div className="genesis-useupgrade-img"></div>
          <div className="genesis-common-collection-desc">
            <div className="genesis-common-collection-title">
              <b>{t('Pre-Launch: ')}</b>
              {t('Engage & Elevate')}
            </div>
            <div>{t('Boost your NFT tier')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseNFT
