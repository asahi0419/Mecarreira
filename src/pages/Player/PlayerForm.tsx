import { useEffect, useState } from 'react'
import Profile from './Profile'
import Nfts from './Nfts'
import Drafts from './Drafts'
import Supporters from './Supporters'
import Votes from './Votes'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import '@assets/css/pages/Player.css'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import classNames from 'classnames'
import { isMobile } from '@utils/helpers'
import PlayerListTabGroup from '@pages/PlayerList/components/PlayerListTabGroup'
import {
  resetPlayer1Contract,
  resetPlayerDetails,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { resetFPS } from '@root/apis/playerStats/playerStatsSlice'
import {
  getWalletDetails,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import Spinner from '@components/Spinner'
import PlayerShop from '@pages/PlayerDashboard/PlayerCoin/PlayerShop'
import Messages from './Messages'

const proTabs = [
  'profile',
  'members',
  // 'nft’s',
  'messages',
  'items',
  'votes',
  'drafts',
]

const defaultTabs = ['profile', 'members', 'messages', 'votes', 'drafts']

const PlayerDetailForm = (props: any) => {
  const { getActiveTab } = props
  const dispatch = useDispatch()
  const curTab = useSelector((state: RootState) => state.authentication.curTab)
  const [activeTab, setActiveTab] = useState(curTab)
  const [scrollIndex, setScrollIndex] = useState(0)
  const [isFirstLoading, setIsFirstLoading] = useState(true)

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { getPlayerDetailsSuccessData, getDetailsLoading } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const { isNoWallet, userName, selectedThemeRedux, walletDetailAddress } =
    authenticationData

  useEffect(() => {
    if (userName) {
      if (accessToken && !walletDetailAddress) {
        dispatch(getWalletDetails()) // COMMENTED FOR PROD
      }
    }
  }, [userName])

  useEffect(() => {
    if (getPlayerDetailsSuccessData) {
      if (getPlayerDetailsSuccessData?.playerstatusid?.id < 4) {
        setActiveTab('coming soon')
      } else {
        setActiveTab(curTab)
      }
      setIsFirstLoading(false)
    }
  }, [getPlayerDetailsSuccessData])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

  const handleGetTab = (tab: string) => {
    setActiveTab(tab)
    getActiveTab(tab)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => {
      dispatch(resetPlayerDetails())
      dispatch(resetFPS())
      dispatch(resetPlayer1Contract())
    }
  }, [])

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

  return (
    <section
      className={classNames(activeTab !== 'items' ? 'player-container' : '')}
    >
      <>
        <div
          style={{ position: 'relative' }}
          className={classNames(
            'tab-bar-container',
            isMobile() ? 'players-list-tabgroup' : '',
          )}
        >
          <ArrowBackIosNewIcon
            style={{
              display: isMobile() && scrollIndex > 10 ? 'block' : 'none',
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
              !getPlayerDetailsSuccessData
                ? []
                : getPlayerDetailsSuccessData?.playerstatusid?.id < 4
                ? ['coming soon']
                : getPlayerDetailsSuccessData?.playerlevelid > 2
                ? proTabs
                : defaultTabs
            }
            getSwitchedTab={handleGetTab}
            scrollTo={scrollIndex}
          />
          <ArrowForwardIosIcon
            style={{
              display: isMobile() && scrollIndex < 168 ? 'block' : 'none',
              fontSize: 15,
              position: 'absolute',
              right: '10px',
              top: '37%',
            }}
            onClick={() => handleScroll('forth')}
          />
        </div>
        {getDetailsLoading ? (
          <>
            {isFirstLoading && window.scrollTo(0, 0)}
            <Spinner className="player-spinner" title={''} />
          </>
        ) : (
          <>
            {(activeTab === 'profile' || activeTab === 'coming soon') && (
              <>
                {isFirstLoading && window.scrollTo(0, 0)}
                <Profile />
              </>
            )}
            {activeTab === 'messages' && <Messages />}
            {/* {activeTab === 'nft’s' && (
              <Nfts playerData={getPlayerDetailsSuccessData} />
            )} */}
            {activeTab === 'votes' && <Votes />}
            {activeTab === 'drafts' && <Drafts />}
            {activeTab === 'members' && <Supporters />}
            {activeTab === 'items' && <PlayerShop />}
          </>
        )}
      </>
    </section>
  )
}

export default PlayerDetailForm
