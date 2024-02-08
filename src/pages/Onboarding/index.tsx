import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import OnboardingForm from './OnboardingForm'

const Onboarding: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    window.history.replaceState(null, 'Buy', '/')
  }, [])

  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <OnboardingForm onClose={() => console.log('')} />
    </AppLayout>
  )
}

export default Onboarding
