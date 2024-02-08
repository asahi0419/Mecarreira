import React from 'react'
import { useTranslation } from 'react-i18next'
import PlayerImage from '../PlayerImage'
import '@assets/css/components/UserCard.css'
import { useNavigate } from 'react-router-dom'
import {
  getFlooredFixed,
  toKPIIntegerFormat,
  toKPINumberFormat,
  toNumberFormat,
  toUsd,
} from '@utils/helpers'
import classNames from 'classnames'
import { toast } from 'react-hot-toast'
import ImageComponent from '@components/ImageComponent'
import levelIcon from '@assets/images/level.png'

interface Props {
  user: any
  index: number
  playerstats?: any
}
const ScoutsCardSupporter: React.FC<Props> = ({ user, index, playerstats }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div
      className="user-card user-scouts-card-supporter"
      onClick={() => navigate(`/app/user/${user?.username}`)}
    >
      <div className="user-content">
        {index ? <div className="user-index">{index}</div> : null}
        <div className="user-info-wrapper">
          <div className="user-image">
            <div className="image-border">
              <div
                className={classNames('nft-image', user?.avatar ?? 'group-0')}
              />
            </div>
          </div>
        </div>
        <div className="user-name-wrapper">
          <div className="user-price-wrapper">
            <div className="user-name">
              <div className="user-name-text">
                {user?.username ?? t('none')}
              </div>
              <div className="user-feed-level-wrapper">
                <div className="user-feed-level">
                  {user?.lifetimelevel ?? t('none')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-level-group">
        <div className="user-level-wrapper">
          <div className="number-color">{t('invested')}</div>
          <div className="nft-price">
            $
            {toKPINumberFormat(
              toUsd(user?.invested, user?.exchangeRateUSD?.rate),
            )}
          </div>
        </div>
        <div className="user-level-wrapper">
          <div className="number-color">{t('season')}</div>
          <div className="nft-price">
            {toKPIIntegerFormat(user?.xp)}&nbsp;<i>XP</i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScoutsCardSupporter
