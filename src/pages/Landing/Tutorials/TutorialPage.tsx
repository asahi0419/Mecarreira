import { useState } from 'react'
import { AppLayout } from '@components/index'
import { isMobile } from '@utils/helpers'
import { useEffect } from 'react'
import PlayButton from '@assets/icons/icon/play-button.webp'
import { useTranslation } from 'react-i18next'
import DialogBox from '@components/Dialog/DialogBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { setVideoUrl } from '@root/apis/onboarding/authenticationSlice'
import ImageComponent from '@components/ImageComponent'

const VideoItem = (props: any) => {
  const { thumbUrl, handleClick, title } = props
  return (
    <div className="video-item">
      {isMobile() ? (
        <>
          <div className="page-mobile-link h-4 text-left">{title}</div>
          <div
            style={{
              background: `#fff url(${thumbUrl}) center center/cover no-repeat`,
            }}
            className="tutorial-box"
            onClick={handleClick}
          >
            <ImageComponent
              src={PlayButton}
              alt=""
              className="tutorial-playbtn"
            />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              background: `#fff url(${thumbUrl}) center center/cover no-repeat`,
            }}
            className="tutorial-box"
            onClick={handleClick}
          >
            <ImageComponent
              src={PlayButton}
              alt=""
              className="tutorial-playbtn"
            />
          </div>
          <div className="page-link h-4 text-left">{title}</div>
        </>
      )}
    </div>
  )
}

const TutorialsPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [activeVideo, setActiveVideo] = useState('')
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { videoUrl } = authenticationData

  useEffect(() => {
    if (videoUrl && isMobile()) {
      setActiveVideo(videoUrl)
    }
  }, [videoUrl])

  useEffect(() => {
    document.body.style.backgroundColor = '#171923'
    return () => {
      document.body.style.backgroundColor = '#222435'
      dispatch(setVideoUrl(''))
    }
  }, [])

  const handleCloseVideo = () => {
    setActiveVideo('')
  }

  return (
    <AppLayout noPageFooter={true}>
      {activeVideo ? (
        <>
          {isMobile() ? (
            <div className="tutorial-video-container">
              <iframe width="100%" height="100%" src={activeVideo}></iframe>
              <div
                className="close-button mt-30 mb-30"
                onClick={handleCloseVideo}
              >
                {t('close')}
              </div>
            </div>
          ) : (
            <DialogBox
              isOpen={activeVideo !== ''}
              onClose={handleCloseVideo}
              contentClass="tutorial-page-popup"
            >
              <iframe width="95.5%" height="91%" src={activeVideo}></iframe>
            </DialogBox>
          )}
        </>
      ) : (
        <>
          <div className="tutorial-section-title">{t('tutorials')}</div>
          <ul className="container-tutorial tutorial-float">
            <li className="tutorial-item tutorial-float-item">
              <VideoItem
                thumbUrl="https://img.youtube.com/vi/8x7I3IXu0WA/maxresdefault.jpg"
                handleClick={() =>
                  setActiveVideo(
                    'https://www.youtube.com/embed/8x7I3IXu0WA?autoplay=1&mute=0',
                  )
                }
                title={t('how to launch your own player coin')}
              />
            </li>
            <li className="tutorial-item tutorial-float-item">
              <VideoItem
                thumbUrl="https://img.youtube.com/vi/VSZHiwUzoIo/maxresdefault.jpg"
                handleClick={() =>
                  setActiveVideo(
                    'https://www.youtube.com/embed/VSZHiwUzoIo?autoplay=1&mute=0',
                  )
                }
                title={t('how to setup a new trust wallet')}
              />
            </li>
          </ul>
        </>
      )}
    </AppLayout>
  )
}

export default TutorialsPage
