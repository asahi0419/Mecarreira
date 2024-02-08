/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/pages/Terms&Conditions.css'
import AppLayout from '@components/Page/AppLayout'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import Clause from './components/Clause'
import { initTagManager } from '@utils/helpers'

const HowItWorks: React.FC = () => {
  const { t } = useTranslation()

  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = 'How it Works'
  }, [])

  return (
    <AppLayout headerClass="home">
      <div className="terms-container">
        <div className="mt-20 mb-20">
          <Clause
            title={t('how it works')}
            isMainTitle
            fontStyle="text-left ct-h1"
            children={''}
          />
          <Clause
            title={t('player Status: Subscription & PRO')}
            fontStyle="h-2 text-left"
          >
            <div className="terms-content ct-p1">
              <p>{t('each player contract goes')}</p>
              <p>{t('the way to move from')}</p>
              <p>{t('players that never reach')}</p>
              <p>{t('once a player reaches')}</p>
            </div>
          </Clause>
          <Clause title={t('buying')} fontStyle="h-2">
            <div className="terms-content ct-p1">
              <p>{t('to buy Player-Coins you')}</p>
              <p>{t('alternatively, you can use')}</p>
            </div>
          </Clause>
          <Clause title={t('selling')} fontStyle="h-2">
            <div className="terms-content ct-p1">
              <p>{t('whenever you sell Player-Coins')}</p>
            </div>
          </Clause>
          <Clause title={t('drafting')} fontStyle="h-2">
            <div className="terms-content ct-p1">
              <p>{t('drafting is available')}</p>
              <p>{t('when a player drafts')}</p>
              <p>{t('player A drafts Player B.')}</p>
              <p>{t('john buys for 100 USD coins of Player A.')}</p>
              <p>{t('2% (2 USD) are used to buy coins of Player B.')}</p>
              <p>{t('john receives 98 USD')}</p>
              <p>{t('players getting drafted')}</p>
            </div>
          </Clause>
          <Clause title={t('voting')} fontStyle="h-2">
            <div className="terms-content ct-p1">
              {t('voting works that way that')}
            </div>
          </Clause>
          <Clause title={t('NFT')} fontStyle="h-2">
            <div className="terms-content ct-p1">
              <p>{t('NFTs are digital artworks')}</p>
              <p>{t('on meCarreira players')}</p>
            </div>
          </Clause>
          <Clause title={t('auctions (NFT)')} fontStyle="h-2">
            <div className="terms-content ct-p1">
              {t('auctions are done for NFTs')}
            </div>
          </Clause>
          <Clause title={t('raffles/Draws (NFT)')} fontStyle="h-2">
            <div className="terms-content ct-p1">
              {t('raffles or sometimes referred')}
            </div>
          </Clause>
          <Clause title={t('claims (NFT)')} fontStyle="h-2">
            <div className="terms-content ct-p1">
              {t('some NFTs can have a claim')}
            </div>
          </Clause>
          <Clause title={t('send Coins')} fontStyle="h-2">
            <div className="terms-content ct-p1">
              <p>{t('player-Coins can only be')}</p>
              <p>{t('once the player reaches')}</p>
            </div>
          </Clause>
        </div>
      </div>
    </AppLayout>
  )
}

export default HowItWorks
