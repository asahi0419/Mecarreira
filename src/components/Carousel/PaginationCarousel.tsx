import React, { useState, useRef, useEffect } from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import '@assets/css/components/Carousel.css'
import leftArrow from '@assets/images/left_angle_bracket.webp'
import rightArrow from '@assets/images/right_angle_bracket.webp'
import { isMobile } from '@utils/helpers'
import ImageComponent from '@components/ImageComponent'

const responsiveItemDefault = {
  0: {
    items: 1,
  },
  1024: {
    items: 3,
  },
  1216: {
    items: 4,
  },
}
const responsiveItemWide = {
  0: {
    items: 1,
  },
  1024: {
    items: 3,
  },
}
interface Props {
  items: any
  responsiveWideMode?: any
  carouselCallBack?: any
  setActiveIndex?: any
  isPlayersCoinCarousel?: boolean
  activeIndex?: number
  infinite?: boolean
}

const refObj = {
  '24h_change': '',
  coin_issued: '',
  holders: '',
  id: '',
  matic: '',
}

const PaginationCarousel: React.FC<Props> = ({
  items,
  responsiveWideMode,
  isPlayersCoinCarousel = false,
  carouselCallBack,
  setActiveIndex,
  activeIndex,
  infinite,
}) => {
  const prevItemRef = useRef<any>(null)
  const [changedItem, setChangedItem] = useState(1)

  const handleSlideChange = (evt: any) => {
    if (isPlayersCoinCarousel) {
      setActiveIndex(evt.item)
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
    <AliceCarousel
      mouseTracking
      items={items}
      disableButtonsControls={false}
      keyboardNavigation={true}
      onSlideChanged={handleSlideChange}
      responsive={
        responsiveWideMode ? responsiveItemWide : responsiveItemDefault
      }
      activeIndex={activeIndex}
      autoPlay={false}
      renderPrevButton={() => {
        return items.length >= 3 ? (
          <ImageComponent src={leftArrow} alt="" className="img-radius" />
        ) : (
          <></>
        )
      }}
      renderNextButton={() => {
        return items.length >= 3 ? (
          <ImageComponent src={rightArrow} alt="" className="img-radius" />
        ) : (
          <></>
        )
      }}
      infinite={infinite}
    />
  )
}

export default PaginationCarousel
