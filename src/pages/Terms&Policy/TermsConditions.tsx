/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import AppLayout from '@components/Page/AppLayout'
import TermsConditionsEn from './TermsConditionsEn'
import { useLocation } from 'react-router'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import { initTagManager } from '@utils/helpers'

const TermsConditions: React.FC = () => {
  const location = useLocation()
  const lang = location?.pathname?.split('-').pop()
  const selectedLocale = localStorage.getItem('language')

  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText =
      'Terms & Conditions of meCarreira'
  }, [])

  const getLocalizedTerms = () => {
    if (lang === 'en' || selectedLocale === 'en') {
      return <TermsConditionsEn />
    } else if (lang === 'de' || selectedLocale === 'de') {
      return <TermsConditionsEn />
    } else if (lang === 'fr' || selectedLocale === 'fr') {
      return <TermsConditionsEn />
    } else {
      return <TermsConditionsEn />
    }
  }

  return (
    <AppLayout
      headerClass="home"
      footerStatus={
        !window.location.href.includes('/app') ? 'footer-status' : ''
      }
    >
      {getLocalizedTerms()}
    </AppLayout>
  )
}

export default TermsConditions
