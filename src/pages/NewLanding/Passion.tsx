import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import PassionItem from '@components/NewLanding/PassionItem'
import '@assets/css/components/NewLandingItem.css'

const Passion: React.FC = () => {
  const { t } = useTranslation()
  const passionData = [
    {
      title: t('Run The Market'),
      child: [
        t(
          "Begin by joining a player's fan club, buying tokens to support who you invest.",
        ),
        t(
          'Buy low on under-the-radar talents and sell high when they become more valuable.',
        ),
        t('When a footballer claims'),
      ],
      img: 'passion1.webp',
    },
    {
      title: t('EXCLUSIVE ACCESS TO PLAYERS'),
      child: [
        t(
          'meCarreira gives you exclusive access to the player, unique football items and real-world experiences.',
        ),
        t(
          'Football Players can now clearly identify and engage with their most dedicated supporters.',
        ),
        t('The amount of Tokens you hold reflects your loyalty and commitment'),
      ],
      img: 'passion2.webp',
    },
    {
      title: t('BECOME A SCOUT, GRIND XP AND GET PAID'),
      child: [
        t('Trade, invest in talents, and earn XP.'),
        t(
          'Rise up the leaderbord for rewards in the form of cash and bragging rights.',
        ),
        t('Democratize football scouting with us and earn community respect.'),
      ],
      img: 'passion3.webp',
    },
    {
      title: t('SUPPORT RISING TALENTS'),
      child: [
        t("Scout, invest in football's future and profit from it."),
        t('Validate your player predictions by having money on the line.'),
        t('The amount of Investment sparks scouts` interest.'),
      ],
      img: 'passion4.webp',
    },
  ]

  return (
    <div className="new-landing-passion">
      <div className="new-landing-passion-title-content">
        <div className="new-landing-title-line">
          <span className="new-landing-passion-title-middle">{t('Turn')}</span>
          <span className="new-landing-passion-title-middle">{t('Your')}</span>
        </div>
        <div className="new-landing-title-line">
          <span className="new-landing-passion-title-large">
            {t('Passion')}
          </span>
          <div className="new-landing-passion-smalltitle-line">
            <span className="new-landing-passion-title-small">{t('Into')}</span>
            <span className="new-landing-passion-title-small">
              {t('Profit')}
            </span>
          </div>
        </div>
      </div>
      <div className="new-landing-passion-container">
        <Splide
          aria-label="My Favorite Images"
          options={{
            direction: 'ltr',
            speed: 1000,
            autoHeight: true,
            autoWidth: true,
            arrows: false,
            waitForTransition: true,
            releaseWheel: false,
            wheel: false,
          }}
        >
          {passionData.map((passionItem, index) => (
            <SplideSlide key={index}>
              <PassionItem passionItem={passionItem} />
            </SplideSlide>
          ))}
        </Splide>
      </div>
      <div></div>
    </div>
  )
}

export default Passion
