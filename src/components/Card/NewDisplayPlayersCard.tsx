import React, { useState, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'
import { IPlayerCard as CardProps } from '@root/types'
import '@assets/css/components/PlayerCard.css'
import { RootState } from '@root/store/rootReducers'
import 'flag-icons/css/flag-icons.min.css'
import { ethers } from 'ethers'
import BaseCard from './BaseCard'

interface Props {
  card: CardProps
  prevData?: any
  onBuy: any
  onSell: any
  playercardjson?: any
}

const NewDisplayPlayersCard: React.FC<Props> = ({
  card,
  prevData = null,
  onBuy,
  onSell,
  playercardjson,
}) => {
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { displayPlayerStatsData = [] } = playerStatsData
  const [playerCardData, setPlayerCardData] = useState(card)

  const getClassName = (event: any) => {
    if (displayPlayerStatsData.length === 0) {
      return `${event}`
    }
    const statIndex = displayPlayerStatsData?.findIndex((item: any) => {
      return (
        card?.playercontract &&
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

  useEffect(() => {
    if (displayPlayerStatsData.length > 0) {
      const statIndex = displayPlayerStatsData?.findIndex((item: any) => {
        return (
          card?.playercontract &&
          ethers.utils.getAddress(card?.playercontract) ===
            ethers.utils.getAddress(item?.player)
        )
      })
      if (statIndex > -1) {
        const playerCardDataTemp = {
          ...card,
          ...displayPlayerStatsData[statIndex],
        }
        setPlayerCardData(playerCardDataTemp)
      } else {
        setPlayerCardData(card)
      }
    }
  }, [card, displayPlayerStatsData])

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

export default memo(NewDisplayPlayersCard)
