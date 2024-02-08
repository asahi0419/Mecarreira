import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SubmitButton from '@components/Button/SubmitButton'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import classnames from 'classnames'
import ArrowDownFilled from '@components/Svg/ArrowDownFilled'
import ArrowUpFilled from '@components/Svg/ArrowUpFilled'
import TooltipLabel from '@components/TooltipLabel'
import {
  convertToFixed,
  getCircleColor,
  getCountryCodeNew,
  getCountryName,
  getFlooredFixed,
  getFlooredNumber,
  getPlayerLevelClassName,
} from '@utils/helpers'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import 'flag-icons/css/flag-icons.min.css'
import {
  postWatchList,
  postPlayerImage,
  showSignupForm,
  getCheckWatchList,
  resetPostWatchList,
  showLatestTrade,
  showPlayerShareXp,
  getPlayerShares,
  showStakingForm,
  setTourCategories,
  setTourCategoryId,
} from '../../../apis/onboarding/authenticationSlice'
import { useNavigate } from 'react-router'
import { isMobile } from '@utils/helpers'
import ShareIcon from '../../../assets/icons/icon/shareIcon.svg'
import ShareIconBlack from '../../../assets/icons/icon/ShareIconBlack.svg'
import * as htmlToImage from 'html-to-image'
import { ShareSocial } from 'react-share-social'
import DialogBox from '@components/Dialog/DialogBox'
import NewShareCard from '@components/Card/NewShareCard'
import $ from 'jquery'
import PlayerImageProfile from './components/PlayerImageProfile'
import ImageComponent from '@components/ImageComponent'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Instagram from '@components/Svg/Instagram'
import CopyIcon from '@components/Svg/CopyIcon'
import DownloadIcon from '@components/Svg/DownloadIcon'
import YoutubeIcon from '@components/Svg/YoutubeIcon'
import FanClubToast from './components/FanClubToast'
import Spinner from '@components/Spinner'
import { useParams } from 'react-router-dom'
import Typed from 'typed.js'
import TradeTourSell from '@pages/Tour/TradeTourSell'
import StakingTour from '@pages/Tour/StakingTour'
import { postRequestAuth } from '@root/apis/axiosClientAuth'
interface Props {
  isInitial: boolean
  card: any //CardProps
  disabledPlayer?: any
  onBuy: any
  onStake: any
  onSell: any
  onChartView: any
  isPlayerNotLaunched: boolean
  launchDate: any
  marketCap: any
  prevData: any
  draftedBy: any
}

