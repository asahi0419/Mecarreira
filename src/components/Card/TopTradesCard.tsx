import React from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/components/TradeCard.css'
import { useNavigate } from 'react-router-dom'
import { getFlooredFixed, getPlayerLevelClassName } from '@utils/helpers'
import classnames from 'classnames'

interface Props {
  item: any
  index: number
}
const TopTradesCard: React.FC<Props> = ({ item, index }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="box-item trade-card">
      {index ? <div className="trade-index">{index}</div> : null}
      <div className="trade-info-wrapper">
        <div className="trade-name-wrapper">
          <div
            className={classnames(
              'trade-player-name',
              getPlayerLevelClassName(item?.playerlevelid),
            )}
            onClick={() => navigate(`/app/player/${item?.detailpageurl}`)}
          >
            {window.innerWidth > 900 ? item?.name : ''} $
            {item?.ticker ?? 'None'}
          </div>
          <div className="trade-user-name">
            by&nbsp;
            <b onClick={() => navigate(`/app/user/${item?.username}`)}>
              {item?.username ?? 'None'}
            </b>
          </div>
        </div>
        <div className="trade-value-group">
          <div className="trade-value-box">
            <p className="green-color">{t('start')}</p>
            <div className="primary-text-color">
              ${getFlooredFixed(item?.valueentryusd, 2)}
            </div>
          </div>
          <div className="trade-value-box">
            <p className="green-color">{t('now')}</p>
            <div className="primary-text-color">
              ${getFlooredFixed(item?.valuenowusd, 2)}
            </div>
          </div>
          <div
            className={classnames(
              'trade-profit number-color',
              item?.profitusd > 0 ? 'profit' : 'loss',
            )}
          >
            {item?.profitusd > 0 ? '+' : '-'}$
            {getFlooredFixed(Math.abs(item?.profitusd), 2)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopTradesCard
