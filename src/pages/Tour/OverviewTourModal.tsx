import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { isMobile } from '@utils/helpers'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { postRequestAuth } from '@root/apis/axiosClientAuth'
import {
  getTourCategories,
  getUserXp,
} from '@root/apis/onboarding/authenticationSlice'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import Spinner from '@components/Spinner'
import ReactCanvasConfetti from 'react-canvas-confetti'

interface Props {
  onCancel: () => void
  onPlay: (categoryId: number) => void
}
const OverviewTourModal: React.FC<Props> = ({ onCancel, onPlay }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { isTourXPClaimed, tourCategories, earnedXp } = authenticationData

  const [isLoading, setIsLoading] = useState(false)
  const [isClaimClicked, setIsClaimClicked] = useState(false)

  const handleClaim = async () => {
    setIsLoading(true)
    setIsClaimClicked(true)
    if (
      tourCategories[1] &&
      tourCategories[2] &&
      tourCategories[3] &&
      tourCategories[4]
    ) {
      const result = await postRequestAuth('accounts/claim_app_tour_xp/')
      if (!result?.data?.success) {
        toast.error('Failed to claim XP')
      } else {
        dispatch(getTourCategories())
        setTimeout(() => dispatch(getUserXp(false)), 2000)
        setTimeout(() => dispatch(getUserXp(false)), 4000)
        setTimeout(() => dispatch(getUserXp(false)), 6000)
      }
    }
  }

  useEffect(() => {
    if (earnedXp === 200) {
      fire()
      setIsLoading(false)
      toast.success(t('successfully done'))
    }
  }, [earnedXp])

  const canvasStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  } as React.CSSProperties

  const refAnimationInstance1 = useRef<any>(null)

  const getInstance = useCallback(instance => {
    refAnimationInstance1.current = instance
  }, [])

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance1.current &&
      refAnimationInstance1.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      })
  }, [])

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    makeShot(0.2, {
      spread: 60,
    })

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [makeShot])

  return (
    <div className="newsletter-wrapper tour-dialog">
      <HotToaster />
      <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
      <div className="overview-tour-wrapper">
        <div className="overview-tour-row">
          <span className={classnames('blog-title ct-h2 text-uppercase')}>
            {t('deposit funds')}
          </span>
          {tourCategories[1] ? (
            <CheckIcon className="success-icon" />
          ) : (
            <ClearIcon className="error-icon" />
          )}
        </div>
        <span className={classnames('newsletter-submit')}>
          {tourCategories[1] ? (
            <div
              className="button-box active-btn-launch gold-btn"
              onClick={() => onPlay(1)}
            >
              {t('do again')}
            </div>
          ) : (
            <div
              className="button-box active-btn-launch"
              onClick={() => onPlay(1)}
            >
              {t('start')}
            </div>
          )}
        </span>
      </div>
      <div className="overview-tour-wrapper">
        <div className="overview-tour-row">
          <span className={classnames('blog-title ct-h2 text-uppercase')}>
            {t('trade football players')}
          </span>
          {tourCategories[2] ? (
            <CheckIcon className="success-icon" />
          ) : (
            <ClearIcon className="error-icon" />
          )}
        </div>
        <span className={classnames('newsletter-submit')}>
          {tourCategories[2] ? (
            <div
              className="button-box active-btn-launch gold-btn"
              onClick={() => onPlay(2)}
            >
              {t('do again')}
            </div>
          ) : (
            <div
              className="button-box active-btn-launch"
              onClick={() => onPlay(2)}
            >
              {t('start')}
            </div>
          )}
        </span>
      </div>
      <div className="overview-tour-wrapper">
        <div className="overview-tour-row">
          <span className={classnames('blog-title ct-h2 text-uppercase')}>
            {t('seasonal rewards & leaderboard')}
          </span>
          {tourCategories[3] ? (
            <CheckIcon className="success-icon" />
          ) : (
            <ClearIcon className="error-icon" />
          )}
        </div>
        <span className={classnames('newsletter-submit')}>
          {tourCategories[3] ? (
            <div
              className="button-box active-btn-launch gold-btn"
              onClick={() => onPlay(3)}
            >
              {t('do again')}
            </div>
          ) : (
            <div
              className="button-box active-btn-launch"
              onClick={() => onPlay(3)}
            >
              {t('start')}
            </div>
          )}
        </span>
      </div>
      <div className="overview-tour-wrapper">
        <div className="overview-tour-row">
          <span className={classnames('blog-title ct-h2 text-uppercase')}>
            {t('unlock fanclub benefits with staking')}
          </span>
          {tourCategories[4] ? (
            <CheckIcon className="success-icon" />
          ) : (
            <ClearIcon className="error-icon" />
          )}
        </div>
        <span className={classnames('newsletter-submit')}>
          {tourCategories[4] ? (
            <div
              className="button-box active-btn-launch gold-btn"
              onClick={() => onPlay(4)}
            >
              {t('do again')}
            </div>
          ) : (
            <div
              className="button-box active-btn-launch"
              onClick={() => onPlay(4)}
            >
              {t('start')}
            </div>
          )}
        </span>
      </div>
      <div className="bottom-caption-wrapper">
        <span
          className={classnames(
            'blog-content mt-20',
            !isMobile() ? 'installation-msg' : '',
          )}
        >
          {t('complete_all_parts')}
        </span>
      </div>
      <div className="addhome-btn-wrapper">
        <span className={classnames('newsletter-submit')}>
          {isLoading ? (
            <Spinner spinnerStatus={true} />
          ) : (
            <div
              onClick={handleClaim}
              className={classnames(
                'button-box',
                tourCategories[1] &&
                  tourCategories[2] &&
                  tourCategories[3] &&
                  tourCategories[4] &&
                  !isTourXPClaimed &&
                  !isClaimClicked
                  ? 'button-active'
                  : 'button-inactive no-pointer-area',
              )}
            >
              {t('claim 200 XP')}
            </div>
          )}
        </span>
      </div>
    </div>
  )
}

export default OverviewTourModal
