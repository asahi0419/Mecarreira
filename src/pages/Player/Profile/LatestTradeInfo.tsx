/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import '@assets/css/pages/Notification.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { getLatestTrade } from '@root/apis/onboarding/authenticationSlice'
import { useTranslation } from 'react-i18next'
import { isMobile } from '@utils/helpers'
import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

interface FiltersData {
  limit?: string
  offset?: string
  player_contract?: string
  search?: string
  type?: string
}

const LatestTradeInfo: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { getPlayerDetailsSuccessData } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    getLatestTradeData,
    notificationLoader,
    selectedThemeRedux,
    nextLatestTradeUrl,
    getLatestTradeCount,
    latestTradeLoader,
  } = authenticationData
  const [itemList, setItemList] = useState<any>([])
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    player_contract: getPlayerDetailsSuccessData?.playercontract,
    offset: '0',
  })
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
    // console.log('appliedFiter', appliedFilters)
    if (
      appliedFilters?.limit ||
      appliedFilters?.offset ||
      appliedFilters?.type ||
      appliedFilters?.search
    ) {
      dispatch(getLatestTrade(appliedFilters))
    }
  }, [appliedFilters])
  // useEffect(() => {
  //   dispatch(getLatestTrade(appliedFilters))
  // }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const handleJumpToPage = (head: string) => {
    // console.log('hello scroll')
    try {
      if (head !== 'back') {
        const paginationParams = getUrlParams(
          nextLatestTradeUrl,
          'limit',
          'offset',
        )
        if (
          nextLatestTradeUrl &&
          paginationParams.offset !== appliedFilters.offset
        ) {
          setIsDeadEnd(false)
          setAppliedFilters({ ...appliedFilters, ...paginationParams })
        } else {
          setIsDeadEnd(true)
        }
      }
    } catch (err) {
      console.log('err', err)
    }
  }
  useEffect(() => {
    // console.log('appliedFilters Data', appliedFilters)
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        if (!nextLatestTradeUrl) {
          setIsDeadEnd(true)
          setItemList(getLatestTradeData)
        } else {
          const url_string = nextLatestTradeUrl
          const url = new URL(url_string)
          const obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
          if (appliedFilters.offset === obj.offset) {
            setIsDeadEnd(true)
            setItemList(getLatestTradeData)
          } else {
            if (getLatestTradeData.length === 0) {
              setIsDeadEnd(true)
            }
            setItemList([...itemList, ...getLatestTradeData])
          }
        }
      } else {
        if (getLatestTradeData.length > 0) {
          setItemList([...itemList, ...getLatestTradeData])
        } else if (getLatestTradeData.length === 0) {
          setIsDeadEnd(true)
        }
      }
    } else {
      setItemList(getLatestTradeData)
    }
  }, [getLatestTradeData])
  return (
    <div className="main_latest_trade_wrapper">
      {/* <div
        className="latest_tran"
        style={{
          border: 'unset',
          padding: isMobile() ? '46px 46px 10px 46px' : '46px 46px 0px 46px',
          marginTop: isMobile() ? '0px' : '32px',
        }}
      >
        {t('show_latest_tran')}
      </div> */}
      <div
        id="latest_tran_scroll"
        className="infinite-scroll-component player-list-pagination latest_tran_wrapper"
        style={{
          height: isMobile() ? 'auto !important' : '775px',
          overflow: 'auto',
        }}
      >
        {itemList.length < 1 && latestTradeLoader ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '250px',
            }}
          >
            <div className="spinner">
              <div className="spinner"></div>
            </div>
          </div>
        ) : (
          <div className="notification_scroll wallet-container">
            {itemList.length > 0 ? (
              <InfiniteScroll
                className="player-list-pagination"
                dataLength={itemList?.length}
                next={() => handleJumpToPage('forth')}
                scrollThreshold={0.5}
                hasMore={getLatestTradeData.length === 0 ? false : true}
                scrollableTarget="latest_tran_scroll"
                loader={
                  !isDeadEnd && itemList.length > 19 ? (
                    <h4
                      style={{
                        textAlign: 'center',
                        paddingBottom: '20px',
                      }}
                    >
                      {t('loading')}...
                    </h4>
                  ) : (
                    ''
                  )
                }
                endMessage={
                  <p style={{ textAlign: 'center', paddingBottom: '20px' }}>
                    <b>{t('end of results')}</b>
                  </p>
                }
              >
                <>
                  {itemList.map((item: any, index: any) => (
                    <div key={index} className="latest_trade_item_wrapper">
                      <div
                        key={index}
                        className="latest_trade_item"
                        style={{
                          color: item?.direction === 1 ? '#6bc909' : '#f54f4f',
                          position: 'relative',
                        }}
                      >
                        <div className="latest_trade_item user_history">
                          {/* {item?.direction === 1 ? (
                            <div
                              style={{
                                background:
                                  item?.direction === 1 ? '#6bc909' : '#f54f4f',
                              }}
                              className="arrow_icon_wrapper"
                            >
                              <ArrowBackIcon
                                style={{ color: '#222435', fontSize: '25px' }}
                              />
                            </div>
                          ) : (
                            <div
                              style={{
                                background:
                                  item?.direction === 1 ? '#6bc909' : '#f54f4f',
                              }}
                              className="arrow_icon_wrapper"
                            >
                              <ArrowForwardIcon
                                style={{ color: '#222435', fontSize: '25px' }}
                              />
                            </div>
                          )} */}

                          <div className="user-content">
                            <div className="user-image">
                              <div className="image-border">
                                <div
                                  className={classNames(
                                    'nft-image',
                                    item?.avatar ?? 'group-0',
                                  )}
                                />
                              </div>
                            </div>
                            <div
                              className="user-card-feed-content"
                              // style={{ marginTop: '-29px' }}
                            >
                              <div className="user-card-feed-name-info">
                                <div className="user-name-wrapper">
                                  <div className="user-name">
                                    <div className="user-name-text">
                                      {item?.username ?? 'None'}
                                    </div>
                                    <div className="user-feed-level-wrapper">
                                      <div className="user-feed-level">
                                        {item?.lifetimelevel ?? 'None'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  // padding: '0px 10px 5px 0px',
                                  color:
                                    item?.direction === 1
                                      ? '#6bc909'
                                      : '#f54f4f',
                                }}
                              >
                                {item?.amountcoins.toFixed(2)} $
                                {getPlayerDetailsSuccessData?.ticker}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div style={{ padding: '0px 5px' }}>
                          ${getPlayerDetailsSuccessData?.ticker}
                        </div> */}
                        <div
                          className="latest_tran_usd_wrapper"
                          style={{ marginTop: '-25px' }}
                        >
                          <div style={{ padding: '0px 8px' }}>
                            {item?.totalamountusd.toFixed(2)} USD
                          </div>
                          {/* <div
                            style={{
                              padding: '0px 8px',
                              color: '#abacb5',
                              textAlign: 'right',
                              // marginTop: '-10px',
                              fontSize: '12px',
                            }}
                          >
                            {item?.tradetimestamp &&
                              item?.tradetimestamp
                                .substring(0, 19)
                                .replace('T', ' ')}
                          </div> */}
                          {/* <div
                            style={{
                              // padding: '0px 18px 5px 0px',
                              color: '#abacb5',
                              textAlign: 'right',
                              marginBottom: '-50px',
                              fontSize: '12px',
                            }}
                          >
                            {item?.tradetimestamp &&
                              item?.tradetimestamp
                                .substring(0, 19)
                                .replace('T', ' ')}
                          </div> */}
                        </div>
                      </div>
                      <div className="flex_date_amount_wrapper">
                        {/* <div
                          style={{
                            padding: '0px 10px 5px 0px',
                            color:
                              item?.direction === 1 ? '#6bc909' : '#f54f4f',
                          }}
                        >
                          {item?.amountcoins.toFixed(2)} $
                          {getPlayerDetailsSuccessData?.ticker}
                        </div> */}
                        <div
                          style={{
                            padding: '0px 10px 5px 0px',
                            color: '#abacb5',
                            textAlign: 'right',
                            marginTop: '-36px',
                            fontSize: '12px',
                          }}
                        >
                          {item?.tradetimestamp &&
                            item?.tradetimestamp
                              .substring(0, 19)
                              .replace('T', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              </InfiniteScroll>
            ) : (
              getLatestTradeCount < 1 && (
                <div className="drafts-no-action-container no-new-draft heading-title unverified-alert fullwidth">
                  <div>{t('no data found')}</div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LatestTradeInfo
