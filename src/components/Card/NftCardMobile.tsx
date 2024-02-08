import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/components/NftCard.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  checkTokenId,
  getCircleColor,
  getPlayerLevelName,
  isMobile,
} from '@utils/helpers'
import classNames from 'classnames'
import {
  setStakeFormShowed,
  showGenesisNftForm,
  showNftForm,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import BottomPopup from '@components/Dialog/BottomPopup'
import Send from '@pages/PlayerNft/Send'
import ImageComponent from '@components/ImageComponent'
import PlayerImage from '@components/PlayerImage'
import DummyNftImage from '@assets/images/dummyNft.webp'
import { NFT_STATUS } from '@root/constants'
import { RootState } from '@root/store/rootReducers'

interface Props {
  nft: any //INftCard
  isNavigate?: boolean | null
  showTitle?: boolean | null
  className?: string
  onNftDetailView?: any
  isEndable?: boolean | null
  walletNFT?: boolean
}

const NftCardMobile: React.FC<Props> = ({
  nft,
  isNavigate,
  showTitle,
  className = '',
  onNftDetailView,
  isEndable,
  walletNFT,
}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  let countDown: any = null
  const navigate = useNavigate()
  // const [dataPersisted, persistData] = useDataPersist();
  const [state, setState] = useState({
    day: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  const { winChances } = useSelector((state: RootState) => state.gallery)
  const { stakingBalance, isGetEANftsBalanceSuccess } = useSelector(
    (state: RootState) => state.playercoins,
  )
  const [showPopup, setShowPopup] = useState(false)
  const [endable, setEndable] = useState(false)
  const isAuction = nft.statusid === 3
  const isRaffle = nft.statusid === 4
  const isMinted = nft.statusid === 5
  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const initCountDown = () => {
    countDown = setInterval(function () {
      const countDownDate = new Date(nft?.blockdeadline).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now
      if (distance < 0) {
        setEndable(true)
      }
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

  const handleClick = () => {
    /*
      GEN4: Here is click event of a wallet NFT (others & Genesis)
      * on desktop 'onNftDetailView' is called as seen in GEN3.
      * on mobile (line no. 111) its checked if User has toggled switch &
        fetched Genesis NFT balance.
      * If user is on Mobile & has fetched Genesis NFT balance & the list on wallet nft
        is showing Genesis Nft in user's wallet, then 'showGenesisNftForm' is called 
        & current nft object passed as prop to this nftCard component.
        is passed to the Popup in Applayout.tsx.
      * Else if User is on mobile & has fetched non genesis nfts then 'showNftForm' is
        called & same nft object which comes as prop to this component is passed to Popup
        in Applayout.tsx.
    */
    if (!isNavigate) return
    if (isMobile()) {
      if (isGetEANftsBalanceSuccess) {
        dispatch(showGenesisNftForm({ nft, nftMobile: true }))
      } else {
        dispatch(showNftForm({ nft, nftMobile: true }))
      }
    } else {
      onNftDetailView ? onNftDetailView(nft) : dispatch(showNftForm({ nft }))
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(countDown)
    }
  }, [])

  useEffect(() => {
    if (nft?.blockdeadline) {
      initCountDown()
    }
  }, [nft])

  const isParticipated = () => {
    const currentUserCoins = winChances[0]?.coinsparticipateduser
    if (parseInt(currentUserCoins) > 0) {
      return true
    }
    return false
  }

  const handleBid = () => {
    if (
      !localStorage.getItem('loginInfo') &&
      !localStorage.getItem('loginId')
    ) {
      dispatch(showSignupForm())
      return
    }
    if (nft?.isclosed) {
      return
    }
    dispatch(setStakeFormShowed())
    dispatch(showNftForm({ nft, isBid: !endable, isEndable: endable }))
  }

  const gotoPlayer = (event: any) => {
    event.stopPropagation()
    // const player = nft.detailpageurl
    // navigate(`/app/player/${player}`)
  }
  const isEndedAuction =
    new Date(nft?.blockdeadline).getTime() <= new Date().getTime()

  return (
    <div className={classNames('nft-card', className)}>
      <div className="nft" onClick={handleClick}>
        <div className="nft-image-cover">
          {nft?.artwork_thumb ? (
            <ImageComponent
              loading="lazy"
              src={nft?.artwork_thumb}
              alt=""
              className="nft-image"
            />
          ) : (
            <ImageComponent
              loading="lazy"
              src={DummyNftImage}
              alt=""
              className="nft-image"
            />
          )}
          {nft?.quantity > 0 ? (
            <div className="coins_issued_over_nft_mobile">
              {nft?.balance > 0 && walletNFT ? (
                <span
                  style={{
                    color: '#6bc909 !important',
                    background: '#6bc909 !important',
                  }}
                >
                  {nft?.balance}
                </span>
              ) : null}
              <span
                className={classNames(
                  getPlayerLevelName(nft?.nftlevel) === 'Diamond'
                    ? 'nft_level_diamond'
                    : getPlayerLevelName(nft?.nftlevel) === 'Gold'
                    ? 'nft_level_gold'
                    : getPlayerLevelName(nft?.nftlevel) === 'Silver'
                    ? 'nft_level_silver'
                    : getPlayerLevelName(nft?.nftlevel) === 'Bronze'
                    ? 'nft_level_bronze'
                    : '',
                )}
              >
                {nft?.balance > 0 && walletNFT ? '/' : null}
                {nft?.quantity}
              </span>
            </div>
          ) : (
            <></>
          )}
          {isGetEANftsBalanceSuccess ? (
            <div
              className="xp_over_nft_mobile"
              style={{
                bottom: isAuction || isRaffle ? '25px' : '10px',
                width: '100px',
              }}
            >
              {nft?.isperpetual ? (
                <span
                  style={{
                    color: '#6bc909 !important',
                    background: '#6bc909 !important',
                  }}
                >
                  {t('Unlimited')}
                </span>
              ) : nft?.remainingunlocks > 0 ? (
                <span
                  style={{
                    color: '#6bc909 !important',
                    background: '#6bc909 !important',
                  }}
                >
                  {nft?.remainingunlocks} {t('unlocks')}
                </span>
              ) : null}
              {/* <span>
                {nft?.remainingunlocks > 0 ? '/' : null}
                {nft?.totalunlocks}
              </span> */}
            </div>
          ) : nft?.xp ? (
            <div
              className="xp_over_nft_mobile"
              style={{
                bottom: isAuction || isRaffle ? '25px' : '10px',
              }}
            >
              <span
                className={classNames(
                  getPlayerLevelName(nft?.nftlevel) === 'Diamond'
                    ? 'nft_level_diamond'
                    : getPlayerLevelName(nft?.nftlevel) === 'Gold'
                    ? 'nft_level_gold'
                    : getPlayerLevelName(nft?.nftlevel) === 'Silver'
                    ? 'nft_level_silver'
                    : getPlayerLevelName(nft?.nftlevel) === 'Bronze'
                    ? 'nft_level_bronze'
                    : '',
                )}
              >
                {parseFloat(nft?.xp.toFixed(0)).toLocaleString()} XP
              </span>
            </div>
          ) : (
            <></>
          )}
          {(isAuction || isRaffle) && (
            <div className="fullwidth">
              <div className="nft-bid-info-body">
                <div
                  style={{
                    backgroundColor: isRaffle
                      ? '#f3b127e5'
                      : 'var(--primary-foreground-color)e5',
                  }}
                >
                  {state.day}d {state.hours}h {state.minutes}m {state.seconds}s
                </div>
              </div>
              {nft?.statusid === NFT_STATUS.AUCTION && !isEndedAuction ? (
                <div className="nft-bid-info-body">
                  <div
                    style={{
                      backgroundColor: isRaffle
                        ? '#f3b127e5'
                        : 'var(--primary-foreground-color)e5',
                    }}
                  >
                    Click to place bid
                  </div>
                </div>
              ) : nft?.statusid?.id === NFT_STATUS.RAFFLE ? (
                <>
                  {isParticipated() ? (
                    <div className="nft-bid-info-body flex-center yellow-color">
                      {t('you have already participated')}
                    </div>
                  ) : (
                    <button
                      className={classNames(
                        'nft-btn bg-yellow-color',
                        nft?.isclosed ? 'btn-disabled-yellow' : '',
                      )}
                    >
                      {t(stakingBalance > 0 ? 'participate' : 'stake to win')}
                    </button>
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <div className="second-part darkTheme">
        <div className="nft-name" onClick={gotoPlayer}>
          {nft?.playername}&nbsp;
        </div>
        {nft?.statusid === 6 ? (
          <div
            className={classNames(
              'nft-title',
              getPlayerLevelName(nft?.nftlevel) === 'Diamond'
                ? 'nft_level_diamond'
                : getPlayerLevelName(nft?.nftlevel) === 'Gold'
                ? 'nft_level_gold'
                : getPlayerLevelName(nft?.nftlevel) === 'Silver'
                ? 'nft_level_silver'
                : getPlayerLevelName(nft?.nftlevel) === 'Bronze'
                ? 'nft_level_bronze'
                : '',
            )}
          >
            {`${t('nft_title_for_status_id_6')} #${nft?.tokenid}`}
          </div>
        ) : (
          <div
            className={classNames(
              'nft-title',
              getPlayerLevelName(nft?.nftlevel) === 'Diamond'
                ? 'nft_level_diamond'
                : getPlayerLevelName(nft?.nftlevel) === 'Gold'
                ? 'nft_level_gold'
                : getPlayerLevelName(nft?.nftlevel) === 'Silver'
                ? 'nft_level_silver'
                : getPlayerLevelName(nft?.nftlevel) === 'Bronze'
                ? 'nft_level_bronze'
                : '',
            )}
          >
            {nft.name}&nbsp;{checkTokenId(nft?.tokenid)}
          </div>
        )}
        {showTitle ? <div className="nft-number">{nft.claimtitle}</div> : ''}
        {/* {isAuction && (
          <div className="nft-bid-now capitalize" onClick={handleBid}>
            {t(
              nft?.isclosed
                ? ''
                : endable || isEndable
                ? 'close auction'
                : 'bid now',
            )}
          </div>
        )}
        {isRaffle && (
          <div
            className="nft-bid-now capitalize yellow-color"
            onClick={handleBid}
          >
            {t(
              nft?.isclosed
                ? ''
                : endable || isEndable
                ? 'draw winner'
                : 'stake to win',
            )}
          </div>
        )} */}
      </div>
      {showPopup ? (
        <BottomPopup mode="nft" isOpen={showPopup}>
          <Send
            onSubmit={handleBid}
            onClose={() => {
              setShowPopup(false)
            }}
          />
        </BottomPopup>
      ) : null}
    </div>
  )
}

export default NftCardMobile
