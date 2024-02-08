import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import '@assets/css/components/Carousel.css'
import leftArrow from '@assets/images/left_angle_bracket.webp'
import rightArrow from '@assets/images/right_angle_bracket.webp'
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
  isFinite?: any
}

const Carousel: React.FC<Props> = ({ items, responsiveWideMode, isFinite }) => {
  return (
    <div className={items.length <= 3 ? 'center-carousel' : 'carousel'}>
      <AliceCarousel
        infinite={items.length > 3 && !isFinite}
        mouseTracking
        items={items}
        disableButtonsControls={false}
        keyboardNavigation={true}
        responsive={
          responsiveWideMode ? responsiveItemWide : responsiveItemDefault
        }
        autoPlayInterval={1000}
        // infinite
        autoPlay={false}
        renderPrevButton={() => {
          return items.length > 3 ? (
            <ImageComponent loading="lazy" src={leftArrow} alt="" className="img-radius" />
          ) : (
            <></>
          )
        }}
        renderNextButton={() => {
          return items.length > 3 ? (
            <ImageComponent
              loading="lazy"
              src={rightArrow}
              alt=""
              className="img-radius"
            />
          ) : (
            <></>
          )
        }}
      />
    </div>
  )
}

export default Carousel
