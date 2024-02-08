import React, { useEffect, useState, useCallback } from 'react'
import NftCard from '../../../components/Card/NftCard'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import SearchBar from '@components/SearchBar'
import { getNftsData } from '@root/apis/playerCoins/playerCoinsSlice'
import Select from '@components/Form/Select'
import InfiniteScroll from 'react-infinite-scroll-component'
import { isMobile } from '@utils/helpers'
import NftCardMobile from '@components/Card/NftCardMobile'
import NftSkeleton from '@components/Card/NftSkeleton'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'
import debounce from 'lodash.debounce'
interface Props {
  playerData: any
}

interface FiltersData {
  limit?: string
  offset?: string
  search?: string
  status_id?: number
  player_contract?: string
}

const Nfts: React.FC<Props> = ({ playerData }) => {
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    isLoadingNfts,
    getPlayerDetailsSuccessData,
    nftsData,
    nextNftsListUrl,
    isGetNftsDataSuccess,
  } = playerCoinData

  const [nftList, setNftList] = useState<any>([])
  const [unverifiedPlayer, setUnverifiedPlayer] = useState<boolean>(false)
  const [hideNftType, setHideNftType] = useState<boolean>(false)
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true)
  const [nftType, setNftType] = useState<number>(-1)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [searchedTerm, setSearchedTerm] = useState<string | undefined>('')
  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    status_id: -1,
    player_contract: playerData?.playercontract,
  })
  const [windowSize, setWindowSize] = useState(0)

  // useEffect(() => {
  //   if (
  //     getPlayerDetailsSuccessData?.playerstatusid?.id === 5 ||
  //     getPlayerDetailsSuccessData?.playerlevelid === 5
  //   ) {
  //     setUnverifiedPlayer(false)
  //   } else if (getPlayerDetailsSuccessData) {
  //     setUnverifiedPlayer(true)
  //   }
  //   setAppliedFilters({
  //     ...appliedFilters,
  //     player_contract: playerData?.playercontract,
  //   })
  // }, [getPlayerDetailsSuccessData])

  useEffect(() => {
    if (!unverifiedPlayer && getPlayerDetailsSuccessData) {
      if (
        appliedFilters?.limit ||
        appliedFilters?.offset ||
        appliedFilters?.status_id ||
        appliedFilters?.search
      ) {
        dispatch(getNftsData(appliedFilters))
      }
    }
  }, [appliedFilters])

  useEffect(() => {
    if (!isFirstLoad) {
      setNftList([])
      let newParams: any = {
        status_id: nftType,
        player_contract: playerData?.playercontract,
      }
      if (searchedTerm) {
        newParams = { ...newParams, search: searchedTerm }
      }
      setAppliedFilters(newParams)
    } else {
      setIsFirstLoad(false)
    }
  }, [nftType])

  useEffect(() => {
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        const url_string = nextNftsListUrl
        const url = new URL(url_string)
        const obj = {
          limit: url.searchParams.get('limit'),
          offset: url.searchParams.get('offset'),
        }
        if (appliedFilters.offset === obj.offset) {
          setIsDeadEnd(true)
          setNftList(nftsData)
        } else {
          setNftList([...nftList, ...nftsData])
        }
      } else {
        if (nftsData.length > 0 && isGetNftsDataSuccess) {
          setNftList([...nftList, ...nftsData])
        } else if (nftsData.length === 0 && isGetNftsDataSuccess) {
          setIsDeadEnd(true)
        }
      }
    } else {
      setNftList(nftsData)
    }
  }, [nftsData])

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

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
      if (
        nextNftsListUrl &&
        paginationParams.offset !== appliedFilters.offset
      ) {
        setIsDeadEnd(false)
        setAppliedFilters({ ...appliedFilters, ...paginationParams })
      } else {
        setIsDeadEnd(true)
      }
    }
  }

  const handleSearch = (value: string | undefined) => {
    setNftList([])
    setIsDeadEnd(false)
    let request: any = {}
    request = {
      limit: '10',
      offset: '0',
      search: value || '',
    }
    setAppliedFilters({ ...appliedFilters, ...request })
  }
  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])
  const handleReset = () => {
    setNftList([])
    setSearchedTerm('')
    const request: any = {
      status_id: -1,
      player_contract: playerData?.playercontract,
    }
    setAppliedFilters(request)
    setIsDeadEnd(false)
  }

  const nftTypeList = [
    {
      id: -1,
      name: t('all'),
    },
    {
      id: 2,
      name: t('upcoming'),
    },
    {
      id: 3,
      name: t('auctions'),
    },
    {
      id: 4,
      name: t('lucky draws'),
    },
    {
      id: 5,
      name: t('minted'),
    },
  ]

  return (
    <div className="player-nfts-container">
      {unverifiedPlayer ? (
        <div className="flex-middle">
          <div className="fixed-content">
            <div className="alert-wrapper">
              <div className="heading-title unverified-alert">
                {t('no_nft_launched_yet')}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="player-nfts-wrapper">
          <div className="search-bar-container">
            {!hideNftType && (
              <div className="nft-type-select">
                <Select
                  data={nftTypeList}
                  title={t('')}
                  defaultValue="-1"
                  onChange={(evt: any) => setNftType(evt.target.value)}
                />
              </div>
            )}
            <SearchBar
              onEdit={optimizedHandleSearch}
              onClose={handleReset}
              containerClass={hideNftType ? '' : 'w-90'}
              mode={''}
              isFilterDisabled={true}
              onSearchEnabled={setHideNftType}
            />
          </div>
          {nftList.length > 0 ? (
            <InfiniteScroll
              className="player-list-pagination"
              dataLength={nftList.length}
              scrollThreshold={0.5}
              next={() => handleJumpToPage('forth')}
              hasMore={true}
              loader={''}
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
                      <NftCardMobile nft={item} key={index} isNavigate={true} />
                    ) : (
                      <NftCard nft={item} key={index} isNavigate={true} />
                    )
                  })}
                </div>
              </div>
            </InfiniteScroll>
          ) : isLoadingNfts ? (
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
                {new Array(
                  windowSize > 3200
                    ? 9
                    : windowSize > 2500
                    ? 8
                    : windowSize > 2000
                    ? 6
                    : 4,
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
          ) : (
            <div className="alert-wrapper">
              <div className="heading-title unverified-alert">
                {t('no NFTs found')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Nfts
