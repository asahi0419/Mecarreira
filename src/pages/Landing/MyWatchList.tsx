import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ContactUs from '@components/Page/Navigation/ContactUs'
import SocialGroup from '@components/Page/Navigation/SocialGroup'
import classNames from 'classnames'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import {
  getWatchListPlayer,
  showPurchaseForm,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import NewPlayerCard from '@components/Card/NewPlayerCard'
import { isMobile } from '@utils/helpers'
import { AppLayout } from '@components/index'
import BaseCardSkeleton from '@components/Card/BaseCardSkeleton'
import TitleSkeleton from '@components/Card/TitleSkeleton'

const MyWatchList: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { watchListData, watchListLoading } = authenticationData
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  useEffect(() => {
    dispatch(getWatchListPlayer())
  }, [])
  const handlePurchaseOpen = useCallback((value: string, data: any) => {
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
  }, [])

  return (
    <AppLayout headerClass="home" hasShadow={true}>
      <div className="player-list-container no-flex">
        {watchListData.length > 0 ? (
          <>
            <div
              className="player-list-wrapper"
              style={{
                textAlign: 'left',
                marginTop: '100px',
                fontSize: isMobile() ? '36px' : '60px',
                justifyContent: isMobile() ? 'center' : 'flex-start',
                textTransform: 'uppercase',
              }}
            >
              {t('my_watchlist')}
            </div>

            <div
              className="player-list-wrapper"
              style={{
                justifyContent:
                  watchListData.length > 6 && !isMobile()
                    ? 'flex-start'
                    : 'center',
                margin: '0px auto 60px auto',
              }}
            >
              {watchListData.map((item: any, index: number) => (
                <div
                  style={{
                    lineHeight: '16px',
                  }}
                  key={index}
                >
                  <NewPlayerCard
                    card={item}
                    // prevData={prevData[index]}
                    key={index + 2}
                    onBuy={() => handlePurchaseOpen('buy', item)}
                    onSell={() => handlePurchaseOpen('sell', item)}
                    playercardjson={item?.playercardjson}
                  />
                </div>
              ))}
            </div>
          </>
        ) : watchListLoading ? (
          <>
            <div
              className="nft-item no-data"
              style={
                isMobile()
                  ? {
                      display: 'block',
                      marginTop: '100px',
                      height: 'auto',
                      padding: '10px',
                      marginLeft: '18%',
                    }
                  : {
                      display: 'block',
                      marginTop: '100px',
                      height: 'auto',
                      padding: '10px',
                    }
              }
            >
              <TitleSkeleton />
            </div>
            <div className="nft-item no-data" style={{ margin: '60px auto' }}>
              {new Array(isMobile() ? 1 : 6)
                .fill(1)
                .map((_: any, index: number) => (
                  <div key={index} style={{ margin: '0px 10px' }}>
                    <BaseCardSkeleton />
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className="heading-title-container">
            <div className="heading-title unverified-alert popup-alert must-text">
              {t('no_profiles_on_watchlist')}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default MyWatchList
