/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppLayout from '@components/Page/AppLayout'
import React, { useEffect } from 'react'
import { isMobile } from '@utils/helpers'
import { getPlayerImage } from '../../../apis/onboarding/authenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { RootState } from '@root/store/rootReducers'
import ImageComponent from '@components/ImageComponent'
const SharePlayer: React.FC = () => {
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    userPlayerImageData,
    imageLoader,
    isPlayerImageError,
    selectedThemeRedux,
  } = authenticationData
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getPlayerImage(window.location.pathname.slice(14)))
  }, [])
  return (
    <AppLayout>
      {imageLoader ? (
        <div
          style={{
            width: '100%',
            height: '600px',
            margin: '100px auto 40px auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      ) : isPlayerImageError !== '' ? (
        <div
          style={{
            width: '100%',
            margin: '100px auto 40px auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '40px',
            }}
          >
            <div className="heading-title unverified-alert">
              {isPlayerImageError}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile() ? '20px' : '40px',
              }}
            >
              <button
                onClick={() => {
                  window
                    ?.open(
                      `${
                        window.location.origin
                      }/player/${window.location.pathname.slice(14)}`,
                      '_blank',
                    )
                    ?.focus()
                }}
                className="form-submit-btn wallet-btn"
                style={{ width: isMobile() ? '120px' : '160px' }}
              >
                {t('show player')}
              </button>
              <button
                onClick={() => {
                  window?.open(window.location.origin, '_blank')?.focus()
                }}
                className="form-submit-btn wallet-btn"
                style={{ width: isMobile() ? '120px' : '160px' }}
              >
                {t('visit website')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            margin: '100px auto 40px auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '40px',
            }}
          >
            <ImageComponent
              src={`data:image/png;base64,${userPlayerImageData?.Img_data}`}
              alt=""
              style={{ width: '200px', height: '300px' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile() ? '20px' : '40px',
              }}
            >
              <button
                onClick={() => {
                  window
                    ?.open(
                      `${
                        window.location.origin
                      }/player/${window.location.pathname.slice(14)}`,
                      '_blank',
                    )
                    ?.focus()
                }}
                className="form-submit-btn wallet-btn"
                style={{ width: isMobile() ? '120px' : '160px' }}
              >
                {t('show player')}
              </button>
              <button
                onClick={() => {
                  window?.open(window.location.origin, '_blank')?.focus()
                }}
                className="form-submit-btn wallet-btn"
                style={{ width: isMobile() ? '120px' : '160px' }}
              >
                {t('visit website')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

export default SharePlayer
