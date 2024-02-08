import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onClickSubmit: () => void
}

const OfficialMember: React.FC<Props> = ({ onClickSubmit }) => {
  const { t } = useTranslation()
  const [flicker, setFlicker] = useState(true)

  const handleMouseOver = (e: any) => {
    e.stopPropagation()
  }

  const handleMouseOut = (e: any) => {
    e.stopPropagation()
  }

  useEffect(() => {
    console.log({ flicker })
    if (flicker) {
      const jop = document.getElementsByClassName('banner_canvas1')
      document
        .getElementsByClassName('banner_canvas1')[0]
        ?.classList?.add('dim-img')
      document
        .getElementsByClassName('player-animation')[0]
        ?.classList?.add('dim-img1')
    } else {
      document
        .getElementsByClassName('banner_canvas1')[0]
        ?.classList?.remove('dim-img')
      document
        .getElementsByClassName('player-animation')[0]
        ?.classList?.remove('dim-img1')
    }
  }, [flicker])

  return (
    <div className="new-landing-officialmember">
      <div className="new-landing-officialmember-title">
        {t('LAUNCH YOUR OWN OFFICIAL MEMBER CLUB')}
      </div>
      <div className="new-landing-officialmember-content">
        <div className="new-landing-officialmember-content-left">
          <div className="new-landing-officialmember-content-item">
            <div className="new-landing-officialmember-content-title">
              <div className="new-landing-officialmember-content-title-img">
                <img src="/img/official1.webp" alt="official" />
              </div>
              <div className="new-landing-officialmember-content-title-text">
                1. {t('CREATE AN ACCOUNT')}
              </div>
            </div>
            <div className="new-landing-officialmember-content-text">
              {t(
                'Embark on a seamless journey by registering on our platform.',
              )}{' '}
              &nbsp;
              <a target="_blank" onClick={onClickSubmit}>
                *{t('Click here to begin')}*
              </a>
              &nbsp; ({t('If you have a referral code, use it')})
            </div>
          </div>
          <div className="new-landing-officialmember-content-item">
            <div className="new-landing-officialmember-content-title">
              <div className="new-landing-officialmember-content-title-img">
                <img src="/img/official2.webp" alt="official" />
              </div>
              <div className="new-landing-officialmember-content-title-text">
                2. {t('APPLY FOR LISTING')}
              </div>
            </div>
            <div className="new-landing-officialmember-content-text">
              {t('Follow a few simple steps to verify')}
            </div>
          </div>
          <div className="new-landing-officialmember-content-item">
            <div className="new-landing-officialmember-content-title">
              <div className="new-landing-officialmember-content-title-img">
                <img src="/img/official3.webp" alt="official" />
              </div>
              <div className="new-landing-officialmember-content-title-text">
                3. {t('EARN YOUR SPOT')}
              </div>
            </div>
            <div className="new-landing-officialmember-content-text">
              {t(
                "Prove you've got what it takes and compete for your exclusive place among football's elite.",
              )}
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
    </div>
  )
}

export default OfficialMember
