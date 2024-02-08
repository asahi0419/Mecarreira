import React from 'react'
import { useTranslation } from 'react-i18next'
import HowItWorksImg1 from '@assets/images/how_it_works1.webp'
import HowItWorksImg2 from '@assets/images/how_it_works2.webp'
import HowItWorksImg3 from '@assets/images/how_it_works3.webp'
import HowItWorksImg4 from '@assets/images/how_it_works4.webp'
import ImageComponent from '@components/ImageComponent'

const HowItWorks: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <div className="how-it-works-content">
        <span className="blog-title faq-title capitalize">
          {t(`how it works`)}
        </span>
        <div className="how-it-works-desc">
          <div className="get-container m-60">
            <div className="row">
              <ImageComponent
                className="get-image"
                loading="lazy"
                src={HowItWorksImg1}
                alt=""
              />
              <div className="get-content">
                <div className="get-desc">
                  <div className="get-text pg-title">
                    1. {t('create wallet or account')}
                  </div>
                  <div className="get-text pg-xl">
                    {t('get started easily by creating')}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <ImageComponent
                className="get-image"
                loading="lazy"
                src={HowItWorksImg2}
                alt=""
              />
              <div className="get-content">
                <div className="get-desc">
                  <div className="get-text pg-title">
                    2. {t('load your wallet')}
                  </div>
                  <div className="get-text pg-xl">
                    {t('conveniently top up your account')}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <ImageComponent
                className="get-image"
                loading="lazy"
                src={HowItWorksImg3}
                alt=""
              />
              <div className="get-content">
                <div className="get-desc">
                  <div className="get-text pg-title">
                    3. {t('buy & sell player')}
                  </div>
                  <div className="get-text pg-xl">{t('you are set')}</div>
                </div>
              </div>
            </div>

            <div className="row">
              <ImageComponent
                className="get-image"
                loading="lazy"
                src={HowItWorksImg4}
                alt=""
              />
              <div className="get-content">
                <div className="get-desc">
                  <div className="get-text pg-title">
                    4. {t('access rewards')}
                  </div>
                  <div className="get-text pg-xl">
                    {t('unlock exclusive perks')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HowItWorks
