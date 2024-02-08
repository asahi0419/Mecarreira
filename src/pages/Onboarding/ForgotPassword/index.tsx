import React, { useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import classNames from 'classnames'
import FormInput from '../../../components/Form/FormInput'
import { RequestParams as OnboardingProps } from '@root/types'
import SubmitButton from '@components/Button/SubmitButton'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import {
  forgotPassword,
  resetFormPassword,
} from '@root/apis/onboarding/authenticationSlice'
import { useTranslation } from 'react-i18next'
import { isMobile } from '@utils/helpers'

const initialValues = {
  email: '',
}

interface Props {
  handleReturn?: any //(v?: boolean) => void
}

const ForgotPassword: React.FC<Props> = ({ handleReturn }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { resetPasswordSuccess, resetPasswordError } = authenticationData

  useEffect(() => {
    const modalDiv = document.getElementsByClassName('modal show')[0]
    if (isMobile()) {
      modalDiv.scrollTop = 0
      modalDiv.style.overflow = 'hidden'
    }
    return () => {
      modalDiv.style.overflow = 'auto'
    }
  }, [])

  async function onSubmit(values: OnboardingProps) {
    if (resetPasswordSuccess) {
      handleReturn()
      dispatch(resetFormPassword())
    } else {
      dispatch(forgotPassword(values))
    }
  }

  const onBackPress = () => {
    dispatch(resetFormPassword())
    handleReturn()
  }

  return (
    <>
      <div
        id="id01"
        className={classNames(
          'login-form',
          authenticationData.isOtpSent ? 'hide' : '',
        )}
      >
        <h2 className="page-heading mt-90" style={{ maxWidth: '300px' }}>
          {t('enter Your Registered Email')}
        </h2>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={async values => {
            onSubmit(values)
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email(t('invalid email'))
              .required(t('email Required')),
          })}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              isValid,
              dirty,
            } = props
            return (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <div className="login-form-container">
                  <div className="field-wrapper ">
                    <label>
                      <b>{t('email')}</b>
                    </label>
                    <FormInput
                      id="user_email"
                      type="email"
                      placeholder={t('enter Email')}
                      name="email"
                      value={values.email}
                      handleChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && touched.email && (
                      <div className="input-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="input-feedback text-center otp-error m-0">
                    {resetPasswordError}
                  </div>
                  <div className="input-feedback text-center otp-success mt-20">
                    {resetPasswordSuccess}
                  </div>
                  <SubmitButton
                    isDisabled={!isValid || !dirty}
                    title={resetPasswordSuccess ? t('done') : t('continue')}
                    className="signup-btn mt-40 mb-40"
                    onPress={handleSubmit}
                  />
                  <p className="page-text semibold fullwidth">
                    <a
                      href="#"
                      className="resend-link"
                      onClick={() => onBackPress()}
                    >
                      {t('back to Login')}
                    </a>
                  </p>
                </div>
              </form>
            )
          }}
        </Formik>
      </div>
    </>
  )
}

export default ForgotPassword
