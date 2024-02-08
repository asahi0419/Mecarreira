import React, { useState } from 'react'
import { Formik } from 'formik'
import Yup from '@components/YupExtended'
import classnames from 'classnames'
import SubmitButton from '@components/Button/SubmitButton'
import FormInput from '@components/Form/FormInput'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'

interface Props {
  onSubmit: any
  onClose: () => void
}

const initialValues = {
  address: '',
}

const SendNft: React.FC<Props> = ({ onSubmit, onClose }) => {
  const loginInfo = localStorage.getItem('loginInfo')
  const { t } = useTranslation()
  const [isInvalidEthAddress, setInvalidEthAddress] = useState<boolean>(false)

  const submitForm = (values: any) => {
    let isValidAddress = false
    try {
      const isAddress = ethers.utils.getAddress(values.address)
      if (isAddress) {
        isValidAddress = true
      }
    } catch (err: any) {
      if (err?.reason === 'invalid address') {
        isValidAddress = false
      }
    }
    if (isValidAddress) {
      onSubmit(values.address)
    } else {
      setInvalidEthAddress(true)
    }
  }

  Yup.addMethod(Yup.string, 'isWalletAddressValid', function (errorMessage) {
    return this.test(`test-card-type`, errorMessage, function (value: any) {
      const { path, createError } = this
      return (
        ethers.utils.isAddress(value) ||
        createError({ path, message: errorMessage })
      )
    })
  })

  return (
    <section className="wallet-container">
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={submitForm}
        validationSchema={Yup.object().shape({
          address: Yup.string()
            .required(t('receiver address required'))
            .isWalletAddressValid('Invalid address'),
        })}
      >
        {props => {
          const { touched, errors, handleChange, handleBlur, handleSubmit } =
            props
          return (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <div className="dark">
                <div className="nft-send-heading">{t('send nft')}</div>
                <label style={{ textAlign: 'left', color: '#abacb5' }}>
                  <b>{t('enter Receiver Address')}:</b>
                </label>
                <FormInput
                  id="address"
                  type="text"
                  placeholder={t('receiver Address')}
                  name="address"
                  handleChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.address && touched.address && (
                  <div className="input-feedback">{errors.address}</div>
                )}
                {isInvalidEthAddress && (
                  <div className="input-feedback text-center fullwidth mt-40">
                    {t('invalid etherium address')}
                  </div>
                )}
                <div className="nft-send-desc">
                  {t('this must be valid polygon address')}
                </div>
              </div>
              {!loginInfo ? (
                <div className="send-divider mb-40">
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
                  <div className={classnames('send-divider mb-40')}>
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
                </>
              )}
            </form>
          )
        }}
      </Formik>
    </section>
  )
}

export default SendNft
