import React from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import '@assets/css/components/MetamaskButton.css'
import ImageComponent from '@components/ImageComponent'

interface Props {
  onPress: () => void
}

const CoinbaseButton: React.FC<Props> = props => {
  const { onPress } = props

  return (
    <div className="metamask-btn" onClick={onPress}>
      <ImageComponent loading="lazy" src={CoinbaseIcon} alt="coinbase-icon" />
      <span>COINBASE</span>
      <ArrowForwardIcon fontSize="small" />
    </div>
  )
}

export default CoinbaseButton
