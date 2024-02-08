import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GenesisCollectionCard from '@components/Card/GenesisCollectionCard'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import { isMobile } from '@utils/helpers'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
interface Props {
  items: any[]
}
const Collection: React.FC<Props> = ({ items }) => {
  const { t } = useTranslation()
  const [itemIndex, setItemIndex] = useState(0)

  return (
    <div className="genesis-collection root-section">
      <div className="genesis-collection-root">
        <div className="genesis-icontitle">
          <UnarchiveIcon />
          <span>{t('upgrades')}</span>
        </div>
        <div className="genesis-collection-list">
          {isMobile() ? (
            <CircleCarousel
              items={items.map((item: any, index: number) => (
                <div
                  style={{
                    lineHeight: '16px',
                  }}
                  key={index}
                >
                  <GenesisCollectionCard
                    unlocks={item.unlocks}
                    label={item.label}
                    isPerpetual={item.isPerpetual}
                    key={index}
                    xpBoost={item.xpBoost}
                    index={item.index}
                  />
                </div>
              ))}
              // isFinite={true}
              activeIndex={itemIndex}
              setActiveIndex={setItemIndex}
            />
          ) : (
            <>
              {items.map((item: any, index: number) => {
                return (
                  <GenesisCollectionCard
                    unlocks={item.unlocks}
                    label={item.label}
                    isPerpetual={item.isPerpetual}
                    key={index}
                    xpBoost={item.xpBoost}
                    index={item.index}
                  />
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection
