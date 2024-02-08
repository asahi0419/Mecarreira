/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppLayout } from '@components/index'
import TagManager from 'react-gtm-module'
import { THEME_COLORS, tagManagerArgs } from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  getFlooredFixed,
  initTagManager,
  isMobile,
  toNumberFormat,
} from '@utils/helpers'
import '@assets/css/pages/User.css'
import '@assets/css/pages/Seasons.css'
import UserCard from '@components/Card/UserCard'
import {
  claimPrize,
  getSeasonDetails,
  getSeasonPrize,
  getTourSeasonDetails,
} from '@root/apis/playerCoins/playerCoinsSlice'
import {
  getTourUserRankingList,
  getUserRankingList,
  resetUserRankingList,
} from '@root/apis/onboarding/authenticationSlice'
import InfiniteScroll from 'react-infinite-scroll-component'
import TabGroup from '@components/Page/TabGroup'
import NftCardMobile from '@components/Card/NftCardMobile'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'
import PlayerSkeletonItem from '@components/Card/PlayerSkeletonItem'
import ImageComponent from '@components/ImageComponent'
import Person from '@assets/images/person.png'
import Dollar from '@assets/images/dollars.png'
import Prize from '@assets/images/how_it_works4.webp'
import SearchBar from '@components/SearchBar'
import leftArrow from '@assets/images/left_angle_bracket.webp'
import rightArrow from '@assets/images/right_angle_bracket.webp'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import debounce from 'lodash.debounce'
import classNames from 'classnames'
import { ethers } from 'ethers'
import DialogBox from '@components/Dialog/DialogBox'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import { useLocation, useNavigate } from 'react-router-dom'
import Spinner from '@components/Spinner'
import {
  getRequest,
  makeGetRequest,
  makeGetRequestAdvance,
} from '@root/apis/axiosClient'
import { useWalletHelper } from '@utils/WalletHelper'
import InfoIcon from '@assets/icons/icon/infoIcon.svg'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import CloseIcon from '@assets/icons/icon/closeIcon.svg'
import Typed from 'typed.js'
import classnames from 'classnames'

