import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import '@assets/css/pages/PlayerList.css'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { getCoinList } from '@root/apis/playerCoins/playerCoinsSlice'
import { fetchPlayersStatsHT } from '@root/apis/playerStats/playerStatsSlice'
import classNames from 'classnames'
import UserCardSupporter from '@components/Card/UserCardSupporter'
interface FiltersData {
  contract: string
  limit?: string
  offset?: string
  q?: string
  sorted_by?: string
  reverse?: string
}

let usdRateInterval: any = null
const CoinsList: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allCoins, setAllCoins] = useState<any>([])
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsDataHT } = playerStatsData

  const {
    isFetchListPlayerError,
    isLoadingCoins,
    isGetCoinsError,
    nextCoinListUrl,
    isGetCoinsSuccess,
    getCoinsData,
    cardPlayerDetailsSuccessData,
  } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux, isVisibleModal } = authenticationData
  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    contract: cardPlayerDetailsSuccessData?.playercontract,
    sorted_by: 'balance',
    reverse: 'True',
  })
  console.log({ getCoinsData })

  useEffect(() => {
    let updatedAllCoins: any = []
    if (appliedFilters.limit || appliedFilters.offset) {
      if (getCoinsData.length > 0 && isGetCoinsSuccess) {
        updatedAllCoins = [...allCoins, ...getCoinsData]
        setAllCoins(updatedAllCoins)
      } else if (getCoinsData.length === 0 && isGetCoinsSuccess) {
        setIsDeadEnd(true)
      }
    } else {
      updatedAllCoins = getCoinsData
      setAllCoins(updatedAllCoins)
    }

    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [getCoinsData])

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(
      fetchPlayersStatsHT({
        contracts: cardPlayerDetailsSuccessData?.playercontract,
        query: 'simple',
      }),
    )
    usdRateInterval = setInterval(() => {
      dispatch(
        fetchPlayersStatsHT({
          contracts: cardPlayerDetailsSuccessData?.playercontract,
          query: 'simple',
        }),
      )
    }, 20000)

    return () => {
      clearInterval(usdRateInterval)
    }
  }, [])

  useEffect(() => {
    clearInterval(usdRateInterval)
    if (!isVisibleModal && !document.hidden) {
      usdRateInterval = setInterval(() => {
        dispatch(
          fetchPlayersStatsHT({
            contracts: cardPlayerDetailsSuccessData?.playercontract,
            query: 'simple',
          }),
        )
      }, 20000)
    }
  }, [isVisibleModal, document.hidden])

  useEffect(() => {
    setLoading(true)
    if (
      appliedFilters?.limit ||
      appliedFilters?.offset ||
      appliedFilters?.sorted_by ||
      appliedFilters?.q
    ) {
      dispatch(getCoinList(appliedFilters))
    }
  }, [appliedFilters])

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
      const paginationParams = getUrlParams(nextCoinListUrl, 'limit', 'offset')
      if (
        nextCoinListUrl &&
        paginationParams.offset !== appliedFilters.offset
      ) {
        setIsDeadEnd(false)
        setAppliedFilters({ ...appliedFilters, ...paginationParams })
      } else {
        setIsDeadEnd(true)
      }
    }
  }

  return (
    <section className="player-list-container user-list-container">
      {allCoins.length > 0 ? (
        <InfiniteScroll
          dataLength={allCoins.length} //This is important field to render the next data
          next={() => handleJumpToPage('forth')}
          hasMore={true}
          scrollThreshold={0.5}
          loader={null}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>. . .</b>
            </p>
          }
        >
          <div className="user-list-wrapper">
            <div className="user-list-column">
              {allCoins.map((item: any, index: number) => (
                <UserCardSupporter
                  user={item}
                  index={index + 1}
                  key={index}
                  playerstats={fetchPlayerStatsDataHT[0]}
                />
              ))}
            </div>
          </div>
        </InfiniteScroll>
      ) : isLoadingCoins || isGetCoinsError ? (
        <div>
          <div className={classNames('all-players-loading')}>
            <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <div className="flex-middle">
          <div style={{ margin: 'auto', width: '360px' }}>
            <div className="alert-wrapper">
              <div className="heading-title unverified-alert text-center">
                {t('no data found')}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CoinsList
