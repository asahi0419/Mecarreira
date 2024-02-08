/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  setActiveTab,
  showLanding,
  showPurchaseForm,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import { isMobile } from '@utils/helpers'
import {
  fetchAllPlayers,
  getLaunchingPlayers,
} from '@root/apis/playerCoins/playerCoinsSlice'
import {
  fetchPlayersStatsNewLaunches,
  fetchPlayersStatsNewLaunchesInit,
} from '@root/apis/playerStats/playerStatsSlice'
import { DummyPlayer, PLAYER_STATUS } from '@root/constants'
import { ethers } from 'ethers'
import NewCarouselCard from '@components/Card/NewCarouselCard'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import Carousel from 'react-spring-3d-carousel'
import { config } from 'react-spring'
import DepositModal from './DepositModal'
import classNames from 'classnames'
import leftArrow from '@assets/images/left_angle_bracket.webp'
import rightArrow from '@assets/images/right_angle_bracket.webp'
import { useInView } from 'react-intersection-observer'
import { useIdleTimer } from 'react-idle-timer'
import RecordIcon from '@assets/icons/icon/record.png'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import classnames from 'classnames'

interface PlayerOffset {
  start: number
  end: number
}
interface Props {
  isWalletOpen?: boolean
  hasTour?: boolean
}

let playerStatsInterval: any = null

