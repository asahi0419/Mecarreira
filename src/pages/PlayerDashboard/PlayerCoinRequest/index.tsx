import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import MobileDetect from 'mobile-detect'
import * as Yup from 'yup'
import classnames from 'classnames'
import FormInput from '@components/Form/FormInput'
import Select from '@components/Form/Select'
import SubmitButton from '@components/Button/SubmitButton'
import { useTranslation } from 'react-i18next'
import FormCheckbox from '@components/Form/FormCheckbox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import WalletForm from '@pages/Wallet/WalletForm'

import { THEME_COLORS, monthSet } from '@root/constants'
import {
  checkPlayerStatus,
  createPlayer,
  fetchPassportImage,
  fetchPassportImageInit,
  getApprovedCountriesForPlayerCreation,
  getPlayerData,
  reCreatePlayer,
  resetCreatePlayerError,
  resetWhatsappUnverified,
} from '@root/apis/playerCoins/playerCoinsSlice'
import Spinner from '@components/Spinner'
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'
import Input, {
  getCountries,
  getCountryCallingCode,
} from 'react-phone-number-input/input'
import { useNavigate } from 'react-router-dom'
import 'react-phone-number-input/style.css'
import classNames from 'classnames'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import CloseIcon from '../../../assets/icons/icon/closeIcon.svg'
import { isMobile } from '@utils/helpers'
import DialogBox from '@components/Dialog/DialogBox'
import OtpWhatsApp from './OtpWhatsApp'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ImageComponent from '@components/ImageComponent'
import Instagram from '@components/Svg/Instagram'
import WalletDialog from '@components/Dialog/WalletDialog'
import {
  getQualificationSetting,
  showWalletForm,
  verifyInviteCode,
} from '@root/apis/onboarding/authenticationSlice'
import CountrySelect from '@components/CountryDropdown'
import CustomCountrySelect from './CustomCountrySelect'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'

const referralCodeLocal = localStorage.getItem('referral_code')

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const today = new Date()
const targetDate = new Date(
  today.getFullYear() - 122,
  today.getMonth(),
  today.getDate(),
)
interface Years {
  id: number
  value: number
  title: number
}

let repeat: any = null
let timeout: any
const PlayerCoinRequest: React.FC = () => {
  const { t } = useTranslation()
  const nameRegex = /^[a-zA-Z\s]*$/
  const dispatch = useDispatch()
  const [yearSet, setYearSet] = useState<Years[]>([])
  const [daysSet, setDaysSet] = useState<Years[]>([])
  const [preData, setPreData] = useState<any>(null)
  const [customCountries, setCustomCountries] = useState<any>([])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [countryCode, setCountryCode] = useState('')
  const deviceType = new MobileDetect(window.navigator.userAgent)
  const deviceOs = deviceType.os()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const includeLanding = !window.location.href.includes('/app')
  // const includeLanding = process.env.REACT_APP_MODE === 'TESTING'

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    isGetCountriesError,
    countriesData,
    postVerifyWhatsAppData,
    postVerifyWhatsAppDataCheck,
    selectedThemeRedux,
    isWalletFormVisible,
    isMandatory,
    isInviteCodeVerifying,
    verifyInviteCodeSuccessData,
    verifyReferCodeSuccessData,
    isLastReferralInputInvalid,
    linkInviteLoading,
    linkInviteError,
    linkInviteSuccessData,
    QualificationSettingData,
    referralLinkCode,
    getUserSettingsData,
  } = authenticationData
  const {
    isLoading,
    isLoadingPlayerList,
    isCreatePlayerError,
    isCreatePlayerSuccess,
    allPlayersData,
    allPlayersDataCheckStatus,
    passportimage,
    isFetchPassportImageSuccess,
    isUnverifiedUser,
    approvedCountriesListSuccess,
    approvedCountriesCodeList,
  } = playerCoinData

  const initialValues = {
    email: '',
    mobile_no: getUserSettingsData?.whastapp_number,
    firstName: '',
    surName: '',
    artistName: '',
    daySelected: '',
    monthSelected: '',
    yearSelected: '',
    nationality: '',
    transfermarkt_link: '',
    referral_code:
      referralLinkCode || localStorage.getItem('referral_code') || '',
    // referral_code: '',
    passport_image: '',
    instagram_url: '',
    language: localStorage.getItem('language'),
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile() ? '90%' : '60%',
    bgcolor: THEME_COLORS[selectedThemeRedux]['PrimaryBackground'],
    border: 'none',
    outline: 'none',
    p: 4,
    borderRadius: '20px',
  }
  const navigate = useNavigate()
  const [infoPop, setInfoPop] = useState(false)

  const handleClosePop = () => {
    setInfoPop(false)
  }
  // Prevent modal from closing when clicking outside
  const preventCloseOnClickOutside = event => {
    event.stopPropagation()
  }
  console.log('llpp;;', getCountries())
  console.log({ approvedCountriesCodeList })
  const [whatsAppOtp, setWhatsAppOtp] = useState(false)
  const handleCloseWhatsAppOtpPop = () => {
    setWhatsAppOtp(false)
  }
  useEffect(() => {
    if (whatsAppOtp) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [whatsAppOtp])
  useEffect(() => {
    if (allPlayersData) {
      if (allPlayersData[0]?.whatsappverified === 0) {
        setWhatsAppOtp(true)
      } else if (allPlayersData[0]?.whatsappverified === 1) {
        setWhatsAppOtp(false)
      }
      if (allPlayersData[0]?.playerstatusid?.id === 2 && includeLanding) {
        dispatch(getQualificationSetting())
      }
    }

    if (allPlayersData.length > 0 && allPlayersData[0]?.email) {
      const initialData = {
        email: allPlayersData[0]?.email,
        firstName: allPlayersData[0]?.givenname,
        surName: allPlayersData[0]?.surname,
        artistName: allPlayersData[0]?.artistname,
        mobile_no: allPlayersData[0]?.mobilenumber,
        transfermarkt_link: allPlayersData[0]?.transfermarkt_link,
        daySelected:
          allPlayersData[0]?.dateofbirth?.split('-')[2] >= 10
            ? allPlayersData[0]?.dateofbirth?.split('-')[2]
            : allPlayersData[0]?.dateofbirth?.split('-')[2].replace(0, ''),
        monthSelected:
          allPlayersData[0]?.dateofbirth?.split('-')[1] >= 10
            ? allPlayersData[0]?.dateofbirth?.split('-')[1] - 1
            : allPlayersData[0]?.dateofbirth?.split('-')[1].replace(0, '') - 1,
        yearSelected: parseFloat(allPlayersData[0]?.dateofbirth?.split('-')[0]),
        nationality: allPlayersData[0]?.nationality?.countryname,
        // referral_code: referralCodeLocal
        //   ? localStorage.getItem('referral_code')
        //   : '',
        referral_code: allPlayersData[0]?.referredcode
          ? allPlayersData[0]?.referredcode
          : getReferralCodeFromStorage(),
        instagram_url: allPlayersData[0]?.instagram,
        language: localStorage.getItem('language'),
      }
      console.log('all player data', allPlayersData, preData)
      setPreData(initialData)
    }
  }, [allPlayersData])

  useEffect(() => {
    if (postVerifyWhatsAppData === 'Number Verified') {
      dispatch(resetWhatsappUnverified())
    }
  }, [postVerifyWhatsAppData])

  useEffect(() => {
    if (allPlayersData[0]?.whatsappverified === 1) {
      window.scrollTo(0, document.body.scrollHeight)
    }
  }, [allPlayersData[0]])

  const getReferralCodeFromStorage = () => {
    //   ? localStorage.getItem('referral_code')
    //   : '',
    console.log('REFCODEFROMSTORAGE--', localStorage.getItem('referral_code'))
    if (referralLinkCode) {
      return referralLinkCode
    } else if (localStorage.getItem('referral_code')) {
      return localStorage.getItem('referral_code')
    }
    return ''
  }
  const getVerificationStatusMessage = () => {
    if (isInviteCodeVerifying) {
      return { msg: 'Verifying', flag: '' }
    } else if (
      verifyReferCodeSuccessData === true ||
      verifyReferCodeSuccessData === 'true'
    ) {
      return { msg: 'Valid Code', flag: 'invite-success' }
    } else if (
      verifyReferCodeSuccessData === false ||
      verifyReferCodeSuccessData === 'false'
    ) {
      return { msg: 'Invalid Code', flag: 'invite-error' }
    }
    return {}
  }
  useEffect(() => {
    console.log('player_req_mounted', allPlayersData)
    setDate(targetDate)
    setYears(122)
    if (allPlayersData.length > 0 && allPlayersData[0]?.email) {
      const initialData = {
        email: allPlayersData[0]?.email,
        firstName: allPlayersData[0]?.givenname,
        surName: allPlayersData[0]?.surname,
        artistName: allPlayersData[0]?.artistname,
        mobile_no: allPlayersData[0]?.mobilenumber,
        transfermarkt_link: allPlayersData[0]?.transfermarkt_link,
        daySelected:
          allPlayersData[0]?.dateofbirth?.split('-')[2] >= 10
            ? allPlayersData[0]?.dateofbirth?.split('-')[2]
            : allPlayersData[0]?.dateofbirth?.split('-')[2].replace(0, ''),
        monthSelected:
          allPlayersData[0]?.dateofbirth?.split('-')[1] >= 10
            ? allPlayersData[0]?.dateofbirth?.split('-')[1] - 1
            : allPlayersData[0]?.dateofbirth?.split('-')[1].replace(0, '') - 1,
        yearSelected: parseFloat(allPlayersData[0]?.dateofbirth?.split('-')[0]),
        nationality: allPlayersData[0]?.nationality?.countryname,
        // referral_code: referralCodeLocal
        //   ? localStorage.getItem('referral_code')
        //   : '',
        referral_code: allPlayersData[0]?.referredcode
          ? allPlayersData[0]?.referredcode
          : getReferralCodeFromStorage(),
        instagram_url: allPlayersData[0]?.instagram,
        language: localStorage.getItem('language'),
      }
      console.log('all player data', allPlayersData, preData)
      setPreData(initialData)
    }
    if (
      localStorage.getItem('referral_code') &&
      allPlayersData[0]?.whatsappverified === undefined
    ) {
      try {
        const referralId =
          // window.location?.pathname?.split('/')?.pop() ||
          localStorage.getItem('referral_code')
        // setDefaultInviteCode(referralId)
        dispatch(checkPlayerStatus())
        setTimeout(() => {
          dispatch(
            verifyInviteCode({
              referral: referralId,
              code_type: 2,
            }),
          )
        }, 1000)
      } catch (error) {
        console.log('inviteerr--', error)
      }
    }
    return () => {
      clearTimeout(timeout)
      clearInterval(repeat)
      dispatch(resetCreatePlayerError())
    }
  }, [])

  console.log({ approvedCountriesListSuccess, preData })

  useEffect(() => {
    if (approvedCountriesListSuccess.length > 0) {
      // const data = approvedCountriesListSuccess.map(country => ({
      //   label: country.countrynamenice,
      //   value: country?.iso2,
      // }))
      const data = approvedCountriesListSuccess.map(country => country?.iso2)
      console.log('countryData--' + JSON.stringify(data))
      setCustomCountries(data)
    }
  }, [approvedCountriesListSuccess])

  useEffect(() => {
    console.log({ allPlayersDataCheckStatus })
    if (
      allPlayersDataCheckStatus &&
      allPlayersDataCheckStatus.length > 0 &&
      referralCodeLocal?.length === 8
    ) {
      if (allPlayersDataCheckStatus[0]?.playerstatusid?.id === 2) {
        localStorage.removeItem('referral_code')
        if (QualificationSettingData !== 0) {
          window.location.href = `/player-dashboard`
        }
        console.log('fetching_player_data21')
        dispatch(getPlayerData({}))
        clearInterval(repeat)
      }
    } else if (
      allPlayersDataCheckStatus &&
      allPlayersDataCheckStatus.length > 0
    ) {
      if (allPlayersDataCheckStatus[0]?.playerstatusid?.id === 2) {
        console.log('fetching_player_data22')
        dispatch(getPlayerData({}))
        clearInterval(repeat)
      }
    }
  }, [allPlayersDataCheckStatus])

  useEffect(() => {
    if (isCreatePlayerSuccess) {
      dispatch(getQualificationSetting())
    }
    if (
      isCreatePlayerSuccess ||
      ['Pending', 'Unverified'].includes(
        allPlayersData[0]?.playerstatusid?.playerstatusname,
      )
    ) {
      if (allPlayersData[0]?.playerstatusid?.playerstatusname === 'Pending') {
        checkPlayerDetail()
      }
      if (allPlayersData.length > 0 && allPlayersData[0]?.email) {
        const initialData = {
          email: allPlayersData[0]?.email,
          firstName: allPlayersData[0]?.givenname,
          surName: allPlayersData[0]?.surname,
          mobile_no: allPlayersData[0]?.mobilenumber,
          artistName: allPlayersData[0]?.artistname,
          transfermarkt_link: allPlayersData[0]?.transfermarkt_link,
          passportimage: passportimage,
          daySelected:
            allPlayersData[0]?.dateofbirth?.split('-')[2] >= 10
              ? allPlayersData[0]?.dateofbirth?.split('-')[2]
              : allPlayersData[0]?.dateofbirth?.split('-')[2].replace(0, ''),
          monthSelected:
            allPlayersData[0]?.dateofbirth?.split('-')[1] >= 10
              ? allPlayersData[0]?.dateofbirth?.split('-')[1] - 1
              : allPlayersData[0]?.dateofbirth?.split('-')[1].replace(0, '') -
                1,
          yearSelected: parseFloat(
            allPlayersData[0]?.dateofbirth?.split('-')[0],
          ),
          referral_code: allPlayersData[0]?.referredcode,
          nationality: allPlayersData[0]?.nationality?.countryname,
          instagram_url: allPlayersData[0]?.instagram,
          language: localStorage.getItem('language'),
        }
        console.log({ initialData })
        setPreData(initialData)
      }
    }
  }, [isCreatePlayerSuccess, allPlayersData])

  const checkPlayerDetail = () => {
    clearInterval(repeat)
    console.log('interval running')
    repeat = setInterval(() => {
      console.log('for test 5')
      dispatch(checkPlayerStatus())
    }, 10000)
  }

  useEffect(() => {
    return () => {
      clearInterval(repeat)
    }
  }, [])
  console.log({ preData, initialValues, referralLinkCode })

  useEffect(() => {
    // clearInterval(repeat)
    console.log({ document })
    if (!document.hidden) {
      if (allPlayersData[0]?.playerstatusid?.playerstatusname === 'Pending') {
        checkPlayerDetail()
      }
    }
  }, [document.hidden])

  const getFormFieldDisabled = () => {
    if (allPlayersData[0]?.player_referral_required) {
      if (
        (referralCode && !verifyReferCodeSuccessData) ||
        isLastReferralInputInvalid ||
        postVerifyWhatsAppDataCheck ||
        allPlayersData[0]?.whatsappverified === 1
      ) {
        return true
      }
    } else {
      return false
    }
  }

  const getNationIndex = (iso: string) => {
    return countriesData.findIndex((item: any) => item.iso2 === iso) + 1
  }

  async function onSubmitForm(values: any) {
    try {
      const parsedPhoneNumber = parsePhoneNumber(values.mobile_no)
      const phoneNumber =
        '+' +
        parsedPhoneNumber?.countryCallingCode +
        '-' +
        parsedPhoneNumber?.nationalNumber
      const form_data = new FormData()
      const reqParams: any = {
        artistname: values.artistName ?? '',
        givenname: values.firstName,
        surname: values.surName,
        nationality: getNationIndex(values.nationality),
        email: values.email,
        dateofbirth:
          values.yearSelected +
          '-' +
          (parseFloat(values.monthSelected) + 1) +
          '-' +
          values.daySelected,
        instagram_url: values.instagram_url,
        referral_code: values.referral_code ?? '',
        transfermarkt_link: values.transfermarkt_link ?? '',
        passport_image: values.passport_image,
        mobile_no: phoneNumber,
      }
      if (!values.instagram_url) {
        delete reqParams.instagram_url
      }
      if (!values.artistName) {
        delete reqParams.artistname
      }
      if (!values.referral_code) {
        delete reqParams.referral_code
      }
      if (!values.transfermarkt_link) {
        delete reqParams.transfermarkt_link
      }
      for (const key in reqParams) {
        form_data.append(key, reqParams[key])
      }
      if (allPlayersData[0]?.whatsappverified === 0) {
        form_data.append('id', allPlayersData[0]?.id)
        if (reqParams.passport_image === undefined) {
          form_data.append('passport_image', '')
        }
        await dispatch(reCreatePlayer(form_data))
        if (isCreatePlayerSuccess) {
          console.log('fetching_player_data23')
          dispatch(getPlayerData({}))
        }
      } else {
        await dispatch(createPlayer(form_data))
        timeout = setTimeout(() => {
          console.log('fetching_player_data24')
          dispatch(getPlayerData({}))
        }, 2000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  function setDate(date: any) {
    setDays(date.getMonth())
  }

  function setDays(monthIndex: number) {
    const optionCount = 0
    const daysCount = daysInMonth[monthIndex]
    const daysArr: any[] = []
    if (optionCount < daysCount) {
      for (let i = optionCount; i < daysCount; i++) {
        daysArr.push({
          id: i + 1,
          value: i + 1,
          title: i + 1,
        })
      }
      setDaysSet(daysArr)
    }
  }

  function setYears(val: number) {
    const year = targetDate.getFullYear()
    const yearArr: any[] = []
    for (let i = 0; i <= val; i++) {
      yearArr.push({
        id: i + 1,
        value: year + i,
        title: year + i,
      })
    }
    setYearSet(yearArr.reverse())
  }

  const handleMonthChange = (evt: any) => {
    setDays(evt.target.value)
  }

  const handleAcceptTerms = (isChecked: boolean) => {
    setTermsAccepted(isChecked)
  }

  const handleAcceptPrivacy = (isChecked: boolean) => {
    setPrivacyAccepted(isChecked)
  }

  useEffect(() => {
    if (allPlayersData[0]?.email && allPlayersData[0]?.whatsappverified === 0) {
      setTermsAccepted(false)
      setPrivacyAccepted(false)
    }
  }, [allPlayersData[0]])

  const checkVerificationStatus = () => {
    if (allPlayersData[0]?.whatsappverified === 0) {
      setWhatsAppOtp(true)
      return
    }
    console.log('for test 6')
    dispatch(checkPlayerStatus())
  }

  const getDefaultNation = () => {
    if (allPlayersData.length > 0 && allPlayersData[0]?.nationality) {
      const selectedNation: any = countriesData.filter(
        (item: any) =>
          item.countryname === allPlayersData[0]?.nationality?.countryname,
      )
      return selectedNation[0]?.iso2
    }
    return ''
  }

  const handleShowImage = (evt: any) => {
    evt.preventDefault()
    dispatch(fetchPassportImage())
  }

  const handleClose = () => {
    if (isWalletFormVisible) {
      dispatch(showWalletForm({}))
    }
  }

  useEffect(() => {
    if (isFetchPassportImageSuccess) {
      dispatch(fetchPassportImageInit())
      const image: any = new Image()
      image.src = 'data:image/jpg;base64,' + passportimage
      const w: any = window.open('')
      w.document.write(image.outerHTML)
    }
  }, [isFetchPassportImageSuccess])
  const [referralCode, setReferralCode] = useState(
    allPlayersData[0]?.player_referral_required &&
      allPlayersData[0]?.playerstatusid?.id === undefined &&
      !getReferralCodeFromStorage(),
  )
  useEffect(() => {
    if (
      allPlayersData[0]?.player_referral_required &&
      verifyReferCodeSuccessData
    ) {
      setReferralCode(false)
    } else {
      setReferralCode(true)
    }
  }, [verifyReferCodeSuccessData])

  const validateForm = values => {
    const errors = {}
    // Check for trailing whitespaces in each field
    Object.keys(values).forEach(key => {
      const value = values[key]
      if (typeof value === 'string' && value.trim() !== value) {
        errors[key] = 'Trailing whitespaces are not allowed'
      }
    })
    return errors
  }

  return (
    <div
      className={classnames(
        'fullwidth dlg-content player-coin-request',
        isLoadingPlayerList && !isUnverifiedUser ? 'in-progress' : '',
      )}
    >
      {isWalletFormVisible && (
        <WalletDialog
          isOpen={isWalletFormVisible}
          onClose={handleClose}
          isMandatory={isMandatory ? true : false}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <WalletForm />
        </WalletDialog>
      )}
      {isLoadingPlayerList && !isUnverifiedUser ? (
        <div
          className={classnames(
            'loading-spinner-container mb-40 mt-40',
            'show',
          )}
        >
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <>
          {isUnverifiedUser || whatsAppOtp ? (
            <>
              {isMobile() ? (
                navigate('/otp-whatsapp')
              ) : (
                <DialogBox
                  isOpen={whatsAppOtp}
                  onClose={handleCloseWhatsAppOtpPop}
                >
                  <OtpWhatsApp isOpen={whatsAppOtp} />
                </DialogBox>
              )}
            </>
          ) : null}
          <div className="player-dashboard-title">
            {t('launch your own player coin')}
          </div>
          <div className="player-dashboard-desc">
            {t(
              'you are a football player and want to launch your own player coin?',
            ) + ' '}
            {t('we must first verify that it is you!')}
          </div>
          <Formik
            enableReinitialize={true}
            initialValues={preData || initialValues}
            onSubmit={async values => {
              onSubmitForm(values)
            }}
            validate={validateForm}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email(t('invalid email'))
                .required(t('email required')),
              mobile_no: Yup.string()
                .required(t('phone number required'))
                .min(6, 'phone number is not valid'),
              firstName: Yup.string()
                .required(t('required'))
                .min(3, t('name should be 3 characters at least')),
              surName: Yup.string()
                .required(t('required'))
                .min(3, t('surname should be 3 characters at least')),
              daySelected: Yup.string().required(t('date is required')),
              monthSelected: Yup.string().required(t('month is required')),
              yearSelected: Yup.string().required(t('year is required')),
              nationality: Yup.string().required(t('nationality is required')),
              instagram_url: Yup.string().required(
                t('Your public instagram profile url required'),
              ),
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
                isValid,
                dirty,
              } = props
              return (
                <form
                  className="player-coin-form"
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <div
                    className={classNames(
                      'input-label input-label-bold',
                      allPlayersData[0]?.referredcode ? 'opacity_disable' : '',
                    )}
                  >
                    {t('Referred by')}{' '}
                    {allPlayersData[0]?.player_referral_required ? (
                      <span className="required">{t('(required)')}</span>
                    ) : (
                      <span className="optional">{t('(optional)')}</span>
                    )}
                  </div>
                  <FormInput
                    id="referral_code"
                    type="text"
                    disabled={
                      postVerifyWhatsAppDataCheck ||
                      allPlayersData[0]?.whatsappverified === 1 ||
                      allPlayersData[0]?.referredcode
                    }
                    placeholder={t('enter referral code')}
                    name="referral_code"
                    value={values.referral_code}
                    handleChange={e => {
                      console.log(e.target.value)
                      handleChange(e)
                      // if (e.target.value.length <= 8) {
                      //   handleChange(e)
                      // }
                      // if (e.target.value.length === 8) {
                      //   dispatch(
                      //     verifyInviteCode({
                      //       referral: e.target.value,
                      //       code_type: 2,
                      //     }),
                      //   )
                      // }
                      setTimeout(() => {
                        dispatch(
                          verifyInviteCode({
                            referral: e.target.value,
                            code_type: 2,
                          }),
                        )
                      }, 100)
                      allPlayersData[0]?.player_referral_required
                        ? setReferralCode(e.target.value.length < 8)
                        : ''
                    }}
                    onBlur={handleBlur}
                    classNameWrapper={
                      allPlayersData[0]?.referredcode ? 'opacity_disable' : ''
                    }
                  />
                  {/* {errors.referral_code && touched.referral_code && (
                    <div className="input-feedback">{errors.referral_code}</div>
                  )} */}
                  <div className="invite-validation-wrapper">
                    <div style={{ flex: 1 }}>
                      {errors.referral_code && touched.referral_code && (
                        <div className="input-feedback">
                          {errors.referral_code}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      {values.referral_code.length > 0 ? (
                        <div
                          className={classNames(
                            'code-verification-status',
                            getVerificationStatusMessage()?.flag,
                          )}
                        >
                          <div className="ms-2 me-auto">
                            {getVerificationStatusMessage()?.msg}
                          </div>
                          {isInviteCodeVerifying ? (
                            <div
                              className={classNames('spinner size-small')}
                            ></div>
                          ) : verifyReferCodeSuccessData === true ||
                            verifyReferCodeSuccessData === 'true' ? (
                            <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                          ) : verifyReferCodeSuccessData === false ||
                            verifyReferCodeSuccessData === 'false' ? (
                            <CancelOutlinedIcon className="response-icon error-icon" />
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={classNames(
                      'input-label',
                      // referralCode && !verifyReferCodeSuccessData
                      getFormFieldDisabled() ? 'opacity_disable' : '',
                      values.referral_code.length > 0 ? 'mt-0' : '',
                    )}
                  >
                    {t('email address')}
                  </div>
                  <FormInput
                    id="email"
                    type="email"
                    // disabled={
                    //   (referralCode && !verifyReferCodeSuccessData) ||
                    //   postVerifyWhatsAppDataCheck ||
                    //   allPlayersData[0]?.whatsappverified === 1
                    // }
                    disabled={getFormFieldDisabled()}
                    placeholder={t('enter email address')}
                    name="email"
                    value={values.email}
                    handleChange={handleChange}
                    onBlur={handleBlur}
                    classNameWrapper={
                      getFormFieldDisabled() ? 'opacity_disable' : ''
                    }
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                  <div
                    className={classNames(
                      'input-label',
                      // referralCode && !verifyReferCodeSuccessData
                      getFormFieldDisabled() ? 'opacity_disable' : '',
                    )}
                  >
                    {t('mobile phone number')}
                  </div>
                  <PhoneInput
                    countries={approvedCountriesCodeList}
                    name="mobile_no"
                    value={values.mobile_no}
                    disabled={
                      getFormFieldDisabled() ||
                      getUserSettingsData?.whastapp_number ||
                      allPlayersData[0]?.whatsappverified === 1
                    }
                    placeholder={t('enter mobile phone number')}
                    onChange={e => setFieldValue('mobile_no', e)}
                    onCountryChange={e => e && setCountryCode(e)}
                    onBlur={handleBlur}
                    style={getFormFieldDisabled() ? { opacity: '0.4' } : {}}
                  />
                  {/* <CustomCountrySelect
                    labels={en}
                    value={values.mobile_no}
                    onChange={e => setFieldValue('mobile_no', e)}
                  /> */}
                  {errors.mobile_no && touched.mobile_no && (
                    <div className="input-feedback">{errors.mobile_no}</div>
                  )}
                  <div
                    className={classNames(
                      'input-label',
                      getFormFieldDisabled() ? 'opacity_disable' : '',
                    )}
                  >
                    {t('given name & middle name (as in passport)')}
                  </div>
                  <FormInput
                    id="name"
                    type="text"
                    placeholder={t('enter given name')}
                    name="firstName"
                    value={values.firstName}
                    handleChange={handleChange}
                    onBlur={handleBlur}
                    disabled={
                      getFormFieldDisabled() ||
                      postVerifyWhatsAppDataCheck ||
                      allPlayersData[0]?.whatsappverified === 1
                    }
                    classNameWrapper={
                      getFormFieldDisabled() ? 'opacity_disable' : ''
                    }
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="input-feedback">{errors.firstName}</div>
                  )}
                  <div
                    className={classNames(
                      'input-label',
                      getFormFieldDisabled() ? 'opacity_disable' : '',
                    )}
                  >
                    {t('surname (as in passport)')}
                  </div>
                  <FormInput
                    id="surname"
                    type="text"
                    placeholder={t('enter surname')}
                    name="surName"
                    value={values.surName}
                    handleChange={handleChange}
                    onBlur={handleBlur}
                    disabled={
                      getFormFieldDisabled() ||
                      postVerifyWhatsAppDataCheck ||
                      allPlayersData[0]?.whatsappverified === 1
                    }
                    classNameWrapper={
                      getFormFieldDisabled() ? 'opacity_disable' : ''
                    }
                  />
                  {errors.surName && touched.surName && (
                    <div className="input-feedback">{errors.surName}</div>
                  )}
                  <div
                    className={classNames(
                      'input-label',
                      getFormFieldDisabled() ? 'opacity_disable' : '',
                    )}
                  >
                    {t('artist name (leave empty if none)')}
                  </div>
                  <FormInput
                    id="artistName"
                    type="text"
                    placeholder={t('enter artist name')}
                    name="artistName"
                    value={values.artistName}
                    handleChange={handleChange}
                    onBlur={handleBlur}
                    disabled={
                      getFormFieldDisabled() ||
                      postVerifyWhatsAppDataCheck ||
                      allPlayersData[0]?.whatsappverified === 1
                    }
                    classNameWrapper={
                      getFormFieldDisabled() ? 'opacity_disable' : ''
                    }
                  />
                  {errors.artistName && touched.artistName && (
                    <div className="input-feedback">{errors.artistName}</div>
                  )}
                  <div
                    className={classNames(
                      'input-label',
                      getFormFieldDisabled() ? 'opacity_disable' : '',
                    )}
                  >
                    {t('date of Birth')}
                  </div>
                  <div className="birthday">
                    <select
                      id="select-day"
                      className={classNames(
                        'dob-select',
                        getFormFieldDisabled() ? 'opacity_disable' : '',
                      )}
                      value={values.daySelected || ''}
                      name="daySelected"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={
                        getFormFieldDisabled() ||
                        postVerifyWhatsAppDataCheck ||
                        allPlayersData[0]?.whatsappverified === 1
                      }
                    >
                      <option>DD</option>
                      {daysSet.map(({ value, title }, index) => (
                        <option key={index} value={value}>
                          {title}
                        </option>
                      ))}
                    </select>
                    <select
                      id="select-month"
                      className={classNames(
                        'dob-select',
                        getFormFieldDisabled() ? 'opacity_disable' : '',
                      )}
                      value={values.monthSelected || ''}
                      name="monthSelected"
                      onChange={(event: any) => {
                        handleChange(event)
                        handleMonthChange(event)
                      }}
                      onBlur={handleBlur}
                      disabled={
                        getFormFieldDisabled() ||
                        postVerifyWhatsAppDataCheck ||
                        allPlayersData[0]?.whatsappverified === 1
                      }
                    >
                      <option>MM</option>
                      {monthSet.map(({ value, title }, index) => (
                        <option key={index} value={value}>
                          {title}
                        </option>
                      ))}
                    </select>
                    <select
                      id="select-year"
                      className={classNames(
                        'dob-select',
                        getFormFieldDisabled() ? 'opacity_disable' : '',
                      )}
                      value={values.yearSelected || ''}
                      name="yearSelected"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={
                        getFormFieldDisabled() ||
                        postVerifyWhatsAppDataCheck ||
                        allPlayersData[0]?.whatsappverified === 1
                      }
                    >
                      <option>YYYY</option>
                      {yearSet.map(({ value, title }, index) => (
                        <option key={index} value={value}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.daySelected && touched.daySelected && (
                    <div className="input-feedback">{errors.daySelected}</div>
                  )}
                  {errors.yearSelected && touched.yearSelected && (
                    <div className="input-feedback">{errors.monthSelected}</div>
                  )}
                  {errors.yearSelected && touched.yearSelected && (
                    <div className="input-feedback">{errors.yearSelected}</div>
                  )}
                  <div
                    className={classNames(
                      'input-label',
                      getFormFieldDisabled() ? 'opacity_disable' : '',
                    )}
                  >
                    {t('nationality')}
                  </div>
                  <div
                    className={classnames(
                      'player-dashboard-select',
                      getFormFieldDisabled() ||
                        postVerifyWhatsAppDataCheck ||
                        allPlayersData[0]?.whatsappverified === 1
                        ? 'player-select-disabled'
                        : '',
                    )}
                  >
                    <Select
                      title={t('select')}
                      defaultValue={getDefaultNation()}
                      fieldName="nationality"
                      data={countriesData}
                      countryCode={
                        allPlayersData[0]?.nationality
                          ? getDefaultNation()
                          : countryCode
                      }
                      opacityDisable={getFormFieldDisabled()}
                      disabled={
                        getFormFieldDisabled() ||
                        postVerifyWhatsAppDataCheck ||
                        allPlayersData[0]?.whatsappverified === 1
                      }
                      onChange={handleChange}
                      handleBlur={handleBlur}
                      onSetValue={e => setFieldValue('nationality', e)}
                    />
                  </div>
                  {errors.nationality && touched.nationality && (
                    <div className="input-feedback">{errors.nationality}</div>
                  )}
                  {isGetCountriesError && (
                    <div className="input-feedback text-center">
                      {isGetCountriesError}
                    </div>
                  )}
                  <div
                    className={classNames(
                      'input-label',
                      getFormFieldDisabled() ? 'opacity_disable' : '',
                    )}
                  >
                    {t('passport image')}
                  </div>
                  {allPlayersData[0]?.passportimage &&
                  allPlayersData[0]?.whatsappverified === 0 ? (
                    <label className="input-label">
                      Chosen file : {allPlayersData[0]?.passportimage}
                    </label>
                  ) : (
                    ''
                  )}

                  {postVerifyWhatsAppDataCheck ||
                  allPlayersData[0]?.whatsappverified === 1 ? (
                    <div className="mb-20">
                      <a
                        className="input-label white-color"
                        href="#"
                        onClick={evt => handleShowImage(evt)}
                        target="_blank"
                      >
                        {t('click here to open')}
                      </a>
                    </div>
                  ) : (
                    <div
                      className={classNames(
                        'textinput-wrapper',
                        getFormFieldDisabled() ? 'opacity_disable' : '',
                      )}
                    >
                      <input
                        type="file"
                        id="passport_image"
                        className={classNames(
                          deviceOs === 'iOS' ? 'ios-input' : '',
                        )}
                        name="passport_image"
                        disabled={
                          getFormFieldDisabled() ||
                          postVerifyWhatsAppDataCheck ||
                          allPlayersData[0]?.whatsappverified === 1
                        }
                        onChange={(e: any) => {
                          setFieldValue('passport_image', e.target.files[0])
                        }}
                        onBlur={handleBlur}
                      />
                    </div>
                  )}
                  {errors.passport_image && (
                    <div className="input-feedback">
                      {errors.passport_image}
                    </div>
                  )}
                  <div
                    className={classNames(
                      'input-label',
                      getFormFieldDisabled() ? 'opacity_disable' : '',
                    )}
                  >
                    {t('your_public_instagram_profile')}
                    <span className="required"> {t('(required)')}</span>
                  </div>
                  <div className="instagram_url_wrapper">
                    <div
                      className="svg-primary-color"
                      style={{
                        marginTop: '10px',
                        width: '40px',
                        height: '40px',
                      }}
                    >
                      <Instagram />
                    </div>
                    <div style={{ width: '90%' }}>
                      <FormInput
                        id="instagram_url"
                        type="text"
                        disabled={
                          getFormFieldDisabled() ||
                          postVerifyWhatsAppDataCheck ||
                          allPlayersData[0]?.whatsappverified === 1
                        }
                        placeholder={t(
                          'https:https://www.instagram.com/username',
                        )}
                        name="instagram_url"
                        value={values.instagram_url}
                        handleChange={handleChange}
                        onBlur={handleBlur}
                        classNameWrapper={
                          getFormFieldDisabled() ? 'opacity_disable' : ''
                        }
                      />
                    </div>
                  </div>
                  {errors.instagram_url && touched.instagram_url && (
                    <div className="input-feedback">{errors.instagram_url}</div>
                  )}
                  {/* <div className="input-label">
                    {t('referral code(optional)')}
                  </div>
                  <FormInput
                    id="referral_code"
                    type="text"
                    disabled={
                      referralCode ||
                       postVerifyWhatsAppDataCheck ||
                      allPlayersData[0]?.whatsappverified === 1
                    }
                    placeholder={t('enter referral code')}
                    name="referral_code"
                    value={values.referral_code}
                    handleChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.referral_code && touched.referral_code && (
                    <div className="input-feedback">{errors.referral_code}</div>
                  )} */}
                  <div
                    className={classNames(
                      'input-label',
                      getFormFieldDisabled() ? 'opacity_disable' : '',
                    )}
                  >
                    <div className="info_icon_container">
                      {t('transfermarkt link(optional)')}
                      <div
                        className="info_icon_playerCoinRequest"
                        style={{ height: '22px' }}
                        onClick={() => {
                          setInfoPop(true)
                        }}
                      >
                        <InfoOutlinedIcon
                          sx={{
                            color: 'var(--secondary-foreground-color)',
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {infoPop ? (
                    <Modal
                      open={infoPop}
                      onClose={handleClosePop}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      BackdropProps={{ onClick: preventCloseOnClickOutside }}
                    >
                      <Box sx={style}>
                        <ImageComponent
                          onClick={handleClosePop}
                          className="close_icon"
                          src={CloseIcon}
                          alt=""
                        />
                        <p
                          style={{
                            fontFamily: 'Rajdhani-bold',
                            fontWeight: 'bolder',
                            fontSize: '20px',
                          }}
                        >
                          {t('profile_link')}
                        </p>
                        <p
                          style={{
                            fontFamily: 'Rajdhani-semibold',
                            fontWeight: 'bold',
                            fontSize: '16px',
                          }}
                        >
                          {t('profile_link_desc')}
                        </p>
                      </Box>
                    </Modal>
                  ) : (
                    ''
                  )}
                  <FormInput
                    id="transfermarkt_link"
                    type="text"
                    disabled={
                      getFormFieldDisabled() ||
                      postVerifyWhatsAppDataCheck ||
                      allPlayersData[0]?.whatsappverified === 1
                    }
                    placeholder={t('enter transfermarkt link')}
                    name="transfermarkt_link"
                    value={values.transfermarkt_link}
                    handleChange={handleChange}
                    onBlur={handleBlur}
                    classNameWrapper={
                      getFormFieldDisabled() ? 'opacity_disable' : ''
                    }
                  />
                  {errors.transfermarkt_link && touched.transfermarkt_link && (
                    <div className="input-feedback">
                      {errors.transfermarkt_link}
                    </div>
                  )}
                  {isLoading &&
                    !(
                      <div className="pending-verification">
                        {t('pending verification')}
                      </div>
                    )}
                  {!isLoading &&
                    !allPlayersData.id &&
                    allPlayersData[0]?.playerstatusid?.playerstatusname !==
                      'Pending' && (
                      <>
                        <div className="check-box-group">
                          <div className="terms-conditions-check">
                            <FormCheckbox
                              onChange={handleAcceptTerms}
                              defaultChecked={
                                allPlayersData[0]?.email &&
                                allPlayersData[0]?.whatsappverified === 1
                                  ? true
                                  : false
                              }
                              notDisabled={getFormFieldDisabled()}
                            />
                            <div
                              onClick={() => {
                                navigate('/terms-conditions')
                              }}
                            >
                              {t('terms & conditions')}
                            </div>
                          </div>
                          <div className="terms-conditions-check">
                            <FormCheckbox
                              onChange={handleAcceptPrivacy}
                              defaultChecked={
                                allPlayersData[0]?.email &&
                                allPlayersData[0]?.whatsappverified === 1
                                  ? true
                                  : false
                              }
                              notDisabled={getFormFieldDisabled()}
                            />
                            <div
                              onClick={() => {
                                navigate('/privacy-policy')
                              }}
                            >
                              {t('privacy_policy')}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  {isCreatePlayerError && (
                    <div className="input-feedback text-center create-player-error request-player w-none">
                      {isCreatePlayerError}
                    </div>
                  )}
                  {isCreatePlayerSuccess ? (
                    <p className="page-text semibold fullwidth mt-40 text-center">
                      <a href="#" className="resend-link no-click"></a>
                    </p>
                  ) : null}
                  <SubmitButton
                    isDisabled={
                      !termsAccepted ||
                      !privacyAccepted ||
                      !isValid ||
                      !dirty ||
                      (allPlayersData[0]?.player_referral_required &&
                        getFormFieldDisabled())
                    }
                    isLoading={isLoading}
                    title={t('request player coin')}
                    className={classnames(
                      'm-0auto',
                      allPlayersData[0]?.detailpageurl &&
                        allPlayersData[0]?.whatsappverified === 1
                        ? 'hidden'
                        : '',
                    )}
                    onPress={handleSubmit}
                  />
                  {([1, 6].includes(allPlayersData[0]?.playerstatusid?.id) ||
                    isCreatePlayerSuccess) &&
                  allPlayersData[0]?.playerstatusid?.id !== 2 ? (
                    <>
                      {postVerifyWhatsAppData ? (
                        <div className="new-draft-title">
                          {t('we are currently verifying your information')}
                        </div>
                      ) : null}
                      {allPlayersData[0]?.whatsappverified ? (
                        <Spinner
                          spinnerStatus={true}
                          title={t('pending verification')}
                          component="PlayerCoinRequest"
                        />
                      ) : (
                        ''
                      )}
                    </>
                  ) : allPlayersData[0]?.playerstatusid?.id === 2 &&
                    includeLanding ? (
                    <div className="new-draft-title">
                      {t('you have been verified and will be able to launch')}
                    </div>
                  ) : null}
                </form>
              )
            }}
          </Formik>
          {console.log('sss', allPlayersData[0])}
          {allPlayersData[0]?.playerstatusid?.playerstatusname !==
          'Subscribe' ? (
            <SubmitButton
              isDisabled={false}
              title={t(
                allPlayersData[0]?.whatsappverified
                  ? 'check status'
                  : 'request player coin',
              )}
              className={classnames(
                'form-submit-btn mt-20 m-0auto status-check-btn',
                (allPlayersData[0]?.detailpageurl &&
                  allPlayersData[0]?.whatsappverified === 1 &&
                  !['Verified', 'Cancelled'].includes(
                    allPlayersData[0]?.playerstatusid?.playerstatusname,
                  )) ||
                  (isCreatePlayerSuccess &&
                    allPlayersData[0]?.whatsappverified === 1)
                  ? ''
                  : 'hidden',
                allPlayersData[0]?.playerstatusid?.id === 2 && includeLanding
                  ? 'hidden'
                  : '',
              )}
              onPress={() => checkVerificationStatus()}
            />
          ) : null}
        </>
      )}
    </div>
  )
}

export default PlayerCoinRequest
