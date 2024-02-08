/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import AppLayout from '@components/Page/AppLayout'
import OurTeamEn from './OurTeamEn'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import { initTagManager } from '@utils/helpers'

const OurTeam: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = 'The Team of meCarreira'
    document
      .querySelector("meta[name='description']")!
      .setAttribute(
        'content',
        'Read about our core team and why they are the best in what they do',
      )
    document.body.style.backgroundColor = '#171923'
    return () => {
      document.body.style.backgroundColor = '#222435'
    }
  }, [])

  return (
    <AppLayout headerClass="home">
      <div className="team-box m-0">
        <OurTeamEn />
      </div>
    </AppLayout>
  )
}

export default OurTeam
