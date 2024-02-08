/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef, useState } from 'react'
import { AppLayout } from '@components/index'
import TagManager from 'react-gtm-module'
import { tagManagerArgs, BASE_EXPLORE_URL } from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  getFlooredFixed,
  initTagManager,
  isMobile,
  toKPINumberFormat,
  toNumberFormat,
  toUsd,
} from '@utils/helpers'
import '@assets/css/pages/User.css'
import UserCard from '@components/Card/UserCard'
import {
  getUserProfile,
  getUserPublicProfile,
  getUserPlayerCoinList,
  getUserPublicPlayerCoinList,
  getUserNftList,
  getUserPublicNftList,
  resetUserPlayerCoinList,
  getTourUserPublicProfile,
  getTourUserPublicPlayerCoinList,
  setTourStep,
  setFixedFooter,
} from '@root/apis/onboarding/authenticationSlice'
import UserCardSkeleton from '@components/Card/UserCardSkeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import TabGroup from '@components/Page/TabGroup'
import NftCardMobile from '@components/Card/NftCardMobile'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'
import PlayerSkeletonItem from '@components/Card/PlayerSkeletonItem'
import PlayerItem from '@components/Card/PlayerItem'
import XPProgressBar from '@components/XPProgressBar'
import NftSkeleton from '@components/Card/NftSkeleton'
import NftCard from '@components/Card/NftCard'
import classnames from 'classnames'
import Typed from 'typed.js'
import ImageComponent from '@components/ImageComponent'
import FooterNav from '@components/Page/FooterNav'
import { useNavigate } from 'react-router-dom'
import Home from '@assets/icons/icon/home.webp'
import TopTradesForm from '@pages/TopTrades/TopTradesForm'
import {
  getUserTopTrades,
  resetTopTrades,
} from '@root/apis/playerCoins/playerCoinsSlice'

