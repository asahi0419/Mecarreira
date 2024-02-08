import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { fetchTickerBanner } from '@root/apis/playerCoins/playerCoinsSlice'
import { fetchPlayersStatsHT } from '@root/apis/playerStats/playerStatsSlice'
import { PLAYER_STATUS } from '@root/constants'
import { getCircleColor, getFlooredFixed, isMobile } from '@utils/helpers'
import classnames from 'classnames'
import ArrowDownFilled from '@components/Svg/ArrowDownFilled'
import ArrowUpFilled from '@components/Svg/ArrowUpFilled'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Marquee from 'react-fast-marquee'
import PlayerImage from '@components/PlayerImage'
import { ethers } from 'ethers'
import HeaderTickerSkeleton from '@components/Card/HeaderTickerSkeleton'
import ImageComponent from '@components/ImageComponent'

interface Props {
  player: any
}

const HeaderTickerPlayer: React.FC<Props> = ({ player }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const headerPercentageRef = useRef<any>(null)

  const getUsdFromMatic = (playerData: any) => {
    const { matic, exchangeRateUSD } = playerData
    const usdNow = matic * exchangeRateUSD['rate']
    const usdOld = playerData['24h_change'] * exchangeRateUSD['24h_rate']
    return {
      usdOld: !isNaN(usdOld) ? usdOld : 0.0,
      usdNow: !isNaN(usdNow) ? usdNow : 0.0,
    }
  }

  const handleClick = () => {
    const playerUrl = player.detailpageurl
    navigate(`player/${playerUrl}`)
  }

  const getPercentageEst = (player: any) => {
    const oldNumber = player['24h_change'] * player?.exchangeRateUSD['24h_rate'] // 10*10 = 100
    const newNumber = player['matic'] * player?.exchangeRateUSD['rate'] // 20*20 = 400
    const decreaseValue = oldNumber - newNumber
    const percentage = (Math.abs(decreaseValue) / oldNumber) * 100
    return {
      oldNumber,
      newNumber,
      percentage: isFinite(percentage) ? percentage : 0.0,
    }
  }

  return (
    <div
      onClick={handleClick}
      className={classnames('header-ticker-container')}
    >
      <div
        className="img"
        style={{
          background: getCircleColor(player.playerlevelid),
        }}
      >
        <PlayerImage
          src={player.playerpicturethumb || player.playerpicture || player.img}
          className="img-radius cache-img"
        />
      </div>
      <div className="player-info">
        <div className={classnames('player-name')}>{player.name}</div>
        {player.playerstatusid === PLAYER_STATUS.COMINGSOON ||
        player.playerstatusid === PLAYER_STATUS.VERIFIED ? (
          <div className="green text-left">{t('coming soon')}</div>
        ) : (
          <div className="player-price-wrapper ticker-price-set">
            <div
              className={classnames(
                'number-color',
                player.playerstatusid < 4
                  ? ''
                  : getUsdFromMatic(player)?.usdNow >=
                    getUsdFromMatic(player)?.usdOld
                  ? 'profit'
                  : 'loss',
              )}
            >
              ${getFlooredFixed(getUsdFromMatic(player).usdNow, 3)}
            </div>
            <div className="player-price-change">
              {getPercentageEst(player).oldNumber <
              getPercentageEst(player).newNumber ? (
                <ArrowUpFilled />
              ) : (
                <ArrowDownFilled />
              )}
              <div
                ref={headerPercentageRef}
                className={classnames(
                  'number-color',
                  getPercentageEst(player).oldNumber <
                    getPercentageEst(player).newNumber
                    ? 'profit'
                    : 'loss',
                )}
              >
                {getFlooredFixed(getPercentageEst(player).percentage, 2)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const HeaderTicker: React.FC = () => {
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { fetchPlayerStatsDataHT } = playerStatsData
  const purchaseData = useSelector((state: RootState) => state.purchases)
  const { purchaseAction } = purchaseData

  const { playersBannerData } = playerCoinData

  const [isCarouselLoading, setIsCarouselLoading] = useState(false)
  const [allPlayers, setAllPlayers] = useState<any>([])
  const allPlayersRef = useRef<any>(null)
  const dispatch = useDispatch()
  const showWalletPopup = useSelector(
    (state: RootState) => state.authentication.isWalletFormVisible,
  )
  const isVisibleModal = useSelector(
    (state: RootState) => state.authentication.isVisibleModal,
  )
  const handleGetPriceStats = (playersData: any) => {
    if (isCarouselLoading) {
      setIsCarouselLoading(false)
    }
    const playersSet: number[] = playersData
      .filter((player: any) => {
        return player.playerstatusid === PLAYER_STATUS.SUBSCRIBE
      })
      .map((item: any) => item.playercontract)
    if (playersSet.length > 0) {
      dispatch(fetchPlayersStatsHT({ contracts: playersSet, query: 'complex' }))
    } else {
      const players: any[] = []
      if (playersData.length > 0) {
        for (let i = 0; i < 16; i++) {
          players[i] = playersData[(i % 16) % playersData.length]
        }
        setAllPlayers([...players])
      }
    }
  }

  useEffect(() => {
    if (showWalletPopup || purchaseAction) {
      // clearInterval(playerStatsInterval)
    } else {
      handleGetPriceStats(playersBannerData)
      // clearInterval(playerStatsInterval)
      // playerStatsInterval = setInterval(() => {
      //   handleGetPriceStats(playersBannerData)
      // }, 10000)
    }
  }, [showWalletPopup, purchaseAction])

  useEffect(() => {
    allPlayersRef.current = allPlayers
  }, [allPlayers])

  useEffect(() => {
    let playersBannerDataTemp = [...playersBannerData]
    if (fetchPlayerStatsDataHT && fetchPlayerStatsDataHT.length > 0) {
      playersBannerDataTemp = playersBannerDataTemp.map(item => {
        const item2 = fetchPlayerStatsDataHT.find(
          (i2: any) =>
            item?.player &&
            i2?.player &&
            ethers.utils.getAddress(i2?.player) ===
              ethers.utils.getAddress(item?.player),
        )
        return item2 ? { ...item, ...item2 } : item
      })
    }
    const players: any[] = []
    if (playersBannerDataTemp.length > 0) {
      for (let i = 0; i < 16; i++) {
        players[i] =
          playersBannerDataTemp[(i % 16) % playersBannerDataTemp.length]
      }
      setAllPlayers([...players])
    }
  }, [fetchPlayerStatsDataHT])

  useEffect(() => {
    dispatch(fetchTickerBanner({}))
    // return () => {
    //   clearInterval(playerStatsInterval)
    // }
  }, [])

  useEffect(() => {
    if (playersBannerData.length > 0) {
      handleGetPriceStats(playersBannerData)
      // clearInterval(playerStatsInterval)
      // playerStatsInterval = setInterval(() => {
      //   handleGetPriceStats(playersBannerData)
      // }, 10000)
    }
  }, [playersBannerData])

  useEffect(() => {
    // clearInterval(playerStatsInterval)
    if (!document.hidden) {
      // playerStatsInterval = setInterval(() => {
      //   handleGetPriceStats(playersBannerData)
      // }, 10000)
    }
  }, [document.hidden])

  return (
    <>
      {allPlayers.length > 0 ? (
        <Marquee
          gradient={false}
          className="bg-secondary-color"
          style={{
            height: '56px',
          }}
          speed={isMobile() ? 12 : 20}
          loop={100}
          play={!isVisibleModal}
        >
          {allPlayers.map((player: any, index: number) => (
            <HeaderTickerPlayer player={player} key={index} />
          ))}
        </Marquee>
      ) : (
        <div
          style={{
            width: '100vw',
            display: 'flex',
            height: '56px',
          }}
        >
          {new Array(20).fill(1).map((_: any, index: number) => (
            <HeaderTickerSkeleton key={index} />
          ))}
        </div>
      )}
    </>
  )
}

export default HeaderTicker
