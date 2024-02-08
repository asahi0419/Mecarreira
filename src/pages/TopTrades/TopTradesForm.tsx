import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import classNames from 'classnames'
import ProfitIcon from '@assets/icons/icon/profit.png'
import '@assets/css/pages/TopTrades.css'
import '@assets/css/components/Box.css'
import ImageComponent from '@components/ImageComponent'
import TopTradesCard from '@components/Card/TopTradesCard'
import TopTradesCardSkeleton from '@components/Card/TopTradesCardSkeleton'
import Spinner from '@components/Spinner'
import { getTopTrades } from '@root/apis/playerCoins/playerCoinsSlice'
import { useNavigate } from 'react-router-dom'

interface Props {
  showmore?: boolean
  isLanding?: boolean
}
const TopTradesForm: React.FC<Props> = ({
  showmore = false,
  isLanding = false,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { topTradesData, isLoadingTopTrades } = playerCoinData
  const [isShowmoreClicked, setIsShowmoreClicked] = useState(true)

  const handleShowMore = () => {
    if (isLanding) {
      navigate('/app/top-trades')
    } else {
      setIsShowmoreClicked(false)
      dispatch(getTopTrades({ limit: 95, offset: 5 }))
    }
  }

  return (
    <div className={classNames('section-wrapper box-wrapper')}>
      <div className="section-title-container">
        <div className="section-title">
          {t('top trades')}{' '}
          <ImageComponent
            loading="lazy"
            src={ProfitIcon}
            className="profit-icon"
            alt="profit-icon"
          />
        </div>
      </div>
      <div className="list-wrapper">
        {topTradesData.length === 0 ? (
          <>
            {new Array(5).fill(1).map((_: any, index: number) => (
              <TopTradesCardSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            {topTradesData.map((item: any, index: number) => (
              <TopTradesCard key={index} item={item} index={index + 1} />
            ))}
          </>
        )}
      </div>
      {showmore && topTradesData.length > 0 ? (
        isLoadingTopTrades ? (
          <div className="showmore-btn-wrapper">
            <Spinner spinnerStatus={true} />
          </div>
        ) : isShowmoreClicked ? (
          <div className="showmore-btn-wrapper">
            <div className="showmore-btn" onClick={handleShowMore}>
              {t('show more')}
            </div>
          </div>
        ) : null
      ) : null}
    </div>
  )
}

export default TopTradesForm
