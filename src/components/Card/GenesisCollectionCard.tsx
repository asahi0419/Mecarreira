import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import HoverVideoPlayer from 'react-hover-video-player'
import ImageComponent from '@components/ImageComponent'
import InfinityIcon from '@assets/icons/icon/infinity.png'

interface Props {
  unlocks?: any
  label?: string
  isPerpetual: number
  className?: string
  xpBoost?: number
  index?: number
}

const GenesisCollectionCard: React.FC<Props> = ({
  unlocks,
  label,
  isPerpetual,
  className = '',
  xpBoost,
  index,
}) => {
  const { t } = useTranslation()

  return (
    <div className={classNames('genesis-collection-card', className)}>
      <div className="genesis-collection-nft">
        <div className="genesis-collection-nft-cover">
          <HoverVideoPlayer
            videoSrc={`/videos/${index}.mp4`}
            pausedOverlay={
              <div className="genesis-collection-nft-item">
                <span>
                  {label === t('Common') ? t('for sale') : t('only earnable')}
                </span>
                <ImageComponent
                  src={`/videos/${index}.png`}
                  alt=""
                  style={{
                    // Make the image expand to cover the video's dimensions
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            }
            style={{ width: '100%', height: '100%' }}
            loadingOverlay={
              <div className="loading-overlay">
                <div className="loading-spinner" />
              </div>
            }
          />
        </div>
      </div>
      <div className="genesis-collection-nft-bottom">
        <div className={classNames(label, 'genesis-collection-nft-type')}>
          {label}
        </div>
        <div className="genesis-collection-nft-locks">
          {unlocks === -1 || unlocks === 0 ? (
            <img
              src={InfinityIcon}
              alt="icon"
              className="genesis-collection-infinity-icon"
            ></img>
          ) : (
            `${unlocks} ${t('unlocks')}`
          )}
        </div>
        {/* <div className="genesis-collection-nft-percent">
          {`+${xpBoost}% XP`}
        </div> */}
      </div>
    </div>
  )
}

export default GenesisCollectionCard
