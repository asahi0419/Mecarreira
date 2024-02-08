import React from 'react'
import SubmitButton from '@components/Button/SubmitButton'
import { useDispatch, useSelector } from 'react-redux'
import {
  closeEmailVerification,
  resendEmail,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'

interface Props {
  email: string
}

const VerifyEmail: React.FC<Props> = ({ email }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const handleSubmit = () => {
    dispatch(closeEmailVerification())
  }

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { isEmailResendError, isEmailResent } = authenticationData

  const handleResendLink = async () => {
    const reqParams = {
      email,
    }
    dispatch(resendEmail(reqParams))
  }

  return (
    <div style={{ height: 'auto', width: '100%', marginTop: '93px' }}>
      <h2 className="page-heading">{t('verify your email')}</h2>
      <p className="page-text mt-40">
        {t('we have sent an email to')}
        <br />
        <u>{email}</u> {t('with a')}
        <br />
        {t('verification link')}
      </p>

      <p className="page-text mt-40">
        {t('please click on that link to')}
        <br />
        {t('activate your account')}
      </p>
      <SubmitButton
        isLoading={false}
        title={t('done')}
        className="btn-done verify-btn mt-40"
        onPress={handleSubmit}
      />
      {isEmailResendError ? (
        <div className="input-feedback text-center">{isEmailResendError}</div>
      ) : (
        <>
          {isEmailResent ? (
            <p className="page-text semibold fullwidth mt-40">
              <a href="#" className="resend-link no-click">
                {isEmailResent}
              </a>
            </p>
          ) : (
            <p className="page-text semibold mt-40">
              {t('didn’t get the verification email?') + ' '}
              <a href="#" className="resend-link" onClick={handleResendLink}>
                {t('resend')}
              </a>
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default VerifyEmail
