/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { AppLayout } from '@components/index'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { initTagManager, isMobile } from '@utils/helpers'
import '@assets/css/pages/NftList.css'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import classNames from 'classnames'
import NftCardMobile from '@components/Card/NftCardMobile'
import NftCard from '@components/Card/NftCard'
import {
  getAllNftsData,
  resetAllNfts,
} from '@root/apis/playerCoins/playerCoinsSlice'
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
import NftSkeleton from '@components/Card/NftSkeleton'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import debounce from 'lodash.debounce'
import TitleSkeleton from '@components/Card/TitleSkeleton'
interface FiltersData {
  limit?: string
  offset?: string
  search?: string
  hot_nft?: boolean
  status_id?: number
  type?: string
}
interface Props {
  type: string
  items: any
  itemIndex: number
  setItemIndex: any
}
const NftRow: React.FC<Props> = ({ type, items, itemIndex, setItemIndex }) => {
  const { t } = useTranslation()
  return (
    <div className="row">
      <div className="section-wrapper">
        <span className="blog-title">
          {t(
            type === 'auction'
              ? 'ongoing auctions'
              : type === 'raffle'
              ? 'ongoing lotteries'
              : type === 'upcoming'
              ? 'upcoming'
              : type === 'valuable'
              ? 'most valuable collectibles'
              : type === 'minted'
              ? 'recently minted'
              : '',
          )}
        </span>
        <div
          className={classNames(
            'nft-line-ex',
            isMobile() ? 'nft-list-grid-mob' : 'nft-list-grid',
          )}
        >
          <CircleCarousel
            items={items
              .map((item: any, index: number, items: any) => {
                return isMobile() ? (
                  (index === items.length - 1 && index % 2 === 0) ||
                  window.innerWidth < 360 ? (
                    <NftCardMobile nft={item} key={index} isNavigate={true} />
                  ) : index % 2 === 0 ? (
                    <div className="two-nft-cards">
                      <NftCardMobile nft={item} key={index} isNavigate={true} />
                      <NftCardMobile
                        nft={items[index + 1]}
                        key={index + items.length}
                        isNavigate={true}
                      />
                    </div>
                  ) : null
                ) : (
                  <NftCard nft={item} key={index} isNavigate={true} />
                )
              })
              .filter(item => item)}
            activeIndex={itemIndex}
            setActiveIndex={setItemIndex}
          />
        </div>
      </div>
    </div>
  )
}
const MemoizedNftRow = React.memo(NftRow)

