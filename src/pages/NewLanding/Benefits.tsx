import React from 'react'

import { useTranslation } from 'react-i18next'
import LandingFlipCard from '@components/Card/LandingFlipCard'
import { isMobile } from '@utils/helpers'
import CircleCarousel from '@components/Carousel/CircleCarousel'

const Benefits: React.FC = () => {
  const { t } = useTranslation()
  const flipCards = [
    {
      title: t('trade players and profit'),
      desc: t('earn from your skills'),
    },
    {
      title: t('direct access to exclusive'),
      desc: t('start collecting like'),
    },
    {
      title: t('support & benefit from'),
      desc: t('by buying coins of upcoming'),
    },
  ]
  return (
    <>
      <div className="benefits-content">
        <span className="blog-title faq-title capitalize">
          {t(`your benefits`)}
        </span>
        <div className="benefits-desc">
          <>
            {isMobile() ? (
              <CircleCarousel
                items={flipCards.map((data, index) => (
                  <LandingFlipCard
                    title={data.title}
                    desc={data.desc}
                    index={index}
                  />
                ))}
              />
            ) : (
              <>
                {flipCards.map((data, index) => (
                  <LandingFlipCard
                    title={data.title}
                    desc={data.desc}
                    index={index}
                  />
                ))}
              </>
            )}
          </>
        </div>
      </div>
    </>
  )
}

export default Benefits
