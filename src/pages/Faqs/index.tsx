/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import { useTranslation } from 'react-i18next'
import FaqDetail from '@components/Page/FaqDetail'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import { initTagManager } from '@utils/helpers'

const Faqs: React.FC = () => {
  const { t } = useTranslation()

  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = 'Faqs of meCarreira'
    document.body.style.backgroundColor = '#171923'
    return () => {
      document.body.style.backgroundColor = '#222435'
    }
  }, [])

  return (
    <AppLayout headerClass="home" footerStatus="footer-status">
      <div className="faqs-container">
        <span className="blog-title faq-title capitalize">{t(`faq's`)}</span>
        <FaqDetail />
      </div>
    </AppLayout>
  )
}

export default Faqs
