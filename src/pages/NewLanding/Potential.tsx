import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/components/NewLandingItem.css'
import PotentialItem from '@components/NewLanding/PotentialItem'

const Potential: React.FC = () => {
  const { t } = useTranslation()
  const potentialData = [
    {
      id: 1,
      title: t('SHARE THE VICTORY'),
      child: [
        `${t(
          "Fans can benefit from a player's achievements by trading their tokens.",
        )} ${t(
          "This deepens fans' investment in your success, supporting you in both on the football field and in life",
        )}`,
      ],
      img: 'potential1.webp',
    },
    {
      id: 2,
      title: t('YOU`RE OWN OFFICIAL PFC'),
      child: [
        `${t(
          'A brand new tool to identify and engage with your most dedicated supporters.',
        )} ${t(
          'Leverage your personal digital brand by launching your own official member club.',
        )}`,
      ],
      img: 'potential2.webp',
    },
    {
      id: 3,
      title: t('MONETIZE YOUR PERSONALITY'),
      child: [
        t('Earnings on each transaction.'),
        `${t(
          'Selling real items or digital goods through your own official member club',
        )} ${t(
          'An everlasting revenue stream beyond the lifespan of a sports career',
        )}`,
      ],
      img: 'potential3.webp',
    },
  ]

  return (
    <div
      className={`new-landing-potential ${
        window.innerWidth <= 640 ? 'mobile' : ''
      }`}
    >
      <div className="new-landing-potential-title-content">
        <div className="new-landing-title-line">
          <span className="new-landing-potential-title-large">
            {t('TAKE')} <span>{t('YOUR')}</span>
          </span>
        </div>
        <div className="new-landing-title-line">
          <span className="new-landing-potential-title-large">
            {t('POTENTIAL')}
          </span>
          <span className="new-landing-potential-smalltitle">
            {t('TO')} <br />
            {t('NEW')}
          </span>
        </div>
        <div className="new-landing-title-line">
          <span className="new-landing-potential-title-large">
            {t('HEIGHTS')}
          </span>
        </div>
      </div>
      <div className="new-landing-potential-container">
        <div className="align-end">
          <PotentialItem
            potentialItem={potentialData[0]}
            classname="adjust-bottom"
          />
        </div>
        <div className="align-center">
          <PotentialItem
            potentialItem={potentialData[1]}
            classname="adjust-center"
          />
        </div>
        <div className="align-start">
          <PotentialItem potentialItem={potentialData[2]} />
        </div>
      </div>
    </div>
  )
}

export default Potential
