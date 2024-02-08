import React, { useCallback, useEffect, useRef, useState } from 'react'
import PlayerImage from '@components/PlayerImage'
import {
  displayDateTime,
  getCircleColor,
  getCountryCode,
  getCountryId,
  getCountryNameNew,
  getFlooredFixed,
  getPlayerLevelClassName,
  isMobile,
} from '@utils/helpers'
import '@assets/css/pages/PlayerList.css'
import { useTranslation } from 'react-i18next'
import NewPlayerCard from '@components/Card/NewPlayerCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  fetchListPlayers,
  fetchListPlayersCountry,
  resetAllPlayers,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { fetchPlayersStatsPL } from '@root/apis/playerStats/playerStatsSlice'
import classNames from 'classnames'
import TooltipLabel from '@components/TooltipLabel'
import 'flag-icons/css/flag-icons.min.css'
import { ethers } from 'ethers'
import PlayerListTabGroup from './components/PlayerListTabGroup'
import {
  getWalletDetails,
  showPurchaseForm,
  showSignupForm,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import FilterBar from './components/FilterBar'
import debounce from 'lodash.debounce'
import TitleSkeleton from '@components/Card/TitleSkeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
interface FiltersData {
  limit?: string
  offset?: string
  sorted_by?: string
  search?: string
  reverse?: string
  hot_players?: string
  type?: string
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

  const trendingStyle = {
    border: 'none',
    boxShadow: 'none',
    borderRadius: 'unset',
  }

  return (
    <section
      className="row"
      style={type === 'trending' ? trendingStyle : undefined}
    >
      <div className="section-wrapper player-carousel">
        {type === 'country' ? (
          <span className="blog-title">
            {ipLocaleCountryName}
            <span
              className={`fi fis fi-${ipLocaleCountryCode?.toLowerCase()}`}
            />
          </span>
        ) : (
          <span className="blog-title">
            {type === 'winners' || type === 'losers' ? '24h' : ''}
            {t(
              type === 'trending'
                ? 'trending'
                : type === 'market'
                ? 'high market value'
                : type === 'supporters'
                ? 'most supporters'
                : type === 'winners'
                ? 'winners'
                : type === 'losers'
                ? 'losers'
                : type === 'talents'
                ? 'new talents'
                : '',
            )}
          </span>
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

const PlayerListForm: React.FC = () => {
  const playerListDataRef = useRef<any>(null)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const {
    isNoWallet,
    userName,
    selectedThemeRedux,
    ipLocaleCountryCode,
    ipLocaleCountryName,
    currencyRate,
    getUserSettingsData,
    ipLocaleCurrency,
    walletDetailAddress,
    isVisibleModal,
  } = authenticationData
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('overview')
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [searchedTerm, setSearchedTerm] = useState<string | undefined>('')
  const [scrollIndex, setScrollIndex] = useState(0)
  const [allPlayers, setAllPlayers] = useState<any>([])
  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    sorted_by: 'market_cap',
    reverse: 'True',
    hot_players: 'True',
    type: 'overview',
  })
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const {
    playersListData,
    playersTrendingListData,
    playersMarketListData,
    playersSupportersListData,
    playersWinnersListData,
    playersLosersListData,
    playersTalentsListData,
    playersCountryListData,
    isFetchListPlayerSuccess,
    isFetchListPlayerError,
    isLoading,
    isLoadingList,
    isLoadingCountry,
    nextPlayerListUrl,
    isGetPlayerSuccess,
    latestTradesData,
    exchangeRateData,
  } = playerCoinData

  const { fetchPlayerStatsDataPL } = playerStatsData
  const [prevData, setPrevData] = useState<any>([])
  const [locationPlayerLevelId, setLocationPlayerLevelId] = useState(0)
  const location: any = useLocation()
  const currencySymbol =
    getUserSettingsData?.currency ?? ipLocaleCurrency ?? 'USD'

  const [isFetchedPlayersCountry, setIsFetchedPlayersCountry] = useState(false)
  const [windowSize, setWindowSize] = useState(0)

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
    window.scrollTo(0, 0)
    if (location?.state?.playerLevelId) {
      handleGetTab('all', location?.state?.playerLevelId)
      setLocationPlayerLevelId(location?.state?.playerLevelId)
    }
    return () => {
      clearInterval(playerListInterval)
      dispatch(resetAllPlayers())
    }
  }, [])

  useEffect(() => {
    if (userName) {
      if (accessToken && currencyRate && !walletDetailAddress) {
        dispatch(getWalletDetails()) // COMMENTED FOR PROD
      }
    }
  }, [userName, currencyRate])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

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

  useEffect(() => {
    playerListDataRef.current = allPlayers
  }, [allPlayers])

  useEffect(() => {
    if (
      !appliedFilters?.search &&
      activeTab === 'all' &&
      !isFetchedPlayersCountry
    ) {
      dispatch(fetchListPlayersCountry(getCountryId(ipLocaleCountryCode)))
      setIsFetchedPlayersCountry(true)
    }
    if (
      appliedFilters?.limit ||
      appliedFilters?.offset ||
      appliedFilters?.sorted_by ||
      appliedFilters?.search
    ) {
      dispatch(fetchListPlayers(appliedFilters))
    }
  }, [appliedFilters])

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

  const handleGetTab = (tab: string, playerLevelId?: number | null) => {
    setActiveTab(tab)
    setAllPlayers([])
    clearInterval(playerListInterval)
    let newParams: any = null
    if (tab === 'overview') {
      newParams = {
        sorted_by: 'market_cap',
        reverse: 'True',
        new: 'True',
        type: 'overview',
      }
    } else if (tab === 'new') {
      newParams = {
        sorted_by: 'market_cap',
        reverse: 'True',
        new: 'True',
        type: 'new',
      }
    } else if (tab === 'hot') {
      newParams = {
        sorted_by: 'market_cap',
        reverse: 'True',
        new: 'True',
        type: 'hot',
      }
    } else if (tab === 'all') {
      newParams = {
        sorted_by: 'market_cap',
        reverse: 'True',
      }
      if (playerLevelId) {
        newParams = { ...newParams, player_level: playerLevelId }
      }
    }
    if (tab !== 'all') {
      setLocationPlayerLevelId(0)
    }
    if (searchedTerm) {
      newParams = { search: searchedTerm }
    }
    setAppliedFilters(newParams)
  }

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

  const handleCloseSearch = () => {
    setSearchedTerm('')
    let newParams: any = null
    if (activeTab === 'overview') {
      newParams = {
        sorted_by: 'market_cap',
        reverse: 'True',
        new: 'True',
        type: 'overview',
      }
    } else if (activeTab === 'new') {
      newParams = {
        sorted_by: 'market_cap',
        reverse: 'True',
        new: 'True',
        type: 'new',
      }
    } else if (activeTab === 'hot') {
      newParams = {
        sorted_by: 'market_cap',
        reverse: 'True',
        new: 'True',
        type: 'hot',
      }
    } else if (activeTab === 'all') {
      newParams = {
        sorted_by: 'market_cap',
        reverse: 'True',
      }
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
  const handleFilter = (filterValue: any | undefined) => {
    setAllPlayers([])
    let request = {}
    if (filterValue) {
      request = {
        limit: '10',
        offset: '0',
      }

      request = { ...request, ...filterValue }
    } else {
      request = {
        limit: '10',
        offset: '0',
      }
    }
    setAppliedFilters({ ...appliedFilters, ...request })
  }

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

  const [itemTrendingIndex, setItemTrendingIndex] = useState(0)
  const [itemMarketIndex, setItemMarketIndex] = useState(0)
  const [itemSupportersIndex, setItemSupportersIndex] = useState(0)
  const [itemWinnersIndex, setItemWinnersIndex] = useState(0)
  const [itemLosersIndex, setItemLosersIndex] = useState(0)
  const [itemTalentsIndex, setItemTalentsIndex] = useState(0)
  const [itemCountryIndex, setItemCountryIndex] = useState(0)

  return (
    <section className="player-list-container no-flex">
      <>
        <div
          style={{ position: 'relative' }}
          className={classNames(
            'tab-bar-container',
            isMobile() ? 'players-list-tabgroup' : '',
          )}
        >
          <ArrowBackIosNewIcon
            style={{
              display: isMobile() && scrollIndex > 10 ? 'block' : 'none',
              fontSize: 15,
              position: 'absolute',
              left: '10px',
              top: '37%',
            }}
            onClick={() => handleScroll('back')}
          />
          <PlayerListTabGroup
            isHot
            defaultTab={activeTab}
            getScrollIndex={(index: number) => setScrollIndex(index)}
            tabSet={['overview', 'hot', 'new', 'all']}
            getSwitchedTab={handleGetTab}
            scrollTo={scrollIndex}
            hasSearchBar={true}
            onEdit={optimizedHandleSearch}
            onClose={handleCloseSearch}
          />
          <ArrowForwardIosIcon
            style={{
              display: isMobile() && scrollIndex < 168 ? 'block' : 'none',
              fontSize: 15,
              position: 'absolute',
              right: '10px',
              top: '37%',
            }}
            onClick={() => handleScroll('forth')}
          />
        </div>
        <>
          {searchedTerm === '' && activeTab === 'all' ? (
            //all tab
            <>
              {isLoadingCountry ? (
                <>
                  <div
                    className="nft-item no-data"
                    style={
                      isMobile()
                        ? {
                            display: 'flex',
                            justifyContent: 'flex-start',
                            marginTop: '30px',
                            height: 'auto',
                            padding: '10px',
                            marginLeft: '-30px',
                          }
                        : {
                            display: 'block',
                            marginTop: '50px',
                            height: 'auto',
                            padding: '10px',
                          }
                    }
                  >
                    <TitleSkeleton />
                  </div>
                  <div className="nft-item no-data">
                    {new Array(
                      isMobile()
                        ? 1
                        : windowSize > 3200
                        ? 9
                        : windowSize > 2500
                        ? 8
                        : 6,
                    )
                      .fill(1)
                      .map((_: any, index: number) => (
                        <div key={index} style={{ margin: '0px 10px' }}>
                          <BaseCardSkeleton />
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  {playersCountryListData.length > 0 ? (
                    <MemoizedPlayerRow
                      playersListData={playersCountryListData}
                      handlePurchaseOpen={handlePurchaseOpen}
                      itemIndex={itemCountryIndex}
                      setItemIndex={setItemCountryIndex}
                      type="country"
                      ipLocaleCountryCode={ipLocaleCountryCode}
                      ipLocaleCountryName={ipLocaleCountryName}
                    />
                  ) : (
                    ''
                  )}
                </>
              )}

              <section className="row">
                <div className="section-wrapper">
                  <div className="flex-left">
                    <span className="blog-title">{t('all players')}</span>
                    <FilterBar
                      onClose={handleCloseSearch}
                      handleFilter={handleFilter}
                      playerLevelId={locationPlayerLevelId}
                    />
                  </div>
                  {isLoading && allPlayers.length === 0 ? (
                    <div className="nft-item no-data">
                      {new Array(
                        isMobile()
                          ? 1
                          : windowSize > 3200
                          ? 9
                          : windowSize > 2500
                          ? 8
                          : 6,
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
                          style={{ overflow: 'hidden' }}
                          dataLength={allPlayers.length}
                          next={() => handleJumpToPage('forth')}
                          hasMore={true}
                          scrollThreshold={0.5}
                          loader={
                            !isDeadEnd && isLoading ? (
                              <div className="nft-item no-data">
                                {new Array(isMobile() ? 1 : 6)
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
                          <div
                            className="player-list-wrapper"
                            style={{
                              justifyContent:
                                allPlayers.length > 6 && !isMobile()
                                  ? 'flex-start'
                                  : 'center',
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
                                  onSell={() =>
                                    handlePurchaseOpen('sell', item)
                                  }
                                  playercardjson={item?.playercardjson}
                                />
                              </div>
                            ))}
                          </div>
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
              </section>
            </>
          ) : isLoadingList ? (
            <>
              {activeTab === 'overview' && (
                <div
                  className="nft-item no-data"
                  style={
                    isMobile()
                      ? {
                          display: 'flex',
                          justifyContent: 'flex-start',
                          marginTop: '30px',
                          height: 'auto',
                          padding: '10px',
                          marginLeft: '-30px',
                        }
                      : {
                          display: 'block',
                          marginTop: '50px',
                          height: 'auto',
                          padding: '10px',
                        }
                  }
                >
                  <TitleSkeleton />
                </div>
              )}
              <div className="nft-item no-data">
                {new Array(
                  isMobile()
                    ? 1
                    : windowSize > 3200
                    ? 9
                    : windowSize > 2500
                    ? 8
                    : 6,
                )
                  .fill(1)
                  .map((_: any, index: number) => (
                    <div key={index} style={{ margin: '0px 10px' }}>
                      <BaseCardSkeleton />
                    </div>
                  ))}
              </div>
              <div className="nft-item no-data">
                {new Array(
                  isMobile()
                    ? 1
                    : windowSize > 3200
                    ? 9
                    : windowSize > 2500
                    ? 8
                    : 6,
                )
                  .fill(1)
                  .map((_: any, index: number) => (
                    <div key={index} style={{ margin: '0px 10px' }}>
                      <BaseCardSkeleton />
                    </div>
                  ))}
              </div>
            </>
          ) : allPlayers.length > 0 ? (
            searchedTerm !== '' ||
            activeTab === 'hot' ||
            activeTab === 'new' ? ( // hot, new tab and search mode
              <div
                className="player-list-wrapper"
                style={{
                  justifyContent:
                    allPlayers.length > 6 && !isMobile()
                      ? 'flex-start'
                      : 'center',
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
            ) : (
              //overview tab
              <>
                {playersTrendingListData.length > 0 ? (
                  <MemoizedPlayerRow
                    playersListData={playersTrendingListData}
                    handlePurchaseOpen={handlePurchaseOpen}
                    itemIndex={itemTrendingIndex}
                    setItemIndex={setItemTrendingIndex}
                    type="trending"
                  />
                ) : null}
                {playersMarketListData.length > 0 ? (
                  <MemoizedPlayerRow
                    playersListData={playersMarketListData}
                    handlePurchaseOpen={handlePurchaseOpen}
                    itemIndex={itemMarketIndex}
                    setItemIndex={setItemMarketIndex}
                    type="market"
                  />
                ) : null}
                {latestTradesData.length > 0 ? (
                  <div className="row">
                    <div className="section-wrapper">
                      <span className="blog-title">{t('latest trades')}</span>
                      <div className="players-table-wrapper">
                        <div className="players-table-container">
                          <div className="list-header">
                            {isMobile() ? (
                              <div className="first-column">
                                <div style={{ width: '40vw' }}>
                                  {t('player')}
                                </div>
                                <div style={{ width: '50vw' }}>
                                  {t('coins traded')}
                                </div>
                              </div>
                            ) : (
                              <>
                                <div>{t('player')}</div>
                                <div>{t('coins traded')}</div>
                              </>
                            )}
                            <div>{t('price')}</div>
                            <div>{t('total trade')}</div>
                            <div style={{ textAlign: 'right' }}>
                              {t('time')}
                            </div>
                          </div>
                          {latestTradesData.map((item: any, index: number) => (
                            <div key={index} className="nft-item">
                              {isMobile() ? (
                                <div className="first-column">
                                  <div
                                    className="nft-image-section"
                                    onClick={() =>
                                      navigate(
                                        `/app/player/${item.detailpageurl}`,
                                      )
                                    }
                                  >
                                    <div
                                      className="image-border"
                                      style={{
                                        background: getCircleColor(
                                          item?.playerlevelid,
                                        ),
                                      }}
                                    >
                                      <PlayerImage
                                        src={item.playerpicturethumb}
                                        className="nft-image"
                                        hasDefault={true}
                                      />
                                    </div>
                                    <div className="nft-name">
                                      <span
                                        className={getPlayerLevelClassName(
                                          item?.playerlevelid,
                                        )}
                                        style={{ fontSize: '21px' }}
                                      >
                                        {item.name}{' '}
                                        {item?.ticker
                                          ? `$${item?.ticker}`
                                          : ''}
                                        <TooltipLabel
                                          title={getCountryNameNew(
                                            item?.country_id ||
                                              item?.nationality_id,
                                          )}
                                        >
                                          <span
                                            className={`fi fis fi-${getCountryCode(
                                              item?.country_id ||
                                                item?.nationality_id,
                                            )}`}
                                          />
                                        </TooltipLabel>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ticker-field">
                                    <div
                                      className={classNames(
                                        'number-color',
                                        item.amt > 0 ? 'profit' : 'loss',
                                      )}
                                    >
                                      {getFlooredFixed(Math.abs(item.amt), 2)}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div
                                    className="nft-image-section"
                                    onClick={() =>
                                      navigate(
                                        `/app/player/${item.detailpageurl}`,
                                      )
                                    }
                                  >
                                    <div
                                      className="image-border"
                                      style={{
                                        background: getCircleColor(
                                          item?.playerlevelid,
                                        ),
                                      }}
                                    >
                                      <PlayerImage
                                        src={item.playerpicturethumb}
                                        className="nft-image"
                                        hasDefault={true}
                                      />
                                    </div>
                                    <div className="nft-name">
                                      <span
                                        className={getPlayerLevelClassName(
                                          item?.playerlevelid,
                                        )}
                                        style={{ fontSize: '21px' }}
                                      >
                                        {item.name}{' '}
                                        {item?.ticker
                                          ? `$${item?.ticker}`
                                          : ''}
                                        <TooltipLabel
                                          title={getCountryNameNew(
                                            item?.country_id ||
                                              item?.nationality_id,
                                          )}
                                        >
                                          <span
                                            className={`fi fis fi-${getCountryCode(
                                              item?.country_id ||
                                                item?.nationality_id,
                                            )}`}
                                          />
                                        </TooltipLabel>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ticker-field">
                                    <div
                                      className={classNames(
                                        'number-color',
                                        item.amt > 0 ? 'profit' : 'loss',
                                      )}
                                    >
                                      {getFlooredFixed(Math.abs(item.amt), 2)}
                                    </div>
                                  </div>
                                </>
                              )}
                              <div className="player-info-stats">
                                {getFlooredFixed(
                                  item.price *
                                    exchangeRateData?.rate *
                                    currencyRate,
                                  3,
                                )}
                                &nbsp;
                                {currencySymbol}
                              </div>
                              <div className="ticker-field">
                                <div
                                  className={classNames(
                                    'number-color',
                                    item.amt > 0 ? 'profit' : 'loss',
                                  )}
                                >
                                  {getFlooredFixed(
                                    Math.abs(item.totaltrade) *
                                      exchangeRateData?.rate *
                                      currencyRate,
                                    3,
                                  )}
                                  &nbsp;
                                  {currencySymbol}
                                </div>
                              </div>
                              <div className="player-info-stats">
                                {displayDateTime(item.tradetimestamp * 1000)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {playersSupportersListData.length > 0 ? (
                  <MemoizedPlayerRow
                    playersListData={playersSupportersListData}
                    handlePurchaseOpen={handlePurchaseOpen}
                    itemIndex={itemSupportersIndex}
                    setItemIndex={setItemSupportersIndex}
                    type="supporters"
                  />
                ) : null}
                {playersWinnersListData.length > 0 ? (
                  <MemoizedPlayerRow
                    playersListData={playersWinnersListData}
                    handlePurchaseOpen={handlePurchaseOpen}
                    itemIndex={itemWinnersIndex}
                    setItemIndex={setItemWinnersIndex}
                    type="winners"
                  />
                ) : null}
                {playersLosersListData.length > 0 ? (
                  <MemoizedPlayerRow
                    playersListData={playersLosersListData}
                    handlePurchaseOpen={handlePurchaseOpen}
                    itemIndex={itemLosersIndex}
                    setItemIndex={setItemLosersIndex}
                    type="losers"
                  />
                ) : null}
                {playersTalentsListData.length > 0 ? (
                  <MemoizedPlayerRow
                    playersListData={playersTalentsListData}
                    handlePurchaseOpen={handlePurchaseOpen}
                    itemIndex={itemTalentsIndex}
                    setItemIndex={setItemTalentsIndex}
                    type="talents"
                  />
                ) : null}
              </>
            )
          ) : (
            <div className="nft-item no-data">
              {isFetchListPlayerError ? (
                <div className="heading-title unverified-alert text-center">
                  {t('no data found')}
                </div>
              ) : (
                ''
              )}
            </div>
          )}
        </>
      </>
    </section>
  )
}

export default PlayerListForm
