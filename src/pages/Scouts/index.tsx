/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppLayout } from '@components/index'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  initTagManager,
  isMobile,
  toKPIIntegerFormat,
  toKPINumberFormat,
  toUsd,
} from '@utils/helpers'
import '@assets/css/pages/NftList.css'
import classNames from 'classnames'
import {
  fetchListPlayersLatestTrades,
  getScoutsCount,
  getScoutsLeaderboard,
  getScoutsTop,
  getTourScoutsCount,
  getTourScoutsLeaderboard,
  getTourScoutsTop,
  updateScoutsLeaderboard,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { useTranslation } from 'react-i18next'
import PlayerListTabGroup from '@pages/PlayerList/components/PlayerListTabGroup'
import debounce from 'lodash.debounce'
import { getFeedPlayers } from '@root/apis/playerCoins/playerCoinsSlice'
import '@assets/css/pages/Scouts.css'
import UserCardSkeleton from '@components/Card/UserCardSkeleton'
import ScoutsCard from '@components/Card/ScoutsCard'
import LandingSearchInput from '@components/Form/LandingSearchInput'
import SearchInput from '@components/Form/SearchInput'
import { useNavigate } from 'react-router-dom'
import ScoutsCardSupporter from '@components/Card/ScoutsCardSupporter'
import InfiniteScroll from 'react-infinite-scroll-component'
import SearchIcon from '@mui/icons-material/Search'
import Spinner from '@components/Spinner'
import Typed from 'typed.js'
import classnames from 'classnames'
import { postRequestAuth } from '@root/apis/axiosClientAuth'
import {
  setTourCategories,
  setTourCategoryId,
} from '@root/apis/onboarding/authenticationSlice'

const getUrlParams = (
  url: string,
  param1: string,
  param2: string,
  param3: string,
) => {
  if (!url) {
    return url
  }
  const url_string = url
  const newUrl = new URL(url_string)
  const obj: any = new Object()
  obj[param1] = newUrl.searchParams.get(param1)
  obj[param2] = newUrl.searchParams.get(param2)
  obj[param3] = newUrl.searchParams.get(param3)
  return obj
}
interface FiltersData {
  limit?: any
  offset?: any
  search?: string
  type?: string
}
const Scouts: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchedTerm, setSearchedTerm] = useState<string | undefined>('')
  const [searchAll, setSearchAll] = useState(false)

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    scoutsCount,
    scoutsLeaderboard,
    loadingScoutsLeaderboard,
    scoutsTop,
    loadingScoutsTop,
    scoutsLeaderboardNextURL,
    updatingScoutsLeaderboard,
  } = playerCoinData
  const [scrollIndex, setScrollIndex] = useState(0)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const {
    currencyRate,
    ipLocaleCurrency,
    getUserSettingsData,
    tourStep,
    tourCategories,
  } = authenticationData
  const navigate = useNavigate()
  const currencySymbol =
    getUserSettingsData?.currency ?? ipLocaleCurrency ?? 'USD'
  const [itemList, setItemList] = useState<any>([])
  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    search: '',
    type: 'new',
  })
  const leaderboardFilters = {
    search: '',
    offset: 5,
    limit: 10,
  }
  const [isDeadEnd, setIsDeadEnd] = useState(false)

  const handleGetTab = (tab: string) => {
    setActiveTab(tab)
    setItemList([])
    let newParams: any = { type: tab }
    if (searchedTerm) {
      newParams = { ...newParams, search: searchedTerm }
    }
    setAppliedFilters(newParams)
  }

  const handleSearch = (value: string | undefined) => {
    if (value === '') {
      setSearchAll(false)
    } else {
      setSearchAll(true)
    }
    setItemList([])
    setIsDeadEnd(false)
    let request: any = {}
    setSearchedTerm(value)
    request = {
      limit: 10,
      offset: 0,
      search: value || '',
    }
    dispatch(getScoutsLeaderboard(request))
  }

  const handleJumpToPage = (head: string) => {
    if (head !== 'back') {
      const paginationParams = getUrlParams(
        scoutsLeaderboardNextURL,
        'limit',
        'offset',
        'search',
      )
      if (scoutsLeaderboardNextURL) {
        setIsDeadEnd(false)
        // setLeaderboardFilters({ ...leaderboardFilters, ...paginationParams })
        dispatch(updateScoutsLeaderboard(paginationParams))
      } else {
        setIsDeadEnd(true)
      }
    }
  }

  useEffect(() => {
    if (scoutsLeaderboardNextURL) {
      setIsDeadEnd(false)
    } else {
      setIsDeadEnd(true)
    }
  }, [scoutsLeaderboardNextURL])

  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])

  const handleCloseSearch = () => {
    setSearchAll(false)
    if (searchedTerm !== '') {
      setSearchedTerm('')
      let newParams: any = { type: activeTab }
      if (searchedTerm) {
        newParams = { ...newParams, search: searchedTerm }
      }
      setAppliedFilters(newParams)
      const request = {
        limit: 10,
        offset: 5,
        search: '',
      }
      dispatch(getScoutsLeaderboard(request))
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0)
    if (tourStep === 'scout') {
      dispatch(getTourScoutsCount())
      dispatch(getTourScoutsLeaderboard())
      dispatch(getTourScoutsTop())
      setHasTour(true)
    } else {
      dispatch(getScoutsCount())
      dispatch(getScoutsLeaderboard(leaderboardFilters))
      dispatch(getScoutsTop())
    }
  }, [])

  const leaderboardSearchHandle = (str: string) => {
    const request = {
      limit: 10,
      offset: 0,
      search: str || '',
    }
    dispatch(getScoutsLeaderboard(request))
  }

  const [isSearchEnabled, setSearchEnabled] = useState(false)

  const handleClose = () => {
    setSearchEnabled(false)
    handleCloseSearch()
  }

  const handleSearchInput = () => {
    setSearchEnabled(true)
  }

  const [step, setStep] = useState(1)
  const [hasTour, setHasTour] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const typedRef = useRef(null)

  if (step === 1) {
    const scout1 = document.querySelector(
      '.tab-bar-container',
    ) as HTMLDivElement | null
    scout1?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }
  useEffect(() => {
    if (hasTour) {
      document.body.style.overflow = 'hidden'
    }
  }, [hasTour])
  useEffect(() => {
    const scouts2 = document.querySelector(
      '.scouts-top5-container',
    ) as HTMLDivElement | null
    const scouts3 = document.querySelector(
      '.scouts-leaderboard-container',
    ) as HTMLDivElement | null
    const brightAreaDiv = document.querySelector(
      '.bright-area',
    ) as HTMLDivElement | null
    if (scouts2 && step === 2) {
      scouts2?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      return
    }
    if (scouts3 && step === 3) {
      scouts3?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      return
    }
    if (brightAreaDiv) {
      brightAreaDiv?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }
  }, [step])
  useEffect(() => {
    let typed = null
    if (hasTour) {
      setShowButton(false)

      let string = ''
      if (step === 1) {
        string = t('view_three_core_values')
      } else if (step === 2) {
        string = t('the_top_five_scouts')
      } else if (step === 3) {
        string = t('the_rest_of_the_traders')
      }
      const options = {
        strings: [string],
        typeSpeed: 25,
        backSpeed: 30,
        loop: false,
        showCursor: false,
        onStringTyped: () => {
          setShowButton(true)
        },
      }
      typed = new Typed(typedRef.current, options)
      // Cleanup: Destroy Typed instance on component unmount
    }
    return () => {
      if (typed) {
        typed.destroy()
      }
    }
  }, [step, hasTour])

  const handleNextStep = async () => {
    if (step === 3) {
      // FYI need to integrate api
      try {
        await postRequestAuth('accounts/wallet_app_tour_categories/', {
          categoryId: 3,
        })
      } catch (error) {
        console.log(error)
      }
      dispatch(setTourCategories({ ...tourCategories, 3: true }))
      dispatch(setTourCategoryId(0))
      navigate('/app')
    } else {
      setStep(step + 1)
    }
  }

  return (
    <AppLayout headerStatus="header-status" headerClass="home" hasShadow={true}>
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
        <div className="scouts-container">
          {!searchAll && (
            <>
              {hasTour && (
                <>
                  <div className="dark-overlay"></div>
                  <div className="bright-rectangle">
                    <div
                      className={classnames(
                        'wallet-description fade-in',
                        `scout-screen-step${step}`,
                      )}
                      ref={typedRef}
                    ></div>
                    {showButton && (
                      <div
                        className={classnames(
                          'fade-in',
                          `scout-screen-step${step}-btn`,
                          step === 3 ? 'complete-btn' : 'continue-btn',
                        )}
                        onClick={handleNextStep}
                      >
                        {t(step === 3 ? 'complete' : 'continue')}
                      </div>
                    )}
                  </div>
                </>
              )}
              <div
                className={classnames(
                  'scouts-count-wrapper',
                  hasTour && step === 1 ? 'bright-area' : '',
                )}
              >
                <div className="scouts-count-item">
                  <div className="scouts-count-title">{t('Scouts')}</div>
                  <div className="scouts-count-number">
                    {scoutsCount.scoutsCount}
                  </div>
                </div>
                <div className="scouts-count-item">
                  <div className="scouts-count-title">{t('24h XP')}</div>
                  <div className="scouts-count-number">
                    {toKPIIntegerFormat(scoutsCount.xpCollected)}
                  </div>
                </div>
                <div className="scouts-count-item">
                  <div className="scouts-count-title">{t('Total Trades')}</div>
                  <div className="scouts-count-number">
                    {scoutsCount.totalTrades}
                  </div>
                </div>
              </div>
              <div className={classnames('scouts-section-wrapper')}>
                <div className="scouts-top5-container">
                  <div className="scouts-top5-title">
                    {t('TOP 5 SCOUTS')}
                    <img src="/img/top5.png" alt="top5" />
                  </div>
                  <div
                    className={classnames(
                      'user-list-wrapper',
                      hasTour && step === 2
                        ? 'bright-area no-pointer-area'
                        : '',
                    )}
                  >
                    {scoutsTop?.length === 0 && loadingScoutsTop ? (
                      <div className="user-list-column">
                        {new Array(5)
                          .fill(1)
                          .slice(0, 5)
                          .map((_: any, index: number) => (
                            <UserCardSkeleton key={index} />
                          ))}
                      </div>
                    ) : window.innerWidth < 900 ? (
                      <div className="user-list-column">
                        {scoutsTop
                          .slice(0, 5)
                          .map((item: any, index: number) => (
                            <ScoutsCardSupporter
                              user={item}
                              index={index + 1}
                              key={index}
                            />
                          ))}
                      </div>
                    ) : (
                      <div className="user-list-column">
                        {scoutsTop.slice(0, 5).map((item: any, index: number) =>
                          index < 2 ? (
                            <ScoutsCard
                              user={item}
                              index={index + 1}
                              key={index}
                            />
                          ) : (
                            <div
                              className={
                                hasTour && step === 2 ? 'dark-area' : ''
                              }
                            >
                              <ScoutsCard
                                user={item}
                                index={index + 1}
                                key={index}
                              />
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          <div className={classnames('scouts-section-wrapper')}>
            <div className="scouts-leaderboard-container">
              {!searchAll &&
                (isMobile() ? (
                  isSearchEnabled ? (
                    <div className="scouts-section-title">
                      <SearchInput
                        type="text"
                        placeholder={t('please enter the search words.')}
                        className="in-menu-search"
                        onChange={leaderboardSearchHandle}
                        onClose={handleClose}
                      />
                    </div>
                  ) : (
                    <div className="scouts-section-title">
                      {t('LEADERBOARD')}
                      <SearchIcon
                        className="icon-color"
                        onClick={handleSearchInput}
                        style={{
                          margin: '22px 10px 22px 0',
                        }}
                      />
                    </div>
                  )
                ) : (
                  <div className="scouts-section-title">
                    {t('LEADERBOARD')}
                    <LandingSearchInput
                      type="text"
                      placeholder={t('Search Scouts')}
                      className="in-menu-search-header dash-search"
                      onChange={leaderboardSearchHandle}
                    />
                  </div>
                ))}
              <div
                className={classnames(
                  'scouts-leaderboard-wrapper',
                  hasTour && step === 3 ? 'bright-area no-pointer-area' : '',
                )}
              >
                <div
                  className={classNames(
                    'players-table-container',
                    searchAll ? 'search-mode-wrapper' : '',
                  )}
                >
                  {loadingScoutsLeaderboard ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                    </div>
                  ) : scoutsLeaderboard.length === 0 ? (
                    <div className="no-data-msg">{t('no data found')}</div>
                  ) : (
                    // <InfiniteScroll
                    //   style={{ overflow: 'hidden' }}
                    //   dataLength={scoutsLeaderboard.length}
                    //   next={() => handleJumpToPage('forth')}
                    //   hasMore={true}
                    //   scrollThreshold={0.5}
                    //   loader={<></>}
                    //   endMessage={
                    //     <p style={{ textAlign: 'center' }}>
                    //       <b>. . .</b>
                    //     </p>
                    //   }
                    // >
                    <>
                      {scoutsLeaderboard.map((item: any, index: number) => (
                        <div
                          key={index}
                          className={classnames(
                            'nft-item',
                            hasTour && index >= 4 ? 'dark-area' : '',
                          )}
                          onClick={() =>
                            navigate(`/app/user/${item?.username}`)
                          }
                        >
                          <div className="nft-image-section">
                            <div className="rank-field">
                              <div>{item.rnk}</div>
                            </div>
                            <div className="image-border">
                              <div
                                className={classNames(
                                  'nft-image',
                                  item?.avatar ?? 'group-0',
                                )}
                              />
                            </div>
                            <div className="nft-name user-name">
                              <div className="user-name-text">
                                {item?.username ?? t('none')}
                              </div>
                              <div className="user-feed-level-wrapper">
                                <div className="user-feed-level">
                                  {item?.lifetimelevel ?? 0}
                                </div>
                              </div>
                            </div>
                          </div>
                          {isMobile() ? (
                            <div className="leaderboard-ticker-field-group">
                              <div className="ticker-field">
                                <div>
                                  $
                                  {toKPINumberFormat(
                                    toUsd(
                                      item?.invested,
                                      item?.exchangeRateUSD?.rate,
                                    ),
                                  )}
                                </div>
                              </div>
                              {/* <div className="ticker-field">
                              <div>{item.lifetime_xp}</div>
                            </div> */}
                            </div>
                          ) : (
                            <>
                              <div className="user-level-box">
                                <div className="user-level-label green-color">
                                  {t('invested')}
                                </div>
                                <div className="user-level primary-text-color">
                                  $
                                  {toKPINumberFormat(
                                    toUsd(
                                      item?.invested,
                                      item?.exchangeRateUSD?.rate,
                                    ),
                                  )}
                                </div>
                              </div>
                              <div className="user-level-box">
                                <div className="user-level-label green-color">
                                  {t('season')}
                                </div>
                                <div className="user-level primary-text-color">
                                  {toKPIIntegerFormat(item.xp)}&nbsp;<i>XP</i>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {isDeadEnd ||
                      scoutsLeaderboard.length <
                        10 ? null : updatingScoutsLeaderboard ? (
                        <div className="showmore-btn-wrapper">
                          <Spinner spinnerStatus={true} />
                        </div>
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
                      {/* </InfiniteScroll> */}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default Scouts
