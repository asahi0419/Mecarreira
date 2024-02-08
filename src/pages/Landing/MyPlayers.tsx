import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { getMyWalletPlayers } from '@root/apis/playerCoins/playerCoinsSlice'
import { isMobile } from '@utils/helpers'
import NewCarouselCard from '@components/Card/NewCarouselCard'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import {
  showPurchaseForm,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import classNames from 'classnames'
const MyPlayers: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    myWalletPlayers,
    loadingMyWalletPlayers,
    current_balance,
    wallet_balance_percentage_change,
  } = playerCoinData
  const playerRef = useRef<any>([])
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const accessToken = localStorage.getItem('accessToken')
  const [itemIndex, setItemIndex] = useState(0)

  const handlePurchaseOpen = (value: string, data?: any) => {
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

  useEffect(() => {
    if (accessToken) {
      dispatch(getMyWalletPlayers())
    }
  }, [accessToken])

  return (
    <div
      className={`${
        loginInfo && myWalletPlayers?.length > 0 ? 'section-wrapper' : 'hidden'
      }`}
    >
      <div className="section-title">
        {t('My Players')}
        {wallet_balance_percentage_change >= 0 ? (
          <div className="title-more-info">
            <ArrowCircleUpIcon />
            <span>
              ${Math.abs(current_balance)?.toFixed(2)} /{' '}
              {Math.abs(wallet_balance_percentage_change)?.toFixed(2)}%
            </span>
          </div>
        ) : (
          <div className="title-more-info red-color">
            <ArrowCircleDownIcon />
            <span>
              ${Math.abs(current_balance)?.toFixed(2)} /{' '}
              {Math.abs(wallet_balance_percentage_change)?.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
      <div
        className={classNames(
          'section-content player-carousel',
          isMobile() ? 'my_players_section_mobile' : '',
        )}
      >
        {!loadingMyWalletPlayers && myWalletPlayers?.length > 0 ? (
          <CircleCarousel
            items={myWalletPlayers.map((item: any, index: number) => (
              <NewCarouselCard
                card={item}
                playercardjson={item.playercardjson}
                key={index + 2}
                prevData={playerRef?.current}
                onBuy={() => handlePurchaseOpen('buy', item)}
                onSell={() => handlePurchaseOpen('sell', item)}
              />
            ))}
            activeIndex={itemIndex}
            setActiveIndex={setItemIndex}
            isLanding={true}
          />
        ) : (
          <>
            {new Array(isMobile() ? 1 : 3)
              .fill(1)
              .map((_: any, index: number) => (
                <BaseCardSkeleton key={index} />
              ))}
          </>
        )}
      </div>
    </div>
  )
}

export default React.memo(MyPlayers)