const NftList: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchedTerm, setSearchedTerm] = useState<string | undefined>('')
  const [isHotScrolled, setHotScrolled] = useState(false)

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    isLoadingNfts,
    allNftsData,
    nextNftsListUrl,
    isGetAllNftsDataSuccess,
    totalNftsCount,
  } = playerCoinData
  const [scrollIndex, setScrollIndex] = useState(0)
  const [nftList, setNftList] = useState<any>([])
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [windowSize, setWindowSize] = useState(window.innerWidth)
  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    search: '',
    hot_nft: true,
    type: 'overview',
    limit: windowSize > 3200 ? '18' : windowSize > 2500 ? '16' : '10',
  })

  const [itemAuctionIndex, setItemAuctionIndex] = useState(0)
  const [itemRaffleIndex, setItemRaffleIndex] = useState(0)
  const [itemUpcomingIndex, setItemUpcomingIndex] = useState(0)
  const [itemValuableIndex, setItemValuableIndex] = useState(0)
  const [itemMintedIndex, setItemMintedIndex] = useState(0)

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const { isNoWallet, userName, selectedThemeRedux, walletDetailAddress } =
    authenticationData

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
      appliedFilters?.hot_nft ||
      appliedFilters?.status_id ||
      appliedFilters?.type ||
      appliedFilters?.search
    ) {
      dispatch(getAllNftsData(appliedFilters))
    }
  }, [appliedFilters])

  const handleGetTab = (tab: string) => {
    setActiveTab(tab)
    setNftList([])
    let newParams: any = null
    if (tab === 'overview' || tab === 'hot' || tab === 'new') {
      newParams = { type: tab }
    } else if (tab === 'all') {
      newParams = { status_id: -1 }
    }
    if (searchedTerm) {
      newParams = { ...newParams, search: searchedTerm }
    }
    setAppliedFilters(newParams)
  }

  const handleSearch = (value: string | undefined) => {
    setNftList([])
    setIsDeadEnd(false)
    let request: any = {}
    setSearchedTerm(value)
    request = {
      limit: windowSize > 3200 ? '18' : windowSize > 2500 ? '16' : '10',
      offset: '0',
      search: value || '',
    }
    setAppliedFilters({ ...request })
  }

  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])

  const handleCloseSearch = () => {
    setSearchedTerm('')
    let newParams: any = null
    if (
      activeTab === 'overview' ||
      activeTab === 'hot' ||
      activeTab === 'new'
    ) {
      newParams = { type: activeTab }
    } else if (activeTab === 'all') {
      newParams = { status_id: -1 }
    }
    if (searchedTerm) {
      newParams = { ...newParams, search: searchedTerm }
    }
    setAppliedFilters(newParams)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = t('exclusive player coin nfts')
    document
      .querySelector("meta[name='description']")!
      .setAttribute(
        'content',
        'Find your NFT amonst all NFTs that are only available through Member Token',
      )
    return () => {
      dispatch(resetAllNfts())
    }
  }, [])

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

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
    if (appliedFilters.offset) {
      if (appliedFilters.search) {
        if (!nextNftsListUrl) {
          setIsDeadEnd(true)
          setNftList(allNftsData)
        } else {
          const url_string = nextNftsListUrl
          const url = new URL(url_string)
          const obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
          if (appliedFilters.offset === obj.offset) {
            setIsDeadEnd(true)
            setNftList(allNftsData)
          } else {
            if (allNftsData.length === 0) {
              setIsDeadEnd(true)
            }
            setNftList([...nftList, ...allNftsData])
          }
        }
      } else {
        if (allNftsData.length > 0 && isGetAllNftsDataSuccess) {
          setNftList([...nftList, ...allNftsData])
        } else if (allNftsData.length === 0 && isGetAllNftsDataSuccess) {
          setIsDeadEnd(true)
        }
      }
    } else {
      setNftList(allNftsData)
    }
  }, [allNftsData])

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
      const paginationParams = getUrlParams(nextNftsListUrl, 'limit', 'offset')
      if (nextNftsListUrl && totalNftsCount) {
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
        className="nft-list-container"
        style={{ paddingBottom: activeTab === 'overview' ? '0' : '30px' }}
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
        {isLoadingNfts && (activeTab !== 'all' || nftList.length === 0) ? (
          <div
            className={classNames(
              'nft-line-ex',
              isMobile() ? 'nft-list-grid-mob mt-15' : 'nft-list-grid',
            )}
          >
            {activeTab !== 'hot' && activeTab !== 'new' && (
              <div
                className="nft-item no-data"
                style={
                  isMobile()
                    ? {
                        display: 'flex',
                        justifyContent: 'flex-start !important',
                        marginBottom: '20px',
                        height: 'auto',
                        padding: '10px',
                        marginLeft: '-50px',
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
            <div
              className={classNames(
                'nft-column mb-40',
                nftList.length === 1 ? 'no-gap' : '',
                nftList.length === 2 ? 'two-grid' : '',
                isMobile() ? '' : 'nft-loader',
              )}
            >
              {new Array(windowSize > 3200 ? 9 : windowSize > 2500 ? 8 : 6)
                .fill(1)
                .map((player: any, index: number) => {
                  return isMobile() ? (
                    <NftSkeletonMobile key={index} />
                  ) : (
                    <NftSkeleton key={index} />
                  )
                })}
            </div>
          </div>
        ) : nftList.length > 0 ? (
          <>
            {searchedTerm !== '' || activeTab === 'hot' ? ( // hot tab or search mode
              <div
                className={classNames(
                  'nft-line-ex',
                  isMobile() ? 'nft-list-grid-mob mt-15' : 'nft-list-grid',
                )}
              >
                <div
                  className={classNames(
                    'nft-column',
                    nftList.length === 1 ? 'no-gap' : '',
                    nftList.length === 2 ? 'two-grid' : '',
                  )}
                >
                  {nftList.map((item: any, index: number) => {
                    return isMobile() ? (
                      <NftCardMobile nft={item} key={index} isNavigate={true} />
                    ) : (
                      <NftCard nft={item} key={index} isNavigate={true} />
                    )
                  })}
                </div>
              </div>
            ) : activeTab === 'new' ? (
              <>
                {nftList.filter(item => item.type === 'new').length > 0 ? (
                  <div
                    className={classNames(
                      'nft-line-ex',
                      isMobile() ? 'nft-list-grid-mob mt-15' : 'nft-list-grid',
                    )}
                  >
                    <div
                      className={classNames(
                        'nft-column',
                        nftList.length === 1 ? 'no-gap' : '',
                        nftList.length === 2 ? 'two-grid' : '',
                      )}
                    >
                      {nftList
                        .filter(item => item.type === 'new')
                        .map((item: any, index: number) => {
                          return isMobile() ? (
                            <NftCardMobile
                              nft={item}
                              key={index}
                              isNavigate={true}
                            />
                          ) : (
                            <NftCard nft={item} key={index} isNavigate={true} />
                          )
                        })}
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </>
            ) : activeTab === 'overview' ? (
              <>
                {nftList.filter(item => item.type === 'auction').length > 0 ? (
                  <MemoizedNftRow
                    type="auction"
                    items={nftList.filter(item => item.type === 'auction')}
                    itemIndex={itemAuctionIndex}
                    setItemIndex={setItemAuctionIndex}
                  />
                ) : null}
                {nftList.filter(item => item.type === 'raffle').length > 0 ? (
                  <MemoizedNftRow
                    type="raffle"
                    items={nftList.filter(item => item.type === 'raffle')}
                    itemIndex={itemRaffleIndex}
                    setItemIndex={setItemRaffleIndex}
                  />
                ) : null}
                {nftList.filter(item => item.type === 'new').length > 0 ? (
                  <MemoizedNftRow
                    type="upcoming"
                    items={nftList.filter(item => item.type === 'new')}
                    itemIndex={itemUpcomingIndex}
                    setItemIndex={setItemUpcomingIndex}
                  />
                ) : null}
                {nftList.filter(item => item.type === 'valuable').length > 0 ? (
                  <MemoizedNftRow
                    type="valuable"
                    items={nftList.filter(item => item.type === 'valuable')}
                    itemIndex={itemValuableIndex}
                    setItemIndex={setItemValuableIndex}
                  />
                ) : null}
                {nftList.filter(item => item.type === 'minted').length > 0 ? (
                  <MemoizedNftRow
                    type="minted"
                    items={nftList.filter(item => item.type === 'minted')}
                    itemIndex={itemMintedIndex}
                    setItemIndex={setItemMintedIndex}
                  />
                ) : null}
              </>
            ) : (
              <div className="row" style={{ background: 'none' }}>
                <div className="section-wrapper infinity-section">
                  <span className="blog-title">{t('all collectibles')}</span>
                  <InfiniteScroll
                    dataLength={nftList.length}
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
                                  nftList.length === 1 ? 'no-gap' : '',
                                  nftList.length === 2 ? 'two-grid' : '',
                                  isMobile() ? '' : 'nft-loader',
                                )}
                              >
                                {new Array(
                                  isMobile()
                                    ? 2
                                    : windowSize > 3200
                                    ? 9
                                    : windowSize > 2500
                                    ? 8
                                    : 6,
                                )
                                  .fill(1)
                                  .map((player: any, index: number) => {
                                    return isMobile() ? (
                                      <NftSkeletonMobile key={index} />
                                    ) : (
                                      <NftSkeleton key={index} />
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
                        isMobile() ? 'nft-list-grid-mob' : 'nft-list-grid',
                      )}
                    >
                      <div
                        className={classNames(
                          'nft-column',
                          nftList.length === 1 ? 'no-gap' : '',
                          nftList.length === 2 ? 'two-grid' : '',
                        )}
                      >
                        {nftList.map((item: any, index: number) => {
                          return isMobile() ? (
                            <NftCardMobile
                              nft={item}
                              key={index}
                              isNavigate={true}
                            />
                          ) : (
                            <NftCard nft={item} key={index} isNavigate={true} />
                          )
                        })}
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
              {t('no NFTs found')}
            </div>
          </div>
        )}
      </section>
    </AppLayout>
  )
}

export default NftList
