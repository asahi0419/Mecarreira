import AppLayout from '@components/Page/AppLayout'
import UserWhatsAppOtp from './UserWhatsAppOtp'

const VerifyUserWhatsApp = () => {
  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <UserWhatsAppOtp />
    </AppLayout>
  )
}

export default VerifyUserWhatsApp
