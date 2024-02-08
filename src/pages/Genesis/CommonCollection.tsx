import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GenesisCollectionCard from '@components/Card/GenesisCollectionCard'
import ArtTrackIcon from '@mui/icons-material/ArtTrack'

interface Props {
  item: any
}
const CommonCollection: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation()

  return (
    <div className="genesis-common-collection root-section">
      <div className="genesis-common-collection-root">
        <div className="genesis-icontitle">
          <ArtTrackIcon />
          <span>{t('the tiers')}</span>
        </div>
        <div className="genesis-common-collection-content">
          <GenesisCollectionCard
            unlocks={item.unlocks}
            label={item.label}
            isPerpetual={item.isPerpetual}
            xpBoost={item.xpBoost}
            index={item.index}
          />
          <div className="genesis-common-collection-desc">
            {t('Each new player drop')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommonCollection
