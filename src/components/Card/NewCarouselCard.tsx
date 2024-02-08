import React, { useState, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'
import { IPlayerCard as CardProps } from '@root/types'
import '@assets/css/components/PlayerCard.css'
import { RootState } from '@root/store/rootReducers'
import { ethers } from 'ethers'
import BaseCard from './BaseCard'
import { DummyPlayer } from '@root/constants'
interface Props {
  card: CardProps
  prevData?: any
  playercardjson?: any
  navigation?: any
  reflection?: any
  isLanding?: any
  hasTour?: any
  onBuy: any
  onSell: any
}

const NewCarouselCard: React.FC<Props> = ({
  card,
  prevData = null,
  navigation = true,
  reflection = false,
  isLanding = false,
  hasTour = false,
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
    <BaseCard
      card={hasTour ? DummyPlayer : playerCardData}
      playercardjson={playercardjson}
      prevData={prevData}
      onBuy={onBuy}
      onSell={onSell}
      hasTour={hasTour}
      navigation={navigation}
      reflection={reflection}
      isLanding={isLanding}
      getClassName={getClassName}
    />
  )
}

export default memo(NewCarouselCard)
