import { useTranslation } from 'react-i18next'

import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import TelegramIcon from '@mui/icons-material/Telegram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { SocialUrls } from '@root/constants'
import ImageComponent from '@components/ImageComponent'
import Discord from '@components/Svg/Discord'
import { Divider } from '@mui/material'
import DownloadAppOption from '@components/DownloadAppOption'
import { getBrowserName, isPwa } from '@utils/helpers'

const Socials = ({ showAppInstallOption = false }) => {
  const { t } = useTranslation()
  const currentBrowser = getBrowserName()
  const handleOpenUrl = (social: string) => {
    if (social === 'twitter') {
      window.open(SocialUrls.twitter)
    } else if (social === 'discord') {
      window.open(SocialUrls.discord)
    } else if (social === 'instagram') {
      window.open(SocialUrls.instagram)
    } else if (social === 'youtube') {
      window.open(SocialUrls.youtubeEn)
    } else if (social === 'tiktok') {
      window.open(SocialUrls.tiktok)
    } else if (social === 'telegram') {
      window.open(SocialUrls.telegram)
    }
  }

  return (
    <div className="social-icons-group">
      {showAppInstallOption &&
      window.location.href.includes('/app') &&
      !isPwa() &&
      ['Chrome', 'Safari'].includes(currentBrowser) ? (
        <>
          <DownloadAppOption />
          <div className="bottom-line first-line"></div>
        </>
      ) : null}
      <span className="blog-title h-2">{t('join the community')}</span>
      <div className="social-group">
        <Discord
          className="social-icons svg-primary-color"
          onClick={() => handleOpenUrl('discord')}
        />
        {/* <TelegramIcon
          className="social-icons"
          onClick={() => handleOpenUrl('telegram')}
        /> */}
        <InstagramIcon
          className="social-icons"
          onClick={() => handleOpenUrl('instagram')}
        />
        <TwitterIcon
          className="social-icons"
          onClick={() => handleOpenUrl('twitter')}
        />
        <YouTubeIcon
          className="social-icons"
          onClick={() => handleOpenUrl('youtube')}
        />
      </div>
    </div>
  )
}

export default Socials
