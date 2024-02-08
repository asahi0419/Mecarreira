import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DialogBox from '@components/Dialog/DialogBox'
import { isMobile } from '@utils/helpers'
import PlayButton from '@assets/icons/icon/play-button.webp'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setVideoUrl } from '@root/apis/onboarding/authenticationSlice'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import ImageComponent from '@components/ImageComponent'

const Tutorials: React.FC = () => {
  const { t } = useTranslation()
  const [showVideo, setShowVideo] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleShowVideo = async url => {
    if (!isMobile()) {
      setShowVideo(!showVideo)
    } else {
      await dispatch(setVideoUrl(url))
      navigate('/tutorials')
    }
  }

  return (
    <div className="tutorials-container section-wrapper">
      {showVideo ? (
        <DialogBox
          isOpen={showVideo}
          onClose={handleShowVideo}
          contentClass="tutorial-popup"
        >
          <iframe
            width="94%"
            height="91%"
            src="https://www.youtube.com/embed/8x7I3IXu0WA?autoplay=1&mute=1"
          ></iframe>
        </DialogBox>
      ) : null}
      <div className="tutorial-wrapper">
        <div className="section-title">{t('tutorials')}</div>
        <CircleCarousel
          items={[
            <>
              <div className="tutorial-title-wrapper">
                {t('how to launch your own player coin')}
              </div>
              <div className="tutorial-video-wrapper">
                <div
                  style={{
                    background:
                      '#fff url(https://img.youtube.com/vi/8x7I3IXu0WA/maxresdefault.jpg) center center/cover no-repeat',
                  }}
                  className="tutorial-img tutorial-box"
                  onClick={() =>
                    handleShowVideo(
                      'https://www.youtube.com/embed/8x7I3IXu0WA?autoplay=1&mute=0',
                    )
                  }
                >
                  <ImageComponent
                    src={PlayButton}
                    alt=""
                    className="tutorial-playbtn"
                  />
                </div>
              </div>
            </>,
            <>
              <div className="tutorial-title-wrapper">
                {t('how to setup a new trust wallet')}
              </div>
              <div className="tutorial-video-wrapper">
                <div
                  style={{
                    background:
                      '#fff url(https://img.youtube.com/vi/VSZHiwUzoIo/maxresdefault.jpg) center center/cover no-repeat',
                  }}
                  className="tutorial-img tutorial-box"
                  onClick={() =>
                    handleShowVideo(
                      'https://www.youtube.com/embed/VSZHiwUzoIo?autoplay=1&mute=0',
                    )
                  }
                >
                  <ImageComponent
                    src={PlayButton}
                    alt=""
                    className="tutorial-playbtn"
                  />
                </div>
              </div>
            </>,
          ]}
        />
      </div>
    </div>
  )
}

export default Tutorials
