import React from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import TrustIcon from '@assets/icons/icon/trust.svg'
import '@assets/css/components/MetamaskButton.css'
import { useTranslation } from 'react-i18next'
import ImageComponent from '@components/ImageComponent'

interface Props {
  onPress: () => void
}

const TrustButton: React.FC<Props> = props => {
  const { onPress } = props
  const { t } = useTranslation()
  return (
    <div className="metamask-btn" onClick={onPress}>
      <ImageComponent loading="lazy" src={TrustIcon} alt="trust-icon" />
      <span>{t('trust')}</span>
      <ArrowForwardIcon fontSize="small" />
    </div>
  )
}

export default TrustButton
