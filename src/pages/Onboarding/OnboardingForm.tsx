import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import SignUp from './SignUp/SignUp'
import TabGroup from '@components/Page/TabGroup'
import Login from './Login/Login'
import VerifyEmail from './VerifyEmail/verifyEmail'
import ForgotPassword from './ForgotPassword'
import '@assets/css/pages/Onboarding.css'
interface Props {
  isOnMenu?: boolean
  onSubmit?: () => void
  onClose: () => void
}

const OnboardingForm: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [activeTab, setActiveTab] = useState('login')
  const [isForgotPasswordSelected, setForgotPasswordSelected] = useState(false)
  const handleGetTab = (tab: string) => {
    setActiveTab(tab)
  }
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData

  useEffect(() => {
    if (authenticationData.activeTab) {
      setActiveTab(authenticationData.activeTab)
    }
  }, [authenticationData])

  const onReturn = () => {
    setForgotPasswordSelected(false)
    setActiveTab('login')
  }

  const handleForgotPassword = () => {
    setForgotPasswordSelected(true)
  }

  return (
    <section className="onboarding-container">
      <>
        {authenticationData.isSentEmailVerificationMail ? (
          <VerifyEmail email={authenticationData.email} />
        ) : isForgotPasswordSelected ? (
          <ForgotPassword handleReturn={onReturn} />
        ) : (
          <>
            <TabGroup
              defaultTab={activeTab}
              tabSet={['register', 'login']}
              getSwitchedTab={handleGetTab}
            />
            {activeTab === 'register' ? (
              <SignUp onClose={onClose} />
            ) : (
              <Login
                getSubmit={onSubmit}
                handleLinkClick={handleForgotPassword}
              />
            )}
          </>
        )}
      </>
    </section>
  )
}

export default OnboardingForm
