import GenesisNftCard from '@components/Card/GenesisCollectionCard'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isMobile } from '@utils/helpers'
import RecordIcon from '@assets/icons/icon/record.png'
import CircleCarousel from '@components/Carousel/CircleCarousel'

interface Props {
  items: any[]
}

const MintedLive: React.FC<Props> = ({ items }) => {
  const { t } = useTranslation()
  const [itemIndex, setItemIndex] = useState(0)
  const getPercent = value => {
    const sum = items.reduce((sum, item) => {
      return sum + item.minted
    }, 0)
    return sum === 0 ? 0 : Math.round((value / sum) * 100)
  }

  return (
    <div className="genesis-mintedlive root-section">
      <div className="genesis-mintedlive-root">
        <div className="genesis-mintedlive-title-container">
          <div className="genesis-title">{t('live')}</div>
          <span className="genesis-mintedlive-title-icon">
            <img src={RecordIcon} alt="live-icon"></img>
          </span>
        </div>
        <div className="genesis-mintedlive-container">
          {isMobile() ? (
            <CircleCarousel
              items={items.map((item: any, index: number) => (
                <div className="genesis-mintedlive-common-card" key={index}>
                  <div
                    className={`${item.label} genesis-mintedlive-common-card-label`}
                  >
                    {item.label}
                  </div>
                  <div className="genesis-mintedlive-common-card-number">
                    {item.minted.toString().padStart(2, '0')}
                  </div>
                  <div className="genesis-mintedlive-common-card-percent">
                    {getPercent(item.minted)}%
                  </div>
                </div>
              ))}
              activeIndex={itemIndex}
              setActiveIndex={setItemIndex}
            />
          ) : (
            <>
              {items.map((item: any, index: number) => {
                return (
                  <div className="genesis-mintedlive-common-card" key={index}>
                    <div
                      className={`${item.label} genesis-mintedlive-common-card-label`}
                    >
                      {item.label}
                    </div>
                    <div className="genesis-mintedlive-common-card-number">
                      {item.minted}
                    </div>
                    <div className="genesis-mintedlive-common-card-percent">
                      {getPercent(item.minted)}%
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MintedLive