const User: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [userPlayerCoinData, setUserPlayerCoinData] = useState<any>([])
  const [userNftData, setUserNftData] = useState<any>([])
  const [activeTab, setActiveTab] = useState('players')
  const [isDeadEndPlayers, setIsDeadEndPlayers] = useState(false)
  const [isDeadEndNft, setIsDeadEndNft] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<any>({
    offset: 0,
  })

  const [windowSize, setWindowSize] = useState(window.innerWidth)

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    loader,
    loadingUserPlayerCoinList,
    userPlayerCoinList,
    nextUserPlayerCoinListUrl,
    userPlayerCoinListCount,
    isUserPlayerCoinListSuccess,
    loadingUserNftList,
    userNftList,
    nextUserNftListUrl,
    userNftListCount,
    isUserNftListSuccess,
    userPublicProfile,
    isUserPublicProfileError,
    getUserSettingsData,
  } = authenticationData

  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    const locationUrl = window.location.href
    const urlUser = locationUrl.split('/')
    const userId = urlUser[urlUser.length - 1]
    document.querySelector('title')!.innerText = userId + ' Profile'
    document
      .querySelector("meta[name='description']")!
      .setAttribute(
        'content',
        userId + ' Profile showing all member token & balances',
      )
    if (userId === 'tour-user') {
      dispatch(getTourUserPublicProfile())
      dispatch(getTourUserPublicPlayerCoinList())
      setHasTour(true)
    } else {
      dispatch(getUserPublicProfile(userId))
      dispatch(getUserTopTrades(userId))
      if (userPublicProfile?.profile_visibility === 1) {
        dispatch(
          getUserPublicPlayerCoinList({
            username: userId,
            ...appliedFilters,
          }),
        )
      }
    }
    return () => {
      dispatch(resetUserPlayerCoinList())
      dispatch(resetTopTrades())
    }
  }, [])

  useEffect(() => {
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    const locationUrl = window.location.href
    const urlUser = locationUrl.split('/')
    if (userPublicProfile?.profile_visibility === 1) {
      dispatch(
        getUserPublicPlayerCoinList({
          username: urlUser[urlUser.length - 1],
          ...appliedFilters,
        }),
      )
      dispatch(
        getUserPublicNftList({
          username: urlUser[urlUser.length - 1],
          ...appliedFilters,
        }),
      )
    }
  }, [userPublicProfile?.profile_visibility])
  useEffect(() => {
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    const locationUrl = window.location.href
    const urlUser = locationUrl.split('/')
    if (appliedFilters?.limit || appliedFilters?.offset) {
      // if (isLogged) {
      //   if (activeTab === 'players') {
      //     dispatch(getUserPlayerCoinList(appliedFilters))
      //   } else {
      //     dispatch(getUserNftList(appliedFilters))
      //   }
      // } else {
      //   if (activeTab === 'players') {
      //     dispatch(getUserPublicPlayerCoinList({ username, ...appliedFilters }))
      //   } else {
      //     dispatch(getUserPublicNftList({ username, ...appliedFilters }))
      //   }
      // }
      if (activeTab === 'players') {
        dispatch(
          getUserPublicPlayerCoinList({
            username: urlUser[urlUser.length - 1],
            ...appliedFilters,
          }),
        )
      } else {
        dispatch(
          getUserPublicNftList({
            username: urlUser[urlUser.length - 1],
            ...appliedFilters,
          }),
        )
      }
    }
  }, [appliedFilters])

  // useEffect(() => {
  //   TagManager.initialize(tagManagerArgs)
  //   const locationUrl = window.location.href
  //   const urlUser = locationUrl.split('/')
  //   // if (isLogged) {
  //   //   if (activeTab === 'players') {
  //   //     dispatch(getUserPlayerCoinList(appliedFilters))
  //   //   } else {
  //   //     dispatch(getUserNftList(appliedFilters))
  //   //   }
  //   // } else if (username) {
  //   //   if (activeTab === 'players') {
  //   //     dispatch(getUserPublicPlayerCoinList({ username, ...appliedFilters }))
  //   //   } else {
  //   //     dispatch(getUserPublicNftList({ username, ...appliedFilters }))
  //   //   }
  //   // }
  //   if (activeTab === 'players') {
  //     dispatch(
  //       getUserPublicPlayerCoinList({
  //         username: urlUser[urlUser.length - 1],
  //         ...appliedFilters,
  //       }),
  //     )
  //   } else {
  //     dispatch(
  //       getUserPublicNftList({
  //         username: urlUser[urlUser.length - 1],
  //         ...appliedFilters,
  //       }),
  //     )
  //   }
  // }, [activeTab])

  useEffect(() => {
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        if (!nextUserPlayerCoinListUrl) {
          setIsDeadEndPlayers(true)
          setUserPlayerCoinData(userPlayerCoinList)
        } else {
          const url_string = nextUserPlayerCoinListUrl
          const url = new URL(url_string)
          const obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
          if (appliedFilters.offset === obj.offset) {
            setIsDeadEndPlayers(true)
            setUserPlayerCoinData(userPlayerCoinList)
          } else {
            if (userPlayerCoinList.length === 0) {
              setIsDeadEndPlayers(true)
            }
            setUserPlayerCoinData([
              ...userPlayerCoinData,
              ...userPlayerCoinList,
            ])
          }
        }
      } else {
        if (userPlayerCoinList.length > 0 && isUserPlayerCoinListSuccess) {
          setUserPlayerCoinData([...userPlayerCoinData])
        } else if (
          userPlayerCoinList.length === 0 &&
          isUserPlayerCoinListSuccess
        ) {
          setIsDeadEndPlayers(true)
        }
      }
    } else {
      setUserPlayerCoinData(userPlayerCoinList)
    }
  }, [userPlayerCoinList])

  useEffect(() => {
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        if (!nextUserNftListUrl) {
          setIsDeadEndNft(true)
          setUserNftData(userNftList)
        } else {
          const url_string = nextUserNftListUrl
          const url = new URL(url_string)
          const obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
          if (appliedFilters.offset === obj.offset) {
            setIsDeadEndNft(true)
            setUserNftData(userNftList)
          } else {
            if (userNftList.length === 0) {
              setIsDeadEndNft(true)
            }
            setUserNftData([...userNftData, ...userNftList])
          }
        }
      } else {
        if (userNftList.length > 0 && isUserNftListSuccess) {
          setUserNftData([...userNftData, ...userNftList])
        } else if (userNftList.length === 0 && isUserNftListSuccess) {
          setIsDeadEndNft(true)
        }
      }
    } else {
      setUserNftData(userNftList)
    }
  }, [userNftList])

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
    // disable temporarily
    // if (head !== 'back') {
    //   const paginationParams = getUrlParams(
    //     nextUserPlayerCoinListUrl,
    //     'limit',
    //     'offset',
    //   )
    //   if (
    //     activeTab === 'players' &&
    //     nextUserPlayerCoinListUrl &&
    //     userPlayerCoinListCount
    //   ) {
    //     setIsDeadEndPlayers(false)
    //     setAppliedFilters({ ...appliedFilters, ...paginationParams })
    //   } else if (
    //     activeTab === 'NFT' &&
    //     nextUserNftListUrl &&
    //     userNftListCount
    //   ) {
    //     setIsDeadEndNft(false)
    //     setAppliedFilters({ ...appliedFilters, ...paginationParams })
    //   } else {
    //     setIsDeadEndPlayers(true)
    //     setIsDeadEndNft(true)
    //   }
    // }
  }

  const [step, setStep] = useState(1)
  const [hasTour, setHasTour] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const typedRef = useRef(null)
  const subTypedRef = useRef(null)
  useEffect(() => {
    if (hasTour) {
      document.body.style.overflow = 'hidden'
    }
  }, [hasTour])
  useEffect(() => {
    const brightAreaDiv = document.querySelector(
      '.bright-area',
    ) as HTMLDivElement | null
    if (brightAreaDiv) {
      brightAreaDiv?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [step])
  useEffect(() => {
    let typed = null
    if (hasTour) {
      setShowButton(false)

      let string = ''
      if (step === 1) {
        string = t('in_gold_displayed')
      } else if (step === 2) {
        string = t('the_wallet_address_is')
      } else if (step === 3) {
        string = t('review_each_traders')
      } else if (step === 4) {
        string = t('see_all_the_players')
      } else if (step === 5) {
        string = t('if_you_want_to_see')
        dispatch(setFixedFooter(true))
      }
      const options = {
        strings: [string],
        typeSpeed: 25,
        backSpeed: 30,
        loop: false,
        showCursor: false,
        onStringTyped: () => {
          if (step < 5) {
            setShowButton(true)
          } else {
            const subOptions = {
              strings: [t('click_scouts_now')],
              typeSpeed: 25,
              backSpeed: 30,
              loop: false,
              showCursor: false,
            }
            const subTyped = new Typed(subTypedRef.current, subOptions)
            return () => {
              subTyped.destroy()
            }
          }
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

  const handleVoid = () => console.log('')

  const handleNextTour = () => {
    dispatch(setFixedFooter(false))
    dispatch(setTourStep('scout'))
    navigate('/app/scouts')
  }

  return (
    <AppLayout headerStatus="header-status" headerClass="home">
      <div className="user-container">
        {userPublicProfile?.profile_visibility === 0 ? (
          // <div className="blog-title">
          //   {t('this profile is set to private')}
          // </div>
          <div style={{ margin: isMobile() ? '120px 0px' : '200px 0px' }}>
            {loader || isUserPublicProfileError ? (
              <UserCardSkeleton />
            ) : (
              <UserCard user={userPublicProfile} index={0} />
            )}

            <div className="user-summary-wrapper">
              <div className="user-summary-item fullwidth">
                <div className="private_profile">{t('Private Profile')}</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {loader || isUserPublicProfileError ? (
              <UserCardSkeleton />
            ) : (
              <UserCard user={userPublicProfile} index={0} />
            )}

            {hasTour && (
              <>
                <div className="dark-overlay"></div>
                <div className="bright-rectangle">
                  <div
                    className={classnames(
                      'wallet-description fade-in',
                      `user-screen-step${step}`,
                    )}
                  >
                    <b ref={typedRef}></b>
                    &nbsp;
                    <b className="fg-primary-color" ref={subTypedRef}></b>
                  </div>
                  {showButton && (
                    <div
                      className={classnames(
                        'continue-btn fade-in',
                        `user-screen-step${step}-btn`,
                      )}
                      onClick={() => setStep(step + 1)}
                    >
                      {t('continue')}
                    </div>
                  )}
                  {step === 5 && (
                    <div className="user-tour-wrapper">
                      <footer className={classnames('footer')}>
                        <div className="footer-wrapper">
                          <div className={classnames('home-icon')}>
                            <a>
                              <ImageComponent
                                loading="lazy"
                                src={Home}
                                alt=""
                                className="home-img"
                              />
                            </a>
                          </div>
                          <div className="footer-nav">
                            <FooterNav
                              onClickPlayer={handleVoid}
                              onClickMyCoin={handleVoid}
                              onClickNFTs={handleVoid}
                              onClickItems={handleVoid}
                              onClickScouts={handleNextTour}
                              onClickSignin={handleVoid}
                              onClickWallet={handleVoid}
                              showMyCoin={!!localStorage.getItem('showMyCoin')}
                            />
                          </div>
                        </div>
                      </footer>
                    </div>
                  )}
                </div>
              </>
            )}
            <div
              className={classnames(hasTour && step === 1 ? 'bright-area' : '')}
            >
              <XPProgressBar
                level={userPublicProfile?.lifetimelevel}
                nextLevelXp={userPublicProfile?.next_level_xp}
                currentXp={userPublicProfile?.xp}
                levelIncrement={userPublicProfile?.level_increment}
                index={1}
              />
            </div>
            <div
              className={classnames(
                'user-summary-wrapper',
                hasTour && step === 2 ? 'bright-area' : '',
              )}
            >
              <div className="user-summary-item fullwidth">
                <div className="user-summary-item-label caps">
                  {t('wallet address')}
                </div>
                {loader || isUserPublicProfileError ? (
                  <div className="user-summary-item-value-skeleton" />
                ) : (
                  <div className="user-summary-item-value-address">
                    <a
                      href={`${BASE_EXPLORE_URL}/address/${userPublicProfile?.wallet_address}`}
                      target="_blank"
                    >
                      {userPublicProfile?.wallet_address ??
                        '0x01d1878c01764Fb7F1ff960ba15c07F04444DE27'}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div
              className={classnames(
                'user-summary-wrapper',
                hasTour && step === 3 ? 'bright-area' : '',
              )}
            >
              {windowSize >= 700 ? (
                <>
                  <div className="user-summary-item">
                    <div className="user-summary-item-label caps">
                      {t('invested')}
                    </div>
                    {loader || isUserPublicProfileError ? (
                      <div className="user-summary-item-value-skeleton" />
                    ) : (
                      <div className="user-summary-item-value">
                        $
                        {toKPINumberFormat(
                          toUsd(
                            userPublicProfile?.invested,
                            userPublicProfile?.exchangeRateUSD?.rate,
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  <div className="user-summary-item">
                    <div className="user-summary-item-label caps">
                      {t('lifetime xp')}
                    </div>
                    {loader || isUserPublicProfileError ? (
                      <div className="user-summary-item-value-skeleton" />
                    ) : (
                      <div className="user-summary-item-value">
                        {toNumberFormat(
                          getFlooredFixed(
                            userPublicProfile?.lifetime_xp ?? 0,
                            0,
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  <div className="user-summary-item">
                    <div className="user-summary-item-label caps">
                      {t('Players')}
                    </div>
                    {loader || isUserPublicProfileError ? (
                      <div className="user-summary-item-value-skeleton" />
                    ) : (
                      <div className="user-summary-item-value">
                        {userPublicProfile?.total_player_coins ?? 0}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="user-summary-item">
                    <div className="user-summary-item-label caps">
                      {t('lifetime xp')}
                    </div>
                    {loader || isUserPublicProfileError ? (
                      <div className="user-summary-item-value-skeleton" />
                    ) : (
                      <div className="user-summary-item-value">
                        {toNumberFormat(
                          getFlooredFixed(
                            userPublicProfile?.lifetime_xp ?? 0,
                            0,
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  <div className="user-summary-row">
                    <div className="user-summary-item">
                      <div className="user-summary-item-label caps">
                        {t('invested')}
                      </div>
                      {loader || isUserPublicProfileError ? (
                        <div className="user-summary-item-value-skeleton" />
                      ) : (
                        <div className="user-summary-item-value">
                          $
                          {toKPINumberFormat(
                            toUsd(
                              userPublicProfile?.invested,
                              userPublicProfile?.exchangeRateUSD?.rate,
                            ),
                          )}
                        </div>
                      )}
                    </div>
                    <div className="user-summary-item">
                      <div className="user-summary-item-label caps">
                        {t('Players')}
                      </div>
                      {loader || isUserPublicProfileError ? (
                        <div className="user-summary-item-value-skeleton" />
                      ) : (
                        <div className="user-summary-item-value">
                          {userPublicProfile?.total_players_coins ?? 0}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className={classnames('players-list-option')}>
              {/* <div className="players-list-label">{t('player ownerships')}</div> */}
              <div className="players-list-label">
                <TabGroup
                  defaultTab={'players'}
                  tabSet={['players']}
                  getSwitchedTab={tab => setActiveTab(tab)}
                />
              </div>
              <div className="players-list-count-select">
                {t(isMobile() ? '' : 'show positions')}
                <select
                  className="dob-select"
                  onChange={e =>
                    setAppliedFilters({
                      ...appliedFilters,
                      limit: e.target.value,
                    })
                  }
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            <div
              className={classnames(
                'players-list-wrapper',
                hasTour && step === 4
                  ? 'bright-area no-pointer-area bg-dark-color'
                  : '',
              )}
            >
              {activeTab === 'players' ? (
                <>
                  {userPlayerCoinData.length === 0 &&
                  isUserPlayerCoinListSuccess ? (
                    <div className="black-box">
                      <div
                        className="blog-title"
                        style={{
                          color: '#f3b127',
                          fontSize: '50px',
                        }}
                      >
                        {t('no data found')}
                      </div>
                    </div>
                  ) : (userPlayerCoinData.length === 0 &&
                      loadingUserPlayerCoinList) ||
                    isUserPublicProfileError ? (
                    <div className="infinite-scroll-component ">
                      {new Array(windowSize > 1300 ? 10 : 5)
                        .fill(1)
                        .map((_: any, index: number) => (
                          <PlayerSkeletonItem key={index} />
                        ))}
                    </div>
                  ) : (
                    <>
                      <InfiniteScroll
                        dataLength={userPlayerCoinData.length}
                        next={() => handleJumpToPage('forth')}
                        hasMore={true}
                        scrollThreshold={0.5}
                        loader={
                          <></>
                          // !isDeadEndPlayers ? (
                          //   <>
                          //     {new Array(windowSize > 1300 ? 10 : 5)
                          //       .fill(1)
                          //       .map((_: any, index: number) => (
                          //         <PlayerSkeletonItem key={index} />
                          //       ))}
                          //   </>
                          // ) : null
                        }
                        endMessage={
                          <p style={{ textAlign: 'center' }}>
                            <b>. . .</b>
                          </p>
                        }
                      >
                        {userPlayerCoinData.map((item: any, index: number) =>
                          index < 1 ? (
                            <PlayerItem key={index} item={item} index={index} />
                          ) : (
                            <div
                              className={
                                hasTour && step === 4 ? 'dark-area' : ''
                              }
                            >
                              <PlayerItem
                                key={index}
                                item={item}
                                index={index}
                              />
                            </div>
                          ),
                        )}
                      </InfiniteScroll>
                    </>
                  )}
                </>
              ) : (
                <>
                  {userNftData.length === 0 && isUserNftListSuccess ? (
                    <div className="black-box">
                      <div
                        className="blog-title"
                        style={{
                          color: '#f3b127',
                          fontSize: '50px',
                        }}
                      >
                        {t('no data found')}
                      </div>
                    </div>
                  ) : (userNftData.length === 0 && loadingUserNftList) ||
                    isUserPublicProfileError ? (
                    <div
                      className={classnames(
                        'nft-line-ex',
                        isMobile()
                          ? 'nft-list-grid-mob mt-15'
                          : 'nft-list-grid',
                      )}
                    >
                      <div className={classnames('nft-column')}>
                        {new Array(6).fill(1).map((_: any, index: number) => {
                          return isMobile() ? (
                            <NftSkeletonMobile key={index} />
                          ) : (
                            <NftSkeleton key={index} />
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <>
                      <InfiniteScroll
                        dataLength={userNftData.length}
                        next={() => handleJumpToPage('forth')}
                        hasMore={true}
                        scrollThreshold={0.2}
                        className="infinite-nft-list-wrapper"
                        loader={
                          !isDeadEndNft ? (
                            <div
                              className={classnames(
                                'nft-line-ex',
                                isMobile()
                                  ? 'nft-list-grid-mob mt-15'
                                  : 'nft-list-grid',
                              )}
                              style={{
                                maxWidth:
                                  userNftData.length === 2 ? '350px' : 'unset',
                              }}
                            >
                              <div className={classnames('nft-column')}>
                                {new Array(6)
                                  .fill(1)
                                  .map((_: any, index: number) => {
                                    return isMobile() ? (
                                      <NftSkeletonMobile key={index} />
                                    ) : (
                                      <NftSkeleton key={index} />
                                    )
                                  })}
                              </div>
                            </div>
                          ) : null
                        }
                        endMessage={
                          <p style={{ textAlign: 'center' }}>
                            <b>. . .</b>
                          </p>
                        }
                      >
                        <div
                          className={classnames(
                            'nft-line-ex',
                            isMobile()
                              ? 'nft-list-grid-mob mt-15'
                              : 'nft-list-grid',
                          )}
                          style={{
                            maxWidth:
                              userNftData.length === 2 ? '350px' : 'unset',
                          }}
                        >
                          <div
                            className={classnames(
                              'nft-column',
                              userNftData.length === 1 ? 'no-gap' : '',
                              userNftData.length === 2 ? 'two-grid' : '',
                            )}
                          >
                            {userNftData.map((item: any, index: number) => {
                              return isMobile() ? (
                                <NftCardMobile
                                  nft={item}
                                  key={index}
                                  isNavigate={true}
                                />
                              ) : (
                                <NftCard
                                  nft={item}
                                  key={index}
                                  isNavigate={true}
                                />
                              )
                            })}
                          </div>
                        </div>
                      </InfiniteScroll>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="top-trades-section">
              <TopTradesForm showmore={true} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default User
