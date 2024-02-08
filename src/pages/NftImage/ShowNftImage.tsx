/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { getNftImage } from '@root/apis/onboarding/authenticationSlice'
import { useParams } from 'react-router-dom'
import { RootState } from '@root/store/rootReducers'
import { isMobile } from '@utils/helpers'

const ShowNftImage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isUnavailable, setUnavailable] = useState(false)
  const { id, ticker } = useParams()
  useEffect(() => {
    dispatch(getNftImage({ ticker: ticker, id: id }))
  }, [])
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { getNftImageLoader, getNftImageData, getNftImageError } =
    authenticationData
  return (
    <AppLayout headerClass="home">
      <div
        className="flex_container"
        style={{
          margin: '100px auto',
          height: '400px',
        }}
      >
        {getNftImageLoader ? (
          <div
            style={{
              margin: isMobile() ? '120px 0px' : '200px 0px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        ) : getNftImageError ? (
          <p
            className="input-feedback text-center text-error"
            style={{
              fontSize: isMobile() ? '28px' : '38px',
              margin: '100px 0px',
            }}
          >
            {getNftImageError}
          </p>
        ) : (
          <img
            style={{ width: isMobile() ? '100%' : '' }}
            src={getNftImageData}
            alt=""
          />
        )}
      </div>
    </AppLayout>
  )
}

export default ShowNftImage
