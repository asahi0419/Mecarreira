import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import classnames from 'classnames'
import SubmitButton from '@components/Button/SubmitButton'
import FormInput from '@components/Form/FormInput'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isMobile } from '@utils/helpers'

interface Props {
  onSubmit: () => void
  onClose: () => void
}

const initialValues = {
  amount: 0,
}

const Send: React.FC<Props> = ({ onSubmit, onClose }) => {
  const loginInfo = localStorage.getItem('loginInfo')
  const { t } = useTranslation()

  const submitForm = (values: any) => {
    onSubmit(values.amount)
  }

  const { maxbids, bidList } = useSelector(
    (state: RootState) => state.playercoins,
  )

  console.log({ maxbids, bidList })

  return (
    <section
      className={classnames(
        'wallet-container stake-bid-container',
        isMobile() ? 'stake-bid-mobile' : '',
      )}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={submitForm}
        validationSchema={Yup.object().shape({
          amount: Yup.number()
            .max(
              parseFloat(maxbids),
              t('bid amount should be less than balance'),
            )
            .min(
              bidList.length > 0 ? bidList[0]?.bid + 0.1 : 0,
              t('bid amount should be greater than current bid'),
            )
            .moreThan(0, 'bid amount should be greater than zero')
            .required(t('bid amount required')),
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
            setFieldValue,
          } = props
          return (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <div className="field-wrapper">
                <div className="bid-header-container">
                  <div className="stake-bid-header">{t('place bid')}</div>
                </div>
                <div className="bid-desc mt-40 mb-40">
                  {t('you must place a bid')}
                </div>
                <label>
                  <b>{t('enter bid')}:</b>
                </label>
                <FormInput
                  id="amount"
                  type="text"
                  placeholder={t('amount')}
                  value={values.amount}
                  name="amount"
                  handleChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.amount && touched.amount && (
                  <div className="input-feedback">{errors.amount}</div>
                )}
                <div className="form-label-wrapper align-end fullwidth">
                  <label>{t('maximum coins to bid')}:</label>
                  <label
                    className="form-label-active"
                    onClick={() => setFieldValue('amount', maxbids)}
                  >
                    {maxbids
                      ? maxbids.length > 1
                        ? maxbids
                        : parseFloat(maxbids).toFixed(5)
                      : '0.00'}
                  </label>
                </div>
              </div>
              {!loginInfo ? (
                <div className="mt-40">
                  <SubmitButton
                    isDisabled={false}
                    title={t('confirm')}
                    className="m-0auto"
                    onPress={handleSubmit}
                  />
                  <div
                    className="form-submit-btn btn-disabled mt-20 m-0auto"
                    onClick={onClose}
                  >
                    {t('cancel')}
                  </div>
                </div>
              ) : (
                <>
                  <div className={classnames('send-divider mt-20')}>
                    <SubmitButton
                      isDisabled={false}
                      title={t('confirm')}
                      className="m-0auto"
                      onPress={handleSubmit}
                    />
                    <div
                      className={classnames(
                        'form-submit-btn btn-disabled mt-20 m-0auto',
                        'mb-40',
                      )}
                      onClick={onClose}
                    >
                      {t('cancel')}
                    </div>
                  </div>
                </>
              )}
            </form>
          )
        }}
      </Formik>
    </section>
  )
}

export default Send
