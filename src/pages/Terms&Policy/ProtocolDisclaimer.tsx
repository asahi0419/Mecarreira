/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import AppLayout from '@components/Page/AppLayout'
import { useLocation } from 'react-router'
import ProtocolDisclaimerEn from './ProtocolDisclaimerEn'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import { initTagManager } from '@utils/helpers'
import '../../assets/css/pages/InviteException.css'

const PrivacyPolicy: React.FC = () => {
  const location = useLocation()
  const lang = location?.pathname?.split('-').pop()
  const selectedLocale = localStorage.getItem('language')

  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText =
      'Protocol Disclaimer of meCarreira'
  }, [])

  const getLocalizedDisclaimer = () => {
    if (lang === 'en' || selectedLocale === 'en') {
      return <ProtocolDisclaimerEn />
    } else if (lang === 'de' || selectedLocale === 'de') {
      return <ProtocolDisclaimerEn />
    } else if (lang === 'fr' || selectedLocale === 'fr') {
      return <ProtocolDisclaimerEn />
    } else {
      return <ProtocolDisclaimerEn />
    }
  }

  return (
    <AppLayout
      headerClass="home"
      footerStatus={
        !window.location.href.includes('/app') ? 'footer-status' : ''
      }
    >
      {getLocalizedDisclaimer()}
    </AppLayout>
  )
}

export default PrivacyPolicy
