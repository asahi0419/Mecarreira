/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { initTagManager, isMobile } from '@utils/helpers'
import '@assets/css/pages/NftList.css'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import classNames from 'classnames'
import { getAllKioskData } from '@root/apis/playerCoins/playerCoinsSlice'
import { useTranslation } from 'react-i18next'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import PlayerListTabGroup from '@pages/PlayerList/components/PlayerListTabGroup'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  getWalletDetails,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import $ from 'jquery'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'
import debounce from 'lodash.debounce'
import KioskSkeleton from '@components/Card/KioskSkeleton'
import KioskItem from '@components/Card/KioskItem'
interface FiltersData {
  limit?: string
  offset?: string
  search?: string
  type?: string
}

const Kiosk: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('new')
  const [searchedTerm, setSearchedTerm] = useState<string | undefined>('')
  const [isHotScrolled, setHotScrolled] = useState(false)

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    isLoadingKiosk,
    allKioskData,
    nextKioskListUrl,
    isGetAllKioskDataSuccess,
    totalKioskCount,
  } = playerCoinData
  const [scrollIndex, setScrollIndex] = useState(0)
  const [itemList, setItemList] = useState<any>([])
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    search: '',
    type: 'new',
  })

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const { isNoWallet, userName, selectedThemeRedux, walletDetailAddress } =
    authenticationData
  const [windowSize, setWindowSize] = useState(0)

  useEffect(() => {
    if (userName) {
      if (accessToken && !walletDetailAddress) {
        dispatch(getWalletDetails()) // COMMENTED FOR PROD
      }
    }
  }, [userName])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

  useEffect(() => {
    if (
      appliedFilters?.limit ||
      appliedFilters?.offset ||
      appliedFilters?.type ||
      appliedFilters?.search
    ) {
      dispatch(getAllKioskData(appliedFilters))
    }
  }, [appliedFilters])

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
    setItemList([])
    setIsDeadEnd(false)
    let request: any = {}
    setSearchedTerm(value)
    request = {
      limit: '10',
      offset: '0',
      search: value || '',
    }
    setAppliedFilters({ ...request })
  }

  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])

  const handleCloseSearch = () => {
    setSearchedTerm('')
    let newParams: any = { type: activeTab }
    if (searchedTerm) {
      newParams = { ...newParams, search: searchedTerm }
    }
    setAppliedFilters(newParams)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = t(
      'exclusive player coin items',
    )
    document
      .querySelector("meta[name='description']")!
      .setAttribute(
        'content',
        'Find your Items amonst all Items that are only available through Member Token',
      )
  }, [])

  const trackScrolling = () => {
    $(window).on('scroll', function () {
      setHotScrolled(true)
    })
  }

  useEffect(() => {
    if (activeTab === 'all') {
      document.addEventListener('scroll', trackScrolling)
    } else {
      setHotScrolled(false)
      document.removeEventListener('scroll', trackScrolling)
    }
  }, [activeTab])

  useEffect(() => {
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        if (!nextKioskListUrl) {
          setIsDeadEnd(true)
          setItemList(allKioskData)
        } else {
          const url_string = nextKioskListUrl
          const url = new URL(url_string)
          const obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
          if (appliedFilters.offset === obj.offset) {
            setIsDeadEnd(true)
            setItemList(allKioskData)
          } else {
            if (allKioskData.length === 0) {
              setIsDeadEnd(true)
            }
            setItemList([...itemList, ...allKioskData])
          }
        }
      } else {
        if (allKioskData.length > 0 && isGetAllKioskDataSuccess) {
          setItemList([...itemList, ...allKioskData])
        } else if (allKioskData.length === 0 && isGetAllKioskDataSuccess) {
          setIsDeadEnd(true)
        }
      }
    } else {
      setItemList(allKioskData)
    }
  }, [allKioskData])

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

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
      const paginationParams = getUrlParams(nextKioskListUrl, 'limit', 'offset')
      if (nextKioskListUrl && totalKioskCount) {
        setIsDeadEnd(false)
        setAppliedFilters({ ...appliedFilters, ...paginationParams })
      } else {
        setIsDeadEnd(true)
      }
    }
  }

  return (
    <AppLayout headerStatus="header-status" headerClass="home" hasShadow={true}>
      <section
        className="nft-list-container kiosk-items"
        style={{ paddingBottom: activeTab === 'new' ? '50px' : '30px' }}
      >
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
            tabSet={['new', 'digital items', 'physical items', 'all']}
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
        {isLoadingKiosk && (activeTab !== 'all' || itemList.length === 0) ? (
          <div
            className={classNames(
              'nft-line-ex',
              isMobile() ? 'nft-list-grid-mob mt-15' : 'nft-list-grid',
            )}
          >
            <div
              className={classNames(
                'nft-column',
                itemList.length === 1 ? 'no-gap' : '',
                itemList.length === 2 ? 'two-grid' : '',
                isMobile() ? '' : 'nft-loader',
              )}
            >
              {new Array(windowSize > 3200 ? 9 : windowSize > 2500 ? 8 : 6)
                .fill(1)
                .map((player: any, index: number) => {
                  return isMobile() ? (
                    <NftSkeletonMobile key={index} />
                  ) : (
                    <KioskSkeleton key={index} />
                  )
                })}
            </div>
          </div>
        ) : itemList.length > 0 ? (
          <>
            {searchedTerm !== '' || activeTab !== 'all' ? ( // hot tab or search mode
              <div
                className={classNames(
                  'nft-line-ex',
                  isMobile() ? 'nft-list-grid-mob mt-15' : 'nft-list-grid',
                )}
              >
                <div
                  className={classNames(
                    'nft-column',
                    itemList.length === 1 ? 'no-gap' : '',
                    itemList.length === 2 ? 'two-grid' : '',
                  )}
                >
                  {itemList.map((item: any, index: number) => (
                    <KioskItem
                      kioskItem={item}
                      fullFilled={false}
                      buyItem={true}
                      key={index}
                      className={isMobile() ? 'kiosk-item-mobile' : ''}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="row" style={{ background: 'none' }}>
                <div className="section-wrapper infinity-section pt-0">
                  <InfiniteScroll
                    dataLength={itemList.length}
                    next={() => handleJumpToPage('forth')}
                    hasMore={true}
                    scrollThreshold={0.5}
                    loader={
                      !isDeadEnd ? (
                        <>
                          {isHotScrolled ? (
                            <div
                              className={classNames(
                                'nft-line-ex',
                                isMobile()
                                  ? 'nft-list-grid-mob mt-15'
                                  : 'nft-list-grid',
                              )}
                            >
                              <div
                                className={classNames(
                                  'nft-column',
                                  itemList.length === 1 ? 'no-gap' : '',
                                  itemList.length === 2 ? 'two-grid' : '',
                                  isMobile() ? '' : 'nft-loader',
                                )}
                              >
                                {new Array(6)
                                  .fill(1)
                                  .map((_: any, index: number) => {
                                    return isMobile() ? (
                                      <NftSkeletonMobile key={index} />
                                    ) : (
                                      <KioskSkeleton key={index} />
                                    )
                                  })}
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : null
                    }
                    endMessage={
                      <p style={{ textAlign: 'center' }}>
                        <b>. . .</b>
                      </p>
                    }
                  >
                    <div
                      className={classNames(
                        'nft-line-ex',
                        isMobile()
                          ? 'nft-list-grid-mob  mt-15'
                          : 'nft-list-grid',
                      )}
                    >
                      <div
                        className={classNames(
                          'nft-column',
                          itemList.length === 1 ? 'no-gap' : '',
                          itemList.length === 2 ? 'two-grid' : '',
                        )}
                      >
                        {itemList.map((item: any, index: number) => (
                          <KioskItem
                            kioskItem={item}
                            fullFilled={false}
                            buyItem={true}
                            key={index}
                            className={isMobile() ? 'kiosk-item-mobile' : ''}
                          />
                        ))}
                      </div>
                    </div>
                  </InfiniteScroll>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="alert-wrapper">
            <div className="heading-title unverified-alert">
              {t('no_items_found')}
            </div>
          </div>
        )}
      </section>
    </AppLayout>
  )
}

export default Kiosk
