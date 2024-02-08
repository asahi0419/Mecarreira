import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { getLandingKioskData } from '@root/apis/playerCoins/playerCoinsSlice'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { isMobile } from '@utils/helpers'
import KioskSkeleton from '@components/Card/KioskSkeleton'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'
import KioskItem from '@components/Card/KioskItem'

const Kiosk: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { isLoadingKiosk, landingKioskData } = playerCoinData

  useEffect(() => {
    dispatch(getLandingKioskData())
  }, [])

  const visibleCardCount =
    window.innerWidth >= 1900 || isMobile()
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
      <div className="section-title">{t('players kiosk')}</div>
      <div className="section-desc">
        {t('unique_and_individual_items')} &nbsp;
        <a onClick={() => navigate('/app/kiosk')} className="more-view">
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
        {isLoadingKiosk ? (
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
                    <KioskSkeleton key={index} />
                  )
                })}
            </div>
          </div>
        ) : (
          <>
            {landingKioskData
              .slice(0, visibleCardCount * 2)
              .map((item: any, index: number) => (
                <KioskItem
                  kioskItem={item}
                  fullFilled={false}
                  buyItem={true}
                  disableBuy={true}
                  key={index}
                  className={isMobile() ? 'kiosk-item-mobile' : ''}
                />
              ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Kiosk
