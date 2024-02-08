/* eslint-disable prettier/prettier */
import { useRef } from 'react'
import PlayerInfo from './PlayerInfo'
import { PLAYER_STATUS } from '@root/constants'
import { isMobile } from '@utils/helpers'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import NewNFTs from './NewNFTs'
import VotingPolls from './VotingPolls'
import Giveaways from './Giveaways'
import { useEffect, useState } from 'react'
import PlayerChart from './PlayerChart'
import { RootState } from '@root/store/rootReducers'
import {
  getDraftedByData,
  getPreviewNftsData,
  getPlayer1Contract,
  getStakingBalance,
  getPlayerDetailsReset,
} from '@root/apis/playerCoins/playerCoinsSlice'
import classNames from 'classnames'
import {
  fetchPlayersStats,
  fetchPlayersStatsReset,
} from '@root/apis/playerStats/playerStatsSlice'
import {
  getLatestTradeHistory,
  getPlayerSharesInit,
  showPurchaseForm,
  showSignupForm,
  showStakingForm,
} from '@root/apis/onboarding/authenticationSlice'
import PlayersDisplay from './PlayersDisplay'
import NftSkeleton from '@components/Card/NftSkeleton'
import { Dialog } from '@material-ui/core'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'
import PlayerKiosk from './PlayerKiosk'
import { useIdleTimer } from 'react-idle-timer'
import DialogBox from '@components/Dialog/DialogBox'
import { toast } from 'react-hot-toast'
import { THEME_COLORS } from '@root/constants'
import FanClubList from '@pages/LaunchCoin/FanClubList'
import FanClubToast from './components/FanClubToast'
import TradeHistory from './TradeHistory'

let playerProfileInterval: any = null
let getTradeHistoryInterval: any = null

const Profile = () => {
  const { t } = useTranslation()
  const playerRef = useRef<any>(null)
  const dispatch = useDispatch()
  const [chartView, setChartView] = useState(false)
  const [isFirstLoad, setFirstLoad] = useState(true)
  const [disabledPlayer, setDisabledPlayer] = useState(true)
  const [profileData, setProfileData] = useState(null)
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    return () => {
      dispatch(getPlayerSharesInit())
      // dispatch(getPlayerDetailsReset())
      dispatch(fetchPlayersStatsReset())
    }
  }, [])

  const handlePurchaseOpen = (value: string, data: any) => {
    if (!loginInfo && !loginId) {
      dispatch(showSignupForm())
      return
    }
    dispatch(
      showPurchaseForm({
        mode: value.toUpperCase(),
        playerData: data ? data : profileData,
      }),
    )
  }

  const handleStakeFormOpen = () => {
    if (!loginInfo && !loginId) {
      dispatch(showSignupForm())
      return
    }
    dispatch(showStakingForm({ playerData: profileData }))
  }

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    getPlayerDetailsSuccessData,
    getPlayerDetailsErrorMsg,
    previewNftsData,
    isLoadingNfts,
    cardPlayerDetailsSuccessData,
    playerDraftedByData,
  } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux, isVisibleModal, isPurchaseFormVisible } =
    authenticationData

  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsData } = playerStatsData
  const [windowSize, setWindowSize] = useState(0)

  useEffect(() => {
    // Update coin_issued when close purchase form
    if (!isPurchaseFormVisible && !isFirstLoad) {
      handleGetPriceStats([getPlayerDetailsSuccessData.playercontract])
    }
  }, [isPurchaseFormVisible])

  const createTestPlayers = () => {
    const playerProfileData = {
      ...getPlayerDetailsSuccessData,
      ...fetchPlayerStatsData[0],
    }
    if (Object.keys(playerProfileData).length > 0) {
      setProfileData(playerProfileData)
    }
  }

  const handleGetPriceStats = (playersData: any) => {
    if (isFirstLoad) {
      setFirstLoad(false)
    }
    dispatch(fetchPlayersStats({ contracts: playersData, query: 'complex' }))
  }

  const onIdle = () => {
    clearInterval(playerProfileInterval)
  }

  const onActive = () => {
    clearInterval(playerProfileInterval)
    if (
      !document.hidden &&
      !isVisibleModal &&
      getPlayerDetailsSuccessData?.playerstatusid?.id >= 3
    ) {
      playerProfileInterval = setInterval(() => {
        handleGetPriceStats([getPlayerDetailsSuccessData.playercontract])
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
    timeout: 60000,
    throttle: 500,
  })

  useEffect(() => {
    if (
      getPlayerDetailsSuccessData &&
      getPlayerDetailsSuccessData.playerstatusid.id >= PLAYER_STATUS.COMINGSOON
    ) {
      setDisabledPlayer(false)
      handleGetPriceStats([getPlayerDetailsSuccessData.playercontract])

      // if ([3, 4, 5].includes(getPlayerDetailsSuccessData?.playerstatusid?.id)) {
      //   dispatch(getPreviewNftsData(getPlayerDetailsSuccessData.playercontract))
      // }
      if (getPlayerDetailsSuccessData?.detailpageurl) {
        dispatch(
          getPlayer1Contract({
            url: getPlayerDetailsSuccessData?.detailpageurl,
          }),
        )
      }
    }
    if (fetchPlayerStatsData.length < 1) {
      setProfileData(getPlayerDetailsSuccessData)
    }

    if (getPlayerDetailsSuccessData?.playercontract) {
      dispatch(
        getLatestTradeHistory({
          player_contract: getPlayerDetailsSuccessData?.playercontract,
          offset: '0',
          loader: true,
        }),
      )
      getTradeHistoryInterval = setInterval(() => {
        dispatch(
          getLatestTradeHistory({
            player_contract: getPlayerDetailsSuccessData?.playercontract,
            offset: '0',
            loader: false,
          }),
        )
      }, 15000)
    }
  }, [getPlayerDetailsSuccessData])

  useEffect(() => {
    if (accessToken || loginInfo) {
      profileData?.playercontract &&
        dispatch(getStakingBalance(profileData?.playercontract))
    }
  }, [profileData])

  useEffect(() => {
    clearInterval(playerProfileInterval)
    if (
      getPlayerDetailsSuccessData &&
      getPlayerDetailsSuccessData.playerstatusid.id >= PLAYER_STATUS.COMINGSOON
    ) {
      if (!document.hidden && !isVisibleModal) {
        playerProfileInterval = setInterval(() => {
          handleGetPriceStats([getPlayerDetailsSuccessData.playercontract])
        }, 20000)
      }
    }
  }, [document.hidden, isVisibleModal])

  useEffect(() => {
    if (fetchPlayerStatsData.length > 0) {
      createTestPlayers()
    }
  }, [fetchPlayerStatsData])

  useEffect(() => {
    return () => {
      clearInterval(playerProfileInterval)
      clearInterval(getTradeHistoryInterval)
    }
  }, [])

  useEffect(() => {
    if (
      cardPlayerDetailsSuccessData &&
      cardPlayerDetailsSuccessData?.playercontract
    ) {
      const playerContract = {
        contract: cardPlayerDetailsSuccessData?.playercontract,
      }
      dispatch(getDraftedByData(playerContract))
    }
  }, [cardPlayerDetailsSuccessData])

  useEffect(() => {
    playerRef.current = profileData
  }, [profileData])

  useEffect(() => {
    if (chartView) {
      document.body.style.overflow = 'hidden'
      if (isMobile()) {
        document.body.style.position = 'fixed'
      } else {
        document.getElementsByClassName('player-chart-dialog')[0].style.width =
          window.innerWidth >= 800 ? '60%' : `${window.innerWidth - 65}px`
        document.getElementsByClassName('player-chart-dialog')[0].style.height =
          'fit-content'
      }
    } else if (isVisibleModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
    }
  }, [chartView])

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

  return (
    <section
      className={classNames(
        'profile-container',
        selectedThemeRedux === 'Black' ? 'fullWidth_Black' : 'fullwidth',
      )}
    >
      {chartView ? (
        isMobile() ? (
          <Dialog
            open={chartView}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={'md'}
            className={classNames('chart-dialog player-container')}
          >
            <PlayerChart
              onCardView={() => setChartView(false)}
              profileData={profileData}
            />
            <div
              className="mobile-back-button chart-back-button"
              onClick={() => setChartView(false)}
            >
              <ArrowBackIcon />
            </div>
          </Dialog>
        ) : (
          <DialogBox
            isOpen={chartView}
            onClose={() => setChartView(false)}
            contentClass={'player-chart-dialog'}
          >
            <PlayerChart
              onCardView={() => setChartView(false)}
              profileData={profileData}
            />
          </DialogBox>
        )
      ) : null}
      {profileData && getPlayerDetailsSuccessData ? (
        <>
          <PlayerInfo
            isInitial={isFirstLoad}
            isPlayerNotLaunched={
              getPlayerDetailsSuccessData?.playerstatusid?.id < 4
            }
            launchDate={
              getPlayerDetailsSuccessData.playercontractsubscriptionstart
            }
            marketCap={getPlayerDetailsSuccessData.market_cap}
            card={profileData}
            draftedBy={playerDraftedByData?.drafted_by}
            prevData={playerRef.current}
            disabledPlayer={disabledPlayer}
            onBuy={(data: any) => handlePurchaseOpen('buy', data)}
            onStake={handleStakeFormOpen}
            onSell={(data: any) => handlePurchaseOpen('sell', data)}
            onChartView={() => setChartView(true)}
          />
        </>
      ) : (
        <div className="new-nft-loading">
          <div className="spinner"></div>
          <div
            className={classNames(
              'input-feedback text-center otp-error mt-20',
              !getPlayerDetailsErrorMsg ? 'hidden' : '',
            )}
          >
            {getPlayerDetailsErrorMsg}
          </div>
        </div>
      )}
      <div className="sections-wrapper">
        {!disabledPlayer && (
          <>
            <TradeHistory
              ticker={getPlayerDetailsSuccessData?.ticker}
              onBuy={(data: any) => handlePurchaseOpen('buy', data)}
            />
            <PlayerKiosk playerId={getPlayerDetailsSuccessData?.id} />
            <VotingPolls
              playercontract={getPlayerDetailsSuccessData.playercontract}
              ticker={getPlayerDetailsSuccessData?.ticker}
            />
            <Giveaways playerStatus={getPlayerDetailsSuccessData} />
          </>
        )}
        <PlayersDisplay
          onBuy={(playerData: any) => handlePurchaseOpen('buy', playerData)}
          onSell={(playerData: any) => handlePurchaseOpen('sell', playerData)}
          playerId={getPlayerDetailsSuccessData?.id}
        />
      </div>
    </section>
  )
}

export default Profile
