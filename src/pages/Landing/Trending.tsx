import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  fetchListPlayersLanding,
  getPlayer1Contract,
  getTrendingScoutsPlayers,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { useNavigate } from 'react-router-dom'
import {
  getCircleColor,
  getFlooredFixed,
  getFlooredNumber,
  getMarketValue,
  getPercentageEst,
  getPlayerLevelClassName,
  getUsdFromMatic,
  isMobile,
} from '@utils/helpers'
import PlayerImage from '@components/PlayerImage'
import classnames from 'classnames'
import { setPurchasePlayerId } from '@root/apis/purchase/purchaseSlice'
import toast from 'react-hot-toast'
import {
  getUserRankingList,
  showPurchaseForm,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import { fetchPlayersStatsTrending } from '@root/apis/playerStats/playerStatsSlice'
import { PLAYER_STATUS } from '@root/constants'
import { useInView } from 'react-intersection-observer'
import { useIdleTimer } from 'react-idle-timer'
import classNames from 'classnames'
import UserCard from '@components/Card/UserCard'
import UserCardSkeleton from '@components/Card/UserCardSkeleton'
import WhatshotIcon from '@mui/icons-material/Whatshot'

interface Props {
  item: any
  index: number
  prevData?: any
}
let trendingStatsInterval: any = null
const PlayerItem: React.FC<Props> = ({ item, index, prevData = null }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const usdRef = useRef<any>(null)
  const percentageRef = useRef<any>(null)
  const getClassName = name => name
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')

  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsDataTrending = [] } = playerStatsData

  useEffect(() => {
    handleUsdAnimation()
    // handlePercentageAnimation()
  }, [item])

  useEffect(() => {
    handlePercentageAnimation()
  }, [fetchPlayerStatsDataTrending])

  const handleBuy = (e: any) => {
    if (
      (item?.playerstatusid?.id === 5 ||
        item?.playerstatusid === 5 ||
        item?.playerlevelid === 5) &&
      item?.exlistingon === false
    ) {
      e.stopPropagation()
      toast.error(t('player is not listed yet'))
    } else {
      e.stopPropagation()
      const profileLink = `player/${item.id}`
      dispatch(setPurchasePlayerId(profileLink))
      handlePurchaseOpen('buy', item)
    }
  }

  const handleSell = (e: any) => {
    if (
      (item?.playerstatusid?.id === 5 ||
        item?.playerstatusid === 5 ||
        item?.playerlevelid === 5) &&
      item?.exlistingon === false
    ) {
      e.stopPropagation()
      toast.error(t('player is not listed yet'))
    } else {
      e.stopPropagation()
      const profileLink = `player/${item.id}`
      dispatch(setPurchasePlayerId(profileLink))
      dispatch(getPlayer1Contract({ url: item?.detailpageurl }))
      handlePurchaseOpen('sell', item)
    }
  }

  const handlePurchaseOpen = (value: string, data: any) => {
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

  const handleUsdAnimation = () => {
    if (usdRef?.current?.classList[3] === 'profit-style') {
      usdRef?.current?.classList.remove('profit')
    } else if (usdRef?.current?.classList[3] === 'loss-style') {
      usdRef?.current?.classList.remove('loss-style')
    }
    setTimeout(() => {
      if (getUsdFromMatic(item).usdNow > getUsdFromMatic(item).usdOld) {
        usdRef?.current?.classList.add('profit-style')
      } else {
        usdRef?.current?.classList.add('loss-style')
      }
    }, 500)
  }

  const handlePercentageAnimation = () => {
    const trendingItem = getLivePlayerStat(item)
    if (percentageRef?.current?.classList[1] === 'profit') {
      percentageRef?.current?.classList.remove('profit')
    } else if (percentageRef?.current?.classList[1] === 'loss') {
      percentageRef?.current?.classList.remove('loss')
    }
    setTimeout(() => {
      if (
        getPercentageEst(trendingItem).oldNumber <
        getPercentageEst(trendingItem).newNumber
      ) {
        percentageRef?.current?.classList.add('profit')
        if (percentageRef?.current) {
          percentageRef.current.style.color = 'var(--profit-color)'
        }
      } else {
        percentageRef?.current?.classList.add('loss')
        if (percentageRef?.current) {
          percentageRef.current.style.color = 'var(--loss-color)'
        }
      }
    }, 500)
  }

  const getLivePlayerStat = item => {
    const currentPlayerIndex = fetchPlayerStatsDataTrending.findIndex(
      stat => stat.player.toLowerCase() === item?.playercontract?.toLowerCase(),
    )
    if (currentPlayerIndex > -1) {
      return fetchPlayerStatsDataTrending[currentPlayerIndex]
    }
    return item
  }

  return (
    <div
      className="players-landing-item"
      onClick={() => {
        window.scrollTo(0, 0)
        navigate(`/app/player/${item.detailpageurl}`)
      }}
    >
      {window.innerWidth < 700 ? (
        <>
          <div className="player-image">
            <div
              className="image-border"
              style={{
                background: getCircleColor(item?.playerlevelid),
              }}
            >
              <PlayerImage
                src={item.playerpicturethumb}
                className="nft-image"
                hasDefault={true}
              />
            </div>
          </div>
          <div className="player-info-wrapper">
            <div className="player-name">
              <span className={getPlayerLevelClassName(item?.playerlevelid)}>
                {item.name} {item?.ticker ? `$${item?.ticker}` : ''}
              </span>
            </div>

            <div className="market-value">
              {item?.playerstatusid < 4 ? (
                <div className="button-wrapper">
                  <div className="button-wrapper">
                    <div
                      className={classnames(
                        'player-info-stats',
                        'number-color',
                        'matic-value',
                        'matic-figure',
                      )}
                      style={{
                        fontSize: '18px',
                        color: 'var(--primary-text-color)',
                      }}
                    >
                      $0
                    </div>
                    <div className="changed-price">
                      <div
                        className={classnames(
                          'number-color',
                          getClassName('profit'),
                        )}
                        style={{ fontSize: '18px' }}
                      >
                        0.00%
                      </div>
                    </div>
                  </div>
                  <div className="coming-soon-wrapper">{t('coming soon')}</div>
                </div>
              ) : (
                <div className="button-wrapper">
                  <div className="button-wrapper">
                    <div
                      className={classnames(
                        'player-info-stats',
                        'number-color',
                        'matic-value',
                        'matic-figure',
                        getPlayerLevelClassName(item?.playerlevelid),
                        !item?.coin_issued
                          ? ''
                          : getMarketValue(
                              item?.matic,
                              item?.exchangeRateUSD?.rate,
                              item?.coin_issued,
                            ) >=
                            getMarketValue(
                              prevData?.matic,
                              prevData?.exchangeRateUSD?.rate,
                              prevData?.coin_issued,
                            )
                          ? getClassName('profit')
                          : getClassName('loss'),
                      )}
                      style={{
                        fontSize: '18px',
                        color: 'var(--primary-text-color)',
                      }}
                    >
                      $
                      {getFlooredNumber(
                        getMarketValue(
                          item?.matic,
                          item?.exchangeRateUSD?.rate,
                          item?.coin_issued,
                        ),
                      )}
                    </div>
                    <div className="changed-price">
                      <div
                        ref={percentageRef}
                        className={classnames(
                          'number-color',
                          getPercentageEst(getLivePlayerStat(item)).oldNumber <
                            getPercentageEst(getLivePlayerStat(item)).newNumber
                            ? getClassName('profit')
                            : getClassName('loss'),
                        )}
                        style={{ fontSize: '18px' }}
                      >
                        {getFlooredFixed(
                          getPercentageEst(getLivePlayerStat(item)).percentage,
                          2,
                        )}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="button-box-wrapper">
                    <div onClick={handleBuy}>{t('buy')}</div>
                    <div onClick={handleSell}>{t('sell')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="player-image-wrapper">
            <div className="player-number">{index}</div>
            <div className="player-image">
              <div
                className="image-border"
                style={{
                  background: getCircleColor(item?.playerlevelid),
                }}
              >
                <PlayerImage
                  src={item.playerpicturethumb}
                  className="nft-image"
                  hasDefault={true}
                />
              </div>
            </div>
          </div>
          <div className="player-info-wrapper">
            <div className="player-name-wrapper">
              <div className="player-name">
                <span className={getPlayerLevelClassName(item?.playerlevelid)}>
                  {item.name} {item?.ticker ? `$${item?.ticker}` : ''}
                </span>
              </div>
              <div className="market-value">
                {item?.playerstatusid >= 4 ? (
                  <div
                    className={classnames(
                      'player-info-stats',
                      'number-color',
                      'matic-value',
                      'matic-figure',
                      getPlayerLevelClassName(item?.playerlevelid),
                      !item?.coin_issued
                        ? ''
                        : getMarketValue(
                            item?.matic,
                            item?.exchangeRateUSD?.rate,
                            item?.coin_issued,
                          ) >=
                          getMarketValue(
                            prevData?.matic,
                            prevData?.exchangeRateUSD?.rate,
                            prevData?.coin_issued,
                          )
                        ? getClassName('profit')
                        : getClassName('loss'),
                    )}
                    style={{
                      color: 'var(--primary-text-color)',
                    }}
                  >
                    $
                    {getFlooredNumber(
                      getMarketValue(
                        item?.matic,
                        item?.exchangeRateUSD?.rate,
                        item?.coin_issued,
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            {item?.playerstatusid < 4 ? (
              <div className="button-wrapper">
                <div className="price-value">
                  <div
                    style={{ color: 'var(--primary-text-color)' }}
                    className={classnames(
                      'number-color',
                      'pt-5',
                      'usd-price',
                      'textSize',
                      getClassName('profit-style'),
                    )}
                  >
                    $0.000
                  </div>

                  <div className="changed-price">
                    <div
                      className={classnames(
                        'number-color',
                        getClassName('profit'),
                      )}
                      style={{ fontSize: '20px' }}
                    >
                      0.00%
                    </div>
                  </div>
                </div>
                <div className="coming-soon-wrapper">{t('coming soon')}</div>
              </div>
            ) : (
              <div className="button-wrapper">
                <div className="price-value">
                  <div
                    ref={usdRef}
                    style={{ color: 'var(--primary-text-color)' }}
                    className={classnames(
                      'number-color',
                      'pt-5',
                      'usd-price',
                      'textSize',
                      getPlayerLevelClassName(item?.playerlevelid),
                      getUsdFromMatic(item).usdNow >
                        getUsdFromMatic(item).usdOld
                        ? getClassName('profit-style')
                        : getClassName('loss-style'),
                    )}
                  >
                    ${getFlooredFixed(getUsdFromMatic(item)?.usdNow, 3)}
                  </div>

                  <div className="changed-price">
                    <div
                      ref={percentageRef}
                      className={classnames(
                        'number-color',
                        getPercentageEst(getLivePlayerStat(item)).oldNumber <
                          getPercentageEst(getLivePlayerStat(item)).newNumber
                          ? getClassName('profit')
                          : getClassName('loss'),
                      )}
                      style={{ fontSize: '20px' }}
                    >
                      {getFlooredFixed(
                        getPercentageEst(getLivePlayerStat(item)).percentage,
                        2,
                      )}
                      %
                    </div>
                  </div>
                </div>
                <div className="button-box-wrapper">
                  <div onClick={handleBuy}>{t('buy')}</div>
                  <div onClick={handleSell}>{t('sell')}</div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const PlayerSkeletonItem: React.FC = () => {
  return (
    <div className="players-landing-skeleton-item players-landing-item">
      {window.innerWidth < 700 ? (
        <>
          <div className="player-image-wrapper">
            <div className="player-image">
              <div className="image-border"></div>
            </div>
          </div>
          <div className="player-info-wrapper">
            <div className="player-name-skeleton"></div>
            <div className="button-wrapper">
              <div className="market-value-skeleton"></div>
              <div className="button-box-skeleton"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="player-image-wrapper">
            <div className="player-number">&nbsp;</div>
            <div className="player-image">
              <div className="image-border"></div>
            </div>
          </div>
          <div className="player-info-wrapper">
            <div className="player-name-wrapper">
              <div className="player-name-skeleton"></div>
              <div className="market-value-skeleton"></div>
            </div>
            <div className="button-wrapper">
              <div className="price-value-skeleton"></div>
              <div className="button-box-skeleton"></div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const Trending: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    isWalletFormVisible,
    isVisibleModal,
    userRankingList,
    loadingUserRankingList,
    isUserRankingListSuccess,
  } = authenticationData
  const {
    playersListLandingData,
    trendingScoutsPlayers,
    loadingTrendingScoutsPlayers,
  } = playerCoinData

  const [trendingTab, setTrendingTab] = useState('players')

  useEffect(() => {
    dispatch(fetchListPlayersLanding())
    return () => {
      clearInterval(trendingStatsInterval)
    }
  }, [])

  useEffect(() => {
    if (trendingTab === 'scouts') {
      dispatch(getTrendingScoutsPlayers())
      // dispatch(getUserRankingList({ type: 'season' }))
    }
  }, [trendingTab])

  const { ref, inView } = useInView({ delay: 5000 })

  const onIdle = () => {
    clearInterval(trendingStatsInterval)
  }

  const onActive = () => {
    clearInterval(trendingStatsInterval)
    if (
      !isVisibleModal &&
      playersListLandingData.length > 0 &&
      !document.hidden &&
      inView
    ) {
      trendingStatsInterval = setInterval(() => {
        handleGetPriceStats()
      }, 20000)
    }
  }

  const onAction = () => {
    /**/
  }

  useIdleTimer({
    onIdle,
    onActive,
    onAction,
    timeout: 6000,
    throttle: 500,
  })

  useEffect(() => {
    clearInterval(trendingStatsInterval)
    if (
      !isVisibleModal &&
      playersListLandingData.length > 0 &&
      !document.hidden &&
      inView
    ) {
      trendingStatsInterval = setInterval(() => {
        handleGetPriceStats()
      }, 20000)
    }
  }, [playersListLandingData.length, isVisibleModal, document.hidden, inView])

  const handleGetPriceStats = () => {
    if (isMobile()) {
      // const testItems = playersListLandingData.map(item => item.props.card)
      const newStat = playersListLandingData.filter((player: any) => {
        if (player?.name && player?.name?.toLowerCase() === 'coming soon') {
          return false
        } else {
          if (player?.playerstatusid >= PLAYER_STATUS.SUBSCRIBE) {
            return true
          } else {
            return false
          }
        }
      })
      const playerContracts =
        newStat.length > 0
          ? newStat.map((item: any) => item.playercontract)
          : []
      if (playerContracts.length > 0 && !isWalletFormVisible) {
        dispatch(
          fetchPlayersStatsTrending({
            contracts: playerContracts,
            query: 'complex',
          }),
        )
      }
    } else {
      // const testItems = playersListLandingData.map(item => item.props.card)
      const newStat = playersListLandingData.filter((player: any) => {
        if (player?.name && player?.name?.toLowerCase() === 'coming soon') {
          return false
        } else {
          if (player?.playerstatusid >= PLAYER_STATUS.SUBSCRIBE) {
            return true
          } else {
            return false
          }
        }
      })

      const playerContracts =
        newStat.length > 0
          ? newStat.map((item: any) => item.playercontract)
          : []
      if (playerContracts.length > 0 && !isWalletFormVisible) {
        dispatch(
          fetchPlayersStatsTrending({
            contracts: playerContracts,
            query: 'complex',
          }),
        )
      }
    }
  }

  return (
    <div
      className={classNames(
        'section-wrapper',
        isMobile() ? 'landing-trending-section' : '',
      )}
    >
      <div className="section-title-container">
        <div className="section-title">
          {t('trending')} <WhatshotIcon />
        </div>
        <div className="trending-switch">
          <b
            className={
              trendingTab === 'players' ? 'trending-switch-selected' : ''
            }
            onClick={() => setTrendingTab('players')}
          >
            {t('PLAYERS')}
          </b>
          <b
            className={
              trendingTab === 'scouts' ? 'trending-switch-selected' : ''
            }
            onClick={() => setTrendingTab('scouts')}
          >
            {t('SCOUTS')}
          </b>
        </div>
      </div>
      {trendingTab === 'players' ? (
        <div className="user-list-wrapper" ref={ref}>
          {playersListLandingData.length === 0 ? (
            <>
              <div className="user-list-column">
                {new Array(5).fill(1).map((_: any, index: number) => (
                  <PlayerSkeletonItem key={index} />
                ))}
              </div>
              {/* {window.innerWidth > 1300 ? (
                <div className="user-list-column">
                  {new Array(5).fill(1).map((_: any, index: number) => (
                    <PlayerSkeletonItem key={index} />
                  ))}
                </div>
              ) : null} */}
            </>
          ) : (
            <>
              <div
                className={classNames(
                  'user-list-column players-landing-one-column',
                )}
              >
                {
                  playersListLandingData
                    .slice(0, 8)
                    .map((item: any, index: number) => (
                      <PlayerItem
                        key={index}
                        item={item}
                        index={window.innerWidth <= 700 ? 0 : index + 1}
                      />
                    ))
                  // : playersListLandingData
                  //     .filter((_: any, index: number) => index % 2 === 0)
                  //     .slice(0, 9)
                  //     .map((item: any, index: number) => (
                  //       <PlayerItem
                  //         key={index}
                  //         item={item}
                  //         index={index * 2 + 1}
                  //       />
                  //     ))
                }
              </div>

              {/* {window.innerWidth > 1300 ? (
                <div className="user-list-column">
                  {playersListLandingData
                    .filter((_: any, index: number) => index % 2 === 1)
                    .slice(0, 9)
                    .map((item: any, index: number) => (
                      <PlayerItem
                        key={index}
                        item={item}
                        index={index * 2 + 2}
                      />
                    ))}
                </div>
              ) : null} */}
            </>
          )}
        </div>
      ) : (
        <>
          {loadingTrendingScoutsPlayers ? (
            <div className="user-list-wrapper">
              <div className="user-list-column">
                {new Array(8)
                  .fill(1)
                  .slice(0, 8)
                  .map((_: any, index: number) => (
                    <UserCardSkeleton key={index} />
                  ))}
              </div>
              {/* {window.innerWidth > 1300 ? (
                <div className="user-list-column">
                  {new Array(5)
                    .fill(1)
                    .slice(0, 5)
                    .map((_: any, index: number) => (
                      <UserCardSkeleton key={index} />
                    ))}
                </div>
              ) : null} */}
            </div>
          ) : trendingScoutsPlayers.length === 0 ? (
            <div className="no-data-msg">{t('no data found')}</div>
          ) : (
            <div className="user-list-wrapper">
              <div className="user-list-column">
                {trendingScoutsPlayers
                  .slice(0, 8)
                  .map((item: any, index: number) => (
                    <UserCard
                      user={item}
                      index={window.innerWidth <= 700 ? 0 : index + 1}
                      key={index}
                    />
                  ))}
              </div>
              {/* {window.innerWidth > 1300 ? (
                <div className="user-list-column">
                  {userRankingList
                    .filter((_: any, index: number) => index % 2 === 1)
                    .slice(0, 5)
                    .map((item: any, index: number) => (
                      <UserCard user={item} index={index * 2 + 2} key={index} />
                    ))}
                </div>
              ) : null} */}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Trending
