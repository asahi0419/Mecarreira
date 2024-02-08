/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import PlayerForm from './PlayerForm'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import { useParams } from 'react-router-dom'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import {
  getPlayerDetails,
  getTourPlayerDetails,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { useTranslation } from 'react-i18next'
import { resetUserProfileData } from '@root/apis/onboarding/authenticationSlice'
import { initTagManager } from '@utils/helpers'

const Player: React.FC = () => {
  const dispatch = useDispatch()
  const [headerStatus, setHeaderStatus] = useState('header-status')
  const { id } = useParams()
  const playerUrl = id
  const { getPlayerDetailsSuccessData } = useSelector(
    (state: RootState) => state.playercoins,
  )
  const { t } = useTranslation()

  useEffect(() => {
    if (playerUrl) {
      console.log({ playerUrl })
      if (playerUrl === 'tour-player') {
        dispatch(getTourPlayerDetails())
      } else {
        dispatch(getPlayerDetails(playerUrl))
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [playerUrl])

  useEffect(() => {
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    const locationUrl = window.location.href
    const urlPlayer = locationUrl.split('/')
    // document.querySelector('title')!.innerText =
    //   urlPlayer[urlPlayer.length - 1] + ' Player Fanclub & Community'
    // document
    //   .querySelector("meta[name='description']")!
    //   .setAttribute('content', t('exclusive access with player coin'))
    dispatch(resetUserProfileData())
  }, [])

  useEffect(() => {
    if (getPlayerDetailsSuccessData) {
      document.querySelector('title')!.innerText =
        getPlayerDetailsSuccessData?.name +
        ' $' +
        getPlayerDetailsSuccessData?.ticker +
        ' Player Fanclub & Community'
      document
        .querySelector("meta[name='description']")!
        .setAttribute(
          'content',
          'The ' +
            getPlayerDetailsSuccessData?.name +
            ' $' +
            getPlayerDetailsSuccessData?.ticker +
            ' Fanclub & Community is a digital fanclub that connects supporters and fans with ' +
            getPlayerDetailsSuccessData?.name +
            ' for unique interactions',
        )
    }
  }, [getPlayerDetailsSuccessData])

  const handleTabChange = (tab: string) => {
    // if (tab === 'drafts') {
    //   setHeaderStatus('header-status d-none')
    // }
  }

  return (
    <AppLayout headerStatus={headerStatus} headerClass="home" hasShadow={true}>
      <PlayerForm getActiveTab={handleTabChange} />
    </AppLayout>
  )
}

export default Player
