import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  showSignupForm,
  getDigitalItem,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import { AppLayout } from '..'
import { useNavigate } from 'react-router-dom'
import { t } from 'i18next'

const DigitalItemDownload: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const url = window.location.href
  const parts = url.split('/')
  const [, lastPart, secondLastPart] = parts.slice(-3)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { getDigitalItemError, getDigitalItemSuccessData } = authenticationData
  const [close, setClose] = useState(false)
  useEffect(() => {
    if (close) {
      navigate('/app')
    }
  }, [close])
  useEffect(() => {
    const loginId = localStorage.getItem('loginId')
    const loginInfo = localStorage.getItem('loginInfo')
    if (!loginId && !loginInfo) {
      dispatch(showSignupForm())
    } else {
      dispatch(
        getDigitalItem({
          hash: secondLastPart,
          detail_page: lastPart,
        }),
      )
    }
  }, [])
  const loginId = localStorage.getItem('loginId')
  const loginInfo = localStorage.getItem('loginInfo')
  useEffect(() => {
    if (loginId || loginInfo) {
      dispatch(
        getDigitalItem({
          hash: secondLastPart,
          detail_page: lastPart,
        }),
      )
    }
  }, [loginId, loginInfo])

  useEffect(() => {
    if (getDigitalItemSuccessData !== '') {
      const sliceSize = 1024
      const byteCharacters = atob(getDigitalItemSuccessData?.data)
      const byteArrays: any[] = []

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      const blob = new Blob(byteArrays, {
        type: getDigitalItemSuccessData?.type,
      })

      // Create a temporary anchor element
      const anchor = document.createElement('a')
      document.body.appendChild(anchor)

      // Set the anchor's href and download attributes, and simulate a click
      anchor.href = window.URL.createObjectURL(blob)
      anchor.download = `${getDigitalItemSuccessData?.filename}.${getDigitalItemSuccessData?.extension}`
      anchor.click()

      // Remove the anchor from the DOM
      document.body.removeChild(anchor)
      setClose(true)
    }
  }, [getDigitalItemSuccessData])
  return (
    <AppLayout headerClass="home" footerStatus={''} noPageFooter={true}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
        }}
      >
        <div
          className="input-feedback text-center"
          style={{ fontSize: '24px' }}
        >
          {getDigitalItemError ? (
            getDigitalItemError
          ) : loginId || loginInfo ? (
            <div
              className="button-box button2"
              style={{ marginLeft: '55px' }}
              onClick={() => {
                dispatch(
                  getDigitalItem({
                    hash: secondLastPart,
                    detail_page: lastPart,
                  }),
                )
              }}
            >
              {t('download')}
            </div>
          ) : null}
        </div>
      </div>
    </AppLayout>
  )
}

export default DigitalItemDownload
