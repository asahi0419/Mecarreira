import React, { useEffect } from 'react'
import '@assets/css/pages/About.css'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import {
  getWalletDetails,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import TeamFaces from '@assets/images/team'
import LinkedinIcon from '@assets/icons/icon/linkedin.svg'
import WikipediaIcon from '@assets/icons/icon/wikipedia.svg'
import ImageComponent from '@components/ImageComponent'

const AboutUsEn: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const { isNoWallet, userName, walletDetailAddress } = authenticationData

  useEffect(() => {
    if (userName) {
      if (accessToken && !walletDetailAddress) {
        dispatch(getWalletDetails()) // COMMENTED FOR PROD
      }
    }
  }, [userName])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

  const getTranslation = (text: string) => {
    const translation = t(text)
    if (translation === text) {
      return text
    } else {
      return translation
    }
  }

  const TeamsLinkedin = {
    alessandro: 'https://www.linkedin.com/in/alessandro-pecorelli-b4885b137/',
    heinz: 'https://www.linkedin.com/in/heinz-ernst-0690b46a/',
    marco: 'https://www.linkedin.com/in/marco-casanova-4b49585/',
    philip: 'https://en.wikipedia.org/wiki/Philipp_Degen',
  }

  return (
    <div className="about-us-content">
      {/* <span className="blog-title faq-title capitalize">{t(`about us`)}</span> */}
      {/* <div className="about-us-container">
        <div className="row">
          <div className="about-us-title">
            {t('make full use of your potential')}
          </div>
          <ImageComponent
            className="about-image"
            loading="lazy"
            src={AboutUsImg1}
            alt=""
          />
        </div>
        <div className="row second">
          <ImageComponent
            className="about-image second-image"
            loading="lazy"
            src={AboutUsImg2}
            alt=""
          />
          <div className="about-article">
            <div className="about-article-title">
              {t('empowering players and fans to')}
            </div>
            <div className="about-article-content">
              {t('we created meCarreira')}
            </div>
          </div>
        </div>
      </div> */}
      <section className="our-story-container">
        <span className="blog-title faq-title capitalize">{t('founders')}</span>
        <div className="about-container col-reverse h-none">
          <div className="about-txt-container h-none">
            <div className="story-block">
              <div
                className="nft-block"
                style={{ backgroundImage: `url(${TeamFaces.heinzNft})` }}
              ></div>
              <div>
                <div className="get-title-wrapper">
                  <div className="get-title h-3">Heinz Ernst</div>
                  <ImageComponent
                    loading="lazy"
                    src={LinkedinIcon}
                    alt=""
                    onClick={() => window.open(TeamsLinkedin.heinz, '_blank')}
                  />
                </div>
                <div className="get-position">CEO & Co-Founder</div>
                <p className="person-desc">
                  {getTranslation('Heinz is a former professional footballer')}
                </p>
                <p className="pg-xl">
                  {'“' + getTranslation('heinz_ernst_team_message') + '”'}
                </p>
                <br />
              </div>
            </div>
            <div className="story-block">
              <div
                className="nft-block"
                style={{ backgroundImage: `url(${TeamFaces.alessandroNft})` }}
              ></div>
              <div>
                <div className="get-title-wrapper">
                  <div className="get-title h-3">Alessandro Pecorelli</div>
                  <ImageComponent
                    loading="lazy"
                    src={LinkedinIcon}
                    alt=""
                    onClick={() =>
                      window.open(TeamsLinkedin.alessandro, '_blank')
                    }
                  />
                </div>
                <div className="get-position">CTO & Co-Founder</div>
                <p className="person-desc">
                  {getTranslation('Alex started coding with 12')}
                </p>
                <p className="pg-xl">
                  {'“' + getTranslation('alex_team_message') + '”'}
                </p>
                <br />
              </div>
            </div>
            <div className="story-block">
              <div
                className="nft-block"
                style={{ backgroundImage: `url(${TeamFaces.marcoNft})` }}
              ></div>
              <div>
                <div className="get-title-wrapper">
                  <div className="get-title h-3">Marco Casanova</div>
                  <ImageComponent
                    loading="lazy"
                    src={LinkedinIcon}
                    alt=""
                    onClick={() => window.open(TeamsLinkedin.marco, '_blank')}
                  />
                </div>
                <div className="get-position">Partnerships & Communication</div>
                <p className="person-desc">
                  {getTranslation('Marco held executive positions')}
                </p>
                <p className="pg-xl review-quote">
                  {'“' + getTranslation('marco_team_message1') + ' '}
                  <a href="https://dev.mecarreira.com/" target="_blank">
                    MeCarreira.com
                  </a>
                  {' ' + getTranslation('marco_team_message2') + ' '}
                  <a href="http://pop-up-brands.com/" target="_blank">
                    POP-UP-BRANDS.com
                  </a>
                  {', ' + getTranslation('marco_team_message3') + '”'}
                </p>
                <br />
              </div>
            </div>
            <div className="story-block">
              <div
                className="nft-block"
                style={{ backgroundImage: `url(${TeamFaces.degenColor})` }}
              ></div>
              <div>
                <div className="get-title-wrapper">
                  <div className="get-title h-3">Philipp Degen</div>
                  <ImageComponent
                    loading="lazy"
                    src={WikipediaIcon}
                    style={{ height: '48px', width: '48px' }}
                    alt=""
                    onClick={() => window.open(TeamsLinkedin.philip, '_blank')}
                  />
                </div>
                <div className="get-position">
                  Football Relations & Co-Founder
                </div>
                <p className="person-desc">
                  {getTranslation('Philipp was a successful professional')}
                </p>
                <p className="pg-xl review-quote">
                  {'“' + getTranslation('philipp_degen_message') + '”'}
                </p>
                <br />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUsEn
