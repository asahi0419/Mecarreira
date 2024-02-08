/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import '@assets/css/pages/UserList.css'
import UserCard from '@components/Card/UserCard'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { initTagManager, isMobile } from '@utils/helpers'
import PlayerListTabGroup from '@pages/PlayerList/components/PlayerListTabGroup'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import {
  getUserRankingList,
  resetUserProfileData,
  resetUserRankingList,
} from '@root/apis/onboarding/authenticationSlice'
import UserCardSkeleton from '@components/Card/UserCardSkeleton'
import InfiniteScroll from 'react-infinite-scroll-component'

const UserList: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('season')
  const [scrollIndex, setScrollIndex] = useState(0)
  const [searchedTerm, setSearchedTerm] = useState<string | undefined>('')
  const [userList, setUserList] = useState<any>([])
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<any>({
    search: '',
    type: 'overview',
    offset: 0,
  })

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    loadingUserRankingList,
    userRankingList,
    nextUserRankingListUrl,
    userRankingListCount,
    isUserRankingListSuccess,
  } = authenticationData

  useEffect(() => {
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = 'Ranking of Users'
    // document
    //   .querySelector("meta[name='description']")!
    //   .setAttribute(
    //     'content',' Profile showing all player coins & balances',
    //   )
    dispatch(resetUserProfileData())
    return () => {
      dispatch(resetUserRankingList())
    }
  }, [])

  useEffect(() => {
    if (
      appliedFilters?.limit ||
      appliedFilters?.offset ||
      appliedFilters?.type ||
      appliedFilters?.search
    ) {
      dispatch(getUserRankingList(appliedFilters))
    }
  }, [appliedFilters])

  const handleGetTab = (tab: string) => {
    setActiveTab(tab)
    setUserList([])
    let newParams: any = { type: tab }
    if (searchedTerm) {
      newParams = { ...newParams, search: searchedTerm }
    }
    setAppliedFilters(newParams)
  }

  const handleSearch = (value: string | undefined) => {
    setUserList([])
    setIsDeadEnd(false)
    let request: any = {}
    setSearchedTerm(value)
    request = {
      limit: '10',
      offset: '0',
      search: value || '',
    }
    setAppliedFilters({ ...request })
  }

  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])

  const handleCloseSearch = () => {
    setSearchedTerm('')
    let newParams: any = { type: activeTab }
    if (searchedTerm) {
      newParams = { ...newParams, search: searchedTerm }
    }
    setAppliedFilters(newParams)
  }

  useEffect(() => {
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        if (!nextUserRankingListUrl) {
          setIsDeadEnd(true)
          setUserList(userRankingList)
        } else {
          const url_string = nextUserRankingListUrl
          const url = new URL(url_string)
          const obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
          if (appliedFilters.offset === obj.offset) {
            setIsDeadEnd(true)
            setUserList(userRankingList)
          } else {
            if (userRankingList.length === 0) {
              setIsDeadEnd(true)
            }
            setUserList([...userList, ...userRankingList])
          }
        }
      } else {
        if (userRankingList.length > 0 && isUserRankingListSuccess) {
          setUserList([...userList, ...userRankingList])
        } else if (userRankingList.length === 0 && isUserRankingListSuccess) {
          setIsDeadEnd(true)
        }
      }
    } else {
      setUserList(userRankingList)
    }
  }, [userRankingList])

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

  const handleJumpToPage = (head: string) => {
    if (head !== 'back') {
      const paginationParams = getUrlParams(
        nextUserRankingListUrl,
        'limit',
        'offset',
      )
      if (nextUserRankingListUrl && userRankingListCount) {
        setIsDeadEnd(false)
        setAppliedFilters({ ...appliedFilters, ...paginationParams })
      } else {
        setIsDeadEnd(true)
      }
    }
  }

  return (
    <AppLayout headerStatus="header-status" headerClass="home" hasShadow={true}>
      <div className="user-list-container">
        <div
          style={{ position: 'relative' }}
          className={classNames(
            'tab-bar-container',
            isMobile() ? 'players-list-tabgroup' : '',
          )}
        >
          <PlayerListTabGroup
            isHot
            defaultTab={activeTab}
            getScrollIndex={(index: number) => setScrollIndex(index)}
            tabSet={['season', 'overview']}
            getSwitchedTab={handleGetTab}
            scrollTo={scrollIndex}
            hasSearchBar={true}
            onEdit={optimizedHandleSearch}
            onClose={handleCloseSearch}
          />
        </div>
        <div className="section-wrapper">
          <span className="blog-title">
            {t(activeTab === 'overview' ? 'user ranking' : 'season ranking')}
          </span>
          {loadingUserRankingList && userList.length === 0 ? (
            <div className="user-list-wrapper">
              <div className="user-list-column">
                {new Array(5)
                  .fill(1)
                  .slice(0, 5)
                  .map((_: any, index: number) => (
                    <UserCardSkeleton key={index} />
                  ))}
              </div>
              {window.innerWidth > 1300 ? (
                <div className="user-list-column">
                  {new Array(5)
                    .fill(1)
                    .slice(0, 5)
                    .map((_: any, index: number) => (
                      <UserCardSkeleton key={index} />
                    ))}
                </div>
              ) : null}
            </div>
          ) : userList.length > 0 ? (
            <>
              {searchedTerm !== '' ? ( // search mode
                <div className="user-list-wrapper">
                  <div className="user-list-column">
                    {userList
                      .filter((_: any, index: number) =>
                        window.innerWidth > 1300 ? index % 2 === 0 : true,
                      )
                      .map((item: any, index: number) => (
                        <UserCard
                          user={item}
                          index={
                            window.innerWidth > 1300 ? index * 2 + 1 : index + 1
                          }
                          key={index}
                        />
                      ))}
                  </div>
                  {window.innerWidth > 1300 ? (
                    <div className="user-list-column">
                      {userList
                        .filter((_: any, index: number) => index % 2 === 1)
                        .map((item: any, index: number) => (
                          <UserCard
                            user={item}
                            index={index * 2 + 2}
                            key={index}
                          />
                        ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={userList.length}
                  next={() => handleJumpToPage('forth')}
                  hasMore={true}
                  scrollThreshold={0.5}
                  loader={
                    !isDeadEnd ? (
                      <div className="user-list-wrapper">
                        <div className="user-list-column">
                          {new Array(2)
                            .fill(1)
                            .slice(0, 5)
                            .map((_: any, index: number) => (
                              <UserCardSkeleton key={index} />
                            ))}
                        </div>
                        {window.innerWidth > 1300 ? (
                          <div className="user-list-column">
                            {new Array(2)
                              .fill(1)
                              .slice(0, 5)
                              .map((_: any, index: number) => (
                                <UserCardSkeleton key={index} />
                              ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null
                  }
                  endMessage={
                    <p style={{ textAlign: 'center' }}>
                      <b>. . .</b>
                    </p>
                  }
                >
                  <div
                    className={classNames(
                      'user-list-wrapper',
                      activeTab === 'season' ? 'season-list' : '',
                    )}
                  >
                    <div className="user-list-column">
                      {userList
                        .filter((_: any, index: number) =>
                          window.innerWidth > 1300 ? index % 2 === 0 : true,
                        )
                        .map((item: any, index: number) => (
                          <UserCard
                            user={item}
                            index={
                              window.innerWidth > 1300
                                ? index * 2 + 1
                                : index + 1
                            }
                            key={index}
                          />
                        ))}
                    </div>
                    {window.innerWidth > 1300 ? (
                      <div className="user-list-column">
                        {userList
                          .filter((_: any, index: number) => index % 2 === 1)
                          .map((item: any, index: number) => (
                            <UserCard
                              user={item}
                              index={index * 2 + 2}
                              key={index}
                            />
                          ))}
                      </div>
                    ) : null}
                  </div>
                </InfiniteScroll>
              )}
            </>
          ) : isUserRankingListSuccess ? (
            <div className="alert-wrapper">
              <div className="heading-title unverified-alert">
                {t('no users found')}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </AppLayout>
  )
}

export default UserList
