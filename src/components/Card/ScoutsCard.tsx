import React from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/components/UserCard.css'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import {
  toKPIIntegerFormat,
  toKPINumberFormat,
  toNumberFormat,
  toUsd,
  truncateFloat,
} from '@utils/helpers'
import levelIcon from '@assets/images/level.png'
import ImageComponent from '@components/ImageComponent'

interface Props {
  user: any
  index: number
  paidCount?: number
}
const ScoutsCard: React.FC<Props> = ({ user, index, paidCount = 0 }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div
      className="user-card"
      onClick={() => navigate(`/app/user/${user?.username}`)}
    >
      {
        <>
          <div
            className={
              paidCount >= index ? 'user-index user-gold-text' : 'user-index'
            }
          >
            {index}
          </div>
          <div className="user-content">
            <div className="user-image">
              <div className="image-border">
                <div
                  className={classNames('nft-image', user?.avatar ?? 'group-0')}
                />
              </div>
            </div>
            <div className="user-card-scouts-content">
              <div className="user-card-feed-name-info">
                <div className="user-name-wrapper">
                  <div className="user-name">
                    <div className="user-name-text">
                      {user?.username ?? 'None'}
                    </div>
                    <div className="user-feed-level-wrapper">
                      <div className="user-feed-level">
                        {user?.lifetimelevel ?? 'None'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="user-level-group">
                <div className="user-level-box">
                  <div className="user-level-label green-color">
                    {t('invested')}
                  </div>
                  <div className="user-level primary-text-color">
                    $
                    {toKPINumberFormat(
                      toUsd(user?.invested, user?.exchangeRateUSD?.rate),
                    )}
                  </div>
                </div>
                <div className="user-level-box">
                  <div className="user-level-label green-color">
                    {t('season')}
                  </div>
                  <div className="user-level primary-text-color">
                    {toKPIIntegerFormat(user?.xp)}&nbsp;<i>XP</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default ScoutsCard
