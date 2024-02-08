import React, { useState, useEffect, useRef } from 'react'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { PLAYER_STATUS } from '@root/constants'
import { fetchPlayersStatsDisplayPlayers } from '@root/apis/playerStats/playerStatsSlice'
import { isMobile } from '@utils/helpers'
import { getDisplayPlayers } from '@root/apis/playerCoins/playerCoinsSlice'
import classNames from 'classnames'
import NewDisplayPlayersCard from '@components/Card/NewDisplayPlayersCard'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import CircleCarousel from '@components/Carousel/CircleCarousel'

const displayPlayersInterval: any = null

interface Props {
  onBuy: any
  onSell: any
  playerId: any
}

const PlayersDisplay: React.FC<Props> = ({ onBuy, onSell, playerId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const displayPlayerRef = useRef<any>([])
  const [itemIndex, setItemIndex] = useState(0)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { isVisibleModal } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { displayPlayerStatsData } = playerStatsData
  const { displayPlayersList, isDisplayPlayersError, isNoDisplayPlayers } =
    playerCoinData
  const [testStat, setTestStat] = useState<any>([])
  const [windowSize, setWindowSize] = useState(0)
  const displayPlayerItems: JSX.Element[] = []

  displayPlayersList.map((displayItem: any, displayIndex: any) => {
    displayPlayerItems.push(
      <NewDisplayPlayersCard
        card={displayItem}
        key={displayIndex + 2}
        prevData={displayPlayerRef?.current}
        onBuy={() => onBuy(displayItem)}
        onSell={() => onSell(displayItem)}
        playercardjson={displayItem?.playercardjson}
      />,
    )
  })

  const getDisplayPlayersStats = () => {
    const testItems = displayPlayerItems.map(item => item.props.card)
    const pgmfi: any = testItems
    const newStat = pgmfi.filter((player: any) => {
      if (player?.playerstatusid >= PLAYER_STATUS.SUBSCRIBE) {
        return true
      } else {
        return false
      }
    })
    const playerContracts =
      newStat.length > 0 ? newStat.map((item: any) => item.playercontract) : []
    if (playerContracts.length > 0) {
      dispatch(
        fetchPlayersStatsDisplayPlayers({
          contracts: playerContracts,
          query: 'complex',
        }),
      )
    }
  }

  useEffect(() => {
    clearInterval(displayPlayersInterval)
    // if (displayPlayersList.length > 0 && !isVisibleModal && !document.hidden) {
    //   displayPlayersInterval = setInterval(() => {
    //     getDisplayPlayersStats()
    //   }, 20000)
    // }
  }, [displayPlayersList, document.hidden, isVisibleModal])

  useEffect(() => {
    return () => {
      clearInterval(displayPlayersInterval)
    }
  }, [])

  useEffect(() => {
    if (playerId) {
      dispatch(getDisplayPlayers(playerId))
    }
  }, [playerId])

  useEffect(() => {
    if (displayPlayerStatsData.length > 0) {
      setTestStat(displayPlayerStatsData)
    }
  }, [displayPlayerStatsData])

  useEffect(() => {
    displayPlayerRef.current = testStat
  }, [testStat])

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

  return (
    <section className="profile-display-section">
      <div className="blog-title h-2">{t('more players')}</div>
      <div className={classNames('carousel m-auto player-carousel')}>
        {displayPlayersList?.length > 0 && displayPlayerItems?.length > 0 ? (
          <CircleCarousel
            items={displayPlayerItems}
            activeIndex={itemIndex}
            setActiveIndex={setItemIndex}
            isFixedWidth={true}
          />
        ) : isDisplayPlayersError || isNoDisplayPlayers ? (
          <div className="heading-title unverified-alert">
            {t('currently no players to show')}
          </div>
        ) : (
          <>
            {new Array(
              isMobile()
                ? 1
                : windowSize > 1600
                ? 5
                : windowSize > 1220
                ? 4
                : windowSize > 1024
                ? 3
                : 1,
            )
              .fill(1)
              .map((_: any, index: number) => (
                <div key={index} style={{ margin: '0px 10px' }}>
                  <BaseCardSkeleton key={index} />
                </div>
              ))}
          </>
        )}
      </div>
    </section>
  )
}

export default React.memo(PlayersDisplay)
