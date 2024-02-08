import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { fetchMostDraftPlayers } from '@root/apis/playerCoins/playerCoinsSlice'
import { isMobile } from '@utils/helpers'
import NewCarouselCard from '@components/Card/NewCarouselCard'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import {
  showPurchaseForm,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import CircleCarousel from '@components/Carousel/CircleCarousel'

const DraftedPlayers: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { playersMostDraftsData } = playerCoinData
  const playerRef = useRef<any>([])
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const [itemIndex, setItemIndex] = useState(0)

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
    dispatch(fetchMostDraftPlayers({}))
  }, [])

  return (
    <div className="section-wrapper">
      <div className="section-title">{t('most drafted players')}</div>
      <div className="section-desc">{t('the more drafts a player has')}</div>
      <div className="section-content  player-carousel">
        {playersMostDraftsData.length === 0 ? (
          <>
            {new Array(isMobile() ? 1 : 3)
              .fill(1)
              .map((_: any, index: number) => (
                <BaseCardSkeleton key={index} />
              ))}
          </>
        ) : (
          <CircleCarousel
            items={playersMostDraftsData.map((item: any, index: number) => (
              <NewCarouselCard
                card={item}
                playercardjson={item.playercardjson}
                key={index + 2}
                prevData={playerRef?.current}
                onBuy={() => handlePurchaseOpen('buy', item)}
                onSell={() => handlePurchaseOpen('sell', item)}
              />
            ))}
            activeIndex={itemIndex}
            setActiveIndex={setItemIndex}
          />
        )}
      </div>
    </div>
  )
}

export default DraftedPlayers
