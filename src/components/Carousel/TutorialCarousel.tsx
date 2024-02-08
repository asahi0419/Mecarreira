import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import '@assets/css/components/TutorialCarousel.css'

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
}

const TutorialCarousel: React.FC<Props> = ({ items, responsiveWideMode }) => {
  return (
    <AliceCarousel
      mouseTracking
      autoWidth
      items={items}
      disableButtonsControls={false}
      keyboardNavigation={true}
      renderPrevButton={() => {
        return <></>
      }}
      renderNextButton={() => {
        return <></>
      }}
      infinite={items.length > 3}
    />
  )
}

export default TutorialCarousel
