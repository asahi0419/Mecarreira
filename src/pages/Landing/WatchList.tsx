import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  getWatchListPlayer,
  showPurchaseForm,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import { isMobile } from '@utils/helpers'
import NewCarouselCard from '@components/Card/NewCarouselCard'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import CircleCarousel from '@components/Carousel/CircleCarousel'

const WatchList: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { watchListData, watchListLoading } = authenticationData
  const playerRef = useRef<any>([])
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const accessToken = localStorage.getItem('accessToken')
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
    if (accessToken) {
      dispatch(getWatchListPlayer())
    }
  }, [accessToken])

  return (
    <div
      className={`${
        loginInfo && watchListData.length > 0 ? 'section-wrapper' : 'hidden'
      }`}
    >
      <div className="section-title">{t('my watchlist')}</div>
      <div className="section-content  player-carousel">
        {!watchListLoading && watchListData?.length > 0 ? (
          <CircleCarousel
            items={watchListData.map((item: any, index: number) => (
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
        ) : (
          <>
            {new Array(isMobile() ? 1 : 3)
              .fill(1)
              .map((_: any, index: number) => (
                <BaseCardSkeleton key={index} />
              ))}
          </>
        )}
      </div>
    </div>
  )
}

export default WatchList