const PlayerInfo: React.FC<Props> = ({
  card,
  launchDate = 0,
  disabledPlayer,
  onBuy,
  onStake,
  onSell,
  onChartView,
  isPlayerNotLaunched,
  prevData,
  draftedBy = [],
}) => {
  const [screenShot, setScreenShot] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const usdRef = useRef<any>(null)
  const percentageRef = useRef<any>(null)
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { getPlayerDetailsSuccessData, fetchBalancePlayersData } =
    playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const dispatch = useDispatch()
  const {
    countriesData,
    selectedThemeRedux,
    checkWatchListLoader,
    checkWatchListSuccess,
    watchListDataSuccess,
    watchListLoader,
    watchListSuccess,
    playerShareLoader,
    playerShareHold,
    playerShareStaked,
    tourStep,
    tourCategories,
  } = authenticationData
  const node = document.getElementById('player_card')

  const getYouOwn = () => {
    if (playerShareHold + playerShareStaked >= card?.coin_issued) {
      return '100.000'
    }
    const percentage =
      ((playerShareHold + playerShareStaked) / card?.coin_issued) * 100
    return percentage.toFixed(3)
  }
  const styleShare = {
    root: {
      width: '40%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'auto',
      height: '60px',
      padding: '5px',
      background: 'transparent',
      borderRadius: 3,
      border: 0,
      color: 'white',
    },
    copyContainer: {
      display: 'none',
      border: '1px solid blue',
      background: 'rgb(0,0,0,0.7)',
    },
    title: {
      color: 'aquamarine',
      fontStyle: 'italic',
    },
  }

  const onButtonClick = () => {
    if (!isMobile()) {
      setInfoPop(true)
    } else {
      setShareLoading(true)
    }
    setTimeout(() => {
      node &&
        htmlToImage
          .toPng(node)
          .then(function (dataUrl) {
            const img = new Image()
            img.src = dataUrl
            if (isMobile()) {
              const reqParams = {
                detailpageurl: window.location.pathname.slice(8),
                playercard: dataUrl,
                playerName: card?.name,
                playerLink: `${
                  window.location.origin
                }/player/share/${window.location.pathname.slice(8)}`,
              }
              dispatch(postPlayerImage(reqParams))
              navigate('/app/player-share')
            } else {
              setPlayerCardImg(dataUrl)
              setScreenShot(true)
              const reqParams = {
                detailpageurl: window.location.pathname.slice(8),
                playercard: dataUrl,
              }
              dispatch(postPlayerImage(reqParams))
            }
            try {
              $(`meta[name=og\\:image]`).attr(
                `content`,
                'https://restapi.mecarreira.com/meCarreira_backend/media/output_lm1jn43.webp',
              )
            } catch (error) {
              console.log(error)
            }
          })
          .catch(function (error) {
            console.error('oops, something wents wrong!', error)
          })
    }, 3000)
  }

  const onButtonDownload = () => {
    setTimeout(() => {
      node &&
        htmlToImage
          .toPng(node)
          .then(dataUrl => {
            const link = document.createElement('a')
            link.download = `${card?.name}.webp`
            link.href = dataUrl
            link.click()
          })
          .catch(err => {
            console.log(err)
          })
    }, 3000)
  }

  const [infoPop, setInfoPop] = useState(false)

  const handleClosePop = () => {
    setInfoPop(false)
    setScreenShot(false)
  }
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const profitStyle = 'profit'
  const lossStyle = 'loss'
  const { stakingBalance } = useSelector(
    (state: RootState) => state.playercoins,
  )
  const [isAddressCopied, setAddressCopied] = useState(false)
  const [playerCardImg, setPlayerCardImg] = useState('')

  const handleCopy = () => {
    setAddressCopied(!isAddressCopied)
    navigator.clipboard.writeText(
      `${window.location.origin}/player/share/${window.location.pathname.slice(
        8,
      )}` ?? 's',
    )
  }

  const getUsdValue = (playerData: any) => {
    const { matic, exchangeRateUSD } = playerData
    const usdNow = matic * exchangeRateUSD['rate']
    const usdOld = playerData['24h_change'] * exchangeRateUSD['24h_rate']
    return {
      usdOld: !isNaN(usdOld) ? usdOld : 0.0,
      usdNow: !isNaN(usdNow) ? usdNow : 0.0,
    }
  }

  const getMarketValue = (matic: number, rate: number, coinsIssued: number) => {
    const currency = matic * rate
    return coinsIssued * currency
  }

  const showMessage = (action: string) => {
    if (action === 'stake') {
      toast.error(t('only pro player can stake'))
    } else if (card?.playerstatusid?.id === 5 || card?.playerlevelid === 5) {
      toast.error(t('pro player trading not available'))
    } else {
      toast.error(t('player coin is not launched'))
    }
  }

  const handleTransfermarkt = () => {
    window.open(
      (card?.transfermarkt_link.includes('https') ? '' : 'https://') +
        card?.transfermarkt_link,
      '_blank',
    )
  }

  const getHumanDate = (date: any) => {
    const unixDate: any = new Date(date * 1000)
    let day = unixDate.getDate()
    let month = unixDate.getMonth() + 1
    const year = unixDate.getFullYear()
    if (day < 10) day = '0' + day
    if (month < 10) month = '0' + month

    return day + '.' + month + '.' + year
  }

  const onBtnClick = (id: number, action: string) => {
    if (hasTour) {
      setTourInternal(true)
      return
    }
    // if (
    //   (card?.playerstatusid?.id === 4 && action === 'stake') ||
    //   card?.playerstatusid?.id < 4
    // ) {
    //   if (!loginInfo && !loginId) {
    //     dispatch(showSignupForm())
    //     return
    //   } else {
    //     showMessage(action)
    //   }
    // } else {
    //   if (action === 'buy') {
    //     onBuy()
    //   } else if (action === 'sell') {
    //     onSell()
    //   } else if (action === 'stake') {
    //     onStake()
    //   }
    // }

    if (!loginInfo && !loginId) {
      dispatch(showSignupForm())
      return
    } else {
      if (action === 'buy') {
        onBuy()
      } else if (action === 'sell') {
        onSell()
      } else if (action === 'stake') {
        onStake()
        // if (fetchBalancePlayersData?.matic >= 0.05) {
        //   onStake()
        // } else {
        //   toast.error(t('Insufficient Matic for gas price'))
        // }
      }
    }
  }

  const gotoPlayer = (event: any) => {
    event.stopPropagation()
    navigate(`/app/player/${draftedBy[0]?.detailpageurl}`)
  }

  useEffect(() => {
    handleUsdAnimation()
    handlePercentageAnimation()
  }, [card])

  const handleUsdAnimation = () => {
    if (usdRef?.current?.classList[1] === 'profit') {
      usdRef?.current?.classList.remove('profit')
    } else if (usdRef?.current?.classList[1] === 'loss') {
      usdRef?.current?.classList.remove('loss')
    }
    // setTimeout(() => {
    //   if (getUsdValue(card).usdNow > getUsdValue(card).usdOld) {
    //     usdRef?.current?.classList.add('profit')
    //     if (usdRef?.current) {
    //       usdRef.current.style.color = 'var(--profit-color)'
    //     }
    //   } else if (card?.matic < card['24h_change']) {
    //     usdRef?.current?.classList.add('loss')
    //     if (usdRef?.current) {
    //       usdRef.current.style.color = 'var(--loss-color)'
    //     }
    //   }
    // }, 500)
  }

  const handlePercentageAnimation = () => {
    if (percentageRef?.current?.classList[1] === 'profit') {
      percentageRef?.current?.classList.remove('profit')
    } else if (percentageRef?.current?.classList[1] === 'loss') {
      percentageRef?.current?.classList.remove('loss')
    }
    setTimeout(() => {
      if (
        getPercentageEstimate(card).oldNumber <=
        getPercentageEstimate(card).newNumber
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

  const getPercentageEstimate = (player: any) => {
    // console.log({ player }) // player here is response of players/player-detailpage API
    // const oldNumber = player['24h_change'] * player?.exchangeRateUSD['24h_rate'] // older value is percentage value before next ticker update
    // const newNumber = player['matic'] * player?.exchangeRateUSD['rate'] // newer value is percentage value after ticker update
    // console.log(
    //   'oldNumber = player[`24h_change`] * player?.exchangeRateUSD[`24h_rate`]',
    //   oldNumber,
    // )
    // console.log(
    //   'newNumber = player[`matic`] * player?.exchangeRateUSD[`24h_rate`]',
    //   newNumber,
    // )
    // const decreaseValue = oldNumber - newNumber
    // console.log('decreaseValue = oldNumber - newNumber', decreaseValue)
    // const percentage = (Math.abs(decreaseValue) / oldNumber) * 100
    // console.log('percentage = (decreaseValue / oldNumber) * 100', percentage)
    // return {
    //   oldNumber,
    //   newNumber,
    //   percentage: isFinite(percentage) ? percentage : 0.0,
    // }

    // ============================ AFTER ALEX's FORMULA IMPLEMENTATION ============================

    // (todayPriceUSD / 24hPriceUSD - 1) * 100
    const todayPriceUSD = player['matic'] * player?.exchangeRateUSD['rate']
    const _24hPriceUSD =
      player['24h_change'] * player?.exchangeRateUSD['24h_rate']
    const percentage = (todayPriceUSD / _24hPriceUSD - 1) * 100
    // console.log(
    //   'todayPriceUSD = player[`matic`] * player?.exchangeRateUSD[`rate`] ;',
    //   todayPriceUSD,
    // )
    // console.log(
    //   '_24hPriceUSD = player[`24h_change`] * player?.exchangeRateUSD[`24h_rate`] ;',
    //   todayPriceUSD,
    // )
    // console.log(
    //   'percentage = (todayPriceUSD / _24hPriceUSD - 1) * 100 ;',
    //   percentage,
    // )
    return {
      oldNumber: _24hPriceUSD,
      newNumber: todayPriceUSD,
      percentage: isFinite(percentage) ? Math.abs(percentage) : 0.0,
    }
  }

  useEffect(() => {
    if (watchListSuccess) {
      toast.success(`${watchListSuccess}`, {
        duration: 1000,
      })
      dispatch(resetPostWatchList())
    }
  }, [watchListSuccess])
  useEffect(() => {
    if (watchListDataSuccess === true && (loginInfo || loginId)) {
      dispatch(getCheckWatchList(card?.detailpageurl))
    }
  }, [watchListDataSuccess])
  const onAddWatchList = () => {
    if (loginId || loginInfo) {
      const formData = new FormData()
      formData.append('playerid', card?.id)
      formData.append('watchlist', true)
      dispatch(postWatchList(formData))
    } else {
      toast.error(t('login_to_add_to_watchlist'))
    }
  }
  const onRemoveWatchList = () => {
    if (loginId || loginInfo) {
      const formData = new FormData()
      formData.append('playerid', card?.id)
      formData.append('watchlist', false)
      dispatch(postWatchList(formData))
    } else {
      toast.error(t('Connect / Login to add to watchlist'))
    }
  }

  const handleOpenPlayerShareXp = () => {
    if (playerShareStaked > 0) {
      dispatch(showPlayerShareXp({ showPlayerShareXpValue: true }))
    } else {
      dispatch(
        showStakingForm({
          playerData: getPlayerDetailsSuccessData,
        }),
      )
    }
  }

  useEffect(() => {
    if (getPlayerDetailsSuccessData?.playercontract && (loginInfo || loginId)) {
      dispatch(
        getPlayerShares({
          playerContract: getPlayerDetailsSuccessData?.playercontract,
        }),
      )
    }
  }, [getPlayerDetailsSuccessData?.playercontract])

  const nameLength = isMobile() ? 20 : 25
  const [state, setState] = useState({
    day: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const initCountDown = () => {
    setInterval(function () {
      const countDownDate = new Date(
        card?.subscriptionstartdate * 1000,
      ).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now

      const day = ~~(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      updateState({
        day,
        hours,
        minutes,
        seconds,
      })
    }, 1000)
  }

  const { id } = useParams()
  const playerUrl = id
  const [step, setStep] = useState(1)
  const [hasTour, setHasTour] = useState(false)
  const [tourInternal, setTourInternal] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (isPlayerNotLaunched && card?.subscriptionstartdate > 0) {
      initCountDown()
    }
    setTimeout(() => setInitialLoading(false), 3000)
    if (playerUrl === 'tour-player') {
      if (!tourStep) {
        navigate('/app')
      }
      setHasTour(true)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const typedRef = useRef(null)
  const subTypedRef = useRef(null)

  useEffect(() => {
    let typed = null
    if (hasTour) {
      setShowButton(false)
      let string = ''
      if (tourStep === 'staking') {
        string = t('staking_tokens_is_locking')
      } else if (step === 1) {
        string = t('you_can_sell_your_player_tokens')
      } else if (step === 2) {
        string = t('click_on_sell')
      }
      const options = {
        strings: [string],
        typeSpeed: 25,
        backSpeed: 30,
        loop: false,
        showCursor: false,
        onStringTyped: () => {
          if (tourStep === 'staking') {
            const subOptions = {
              strings: [t('click_on_stake')],
              typeSpeed: 25,
              backSpeed: 30,
              loop: false,
              showCursor: false,
            }
            const subTyped = new Typed(subTypedRef.current, subOptions)
            return () => {
              subTyped.destroy()
            }
          } else if (step === 1) {
            setShowButton(true)
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

  const handleTourComplete = async () => {
    // FYI need to integrate api to send completion state
    try {
      await postRequestAuth('accounts/wallet_app_tour_categories/', {
        categoryId: tourStep === 'sell' ? 2 : 4,
      })
    } catch (error) {
      console.log(error)
    }
    dispatch(
      setTourCategories({
        ...tourCategories,
        [tourStep === 'sell' ? 2 : 4]: true,
      }),
    )
    dispatch(setTourCategoryId(0))
    navigate('/app')
  }

  return (
    <>
      <div
        id="player_card"
        style={{ position: 'absolute', top: '0px', zIndex: '-100000' }}
      >
        <NewShareCard
          card={getPlayerDetailsSuccessData}
          onBuy={() => console.log('')}
          onSell={() => console.log('')}
          playercardjson={getPlayerDetailsSuccessData?.playercardjson}
        />
      </div>
      <HotToaster />
      <div
        className={classnames(
          'player-card',
          isPlayerNotLaunched && !isMobile() ? 'player-card-coming-soon' : '',
        )}
      >
        <div className="fixed-content">
          <div style={{ position: 'relative' }}>
            <div className="player-extend-buttons">
              <div
                className="chart-view-button"
                onClick={disabledPlayer ? showMessage : onChartView}
              ></div>
              {!shareLoading ? (
                <div
                  className="share_wrapper"
                  onClick={() => {
                    onButtonClick()
                  }}
                >
                  <ImageComponent
                    className="share_icon"
                    src={
                      selectedThemeRedux === 'Black'
                        ? ShareIconBlack
                        : ShareIcon
                    }
                    alt=""
                  />
                </div>
              ) : (
                <div
                  className={classnames('share_wrapper_spinner spinner')}
                  style={{ right: isMobile() ? '1.5%' : '-1.5%' }}
                ></div>
              )}
              {checkWatchListLoader || watchListLoader ? (
                <div
                  className={classnames('star_wrapper_spinner spinner')}
                ></div>
              ) : checkWatchListSuccess ? (
                <TooltipLabel title={t('remove_player_from_watchlist')}>
                  <div
                    className="star_wrapper"
                    onClick={() => {
                      onRemoveWatchList()
                    }}
                  >
                    {/* <StarIcon className="star_icon" /> */}
                    <VisibilityIcon className="watchlist-btn" />
                  </div>
                </TooltipLabel>
              ) : (
                <TooltipLabel title={t('add_player_to_watchlist')}>
                  <div
                    className="star_wrapper inactive"
                    onClick={() => {
                      onAddWatchList()
                    }}
                  >
                    {/* <StarBorderIcon className="star_icon" /> */}
                    <VisibilityIcon
                      className="watchlist-btn"
                      // onClick={toggleVisibility}
                    />
                  </div>
                </TooltipLabel>
              )}
              {playerShareHold > 0 && (loginInfo || loginId) ? (
                <div
                  className="custom-btn_XP"
                  onClick={handleOpenPlayerShareXp}
                >
                  {/* <b>XP</b> */}
                </div>
              ) : null}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="social_icons_container">
              {card?.transfermarkt_link && (
                <div
                  className="transfermarkt-button"
                  onClick={handleTransfermarkt}
                ></div>
              )}
              {getPlayerDetailsSuccessData?.instagram !== null ? (
                <div
                  className="icons_container"
                  onClick={() => {
                    window
                      ?.open(getPlayerDetailsSuccessData?.instagram, '_blank')
                      ?.focus()
                  }}
                >
                  <div className="social_media_icons_profile svg-primary-color">
                    <Instagram />
                  </div>
                  <span className="followers">
                    {getPlayerDetailsSuccessData?.instagramfollowers !== null &&
                    getPlayerDetailsSuccessData?.instagramfollowers !== '0'
                      ? getPlayerDetailsSuccessData?.instagramfollowers
                      : ''}
                  </span>
                </div>
              ) : (
                ''
              )}
              {/* {getPlayerDetailsSuccessData?.youtube !== null ? (
                <div
                  className="icons_container"
                  onClick={() => {
                    window
                      ?.open(getPlayerDetailsSuccessData?.youtube, '_blank')
                      ?.focus()
                  }}
                >
                  <div className="social_media_icons_profile">
                    <YoutubeIcon />
                  </div>
                  <span className="followers">
                    {getPlayerDetailsSuccessData?.youtubefollowers !== null &&
                    getPlayerDetailsSuccessData?.youtubefollowers !== '0'
                      ? getPlayerDetailsSuccessData?.youtubefollowers
                      : ''}
                  </span>
                </div>
              ) : (
                ''
              )} */}
            </div>
          </div>
          <div
            className="img"
            style={{
              background: getCircleColor(card?.playerlevelid),
            }}
          >
            <PlayerImageProfile
              src={card?.playerpicture || card?.img}
              className="img-radius"
            />
          </div>
          <div className="player-info-box">
            <div
              className={classnames(
                'name',
                getPlayerLevelClassName(card?.playerlevelid),
                'flex_container',
                'splieler-title-wrapper',
              )}
            >
              <span
                className={classnames(
                  getPlayerLevelClassName(card?.playerlevelid),
                )}
                // style={{ fontSize: '28px' }}
              >
                {card?.name.length > nameLength
                  ? card?.name.substring(0, nameLength) + '...'
                  : card?.name}
              </span>
              {isMobile() ? (
                <>
                  <span>{` $${card?.ticker}`}</span>
                  <TooltipLabel
                    title={getCountryName(
                      getCountryCodeNew(card?.country_id),
                      countriesData,
                    )}
                  >
                    <span
                      className={`fi fis fi-${getCountryCodeNew(
                        card?.country_id,
                      ).toLowerCase()}`}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '100%',
                        backgroundSize: 'cover',
                      }}
                    ></span>
                  </TooltipLabel>
                </>
              ) : (
                <>
                  <span>{` $${card?.ticker}`}</span>
                  <TooltipLabel
                    title={getCountryName(
                      getCountryCodeNew(card?.country_id),
                      countriesData,
                    )}
                  >
                    <span
                      className={`fi fis fi-${getCountryCodeNew(
                        card?.country_id,
                      ).toLowerCase()}`}
                      style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '100%',
                        backgroundSize: 'cover',
                      }}
                    ></span>
                  </TooltipLabel>
                </>
              )}
            </div>
            {(initialLoading || playerShareLoader) && !hasTour ? (
              <div>
                <div className="stat-wrapper stat-skeleton-wrapper">
                  <div className="player-cost">
                    <div className="skeleton"></div>
                    <span
                      style={
                        selectedThemeRedux === 'Black'
                          ? { color: 'white' }
                          : { color: 'var(--primary-text-color' }
                      }
                    >
                      /
                    </span>
                    <div className="skeleton"></div>
                  </div>
                </div>
                {/* <div className="player-stake" style={{ height: 0 }}></div> */}
              </div>
            ) : (
              <>
                {isPlayerNotLaunched && card?.subscriptionstartdate > 0 ? (
                  <div className="countdown-wrapper">
                    {' '}
                    {state.day.toString().padStart(2, '0')}
                    <b>{t('D')}</b> &nbsp;
                    {state.hours.toString().padStart(2, '0')}
                    <b>{t('H')}</b> &nbsp;
                    {state.minutes.toString().padStart(2, '0')}
                    <b>{t('M')}</b> &nbsp;
                    {state.seconds.toString().padStart(2, '0')}
                    <b>{t('S')}</b>
                  </div>
                ) : isPlayerNotLaunched ? (
                  <div className="coming-soon h-3">{t('coming soon')}</div>
                ) : (
                  <div className="stat-wrapper">
                    <div className="player-cost">
                      <div className="matic-wrapper details">
                        <div className="player-detail-pricechange">
                          {getPercentageEstimate(card).oldNumber ===
                          getPercentageEstimate(card).newNumber ? (
                            <ArrowUpFilled />
                          ) : getPercentageEstimate(card).oldNumber <
                            getPercentageEstimate(card).newNumber ? (
                            <ArrowUpFilled />
                          ) : (
                            <ArrowDownFilled />
                          )}
                          <div
                            ref={percentageRef}
                            className={classnames(
                              'number-color',
                              getPercentageEstimate(card).oldNumber ===
                                getPercentageEstimate(card).newNumber
                                ? 'profit'
                                : getPercentageEstimate(card).oldNumber <
                                  getPercentageEstimate(card).newNumber
                                ? 'profit'
                                : 'loss',
                            )}
                          >
                            {getFlooredFixed(
                              getPercentageEstimate(card).percentage,
                              2,
                            )}
                            %
                          </div>
                        </div>
                      </div>
                      <span
                        style={
                          selectedThemeRedux === 'Black'
                            ? { color: 'white' }
                            : { color: 'var(--primary-text-color' }
                        }
                      >
                        /
                      </span>
                      <div
                        className="matic-wrapper details"
                        style={{ flexDirection: 'row' }}
                      >
                        <span
                          ref={usdRef}
                          className={classnames(
                            'player-cost-stats',
                            disabledPlayer
                              ? ''
                              : getUsdValue(card).usdNow >=
                                getUsdValue(card).usdOld
                              ? profitStyle
                              : lossStyle,
                          )}
                        >
                          $
                          {disabledPlayer
                            ? '0.00'
                            : parseFloat(
                                getFlooredFixed(getUsdValue(card).usdNow, 3),
                              ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {/* {(localStorage.getItem('loginId') &&
              !isPlayerNotLaunched &&
              playerShareStaked > 0) ||
            (localStorage.getItem('loginInfo') &&
              !isPlayerNotLaunched &&
              playerShareStaked > 0) ? (
              <div className="player-stake">
                {playerShareLoader ? (
                  <div className="player-stake flex-center">
                    <div className="skeleton your_stake"></div>
                  </div>
                ) : (
                  <div>
                    <span>{t('your stake')}: </span>
                    <span>{truncateDecimalsStr(stakingBalance, 5)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="player-stake" style={{ height: 0 }}></div>
            )} */}
                {(localStorage.getItem('loginId') &&
                  !isPlayerNotLaunched &&
                  card?.coin_issued > 0 &&
                  (playerShareHold > 0 || playerShareStaked > 0)) ||
                (localStorage.getItem('loginInfo') &&
                  !isPlayerNotLaunched &&
                  card?.coin_issued > 0 &&
                  (playerShareHold > 0 || playerShareStaked > 0)) ? (
                  <div className="player-stake">
                    {playerShareLoader ? (
                      <div className="player-stake flex-center">
                        <div className="skeleton you_own"></div>
                      </div>
                    ) : (
                      <div>
                        {/* <span>{t('your stake')}: </span> */}
                        <span>{t('you_own')}</span>
                        <span
                          style={{
                            color: '#f3b127',
                            fontWeight: 'bolder',
                            fontFamily: 'Rajdhani-bold',
                          }}
                        >
                          {`${getYouOwn()}%`}
                        </span>
                        <span>{t('of the Fanclub')}</span>
                        {/* <span>{truncateDecimalsStr(stakingBalance, 5)}</span> */}
                      </div>
                    )}
                  </div>
                ) : (
                  // <div className="player-stake" style={{ height: 0 }}></div>
                  <></>
                )}
              </>
            )}
          </div>
          <DialogBox
            isOpen={infoPop}
            onClose={handleClosePop}
            contentClass="share-dialog"
          >
            {screenShot ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div id="card_container" style={{ marginTop: '50px' }}>
                  <ImageComponent
                    height="300"
                    width="200"
                    src={playerCardImg}
                  />
                </div>
                <p
                  style={{
                    fontFamily: 'Rajdhani-bold',
                    fontWeight: '400',
                    fontSize: '20px',
                    textAlign: 'center',
                    marginTop: '30px',
                  }}
                >
                  {t('share with your friends')}
                </p>
                <ShareSocial
                  url={`${
                    window.location.origin
                  }/player/share/${window.location.pathname.slice(8)}`}
                  socialTypes={['whatsapp', 'facebook', 'twitter', 'telegram']}
                  style={styleShare}
                  onSocialButtonClicked={data => console.log(data)}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '40px',
                    marginTop: '10px',
                    gap: '30px',
                    paddingLeft: '20px',
                  }}
                  id="card_container"
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={onButtonDownload}
                  >
                    <DownloadIcon width="15px" height="15px" />
                    <p
                      style={{
                        color: 'var(--primary-foreground-color)',
                        textDecoration: 'underline',
                      }}
                    >
                      {t('download')}
                    </p>
                  </div>
                  <div
                    className="copy-button-seed tooltip-seed"
                    onClick={handleCopy}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                    }}
                    onMouseLeave={() => setAddressCopied(false)}
                  >
                    <CopyIcon width="15px" height="15px" />
                    <p
                      style={{
                        color: 'var(--primary-foreground-color)',
                        textDecoration: 'underline',
                      }}
                    >
                      {t('copy link')}
                    </p>
                    <span
                      className={
                        isAddressCopied
                          ? 'tooltiptext tooltip-visible'
                          : 'tooltiptext'
                      }
                      style={{ marginLeft: '32px', marginTop: '40px' }}
                    >
                      {t('copied')}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '250px auto 0 auto',
                  }}
                  id="card_container"
                >
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                </div>
              </div>
            )}
          </DialogBox>
          <div className="divide"></div>
          {/* {getPlayerLevelName(card?.playerlevelid) !== 'Launching' &&
          getPlayerLevelName(card?.playerlevelid) !== 'None' &&
          getPlayerLevelName(card?.playerlevelid) !== null ? (
            <div className="batch_wrapper">
              <div>
                {getPlayerLevelName(card?.playerlevelid) === 'Diamond' ? (
                  <ImageComponent
                    className="batch_icon_size"
                    src={Diamond}
                    alt=""
                  />
                ) : getPlayerLevelName(card?.playerlevelid) === 'Gold' ? (
                  <ImageComponent
                    className="batch_icon_size"
                    src={Gold}
                    alt=""
                  />
                ) : getPlayerLevelName(card?.playerlevelid) === 'Silver' ? (
                  <ImageComponent
                    className="batch_icon_size"
                    src={Silver}
                    alt=""
                  />
                ) : getPlayerLevelName(card?.playerlevelid) === 'Bronze' ? (
                  <ImageComponent
                    className="batch_icon_size"
                    src={Bronze}
                    alt=""
                  />
                ) : (
                  <ImageComponent
                    className="batch_icon_size"
                    src={Empty}
                    alt=""
                  />
                )}
              </div>
              <h1
                className={classnames(
                  getPlayerLevelClassName(card?.playerlevelid),
                )}
              >
                {getPlayerLevelName(card?.playerlevelid)}
              </h1>
            </div>
          ) : (
            ''
          )} */}
          {draftedBy?.length > 0 ? (
            <div className="profile-info capitalize flex_container">
              <div>{t('drafted_by')}:</div>
              <div
                className={classnames(
                  'player-info-stats',
                  'nft-name',
                  'flex_container',
                )}
                style={{ textTransform: 'capitalize' }}
                onClick={gotoPlayer}
              >
                {draftedBy[0]?.name}
                <TooltipLabel
                  title={getCountryName(
                    getCountryCodeNew(draftedBy[0]?.country_id),
                    countriesData,
                  )}
                >
                  <span
                    style={{ width: '30px', height: '30px' }}
                    className={`fi fis fi-${getCountryCodeNew(
                      draftedBy[0]?.country_id,
                    ).toLowerCase()} ml-5`}
                  ></span>
                </TooltipLabel>
              </div>
            </div>
          ) : null}
          <div className="profile-info capitalize">
            <div>{t('coins in circulation')}:</div>
            <div
              className={classnames(
                'player-info-stats',
                !card?.coin_issued || isPlayerNotLaunched
                  ? ''
                  : card?.coin_issued >= prevData?.coin_issued
                  ? profitStyle
                  : lossStyle,
              )}
            >
              {card?.coin_issued && !isPlayerNotLaunched
                ? convertToFixed(card?.coin_issued).toLocaleString()
                : 0}
            </div>
          </div>
          <div className="profile-info">
            <div>{t('mecarreira market value')}:</div>
            <div
              className={classnames(
                'player-info-stats text-third-color',
                !card?.coin_issued || isPlayerNotLaunched
                  ? ''
                  : getMarketValue(
                      card?.matic,
                      card?.exchangeRateUSD?.rate,
                      card?.coin_issued,
                    ) >=
                    getMarketValue(
                      prevData?.matic,
                      prevData?.exchangeRateUSD?.rate,
                      prevData?.coin_issued,
                    )
                  ? profitStyle
                  : lossStyle,
              )}
            >
              $
              {card?.coin_issued && !isPlayerNotLaunched
                ? getFlooredNumber(
                    getMarketValue(
                      card?.matic,
                      card?.exchangeRateUSD?.rate,
                      card?.coin_issued,
                    ),
                  )
                : 0}
            </div>
          </div>
          <div className="changed-price">
            <div>{t('coin issue date')}:</div>
            <div className="player-info-stats date-value">
              {launchDate !== 0 && !isPlayerNotLaunched
                ? getHumanDate(launchDate)
                : t('not launched')}
            </div>
          </div>
          <div className="profile-info">
            {/* <div>{t('nft’s issued')}:</div>
            <div className="player-info-stats">
              {(card?.nftIssued && !isPlayerNotLaunched) || 0}
            </div> */}
          </div>
          {/* <FanClubToast /> */}
          {hasTour &&
            (!tourInternal ? (
              <>
                <div className="dark-overlay"></div>
                <div className="bright-rectangle">
                  <div
                    className={classnames(
                      'wallet-description fade-in',
                      tourStep === 'staking'
                        ? 'staking-tokens'
                        : step === 1
                        ? 'sell-tokens '
                        : 'click-on-sells',
                    )}
                  >
                    <b ref={typedRef}></b>
                    &nbsp;
                    <b className="fg-primary-color" ref={subTypedRef}></b>
                  </div>
                  {tourStep === 'sell' && showButton && (
                    <div
                      className="continue-btn sell-tokens-btn fade-in"
                      onClick={() => setStep(2)}
                    >
                      {t('continue')}
                    </div>
                  )}
                </div>
              </>
            ) : tourStep === 'staking' ? (
              <StakingTour onComplete={handleTourComplete} />
            ) : tourStep === 'sell' ? (
              <TradeTourSell onComplete={handleTourComplete} />
            ) : null)}
          {!isPlayerNotLaunched ? (
            <div
              className={classnames(
                'button-line',
                hasTour && !tourInternal ? 'bright-area' : '',
              )}
            >
              <SubmitButton
                // isDisabled={
                //   (card?.playerstatusid?.id === 5 || card?.playerlevelid === 5) &&
                //   card?.exlistingon === false
                //     ? true
                //     : false
                // }
                isDisabled={card?.playerstatusid?.id < 4 ? true : false}
                disableLoading={true}
                title={t('buy')}
                className={classnames(
                  'button-box',
                  'caps buy-btn',
                  // card?.playerstatusid?.id < 4 ||
                  //   ((card?.playerstatusid?.id === 5 ||
                  //     card?.playerlevelid === 5) &&
                  //     card?.exlistingon === false)
                  //   ? 'btn-disabled'
                  //   : '',
                  card?.playerstatusid?.id < 4 ? 'btn-disabled' : '',
                  hasTour ? 'dark-area' : '',
                )}
                onPress={() => onBtnClick(card?.playerstatusid?.id, 'buy')}
              />
              <SubmitButton
                isDisabled={false}
                disableLoading={true}
                title={t('stake coin')}
                className={classnames(
                  'button-box',
                  // card?.playerstatusid?.id < 5 ? 'btn-disabled' : '',
                  !hasTour || tourStep === 'staking' ? '' : 'dark-area',
                )}
                onPress={() => onBtnClick(card?.playerstatusid?.id, 'stake')}
              />
              <SubmitButton
                // isDisabled={
                //   (card?.playerstatusid?.id === 5 || card?.playerlevelid === 5) &&
                //   card?.exlistingon === false
                //     ? true
                //     : false
                // }
                isDisabled={card?.playerstatusid?.id < 4 ? true : false}
                disableLoading={true}
                title={t('sell')}
                className={classnames(
                  'button-box',
                  'sell-btn',
                  'caps',
                  // card?.playerstatusid?.id < 4 ||
                  //   ((card?.playerstatusid?.id === 5 ||
                  //     card?.playerlevelid === 5) &&
                  //     card?.exlistingon === false)
                  //   ? 'btn-disabled'
                  //   : '',
                  card?.playerstatusid?.id < 4 ? 'btn-disabled' : '',
                  !hasTour || (step === 2 && !tourInternal) ? '' : 'dark-area',
                )}
                onPress={() => onBtnClick(card?.playerstatusid?.id, 'sell')}
              />
            </div>
          ) : (
            <div className="mb-30" />
          )}
          {card?.sharetype === 0 || card?.sharetype === false ? (
            <FanClubToast />
          ) : (
            <FanClubToast green={true} />
          )}
          <div className="mb-30" />
        </div>
      </div>
    </>
  )
}

export default PlayerInfo
