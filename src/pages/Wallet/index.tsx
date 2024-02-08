import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import WalletForm from './WalletForm'
import '@assets/css/pages/Wallet.css'

const Wallet: React.FC = () => {
  useEffect(() => {
    window.history.replaceState(null, 'Buy', '/')
  }, [])

  return (
    <AppLayout className="p-0" footerStatus="footer-status" noPageFooter={true}>
      <WalletForm />
    </AppLayout>
  )
}

export default Wallet
