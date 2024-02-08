import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import FeedCard from '@components/Card/FeedCard'
import UserCardSkeleton from '@components/Card/UserCardSkeleton'
import {
  showLatestTrade,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'

interface Props {
  ticker: string
  onBuy: any
}
const TradeHistory: React.FC<Props> = ({ ticker, onBuy }) => {
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { latestTradeHistoryLoader, latestTradeHistoryData } =
    authenticationData
  const onBtnClick = () => {
    if (!loginInfo && !loginId) {
      dispatch(showSignupForm())
      return
    } else {
      onBuy()
    }
  }
  return (
    <section className="profile-history-section">
      <div className="section-title-container">
        <div className="section-title">{t('Trade History')}</div>
        <div className="trending-switch">
          <b
            className="trending-switch-selected"
            onClick={() =>
              dispatch(showLatestTrade({ showLatestTransaction: true }))
            }
          >
            {t('show all')}
          </b>
        </div>
      </div>
      <div className="section-content">
        <>
          {latestTradeHistoryLoader ? (
            <div className="user-list-wrapper">
              <div className="user-list-column">
                {new Array(5).fill(1).map((_: any, index: number) => (
                  <UserCardSkeleton key={index} />
                ))}
              </div>
            </div>
          ) : latestTradeHistoryData.length === 0 ? (
            <div className="no-data-msg">
              <span>
                {t(`no trades so far`)}
                <a onClick={() => onBtnClick()}>
                  {/* {`buy your $${ticker} tokens`} */}
                  {`${t('buy your')} $${ticker} ${'tokens'}`}
                </a>
                {t(`at the lowest possible price`)}
              </span>
            </div>
          ) : (
            <div className="user-list-wrapper">
              <div className="user-list-column">
                {latestTradeHistoryData
                  .slice(0, 5)
                  .reverse()
                  .map((item: any, index: number) => (
                    <FeedCard
                      user={item}
                      index={window.innerWidth <= 700 ? 0 : index + 1}
                      key={index}
                    />
                  ))}
              </div>
            </div>
          )}
        </>
      </div>
    </section>
  )
}

export default TradeHistory
