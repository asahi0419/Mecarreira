import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { Landing } from '@pages/index'
import {
  setActiveTab,
  setReferralLinkCode,
  showSignupForm,
} from '@root/apis/onboarding/authenticationSlice'
import { useNavigate } from 'react-router-dom'

const Referral: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const navigate = useNavigate()
  const {
    selectedThemeRedux,
    sharePopWallet,
    playerReferralDataLoader,
    playerReferralDataSuccess,
    stateAccessToken,
  } = authenticationData
  const isLoggedIn =
    Boolean(localStorage.getItem('loginInfo')) ||
    Boolean(localStorage.getItem('loginId'))
  const referralCodeLocal = localStorage.getItem('referral_code')

  const siteUrl = window.location.href
  const refCode = siteUrl.split('/').pop()

  if (siteUrl.includes('/referral') && refCode?.length === 8) {
    localStorage.setItem('referral_code', refCode)
    dispatch(setReferralLinkCode(refCode))
  }

  useEffect(() => {
    // Get the pathname from the current URL
    // const pathname = window.location.pathname
    // // Split the pathname by '/' to get an array of segments
    // const segments = pathname.split('/')
    // // The last segment (index -1) should contain the "id number"
    // const referralCode = segments[segments.length - 1]
    // if (pathname.includes('/referral') && referralCode?.length === 8) {
    //   localStorage.setItem('referral_code', referralCode)
    // }
    if (!isLoggedIn) {
      dispatch(setActiveTab('register'))
      setTimeout(() => {
        dispatch(showSignupForm())
      }, 2000)
    } else {
      setTimeout(() => {
        navigate('/player-dashboard')
      }, 1000)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn && referralCodeLocal?.length === 8) {
      setTimeout(() => {
        navigate('/player-dashboard')
      }, 1000)
    }
  }, [stateAccessToken])

  return (
    <div>
      <Landing />
    </div>
  )
}

export default Referral
