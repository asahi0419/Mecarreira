import React from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WalletConnectIcon from '@assets/icons/icon/walletconnect.svg'
import '@assets/css/components/MetamaskButton.css'
import { useTranslation } from 'react-i18next'
import ImageComponent from '@components/ImageComponent'

interface Props {
  onPress: () => void
}

const WalletConnectButton: React.FC<Props> = props => {
  const { onPress } = props
  const { t } = useTranslation()
  return (
    <div className="metamask-btn" onClick={onPress}>
      <ImageComponent
        loading="lazy"
        src={WalletConnectIcon}
        alt="walletconnect-icon"
      />
      <span>{t('walletconnect')}</span>
      <ArrowForwardIcon fontSize="small" />
    </div>
  )
}

export default WalletConnectButton
