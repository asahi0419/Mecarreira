/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { isMobile, toKPIIntegerFormat } from '@utils/helpers'
import '@assets/css/pages/NftList.css'
import classNames from 'classnames'
import {
  getAllKioskItems,
  getAllKioskItemsReset,
  getKioskKpi,
  getNewKioskItems,
  getRecentAquisitionItems,
  getScoutsCount,
  getScoutsLeaderboard,
  getScoutsTop,
  getTopKioskItems,
  updateScoutsLeaderboard,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { useTranslation } from 'react-i18next'
import PlayerListTabGroup from '@pages/PlayerList/components/PlayerListTabGroup'
import debounce from 'lodash.debounce'
import '@assets/css/pages/Scouts.css'
import { useLocation, useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import KioskItem from '@components/Card/KioskItem'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'
import NftSkeleton from '@components/Card/NftSkeleton'
import DialogBox from '@components/Dialog/DialogBox'
import { useParams } from 'react-router-dom'
import {
  getKioskCategories,
  getKioskCategoriesDetail,
  getKioskCategoriesDetailSuccess,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import CarouselShowCase from '@components/CarouselShowcase'
import NftCardMobile from '@components/Card/NftCardMobile'
import NftCard from '@components/Card/NftCard'

import arrows from '@assets/images/kiosk/arrows.png'
import dollarLabel from '@assets/images/kiosk/dollarlabel.png'
import shootingStar from '@assets/images/kiosk/shootingstar.png'
import { MenuItem } from '@mui/material'
import { Select } from '@material-ui/core'
import Spinner from '@components/Spinner'

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

interface filtersAllItems {
  limit?: any
  offset?: any
  id?: any
}

const KioskCategoriesDetail: React.FC = props => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchedTerm, setSearchedTerm] = useState<string | undefined>('')
  const [searchAll, setSearchAll] = useState(false)
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [windowSize, setWindowSize] = useState(0)

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    scoutsCount,
    scoutsLeaderboardNextURL,
    nextNftsListUrl,
    graiSuccess,
    graiIsLoading,
    graiFailure,
    gnkiSuccess,
    gnkiIsLoading,
    gnkiFailure,
    getTopItemsSuccess,
    getTopItemsLoading,
    getTopItemsFailure,
    getKioskKpiSuccess,
    getKioskKpiLoading,
    geIstKioskKpiFailure,
    getAllKioskItemsSuccess,
    getAllKioskItemsLoading,
    getAllKioskItemsNextUrl,
    isGetAllKioskItems,
    getAllKioskItemsFailure,
  } = playerCoinData

  const [scrollIndex, setScrollIndex] = useState(0)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  //   const {
  //     isNoWallet,
  //     kioskCategoriesDetailSuccess,
  //     kioskCategoriesDetailLoader,
  //   } = authenticationData
  const {
    currencyRate,
    ipLocaleCurrency,
    getUserSettingsData,
    isNoWallet,
    kioskCategoriesDetailSuccess,
    kioskCategoriesDetailLoader,
    kioskCategoriesData,
  } = authenticationData
  const navigate = useNavigate()
  const currencySymbol =
    getUserSettingsData?.currency ?? ipLocaleCurrency ?? 'USD'
  const [itemList, setItemList] = useState<any>([])
  const [allKioskItems, setAllKioskItems] = useState<any>([])
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    search: '',
    type: 'new',
  })
  const [appliedFiltersAllItems, setAppliedFiltersAllItems] =
    useState<filtersAllItems>(null)
  const leaderboardFilters = {
    search: '',
    offset: 5,
    limit: 10,
  }

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

  const handleJumpToPage2 = () => {
    console.log('')
  }

  useEffect(() => {
    if (getAllKioskItemsNextUrl) {
      setIsDeadEnd(false)
    } else if (
      getAllKioskItemsNextUrl &&
      getAllKioskItemsSuccess.length === 0
    ) {
      setIsDeadEnd(true)
    } else {
      setIsDeadEnd(true)
    }
  }, [getAllKioskItemsNextUrl, getAllKioskItemsSuccess])

  useEffect(() => {
    if (getAllKioskItemsSuccess.length === 0) {
      setIsDeadEnd(true)
    } else {
      try {
        let updatedAllKioskItems: any = []
        // if (appliedFiltersAllItems?.limit || appliedFiltersAllItems?.offset) {
        //   if (getAllKioskItemsSuccess.length > 0 && isGetAllKioskItems) {
        //     updatedAllKioskItems = [
        //       ...allKioskItems,
        //       ...getAllKioskItemsSuccess,
        //     ]
        //     console.log({ updatedAllKioskItems })
        //     setAllKioskItems(updatedAllKioskItems)
        //   } else if (
        //     getAllKioskItemsSuccess.length === 0 &&
        //     isGetAllKioskItems
        //   ) {
        //     updatedAllKioskItems = getAllKioskItemsSuccess
        //     console.log({ updatedAllKioskItems })
        //     setAllKioskItems(updatedAllKioskItems)
        //     setIsDeadEnd(true)
        //   }
        // }
        updatedAllKioskItems = [...allKioskItems, ...getAllKioskItemsSuccess]
        console.log({ updatedAllKioskItems })
        setAllKioskItems(updatedAllKioskItems)
      } catch (err) {
        console.log('perr', err)
      }
    }
  }, [getAllKioskItemsSuccess])

  const handleJumpToPage = (head: string) => {
    console.log('jtpcalled')
    if (head !== 'back') {
      try {
        const paginationParams = getUrlParams(
          getAllKioskItemsNextUrl,
          'limit',
          'offset',
        )
        const req = {
          offset: paginationParams.offset,
        }
        if (getAllKioskItemsNextUrl) {
          setIsDeadEnd(false)
          dispatch(getAllKioskItems(req))
        } else {
          setIsDeadEnd(true)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  // useEffect(() => {
  //   if (scoutsLeaderboardNextURL) {
  //     setIsDeadEnd(false)
  //   } else {
  //     setIsDeadEnd(true)
  //   }
  // }, [scoutsLeaderboardNextURL])

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

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

  const [isSearchEnabled, setSearchEnabled] = useState(false)

  const handleClose = () => {
    setSearchEnabled(false)
    handleCloseSearch()
  }

  const handleSearchInput = () => {
    setSearchEnabled(true)
  }

  const { id } = useParams()
  const [showCreateItemForm, setShowCreateItemForm] = useState(false)

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

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

  useEffect(() => {
    dispatch(getKioskCategories())
    dispatch(getKioskCategoriesDetail(id))
    // dispatch(getRecentAquisitionItems(''))
    dispatch(getNewKioskItems(''))
    dispatch(getTopKioskItems(''))
    dispatch(getKioskKpi(''))
    dispatch(getAllKioskItems(''))
    window.scrollTo(0, 0)

    return () => {
      dispatch(getAllKioskItemsReset())
    }
  }, [])

  useEffect(() => {
    if (kioskCategoriesData.length > 0) {
      console.log('ppo', location)
      const temp = location?.pathname?.split('/')
      const catId = Number(temp[temp.length - 1])
      const menuIndex = kioskCategoriesData.findIndex(item => item.id === catId)
      // setCategoryIndex(menuIndex)
    }
  }, [kioskCategoriesData])

  console.log({ categoryIndex })

  const handleChangeCategory = (event: any) => {
    console.log('val', event)
    const catIndex = Number(event?.target?.value)
    setCategoryIndex(catIndex)
    if (catIndex === 0) {
      setAllKioskItems([])
      dispatch(getAllKioskItems(''))
    } else {
      const req = {
        limit: 10,
        offset: 0,
        kioskItemCategoryId: kioskCategoriesData[catIndex - 1]?.id,
      }
      setAllKioskItems([])
      dispatch(getAllKioskItems(req))
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
            hasSearchBar={false}
            onEdit={optimizedHandleSearch}
            onClose={handleCloseSearch}
          />
        </div>
        <div id="kiosk-categories" className="scouts-container">
          {!searchAll && (
            <>
              <div className="scouts-count-wrapper">
                <div className="kiosk-count-item">
                  <div className="scouts-count-title">
                    {t('total sold items')}
                  </div>
                  <div className="scouts-count-number">
                    {getKioskKpiSuccess?.total_items_sold}
                  </div>
                </div>
                <div className="kiosk-count-item">
                  <div className="scouts-count-title">{t('player kiosks')}</div>
                  <div className="scouts-count-number">
                    {toKPIIntegerFormat(
                      getKioskKpiSuccess?.unique_players_ids_count,
                    )}
                  </div>
                </div>
                <div className="kiosk-count-item">
                  <div className="scouts-count-title">{t('total items')}</div>
                  <div className="scouts-count-number">
                    {getKioskKpiSuccess?.total_items}
                  </div>
                </div>
              </div>
              <div className="scouts-section-wrapper">
                <CarouselShowCase
                  title="new items"
                  data={gnkiSuccess}
                  isLoading={gnkiIsLoading}
                  isDeadEnd={isDeadEnd}
                  onNext={handleJumpToPage2}
                  windowSize={windowSize}
                  iconName="shootingstar"
                />
                {/* <CarouselShowCase
                  title="items"
                  data={kioskCategoriesDetailSuccess}
                  isLoading={kioskCategoriesDetailLoader}
                  isDeadEnd={isDeadEnd}
                  onNext={handleJumpToPage2}
                  windowSize={windowSize}
                  iconName="shootingstar"
                /> */}

                {/* <CarouselShowCase
                  title="Recent Acquisitions"
                  data={graiSuccess}
                  isLoading={graiIsLoading}
                  isDeadEnd={isDeadEnd}
                  onNext={handleJumpToPage2}
                  windowSize={windowSize}
                  iconName="arrows"
                /> */}

                <CarouselShowCase
                  title="Top 5 Items"
                  data={getTopItemsSuccess}
                  isLoading={getTopItemsLoading}
                  isDeadEnd={isDeadEnd}
                  onNext={handleJumpToPage2}
                  windowSize={windowSize}
                  iconName="dollarlabel"
                />
                <div className="kiosk-container player-kiosk p-0">
                  <div className="kiosk-wrapper">
                    <div className="d-flex-between">
                      <span className="kiosk-title-wrapper blog-title text-primary-color kiosk-filter-header">
                        {t('all_items')}
                        <div
                          className="textinput-wrapper currency-send"
                          style={isMobile() ? { width: '100%' } : {}}
                        >
                          <Select
                            value={categoryIndex.toString()}
                            onChange={handleChangeCategory}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            sx={{
                              color: 'var(--primary-foreground-color)',
                              width: '100%',
                              borderRadius: '4px',
                              border: '1px solid',
                              backgroundColor: 'var(--third-background-color)',
                            }}
                            style={{
                              color: 'var(--primary-foreground-color)',
                              width: '100%',
                              borderRadius: '4px',
                              border: '1px solid',
                              backgroundColor: 'var(--third-background-color)',
                            }}
                            id="currency-wallet-send"
                          >
                            <MenuItem value={0}>{t('All')}</MenuItem>
                            {kioskCategoriesData.map((el, ind) => {
                              return (
                                <MenuItem key={ind} value={ind + 1}>
                                  {el?.itemName}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </div>
                      </span>
                    </div>
                    <div
                      className={classNames(
                        'kiosk-content',
                        isMobile() ? 'nft-list-grid-mob' : '',
                      )}
                    >
                      {allKioskItems?.length > 0 ? (
                        <InfiniteScroll
                          className="circle-carousel"
                          dataLength={allKioskItems?.length}
                          next={() => console.log('forth')}
                          hasMore={true}
                          scrollThreshold={0.5}
                          // loader={
                          //   !isDeadEnd &&
                          //   getAllKioskItemsLoading &&
                          //   !isMobile() ? (
                          //     <div className="nft-item no-data">
                          //       {new Array(
                          //         windowSize >= 1600
                          //           ? 5
                          //           : windowSize >= 1220
                          //           ? 4
                          //           : windowSize >= 912
                          //           ? 3
                          //           : windowSize >= 320
                          //           ? 2
                          //           : 1,
                          //       )
                          //         .fill(1)
                          //         .map((_: any, index: number) => {
                          //           return isMobile() ? (
                          //             <NftSkeletonMobile key={index} />
                          //           ) : (
                          //             <NftSkeleton key={index} />
                          //           )
                          //         })}
                          //     </div>
                          //   ) : null
                          // }
                          endMessage={
                            <p style={{ textAlign: 'center' }}>
                              <b>. . .</b>
                            </p>
                          }
                        >
                          <div className="player-list-wrapper itemLists">
                            {allKioskItems?.map((item: any, index: number) => {
                              return isMobile() ? (
                                <KioskItem
                                  kioskItem={item}
                                  fullFilled={false}
                                  buyItem={true}
                                  key={index}
                                  className={
                                    isMobile() ? 'kiosk-item-mobile' : ''
                                  }
                                />
                              ) : (
                                <KioskItem
                                  kioskItem={item}
                                  fullFilled={false}
                                  buyItem={true}
                                  key={index}
                                  className={
                                    isMobile() ? 'kiosk-item-mobile' : ''
                                  }
                                />
                              )
                            })}
                          </div>
                          {!isDeadEnd ? (
                            <div className="showmore-btn-wrapper">
                              <div
                                className="showmore-btn"
                                onClick={() => handleJumpToPage('forth')}
                              >
                                {t('show more')}
                              </div>
                            </div>
                          ) : null}
                          {/* {isDeadEnd ? null : getAllKioskItemsLoading ? (
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
                          )} */}
                        </InfiniteScroll>
                      ) : getAllKioskItemsLoading ? (
                        <div className="kiosk-item-no-data">
                          {new Array(
                            windowSize >= 1600
                              ? 5
                              : windowSize >= 1220
                              ? 4
                              : windowSize >= 912
                              ? 3
                              : windowSize >= 320
                              ? 2
                              : 1,
                          )
                            .fill(1)
                            .map((_: any, index: number) => {
                              return isMobile() ? (
                                <NftSkeletonMobile key={index} />
                              ) : (
                                <NftSkeleton
                                  customClass="kiosk-all-items-skeleton"
                                  key={index}
                                />
                              )
                            })}
                        </div>
                      ) : (
                        <div className="alert-wrapper no-kiosk-data">
                          <div className="heading-title unverified-alert">
                            {t('no_items_found')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </AppLayout>
  )
}

export default KioskCategoriesDetail
