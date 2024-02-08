/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import AppLayout from '@components/Page/AppLayout'
import { useLocation } from 'react-router'
import PrivacyPolicyEn from './PrivacyPolicyEn'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import { initTagManager } from '@utils/helpers'

const PrivacyPolicy: React.FC = () => {
  const location = useLocation()
  const lang = location?.pathname?.split('-').pop()
  const selectedLocale = localStorage.getItem('language')

  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = 'Privacy Policy of meCarreira'
  }, [])

  const getLocalizedPolicy = () => {
    if (lang === 'en' || selectedLocale === 'en') {
      return <PrivacyPolicyEn />
    } else if (lang === 'de' || selectedLocale === 'de') {
      return <PrivacyPolicyEn />
    } else if (lang === 'fr' || selectedLocale === 'fr') {
      return <PrivacyPolicyEn />
    } else {
      return <PrivacyPolicyEn />
    }
  }

  return (
    <AppLayout
      headerClass="home"
      footerStatus={
        !window.location.href.includes('/app') ? 'footer-status' : ''
      }
    >
      {getLocalizedPolicy()}
    </AppLayout>
  )
}

export default PrivacyPolicy
