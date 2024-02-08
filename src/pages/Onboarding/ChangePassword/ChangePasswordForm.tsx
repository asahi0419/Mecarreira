import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import SubmitButton from '@components/Button/SubmitButton'
import FormInput from '../../../components/Form/FormInput'
import { RequestParams as OnboardingProps } from '@root/types'
import { useTranslation } from 'react-i18next'
import { putRequestAuth } from '@root/apis/axiosClientAuth'
import { PASSWORD_REGEX } from '@root/constants'

const initialValues = {
  old_password: '',
  password: '',
  confirm_password: '',
}

const ChangePasswordForm: React.FC = () => {
  const { t } = useTranslation()
  const [isLoading, setLoading] = useState(false)
  const [resetPasswordError, setResetPasswordError] = useState('')
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState('')
  const navigate = useNavigate()

  async function onSubmit(values: OnboardingProps) {
    const reqParams = {
      old_password: values.old_password,
      new_password: values.password,
    }
    if (resetPasswordSuccess) {
      navigate('/app')
    } else {
      setResetPasswordError('')
      setLoading(true)
      try {
        const resp = await putRequestAuth('accounts/changePassword/', reqParams)
        if (resp) {
          setLoading(false)
          setResetPasswordSuccess(resp.data.message)
        }
      } catch (error: any) {
        setLoading(false)
        setResetPasswordError(error.response.data.message)
      }
    }
  }
  return (
    <section className="onboarding-container">
      <div id="id01" className={classNames('login-form')}>
        <h2 className="page-heading mt-90">{t('change Password')}</h2>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={async values => {
            onSubmit(values)
          }}
          validationSchema={Yup.object().shape({
            password: Yup.string()
              .required(t('password Required'))
              .min(8, t('password is too short - should be 8 chars minimum'))
              .matches(
                PASSWORD_REGEX,
                t(
                  'must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
                ),
              ),
            confirm_password: Yup.string()
              .required(t('confirm Password Required'))
              .oneOf([Yup.ref('password'), null], t('passwords must match')),
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
                <div className="login-form-container">
                  <div className="field-wrapper">
                    <label>
                      <b>{t('old Password')}</b>
                    </label>
                    <FormInput
                      id="old_password"
                      type="password"
                      placeholder={t('old Password')}
                      name="old_password"
                      handleChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="field-wrapper">
                    <label>
                      <b>{t('new Password')}</b>
                    </label>
                    <FormInput
                      id="password"
                      type="password"
                      placeholder={t('new Password')}
                      name="password"
                      handleChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && touched.password && (
                      <div className="input-feedback">{errors.password}</div>
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
                    {errors.confirm_password && touched.confirm_password && (
                      <div className="input-feedback">
                        {errors.confirm_password}
                      </div>
                    )}
                  </div>
                  <div className="input-feedback text-center otp-error m-0">
                    {resetPasswordError}
                  </div>
                  <div className="input-feedback text-center otp-success mt-20">
                    {resetPasswordSuccess}
                  </div>
                  <SubmitButton
                    isLoading={isLoading}
                    isDisabled={!isValid || !dirty}
                    title={t('reset Password')}
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
  )
}

export default ChangePasswordForm
