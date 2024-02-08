import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import ChangePasswordForm from './ChangePasswordForm'

const ChangePassword: React.FC = () => {
  useEffect(() => {
    window.history.replaceState(null, 'Buy', '/')
  }, [])

  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <ChangePasswordForm />
    </AppLayout>
  )
}

export default ChangePassword
