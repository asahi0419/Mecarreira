import { useEffect, useRef, useState, useCallback } from 'react'
import SearchBar from '@components/SearchBar'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { isMobile } from '@utils/helpers'
import {
  showPurchaseForm,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import {
  getAllDraftsData,
  getDraftedByData,
} from '@root/apis/playerCoins/playerCoinsSlice'
import '@assets/css/pages/Drafts.css'
import {
  fetchPlayersStatsPlayerDrafts,
  resetPlayerStatsPlayerDrafts,
} from '@root/apis/playerStats/playerStatsSlice'
import { ethers } from 'ethers'
import NewPlayerDraftCard from '@components/Card/NewPlayerDraftCard'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import debounce from 'lodash.debounce'
import CircleCarousel from '@components/Carousel/CircleCarousel'

let draftPlayerInterval: any = null
interface FiltersData {
  sorted_by?: string
  search?: string
  reverse?: string
  contract: string
  limit?: string
  offset?: string
}

const Drafts = () => {
  const { t } = useTranslation()
  const draftsRef = useRef<any>([])
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { isVisibleModal } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const dispatch = useDispatch()
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')

  const {
    cardPlayerDetailsSuccessData,
    isLoadingDraftedBy,
    isGetDraftedByError,
    playerDraftedByData,
    isLoadingAllDrafts,
    isGetAllDraftsError,
    playerAllDraftsData,
  } = playerCoinData

  const { playerDraftsStatsData } = playerStatsData

  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    contract: cardPlayerDetailsSuccessData?.playercontract,
  })
  const [mode, setMode] = useState('my_drafts')
  const [filterShow, setFilterShow] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [draftedByData, setDraftedByData] = useState<any>([])
  const [myDraftedData, setMyDraftedData] = useState<any>([])
  const [testStat, setTestStat] = useState<any>([])
  const [searchedTerm, setSearchedTerm] = useState<string | undefined>('')
  const [draftedByActiveIndex, setDraftedByActiveIndex] = useState(0)
  const [draftActiveIndex, setDraftActiveIndex] = useState(0)
  const [windowSize, setWindowSize] = useState(0)

  useEffect(() => {
    return () => {
      clearInterval(draftPlayerInterval)
    }
  }, [])

  useEffect(() => {
    if (
      appliedFilters?.limit ||
      appliedFilters?.offset ||
      appliedFilters?.sorted_by ||
      appliedFilters?.search
    ) {
      if (mode === 'my_drafts') {
        getMyDrafts()
      } else {
        dispatch(getDraftedByData(appliedFilters))
      }
    }
  }, [appliedFilters])

  useEffect(() => {
    if (!searchedTerm) {
      if (mode === 'my_drafts') {
        getMyDrafts()
      } else {
        if (isFirstLoad) {
          setIsFirstLoad(false)
        } else {
          dispatch(getDraftedByData(appliedFilters))
        }
      }
    }
  }, [mode, appliedFilters])

  useEffect(() => {
    if (playerDraftsStatsData.length > 0) {
      if (mode === 'my_drafts' && playerAllDraftsData?.all_draft?.length > 0) {
        const playersWithStats = updatePlayersSet(
          playerAllDraftsData?.all_draft,
        )
        setMyDraftedData(playersWithStats)
      } else if (
        mode === 'drafted_by' &&
        playerDraftedByData?.drafted_by?.length > 0
      ) {
        const playersWithStats = updatePlayersSet(
          playerDraftedByData?.drafted_by,
        )
        setDraftedByData(playersWithStats)
      }
      setTestStat(playerDraftsStatsData)
    }
  }, [playerDraftsStatsData])

  const getMyDrafts = async () => {
    dispatch(getAllDraftsData(appliedFilters))
  }

  const updatePlayersSet = (mainArr: any) => {
    let playersTableDataTemp = mainArr
    playersTableDataTemp = playersTableDataTemp.map((item: any) => {
      const item2 = playerDraftsStatsData.find(
        (i2: any) =>
          item?.playercontract &&
          i2?.player &&
          ethers.utils.getAddress(i2?.player) ===
            ethers.utils.getAddress(item?.playercontract),
      )
      return item2 ? { ...item, ...item2 } : item
    })
    return playersTableDataTemp
  }

  useEffect(() => {
    draftsRef.current = testStat
  }, [testStat])

  useEffect(() => {
    clearInterval(draftPlayerInterval)
    if (!isVisibleModal) {
      if (mode === 'my_drafts') {
        if (playerAllDraftsData?.all_draft?.length > 0) {
          handleGetPriceStats(playerAllDraftsData?.all_draft)
        } else {
          setMyDraftedData([])
        }
      } else if (mode === 'drafted_by') {
        if (playerDraftedByData?.drafted_by?.length > 0) {
          handleGetPriceStats(playerDraftedByData?.drafted_by)
        } else {
          setDraftedByData([])
        }
      }
    }
  }, [playerAllDraftsData, playerDraftedByData, isVisibleModal])

  useEffect(() => {
    if (document.hidden) {
      clearInterval(draftPlayerInterval)
    }
  }, [document.hidden])

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

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

  const handleGetPriceStats = (playersData: any) => {
    const playersSet: number[] = playersData
      .filter((player: any) => {
        return player.playerstatusid >= 3
      })
      .map((item: any) => item.playercontract)
    if (playersSet.length > 0) {
      dispatch(
        fetchPlayersStatsPlayerDrafts({
          contracts: playersSet,
          query: 'complex',
        }),
      )
      clearInterval(draftPlayerInterval)
      draftPlayerInterval = setInterval(() => {
        dispatch(
          fetchPlayersStatsPlayerDrafts({
            contracts: playersSet,
            query: 'complex',
          }),
        )
      }, 20000)
    }
  }

  const handleSwitch = (tab: string) => {
    clearInterval(draftPlayerInterval)
    dispatch(resetPlayerStatsPlayerDrafts(''))
    setMode(tab)
  }

  const handleCloseSearch = () => {
    setSearchedTerm('')
    const newParams: any = {
      contract: cardPlayerDetailsSuccessData?.playercontract,
    }
    setAppliedFilters(newParams)
  }

  const handleSearch = (value: string | undefined) => {
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
    setAppliedFilters({ ...appliedFilters, ...request })
  }
  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])
  return (
    <div className="profile-drafts-container">
      <div className="drafts-wrapper">
        {isMobile() ? (
          <div className="drafts-header-mobile">
            <div
              className="search-bar-container drafts-search"
              id="profile-drafts"
            >
              {filterShow ? (
                <div className="list-header">
                  <div
                    className={
                      mode === 'my_drafts'
                        ? 'button-hover capitalize'
                        : 'capitalize'
                    }
                    onClick={() => handleSwitch('my_drafts')}
                  >
                    {t('my_drafts')}
                  </div>
                  <div
                    className={
                      mode === 'drafted_by'
                        ? 'button-hover capitalize'
                        : 'capitalize'
                    }
                    onClick={() => handleSwitch('drafted_by')}
                  >
                    {t('drafted_by')}
                  </div>
                </div>
              ) : null}
            </div>
            <SearchBar
              mode=""
              onSearchEnabled={() => setFilterShow(!filterShow)}
              isFilterDisabled
              containerClass={classNames(!filterShow ? 'fill-search-bar' : '')}
              onEdit={optimizedHandleSearch}
              onClose={handleCloseSearch}
            />
          </div>
        ) : (
          <div className="flex-center">
            <div
              className="search-bar-container drafts-search"
              id="profile-drafts"
            >
              {filterShow ? (
                <div className="list-header">
                  <div
                    className={
                      mode === 'my_drafts'
                        ? 'button-hover capitalize'
                        : 'capitalize'
                    }
                    onClick={() => handleSwitch('my_drafts')}
                  >
                    {t('my_drafts')}
                  </div>
                  <div
                    className={
                      mode === 'drafted_by'
                        ? 'button-hover capitalize'
                        : 'capitalize'
                    }
                    onClick={() => handleSwitch('drafted_by')}
                  >
                    {t('drafted_by')}
                  </div>
                </div>
              ) : null}
              <SearchBar
                mode=""
                onSearchEnabled={() => setFilterShow(!filterShow)}
                isFilterDisabled
                containerClass={classNames(
                  !filterShow ? 'fill-search-bar' : '',
                )}
                onEdit={optimizedHandleSearch}
                onClose={handleCloseSearch}
              />
            </div>
          </div>
        )}
        {mode === 'drafted_by' ? (
          <>
            <div
              className={classNames('team-display', 'player-coin-drafts')}
              style={{ width: '100%' }}
            >
              <div
                className={classNames(
                  'team-container h-none drafted-players-list-container',
                  isGetDraftedByError ||
                    draftedByData.length < 2 ||
                    isLoadingDraftedBy ||
                    isMobile()
                    ? ''
                    : 'hot-card-container',
                )}
                style={{
                  gridTemplateColumns:
                    isGetDraftedByError ||
                    draftedByData.length < 2 ||
                    isLoadingDraftedBy ||
                    isMobile()
                      ? 'auto'
                      : 'auto auto auto auto',
                  justifyContent: 'center',
                }}
              >
                {draftedByData?.length > 0 ? (
                  <div className="carousel mb-20 m-auto player-carousel">
                    <CircleCarousel
                      items={draftedByData?.map((item: any, index: number) => (
                        <NewPlayerDraftCard
                          card={item}
                          key={index + 2}
                          prevData={draftsRef?.current}
                          onBuy={() => handlePurchaseOpen('buy', item)}
                          onSell={() => handlePurchaseOpen('sell', item)}
                          playercardjson={item?.playercardjson}
                        />
                      ))}
                      activeIndex={draftedByActiveIndex}
                      setActiveIndex={setDraftedByActiveIndex}
                      isFixedWidth={true}
                    />
                  </div>
                ) : isLoadingDraftedBy ? (
                  <div className="nft-item no-data loading">
                    <>
                      {new Array(isMobile() ? 1 : 5)
                        .fill(1)
                        .map((item, draftedindex) => (
                          <div
                            style={{ margin: '0px 10px' }}
                            key={draftedindex}
                          >
                            <BaseCardSkeleton />
                          </div>
                        ))}
                    </>
                  </div>
                ) : (
                  <div className="nft-item no-data">
                    <div className={classNames('nft-price-section')}>
                      {isGetDraftedByError ||
                      !playerDraftedByData ||
                      playerDraftedByData?.drafted_by?.length === 0 ? (
                        <div className="alert-wrapper">
                          <div className="heading-title unverified-alert drafts-unverified">
                            {t('no data found')}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={classNames('team-display', 'player-coin-drafts')}>
              <div
                className={classNames(
                  'team-container h-none drafted-players-list-container',
                  isGetAllDraftsError ||
                    myDraftedData?.length < 2 ||
                    isLoadingAllDrafts ||
                    isMobile()
                    ? ''
                    : 'hot-card-container',
                )}
                style={{
                  gridTemplateColumns:
                    isGetAllDraftsError ||
                    myDraftedData?.length < 2 ||
                    isLoadingAllDrafts ||
                    isMobile()
                      ? 'auto'
                      : 'auto auto auto auto',
                  justifyContent: 'center',
                }}
              >
                {myDraftedData?.length > 0 ? (
                  <div className="carousel mb-20 m-auto player-carousel">
                    <CircleCarousel
                      items={myDraftedData?.map((item: any, index: number) => (
                        <NewPlayerDraftCard
                          card={item}
                          key={index + 2}
                          prevData={draftsRef?.current}
                          onBuy={() => handlePurchaseOpen('buy', item)}
                          onSell={() => handlePurchaseOpen('sell', item)}
                          playercardjson={item?.playercardjson}
                        />
                      ))}
                      activeIndex={draftActiveIndex}
                      setActiveIndex={setDraftActiveIndex}
                      isFixedWidth={true}
                    />
                  </div>
                ) : isLoadingAllDrafts ? (
                  <div className="nft-item no-data loading">
                    <>
                      {new Array(isMobile() ? 1 : 5)
                        .fill(1)
                        .map((item, index) => (
                          <div style={{ margin: '0px 10px' }} key={index}>
                            <BaseCardSkeleton />
                          </div>
                        ))}
                    </>
                  </div>
                ) : (
                  <div className="nft-item no-data">
                    <div className={classNames('nft-price-section')}>
                      {isGetAllDraftsError ||
                      !playerAllDraftsData ||
                      playerAllDraftsData?.all_draft?.length === 0 ? (
                        <div className="alert-wrapper">
                          <div className="heading-title unverified-alert drafts-unverified">
                            {t('no data found')}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Drafts
