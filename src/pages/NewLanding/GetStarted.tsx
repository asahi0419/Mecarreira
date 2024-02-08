import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DiscordIcon from '@assets/icons/icon/discord1.svg'
import { SocialUrls } from '@root/constants'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import TelegramIcon from '@mui/icons-material/Telegram'
import { useLocation, useNavigate } from 'react-router-dom'
import ImageComponent from '@components/ImageComponent'
import { useDispatch, useSelector } from 'react-redux'
import {
  setActiveTab,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'

interface Props {
  onClickSubmit: () => void
}

const GetStarted: React.FC<Props> = ({ onClickSubmit }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const navigate = useNavigate()
  const { QualificationSettingData } = authenticationData
  const location: any = useLocation()
  const pathname = location.pathname
  const [flicker, setFlicker] = useState(true)
  // useEffect(() => {
  //   $(document).mouseover(function (e) {
  //     e.stopPropagation()
  //     const playerAnimationId = $(e.target).attr('id')
  //     console.log('OORES-', playerAnimationId)
  //     if (['playerAnimation'].includes(playerAnimationId)) {
  //       $('.banner_canvas1').addClass('dim-img')
  //       $('.player-animation').addClass('dim-img1')
  //     } else {
  //       $('.banner_canvas1').removeClass('dim-img')
  //       $('.player-animation').removeClass('dim-img1')
  //     }
  //   })
  // }, [])

  const handleOpenUrl = (social: string) => {
    if (social === 'twitter') {
      window.open(SocialUrls.twitter)
    } else if (social === 'instagram') {
      window.open(SocialUrls.instagram)
    } else if (social === 'telegram') {
      window.open(SocialUrls.telegram)
    } else if (social === 'discord') {
      window.open(SocialUrls.discord)
    }
  }

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>,
    id: string,
  ) => {
    window.history.replaceState(null, 'Buy', '/')
    if (pathname !== '/') {
      navigate('/' + id)
    } else {
      const anchor = (
        (event.target as HTMLDivElement).ownerDocument || document
      ).querySelector(id)

      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth' })
      }
    }
    // dispatch(setNagivated(true))
  }

  const handleMouseOver = (e: any) => {
    e.stopPropagation()
    // setFlicker(true)
    // console.log('ssl', e)
    // e.stopPropagation()
    // $('.banner_canvas1').addClass('dim-img')
    // $('.player-animation').addClass('dim-img1')
  }

  const handleMouseOut = (e: any) => {
    e.stopPropagation()
    // setFlicker(false)
    // $('.banner_canvas1').removeClass('dim-img')
    // $('.player-animation').removeClass('dim-img1')
  }

  useEffect(() => {
    console.log({ flicker })
    if (flicker) {
      // $('.banner_canvas1').addClass('dim-img')
      // $('.player-animation').addClass('dim-img1')
      const jop = document.getElementsByClassName('banner_canvas1')
      console.log({ jop })
      document
        .getElementsByClassName('banner_canvas1')[0]
        ?.classList?.add('dim-img')
      document
        .getElementsByClassName('player-animation')[0]
        ?.classList?.add('dim-img1')
    } else {
      // $('.banner_canvas1').removeClass('dim-img')
      // $('.player-animation').removeClass('dim-img1')
      document
        .getElementsByClassName('banner_canvas1')[0]
        ?.classList?.remove('dim-img')
      document
        .getElementsByClassName('player-animation')[0]
        ?.classList?.remove('dim-img1')
    }
  }, [flicker])

  const isLoggedIn =
    Boolean(localStorage.getItem('loginInfo')) ||
    Boolean(localStorage.getItem('loginId'))

  return (
    <div className="get-started-section-content canvas_overlap">
      <div className="new-launch-title">
        <div className="new-nft-title">{t('turn_your_passion_into_money')}</div>
        <div className="new-nft-content pg-xl">
          {t('trade_football_players_like')}
        </div>
        <div className="get-started-buttons">
          <div
            // className={`get-more-btn ${isLoggedIn ? 'disabled' : ''}`}
            className="get-more-btn"
            onClick={onClickSubmit}
          >
            {isLoggedIn ? t('Launch App') : t('get started')}
          </div>
          <div className="social-group">
            <ImageComponent
              loading="lazy"
              src={DiscordIcon}
              alt=""
              className="social-icons"
              onClick={() => handleOpenUrl('discord')}
            />
            <TelegramIcon
              className="social-icons"
              onClick={() => handleOpenUrl('telegram')}
            />
            <InstagramIcon
              className="social-icons"
              onClick={() => handleOpenUrl('instagram')}
            />
            <TwitterIcon
              className="social-icons"
              onClick={() => handleOpenUrl('twitter')}
            />
          </div>
        </div>
      </div>
      <div
        id="playerAnimation"
        className="player-animation"
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
      />
    </div>
  )
}

export default GetStarted
