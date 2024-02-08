import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import UtilityListItem from '@components/Genesis/UtilityListItem'
import ManageHistoryIcon from '@mui/icons-material/ManageHistory'

const Utility: React.FC = () => {
  const { t } = useTranslation()
  const utilityLists = [
    {
      title: t('Drop it like its hot'),
      desc: t('player drops start'),
      img: '/img/genesis-util1.webp',
    },
    {
      title: t('Smart Club, Smart Contract'),
      desc: t('each player drop has its'),
      img: '/img/genesis-util2.webp',
    },
    {
      title: t('Just like a Swap'),
      desc: t('buying increases the price'),
      img: '/img/genesis-util3.webp',
    },
    {
      title: t('Be the early bird'),
      desc: t('GENESIS by meCarreira provides early'),
      img: '/img/genesis-util4.webp',
    },
    {
      title: t('First Come, First Served'),
      desc: t('use 1 unlock to trade newly'),
      img: '/img/genesis-util5.webp',
    },
  ]

  return (
    <div className="genesis-utility root-section">
      <div className="genesis-utility-root">
        <div className="genesis-icontitle">
          <ManageHistoryIcon />
          <span>{t('utility nft of the year')}</span>
        </div>
        <div className="genesis-utility-content">
          {utilityLists.map((utilityListItem, index) => (
            <UtilityListItem
              title={utilityListItem.title}
              desc={utilityListItem.desc}
              img={utilityListItem.img}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Utility
