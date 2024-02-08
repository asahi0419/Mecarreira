import React, { useState, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'
import { IPlayerCard as CardProps } from '@root/types'
import '@assets/css/components/PlayerCard.css'
import { RootState } from '@root/store/rootReducers'
import { ethers } from 'ethers'
import BaseCard from './BaseCard'
interface Props {
  card: CardProps
  prevData?: any
  onBuy: any
  onSell: any
  playercardjson?: any
}

const NewPlayerDraftCard: React.FC<Props> = ({
  card,
  prevData = null,
  onBuy,
  onSell,
  playercardjson,
}) => {
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsData = [] } = playerStatsData
  const [playerCardData, setPlayerCardData] = useState(card)

  const getClassName = (event: any) => {
    if (fetchPlayerStatsData.length > 0) {
      const statIndex = fetchPlayerStatsData?.findIndex((item: any) => {
        return (
          ethers.utils.getAddress(card?.playercontract) ===
          ethers.utils.getAddress(item?.player)
        )
      })
      if (statIndex > -1) {
        return `${event}`
      } else {
        return `${event}`
      }
    }
  }

  useEffect(() => {
    if (fetchPlayerStatsData.length > 0) {
      const statIndex = fetchPlayerStatsData?.findIndex((item: any) => {
        return (
          ethers.utils.getAddress(card?.playercontract) ===
          ethers.utils.getAddress(item?.player)
        )
      })
      if (statIndex > -1) {
        const playerCardDataTemp = {
          ...card,
          ...fetchPlayerStatsData[statIndex],
        }
        setPlayerCardData(playerCardDataTemp)
      } else {
        setPlayerCardData(card)
      }
    }
  }, [card, fetchPlayerStatsData])

  return (
    <BaseCard
      card={playerCardData}
      playercardjson={playercardjson}
      prevData={prevData}
      onBuy={onBuy}
      onSell={onSell}
      getClassName={getClassName}
    />
  )
}

export default memo(NewPlayerDraftCard)
