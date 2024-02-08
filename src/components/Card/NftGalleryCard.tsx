import React from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/components/NftGalleryCard.css'
import { NFT_STATUS, PLAYER_STATUS } from '@root/constants'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import ImageComponent from '@components/ImageComponent'
interface Props {
  img: any
  className?: string
  status: number
  playerstatus: number
  onClick?: () => any
  onLaunch?: () => any
}

const NftGalleryCard: React.FC<Props> = ({
  img,
  className,
  status,
  playerstatus,
  onClick,
  onLaunch,
}) => {
  const { t } = useTranslation()

  const handleLaunch = (event: any) => {
    event.stopPropagation()
    onLaunch && onLaunch()
    // if (playerstatus !== PLAYER_STATUS.PRO) {
    //   setTimeout(() => {
    //     toast.error(t('only pro player can launch'))
    //   }, 1000)
    //   return
    // } else {
    //   onLaunch && onLaunch()
    // }
  }

  return (
    <div className={`nft-gallery-card ${className}`} onClick={onClick}>
      <HotToaster />
      <ImageComponent src={img} className="nft-gallery-img" />
      {status === NFT_STATUS.INITIAL ? (
        <></>
      ) : status === NFT_STATUS.AUCTION ? (
        <div className="nft-gallery-label">{t('auction')}</div>
      ) : status === NFT_STATUS.RAFFLE ? (
        <div className="nft-gallery-label">{t('raffle')}</div>
      ) : status === NFT_STATUS.MINTED ? (
        <div className="nft-gallery-label">{t('minted')}</div>
      ) : status === NFT_STATUS.PUBLIC ? (
        <div className="nft-gallery-lanchbtn" onClick={handleLaunch}>
          {t('launch')}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default NftGalleryCard
