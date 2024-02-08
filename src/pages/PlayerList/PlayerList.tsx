/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  getCountryId,
  initTagManager,
  isMobile,
  toKPIIntegerFormat,
} from '@utils/helpers'
import '@assets/css/pages/NftList.css'
import classNames from 'classnames'
import {
  fetchListPlayers,
  fetchListPlayersAll,
  fetchListPlayersCountry,
  fetchListPlayersLatestTrades,
  fetchListPlayersMarket,
  getPlayersComingSoon,
  getPlayersCount,
  getScoutsLeaderboard,
  getScoutsTop,
  resetAllPlayers,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { useTranslation } from 'react-i18next'
import PlayerListTabGroup from '@pages/PlayerList/components/PlayerListTabGroup'
import debounce from 'lodash.debounce'
import { getFeedPlayers } from '@root/apis/playerCoins/playerCoinsSlice'
import '@assets/css/pages/NewPlayerList.css'
import UserCardSkeleton from '@components/Card/UserCardSkeleton'
import ScoutsCard from '@components/Card/ScoutsCard'
import SearchInput from '@components/Form/LandingSearchInput'
import { useNavigate } from 'react-router-dom'
import PlayerImage from '@components/PlayerImage'
import {
  displayDateTime,
  getCircleColor,
  getCountryCode,
  getCountryNameNew,
  getFlooredFixed,
  getPlayerLevelClassName,
} from '@utils/helpers'
import {
  getWalletDetails,
  showPurchaseForm,
  showSignupForm,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import TooltipLabel from '@components/TooltipLabel'
import ScoutsCardSupporter from '@components/Card/ScoutsCardSupporter'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import PublicIcon from '@mui/icons-material/Public'
import RecordIcon from '@assets/icons/icon/record.png'
import InfiniteScroll from 'react-infinite-scroll-component'
import NewPlayerCard from '@components/Card/NewPlayerCard'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import CircleCarousel from '@components/Carousel/PlayersComingSoonCarousel'
import { ethers } from 'ethers'
import { fetchPlayersStatsPL } from '@root/apis/playerStats/playerStatsSlice'
import PlayersCardSupporter from '@components/Card/PlayersCardSupporter'
import Spinner from '@components/Spinner'

interface FiltersData {
  limit?: any
  offset?: any
  search?: string
  type?: string
  status_id?: number
}

let playerListInterval: any = null

interface PlayerRowProps {
  playersListData: any
  handlePurchaseOpen: any
  itemIndex: number
  setItemIndex: any
  type: string
  ipLocaleCountryName?: string
  ipLocaleCountryCode?: string
}

const PlayerRow: React.FC<PlayerRowProps> = ({
  playersListData,
  handlePurchaseOpen,
  itemIndex,
  setItemIndex,
  type,
  ipLocaleCountryName,
  ipLocaleCountryCode,
}) => {
  const { t } = useTranslation()
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsDataPL } = playerStatsData

  const [players, setPlayers] = useState(playersListData)
  const [prevData, setPrevData] = useState([])

  useEffect(() => {
    let playersTableDataTemp = [...players]
    if (fetchPlayerStatsDataPL && fetchPlayerStatsDataPL.length > 0) {
      playersTableDataTemp = playersTableDataTemp.map(item => {
        const item2 = fetchPlayerStatsDataPL.find(
          (i2: any) =>
            item?.playercontract &&
            i2?.player &&
            ethers.utils.getAddress(i2?.player) ===
              ethers.utils.getAddress(item?.playercontract),
        )
        return item2 ? { ...item, ...item2 } : item
      })
    }
    setPrevData(players)
    setPlayers(playersTableDataTemp)
  }, [fetchPlayerStatsDataPL])

  return (
    <section className="row">
      <div className="section-wrapper player-carousel">
        {type === 'country' ? (
          <div className="players-section-title">
            <span className="mr-10">
              {t('Best Of ')} {!isMobile() ? ipLocaleCountryName : null}
            </span>{' '}
            <span className={`fi fi-${ipLocaleCountryCode?.toLowerCase()}`} />
          </div>
        ) : (
          <div className="players-section-title">
            <span>{t('Global Top 5')}</span>
            <PublicIcon className="players-global-icon" />
          </div>
        )}
        <CircleCarousel
          items={players.map((item: any, index: number) => (
            <div
              style={{
                lineHeight: '16px',
              }}
              key={index}
            >
              <NewPlayerCard
                card={item}
                prevData={prevData[index]}
                key={index + 2}
                onBuy={() => handlePurchaseOpen('buy', item)}
                onSell={() => handlePurchaseOpen('sell', item)}
                playercardjson={item?.playercardjson}
              />
            </div>
          ))}
          // isFinite={true}
          activeIndex={itemIndex}
          setActiveIndex={setItemIndex}
        />
      </div>
    </section>
  )
}

const MemoizedPlayerRow = React.memo(PlayerRow)

const PlayerList: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchedTerm, setSearchedTerm] = useState<string | undefined>('')

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    isGetPlayerSuccess,
    nextPlayerListUrl,
    isLoading,
    playersCount,
    playersComingSoon,
    playersMarketListData,
    playersCountryListData,
    loadingPlayersComingSoon,
    isLoadingPlayersMarketListData,
    isLoadingCountry,
    playersListData,
    isFetchListPlayerSuccess,
  } = playerCoinData
  const [scrollIndex, setScrollIndex] = useState(0)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { ipLocaleCountryCode, ipLocaleCountryName, isVisibleModal } =
    authenticationData

  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsDataPL } = playerStatsData

  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    search: '',
    type: 'overview',
    status_id: 4,
  })
  const [isDeadEnd, setIsDeadEnd] = useState(false)

  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')

  const [comingSoonItemIndex, setComingSoonItemIndex] = useState(0)

  const [itemMarketIndex, setItemMarketIndex] = useState(0)
  const [itemCountryIndex, setItemCountryIndex] = useState(0)

  const [windowSize, setWindowSize] = useState(0)
  const [allPlayers, setAllPlayers] = useState<any>([])

  useEffect(() => {
    let playersTableDataTemp = [...allPlayers]
    if (fetchPlayerStatsDataPL && fetchPlayerStatsDataPL.length > 0) {
      playersTableDataTemp = playersTableDataTemp.map(item => {
        const item2 = fetchPlayerStatsDataPL.find(
          (i2: any) =>
            item?.playercontract &&
            i2?.player &&
            ethers.utils.getAddress(i2?.player) ===
              ethers.utils.getAddress(item?.playercontract),
        )
        return item2 ? { ...item, ...item2 } : item
      })
    }
    setPrevData(allPlayers)
    setAllPlayers(playersTableDataTemp)
  }, [fetchPlayerStatsDataPL])

  useEffect(() => {
    clearInterval(playerListInterval)
    if (!isVisibleModal && !document.hidden && playersListData.length > 0) {
      let updatedAllPlayers: any = []
      if (appliedFilters?.limit || appliedFilters?.offset) {
        if (playersListData.length > 0 && isFetchListPlayerSuccess) {
          updatedAllPlayers = [...allPlayers, ...playersListData]
          setAllPlayers(updatedAllPlayers)
        } else if (playersListData.length === 0 && isFetchListPlayerSuccess) {
          updatedAllPlayers = allPlayers
          setIsDeadEnd(true)
        }
      } else {
        updatedAllPlayers = playersListData
        setAllPlayers(updatedAllPlayers)
      }

      handleGetPriceStats(updatedAllPlayers)
      playerListInterval = setInterval(() => {
        handleGetPriceStats(updatedAllPlayers)
      }, 20000)
    }
  }, [playersListData, isVisibleModal, document.hidden])

  const handleGetTab = (tab: string) => {
    setActiveTab(tab)
    let newParams: any = { type: tab }
    if (searchedTerm) {
      newParams = { ...newParams, search: searchedTerm }
    }
    setAppliedFilters(newParams)
  }

  const handleSearch = (value: string | undefined) => {
    setAllPlayers([])
    let request = {}
    setSearchedTerm(value)
    if (value) {
      request = {
        limit: '10',
        offset: '0',
        search: value,
      }
    } else {
      request = {
        limit: '10',
        offset: '0',
      }
    }
    setAppliedFilters({ ...request })
  }
  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])

  const handleCloseSearch = () => {
    setSearchedTerm('')
    setAllPlayers([])
    setAppliedFilters({
      type: activeTab,
      status_id: 4,
      search: '',
      limit: '10',
    })
  }

  const handleScroll = (direction: string) => {
    if (direction === 'forth') {
      if (scrollIndex <= 300) {
        setScrollIndex(scrollIndex + 30)
      }
    } else {
      if (scrollIndex > 0) {
        setScrollIndex(scrollIndex - 30)
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => {
      clearInterval(playerListInterval)
      dispatch(resetAllPlayers())
    }
  }, [])

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

  useEffect(() => {
    dispatch(getPlayersCount())
    dispatch(getPlayersComingSoon())
    dispatch(fetchListPlayersMarket())
    dispatch(fetchListPlayersAll(appliedFilters))
  }, [])

  useEffect(() => {
    if (
      appliedFilters?.limit ||
      appliedFilters?.offset ||
      appliedFilters?.search
    ) {
      dispatch(fetchListPlayersAll(appliedFilters))
    }
  }, [appliedFilters])

  useEffect(() => {
    if (ipLocaleCountryCode) {
      dispatch(fetchListPlayersCountry(getCountryId(ipLocaleCountryCode)))
    }
  }, [ipLocaleCountryCode])

  const [prevData, setPrevData] = useState<any>([])

  const handleGetPriceStats = (playersData: any) => {
    const playersSet: number[] = playersData
      .filter((player: any) => {
        return player.playerstatusid > 3
      })
      .map((item: any) => item.playercontract)
    if (playersSet.length > 0) {
      dispatch(fetchPlayersStatsPL({ contracts: playersSet, query: 'complex' }))
    }
  }

  const getUrlParams = (url: string, param1: string, param2: string) => {
    if (!url) {
      return url
    }
    const url_string = url
    const newUrl = new URL(url_string)
    const obj: any = new Object()
    obj[param1] = newUrl.searchParams.get(param1)
    obj[param2] = newUrl.searchParams.get(param2)
    return obj
  }

  const handleJumpToPage = (head: string) => {
    if (head !== 'back') {
      const paginationParams = getUrlParams(
        nextPlayerListUrl,
        'limit',
        'offset',
      )
      if (
        nextPlayerListUrl &&
        paginationParams.offset !== appliedFilters?.offset
      ) {
        setIsDeadEnd(false)
        setAppliedFilters({ ...appliedFilters, ...paginationParams })
      } else {
        setIsDeadEnd(true)
      }
    }
  }

  useEffect(() => {
    if (nextPlayerListUrl) {
      setIsDeadEnd(false)
    } else {
      setIsDeadEnd(true)
    }
  }, [nextPlayerListUrl])

  const handlePurchaseOpen = useCallback((value: string, data: any) => {
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
  }, [])

  return (
    <section
      className="nft-list-container"
      style={{ paddingBottom: activeTab === 'new' ? '50px' : '30px' }}
    >
      <div
        style={{ position: 'relative' }}
        className={classNames(
          'tab-bar-container',
          isMobile() ? 'players-list-tabgroup' : '',
        )}
      >
        <PlayerListTabGroup
          isHot
          defaultTab={activeTab}
          getScrollIndex={(index: number) => setScrollIndex(index)}
          tabSet={['overview']}
          getSwitchedTab={handleGetTab}
          scrollTo={scrollIndex}
          hasSearchBar={true}
          onEdit={optimizedHandleSearch}
          onClose={handleCloseSearch}
        />
      </div>
      <div className="players-container">
        {allPlayers.length > 0 && searchedTerm !== '' ? ( // search mode
          <div
            className="player-list-wrapper"
            style={{
              justifyContent:
                allPlayers.length > 6 && !isMobile() ? 'flex-start' : 'center',
              marginTop: isMobile() ? '20px' : '34px',
            }}
          >
            {allPlayers.map((item: any, index: number) => (
              <div
                style={{
                  lineHeight: '16px',
                }}
                key={index}
              >
                <NewPlayerCard
                  card={item}
                  prevData={prevData[index]}
                  key={index + 2}
                  onBuy={() => handlePurchaseOpen('buy', item)}
                  onSell={() => handlePurchaseOpen('sell', item)}
                  playercardjson={item?.playercardjson}
                />
              </div>
            ))}
          </div>
        ) : isLoading && searchedTerm !== '' ? (
          <div className="nft-item no-data">
            {new Array(
              windowSize >= 1600
                ? 5
                : windowSize >= 1220
                ? 4
                : windowSize >= 912
                ? 3
                : windowSize >= 620
                ? 2
                : 1,
            )
              .fill(1)
              .map((_: any, index: number) => (
                <div key={index} style={{ margin: '0px 10px' }}>
                  <BaseCardSkeleton />
                </div>
              ))}
          </div>
        ) : (
          <>
            <div className="players-count-wrapper">
              <div className="players-count-item">
                <div className="players-count-title">{t('Players')}</div>
                <div className="players-count-number">
                  {playersCount.playerCount}
                </div>
              </div>
              <div className="players-count-item">
                <div className="players-count-title">{t('Tokens')}</div>
                <div className="players-count-number">
                  {toKPIIntegerFormat(playersCount.tokenCount)}
                </div>
              </div>
              <div className="players-count-item">
                <div className="players-count-title">{t('Countries')}</div>
                <div className="players-count-number">
                  {playersCount.uniqueCountryCount}
                </div>
              </div>
            </div>
            <div className="players-coming-soon-wrapper">
              <div className="players-section-title">
                <span>{t('Coming Soon')}</span>
                <RocketLaunchIcon className="players-coming-soon-icon" />
              </div>
              <div className="players-coming-soon-content">
                {loadingPlayersComingSoon && (
                  <div className="nft-item no-data">
                    {new Array(
                      windowSize >= 1600
                        ? 5
                        : windowSize >= 1220
                        ? 4
                        : windowSize >= 912
                        ? 3
                        : windowSize >= 620
                        ? 2
                        : 1,
                    )
                      .fill(1)
                      .map((_: any, index: number) => (
                        <div key={index} style={{ margin: '0px 10px' }}>
                          <BaseCardSkeleton />
                        </div>
                      ))}
                  </div>
                )}
                {playersComingSoon.length === 0 &&
                  !loadingPlayersComingSoon && (
                    <div className="no-data-msg">{t('no data found')}</div>
                  )}

                <CircleCarousel
                  items={playersComingSoon.map((item: any, index: number) => (
                    <div
                      style={{
                        lineHeight: '16px',
                      }}
                      key={index}
                    >
                      <NewPlayerCard
                        card={item}
                        prevData={prevData[index]}
                        key={index + 2}
                        onBuy={() => handlePurchaseOpen('buy', item)}
                        onSell={() => handlePurchaseOpen('sell', item)}
                        playercardjson={item?.playercardjson}
                      />
                    </div>
                  ))}
                  // isFinite={true}
                  activeIndex={comingSoonItemIndex}
                  setActiveIndex={setComingSoonItemIndex}
                />
              </div>
            </div>
            <div className="players-coming-soon-wrapper">
              <div className="players-section-title">
                <span>{t('Global Top 5')}</span>
                <PublicIcon className="players-global-icon" />
              </div>
              <div className="players-coming-soon-content">
                {isLoadingPlayersMarketListData && (
                  <div className="nft-item no-data">
                    {new Array(
                      windowSize >= 1600
                        ? 5
                        : windowSize >= 1220
                        ? 4
                        : windowSize >= 912
                        ? 3
                        : windowSize >= 620
                        ? 2
                        : 1,
                    )
                      .fill(1)
                      .map((_: any, index: number) => (
                        <div key={index} style={{ margin: '0px 10px' }}>
                          <BaseCardSkeleton />
                        </div>
                      ))}
                  </div>
                )}
                <CircleCarousel
                  items={playersMarketListData.map(
                    (item: any, index: number) => (
                      <div
                        style={{
                          lineHeight: '16px',
                        }}
                        key={index}
                      >
                        <NewPlayerCard
                          card={item}
                          prevData={prevData[index]}
                          key={index + 2}
                          onBuy={() => handlePurchaseOpen('buy', item)}
                          onSell={() => handlePurchaseOpen('sell', item)}
                          playercardjson={item?.playercardjson}
                        />
                      </div>
                    ),
                  )}
                  // isFinite={true}
                  activeIndex={itemMarketIndex}
                  setActiveIndex={setItemMarketIndex}
                />
              </div>
            </div>
            {playersCountryListData.length > 0 && (
              <div className="players-coming-soon-wrapper">
                <div className="players-section-title">
                  <span className="mr-10">
                    {t('Best Of ')} {!isMobile() ? ipLocaleCountryName : null}
                  </span>{' '}
                  <span
                    className={`fi fi-${ipLocaleCountryCode?.toLowerCase()}`}
                  />
                </div>
                <div className="players-coming-soon-content">
                  {isLoadingCountry && (
                    <div className="nft-item no-data">
                      {new Array(
                        windowSize >= 1600
                          ? 5
                          : windowSize >= 1220
                          ? 4
                          : windowSize >= 912
                          ? 3
                          : windowSize >= 620
                          ? 2
                          : 1,
                      )
                        .fill(1)
                        .map((_: any, index: number) => (
                          <div key={index} style={{ margin: '0px 10px' }}>
                            <BaseCardSkeleton />
                          </div>
                        ))}
                    </div>
                  )}
                  <CircleCarousel
                    items={playersCountryListData.map(
                      (item: any, index: number) => (
                        <div
                          style={{
                            lineHeight: '16px',
                          }}
                          key={index}
                        >
                          <NewPlayerCard
                            card={item}
                            prevData={prevData[index]}
                            key={index + 2}
                            onBuy={() => handlePurchaseOpen('buy', item)}
                            onSell={() => handlePurchaseOpen('sell', item)}
                            playercardjson={item?.playercardjson}
                          />
                        </div>
                      ),
                    )}
                    // isFinite={true}
                    activeIndex={itemCountryIndex}
                    setActiveIndex={setItemCountryIndex}
                  />
                </div>
              </div>
            )}
            <div className="players-coming-soon-wrapper players-live-section">
              <div className="players-section-title">
                <span>{t('Live')}</span>
                <span className="players-record-icon">
                  <img src={RecordIcon} alt="live-icon"></img>
                </span>
              </div>
              <div className="players-coming-soon-content">
                {isLoading && allPlayers.length === 0 ? (
                  <div className="nft-item no-data">
                    {new Array(
                      windowSize >= 1600
                        ? 5
                        : windowSize >= 1220
                        ? 4
                        : windowSize >= 912
                        ? 3
                        : windowSize >= 620
                        ? 2
                        : 1,
                    )
                      .fill(1)
                      .map((_: any, index: number) => (
                        <div key={index} style={{ margin: '0px 10px' }}>
                          <BaseCardSkeleton />
                        </div>
                      ))}
                  </div>
                ) : (
                  <>
                    {allPlayers.length > 0 ? (
                      <InfiniteScroll
                        className="circle-carousel"
                        style={{ overflow: 'hidden' }}
                        dataLength={allPlayers.length}
                        // next={() => handleJumpToPage('forth')}
                        next={() => console.log('')}
                        hasMore={true}
                        scrollThreshold={0.5}
                        loader={
                          !isDeadEnd && isLoading && !isMobile() ? (
                            <div className="nft-item no-data">
                              {new Array(
                                windowSize >= 1600
                                  ? 5
                                  : windowSize >= 1220
                                  ? 4
                                  : windowSize >= 912
                                  ? 3
                                  : windowSize >= 620
                                  ? 2
                                  : 1,
                              )
                                .fill(1)
                                .map((_: any, index: number) => (
                                  <div
                                    key={index}
                                    style={{ margin: '0px 10px' }}
                                  >
                                    <BaseCardSkeleton />
                                  </div>
                                ))}
                            </div>
                          ) : null
                        }
                        endMessage={
                          <p style={{ textAlign: 'center' }}>
                            <b>. . .</b>
                          </p>
                        }
                      >
                        {isMobile() ? (
                          <div className="user-list-column">
                            {allPlayers.map((item: any, index: number) => (
                              <PlayersCardSupporter
                                user={item}
                                index={index + 1}
                                key={index}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="player-list-wrapper">
                            {allPlayers.map((item: any, index: number) => (
                              <div
                                style={{
                                  lineHeight: '16px',
                                }}
                                key={index}
                              >
                                <NewPlayerCard
                                  card={item}
                                  prevData={prevData[index]}
                                  key={index + 2}
                                  onBuy={() => handlePurchaseOpen('buy', item)}
                                  onSell={() =>
                                    handlePurchaseOpen('sell', item)
                                  }
                                  playercardjson={item?.playercardjson}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {isDeadEnd ? null : isLoading ? (
                          isMobile() && (
                            <div className="showmore-btn-wrapper">
                              <Spinner spinnerStatus={true} />
                            </div>
                          )
                        ) : (
                          <div className="showmore-btn-wrapper">
                            <div
                              className="showmore-btn"
                              onClick={() => handleJumpToPage('forth')}
                            >
                              {t('show more')}
                            </div>
                          </div>
                        )}
                      </InfiniteScroll>
                    ) : isGetPlayerSuccess ? (
                      <div className="nft-item no-data">
                        <div className="heading-title unverified-alert text-center">
                          {t('no data found')}
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default PlayerList
