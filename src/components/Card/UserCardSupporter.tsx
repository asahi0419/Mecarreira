import React from 'react'
import { useTranslation } from 'react-i18next'
import PlayerImage from '../PlayerImage'
import '@assets/css/components/UserCard.css'
import { useNavigate } from 'react-router-dom'
import {
  getFlooredFixed,
  toKPINumberFormat,
  toNumberFormat,
} from '@utils/helpers'
import classNames from 'classnames'
import { toast } from 'react-hot-toast'
import ImageComponent from '@components/ImageComponent'
import levelIcon from '@assets/images/level.png'

interface Props {
  user: any
  index: number
  playerstats: any
}
const UserCardSupporter: React.FC<Props> = ({ user, index, playerstats }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const getUsdPrice = (coinBalance: number) => {
    const totalValue = playerstats?.matic * coinBalance
    const totalUsd = totalValue * playerstats?.exchangeRateUSD?.rate
    return getFlooredFixed(totalUsd, 3)
  }
  console.log('user', user)
  return (
    <div
      className="user-card user-card-supporter"
      onClick={() => navigate(`/app/user/${user?.username}`)}
    >
      {window.innerWidth > 700 ? (
        <>
          {index ? <div className="user-index">{index}</div> : null}

          <div className="user-content">
            <div className="user-info-wrapper">
              <div className="user-image">
                <div className="image-border">
                  <div
                    className={classNames(
                      'nft-image',
                      user?.avatar ?? 'group-0',
                    )}
                  />
                </div>
              </div>
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
                <div className="user-level-label green-color">{t('owns')}</div>
                <div className="user-level primary-text-color">
                  {getFlooredFixed(user?.ownsprct, 2)}%
                </div>
              </div>
              <div className="user-level-box">
                <div className="user-level-label green-color">{t('token')}</div>
                <div className="user-level primary-text-color">
                  {getFlooredFixed(user?.balance, 2)}
                </div>
              </div>
              <div className="user-level-box">
                <div className="user-level-label green-color">{t('usd')}</div>
                <div className="user-level primary-text-color">
                  ${toKPINumberFormat(getUsdPrice(user?.balance))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="user-content">
            {index ? <div className="user-index">{index}</div> : null}
            <div className="user-info-wrapper">
              <div className="user-image">
                <div className="image-border">
                  <div
                    className={classNames(
                      'nft-image',
                      user?.avatar ?? 'group-0',
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="user-name-wrapper">
              <div className="user-price-wrapper">
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
            <div className="user-level-wrapper">
              <div className="number-color">
                {getFlooredFixed(user?.ownsprct, 2)}%
              </div>
              <div className="number-color">
                ${toKPINumberFormat(getUsdPrice(user?.balance))}
              </div>
              <div className="nft-price">
                {getFlooredFixed(user?.balance, 2)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default UserCardSupporter
