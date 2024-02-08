/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { isMobile } from '@utils/helpers'
import '@assets/css/pages/NftList.css'
import { getPlayer1Contract } from '@root/apis/playerCoins/playerCoinsSlice'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  showWalletForm,
  getPlayerKioskList,
} from '@root/apis/onboarding/authenticationSlice'
import KioskItem from '@components/Card/KioskItem'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'
import NftSkeleton from '@components/Card/NftSkeleton'
import CreateItem from './components/CreateItem'
import DialogBox from '@components/Dialog/DialogBox'
import classNames from 'classnames'

interface FiltersData {
  limit?: string
  offset?: string
  search?: string
}

const PlayerShop: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [showCreateItemForm, setShowCreateItemForm] = useState(false)
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { nextNftsListUrl, getPlayerDetailsSuccessData } = playerCoinData

  const [appliedFilters, setAppliedFilters] = useState<FiltersData>({
    search: '',
  })
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    isNoWallet,
    PlayerKioskList,
    PlayerKioskLoader,
    postFulfillKioskOrderSuccess,
  } = authenticationData

  const [windowSize, setWindowSize] = useState(0)
  const [isDeadEnd, setIsDeadEnd] = useState(false)

  useEffect(() => {
    dispatch(getPlayerKioskList(getPlayerDetailsSuccessData?.playercontract))
    dispatch(
      getPlayer1Contract({ url: getPlayerDetailsSuccessData?.detailpageurl }),
    )
  }, [])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

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
      const paginationParams = getUrlParams(nextNftsListUrl, 'limit', 'offset')
      if (
        nextNftsListUrl &&
        paginationParams.offset !== appliedFilters.offset
      ) {
        setAppliedFilters({ ...appliedFilters, ...paginationParams })
      }
    }
  }

  useEffect(() => {
    if (postFulfillKioskOrderSuccess) {
      dispatch(getPlayerKioskList(getPlayerDetailsSuccessData?.playercontract))
    }
  }, [postFulfillKioskOrderSuccess])

  const closeCreateItemForm = () => {
    setShowCreateItemForm(false)
  }

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

  return (
    <section
      className="nft-list-container player-items"
      style={{
        width: '100%',
        padding: '50px',
      }}
    >
      {getPlayerDetailsSuccessData?.playerlevelid > 2 ? (
        <>
          {' '}
          {showCreateItemForm && (
            <DialogBox
              isOpen={showCreateItemForm}
              onClose={closeCreateItemForm}
            >
              <CreateItem
                nftImg={'https://picsum.photos/200/300'}
                nftId={45}
                onOpenGallery={() => console.log('')}
                onSuccess={() => console.log('')}
                customClass={
                  isMobile() ? 'create-kiosk-item-mob' : 'create-kiosk-item'
                }
                usageMode="kiosk"
              />
            </DialogBox>
          )}
          <div className="kiosk-container player-kiosk all-items">
            <div className="kiosk-wrapper">
              <span className="kiosk-title-wrapper blog-title text-primary-color">
                {t('all_items')}
              </span>
              <div
                className={classNames(
                  'kiosk-content',
                  isMobile() ? 'nft-list-grid-mob' : '',
                )}
              >
                {PlayerKioskList?.length > 0 ? (
                  <InfiniteScroll
                    className="circle-carousel"
                    dataLength={PlayerKioskList?.length}
                    next={() => handleJumpToPage('forth')}
                    hasMore={true}
                    scrollThreshold={0.5}
                    loader={
                      !isDeadEnd && PlayerKioskLoader && !isMobile() ? (
                        <div className="nft-item no-data">
                          {new Array(
                            windowSize >= 1220
                              ? 4
                              : windowSize >= 912
                              ? 3
                              : windowSize >= 320
                              ? 2
                              : 1,
                          )
                            .fill(1)
                            .map((_: any, index: number) => {
                              return isMobile() ? (
                                <NftSkeletonMobile key={index} />
                              ) : (
                                <NftSkeleton key={index} />
                              )
                            })}
                        </div>
                      ) : null
                    }
                    endMessage={
                      <p style={{ textAlign: 'center' }}>
                        <b>. . .</b>
                      </p>
                    }
                  >
                    <div className="player-list-wrapper">
                      {PlayerKioskList?.map((item: any, index: number) => {
                        return isMobile() ? (
                          <KioskItem
                            kioskItem={item}
                            fullFilled={false}
                            buyItem={true}
                            key={index}
                            className={isMobile() ? 'kiosk-item-mobile' : ''}
                          />
                        ) : (
                          <KioskItem
                            kioskItem={item}
                            fullFilled={false}
                            buyItem={true}
                            key={index}
                            className={isMobile() ? 'kiosk-item-mobile' : ''}
                          />
                        )
                      })}
                    </div>
                  </InfiniteScroll>
                ) : PlayerKioskLoader ? (
                  <div className="nft-item no-data">
                    {new Array(
                      windowSize >= 1220
                        ? 4
                        : windowSize >= 912
                        ? 3
                        : windowSize >= 320
                        ? 2
                        : 1,
                    )
                      .fill(1)
                      .map((_: any, index: number) => {
                        return isMobile() ? (
                          <NftSkeletonMobile key={index} />
                        ) : (
                          <NftSkeleton key={index} />
                        )
                      })}
                  </div>
                ) : (
                  <div className="alert-wrapper">
                    <div className="heading-title unverified-alert">
                      {t('no_items_found')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="alert-wrapper">
          <div className="heading-title unverified-alert">
            {t('nothing_to_shop')}
          </div>
        </div>
      )}
    </section>
  )
}

export default PlayerShop
