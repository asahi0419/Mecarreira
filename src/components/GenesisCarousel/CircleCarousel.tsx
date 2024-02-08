import React, { useEffect, useRef, useState } from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import '@assets/css/components/Carousel.css'
import classNames from 'classnames'
import { isMobile } from '@utils/helpers'
import leftArrow from '@assets/images/left_angle_bracket.webp'
import rightArrow from '@assets/images/right_angle_bracket.webp'
import ImageComponent from '@components/ImageComponent'

const responsiveItemDefault = {
  0: {
    items: 1,
  },
  912: {
    items: 3,
  },
  1024: {
    items: 3,
  },
  1216: {
    items: 4,
  },
  1600: {
    items: 5,
  },
  1830: {
    items: 6,
  },
}
interface Props {
  items: any
  carouselCallBack?: any
  setActiveIndex?: any
  activeIndex?: number
  isFinite?: boolean
}

const CircleCarousel: React.FC<Props> = ({
  items,
  carouselCallBack,
  setActiveIndex,
  activeIndex,
  isFinite,
}) => {
  const minLength = isMobile() ? 1 : 5

  const [hovered, setHovered] = useState(false)
  const prevItemRef = useRef<any>(null)
  const [changedItem, setChangedItem] = useState(1)

  const handleSlideChange = (evt: any) => {
    setActiveIndex && setActiveIndex(evt.item)
    if (carouselCallBack) {
      setChangedItem(evt.item)
      if (evt.item < prevItemRef.current) {
        if (isMobile()) {
          carouselCallBack(evt.item)
        } else {
          carouselCallBack(evt.item, 'back')
        }
      } else if (evt.item >= prevItemRef.current) {
        if (isMobile()) {
          carouselCallBack(evt.item)
        } else {
          carouselCallBack(evt.item, 'forth')
        }
      }
    }
  }

  useEffect(() => {
    prevItemRef.current = changedItem
  }, [changedItem])

  return (
    <div
      className={classNames(
        'circle-carousel',
        items.length <= 3 ? 'center-carousel' : 'carousel',
      )}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AliceCarousel
        infinite={!isFinite && items.length > minLength}
        mouseTracking
        items={items}
        disableButtonsControls={false}
        keyboardNavigation={true}
        responsive={responsiveItemDefault}
        autoPlayInterval={1000}
        // infinite
        autoPlay={false}
        activeIndex={activeIndex}
        renderPrevButton={() => {
          return items.length > minLength && (isMobile() || hovered) ? (
            <div style={{ opacity: 0.6, transition: '0.5s' }}>
              <ImageComponent
                src={leftArrow}
                alt=""
                className="img-radius carousel-arrow"
                style={{ margin: '2px 5px 2px 0' }}
              />
            </div>
          ) : (
            <div style={{ opacity: 0, transition: '0.5s' }}>
              <ImageComponent
                src={leftArrow}
                alt=""
                className="img-radius carousel-arrow"
                style={{ margin: '2px 5px 2px 0' }}
              />
            </div>
          )
        }}
        renderNextButton={() => {
          return items.length > minLength && (isMobile() || hovered) ? (
            <div style={{ opacity: 0.6, transition: '0.5s' }}>
              <ImageComponent
                src={rightArrow}
                alt=""
                className="img-radius carousel-arrow"
                style={{ margin: '2px 3px 2px 2px' }}
              />
            </div>
          ) : (
            <div style={{ opacity: 0, transition: '0.5s' }}>
              <ImageComponent
                src={rightArrow}
                alt=""
                className="img-radius carousel-arrow"
                style={{ margin: '2px 0 2px 2px' }}
              />
            </div>
          )
        }}
        onSlideChanged={handleSlideChange}
      />
    </div>
  )
}

export default CircleCarousel
