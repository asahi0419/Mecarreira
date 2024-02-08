/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import PlayerListForm from './PlayerListForm'
import PlayerList from './PlayerList'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import { initTagManager } from '@utils/helpers'

const Player: React.FC = () => {
  useEffect(() => {
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = 'All Member token at a glance'
    document
      .querySelector("meta[name='description']")!
      .setAttribute(
        'content',
        'Browse through hundreds of players and find the next superstars and rise alongside them to success',
      )
  }, [])

  return (
    <AppLayout headerClass="home" hasShadow={true}>
      {/* <PlayerListForm /> */}
      <PlayerList />
    </AppLayout>
  )
}

export default Player
