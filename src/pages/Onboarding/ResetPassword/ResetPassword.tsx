import React, { useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import classNames from 'classnames'
import { useNavigate, useLocation } from 'react-router-dom'
import SubmitButton from '@components/Button/SubmitButton'
import { useDispatch, useSelector } from 'react-redux'
import AppLayout from '@components/Page/AppLayout'
import FormInput from '../../../components/Form/FormInput'
import { RequestParams as OnboardingProps } from '@root/types'
import { resetPassword } from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { PASSWORD_REGEX } from '@root/constants'

const initialValues = {
  password: '',
  confirm_password: '',
}

const ResetPassword: React.FC = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const paramSet = pathname.split('/')

  useEffect(() => {
    window.history.replaceState(null, 'Buy', '/')
  }, [])

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { passwordResetError, passwordResetSuccess } = authenticationData

  async function onSubmit(values: OnboardingProps) {
    const reqParams = {
      token: paramSet[paramSet.length - 1],
      new_password: values.password,
      confirm_password: values.confirm_password,
      uidb64: paramSet[paramSet.length - 2],
    }
    if (passwordResetSuccess) {
      navigate('/app')
    } else {
      dispatch(resetPassword(reqParams))
    }
  }
  return (
    <AppLayout
      className="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <section className="verification-container fullwidth">
        <section className="onboarding-container reset-password">
          <div id="id01" className={classNames('login-form')}>
            <h2 className="page-heading mt-90">{t('reset Password')}</h2>
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              onSubmit={async values => {
                onSubmit(values)
              }}
              validationSchema={Yup.object().shape({
                password: Yup.string()
                  .required(t('password Required'))
                  .min(
                    8,
                    t('password is too short - should be 8 chars minimum'),
                  )
                  .matches(
                    PASSWORD_REGEX,
                    t(
                      'must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
                    ),
                  ),
                confirm_password: Yup.string()
                  .required(t('confirm Password Required'))
                  .oneOf(
                    [Yup.ref('password'), null],
                    t('passwords must match'),
                  ),
              })}
            >
              {props => {
                const {
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
                    <div className="login-form-container reset-password-form">
                      <div className="field-wrapper">
                        <label>
                          <b>{t('enter New Password')}</b>
                        </label>
                        <FormInput
                          id="password"
                          type="password"
                          placeholder={t('enter New Password')}
                          name="password"
                          handleChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.password && touched.password && (
                          <div className="input-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div>
                      <div className="field-wrapper">
                        <label>
                          <b>{t('confirm New Password')}</b>
                        </label>
                        <FormInput
                          id="confirm_password"
                          type="password"
                          placeholder={t('confirm New Password')}
                          name="confirm_password"
                          handleChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.confirm_password &&
                          touched.confirm_password && (
                            <div className="input-feedback">
                              {errors.confirm_password}
                            </div>
                          )}
                      </div>
                      <div className="input-feedback text-center otp-error m-0">
                        {passwordResetError}
                      </div>
                      <div className="input-feedback text-center otp-success mt-20">
                        {passwordResetSuccess}
                      </div>
                      <SubmitButton
                        isDisabled={!isValid || !dirty}
                        title={
                          passwordResetSuccess ? t('continue') : t('submit')
                        }
                        className="signup-btn mt-40 mb-40"
                        onPress={handleSubmit}
                      />
                    </div>
                  </form>
                )
              }}
            </Formik>
          </div>
        </section>
      </section>
    </AppLayout>
  )
}

export default ResetPassword
