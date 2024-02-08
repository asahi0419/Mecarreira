import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { IPlayerCard as CardProps } from '@root/types'
import { RootState } from '@root/store/rootReducers'
import BaseCard from './BaseCard'

interface Props {
  card: CardProps
  playercardjson: any
  prevData?: any
  onBuy: any
  onSell: any
}

const NewPlayerCard: React.FC<Props> = ({
  card,
  playercardjson,
  prevData = null,
  onBuy,
  onSell,
}) => {
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsDataPL } = playerStatsData

  const getClassName = (event: any) => {
    const statIndex = fetchPlayerStatsDataPL?.findIndex((item: any) => {
      return (
        card?.playercontract?.toLocaleLowerCase() ===
        item?.player?.toLowerCase()
      )
    })
    if (statIndex > -1) {
      return `${event}`
    } else {
      return `${event}`
    }
  }

  return (
    <BaseCard
      card={card}
      playercardjson={playercardjson}
      prevData={prevData}
      onBuy={onBuy}
      onSell={onSell}
      getClassName={getClassName}
    />
  )
}

export default memo(NewPlayerCard)
