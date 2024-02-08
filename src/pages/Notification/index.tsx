/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import '@assets/css/pages/Notification.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { getNotifications } from '@root/apis/notification/notificationSlice'
import {
  getAllNotifications,
  showSignupForm,
  showWalletForm,
  showNftForm,
  showPurchaseForm,
  showStakingForm,
  setShowMore,
  breakLiveNotifications,
} from '@root/apis/onboarding/authenticationSlice'
import { useTranslation } from 'react-i18next'
import NotificationItem from './components/NotificationItem'
import { isMobile } from '@utils/helpers'
import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'

interface FiltersData {
  limit?: string
  offset?: string
  search?: string
  type?: string
}

const Notifications: React.FC = () => {
  const { t } = useTranslation()
  // const { dataPersisted, persistData } = useDataPersist
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    isSignupFormVisible,
    isWalletFormVisible,
    isPurchaseFormVisible,
    isStakingFormVisible,
    isNftFormVisible,
    getNotificationData,
    notificationLoader,
    selectedThemeRedux,
    nextNotificationUrl,
  } = authenticationData
  const [itemList, setItemList] = useState<any>([])
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    offset: '0',
  })
  const getUrlParams = (url: string, param1: string, param2: string) => {
    if (!url) {
      return url
    }
    const url_string = url
    const newUrl = new URL(url_string)
    const obj: any = new Object()
    obj[param1] = newUrl.searchParams.get(param1)
    obj[param2] = newUrl.searchParams.get(param2)
    return obj
  }
  useEffect(() => {
    console.log('appliedFiter', appliedFilters)
    if (
      appliedFilters?.limit ||
      appliedFilters?.offset ||
      appliedFilters?.type ||
      appliedFilters?.search
    ) {
      dispatch(getAllNotifications(appliedFilters))
    }
  }, [appliedFilters])
  useEffect(() => {
    dispatch(getNotifications())
    dispatch(breakLiveNotifications(true))
    // dispatch(getAllNotifications(appliedFilters))
    document.querySelector('title')!.innerText = 'Notifications of meCarreira'
    if (isMobile()) {
      if (isSignupFormVisible) {
        dispatch(showSignupForm())
      }
      if (isWalletFormVisible) {
        dispatch(showWalletForm({}))
      }
      if (isPurchaseFormVisible) {
        dispatch(showPurchaseForm({}))
      }
      if (isStakingFormVisible) {
        dispatch(showStakingForm({}))
      }
      if (isNftFormVisible) {
        dispatch(showNftForm({}))
      }
    }
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const handleJumpToPage = (head: string) => {
    console.log('hello scroll')
    try {
      if (head !== 'back') {
        const paginationParams = getUrlParams(
          nextNotificationUrl,
          'limit',
          'offset',
        )
        if (
          nextNotificationUrl &&
          paginationParams.offset !== appliedFilters.offset
        ) {
          setIsDeadEnd(false)
          setAppliedFilters({ ...appliedFilters, ...paginationParams })
        } else {
          setIsDeadEnd(true)
        }
      }
    } catch (err) {
      console.log('err', err)
    }
  }
  useEffect(() => {
    console.log('appliedFilters Data', appliedFilters)
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        if (!nextNotificationUrl) {
          setIsDeadEnd(true)
          setItemList(getNotificationData)
        } else {
          const url_string = nextNotificationUrl
          const url = new URL(url_string)
          const obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
          if (appliedFilters.offset === obj.offset) {
            setIsDeadEnd(true)
            setItemList(getNotificationData)
          } else {
            if (getNotificationData.length === 0) {
              setIsDeadEnd(true)
            }
            setItemList([...itemList, ...getNotificationData])
          }
        }
      } else {
        if (getNotificationData.length > 0) {
          setItemList([...itemList, ...getNotificationData])
        } else if (getNotificationData.length === 0) {
          setIsDeadEnd(true)
        }
      }
    } else {
      setItemList(getNotificationData)
    }
  }, [getNotificationData])

  useEffect(() => {
    return () => {
      dispatch(setShowMore(false))
      dispatch(breakLiveNotifications(false))
    }
  }, [])
  return (
    <AppLayout className="notifications-live" footerStatus="footer-status">
      {notificationLoader ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '250px',
          }}
        >
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="black-box">
          <div className="notification_scroll">
            {itemList.length > 0 ? (
              // getNotificationData.map((item: any, index: any) => (

              //   <NotificationItem
              //     item={item}
              //     key={index}
              //     index={index}
              //     isMenu={false}
              //     className="notification-title-color"
              //   />
              // ))
              <InfiniteScroll
                className="player-list-pagination no-scroll-horizontal"
                dataLength={itemList?.length}
                next={() => handleJumpToPage('forth')}
                scrollThreshold={0.5}
                hasMore={getNotificationData.length === 0 ? false : true}
                loader={
                  !isDeadEnd ? (
                    <h4
                      style={{
                        textAlign: 'center',
                        paddingBottom: '20px',
                      }}
                    >
                      {t('loading')}...
                    </h4>
                  ) : (
                    ''
                  )
                }
                endMessage={
                  <p style={{ textAlign: 'center', paddingBottom: '20px' }}>
                    <b>{t('end of results')}</b>
                  </p>
                }
              >
                {console.log({ itemList })}
                {itemList.map((item: any, index: any) => (
                  <NotificationItem
                    item={item}
                    key={index}
                    index={index}
                    isMenu={false}
                    className="notification-title-color"
                  />
                ))}
              </InfiniteScroll>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div className="heading-title unverified-alert no-notifications">
                  {t('no notifications found')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  )
}

export default Notifications
