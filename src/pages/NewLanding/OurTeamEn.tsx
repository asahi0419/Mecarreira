import React, { useEffect } from 'react'
import '@assets/css/pages/OurTeam.css'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import Clause from '@pages/Terms&Policy/components/Clause'
import { TeamMembers } from '@root/constants'
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
          <div className="pg-xl designation">{companyTitle}</div>
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
        dispatch(getWalletDetails())
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
    <div className="team-section-wrapper">
      <div className="our-team-container">
        <Clause
          title={t('our team')}
          isMainTitle
          containerClass="our-team-intro text-center m-0"
        >
          {' '}
        </Clause>
        <div className="team-display">
          <div className="team-container h-none">
            {TeamMembers.map(item => (
              <TeamMemberCard
                img={item.img}
                fullName={item.fullName}
                companyTitle={getTranslation(item.companyTitle)}
                description={''}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurTeamEn
