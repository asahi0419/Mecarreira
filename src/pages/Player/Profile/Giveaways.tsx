import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { PLAYER_STATUS } from '@root/constants'
import { fetchPlayersStats } from '@root/apis/playerStats/playerStatsSlice'
import NewPlayerCard from '@components/Card/NewPlayerCard'
import { setPurchaseMode } from '@root/apis/purchase/purchaseSlice'
import { isMobile } from '@utils/helpers'
import {
  showPurchaseForm,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import { ethers } from 'ethers'
import classNames from 'classnames'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import { fetchDraftPlayers } from '@root/apis/playerCoins/playerCoinsSlice'

let draftedPlayersInterval: any = null
interface PlayerOffset {
  start: number
  end: number
}

interface Props {
  playerStatus: any
}

const Giveaways: React.FC<Props> = ({ playerStatus }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const prevCountRef = useRef<any>()
  const [allPlayers, setAllPlayers] = useState<any>([])
  const [itemIndex, setItemIndex] = useState(0)
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsData } = playerStatsData
  const { playersDraftsData } = playerCoinData
  const [isCarouselLoading, setIsCarouselLoading] = useState(false)
  const [playerOffset, setPlayerOffset] = useState({ start: 0, end: 4 })
  const items: JSX.Element[] = []
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux, isVisibleModal } = authenticationData

  allPlayers.map((item: any, index: any) => {
    items.push(
      <NewPlayerCard
        card={item}
        key={index + 2}
        onBuy={() => handlePurchaseOpen('buy', item)}
        onSell={() => handlePurchaseOpen('sell', item)}
        playercardjson={item?.playercardjson}
      />,
    )
  })

  const handlePurchaseOpen = (value: string, data?: any) => {
    if (!loginInfo && !loginId) {
      dispatch(showSignupForm())
      return
    }
    dispatch(setPurchaseMode(value.toUpperCase()))
    dispatch(
      showPurchaseForm({
        mode: value.toUpperCase(),
        playerData: data,
      }),
    )
  }

  const handleGetPriceStats = (playersData: any, offset: PlayerOffset) => {
    if (isCarouselLoading) {
      setIsCarouselLoading(false)
    }
    const playersSet: number[] = playersData
      .slice(offset.start, offset.end)
      .filter((player: { playerstatusid: { id: number } }) => {
        return player.playerstatusid.id === PLAYER_STATUS.SUBSCRIBE
      })
      .map((item: any) => item.playercontract)
    if (playersSet.length > 0) {
      dispatch(fetchPlayersStats(playersSet))
    }
  }

  const createTestPlayers = () => {
    const playersDraftsDataTemp = [...playersDraftsData]
    for (let i = 0; i < fetchPlayerStatsData.length; i++) {
      for (let j = 0; j < playersDraftsDataTemp.length; j++) {
        if (
          fetchPlayerStatsData[i]?.player &&
          playersDraftsDataTemp[j]?.playercontract &&
          ethers.utils.getAddress(playersDraftsDataTemp[j]?.playercontract) ===
            ethers.utils.getAddress(fetchPlayerStatsData[i]?.player)
        ) {
          playersDraftsDataTemp[j] = {
            ...playersDraftsDataTemp[j],
            ...fetchPlayerStatsData[i],
          }
        }
      }
    }
    setAllPlayers(playersDraftsDataTemp)
    clearInterval(draftedPlayersInterval)
    draftedPlayersInterval = setInterval(() => {
      handleGetPriceStats(playersDraftsDataTemp, playerOffset)
    }, 20000)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    if (playerStatus?.playerstatusid?.id > 3) {
      dispatch(fetchDraftPlayers(playerStatus.playercontract))
    }
    return () => {
      clearInterval(draftedPlayersInterval)
    }
  }, [])

  useEffect(() => {
    clearInterval(draftedPlayersInterval)
    if (!isVisibleModal && playersDraftsData.length > 0 && !document.hidden) {
      draftedPlayersInterval = setInterval(() => {
        handleGetPriceStats(playersDraftsData, playerOffset)
      }, 20000)
    }
  }, [isVisibleModal, document.hidden])

  useEffect(() => {
    prevCountRef.current = playerCoinData
    if (
      playerCoinData.playersDraftsData.length > 0 &&
      playerStatus?.playerstatusid?.id >= 4
    ) {
      createTestPlayers()
    }
  }, [playerCoinData])

  useEffect(() => {
    const playersDraftsDataTemp = [...playersDraftsData]
    for (let i = 0; i < fetchPlayerStatsData.length; i++) {
      for (let j = 0; j < playersDraftsDataTemp.length; j++) {
        if (
          fetchPlayerStatsData[i]?.player &&
          playersDraftsDataTemp[j]?.playercontract &&
          ethers.utils.getAddress(playersDraftsDataTemp[j]?.playercontract) ===
            ethers.utils.getAddress(fetchPlayerStatsData[i]?.player)
        ) {
          playersDraftsDataTemp[j] = {
            ...playersDraftsDataTemp[j],
            ...fetchPlayerStatsData[i],
          }
        }
      }
    }
    setAllPlayers(playersDraftsDataTemp)
  }, [fetchPlayerStatsData])

  const handleCarouselCallback = useCallback(
    (value: number, direction: string) => {
      setItemIndex(value)
      if (true) {
        if (direction === 'forth') {
          if (value && value < 7) {
            setIsCarouselLoading(true)
            setPlayerOffset({
              start: playerOffset.start + 1,
              end: playerOffset.end + 1,
            })
          }
        } else if (direction === 'back') {
          setIsCarouselLoading(true)
          setPlayerOffset({
            start: playerOffset.start - 1,
            end: playerOffset.end - 1,
          })
        }
      }
    },
    [playerOffset],
  )

  return (
    <>
      {playerStatus?.playerstatusid?.id > 3 && items.length > 0 ? (
        <section className="profile-draft-section">
          <div className="blog-title new-launches-title h-2">
            {t('my active drafts')}
          </div>
          <div className={classNames('carousel m-auto player-carousel')}>
            {allPlayers.length > 0 && items.length > 0 ? (
              <CircleCarousel
                items={items.splice(0, 6)}
                carouselCallBack={handleCarouselCallback}
                activeIndex={itemIndex}
                setActiveIndex={setItemIndex}
                isFixedWidth={true}
              />
            ) : (
              <>
                {new Array(isMobile() ? 1 : 4).fill(1).map(() => (
                  <div style={{ margin: '0px 10px' }}>
                    <BaseCardSkeleton />
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      ) : (
        ''
      )}
    </>
  )
}

export default React.memo(Giveaways)