const PlayerCarousel: React.FC<Props> = ({
  isWalletOpen = false,
  hasTour = false,
}) => {
  const items: JSX.Element[] = []
  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    userWalletData: { USDBalance, balance },
    selectedThemeRedux,
    isVisibleModal,
  } = authenticationData

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const playerStatsData = useSelector((state: RootState) => state.playerstats)

  const { playersTableData, launchingPlayers, loadingLaunchingPlayers } =
    playerCoinData
  const { fetchPlayerStatsDataNL, fetchedPlayerStatsDataNL } = playerStatsData
  const [testStat, setTestStat] = useState<any>([])
  const [isCarouselLoading, setIsCarouselLoading] = useState(false)
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [allPlayers, setAllPlayers] = useState<any>([])
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playerOffset, setPlayerOffset] = useState({
    start: 0,
    end: 4,
  })
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playerOffsetMobile, setPlayerOffsetMobile] = useState({
    start: 0,
    end: 1,
  })
  const [goToSlide, setGoToSlide] = useState(0)
  const [tabStatus, setTabStatus] = useState('live')
  const [carouselItems, setCarouselItems] = useState([])

  const playerRef = useRef<any>([])
  const carouselRef = useRef<any>(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')

  useEffect(() => {
    if (fetchedPlayerStatsDataNL) {
      setTimeout(() => dispatch(fetchPlayersStatsNewLaunchesInit()), 1000)
    }
  }, [fetchedPlayerStatsDataNL])

  const handleGetPriceStats = (playersData: any, offset: PlayerOffset) => {
    if (isCarouselLoading) {
      setIsCarouselLoading(false)
    }
    if (isMobile()) {
      const testItems = items.map(item => item.props.card)
      const newStat = testItems.filter((player: any) => {
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
      if (playerContracts.length > 0 && !isWalletOpen) {
        dispatch(
          fetchPlayersStatsNewLaunches({
            contracts: playerContracts,
            query: 'complex',
          }),
        )
      }
    } else {
      const testItems = items.map(item => item.props.card)
      const newStat = testItems.filter((player: any) => {
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
      if (playerContracts.length > 0 && !isWalletOpen) {
        dispatch(
          fetchPlayersStatsNewLaunches({
            contracts: playerContracts,
            query: 'complex',
          }),
        )
      }
    }
  }

  useEffect(() => {
    playerRef.current = testStat
  }, [testStat])

  const handlePurchaseOpen = (value: string, data: any) => {
    const loginPromise = new Promise((resolve, reject) => {
      try {
        const loggedinId = localStorage.getItem('loginId')
        const loggedinInfo = localStorage.getItem('loginInfo')
        resolve({ loggedinId, loggedinInfo })
      } catch (error) {
        reject(error)
      }
    })

    loginPromise
      .then(({ loggedinId, loggedinInfo }: any) => {
        if (!loggedinInfo && !loggedinId) {
          dispatch(showSignupForm())
        } else {
          dispatch(
            showPurchaseForm({
              mode: value.toUpperCase(),
              playerData: data,
            }),
          )
        }
      })
      .catch(error => {
        console.log('PURCHASE_ERR::', error)
      })
  }

  const makePlayersWithStats = () => {
    const playersTableDataTemp = [...playersTableData]
    for (let i = 0; i < fetchPlayerStatsDataNL.length; i++) {
      for (let j = 0; j < playersTableDataTemp.length; j++) {
        if (
          playersTableDataTemp[j]?.playercontract &&
          fetchPlayerStatsDataNL[i]?.player &&
          ethers.utils.getAddress(playersTableDataTemp[j]?.playercontract) ===
            ethers.utils.getAddress(fetchPlayerStatsDataNL[i]?.player)
        ) {
          playersTableDataTemp[j] = {
            ...playersTableDataTemp[j],
            ...fetchPlayerStatsDataNL[i],
          }
        }
      }
    }
    if (playersTableDataTemp.length > 0) {
      setAllPlayers(playersTableDataTemp)
    }
  }

  useEffect(() => {
    if (fetchPlayerStatsDataNL.length > 0) {
      makePlayersWithStats()
      setTestStat(fetchPlayerStatsDataNL)
    }
  }, [fetchPlayerStatsDataNL])

  useEffect(() => {
    window.scrollTo(0, 0)
    // dispatch(fetchAllPlayers({}))
    dispatch(showLanding(true))
    return () => {
      clearInterval(playerStatsInterval)
      dispatch(showLanding(false))
    }
  }, [])

  useEffect(() => {
    if (tabStatus === 'launch') {
      dispatch(getLaunchingPlayers())
    } else if (tabStatus === 'live') {
      dispatch(fetchAllPlayers({}))
    }
  }, [tabStatus])

  const { ref, inView } = useInView({ delay: 5000 })

  const onIdle = () => {
    clearInterval(playerStatsInterval)
  }

  const onActive = () => {
    clearInterval(playerStatsInterval)
    if (
      playersTableData.length > 0 &&
      !isVisibleModal &&
      !document.hidden &&
      inView
    ) {
      playerStatsInterval = setInterval(() => {
        handleGetPriceStats(
          playersTableData,
          isMobile() ? playerOffsetMobile : playerOffset,
        )
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
    timeout: 10000,
    throttle: 500,
  })

  useEffect(() => {
    clearInterval(playerStatsInterval)
    if (
      playersTableData.length > 0 &&
      !isVisibleModal &&
      !document.hidden &&
      inView
    ) {
      playerStatsInterval = setInterval(() => {
        handleGetPriceStats(
          playersTableData,
          isMobile() ? playerOffsetMobile : playerOffset,
        )
      }, 20000)
    }
  }, [playersTableData.length, isVisibleModal, document.hidden, inView])

  const handleOffsetFn = (offsetFromCenter: number) => {
    let transform = 'translateY(-75%) translateX(-50%) scale(0) translateZ(0)'
    let left = '0%'
    let opacity = 1
    let clear = 'both'
    let pointerEvents = 'auto'
    if (offsetFromCenter === 0) {
      transform = 'translateY(-50%) translateX(-50%) scale(1) translateZ(0)'
      left = '50%'
      clear = 'unset'
    } else if (offsetFromCenter === 1) {
      transform = 'translateY(-50%) translateX(-40%) scale(0.8) translateZ(0)'
      left = '62.5%'
      // opacity = 0.9
    } else if (offsetFromCenter === 2) {
      transform = 'translateY(-50%) translateX(-30%) scale(0.6) translateZ(0)'
      left = '75%'
      // opacity = 0.9
    } else if (offsetFromCenter === 3) {
      transform = 'translateY(-50%) translateX(-30%) scale(0.4) translateZ(0)'
      left = '87.5%'
      // opacity = 0.8
    } else if (offsetFromCenter === -1) {
      transform = 'translateY(-50%) translateX(-60%) scale(0.8) translateZ(0)'
      left = '37.5%'
      // opacity = 0.9
    } else if (offsetFromCenter === -2) {
      transform = 'translateY(-50%) translateX(-70%) scale(0.6) translateZ(0)'
      left = '25%'
      // opacity = 0.9
    } else if (offsetFromCenter === -3) {
      transform = 'translateY(-50%) translateX(-70%) scale(0.4) translateZ(0)'
      left = '12.5%'
      // opacity = 0.8
    } else {
      opacity = 0
    }

    if (hasTour) {
      opacity = 0.02
      pointerEvents = 'none'
      if (offsetFromCenter === 0) {
        opacity = 1
        pointerEvents = 'auto'
      }
    } else if (isMobile()) {
      opacity = 1
    }
    return {
      transform,
      left,
      opacity,
      clear,
      pointerEvents,
    }
  }

  if (playersTableData.length > 0) {
    playersTableData.map((item: any, index: any) => {
      items.push(
        <NewCarouselCard
          card={item}
          playercardjson={item.playercardjson}
          key={index + 2}
          prevData={playerRef?.current}
          navigation={true}
          onBuy={() => handlePurchaseOpen('buy', item)}
          onSell={() => handlePurchaseOpen('sell', item)}
        />,
      )
    })
  }

  const customSort = originalArray => {
    console.log({ originalArray })
    const customOrder = originalArray.filter((_, index) => index % 2 === 0)
    customOrder.push(
      ...originalArray.filter((_, index) => index % 2 !== 0).reverse(),
    )
    console.log({ customOrder })
    return customOrder
  }

  useEffect(() => {
    setCarouselItems(
      tabStatus === 'launch'
        ? loadingLaunchingPlayers || launchingPlayers.length === 0
          ? new Array(isMobile() ? 3 : 7)
              .fill(1)
              .map((player: any, index: number) => {
                return {
                  key: index,
                  content: (
                    <div style={{ margin: '0px 10px' }}>
                      <BaseCardSkeleton reflection={true} />
                    </div>
                  ),
                }
              })
          : customSort(launchingPlayers).map((item, index) => {
              return {
                key: index,
                content: (
                  <NewCarouselCard
                    card={item}
                    playercardjson={item.playercardjson}
                    key={index}
                    prevData={playerRef?.current}
                    navigation={true}
                    isLanding={true}
                    reflection={true}
                    hasTour={hasTour}
                    onBuy={() => handlePurchaseOpen('buy', item)}
                    onSell={() => handlePurchaseOpen('sell', item)}
                  />
                ),
                onClick: () => {
                  setGoToSlide(index)
                },
              }
            })
        : tabStatus === 'live'
        ? playersTableData.length > 0
          ? customSort(playersTableData).map((item, index) => {
              return {
                key: index,
                content: (
                  <NewCarouselCard
                    card={item}
                    playercardjson={item.playercardjson}
                    key={index}
                    prevData={playerRef?.current}
                    navigation={true}
                    isLanding={true}
                    reflection={true}
                    hasTour={hasTour}
                    onBuy={() => handlePurchaseOpen('buy', item)}
                    onSell={() => handlePurchaseOpen('sell', item)}
                  />
                ),
                onClick: () => {
                  setGoToSlide(index)
                },
              }
            })
          : new Array(isMobile() ? 3 : 7)
              .fill(1)
              .map((player: any, index: number) => {
                return {
                  key: index,
                  content: (
                    <div style={{ margin: '0px 10px' }}>
                      <BaseCardSkeleton reflection={true} />
                    </div>
                  ),
                }
              })
        : {},
    )
  }, [playersTableData, tabStatus, launchingPlayers, hasTour])

  // const fixedCarouselItems = () =>
  //   playersTableData.length > 0
  //     ? [3, 1, 0, 2, 4].map((item, index) => {
  //         return (
  //           <div className="fix-carousel-item">
  //             <NewCarouselCard
  //               card={playersTableData[item]}
  //               playercardjson={playersTableData[item].playercardjson}
  //               key={index}
  //               prevData={playerRef?.current}
  //               navigation={true}
  //               isLanding={true}
  //               reflection={true}
  //               onBuy={() => handlePurchaseOpen('buy', playersTableData[item])}
  //               onSell={() =>
  //                 handlePurchaseOpen('sell', playersTableData[item])
  //               }
  //             />
  //           </div>
  //         )
  //       })
  //     : new Array(5).fill(1).map((player: any, index: number) => {
  //         return (
  //           <div style={{ margin: '0px 10px' }}>
  //             <BaseCardSkeleton reflection={true} />
  //           </div>
  //         )
  //       })

  const handlePrevBtn = () => {
    if (playersTableData.length > 0) {
      const prevIndex = isMobile()
        ? 0
        : carouselItems.length >= 9
        ? 3
        : carouselItems.length >= 7
        ? 2
        : carouselItems.length >= 5
        ? 1
        : 0
      if (playersTableData.length > prevIndex) {
        carouselRef?.current?.children[0]?.children[prevIndex]?.click()
      }
    }
  }

  const handleNextBtn = () => {
    if (playersTableData.length > 0) {
      const nextIndex = isMobile()
        ? 2
        : carouselItems.length >= 9
        ? 5
        : carouselItems.length >= 7
        ? 4
        : carouselItems.length >= 5
        ? 3
        : 2
      if (playersTableData.length > nextIndex) {
        carouselRef?.current?.children[0]?.children[nextIndex]?.click()
      }
    }
  }

  const offsetRadius = isMobile()
    ? 1
    : window.innerWidth >= 1200
    ? 4
    : window.innerWidth >= 1000
    ? 3
    : 2

  const getLeftPixel = () => {
    return isMobile()
      ? 'unset'
      : carouselItems.length >= 9
      ? '-25px'
      : carouselItems.length >= 7
      ? '-25px'
      : carouselItems.length >= 5
      ? '65px'
      : carouselItems.length >= 3
      ? '180px'
      : '300px'
  }

  const getRightPixel = () => {
    return isMobile()
      ? 'unset'
      : carouselItems.length >= 9
      ? '-25px'
      : carouselItems.length >= 7
      ? '-25px'
      : carouselItems.length >= 5
      ? '65px'
      : carouselItems.length >= 3
      ? '180px'
      : '300px'
  }

  // const [itemIndex, setItemIndex] = useState(0)

  // useEffect(() => {
  //   const liElements: any = document.querySelectorAll(
  //     '.new-launches-nft-content .alice-carousel .alice-carousel__wrapper li.__active',
  //   )
  //   if (liElements.length > 0 && window.innerWidth >= 920) {
  //     if (liElements[0].style !== undefined) {
  //       liElements[0].style.transform = 'scale(0.8)'
  //     }
  //     if (liElements[1].style !== undefined) {
  //       liElements[1].style.transform = 'scale(1)'
  //     }
  //     if (liElements[2].style !== undefined) {
  //       liElements[2].style.transform = 'scale(0.8)'
  //     }
  //   }
  // })

  return (
    <div className={classnames('new-launches-nft-content')}>
      <div
        className={classnames(
          'new-launches-nft-btn-group',
          hasTour ? 'dark-area' : '',
        )}
      >
        <div
          className={`${
            tabStatus === 'live' ? 'active' : ''
          } new-launches-nft-btn`}
          onClick={() => setTabStatus('live')}
        >
          {t('LIVE NOW')}
          <span className="genesis-mintedlive-title-icon record-icon">
            <img src={RecordIcon} alt="live-icon"></img>
          </span>
        </div>
        <div
          className={`${
            tabStatus === 'launch' ? 'active' : ''
          } new-launches-nft-btn`}
          onClick={() => setTabStatus('launch')}
        >
          <span className="genesis-mintedlive-title-icon rocket-icon">
            <RocketLaunchIcon />
          </span>
          {t('LAUNCHING')}
        </div>
      </div>

      {/* {
        window.innerWidth >= 1250 ? (
          <div className="fix-carousel-wrapper">{fixedCarouselItems()}</div>
        ) : playersTableData.length > 0 ? (
          <CircleCarousel
            items={playersTableData.map((item: any, index: number) => (
              <div
                style={{
                  lineHeight: '16px',
                }}
                key={index}
              >
                <NewCarouselCard
                  card={item}
                  playercardjson={item.playercardjson}
                  key={index}
                  prevData={playerRef?.current}
                  navigation={true}
                  isLanding={true}
                  reflection={false}
                  onBuy={() => handlePurchaseOpen('buy', item)}
                  onSell={() => handlePurchaseOpen('sell', item)}
                />
              </div>
            ))}
            activeIndex={itemIndex}
            setActiveIndex={setItemIndex}
          />
        ) : (
          <>
            {new Array(isMobile() ? 1 : 3)
              .fill(1)
              .map((_: any, index: number) => (
                <BaseCardSkeleton key={index} />
              ))}
          </>
              ) */}
      {launchingPlayers.length === 0 &&
      tabStatus === 'launch' &&
      !loadingLaunchingPlayers ? (
        <div className="no-data-msg">{t('no data found')}</div>
      ) : (
        <div className="carousel-wrapper" ref={ref}>
          <div
            className={classnames('prev-btn', hasTour ? 'dark-area' : '')}
            onClick={handlePrevBtn}
            style={{ left: getLeftPixel() }}
          >
            <img
              src={leftArrow}
              alt=""
              className="img-radius carousel-arrow"
              style={{ margin: '2px 5px 2px 0' }}
            />
          </div>
          <div className={classnames('carousel')} ref={carouselRef}>
            <Carousel
              slides={carouselItems}
              goToSlide={goToSlide}
              offsetRadius={offsetRadius}
              showNavigation={false}
              animationConfig={config.gentle}
              offsetFn={handleOffsetFn}
            />
          </div>
          <div
            className={classnames('next-btn', hasTour ? 'dark-area' : '')}
            onClick={handleNextBtn}
            style={{ right: getRightPixel() }}
          >
            <img
              src={rightArrow}
              alt=""
              className="img-radius carousel-arrow"
              style={{ margin: '2px 0 2px 2px' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerCarousel
