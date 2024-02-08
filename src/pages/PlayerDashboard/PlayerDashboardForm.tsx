import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import '@assets/css/pages/PlayerDashboard.css'
import Nfts from './Nfts'
import PlayerCoin from './PlayerCoin'
import Voting from './Voting'
import Drafts from './Drafts'
import PlayerCoinRequest from './PlayerCoinRequest'
import PlayerCoinLaunch from './PlayerCoinLaunch'
import { useDispatch, useSelector } from 'react-redux'
import {
  getPlayer1Contract,
  getPlayerData,
  getPlayerSelection,
  resetPlayerCoinData,
  resetPlayerSelection,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { RootState } from '@root/store/rootReducers'
import { isMobile } from '@utils/helpers'
import classNames from 'classnames'
import HotToaster from '@components/HotToaster'
import { showGalleryForm } from '@root/apis/gallery/gallerySlice'
import Spinner from '@components/Spinner'
import MyCard from './MyCard'
import MyShop from './PlayerCoin/MyShop'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import PlayerListTabGroup from '@pages/PlayerList/components/PlayerListTabGroup'
import FanClubRequest from './PlayerCoinRequest/FanClubRequest'

// const defaultTabs = ['player coins', 'nft’s', 'voting', 'drafts', 'my card']
const defaultTabs = ['player coins', 'voting', 'drafts', 'my card']

const proTabs = [
  'player coins',
  // 'nft’s',
  'my shop',
  'voting',
  'drafts',
  'my card',
]

const PlayerDashboardForm: React.FC = () => {
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('player coins')
  const [scrollIndex, setScrollIndex] = useState(0)
  const [isNoPlayer, setIsNoPlayer] = useState<number>(0)
  const includeLanding = !window.location.href.includes('/app')
  // const includeLanding = process.env.REACT_APP_MODE === 'TESTING'
  const handleGetTab = (tab: string) => {
    if (tab === 'nft’s') {
      dispatch(showGalleryForm(false))
    }
    setActiveTab(tab)
  }

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    allPlayersData,
    isGetPlayerSuccess,
    player1contractPlayer,
    playerCoinActiveTab,
    selectedPlayer,
    isLoadingPlayerList,
    isCreatePlayerSuccess,
    isGetPlayerSelectionCalled,
  } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { selectedThemeRedux, QualificationSettingData, openMenu } =
    authenticationData

  useEffect(() => {
    if (isGetPlayerSuccess) {
      if (allPlayersData.length === 0 || !allPlayersData[0]?.playerstatusid) {
        setIsNoPlayer(isNoPlayer + 1)
      }
    }
    if (allPlayersData[0]?.playerstatusid) {
      if (allPlayersData[0]?.playerstatusid?.id > 1) {
        setIsNoPlayer(0)
      }
    }
  }, [allPlayersData, isGetPlayerSuccess])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!loginInfo && !loginId) {
      // if (isMobile()) {
      //   navigate('/app/signup')
      // } else {
      //   navigate(HOMEROUTE)
      // }
      navigate('/')
      return
    }
    if (!selectedPlayer && !isGetPlayerSelectionCalled) {
      dispatch(getPlayerSelection())
    }
    return () => {
      dispatch(resetPlayerCoinData())
      dispatch(resetPlayerSelection())
    }
  }, [])

  useEffect(() => {
    if (playerCoinActiveTab) {
      handleGetTab(playerCoinActiveTab)
    }
  }, [playerCoinActiveTab])

  useEffect(() => {
    if (
      player1contractPlayer !== selectedPlayer?.detailpageurl &&
      selectedPlayer?.detailpageurl
    ) {
      dispatch(getPlayer1Contract({ url: selectedPlayer?.detailpageurl }))
    }
  }, [selectedPlayer])
  const launchMode = localStorage.getItem('launchMode')
  useEffect(() => {
    if (isCreatePlayerSuccess && launchMode !== 'Fan') {
      console.log('fetching_player_data3')
      dispatch(getPlayerData({ isReloading: false }))
    }
  }, [isCreatePlayerSuccess])

  const handleScroll = (direction: string) => {
    if (direction === 'forth') {
      if (scrollIndex <= 300) {
        setScrollIndex(scrollIndex + 30)
      }
    } else {
      if (scrollIndex > 0) {
        setScrollIndex(scrollIndex - 30)
      }
    }
  }
  const location = useLocation()
  // console.log('location', location.pathname)
  const origin = window.location.origin
  // const origin = 'https://devlanding.mecarreira.com/'
  // console.log('pathname for dashboard form', origin.includes('landing'))

  useEffect(() => {
    if (
      selectedPlayer?.playerstatusid?.playerstatusname === 'Verified' &&
      includeLanding
    ) {
      if (QualificationSettingData !== 0) {
        if (!openMenu) {
          navigate('/app/player-dashboard')
        }
      }
    }
  }, [selectedPlayer])

  if (includeLanding) {
    return (
      <section className="player-dashboard-container">
        <HotToaster />
        {(!isNoPlayer && !selectedPlayer?.playerstatusid) ||
        isLoadingPlayerList ? (
          <Spinner title={''} spinnerStatus={true} className="page-spinner" />
        ) : (
          <>
            {selectedPlayer?.playerstatusid?.playerstatusname === 'Pending' ||
            selectedPlayer?.playerstatusid?.playerstatusname === 'Registered' ||
            selectedPlayer?.playerstatusid?.id === 6 ||
            selectedPlayer?.playerstatusid?.id > 3 ||
            (isNoPlayer &&
              !location.pathname.includes('/fan-player-dashboard')) ||
            (includeLanding && QualificationSettingData === 0) ? (
              <PlayerCoinRequest />
            ) : null}
            {/* {selectedPlayer?.playerstatusid?.playerstatusname === 'Deployed' ||
            [4, 5].includes(selectedPlayer?.playerstatusid?.id) ? (
              <div
                style={{ position: 'relative', marginTop: '0px' }}
                className={classNames(
                  'tab-bar-container',
                  window.innerWidth < 700 ? 'players-list-tabgroup' : '',
                )}
              >
                <ArrowBackIosNewIcon
                  style={{
                    display:
                      window.innerWidth < 700 && scrollIndex > 10
                        ? 'block'
                        : 'none',
                    fontSize: 15,
                    position: 'absolute',
                    left: '10px',
                    top: '37%',
                  }}
                  onClick={() => handleScroll('back')}
                />
                <PlayerListTabGroup
                  defaultTab={activeTab}
                  getScrollIndex={(index: number) => setScrollIndex(index)}
                  tabSet={
                    selectedPlayer?.playerlevelid > 2 ? proTabs : defaultTabs
                  }
                  getSwitchedTab={handleGetTab}
                  scrollTo={scrollIndex}
                />
                <ArrowForwardIosIcon
                  style={{
                    display:
                      window.innerWidth < 700 && scrollIndex < 168
                        ? 'block'
                        : 'none',
                    fontSize: 15,
                    position: 'absolute',
                    right: '10px',
                    top: '37%',
                  }}
                  onClick={() => handleScroll('forth')}
                />
              </div>
            ) : null} */}
            {/* {(['Deployed', 'Subscription'].includes(
              selectedPlayer?.playerstatusid?.playerstatusname,
            ) ||
              [4, 5].includes(selectedPlayer?.playerstatusid?.id)) &&
              activeTab === 'player coins' && <PlayerCoin />} */}
            {/* {(['Deployed', 'Subscription'].includes(
              selectedPlayer?.playerstatusid?.playerstatusname,
            ) ||
              [4, 5].includes(selectedPlayer?.playerstatusid?.id)) &&
              activeTab === 'nft’s' && <Nfts />} */}
            {/* {(['Deployed', 'Subscription'].includes(
              selectedPlayer?.playerstatusid?.playerstatusname,
            ) ||
              [4, 5].includes(selectedPlayer?.playerstatusid?.id)) &&
              activeTab === 'voting' && <Voting />} */}
            {/* {(['Deployed', 'Subscription'].includes(
              selectedPlayer?.playerstatusid?.playerstatusname,
            ) ||
              [4, 5].includes(selectedPlayer?.playerstatusid?.id)) &&
              activeTab === 'drafts' && <Drafts />} */}
            {/* {(['Deployed', 'Subscription'].includes(
              selectedPlayer?.playerstatusid?.playerstatusname,
            ) ||
              [4, 5].includes(selectedPlayer?.playerstatusid?.id)) &&
              activeTab === 'my card' && <MyCard />} */}
            {/* {activeTab === 'my shop' && <MyShop />} */}
          </>
        )}
      </section>
    )
  } else {
    return (
      <section className="player-dashboard-container">
        <HotToaster />
        {(!isNoPlayer && !selectedPlayer?.playerstatusid) ||
        isLoadingPlayerList ? (
          <Spinner title={''} spinnerStatus={true} className="page-spinner" />
        ) : (
          <>
            {selectedPlayer?.playerstatusid?.playerstatusname === 'Pending' ||
            selectedPlayer?.playerstatusid?.playerstatusname === 'Registered' ||
            selectedPlayer?.playerstatusid?.id === 6 ||
            (isNoPlayer &&
              !location.pathname.includes('/fan-player-dashboard')) ? (
              <PlayerCoinRequest />
            ) : (selectedPlayer?.playerstatusid?.playerstatusname ===
                'Pending' ||
                selectedPlayer?.playerstatusid?.id === 6 ||
                isNoPlayer) &&
              location.pathname.includes('/fan-player-dashboard') ? (
              <FanClubRequest />
            ) : null}
            {selectedPlayer?.playerstatusid?.playerstatusname === 'Verified' ? (
              <PlayerCoinLaunch />
            ) : null}
            {selectedPlayer?.playerstatusid?.playerstatusname === 'Deployed' ||
            [4, 5].includes(selectedPlayer?.playerstatusid?.id) ? (
              <div
                style={{ position: 'relative', marginTop: '0px' }}
                className={classNames(
                  'tab-bar-container',
                  window.innerWidth < 700 ? 'players-list-tabgroup' : '',
                )}
              >
                <ArrowBackIosNewIcon
                  style={{
                    display:
                      window.innerWidth < 700 && scrollIndex > 10
                        ? 'block'
                        : 'none',
                    fontSize: 15,
                    position: 'absolute',
                    left: '10px',
                    top: '37%',
                  }}
                  onClick={() => handleScroll('back')}
                />
                <PlayerListTabGroup
                  defaultTab={activeTab}
                  getScrollIndex={(index: number) => setScrollIndex(index)}
                  tabSet={
                    selectedPlayer?.playerlevelid > 2 ? proTabs : defaultTabs
                  }
                  getSwitchedTab={handleGetTab}
                  scrollTo={scrollIndex}
                />
                <ArrowForwardIosIcon
                  style={{
                    display:
                      window.innerWidth < 700 && scrollIndex < 168
                        ? 'block'
                        : 'none',
                    fontSize: 15,
                    position: 'absolute',
                    right: '10px',
                    top: '37%',
                  }}
                  onClick={() => handleScroll('forth')}
                />
              </div>
            ) : null}
            {(['Deployed', 'Subscription'].includes(
              selectedPlayer?.playerstatusid?.playerstatusname,
            ) ||
              [4, 5].includes(selectedPlayer?.playerstatusid?.id)) &&
              activeTab === 'player coins' && <PlayerCoin />}
            {/* {(['Deployed', 'Subscription'].includes(
              selectedPlayer?.playerstatusid?.playerstatusname,
            ) ||
              [4, 5].includes(selectedPlayer?.playerstatusid?.id)) &&
              activeTab === 'nft’s' && <Nfts />} */}
            {(['Deployed', 'Subscription'].includes(
              selectedPlayer?.playerstatusid?.playerstatusname,
            ) ||
              [4, 5].includes(selectedPlayer?.playerstatusid?.id)) &&
              activeTab === 'voting' && <Voting />}
            {(['Deployed', 'Subscription'].includes(
              selectedPlayer?.playerstatusid?.playerstatusname,
            ) ||
              [4, 5].includes(selectedPlayer?.playerstatusid?.id)) &&
              activeTab === 'drafts' && <Drafts />}
            {(['Deployed', 'Subscription'].includes(
              selectedPlayer?.playerstatusid?.playerstatusname,
            ) ||
              [4, 5].includes(selectedPlayer?.playerstatusid?.id)) &&
              activeTab === 'my card' && <MyCard />}
            {activeTab === 'my shop' && <MyShop />}
          </>
        )}
      </section>
    )
  }
}

export default PlayerDashboardForm
