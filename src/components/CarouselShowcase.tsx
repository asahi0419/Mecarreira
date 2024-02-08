import React, { useEffect, useState } from 'react'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import PlayerImage from './PlayerImage'
import { isMobile } from '@utils/helpers'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import KioskItem from './Card/KioskItem'
import NftSkeletonMobile from './Card/NftSkeletonMobile'
import NftSkeleton from './Card/NftSkeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import ImageComponent from './ImageComponent'
import CircleCarousel from './Carousel/CircleCarousel'

interface Props {
  title: string
  data: any
  isLoading: boolean
  isDeadEnd: boolean
  onNext: (direction: string) => void
  renderHeader?: () => void
  windowSize: any
  iconName?: string
}

const CarouselShowCase: React.FC<Props> = props => {
  const {
    title = '',
    data = [],
    isLoading,
    isDeadEnd,
    onNext,
    windowSize,
    iconName = '',
    renderHeader = () => null,
  } = props
  const { t } = useTranslation()
  const [itemIndex, setItemIndex] = useState(0)
  // const [windowSize, setWindowSize] = useState(0)

  // useEffect(() => {
  //   setWindowSize(window.innerWidth)
  // }, [window.innerWidth])

  return (
    <div className="kiosk-container player-kiosk p-0">
      <div className="kiosk-wrapper">
        {props.renderHeader ? (
          props.renderHeader()
        ) : (
          <span className="kiosk-title-wrapper blog-title text-primary-color">
            {t(`${title}`)}
            {iconName ? (
              <span className={`fi fis fi-${iconName}`}></span>
            ) : null}
          </span>
        )}
        <div
          className={classNames(
            'kiosk-content',
            isMobile() ? 'nft-list-grid-mob' : '',
          )}
        >
          {data?.length > 0 ? (
            <div className="player-list-wrapper itemLists showCase">
              <CircleCarousel
                items={data.map((item: any, index: number) => {
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
                isFinite={true}
                activeIndex={itemIndex}
                setActiveIndex={setItemIndex}
                isKioskMobile={isMobile()}
              />
            </div>
          ) : isLoading ? (
            <div className="d-flex-center">
              {new Array(
                windowSize >= 1600
                  ? 5
                  : windowSize >= 1220
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
                    <NftSkeleton customClass="mr-30" key={index} />
                  )
                })}
            </div>
          ) : (
            <div className="alert-wrapper no-kiosk-data">
              <div className="heading-title unverified-alert">
                {t('no_items_found')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CarouselShowCase
