import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@components/Button/SubmitButton'
import FormInput from '@components/Form/FormInput'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import FormTextArea from '@components/Form/FormTextArea'
import ResponseAlert from '@components/ResponseAlert'

interface Props {
  traitData: any
  isSuccess: boolean
  onSubmit: any
  onClose: () => void
}

const maxNumber = 120

const CreateTrait: React.FC<Props> = ({
  traitData,
  isSuccess,
  onSubmit,
  onClose,
}) => {
  const { t } = useTranslation()
  const { isLoading } = useSelector((state: RootState) => state.gallery)

  const submitForm = (values: any) => {
    const reqParams = {
      id: values.id,
      type: traitData.type,
      title: values.title,
      content: values.content,
    }
    onSubmit(reqParams)
  }

  const initialValues = {
    id: traitData.id,
    title: traitData.type === 'description' ? 'none' : traitData.title,
    content: traitData.content,
  }

  return (
    <section className="wallet-container stake-bid-container">
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={submitForm}
        validationSchema={Yup.object().shape({
          title: Yup.string().required(t('title required')),
          content: Yup.string().required(t('content required')),
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
          } = props

          const [currentNumber, setCurrentNumber] = useState(
            values.content ? maxNumber - values.content.length : maxNumber,
          )
          const [disableFlag, setDisableFlag] = useState(false)

          return (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <div className="field-wrapper">
                <div className="bid-header-container">
                  <div className="stake-bid-header">{t(traitData.type)}</div>
                </div>
                {traitData.type !== 'description' && (
                  <>
                    <label style={{ marginBottom: '10px' }}>
                      <b>{t('enter title')}:</b>
                    </label>
                    <FormInput
                      id="title"
                      type="text"
                      name="title"
                      value={values.title}
                      handleChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.title && touched.title && (
                      <div className="input-feedback">{errors.title}</div>
                    )}
                  </>
                )}
                <label>
                  <b>{t('enter content')}:</b>
                </label>
                <FormTextArea
                  id="content"
                  type="text"
                  name="content"
                  containerClass="textarea-wrapper"
                  value={values.content}
                  maxLength={maxNumber}
                  handleChange={(e: any) => {
                    const length = e.target.value.length
                    if (length > maxNumber) {
                      setDisableFlag(true)
                    } else {
                      setDisableFlag(false)
                    }
                    setCurrentNumber(maxNumber - length)
                    handleChange(e)
                  }}
                  onBlur={handleBlur}
                />
                {errors.content && touched.content && (
                  <div className="input-feedback">{errors.content}</div>
                )}
                {currentNumber < 120 && currentNumber >= 0 && (
                  <div className="gallery-current-number">
                    {t('characters left')}: {currentNumber}
                  </div>
                )}
              </div>
              {isSuccess ? (
                <div className="trait-alert-wrapper">
                  <ResponseAlert status={'Success'} />
                  <div
                    className="form-submit-btn btn-disabled mt-20 m-0auto"
                    onClick={onClose}
                  >
                    {t('close')}
                  </div>
                </div>
              ) : (
                <div className="send-divider mb-40">
                  <SubmitButton
                    isDisabled={disableFlag}
                    isLoading={isLoading}
                    title={t('confirm')}
                    className="m-0auto"
                    onPress={handleSubmit}
                  />
                  {!isLoading && (
                    <div
                      className="form-submit-btn btn-disabled mt-20 m-0auto"
                      onClick={onClose}
                    >
                      {t('cancel')}
                    </div>
                  )}
                </div>
              )}
            </form>
          )
        }}
      </Formik>
    </section>
  )
}

export default CreateTrait
