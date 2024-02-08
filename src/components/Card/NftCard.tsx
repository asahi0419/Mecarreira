import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/components/NftCard.css'
import { useLocation, useNavigate } from 'react-router-dom'
import BidPopup from '@components/Dialog/BidPopup'
import BidForm from '@components/Dialog/BidForm'
import {
  setStakeFormShowed,
  showNftForm,
  showSignupForm,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import BidButton from '@components/Button/BidButton'
import classNames from 'classnames'
import StakeForm from '@components/Dialog/StakeForm'
import {
  checkTokenId,
  getCircleColor,
  getPlayerLevelName,
  isMobile,
} from '@utils/helpers'
import ImageComponent from '@components/ImageComponent'
import { NFT_STATUS } from '@root/constants'
import { RootState } from '@root/store/rootReducers'

interface Props {
  nft?: any //INftCard
  isNavigate?: boolean | null
  isWalletNavigate?: boolean | null
  showTitle?: boolean | null
  className?: string
  isEndable?: boolean | null
}

const NftCard: React.FC<Props> = ({
  nft,
  isNavigate,
  showTitle,
  className = '',
  isWalletNavigate,
  isEndable,
}) => {
  const { winChances, isFetchGenesisNFTDataSuccess, isFetchNFTDataSuccess } =
    useSelector((state: RootState) => state.gallery)
  const { stakingBalance } = useSelector(
    (state: RootState) => state.playercoins,
  )
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isUpComing = nft.statusid <= 2
  const isAuction = nft.statusid === 3
  const isRaffle = nft.statusid === 4
  const isMinted = nft.statusid === 5

  let countDown: any = null
  const navigate = useNavigate()
  const location = useLocation()
  const [state, setState] = useState({
    day: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  const [showBidPopup, setShowBidPopup] = useState(false)
  const [endable, setEndable] = useState(false)

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const isParticipated = () => {
    if (!isFetchGenesisNFTDataSuccess && isFetchNFTDataSuccess) {
      const currentUserCoins = winChances[0]?.coinsparticipateduser
      if (parseInt(currentUserCoins) > 0) {
        return true
      }
      return false
    }
    return false
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
    if (!isNavigate && !isWalletNavigate) return
    if (isWalletNavigate) {
      dispatch(showWalletForm({}))
      isMobile()
        ? dispatch(showNftForm({ nft, nftMobile: true }))
        : dispatch(showNftForm({ nft }))
    }
    if (!showBidPopup) {
      isMobile()
        ? dispatch(showNftForm({ nft, nftMobile: true }))
        : dispatch(showNftForm({ nft }))
    }
  }

  useEffect(() => {
    return () => {
      if (countDown) {
        clearInterval(countDown)
      }
    }
  }, [])

  useEffect(() => {
    if (nft?.blockdeadline) {
      initCountDown()
    }
  }, [nft])

  const handleBid = (event: any) => {
    event.stopPropagation()
    if (
      !localStorage.getItem('loginInfo') &&
      !localStorage.getItem('loginId')
    ) {
      dispatch(showSignupForm())
      return
    }
    dispatch(setStakeFormShowed())
    dispatch(showNftForm({ nft, isBid: !endable, isEndable: endable }))
  }

  const gotoPlayer = (event: any) => {
    event.stopPropagation()
    const player = nft.detailpageurl
    navigate(`/app/player/${player}`)
  }

  const longtitlestyle = {
    maxHeight: '50px',
    height: '50px',
    /* coins in circulation */
    // maxHeight: '45px',
    // height: '45px',
    marginBottom: '7px',
  }
  const mintedTitle = {
    maxHeight: '35px',
    height: '35px',
  }
  const shorttitlestyle = {
    /* coins in circulation */
    // marginBottom: '7px',
    marginBottom: '16px',
  }

  const isEndedAuction =
    new Date(nft?.blockdeadline).getTime() <= new Date().getTime()

  return (
    <div className={classNames('nft-card', className)} onClick={handleClick}>
      <div className="nft">
        <div
          className={classNames(
            'nft-image-cover',
            nft?.artwork_thumb ? '' : 'nft-dummy-image',
          )}
          style={{ position: 'relative' }}
        >
          {nft?.artwork_thumb ? (
            <ImageComponent
              loading="lazy"
              src={nft?.artwork_thumb}
              alt=""
              className="nft-image"
            />
          ) : null}
          {nft?.quantity > 0 ? (
            <div className="coins_issued_over_nft">
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
                {nft?.quantity}
              </span>
            </div>
          ) : (
            <></>
          )}
          {nft?.xp ? (
            <div className="xp_over_nft">
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
        </div>
      </div>
      <div
        className={classNames(
          'second-part',
          isUpComing ? 'lightTheme' : 'darkTheme',
          isMinted ? 'mintedTheme' : '',
        )}
      >
        {(isAuction || isRaffle) && (
          <div className="fullwidth">
            <div className="nft-bid-info-header">
              <div>{t('ending in')}</div>
              {!isRaffle && <div>{t('current Bid')}</div>}
            </div>
            <div
              className={classNames(
                'nft-bid-info-body',
                isRaffle && 'yellow-color',
              )}
            >
              <div>
                {state.day}d {state.hours}h {state.minutes}m {state.seconds}s
              </div>
              {!isRaffle && <div>{nft?.maxbid.toLocaleString()}</div>}
            </div>
            {/* {nft?.statusid === NFT_STATUS.AUCTION && !isEndedAuction ? (
              <div
                className={classNames(
                  'nft-bid-info-body mt-10',
                  isRaffle && 'yellow-color',
                )}
              >
                Click to place bid
              </div>
            ) : nft?.statusid === NFT_STATUS.RAFFLE && !isParticipated() ? (
              <div
                className={classNames(
                  'nft-bid-info-body mt-10',
                  isRaffle && 'yellow-color',
                )}
              >
                {t(stakingBalance > 0 ? 'participate' : 'stake to win')}
              </div>
            ) : null} */}
          </div>
        )}
        <div
          className={classNames('nft-name', (isAuction || isRaffle) && 'p-0')}
          onClick={gotoPlayer}
        >
          {nft?.playername}&nbsp;
        </div>
        {/* coins in circulation */}
        {/* <div className="flex_container_space_between">
          <div
            className="coins_in_circulation_nft_card"
            style={{ color: isUpComing ? '#80828f' : '' }}
          >
            {t('coins in circulation').toLocaleLowerCase()}:
          </div>
          <div className="player-info-stats theme_color">476</div>
        </div> */}
        {/* {isMinted ? (
          <>
            <div className="nft_owner_wrapper">
              <span>{t('owner')}:</span>
              <div>
                <a href={`${nft?.ownerlink}`} target="_blank">
                  <p className="nft_owner_link" style={{ width: '185px' }}>
                    {nft?.ownerlink}
                  </p>
                </a>
              </div>
            </div>
            <div className="nft_owner_wrapper">
              <span>{t('mint date')}:</span>
              <div>
                {new Date(nft?.mintdate * 1000)
                  .toISOString()
                  .slice(0, 16)
                  .replace('T', ' ')}
              </div>
            </div>
          </>
        ) : (
          ''
        )} */}
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
        ) : showTitle ? (
          <>
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
              {/* {nft.name}&nbsp;{isMinted ? '#' + nft?.tokenid : ''} */}
              {nft.name}&nbsp;
              {checkTokenId(nft?.tokenid)}
            </div>
            <div className="nft-number">{nft.claimtitle}&nbsp;</div>
          </>
        ) : (
          <div
            // className="nft-title"
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
            style={
              nft?.name?.length > 30 || isUpComing || isMinted
                ? mintedTitle
                : shorttitlestyle
            }
          >
            {/* {nft.name}&nbsp;{isMinted && nft.tokenid ? '#' + nft.tokenid : ''} */}
            {nft.name}&nbsp;
            {checkTokenId(nft?.tokenid)}
          </div>
        )}
        {nft?.statusid === NFT_STATUS.AUCTION && !isEndedAuction ? (
          <div
            className={classNames(
              'nft-bid-info-body mt-10',
              isRaffle && 'yellow-color',
            )}
          >
            Click to place bid
          </div>
        ) : nft?.statusid === NFT_STATUS.RAFFLE && !isParticipated() ? (
          <div
            className={classNames(
              'nft-bid-info-body mt-10',
              isRaffle && 'yellow-color',
            )}
          >
            {t(stakingBalance > 0 ? 'participate' : 'stake to win')}
          </div>
        ) : null}
        {nft?.statusid?.id === 6 || nft?.statusid === 6 ? (
          <div className="nft-description" style={{ height: '126px' }}>
            <span
              className={classNames(
                'nft-description-txt',
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
              {`${t('nft_desc_for_status_id_6')}`}
            </span>
          </div>
        ) : isUpComing || isMinted ? (
          <div className="nft-description">
            <span
              className={classNames(
                'nft-description-txt',
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
              {nft.description}&nbsp;
            </span>
          </div>
        ) : null}
        {/* {isAuction && (
          <BidButton
            isDisabled={(!endable && !!isEndable) || nft?.isclosed}
            isLoading={false}
            title={t(
              nft?.isclosed
                ? 'closed'
                : endable || isEndable
                ? 'close auction'
                : 'place bid',
            )}
            className={classNames(
              'nft-bid-button',
              (!endable && !!isEndable) || nft?.isclosed ? 'btn-disabled' : '',
            )}
            onPress={(event: any) => handleBid(event)}
          />
        )}
        {isRaffle && (
          <BidButton
            isDisabled={(!endable && !!isEndable) || nft?.isclosed}
            isLoading={false}
            title={t(
              nft?.isclosed
                ? 'closed'
                : endable || isEndable
                ? 'draw winner'
                : 'stake to win',
            )}
            className={classNames(
              'nft-bid-button nft-stake-button',
              (!endable && !!isEndable) || nft?.isclosed
                ? 'btn-disabled-yellow'
                : '',
            )}
            onPress={(event: any) => handleBid(event)}
          />
        )} */}
        {isUpComing ? (
          <div className="nft-coming-soon">
            <div>{t('coming soon')}</div>
          </div>
        ) : null}
      </div>
      <BidPopup isOpen={showBidPopup}>
        {showBidPopup ? (
          <>
            {isAuction ? (
              <BidForm nft={nft} onClose={() => setShowBidPopup(false)} />
            ) : (
              <StakeForm
                detailpageurl={nft.detailpageurl}
                onClose={() => setShowBidPopup(false)}
              />
            )}
          </>
        ) : null}
      </BidPopup>
    </div>
  )
}

export default NftCard
