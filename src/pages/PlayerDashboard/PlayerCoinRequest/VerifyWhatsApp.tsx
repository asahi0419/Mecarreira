import AppLayout from '@components/Page/AppLayout'
import OtpWhatsApp from './OtpWhatsApp'

const VerifyWhatsApp = () => {
  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <OtpWhatsApp />
    </AppLayout>
  )
}

export default VerifyWhatsApp
