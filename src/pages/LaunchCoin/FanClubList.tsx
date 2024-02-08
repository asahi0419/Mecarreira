import React, { useEffect, useState, useCallback, useRef } from 'react'
import AddIcon from '@mui/icons-material/Add'
import SearchBar from '@components/SearchBar'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { getFanClub } from '@root/apis/onboarding/authenticationSlice'
import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  getCircleColor,
  getCountryCode,
  getCountryNameNew,
  isMobile,
} from '@utils/helpers'
import { useNavigate } from 'react-router-dom'
import TooltipLabel from '@components/TooltipLabel'
import UserAvatar from '@assets/images/user_avatar.webp'

import debounce from 'lodash.debounce'
import ImageComponent from '@components/ImageComponent'
import {
  setShowNewDraftPopupRedux,
  getPlayerDetails,
  setPlayerIdRedux,
} from '@root/apis/playerCoins/playerCoinsSlice'
interface Props {
  onClose: any
}
interface DraftFiltersData {
  limit?: any
  offset?: any
  sorted_by?: string
  search?: string
  reverse?: string
  status_id?: number[]
}

const FanClubList: React.FC<Props> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [allPlayers, setAllPlayers] = useState<any>([])
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<DraftFiltersData>({
    limit: 10,
    offset: 0,
    search: '',
  })
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    selectedThemeRedux,
    isFetchPlayerSuccess,
    fanClubData,
    fanClubLoader,
    nextFanClubUrl,
    previousFanClubUrl,
    fanClubError,
  } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    searchField,
    showFanClubList,
    isLoading,
    getPlayerDetailsSuccessData,
    playerId,
  } = playerCoinData

  useEffect(() => {
    if (appliedFilters?.limit || appliedFilters?.offset) {
      dispatch(
        getFanClub({
          ...appliedFilters,
        }),
      )
    }
  }, [appliedFilters])

  useEffect(() => {
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        const url_string = nextFanClubUrl
        let obj: any = null
        if (url_string) {
          const url = new URL(url_string)
          obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
        } else {
          obj = {
            limit: appliedFilters.limit,
            offset: appliedFilters.offset,
          }
        }
        if (appliedFilters.offset === obj.offset) {
          setIsDeadEnd(true)
          setAllPlayers(fanClubData)
        } else {
          setAllPlayers([...allPlayers, ...fanClubData])
        }
      } else {
        if (fanClubData.length > 0 && isFetchPlayerSuccess) {
          setAllPlayers([...allPlayers, ...fanClubData])
        } else if (fanClubData.length === 0 && isFetchPlayerSuccess) {
          setIsDeadEnd(true)
        }
      }
    } else {
      setAllPlayers(fanClubData)
    }
  }, [fanClubData])

  const handleSearch = (value: string | undefined) => {
    setAllPlayers([])
    setIsDeadEnd(false)
    let request: any = {}
    request = {
      limit: '10',
      offset: '0',
      search: value || '',
    }
    if (!value) {
      delete request.q
    }
    setAppliedFilters({ ...appliedFilters, ...request })
  }
  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])
  const handleReset = () => {
    setAllPlayers([])
    const request: any = {
      limit: 10,
      offset: 0,
      search: '',
    }
    setAppliedFilters(request)
    setIsDeadEnd(false)
  }

  const getUrlParams = (url: string, param1: string, param2: string) => {
    const url_string = url
    if (url_string) {
      const newUrl = new URL(url_string)
      const obj: any = new Object()
      obj[param1] = newUrl.searchParams.get(param1)
      obj[param2] = newUrl.searchParams.get(param2)
      return obj
    }
    return {}
  }

  const handleJumpToPage = (head: string) => {
    if (head === 'back') {
      const paginationParams = getUrlParams(
        previousFanClubUrl,
        'limit',
        'offset',
      )
      setAppliedFilters({ ...appliedFilters, ...paginationParams })
    } else {
      const paginationParams = getUrlParams(nextFanClubUrl, 'limit', 'offset')
      if (nextFanClubUrl) {
        setAppliedFilters({ ...appliedFilters, ...paginationParams })
      }
    }
  }
  const handleClaimPlayer = (e, item) => {
    e.preventDefault()
    dispatch(setPlayerIdRedux({ playerId: item?.id }))
    dispatch(getPlayerDetails(item?.detailpageurl))
  }
  useEffect(() => {
    if (getPlayerDetailsSuccessData?.detailpageurl) {
      navigate(
        `/app/fan-player-dashboard/${getPlayerDetailsSuccessData?.detailpageurl}/${getPlayerDetailsSuccessData?.id}`,
      )
      if (showFanClubList) {
        dispatch(setShowNewDraftPopupRedux({ showFanClubList: false }))
        return
      }
    }
  }, [getPlayerDetailsSuccessData])
  return (
    <section className={classNames('new-draft')}>
      <div
        className={classNames('new-draft-title', isMobile() ? 'd-none' : '')}
      >
        {t('find_fan_club')}
      </div>
      <SearchBar
        isFilterDisabled
        containerClass={classNames(
          searchField ? 'w-none' : '',
          isMobile() ? 'draftee-search-mobile p-0' : '',
        )}
        onEdit={optimizedHandleSearch}
        onClose={() => handleReset()}
        mode={''}
      />
      {allPlayers.length > 0 ? (
        <div className="list-header" style={{ width: '95%' }}>
          <div>{t('name')}</div>
        </div>
      ) : null}
      {allPlayers.length > 0 ? (
        <div id="claimList">
          <InfiniteScroll
            className={isMobile() ? '' : 'player-list-pagination'}
            dataLength={allPlayers.length}
            next={() => handleJumpToPage('forth')}
            hasMore={true}
            scrollThreshold={1}
            height={isMobile() ? 580 : 626}
            loader={
              !isDeadEnd ? (
                <h4 className="text-center">{t('loading')}...</h4>
              ) : (
                <h4 className="text-center">. . .</h4>
              )
            }
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>. . .</b>
              </p>
            }
          >
            {allPlayers.map((item: any, index: any) => (
              <div
                className="nft-item"
                style={{
                  width: '368px',
                  padding: '20px',
                }}
                key={index}
              >
                <div className="nft-image-section draft-option">
                  <div
                    className="image-border"
                    style={{
                      background: getCircleColor(item.playerlevelid),
                    }}
                  >
                    <ImageComponent
                      loading="lazy"
                      src={
                        item.playerpicturethumb ||
                        item.playerpicture ||
                        UserAvatar
                      }
                      alt=""
                      className="nft-image"
                    />
                  </div>
                  <div className="nft-name">
                    {item.name} &nbsp;
                    <TooltipLabel
                      title={getCountryNameNew(
                        item?.country_id || item?.nationality_id,
                      )}
                    >
                      <span
                        className={`fi fis fi-${getCountryCode(
                          item?.country_id || item?.nationality_id,
                        )}`}
                      ></span>
                    </TooltipLabel>
                  </div>
                </div>
                <div className="price-button-section">
                  <div className="nft-price-section">
                    <div className="white-color"></div>
                    <div className="nft-price"></div>
                  </div>
                  {/* <AddIcon
                    className="fg-primary-color"
                    onClick={() => handleDraftPlayer(item)}
                  /> */}
                  {isLoading && playerId === item?.id ? (
                    <div
                      className={classNames('spinner size-small_cartoon')}
                      style={{ margin: '0 30px' }}
                    ></div>
                  ) : (
                    <button
                      onClick={e => handleClaimPlayer(e, item)}
                      className="form-submit-btn wallet-btn"
                      style={{
                        width: isMobile() ? '90px' : '100px',
                        height: '30px',
                        fontSize: '14px',
                        margin: '0px 4px',
                      }}
                    >
                      {t('claim')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      ) : fanClubLoader ? (
        <div className="nft-item no-data">
          <div className={classNames('all-players-loading')}>
            <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <div className="drafts-no-action-container no-new-draft">
          {fanClubError ? (
            <div className="nft-price">{t('no data found')}</div>
          ) : null}
          <div>{t('no results found')}</div>
        </div>
      )}
    </section>
  )
}

export default FanClubList
