import React, { useEffect, useState } from 'react'
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
import CircleCarousel from '@components/Carousel/CircleCarousel'
import KioskItemOverview from './KioskItemOverview'

const KioskOverview: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [itemIndex, setItemIndex] = useState(0)
  const [windowSize, setWindowSize] = useState(0)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { kioskCategoriesLoader, kioskCategoriesData } = authenticationData

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

  useEffect(() => {
    setWindowSize(window.innerWidth)
  }, [window.innerWidth])

  return (
    <div
      id={
        !isMobile()
          ? 'kioskOverviewDesktopLanding'
          : 'kioskOverviewMobileLanding'
      }
      className="section-wrapper"
    >
      <div className="section-title">{t('kiosk overview')}</div>
      {/* <div className="section-content  player-carousel">
        {!kioskCategoriesLoader && kioskCategoriesData?.length > 0 ? (
          <CircleCarousel
            items={kioskCategoriesData.map((item: any, index: number) => (
              <KioskItemOverview
                kioskItem={item}
                fullFilled={false}
                buyItem={true}
                disableBuy={true}
                key={index}
                // className={isMobile() ? 'kiosk-item-mobile' : ''}
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
                <KioskSkeleton key={index} />
              ))}
          </>
        )}
      </div> */}
      <section className="profile-display-section">
        <div
          className={classNames(
            'carousel m-auto player-carousel',
            isMobile() ? 'nft-list-grid-mob' : '',
          )}
          style={{
            maxWidth: '1200px',
            // padding: '20px 0px'
          }}
        >
          {!kioskCategoriesLoader && kioskCategoriesData?.length > 0 ? (
            <CircleCarousel
              items={kioskCategoriesData.map((item: any, index: number) => (
                <KioskItemOverview
                  kioskItem={item}
                  fullFilled={false}
                  buyItem={true}
                  disableBuy={true}
                  key={index}
                  // className={isMobile() ? 'kiosk-item-mobile' : ''}
                />
              ))}
              // isFinite={true}
              activeIndex={itemIndex}
              setActiveIndex={setItemIndex}
              isLanding={true}
              customWrapperClass={
                !isMobile() ? 'kiosk-overview-carousel-container' : ''
              }
              // isFixedWidth={true}
              // minCardLength={1}
            />
          ) : (
            <>
              {new Array(
                isMobile()
                  ? 1
                  : windowSize > 1600
                  ? 5
                  : windowSize > 1220
                  ? 4
                  : windowSize > 1024
                  ? 3
                  : 1,
              )
                .fill(1)
                .map((_: any, index: number) => (
                  <div key={index} style={{ margin: '0px 10px' }}>
                    <KioskSkeleton key={index} />
                  </div>
                ))}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default KioskOverview
