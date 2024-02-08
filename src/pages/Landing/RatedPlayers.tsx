import { API_CONSTANTS, PLAYER_LEVEL_ID } from '@root/constants'
import { getFlooredNumber } from '@utils/helpers'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const RatedPlayers: React.FC = () => {
  const { t } = useTranslation()

  const [loaded, setLoaded] = useState(false)
  const [investmentList, setInvestmentList] = useState<any[]>([
    {
      level_id: PLAYER_LEVEL_ID.VANILLA,
      type: 'vanilla',
      value: 0,
    },
    {
      level_id: PLAYER_LEVEL_ID.BRONZE,
      type: 'bronze',
      value: 0,
    },
    {
      level_id: PLAYER_LEVEL_ID.SILVER,
      type: 'silver',
      value: 0,
    },
    {
      level_id: PLAYER_LEVEL_ID.GOLD,
      type: 'gold',
      value: 0,
    },
    {
      level_id: PLAYER_LEVEL_ID.DIAMOND,
      type: 'diamond',
      value: 0,
    },
  ])

  useEffect(() => {
    axios
      .get(`${API_CONSTANTS.HOST_URL}/players/player_level_requirement`)
      .then(list => {
        list.data?.data.map(list_item => {
          const investmentListArray = [...investmentList]
          investmentListArray.filter(
            item => item.level_id === list_item.level_id,
          )[0].value =
            list_item.level_requirement * list.data?.exchangeRateUSD[0]?.rate
          setInvestmentList(investmentListArray)
          setLoaded(true)
        })
      })
  }, [])
  return (
    <div className="section-wrapper">
      <div className="section-title">{t('players ratings')}</div>
      <div className="section-content">
        <div className="rate-card">
          <div className="rate-card-image diamond-img" />
          <div className="rate-card-text">
            <div className="rate-card-title player_level_diamond">
              {t('diamond')}
            </div>
            <div className="rate-card-desc nft_level_diamond">
              {t('diamonds are made under')}
            </div>
          </div>
        </div>
        <div className="rate-card">
          <div className="rate-card-image gold-img" />
          <div className="rate-card-text">
            <div className="rate-card-title player_level_gold">{t('gold')}</div>
            <div className="rate-card-desc nft_level_gold">
              {t('our_gold_stars_are')}
            </div>
          </div>
        </div>
        <div className="rate-card">
          <div className="rate-card-image silver-img" />
          <div className="rate-card-text">
            <div className="rate-card-title player_level_silver">
              {t('silver')}
            </div>
            <div className="rate-card-desc nft_level_silver">
              {t('silver players have')}
            </div>
          </div>
        </div>
        <div className="rate-card">
          <div className="rate-card-image bronze-img" />
          <div className="rate-card-text">
            <div className="rate-card-title player_level_bronze">
              {t('bronze')}
            </div>
            <div className="rate-card-desc nft_level_bronze">
              {t('distinguish from the crowd')}
            </div>
          </div>
        </div>
        {investmentList.map((card, index) => (
          <div className="investment-card" key={index}>
            <div className="investment-card-text">
              <div className={`investment-card-image ${card.type}-img`} />
              <div
                className={`investment-card-title player_level_${card.type}`}
              >
                {t(card.type)}
              </div>
            </div>
            <div className={`investment-card-desc nft_level_${card.type}`}>
              <div>{t('Investment higher than')}</div>
              {loaded ? (
                <div className="investment-card-value">
                  ${getFlooredNumber(card.value)}
                </div>
              ) : (
                <div className="investment-card-value skeleton">&nbsp;</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RatedPlayers