const Seasons: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [userRankingData, setUserRankingData] = useState<any>([])
  const [userNftData, setUserNftData] = useState<any>([])
  const [activeTab, setActiveTab] = useState('in the money')
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [searchedTerm, setSearchedTerm] = useState<string | undefined>('')
  const [appliedFilters, setAppliedFilters] = useState<any>({
    offset: 0,
  })
  const [remainingTime, setRemainingTime] = useState(0)
  const [daysDuration, setDaysDuration] = useState(0)
  const [prizeAmount, setPrizeAmount] = useState('0.00')
  const [txnError, setTxnError] = useState('')
  const [txnHash, setTxnHash] = useState('')
  const [showBottomPopup, setShowBottomPopup] = useState(false)
  const [infoPop, setInfoPop] = useState(false)
  const [infoTitle, setInfoTitle] = useState('')
  const [infoContent, setInfoContent] = useState('')

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    loader,
    loadingUserRankingList,
    nextUserRankingListUrl,
    userRankingListCount,
    userRankingList,
    isUserRankingListSuccess,
    selectedThemeRedux,
    userNftList,
    nextUserNftListUrl,
    userNftListCount,
    isUserNftListSuccess,
    centralContract,
    centralContractAbi,
  } = authenticationData

  const playerCoinData: any = useSelector(
    (state: RootState) => state.playercoins,
  )
  const {
    season,
    hasSeasonPrev,
    hasSeasonNext,
    prevseasonid,
    nextseasonid,
    isGetSeasonDetailSuccess,
    seasonPrizeAmount,
    isGetSeasonPrizeSuccess,
  } = playerCoinData

  const { getWeb3Provider, callWeb3Method } = useWalletHelper()

  const [claimStatus, setClaimStatus] = useState('loading')

  let countDown: any = null
  const [state, setState] = useState({
    day: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const initCountDown = endTime => {
    clearInterval(countDown)
    countDown = setInterval(function () {
      const countDownDate = new Date(endTime * 1000).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now
      const day = ~~(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (distance < 0) {
        clearInterval(countDown)
        updateState({
          day: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        })
      } else {
        updateState({
          day,
          hours,
          minutes,
          seconds,
        })
      }
    }, 1000)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    // if (window.location.pathname.slice(8))
    // dispatch(getSeasonDetails(null))
    const pathSet = pathname.split('/')
    if (pathSet.length > 0) {
      const seasonId = pathSet[pathSet.length - 1]
      if (seasonId === 'tour-season') {
        dispatch(getTourSeasonDetails())
        dispatch(getTourUserRankingList())
        setHasTour(true)
      } else {
        dispatch(getSeasonDetails({ season_id: seasonId }))
        dispatch(getUserRankingList({ type: 'season', seasonid: seasonId }))
      }
      setClaimStatus('loading')
    }
    return () => {
      dispatch(getSeasonDetails(null))
      dispatch(resetUserRankingList())
      clearInterval(countDown)
    }
  }, [pathname])

  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')

  useEffect(() => {
    if (isGetSeasonDetailSuccess) {
      const countDownDate = new Date(season.end * 1000).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now
      if (distance > 0 || !nextseasonid) {
        initCountDown(season.end)
        setClaimStatus('countdown')
      } else {
        if (loginInfo) {
          if (isGetSeasonDetailSuccess && centralContract) {
            checkWinner()
          }
        } else if (loginId) {
          dispatch(getSeasonPrize(season?.season))
        } else {
          setClaimStatus('notwinner')
        }
      }
    }
  }, [isGetSeasonDetailSuccess, centralContract])

  useEffect(() => {
    if (isGetSeasonPrizeSuccess) {
      if (Number(seasonPrizeAmount) > 0) {
        setPrizeAmount(
          toNumberFormat(getFlooredFixed(Number(seasonPrizeAmount), 2)),
        )
        initCountDown(season.nextseasonend)
        setClaimStatus('winner')
      } else {
        setClaimStatus('notwinner')
      }
    }
  }, [isGetSeasonPrizeSuccess])

  const checkWinner = async () => {
    try {
      const provider = await getWeb3Provider()

      const generalContract = new ethers.Contract(
        centralContract, // contract address of Router
        centralContractAbi,
        provider.getSigner(loginInfo!), // signer of the currently logged in user wallet address
      )
      const amount = await generalContract.getSeasonPrizeWin(season?.season)
      if (Number(amount) > 0) {
        const result = await makeGetRequestAdvance(
          'wallets/get_matic_usd_exchange_rate',
        )
        const exchangeRate = result?.data?.data[0]?.rate
        setPrizeAmount(
          toNumberFormat(
            getFlooredFixed(
              Number(ethers.utils.formatUnits(amount, 18)) * exchangeRate,
              2,
            ),
          ),
        )
        initCountDown(season.nextseasonend)
        setClaimStatus('winner')
        return true
      } else {
        setClaimStatus('notwinner')
      }
    } catch (err: any) {
      console.log({ err })
    }
    return false
  }

  const handleClaim = () => {
    setShowBottomPopup(true)
    if (loginId) {
      return
    }
    if (loginInfo) {
      const promise = callWeb3Method(
        'withdrawPrize',
        centralContract,
        centralContractAbi,
        [season?.season],
      )
      promise
        .then((txn: any) => {
          setTxnHash(txn.hash)
        })
        .catch((err: any) => {
          const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
          if (err.message === '406') {
            setTxnError(t('this functionality unavailable for internal users'))
          }
          if (isErrorGasEstimation) {
            setTxnError(t('not enough funds to pay for blockchain transaction'))
          } else {
            setTxnError(err.reason || err.message)
          }
        })
    }
  }

  const handleClaimApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('user_secret', user_secret)
    formData.append('season_id', season?.season)
    dispatch(claimPrize(formData))
  }

  const minuteSeconds = 60
  const hourSeconds = minuteSeconds * 60
  const daySeconds = hourSeconds * 24

  const getTimeSeconds = time =>
    Math.ceil(minuteSeconds - time) > 1
      ? Math.ceil(minuteSeconds - time) - 1
      : Math.ceil(minuteSeconds - time)
  const getTimeMinutes = time =>
    Math.ceil(time / minuteSeconds) > 1
      ? Math.ceil(time / minuteSeconds) - 1
      : Math.ceil(time / minuteSeconds)
  const getTimeHours = time =>
    Math.ceil(time / hourSeconds) > 1
      ? Math.ceil(time / hourSeconds) - 1
      : Math.ceil(time / hourSeconds)
  const getTimeDays = time =>
    Math.ceil(time / daySeconds) > 1
      ? Math.ceil(time / daySeconds) - 1
      : Math.ceil(time / daySeconds)

  useEffect(() => {
    if (hasTour) {
      setRemainingTime(999999)
      setDaysDuration(Math.ceil(999999 / daySeconds) * daySeconds)
    } else if (season && season.end > Math.floor(Date.now() / 1000)) {
      const tempValue = season.end - Math.floor(Date.now() / 1000)
      setRemainingTime(tempValue)
      setDaysDuration(Math.ceil(tempValue / daySeconds) * daySeconds)
    }
  }, [season])

  useEffect(() => {
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    const pathSet = pathname.split('/')
    const seasonid = pathSet.length > 1 ? pathSet[pathSet.length - 1] : null
    if (appliedFilters?.limit || appliedFilters?.offset) {
      if (activeTab === 'in the money' || activeTab === 'ranking') {
        if (seasonid) {
          dispatch(
            getUserRankingList({
              type: 'season',
              seasonid,
              ...appliedFilters,
            }),
          )
        }
      }
    }
  }, [appliedFilters])

  // useEffect(() => {
  //   TagManager.initialize(tagManagerArgs)
  //   const pathSet = pathname.split('/')
  //   const seasonid = pathSet.length > 1 ? pathSet[pathSet.length - 1] : null
  //   if (activeTab === 'in the money' || activeTab === 'ranking') {
  //     if (seasonid) {
  //       dispatch(
  //         getUserRankingList({
  //           type: 'season',
  //           seasonid,
  //           ...appliedFilters,
  //         }),
  //       )
  //     }
  //   }
  // }, [activeTab])

  useEffect(() => {
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        if (!nextUserRankingListUrl) {
          setIsDeadEnd(true)
          setUserRankingData(userRankingList)
        } else {
          const url_string = nextUserRankingListUrl
          const url = new URL(url_string)
          const obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
          if (appliedFilters.offset === obj.offset) {
            setIsDeadEnd(true)
            setUserRankingData(userRankingList)
          } else {
            if (userRankingList.length === 0) {
              setIsDeadEnd(true)
            }
            setUserRankingData([...userRankingData, ...userRankingList])
          }
        }
      } else {
        if (userRankingList.length > 0 && isUserRankingListSuccess) {
          setUserRankingData([...userRankingData, ...userRankingList])
        } else if (userRankingList.length === 0 && isUserRankingListSuccess) {
          setIsDeadEnd(true)
        }
      }
    } else {
      setUserRankingData(userRankingList)
    }
  }, [userRankingList])

  useEffect(() => {
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        if (!nextUserNftListUrl) {
          setIsDeadEnd(true)
          setUserNftData(userNftList)
        } else {
          const url_string = nextUserNftListUrl
          const url = new URL(url_string)
          const obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
          if (appliedFilters.offset === obj.offset) {
            setIsDeadEnd(true)
            setUserNftData(userNftList)
          } else {
            if (userNftList.length === 0) {
              setIsDeadEnd(true)
            }
            setUserNftData([...userNftData, ...userNftList])
          }
        }
      } else {
        if (userNftList.length > 0 && isUserNftListSuccess) {
          setUserNftData([...userNftData, ...userNftList])
        } else if (userNftList.length === 0 && isUserNftListSuccess) {
          setIsDeadEnd(true)
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
    if (head !== 'back') {
      const paginationParams = getUrlParams(
        nextUserRankingListUrl,
        'limit',
        'offset',
      )
      if (
        activeTab === 'ranking' &&
        nextUserRankingListUrl &&
        userRankingListCount
      ) {
        setIsDeadEnd(false)
        setAppliedFilters({ ...appliedFilters, ...paginationParams })
      } else if (
        activeTab === 'NFT' &&
        nextUserNftListUrl &&
        userNftListCount
      ) {
        setIsDeadEnd(false)
        setAppliedFilters({ ...appliedFilters, ...paginationParams })
      } else {
        setIsDeadEnd(true)
      }
    }
  }

  const timerProps = {
    isPlaying: true,
    size:
      isMobile() || window.innerWidth <= 700
        ? 60
        : window.innerWidth > 1300
        ? 200
        : 110,
    strokeWidth: isMobile() ? 3 : 6,
  }

  const handlePrev = () => {
    if (season) {
      // dispatch(getSeasonDetails({ season_id: prevseasonid }))
      navigate('/app/season/' + prevseasonid)
    }
  }

  const handleNext = () => {
    if (season) {
      // dispatch(getSeasonDetails({ season_id: nextseasonid }))
      navigate('/app/season/' + nextseasonid)
    }
  }

  const handleSearch = (value: string | undefined) => {
    setUserRankingData([])
    setIsDeadEnd(false)
    setSearchedTerm(value)
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
    setUserRankingData([])
    setSearchedTerm('')
    const request: any = {
      limit: '10',
      offset: '0',
    }
    setAppliedFilters(request)
    setIsDeadEnd(false)
  }

  const handleClose = () => {
    if (txnHash) {
      if (loginInfo) {
        checkWinner()
      } else if (loginId) {
        dispatch(getSeasonPrize(season?.season))
      }
    }
    setShowBottomPopup(false)
    setTxnError('')
    setTxnHash('')
  }

  const handleClosePop = () => {
    setInfoPop(false)
  }

  const preventCloseOnClickOutside = event => {
    event.stopPropagation()
  }

  const handleInfoPopup = (title, content) => {
    setInfoTitle(title)
    setInfoContent(content)
    setInfoPop(true)
  }

  const [step, setStep] = useState(1)
  const [hasTour, setHasTour] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const typedRef = useRef(null)
  const subTypedRef = useRef(null)
  if (step === 1) {
    const season1 = document.querySelector(
      '.bright-area',
    ) as HTMLDivElement | null
    season1?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }
  useEffect(() => {
    if (hasTour) {
      document.body.style.overflow = 'hidden'
    }
  }, [hasTour])
  useEffect(() => {
    const brightAreaDiv = document.querySelector(
      '.bright-area',
    ) as HTMLDivElement | null
    const season4 = document.querySelector(
      '.bright-area.bg-dark-color',
    ) as HTMLDivElement | null
    const season5 = document.querySelector(
      '.bright-rectangle .season-screen-step5',
    ) as HTMLDivElement | null
    if (season4) {
      season4?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      return
    }
    if (season5) {
      season5?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
      return
    }
    if (brightAreaDiv) {
      brightAreaDiv?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }
  }, [step])
  useEffect(() => {
    let typed = null
    if (hasTour) {
      setShowButton(false)

      let string = ''
      if (step === 1) {
        string = t('each_season_has_deadline')
      } else if (step === 2) {
        string = t('the_prize_pool_is_money')
      } else if (step === 3) {
        string = t('participants_is_the_number')
      } else if (step === 4) {
        string = t('the_in_the_money_list')
      } else if (step === 5) {
        string = t('explore_trader_profiles')
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
              strings: [t('click_on_trader_now')],
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

  return (
    <AppLayout headerStatus="header-status" headerClass="home">
      {showBottomPopup && (
        <DialogBox
          isOpen={showBottomPopup}
          onClose={handleClose}
          contentClass="onboarding-popup"
        >
          <div className="nft-tab-title pt-50">{t('please wait')}...</div>
          {localStorage.getItem('loginInfo') ? (
            <Web3BottomPopup
              showPopup={showBottomPopup}
              txnHash={txnHash}
              txnErr={txnError}
              onClose={handleClose}
            />
          ) : (
            <ApiBottomPopup
              showPopup={showBottomPopup}
              onSubmit={handleClaimApi}
              onClose={handleClose}
              customClass="purchase-pc-bottomwrapper"
            />
          )}
        </DialogBox>
      )}

      {infoPop ? (
        <Modal
          open={infoPop}
          onClose={handleClosePop}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          BackdropProps={{ onClick: preventCloseOnClickOutside }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile() ? '90%' : '350px',
              bgcolor: THEME_COLORS[selectedThemeRedux]['PrimaryBackground'],
              border: 'none',
              outline: 'none',
              p: 4,
              borderRadius: '20px',
            }}
          >
            <ImageComponent
              onClick={handleClosePop}
              className="close_icon"
              src={CloseIcon}
              alt=""
            />
            <p
              style={{
                fontFamily: 'Rajdhani-regular',
                fontWeight: '400',
                fontSize: '24px',
              }}
            >
              {t(infoTitle)}
            </p>
            <p
              style={{
                fontFamily: 'Rajdhani-regular',
                fontWeight: '400',
                fontSize: '18px',
              }}
            >
              {t(infoContent)}
            </p>
          </Box>
        </Modal>
      ) : null}
      <div className="seasons-container">
        {hasTour && (
          <>
            <div className="dark-overlay"></div>
            <div className="bright-rectangle">
              <div
                className={classnames(
                  'wallet-description fade-in',
                  `season-screen-step${step}`,
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
                    `season-screen-step${step}-btn`,
                  )}
                  onClick={() => setStep(step + 1)}
                >
                  {t('continue')}
                </div>
              )}
            </div>
          </>
        )}
        {season ? (
          <div
            className="seasons-banner"
            style={{
              backgroundImage: `url('${
                isMobile() ? season?.bannermobile : season?.banner
              }')`,
            }}
          >
            {hasSeasonPrev ? (
              <div className="prev-btn" onClick={handlePrev}>
                <ImageComponent
                  src={leftArrow}
                  alt=""
                  className="img-radius carousel-arrow"
                  style={{ margin: '2px 5px 2px 0' }}
                />
              </div>
            ) : null}
            {hasSeasonNext ? (
              <div className="next-btn" onClick={handleNext}>
                <ImageComponent
                  src={rightArrow}
                  alt=""
                  className="img-radius carousel-arrow"
                  style={{ margin: '2px 0 2px 2px' }}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div id="season-banner-loader">
            <div
              className={classNames(
                'loading-spinner-container mb-40 mt-40 show',
              )}
            >
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            </div>
          </div>
        )}
        <div
          className={classnames(
            'seasons-countdown seasons-summary-wrapper',
            hasTour && step === 1 ? 'bright-area' : '',
          )}
        >
          <div className="seasons-summary-item fullwidth">
            {claimStatus === 'loading' ? (
              <div className="seasons-rewards-wrapper">
                <div className="seasons-rewards-content seasons-rewards-not-winner">
                  <Spinner spinnerStatus={true} />
                </div>
              </div>
            ) : claimStatus === 'claimed' ? (
              <div className="seasons-rewards-wrapper">
                <ImageComponent src={Prize} alt="" />
                <div className="seasons-rewards-content">
                  <div className="seasons-rewards-prize-value">
                    ${prizeAmount}
                  </div>
                  <div className="seasons-rewards-claim-text">
                    {t('already_claimed')}
                  </div>
                </div>
              </div>
            ) : claimStatus === 'winner' ? (
              <div className="seasons-rewards-wrapper">
                <ImageComponent src={Prize} alt="" />
                <div className="seasons-rewards-content">
                  <div className="seasons-rewards-prize-value">
                    ${prizeAmount}
                  </div>
                  <div
                    className="seasons-rewards-claim-btn"
                    onClick={handleClaim}
                  >
                    {' '}
                    {t('claim prize')}
                  </div>
                  <div className="seasons-rewards-time-left">
                    {' '}
                    {t('time left')}&nbsp;{state.day}d {state.hours}h{' '}
                    {state.minutes}m {state.seconds}s
                  </div>
                </div>
              </div>
            ) : claimStatus === 'notwinner' ? (
              <div className="seasons-rewards-wrapper">
                <div className="seasons-rewards-content seasons-rewards-not-winner">
                  {/* <div className="seasons-rewards-prize-value">
                    {t('prize per winner')} <b>${prizeAmount}</b>
                  </div> */}
                  <div className="seasons-rewards-lose-text">
                    {t(
                      'you did not make it to the winner pool or have already paid out',
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="season-coming-soon-time-card">
                <div className="timer">
                  <div className="time">
                    <CountdownCircleTimer
                      {...timerProps}
                      key={remainingTime}
                      colors={[
                        ['#9000ff', 0],
                        ['#3D9BE3', 1],
                      ]}
                      isLinearGradient={true}
                      trailColor={'#1A2B39'}
                      strokeWidth={5}
                      // trailStrokeWidth={3}
                      rotation={'counterclockwise'}
                      duration={daySeconds * 30}
                      initialRemainingTime={remainingTime}
                    >
                      {({ elapsedTime }) => (
                        <>
                          {' '}
                          {getTimeDays(daySeconds * 30 - (elapsedTime ?? 0))}
                        </>
                      )}
                    </CountdownCircleTimer>
                  </div>
                  <div className="heading">{t('days')}</div>
                </div>
                <div className="timer">
                  <div className="time">
                    <CountdownCircleTimer
                      {...timerProps}
                      key={remainingTime}
                      colors={[
                        ['#9000ff', 0],
                        ['#3D9BE3', 1],
                      ]}
                      isLinearGradient={true}
                      trailColor={'#1A2B39'}
                      strokeWidth={5}
                      // trailStrokeWidth={3}
                      rotation={'counterclockwise'}
                      duration={daySeconds}
                      initialRemainingTime={remainingTime % daySeconds}
                      onComplete={totalElapsedTime => [
                        remainingTime - totalElapsedTime > hourSeconds,
                        0,
                      ]}
                    >
                      {({ elapsedTime }) => (
                        <> {getTimeHours(daySeconds - (elapsedTime ?? 0))}</>
                      )}
                    </CountdownCircleTimer>
                  </div>
                  <div className="heading">{t('hours')}</div>
                </div>
                <div className="timer">
                  <div className="time">
                    <CountdownCircleTimer
                      {...timerProps}
                      key={remainingTime}
                      colors={[
                        ['#9000ff', 0],
                        ['#3D9BE3', 1],
                      ]}
                      isLinearGradient={true}
                      trailColor={'#1A2B39'}
                      strokeWidth={5}
                      // trailStrokeWidth={3}
                      rotation={'counterclockwise'}
                      duration={hourSeconds}
                      initialRemainingTime={remainingTime % hourSeconds}
                      onComplete={totalElapsedTime => [
                        remainingTime - totalElapsedTime > minuteSeconds,
                        0,
                      ]}
                    >
                      {({ elapsedTime }) => (
                        <> {getTimeMinutes(hourSeconds - (elapsedTime ?? 0))}</>
                      )}
                    </CountdownCircleTimer>
                  </div>
                  <div className="heading">{t('minutes')}</div>
                </div>
                <div className="timer">
                  <div className="time">
                    <CountdownCircleTimer
                      {...timerProps}
                      key={remainingTime}
                      colors={[
                        ['#9000ff', 0],
                        ['#3D9BE3', 1],
                      ]}
                      isLinearGradient={true}
                      trailColor={'#1A2B39'}
                      strokeWidth={5}
                      // trailStrokeWidth={3}
                      rotation={'counterclockwise'}
                      duration={minuteSeconds}
                      initialRemainingTime={remainingTime % minuteSeconds}
                      onComplete={totalElapsedTime => [
                        remainingTime - totalElapsedTime > 0,
                        0,
                      ]}
                    >
                      {({ elapsedTime }) => <> {getTimeSeconds(elapsedTime)}</>}
                    </CountdownCircleTimer>
                  </div>
                  <div className="heading">{t('seconds')}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="seasons-kpi-wrapper seasons-summary-wrapper">
          <div
            className={classnames(
              'seasons-summary-item',
              hasTour && step === 2 ? 'bright-area' : '',
            )}
          >
            <div className={classnames('seasons-summary-item-label caps')}>
              {t('prize pool live')}
              <ImageComponent
                src={InfoIcon}
                alt=""
                onClick={() =>
                  handleInfoPopup('prize pool live', 'prize_pool_live_info')
                }
              />
            </div>
            {loader || !season ? (
              <div className="seasons-summary-item-value-skeleton" />
            ) : (
              <div className="seasons-summary-item-value">
                $
                {/* {getFlooredFixed(
                  userProfile?.total_trading_volume_matic ?? 0,
                  0,
                )} */}
                {parseFloat(
                  getFlooredFixed(season?.prizepool, 2),
                ).toLocaleString()}
              </div>
            )}
          </div>
          {window.innerWidth <= 700 ? (
            <div
              className={classnames(
                'seasons-summary-item-wrapper',
                hasTour && step === 3 ? 'bright-area' : '',
              )}
            >
              <div className="seasons-summary-item">
                <div className="seasons-summary-item-label caps">
                  {t('participants')}
                  <ImageComponent
                    src={InfoIcon}
                    alt=""
                    onClick={() =>
                      handleInfoPopup('participants', 'participants_info')
                    }
                  />
                </div>
                {loader || !season ? (
                  <div className="seasons-summary-item-value-skeleton" />
                ) : (
                  <div className="seasons-summary-item-value">
                    <ImageComponent
                      src={Person}
                      alt=""
                      title={t('prize_pool_live_info')}
                    />
                    &nbsp;
                    {season?.totalparticipant}
                  </div>
                )}
              </div>
              <div className="seasons-summary-item">
                <div className="seasons-summary-item-label caps">
                  {t('paid')}
                  <ImageComponent
                    src={InfoIcon}
                    alt=""
                    onClick={() => handleInfoPopup('paid', 'paid_info')}
                  />
                </div>
                {loader || !season ? (
                  <div className="seasons-summary-item-value-skeleton" />
                ) : (
                  <div className="seasons-summary-item-value">
                    <ImageComponent src={Dollar} alt="" />
                    &nbsp;
                    {season?.paidscouts}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div
                className={classnames(
                  'seasons-summary-item',
                  hasTour && step === 3 ? 'bright-area' : '',
                )}
              >
                <div className="seasons-summary-item-label caps">
                  {t('participants')}
                  <ImageComponent
                    src={InfoIcon}
                    alt=""
                    onClick={() =>
                      handleInfoPopup('participants', 'participants_info')
                    }
                  />
                </div>
                {loader || !season ? (
                  <div className="seasons-summary-item-value-skeleton" />
                ) : (
                  <div className="seasons-summary-item-value">
                    <ImageComponent src={Person} alt="" />
                    &nbsp;
                    {season?.totalparticipant}
                  </div>
                )}
              </div>
              <div
                className={classnames(
                  'seasons-summary-item',
                  hasTour && step === 3 ? 'bright-area' : '',
                )}
              >
                <div className="seasons-summary-item-label caps">
                  {t('paid')}
                  <ImageComponent
                    src={InfoIcon}
                    alt=""
                    onClick={() => handleInfoPopup('paid', 'paid_info')}
                  />
                </div>
                {loader || !season ? (
                  <div className="seasons-summary-item-value-skeleton" />
                ) : (
                  <div className="seasons-summary-item-value">
                    <ImageComponent src={Dollar} alt="" />
                    &nbsp;
                    {season?.paidscouts}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div
          className={classNames(
            hasTour && step >= 4 ? 'bright-area bg-dark-color' : '',
            hasTour && step < 5 ? 'no-pointer-area' : '',
          )}
        >
          <div className={classnames('players-list-option')}>
            {/* <div className="players-list-label">{t('player ownerships')}</div> */}
            <div className="players-list-label">
              <TabGroup
                defaultTab={'in the money'}
                tabSet={['in the money', 'ranking', 'stats']}
                getSwitchedTab={tab => setActiveTab(tab)}
              />
            </div>
            <div className="players-list-count-select">
              <SearchBar
                isFilterDisabled={true}
                mode={''}
                onEdit={optimizedHandleSearch}
                onClose={handleReset}
                onSearchEnabled={option => setSearchEnabled(option)}
              />
              {!searchEnabled && (
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
              )}
            </div>
          </div>
          <div
            className={classNames(
              activeTab === 'ranking'
                ? 'players-list-wrapper'
                : 'full-user-list-wrapper',
            )}
          >
            {activeTab === 'in the money' || activeTab === 'ranking' ? (
              <>
                {userRankingData.length === 0 && isUserRankingListSuccess ? (
                  <div className="blog-title" style={{ margin: 'auto' }}>
                    {t('no data found')}
                  </div>
                ) : userRankingData.length === 0 && loadingUserRankingList ? (
                  <>
                    {new Array(window.innerWidth > 1300 ? 10 : 5)
                      .fill(1)
                      .map((_: any, index: number) => (
                        <PlayerSkeletonItem key={index} />
                      ))}
                  </>
                ) : activeTab === 'ranking' ? (
                  <>
                    <InfiniteScroll
                      dataLength={userRankingData.length}
                      next={() => handleJumpToPage('forth')}
                      hasMore={true}
                      scrollThreshold={0.5}
                      loader={
                        !isDeadEnd ? (
                          <>
                            {new Array(window.innerWidth > 1300 ? 10 : 5)
                              .fill(1)
                              .map((_: any, index: number) => (
                                <PlayerSkeletonItem key={index} />
                              ))}
                          </>
                        ) : null
                      }
                      endMessage={
                        <p style={{ textAlign: 'center' }}>
                          <b>. . .</b>
                        </p>
                      }
                    >
                      {userRankingData.map((item: any, index: number) => (
                        <UserCard
                          user={item}
                          index={index + 1}
                          paidCount={season?.paidscouts}
                          key={index}
                        />
                      ))}
                    </InfiniteScroll>
                  </>
                ) : (
                  <>
                    {userRankingData
                      .slice(0, 10)
                      .map((item: any, index: number) =>
                        index < 2 ? (
                          <UserCard
                            user={item}
                            index={index + 1}
                            paidCount={season?.paidscouts}
                            key={index}
                            hasTour={hasTour && step === 5}
                          />
                        ) : (
                          <div
                            className={hasTour && step >= 4 ? 'dark-area' : ''}
                          >
                            <UserCard
                              user={item}
                              index={index + 1}
                              paidCount={season?.paidscouts}
                              key={index}
                            />
                          </div>
                        ),
                      )}
                  </>
                )}
              </>
            ) : (
              <>
                <p className="blog-title" style={{ margin: 'auto' }}>
                  {t('coming soon')}
                </p>
                {/* {userNftData.length === 0 && isUserNftListSuccess ? (
                  <div className="blog-title">{t('no data found')}</div>
                ) : userNftData.length === 0 && loadingUserNftList ? (
                  <div className="nft-list-grid-mob">
                    {new Array(6).fill(1).map((_: any, index: number) => (
                      <NftSkeletonMobile key={index} />
                    ))}
                  </div>
                ) : (
                  <>
                    <InfiniteScroll
                      dataLength={userNftData.length}
                      next={() => handleJumpToPage('forth')}
                      hasMore={true}
                      scrollThreshold={0.5}
                      loader={
                        !isDeadEnd ? (
                          <>
                            {new Array(5).fill(1).map((_: any, index: number) => (
                              <NftSkeletonMobile key={index} />
                            ))}
                          </>
                        ) : null
                      }
                      endMessage={
                        <p style={{ textAlign: 'center' }}>
                          <b>. . .</b>
                        </p>
                      }
                    >
                      <div className="nft-list-grid-mob">
                        {userNftData.map((item: any, index: number) => (
                          <NftCardMobile
                            nft={item}
                            key={index}
                            isNavigate={true}
                          />
                        ))}
                      </div>
                    </InfiniteScroll>
                  </>
                )} */}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Seasons
