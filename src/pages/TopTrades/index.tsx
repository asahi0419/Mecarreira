/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import { useDispatch } from 'react-redux'
import { initTagManager } from '@utils/helpers'
import TopTradesForm from './TopTradesForm'
import {
  getTopTrades,
  resetTopTrades,
} from '@root/apis/playerCoins/playerCoinsSlice'

const TopTrades: React.FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    initTagManager()
    // document.querySelector('title')!.innerText =
    //   urlPlayer[urlPlayer.length - 1] + ' Player Fanclub & Community'
    // document
    //   .querySelector("meta[name='description']")!
    //   .setAttribute('content', t('exclusive access with player coin'))
    dispatch(getTopTrades({}))
    window.scrollTo(0, 0)
    return () => {
      dispatch(resetTopTrades())
    }
  }, [])

  return (
    <AppLayout headerStatus="header-status" headerClass="home" hasShadow={true}>
      <div className="top-trades-container">
        <TopTradesForm showmore={true} />
      </div>
    </AppLayout>
  )
}

export default TopTrades
