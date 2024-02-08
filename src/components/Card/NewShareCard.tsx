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

const ShareCard: React.FC<Props> = ({
  card,
  prevData = null,
  onBuy,
  onSell,
  playercardjson,
}) => {
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsDataNL = [] } = playerStatsData
  const [playerCardData, setPlayerCardData] = useState(card)

  const getClassName = (event: any) => {
    const statIndex = fetchPlayerStatsDataNL?.findIndex((item: any) => {
      if (item?.player && card?.playercontract) {
        return (
          ethers.utils.getAddress(card?.playercontract) ===
          ethers.utils.getAddress(item?.player)
        )
      } else {
        return -1
      }
    })
    if (statIndex > -1) {
      return `${event}`
    } else {
      return `${event}`
    }
  }

  useEffect(() => {
    if (fetchPlayerStatsDataNL.length > 0) {
      const statIndex = fetchPlayerStatsDataNL?.findIndex((item: any) => {
        if (item?.player && card?.playercontract) {
          return (
            ethers.utils.getAddress(card?.playercontract) ===
            ethers.utils.getAddress(item?.player)
          )
        } else {
          return -1
        }
      })
      if (statIndex > -1) {
        const playerCardDataTemp = {
          ...card,
          ...fetchPlayerStatsDataNL[statIndex],
        }
        setPlayerCardData(playerCardDataTemp)
      } else {
        setPlayerCardData(card)
      }
    }
  }, [card, fetchPlayerStatsDataNL])

  return (
    <>
      <BaseCard
        card={playerCardData}
        playercardjson={playercardjson}
        prevData={prevData}
        onBuy={onBuy}
        onSell={onSell}
        getClassName={getClassName}
        shareCard={true}
      />
    </>
  )
}

export default memo(ShareCard)
