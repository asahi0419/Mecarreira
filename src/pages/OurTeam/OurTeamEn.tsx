import React, { useEffect } from 'react'
import { isMobile } from '@utils/helpers'
import '@assets/css/pages/OurTeam.css'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import Clause from '@pages/Terms&Policy/components/Clause'
import { TeamMembers } from '@root/constants'
import TeamFaces from '@assets/images/team'
import { useSelector, useDispatch } from 'react-redux'
import {
  getWalletDetails,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import ImageComponent from '@components/ImageComponent'
interface TeamMemberCardProps {
  img?: string
  fullName: string
  companyTitle: React.ReactNode
  description: string
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  img = '',
  fullName,
  companyTitle,
  description,
}) => {
  return (
    <div className={classNames('team-member-container')}>
      <ImageComponent
        className={classNames('team-member-img', img ? '' : 'hidden')}
        src={img}
      />
      <div className={classNames('team-member-img', img ? 'hidden' : '')}></div>
      <div className="member-info-wrapper">
        <div className="member-intro-box">
          <div className="terms-subtitle ct-h4">{fullName}</div>
          <div className="ct-p1 designation">{companyTitle}</div>
        </div>
        <p className="terms-content ct-p3">{description}</p>
      </div>
    </div>
  )
}

const OurTeamEn: React.FC = () => {
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

  return (
    <>
      <div className="our-team-container">
        <Clause
          title={t('our team')}
          isMainTitle
          containerClass="our-team-intro text-center m-0"
        >
          <div className="terms-content ct-p1 text-center">
            {getTranslation('team is made of people socialized in team sports')}
          </div>
        </Clause>
        <div className="team-display">
          <div className="team-container h-none">
            {TeamMembers.map(item => (
              <TeamMemberCard
                img={item.img}
                fullName={item.fullName}
                companyTitle={getTranslation(item.companyTitle)}
                description={getTranslation(item.description)}
              />
            ))}
          </div>
        </div>
      </div>
      <section className="our-story-container">
        <div
          className={classNames(
            'values-header about-txt-container m-auto',
            isMobile() ? '' : 'hidden',
          )}
        >
          <div className="p-0 ct-h1 m-auto">{t('our story')}</div>
        </div>
        <div className="about-container col-reverse h-none">
          <div className="about-txt-container h-none">
            <div
              className={classNames(
                'about-intro-heading story-title ct-h1',
                isMobile() ? 'hidden' : '',
              )}
            >
              {t('our story')}
            </div>
            {isMobile() && <br />}
            <div className="get-title h-3">
              {getTranslation('why each member belief')}
            </div>
            <br />
            <div className="story-block">
              <div
                className="nft-block"
                style={{ backgroundImage: `url(${TeamFaces.heinzNft})` }}
              ></div>
              <div>
                <div className="get-title h-3">Heinz Ernst:</div>
                <p className="ct-p1">
                  {getTranslation('heinz_ernst_team_message')}
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
                <div className="get-title h-3">Alessandro Pecorelli:</div>
                <p className="ct-p1">{getTranslation('alex_team_message')}</p>
                <br />
              </div>
            </div>
            <div className="story-block">
              <div
                className="nft-block"
                style={{ backgroundImage: `url(${TeamFaces.marcoNft})` }}
              ></div>
              <div>
                <div className="get-title h-3">Marco Casanova:</div>
                <p className="ct-p1 review-quote">
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
                style={{ backgroundImage: `url(${TeamFaces.thomasNft})` }}
              ></div>
              <div>
                <div className="get-title h-3">Thomas Temperli:</div>
                <p className="ct-p1 review-quote">
                  {getTranslation('thomas_team_message1') + ' '}
                  <a href="https://dev.mecarreira.com/" target="_blank">
                    MeCarreira.com
                  </a>
                  {' ' + getTranslation('thomas_team_message2') + ' '}
                  <a href="https://dev.mecarreira.com/" target="_blank">
                    MeCarreira.com
                  </a>
                  {' ' + getTranslation('thomas_team_message3')}
                </p>
                <br />
              </div>
            </div>
            <div className="story-block">
              <div
                className="nft-block"
                style={{ backgroundImage: `url(${TeamFaces.matthiasNft})` }}
              ></div>
              <div>
                <div className="get-title h-3">Mathias Walter:</div>
                <p className="ct-p1 review-quote">
                  {getTranslation('the possibilities') + ' '}
                  <a href="https://dev.mecarreira.com/" target="_blank">
                    MeCarreira.com
                  </a>
                  {' ' + getTranslation('mathias_team_message_alt')}
                </p>
                <br />
                <p className="ct-p1 review-quote">
                  {getTranslation('every footballer knows')}{' '}
                  <a href="https://www.transfermarkt.com/" target="_blank">
                    transfermarkt.com
                  </a>
                  {'. '}
                  {getTranslation('i am convinced that')}{' '}
                  <a href="https://dev.mecarreira.com/" target="_blank">
                    MeCarreira.com
                  </a>{' '}
                  {getTranslation('brings to players')} {getTranslation('why')}{' '}
                  {getTranslation('because')}{' '}
                  <a href="https://dev.mecarreira.com/" target="_blank">
                    MeCarreira.com
                  </a>{' '}
                  {getTranslation(
                    'combines the megatrends of personal branding',
                  ) + ' '}
                  {getTranslation('making my contribution here to') + ' '}
                  <a href="https://dev.mecarreira.com/" target="_blank">
                    MeCarreira.com
                  </a>{' '}
                  {getTranslation('taking off motivates me a lot')}
                </p>
                <br />
              </div>
            </div>
            <div className="story-block">
              <div
                className="nft-block"
                style={{ backgroundImage: `url(${TeamFaces.alessandraNft})` }}
              ></div>
              <div>
                <div className="get-title h-3">Alessandra Fausto:</div>
                <p className="ct-p1">
                  {getTranslation('alessandra_team_message')}
                </p>
                <br />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default OurTeamEn
