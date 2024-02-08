import PlayerImage from '@components/PlayerImage'
import { RootState } from '@root/store/rootReducers'
import {
  getCircleColor,
  getFlooredFixed,
  getPercentageEst,
  getPlayerLevelClassName,
  getUsdFromMatic,
  toKPINumberFormat,
  toNumberFormat,
  toUsd,
} from '@utils/helpers'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '@assets/css/components/PlayerItem.css'

interface Props {
  item: any
  index: number
  prevData?: any
}
const PlayerItem: React.FC<Props> = ({ item, index, prevData = null }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const usdRef = useRef<any>(null)
  const percentageRef = useRef<any>(null)

  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsDataTrending = [] } = playerStatsData

  useEffect(() => {
    handleUsdAnimation()
    // handlePercentageAnimation()
  }, [item])

  useEffect(() => {
    handlePercentageAnimation()
  }, [fetchPlayerStatsDataTrending])

  const handleUsdAnimation = () => {
    if (usdRef?.current?.classList[3] === 'profit-style') {
      usdRef?.current?.classList.remove('profit')
    } else if (usdRef?.current?.classList[3] === 'loss-style') {
      usdRef?.current?.classList.remove('loss-style')
    }
    setTimeout(() => {
      if (getUsdFromMatic(item).usdNow > getUsdFromMatic(item).usdOld) {
        usdRef?.current?.classList.add('profit-style')
      } else {
        usdRef?.current?.classList.add('loss-style')
      }
    }, 500)
  }

  const handlePercentageAnimation = () => {
    const trendingItem = getLivePlayerStat(item)
    if (percentageRef?.current?.classList[1] === 'profit') {
      percentageRef?.current?.classList.remove('profit')
    } else if (percentageRef?.current?.classList[1] === 'loss') {
      percentageRef?.current?.classList.remove('loss')
    }
    setTimeout(() => {
      if (
        getPercentageEst(trendingItem).oldNumber <
        getPercentageEst(trendingItem).newNumber
      ) {
        percentageRef?.current?.classList.add('profit')
        if (percentageRef?.current) {
          percentageRef.current.style.color = 'var(--profit-color)'
        }
      } else {
        percentageRef?.current?.classList.add('loss')
        if (percentageRef?.current) {
          percentageRef.current.style.color = 'var(--loss-color)'
        }
      }
    }, 500)
  }

  const getLivePlayerStat = item => {
    const currentPlayerIndex = fetchPlayerStatsDataTrending.findIndex(
      stat => stat.player.toLowerCase() === item?.playercontract?.toLowerCase(),
    )
    if (currentPlayerIndex > -1) {
      return fetchPlayerStatsDataTrending[currentPlayerIndex]
    }
    return item
  }

  return (
    <div
      className="players-list-item user-card"
      onClick={() => navigate(`/app/player/${item?.detailpageurl}`)}
    >
      <div className="player-image-wrapper">
        <div className="player-number">{index + 1}</div>
        <div className="player-image">
          <div
            className="image-border"
            style={{
              background: getCircleColor(item?.playerlevelid),
            }}
          >
            <PlayerImage
              src={item.playerpicturethumb}
              className="nft-image"
              hasDefault={true}
            />
          </div>
        </div>
      </div>
      {window.innerWidth >= 700 ? (
        <div className="player-info-wrapper">
          <div className="player-name">
            <span className={getPlayerLevelClassName(item?.playerlevelid)}>
              {item.name} {item?.ticker ? `$${item?.ticker}` : ''}
            </span>
          </div>
          <div className="user-level-group">
            <div className="user-level-box">
              <div className="user-level-label green-color">{t('token')}</div>
              <div className="user-level primary-text-color">
                {toKPINumberFormat(item?.balancecoin)}
              </div>
            </div>
            <div className="user-level-box">
              <div className="user-level-label green-color">{t('usd')}</div>
              <div className="user-level primary-text-color">
                $
                {toKPINumberFormat(
                  toUsd(item?.balancematic, item?.exchangeRateUSD?.rate),
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="player-info-wrapper">
          <div className="player-name-wrapper">
            <div className="player-name">
              <span className={getPlayerLevelClassName(item?.playerlevelid)}>
                {item.name} {item?.ticker ? `$${item?.ticker}` : ''}
              </span>
            </div>
          </div>
          <div className="balance-wrapper">
            <div className="balance-value">
              {toKPINumberFormat(item?.balancecoin)}
            </div>
            <div className="balance-value">
              $
              {toNumberFormat(
                getFlooredFixed(
                  toUsd(item?.balancematic, item?.exchangeRateUSD?.rate),
                  2,
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerItem
