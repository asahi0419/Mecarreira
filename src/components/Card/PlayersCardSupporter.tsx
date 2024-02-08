import React from 'react'
import { useTranslation } from 'react-i18next'
import PlayerImage from '@components/PlayerImage'
import '@assets/css/components/UserCard.css'
import { useNavigate } from 'react-router-dom'
import {
  getFlooredNumber,
  getMarketValue,
  getFlooredFixed,
  getUsdFromMatic,
  getCircleColor,
  toNumberFormat,
  getPlayerLevelClassName,
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
const PlayersCardSupporter: React.FC<Props> = ({
  user,
  index,
  playerstats,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const getUsdPrice = (coinBalance: number) => {
    const totalValue = playerstats?.matic * coinBalance
    const totalUsd = totalValue * playerstats?.exchangeRateUSD?.rate
    return getFlooredFixed(totalUsd, 3)
  }

  console.log(user)

  return (
    <div
      className="user-card user-scouts-card-supporter nft-item"
      onClick={() => navigate(`/app/user/${user?.detailpageurl}`)}
    >
      <div className="user-content">
        <div className="user-info-wrapper nft-image-section">
          <div
            className="image-border"
            style={{
              background: getCircleColor(user?.playerlevelid),
            }}
          >
            <PlayerImage
              src={user.playerpicturethumb}
              className="nft-image"
              hasDefault={true}
            />
          </div>
        </div>
        <div className="user-name-wrapper">
          <div className="user-price-wrapper">
            <div
              className={`${getPlayerLevelClassName(
                user?.playerlevelid,
              )} user-name`}
            >
              {user.name}
              {user?.ticker && <>{` $${user?.ticker}`}</>}
            </div>
          </div>
        </div>
      </div>
      <div className="user-level-group">
        <div className="user-level-wrapper">
          <div className="nft-price">
            {getFlooredFixed(getUsdFromMatic(user)?.usdNow, 3)}
          </div>
          <div className="nft-price">
            $
            {getFlooredNumber(
              getMarketValue(
                user?.matic ?? user?.matic_price,
                user?.exchangeRateUSD?.rate,
                user?.coin_issued,
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayersCardSupporter
