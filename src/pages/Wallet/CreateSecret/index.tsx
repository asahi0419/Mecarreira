import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import classNames from 'classnames'
import FormInput from '../../../components/Form/FormInput'
import { RequestParams as OnboardingProps } from '@root/types'
import SubmitButton from '@components/Button/SubmitButton'
import { RootState } from '@root/store/rootReducers'
import { useDispatch, useSelector } from 'react-redux'
import {
  getWalletSeed,
  removeMandatory,
} from '@root/apis/onboarding/authenticationSlice'
import {
  createWallet,
  resetWallet,
  logout,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { useTranslation } from 'react-i18next'
import { encrypt, isMobile } from '@utils/helpers'
import { PASSWORD_REGEX, THEME_COLORS } from '@root/constants'
import { resetPlayerData } from '@root/apis/playerCoins/playerCoinsSlice'
import { asyncLocalStorage } from '@utils/helpers'
import { styled } from '@mui/material/styles'
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress'

const initialValues = {
  user_secret: '',
  confirm_secret: '',
}

interface Props {
  onSubmit: any
}

const CreateSecret: React.FC<Props> = ({ onSubmit }) => {
  const { t } = useTranslation()
  const userEmail = localStorage.getItem('loginId')
  const [activeStepManual, setActiveStepManual] = useState(0)
  const [seedValue, setSeedValue] = useState([])
  const [shuffleSeedValue, setShuffleSeedValue] = useState([])
  const [seedConfirmValue, setSeedConfirmValue] = useState([])
  const [verifySeed, setVerifySeed] = useState([])
  const [isError, setIsError] = useState('')

  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    loader,
    isWalletCreatedSuccess,
    isWalletCreatedError,
    getWalletSeedData,
    walletSeedLoader,
    isOlduser,
    selectedThemeRedux,
  } = authenticationData

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    width: activeStepManual === 3 ? '100%' : '80%',
    margin: '30px auto 0px auto',
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: THEME_COLORS[selectedThemeRedux]['SecondaryBackground'],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: THEME_COLORS[selectedThemeRedux]['SecondaryForeground'],
    },
  }))

  useEffect(() => {
    if (isWalletCreatedSuccess) {
      setTimeout(() => {
        onSubmit()
      }, 1000)
      dispatch(removeMandatory())
    }
  }, [isWalletCreatedSuccess])

  async function handleSubmit(values: OnboardingProps) {
    const reqParams = {
      email: userEmail,
      user_secret: encrypt(values.user_secret),
    }
    dispatch(createWallet(reqParams))
  }

  const seedWalletBackup = () => {
    dispatch(getWalletSeed())
  }

  const logOutUser = () => {
    asyncLocalStorage.getItem('refreshToken').then(token => {
      const reqParams = {
        refresh_token: token,
      }
      dispatch(resetPlayerData())
      dispatch(resetWallet())
      // dispatch(logout(reqParams))
      dispatch(logout({ reqParams, location: 'createSecret_line106' }))
      dispatch(showWalletForm({}))
      localStorage.removeItem('secret_restricted')
      localStorage.removeItem('ISLAUNCHCLICKED')
      localStorage.removeItem('userWalletAddress')
      localStorage.removeItem('ISGOLIVECLICKED')
    })
  }

  useEffect(() => {
    if (getWalletSeedData !== '') {
      setSeedValue(getWalletSeedData.split(' '))
      setShuffleSeedValue(
        getWalletSeedData.split(' ').sort(() => 0.5 - Math.random()),
      )
      setVerifySeed(getWalletSeedData.split(' '))
      setActiveStepManual(1)
    }
  }, [getWalletSeedData])

  useEffect(() => {
    if (isOlduser) {
      setActiveStepManual(3)
    }
  }, [isOlduser])

  const stepFirst = (
    <>
      <h2 className="page-heading mt-80" style={{ textAlign: 'left' }}>
        {t('your account is verified')}
      </h2>
      <p
        className="wallet-text wallet-create-intro mt-80"
        style={{ textAlign: 'left', width: '288px' }}
      >
        {t(`create a cryptocurrency`)}
      </p>
      {walletSeedLoader ? (
        <div className="stake-spin-container mt-80 w-none">
          <div className={classNames('spinner size-small')}></div>
        </div>
      ) : (
        <button
          className="form-submit-btn btn-done verify-btn mt-10"
          onClick={seedWalletBackup}
        >
          {t(`CREATE WALLET`)}
        </button>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p
          className="back_button"
          style={{ marginLeft: '0px', marginTop: '100%' }}
          onClick={logOutUser}
        >
          {t('log out')}
        </p>
      </div>
    </>
  )
  const [isAddressCopied, setAddressCopied] = useState(false)
  const handleCopy = () => {
    setAddressCopied(!isAddressCopied)
    navigator.clipboard.writeText(getWalletSeedData ?? 's')
  }

  const handleLogout = async () => {
    asyncLocalStorage.getItem('refreshToken').then(token => {
      const reqParams = {
        refresh_token: token,
      }
      dispatch(resetPlayerData())
      dispatch(resetWallet())
      // dispatch(logout(reqParams))
      dispatch(logout({ reqParams, location: 'createSecret_line186' }))
      dispatch(showWalletForm({}))
      localStorage.removeItem('ISLAUNCHCLICKED')
      localStorage.removeItem('userWalletAddress')
      localStorage.removeItem('ISGOLIVECLICKED')
    })
  }

  const stepSecond = (
    <>
      <BorderLinearProgress variant="determinate" value={33.33} />
      <div style={{ margin: '0 40px', width: '280px' }}>
        <h2 className="page-heading mt-40" style={{ textAlign: 'left' }}>
          {t('your wallet')}
        </h2>
        <p
          className="wallet-text wallet-create-intro mt-10 t-center"
          style={{ textAlign: 'left' }}
        >
          {t('those 12 words')}
        </p>
        <div className="mt-20 seedTextButtonContainerConfirm">
          {seedValue.map((el, ind) => {
            return (
              <div className="seedTextButton" key={ind}>
                <span className="textNumber">{ind + 1}</span>
                {el}
              </div>
            )
          })}
        </div>
        <div className="flex-center">
          <div
            className="copy-button-seed tooltip-seed"
            onClick={() => handleCopy()}
            onMouseLeave={() => setAddressCopied(false)}
          >
            <span style={{ textDecoration: 'underline' }}>Copy</span>
            <span
              className={
                isAddressCopied ? 'tooltiptext tooltip-visible' : 'tooltiptext'
              }
            >
              {t('copied')}
            </span>
          </div>
        </div>
        <button
          className="form-submit-btn btn-done verify-btn mt-20"
          onClick={() => {
            setActiveStepManual(2)
          }}
        >
          {t('NEXT')}
        </button>
      </div>
      <p className="mt-60 back_button" onClick={handleLogout}>
        {t('log out')}
      </p>
    </>
  )

  useEffect(() => {
    if (seedConfirmValue.length > 0) {
      if (seedValue[0] === seedConfirmValue[0]) {
        const originalText = seedValue.join(' ')
        const isMatching = originalText.match(seedConfirmValue.join(' '))
        if (isMatching === null) {
          setIsError('Incorrect Seed')
        } else {
          setIsError('')
        }
      } else {
        setIsError('Incorrect Seed')
      }
    } else {
      setIsError('')
    }
  }, [seedConfirmValue])

  const handleVerifySeed = async () => {
    const v1 = verifySeed.join(' ')
    const v2 = seedConfirmValue.join(' ')
    if (v1 === v2) {
      setActiveStepManual(3)
    } else {
      setIsError('Incorrect Seed')
    }
  }
  const handleSelectSeed = (el: any, ind: any) => {
    const temp: any = [...seedConfirmValue]
    temp.push(el)
    setSeedConfirmValue(temp)
    let shuffleCopy: any = [...shuffleSeedValue]
    shuffleCopy = shuffleSeedValue.filter(
      (item: any, index: any) => index !== ind,
    )
    setShuffleSeedValue(shuffleCopy)
  }

  const handleDeselectSeed = (el: any, ind: any) => {
    const temp: any = [...shuffleSeedValue]
    temp.push(el)
    setShuffleSeedValue(temp)
    let shuffleCopyDe: any = [...seedConfirmValue]
    shuffleCopyDe = seedConfirmValue.filter(
      (item: any, index: any) => index !== ind,
    )
    setSeedConfirmValue(shuffleCopyDe)
  }

  const stepThird = (
    <>
      <BorderLinearProgress variant="determinate" value={66.66} />
      <div
        style={{
          margin: '0 30px',
          width: '308px',
          border: '1px solid transparent',
        }}
      >
        <h2
          className="page-heading mt-40"
          style={{ textAlign: 'left', marginLeft: '10px' }}
        >
          {t('confirm your wallet')}
        </h2>
        <p
          className="wallet-text wallet-create-intro mt-10 t-center"
          style={{ textAlign: 'left', marginLeft: '10px' }}
        >
          {t('click 12 words in correct order')}
        </p>
        <div className="seedWallet_container">
          <div className="seedWallet_keys_wrapper">
            {seedConfirmValue.map((el, ind) => {
              return (
                <button
                  className="seedTextButton_confirm_container"
                  key={ind}
                  onClick={() => {
                    handleDeselectSeed(el, ind)
                  }}
                >
                  <span className="textNumber">{ind + 1}</span>
                  {el}
                </button>
              )
            })}
          </div>
        </div>
        <div style={{ height: '140px' }}>
          <div className="mt-20 seedTextButtonContainerConfirm">
            {shuffleSeedValue.map((el, ind) => {
              return (
                <button
                  className="seedTextButton_confirm"
                  key={ind}
                  onClick={() => {
                    handleSelectSeed(el, ind)
                  }}
                >
                  {el}
                </button>
              )
            })}
          </div>
        </div>
        {isError ? (
          <div className="input-feedback text-center p-0 mb-10">{isError}</div>
        ) : null}
        <button
          disabled={seedConfirmValue.length === 12 ? false : true}
          className={classNames(
            'form-submit-btn btn-done verify-btn',
            seedConfirmValue.length === 12 ? '' : 'btn-disabled',
          )}
          onClick={() => {
            handleVerifySeed()
          }}
        >
          {t('NEXT')}
        </button>
        <p
          className="mt-20 back_button"
          onClick={() => {
            setActiveStepManual(1)
          }}
        >
          {t('back')}
        </p>
      </div>
    </>
  )
  const stepFour = (
    <>
      <BorderLinearProgress variant="determinate" value={100} />
      <h2 className="page-heading mt-40" style={{ textAlign: 'left' }}>
        {t('protect your wallet')}
      </h2>
      <p
        className="wallet-text create-secret-caption"
        style={{ textAlign: 'left' }}
      >
        {t('enter secret')}
        <br />
        {t('never share') + '.'}
      </p>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={async values => {
          handleSubmit(values)
        }}
        validationSchema={Yup.object().shape({
          user_secret: Yup.string()
            .required(t('secret Required'))
            .min(8, t('secret is too short - should be 8 chars minimum.'))
            .matches(
              PASSWORD_REGEX,
              t(
                'must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
              ),
            ),
          confirm_secret: Yup.string()
            .required(t('confirm secret required'))
            .oneOf([Yup.ref('user_secret'), null], t('secrets must match')),
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
                <div className="field-wrapper secret-field-wrapper">
                  <label>
                    <b>{t('user Secret')}</b>
                  </label>
                  <FormInput
                    id="user_secret"
                    type="password"
                    placeholder={t('user Secret')}
                    name="user_secret"
                    handleChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.user_secret && touched.user_secret && (
                    <div className="input-feedback">{errors.user_secret}</div>
                  )}
                </div>
                <div className="field-wrapper secret-field-wrapper">
                  <label>
                    <b>{t('confirm Secret')}</b>
                  </label>
                  <FormInput
                    id="confirm_secret"
                    type="password"
                    placeholder={t('confirm Secret')}
                    name="confirm_secret"
                    handleChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.confirm_secret && touched.confirm_secret && (
                    <div className="input-feedback">
                      {errors.confirm_secret}
                    </div>
                  )}
                </div>
                <div className="input-feedback text-center otp-error m-0">
                  {isWalletCreatedError}
                </div>
                <div className="input-feedback text-center otp-success mt-20">
                  {isWalletCreatedSuccess}
                </div>
                <p className="wallet-text form-note">
                  {t('note: please remember your secret')}
                  <br />
                  {t('if it gets lost')}
                </p>
                <SubmitButton
                  isLoading={loader}
                  isDisabled={!isValid || !dirty}
                  title={t('protect my wallet')}
                  className="signup-btn secret-submit"
                  onPress={handleSubmit}
                />
              </div>
              {isOlduser ? (
                <div className="bottom-close seed-logout" onClick={logOutUser}>
                  <div className="close-button">{t('log out')}</div>
                </div>
              ) : (
                <p
                  className="mt-20 back_button"
                  onClick={() => {
                    setActiveStepManual(2)
                  }}
                >
                  {t('back')}
                </p>
              )}
            </form>
          )
        }}
      </Formik>
    </>
  )
  return (
    <div className={classNames(isMobile() ? 'create-wallet-wrapper-mob' : '')}>
      <div
        id="id011"
        className={classNames(
          activeStepManual === 1 && isMobile()
            ? 'step-wrapper1'
            : activeStepManual > 2
            ? 'step-wrapper2'
            : '',
          // 'login-form',
          // 'secret-form',
          authenticationData.isOtpSent ? 'hide' : '',
        )}
      >
        {activeStepManual === 0
          ? stepFirst
          : activeStepManual === 1
          ? stepSecond
          : activeStepManual === 2
          ? stepThird
          : stepFour}
      </div>
    </div>
  )
}

export default CreateSecret
