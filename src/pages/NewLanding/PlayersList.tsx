import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/components/NewLandingItem.css'
import CircleCarousel from '@components/NewLanding/PlayerCircleCarousel'
import NewCarouselCard from '@components/Card/NewCarouselCard'
import SearchInput from '@components/Form/LandingSearchInput'
import classnames from 'classnames'
import { isMobile } from '@utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  getLandingPlayerCount,
  getLandingPlayerData,
  getLandingPlayerDataWithURL,
} from '@root/apis/playerCoins/playerCoinsSlice'
import Spinner from '@components/Spinner'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'

const Playerslist: React.FC = () => {
  const { t } = useTranslation()
  const playerRef = useRef<any>([])
  const dispatch = useDispatch()

  const [searchTerm, setSearchTerm] = useState('')

  const [listIndex, setListIndex] = useState(0)

  const [minLength, setMinLength] = useState(0)

  const landingPlayers = useSelector((state: RootState) => state.playercoins)

  const {
    landingPlayerCount,
    landingPlayerData,
    loadingLandingPlayerData,
    loadingLandingPlayerDataWithUrl,
    landingPlayerNextUrl,
    landingPlayerPrevUrl,
  } = landingPlayers

  const optimisedHandleChange = (str: string) => {
    if (str.length >= 4 || (str.length === 0 && searchTerm.length > 0)) {
      setSearchTerm(str)
      dispatch(getLandingPlayerData({ search: str }))
    }
  }

  const carouselCallBack = (item: number, length: number, direct: string) => {
    if (
      direct === 'forth' &&
      item === landingPlayerData.length - length &&
      landingPlayerNextUrl !== null
    ) {
      dispatch(getLandingPlayerDataWithURL(landingPlayerNextUrl))
    }
    setMinLength(length)
    // if (direct === 'back' && item === landingPlayerData.length - 1 && landingPlayerPrevUrl !== null) {
    //   dispatch(getLandingPlayerDataWithURL(landingPlayerPrevUrl))
    // }
  }
  const setActiveIndex = (index: number) => {
    setListIndex(index)
  }

  useEffect(() => {
    dispatch(getLandingPlayerCount())
    dispatch(getLandingPlayerData({}))
  }, [])

  const renderSkeleton = () => {
    const components = []

    for (let i = 0; i < minLength; i++) {
      components.push(<BaseCardSkeleton key={i} />)
    }

    return components
  }
  return (
    <div
      className={`${
        landingPlayerCount?.playerCount >= 10
          ? 'new-landing-players-list'
          : 'hide'
      }`}
    >
      <div className="new-landing-players-list-handleinfo">
        <div className="new-landing-players-list-counts">
          <div className="new-landing-players-list-counts-item">
            <div className="new-landing-players-list-counts-item-title">
              {t('Players')}
            </div>
            <div className="new-landing-players-list-counts-item-number">
              {landingPlayerCount.playerCount}
            </div>
          </div>
          <div className="new-landing-players-list-counts-item">
            <div className="new-landing-players-list-counts-item-title">
              {t('Scouts')}
            </div>
            <div className="new-landing-players-list-counts-item-number">
              {landingPlayerCount.scoutsCount}
            </div>
          </div>
          <div className="new-landing-players-list-counts-item">
            <div className="new-landing-players-list-counts-item-title">
              {t('Countries')}
            </div>
            <div className="new-landing-players-list-counts-item-number">
              {landingPlayerCount.uniqueCountryCount}
            </div>
          </div>
        </div>
      </div>
      <div className="new-landing-players-list-handleinfo">
        <div className="new-landing-players-list-search">
          <SearchInput
            type="text"
            placeholder={t('Search Player')}
            className="in-menu-search-header dash-search"
            onChange={optimisedHandleChange}
          />
        </div>
      </div>
      <div className="new-landing-players-list-data">
        {loadingLandingPlayerDataWithUrl ? (
          // <CircleCarousel items={renderSkeleton()} />
          <CircleCarousel
            items={landingPlayerData.map((item: any, index: number) => (
              <NewCarouselCard
                card={item}
                playercardjson={item.playercardjson}
                key={index + 2}
                prevData={playerRef?.current}
                onBuy={() => console.log('')}
                onSell={() => console.log('')}
                navigation={false}
              />
            ))}
            carouselCallBack={carouselCallBack}
            setActiveIndex={setActiveIndex}
            activeIndex={listIndex}
            inVisibleArrow={false}
          />
        ) : loadingLandingPlayerData ? (
          <Spinner
            spinnerStatus={true}
            className="new-landing-genesis-spinner"
          />
        ) : landingPlayerData.length === 0 ? (
          <p className="new-landing-players-list-counts-item-title gold-color">
            {t('No player with that name')}
          </p>
        ) : (
          <CircleCarousel
            items={landingPlayerData.map((item: any, index: number) => (
              <NewCarouselCard
                card={item}
                playercardjson={item.playercardjson}
                key={index + 2}
                prevData={playerRef?.current}
                onBuy={() => console.log('')}
                onSell={() => console.log('')}
                navigation={false}
              />
            ))}
            carouselCallBack={carouselCallBack}
            setActiveIndex={setActiveIndex}
            activeIndex={listIndex}
            inVisibleArrow={true}
          />
        )}
      </div>
    </div>
  )
}

export default Playerslist
