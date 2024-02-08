import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { verifyEmail } from '@root/apis/onboarding/authenticationSlice'
import AppLayout from '@components/Page/AppLayout'
import { RootState } from '@root/store/rootReducers'
import classNames from 'classnames'

const EmailVerification: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const pathSet = pathname.split('/')

  useEffect(() => {
    window.history.replaceState(null, 'Buy', '/')
    getEmailVerified()
  }, [])

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    isVerifyEmailError,
    loader,
    isVerifyEmailSuccess,
    selectedThemeRedux,
  } = authenticationData

  const getEmailVerified = async () => {
    const reqParams = {
      id: pathSet[pathSet.length - 2],
      token: pathSet[pathSet.length - 1],
    }
    dispatch(verifyEmail(reqParams))
  }

  const handleNavigate = () => {
    navigate('/app')
  }

  useEffect(() => {
    if (isVerifyEmailSuccess) {
      handleNavigate()
    }
  }, [isVerifyEmailSuccess])

  return (
    <AppLayout className="home" footerStatus="hidden" noPageFooter={true}>
      <section className="verification-container fullwidth">
        <div
          className={classNames(
            'email-verification-container',
            isVerifyEmailError ? 'email-verification-error' : '',
          )}
        >
          {loader ? (
            <div className="checkout-loader-wrapper mt-20">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            </div>
          ) : isVerifyEmailError ? (
            <h2 className="page-heading text-error">{isVerifyEmailError}</h2>
          ) : null}
        </div>
      </section>
    </AppLayout>
  )
}

export default EmailVerification
