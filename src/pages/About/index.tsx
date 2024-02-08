/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import AppLayout from '@components/Page/AppLayout'
import AboutUsEn from './AboutUsEn'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import { initTagManager } from '@utils/helpers'

const AboutUs: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    initTagManager()
    // TagManager.initialize(tagManagerArgs)
    document.querySelector('title')!.innerText = 'About meCarreira'
    document
      .querySelector("meta[name='description']")!
      .setAttribute('content', 'Why do we do, what we do')
  }, [])

  return (
    <AppLayout headerClass="home">
      <AboutUsEn />
    </AppLayout>
  )
}

export default AboutUs
