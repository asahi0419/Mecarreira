import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { fetchVersusPlayers } from '@root/apis/playerCoins/playerCoinsSlice'
import NewCarouselCard from '@components/Card/NewCarouselCard'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import {
  showPurchaseForm,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'

const VersusPlayers: React.FC = () => {
  const dispatch = useDispatch()

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { playersVersusData } = playerCoinData
  const playerRef = useRef<any>([])
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')

  const handlePurchaseOpen = (value: string, data?: any) => {
    if (!loginInfo && !loginId) {
      dispatch(showSignupForm())
      return
    }
    dispatch(
      showPurchaseForm({
        mode: value.toUpperCase(),
        playerData: data,
      }),
    )
  }

  useEffect(() => {
    if (playersVersusData.length === 0) {
      dispatch(fetchVersusPlayers({}))
    }
  }, [])

  return (
    <div className="section-wrapper">
      <div className="section-content">
        {playersVersusData.length === 0 ? (
          <div className="vs-players-wrapper">
            <div style={{ margin: '0px 10px' }}>
              <BaseCardSkeleton />
            </div>
            <div className="vs-title">VS.</div>
            <div style={{ margin: '0px 10px' }}>
              <BaseCardSkeleton />
            </div>
          </div>
        ) : (
          <div className="vs-players-wrapper">
            <NewCarouselCard
              card={playersVersusData[0]}
              playercardjson={playersVersusData[0].playercardjson}
              key={0}
              prevData={playerRef?.current}
              onBuy={() => handlePurchaseOpen('buy', playersVersusData[0])}
              onSell={() => handlePurchaseOpen('sell', playersVersusData[0])}
            />
            <div className="vs-title">VS.</div>
            <NewCarouselCard
              card={playersVersusData[1]}
              playercardjson={playersVersusData[1]?.playercardjson}
              key={1}
              prevData={playerRef?.current}
              onBuy={() => handlePurchaseOpen('buy', playersVersusData[1])}
              onSell={() => handlePurchaseOpen('sell', playersVersusData[1])}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default VersusPlayers
