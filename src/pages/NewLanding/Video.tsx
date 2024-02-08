import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import HoverVideoPlayer from 'react-hover-video-player'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useTranslation } from 'react-i18next'
import { SocialUrls } from '@root/constants'
import ImageComponent from '@components/ImageComponent'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 912,
      md: 1024,
      lg: 1368,
      xl: 1536,
    },
  },
})

const Video: React.FC = () => {
  const { t } = useTranslation()
  const defaultLanguage = localStorage.getItem('language')

  const getLocaleVideoUrl = () => {
    switch (defaultLanguage) {
      case 'en':
        return SocialUrls.youtubeEn
      case 'de':
        return SocialUrls.youtubeDe
      case 'fr':
        return SocialUrls.youtubeFr
      case 'pt':
        return SocialUrls.youtubePt
      case 'it':
        return SocialUrls.youtubeIt
      case 'es':
        return SocialUrls.youtubeEs
      default:
        return SocialUrls.youtubeEn
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <a href={getLocaleVideoUrl()} className="intro-video">
        <HoverVideoPlayer
          videoSrc="/videos/banner_video.webm"
          pausedOverlay={
            <ImageComponent
              src="thumbnail.webp"
              alt=""
              style={{
                // Make the image expand to cover the video's dimensions
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          }
          loadingOverlay={
            <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
          }
        />
        <div className="intro-watch">
          <div className="h-1">{t('watch the video')}</div>
          <PlayArrowIcon style={{ color: 'white' }} />
        </div>
      </a>
    </ThemeProvider>
  )
}

export default Video
