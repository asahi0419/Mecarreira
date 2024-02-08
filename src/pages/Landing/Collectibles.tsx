import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  getAllNftsData,
  resetAllNfts,
} from '@root/apis/playerCoins/playerCoinsSlice'
import NftCard from '@components/Card/NftCard'
import { useNavigate } from 'react-router-dom'
import NftSkeleton from '@components/Card/NftSkeleton'
import classNames from 'classnames'
import { isMobile } from '@utils/helpers'
import NftCardMobile from '@components/Card/NftCardMobile'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'

const Collectibles: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { isLoadingNfts, allNftsData } = playerCoinData
  const items: JSX.Element[] = []

  useEffect(() => {
    dispatch(getAllNftsData({ landing_page: true }))
    return () => {
      dispatch(resetAllNfts())
    }
  }, [])

  allNftsData.map((item: any, index: number) =>
    items.push(<NftCard nft={item} key={index} isNavigate={true} />),
  )

  const visibleCardCount =
    window.innerWidth > 3200
      ? 9
      : window.innerWidth > 2500
      ? 8
      : window.innerWidth >= 1900 || isMobile()
      ? 6
      : window.innerWidth >= 1600
      ? 5
      : window.innerWidth >= 1381
      ? 4
      : window.innerWidth >= 1081
      ? 3
      : window.innerWidth >= 701
      ? 2
      : 1

  return (
    <div className="section-wrapper">
      <div className="section-title">{t('nfts')}</div>
      <div className="section-desc">
        {t('best_nft_collectibles')} &nbsp;
        <a onClick={() => navigate('/app/nfts')} className="more-view">
          {t('show more')}
        </a>
      </div>
      <div
        className={classNames(
          'section-content',
          isMobile()
            ? 'nft-list-grid-mob collectible-mob'
            : 'nft-list-grid fullwidth',
        )}
      >
        {isLoadingNfts ? (
          <div
            className={classNames(
              'nft-line-ex',
              isMobile() ? 'nft-list-grid-mob' : 'nft-list-grid fullwidth',
            )}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              className={classNames(isMobile() ? '' : 'fullwidth')}
              style={{ display: 'flex', gap: '20px', overflow: 'hidden' }}
            >
              {new Array(isMobile() ? 1 : visibleCardCount)
                .fill(1)
                .map((_: any, index: number) => {
                  return isMobile() ? (
                    <NftSkeletonMobile key={index} />
                  ) : (
                    <NftSkeleton key={index} />
                  )
                })}
            </div>
          </div>
        ) : (
          <>
            {allNftsData
              .slice(0, visibleCardCount * 2)
              .map((item: any, index: number) => {
                return isMobile() ? (
                  <NftCardMobile nft={item} key={index} isNavigate={true} />
                ) : (
                  <NftCard nft={item} key={index} isNavigate={true} />
                )
              })}
          </>
        )}
      </div>
    </div>
  )
}

export default Collectibles
