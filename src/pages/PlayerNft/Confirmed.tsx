import ImageComponent from '@components/ImageComponent'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
}

const Confirmed: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation()
  return (
    <div className="nft-confirmed-container">
      <div className="nft-confirmed-heading">
        {t('transaction has been sent')}
      </div>
      <ImageComponent
        src={require('@assets/images/check.webp')}
        className="nft-confirmed-img"
      />
      <div className="nft-confirmed-button">
        <button className="nft-send confirmed">{t('show on explorer')}</button>
        <div className="nft-confirmed-close" onClick={onClose}>
          {t('close')}
        </div>
      </div>
    </div>
  )
}

export default Confirmed
