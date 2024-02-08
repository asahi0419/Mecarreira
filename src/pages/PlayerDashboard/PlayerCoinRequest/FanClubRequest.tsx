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
import { THEME_COLORS, monthSet } from '@root/constants'
import {
  checkFanPlayerStatus,
  createFanPlayer,
  fetchPassportImage,
  fetchPassportImageInit,
  getFanPlayerData,
  reCreateFanPlayer,
  resetCreatePlayerError,
  resetWhatsappUnverified,
  getPlayerData,
  getPlayerDetails,
  setPlayerIdRedux,
  resetCreatePlayerSuccess,
} from '@root/apis/playerCoins/playerCoinsSlice'
import Spinner from '@components/Spinner'
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'
import { useNavigate, useParams } from 'react-router-dom'
import 'react-phone-number-input/style.css'
import classNames from 'classnames'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import CloseIcon from '../../../assets/icons/icon/closeIcon.svg'
import { getCountryCodeNew, getCountryNameNew, isMobile } from '@utils/helpers'
import DialogBox from '@components/Dialog/DialogBox'
import OtpWhatsApp from './OtpWhatsApp'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ImageComponent from '@components/ImageComponent'
import Instagram from '@components/Svg/Instagram'

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
const FanClubRequest: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [yearSet, setYearSet] = useState<Years[]>([])
  const [daysSet, setDaysSet] = useState<Years[]>([])
  const [preData, setPreData] = useState<any>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [countryCode, setCountryCode] = useState('')
  const [year, setYear] = useState<any>('')
  const [month, setMonth] = useState<any>('')
  const [day, setDay] = useState<any>('')
  const deviceType = new MobileDetect(window.navigator.userAgent)
  const deviceOs = deviceType.os()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    isGetCountriesError,
    countriesData,
    postVerifyWhatsAppData,
    postVerifyWhatsAppDataCheck,
    selectedThemeRedux,
  } = authenticationData
  const {
    isLoading,
    isLoadingPlayerList,
    isCreatePlayerError,
    isCreatePlayerSuccess,
    allPlayersData,
    allPlayersDataCheckStatusFan,
    allFanPlayersDataCheckStatus,
    passportimage,
    isFetchPassportImageSuccess,
    isUnverifiedUser,
    getPlayerDetailsSuccessData,
    playerId,
    approvedCountriesCodeList,
  } = playerCoinData
  useEffect(() => {
    if (allPlayersData.length > 0) {
      // console.log('allPlayersData', allPlayersData)
      // console.log(
      //   'dateofbirth allPlayersData',
      //   allPlayersData[0]?.dateofbirth?.split('-')[1] >= 10
      //     ? allPlayersData[0]?.dateofbirth?.split('-')[1] - 1
      //     : parseInt(allPlayersData[0]?.dateofbirth?.split('-')[1]) - 1,
      // )
      setCountryCode(getCountryCodeNew(allPlayersData[0]?.country_id))
      setYear(parseFloat(allPlayersData[0]?.dateofbirth?.split('-')[0]))
      setMonth(
        allPlayersData[0]?.dateofbirth?.split('-')[1] >= 10
          ? parseInt(allPlayersData[0]?.dateofbirth?.split('-')[1]) - 1
          : parseInt(allPlayersData[0]?.dateofbirth?.split('-')[1]) - 1,
      )
      setDay(
        allPlayersData[0]?.dateofbirth?.split('-')[2] >= 10
          ? allPlayersData[0]?.dateofbirth?.split('-')[2]
          : allPlayersData[0]?.dateofbirth?.split('-')[2].replace(0, ''),
      )
    }
  }, [allPlayersData])
  useEffect(() => {
    if (getPlayerDetailsSuccessData) {
      // console.log('getPlayerDetailsSuccessData', getPlayerDetailsSuccessData)
      // console.log(
      //   'dateofbirth',
      //   getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1] >= 10
      //     ? getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1] - 1
      //     : parseInt(getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1]) -
      //         1,
      // )
      setCountryCode(getCountryCodeNew(getPlayerDetailsSuccessData?.country_id))
      setYear(
        parseFloat(getPlayerDetailsSuccessData?.dateofbirth?.split('-')[0]),
      )
      setMonth(
        getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1] >= 10
          ? parseInt(getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1]) -
              1
          : parseInt(getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1]) -
              1,
      )
      setDay(
        getPlayerDetailsSuccessData?.dateofbirth?.split('-')[2] >= 10
          ? getPlayerDetailsSuccessData?.dateofbirth?.split('-')[2]
          : getPlayerDetailsSuccessData?.dateofbirth
              ?.split('-')[2]
              .replace(0, ''),
      )
    }
  }, [getPlayerDetailsSuccessData])
  const initialValues = {
    email: allPlayersData[0]?.email || getPlayerDetailsSuccessData?.email || '',
    firstName:
      allPlayersData[0]?.givenname ||
      getPlayerDetailsSuccessData?.givenname ||
      '',
    surName:
      allPlayersData[0]?.surname || getPlayerDetailsSuccessData?.surname || '',
    artistName:
      allPlayersData[0]?.artistname ||
      getPlayerDetailsSuccessData?.artistname ||
      '',
    mobile_no:
      allPlayersData[0]?.mobilenumber ||
      getPlayerDetailsSuccessData?.mobilenumber ||
      '',
    transfermarkt_link:
      allPlayersData[0]?.transfermarkt_link ||
      getPlayerDetailsSuccessData?.transfermarkt_link ||
      '',
    passport_image: '',
    daySelected:
      // allPlayersData[0]?.dateofbirth?.split('-')[2] >= 10
      //   ? allPlayersData[0]?.dateofbirth?.split('-')[2]
      //   : allPlayersData[0]?.dateofbirth?.split('-')[2].replace(0, '') ||
      //     getPlayerDetailsSuccessData?.dateofbirth?.split('-')[2] >= 10
      //   ? getPlayerDetailsSuccessData?.dateofbirth?.split('-')[2]
      //   : getPlayerDetailsSuccessData?.dateofbirth
      //       ?.split('-')[2]
      //       .replace(0, '') || '',
      day || '',
    monthSelected:
      // allPlayersData[0]?.dateofbirth?.split('-')[1] >= 10
      //   ? allPlayersData[0]?.dateofbirth?.split('-')[1] - 1
      //   : allPlayersData[0]?.dateofbirth?.split('-')[1].replace(0, '') - 1 ||
      //     getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1] >= 10
      //   ? getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1] - 1
      //   : getPlayerDetailsSuccessData?.dateofbirth
      //       ?.split('-')[1]
      //       .replace(0, '') - 1 || '',
      month > -1 ? month : '',
    yearSelected:
      // parseFloat(allPlayersData[0]?.dateofbirth?.split('-')[0]) ||
      // parseFloat(getPlayerDetailsSuccessData?.dateofbirth?.split('-')[0] || ''),
      year || '',
    nationality: countryCode !== '' ? countryCode : '',
    instagram_url:
      allPlayersData[0]?.instagram ||
      getPlayerDetailsSuccessData?.instagram ||
      '',
    language: localStorage.getItem('language'),
  }
  // console.log('initialValue', { initialValues, month })
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
  const [whatsAppOtp, setWhatsAppOtp] = useState(false)
  const handleCloseWhatsAppOtpPop = () => {
    setWhatsAppOtp(false)
    dispatch(resetCreatePlayerSuccess())
  }
  useEffect(() => {
    if (whatsAppOtp) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [whatsAppOtp])
  useEffect(() => {
    console.log({ allPlayersData })
    if (allPlayersData.length > 0) {
      if (allPlayersData[0]?.whatsappverified === 0) {
        setWhatsAppOtp(true)
      } else if (allPlayersData[0]?.whatsappverified === 1) {
        setWhatsAppOtp(false)
        dispatch(resetCreatePlayerSuccess())
      }
    }
  }, [allPlayersData])
  console.log({ termsAccepted, privacyAccepted, allPlayersData })

  const { detail, id } = useParams()

  useEffect(() => {
    if (detail && id && !isCreatePlayerSuccess) {
      dispatch(setPlayerIdRedux({ playerId: id }))
      dispatch(getPlayerDetails(detail))
    }
  }, [])

  useEffect(() => {
    if (postVerifyWhatsAppData === 'Number Verified') {
      // window.location.reload()
      dispatch(getFanPlayerData({}))
    }
  }, [postVerifyWhatsAppData])

  useEffect(() => {
    if (allPlayersData[0]?.whatsappverified === 1) {
      window.scrollTo(0, document.body.scrollHeight)
    }
  }, [allPlayersData[0]])

  useEffect(() => {
    if (isCreatePlayerSuccess) {
      dispatch(getFanPlayerData({}))
    }
  }, [isCreatePlayerSuccess])

  useEffect(() => {
    if (allPlayersData?.length > 0) {
      const initialData = {
        email: allPlayersData[0]?.email,
        firstName: allPlayersData[0]?.givenname,
        surName: allPlayersData[0]?.surname,
        mobile_no: allPlayersData[0]?.mobilenumber,
        artistName: allPlayersData[0]?.artistname,
        transfermarkt_link: allPlayersData[0]?.transfermarkt_link,
        passportimage: '',
        daySelected:
          allPlayersData[0]?.dateofbirth?.split('-')[2] >= 10
            ? allPlayersData[0]?.dateofbirth?.split('-')[2]
            : allPlayersData[0]?.dateofbirth?.split('-')[2].replace(0, ''),
        monthSelected:
          allPlayersData[0]?.dateofbirth?.split('-')[1] >= 10
            ? parseInt(allPlayersData[0]?.dateofbirth?.split('-')[1]) - 1
            : parseInt(allPlayersData[0]?.dateofbirth?.split('-')[1]) - 1,
        yearSelected: parseFloat(allPlayersData[0]?.dateofbirth?.split('-')[0]),
        nationality: getCountryCodeNew(allPlayersData[0]?.country_id),
        instagram_url: allPlayersData[0]?.instagram,
        language: localStorage.getItem('language'),
      }
      setPreData(initialData)
    }
  }, [allPlayersData])

  useEffect(() => {
    if (getPlayerDetailsSuccessData) {
      const initialData = {
        email: getPlayerDetailsSuccessData?.email,
        firstName: getPlayerDetailsSuccessData?.givenname,
        surName: getPlayerDetailsSuccessData?.surname,
        artistName: getPlayerDetailsSuccessData?.artistname,
        mobile_no: getPlayerDetailsSuccessData?.mobilenumber,
        transfermarkt_link: getPlayerDetailsSuccessData?.transfermarkt_link,
        passport_image: '',
        daySelected:
          getPlayerDetailsSuccessData?.dateofbirth?.split('-')[2] >= 10
            ? getPlayerDetailsSuccessData?.dateofbirth?.split('-')[2]
            : getPlayerDetailsSuccessData?.dateofbirth
                ?.split('-')[2]
                .replace(0, ''),
        monthSelected:
          getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1] >= 10
            ? parseInt(
                getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1],
              ) - 1
            : parseInt(
                getPlayerDetailsSuccessData?.dateofbirth?.split('-')[1],
              ) - 1,
        yearSelected: parseFloat(
          getPlayerDetailsSuccessData?.dateofbirth?.split('-')[0],
        ),
        nationality: getCountryCodeNew(getPlayerDetailsSuccessData?.country_id),
        instagram_url: getPlayerDetailsSuccessData?.instagram,
        language: localStorage.getItem('language'),
      }
      setPreData(initialData)
    }
  }, [getPlayerDetailsSuccessData])

  useEffect(() => {
    setDate(targetDate)
    setYears(122)
    if (allPlayersData?.length > 0) {
      const initialData = {
        email: allPlayersData[0]?.email,
        firstName: allPlayersData[0]?.givenname,
        surName: allPlayersData[0]?.surname,
        artistName: allPlayersData[0]?.artistname,
        mobile_no: allPlayersData[0]?.mobilenumber,
        transfermarkt_link: allPlayersData[0]?.transfermarkt_link,
        passport_image: '',
        daySelected:
          allPlayersData[0]?.dateofbirth?.split('-')[2] >= 10
            ? allPlayersData[0]?.dateofbirth?.split('-')[2]
            : allPlayersData[0]?.dateofbirth?.split('-')[2].replace(0, ''),
        monthSelected:
          allPlayersData[0]?.dateofbirth?.split('-')[1] >= 10
            ? parseInt(allPlayersData[0]?.dateofbirth?.split('-')[1]) - 1
            : parseInt(allPlayersData[0]?.dateofbirth?.split('-')[1]) - 1,
        yearSelected: parseFloat(allPlayersData[0]?.dateofbirth?.split('-')[0]),
        nationality: getCountryCodeNew(allPlayersData[0]?.country_id),
        instagram_url: allPlayersData[0]?.instagram,
        language: localStorage.getItem('language'),
      }
      setPreData(initialData)
    }
    return () => {
      clearTimeout(timeout)
      clearInterval(repeat)
      dispatch(resetCreatePlayerError())
    }
  }, [])

  useEffect(() => {
    if (allPlayersDataCheckStatusFan === true) {
      clearInterval(repeat)
      console.log('fetching_player_data20')
      dispatch(getPlayerData({}))
      navigate('/app/player-dashboard')
      //   dispatch(getFanPlayerData({}))
    }
  }, [allPlayersDataCheckStatusFan])
  useEffect(() => {
    if (allFanPlayersDataCheckStatus === 2) {
      dispatch(getFanPlayerData({}))
    }
  }, [allFanPlayersDataCheckStatus])

  useEffect(() => {
    if (isCreatePlayerSuccess || allPlayersData[0]?.claimapproved === null) {
      if (allPlayersData[0]?.claimapproved === null) {
        checkPlayerDetail()
      }
      if (allPlayersData?.length > 0) {
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
          monthSelected: month,
          yearSelected: parseFloat(
            allPlayersData[0]?.dateofbirth?.split('-')[0],
          ),
          nationality: getCountryCodeNew(allPlayersData[0]?.country_id),
          instagram_url: allPlayersData[0]?.instagram,
          language: localStorage.getItem('language'),
        }
        setPreData(initialData)
      }
    }
  }, [isCreatePlayerSuccess, allPlayersData])

  const checkPlayerDetail = () => {
    clearInterval(repeat)
    repeat = setInterval(() => {
      dispatch(checkFanPlayerStatus())
    }, 10000)
  }

  useEffect(() => {
    return () => {
      clearInterval(repeat)
    }
  }, [])

  useEffect(() => {
    clearInterval(repeat)
    if (
      allPlayersData[0]?.claimapproved === null &&
      allPlayersData[0]?.whatsappverified === 1
    ) {
      checkPlayerDetail()
    }
  }, [allPlayersData])

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
        await dispatch(reCreateFanPlayer(form_data))
        // if (isCreatePlayerSuccess) {
        //   dispatch(getFanPlayerData({}))
        // }
      } else {
        form_data.append('player_id', playerId)
        await dispatch(createFanPlayer(form_data))
        // timeout = setTimeout(() => {
        //   dispatch(getFanPlayerData({}))
        // }, 2000)
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
    console.log({ isChecked })
  }

  const handleAcceptPrivacy = (isChecked: boolean) => {
    console.log({ isChecked })
    setPrivacyAccepted(isChecked)
  }

  // useEffect(() => {
  //   if (allPlayersData[0]?.email && allPlayersData[0]?.whatsappverified === 0) {
  //     setTermsAccepted(false)
  //     setPrivacyAccepted(false)
  //   }
  // }, [allPlayersData[0]])

  const checkVerificationStatus = () => {
    if (allPlayersData[0]?.whatsappverified === 0) {
      setWhatsAppOtp(true)
      return
    }
    dispatch(checkFanPlayerStatus())
  }

  const getDefaultNation = () => {
    if (allPlayersData.length > 0 && allPlayersData[0]?.nationality) {
      const selectedNation: any = countriesData.filter(
        (item: any) =>
          item.countryname === getCountryNameNew(allPlayersData[0]?.country_id),
      )
      return selectedNation[0]?.iso2
    }
    return ''
  }

  const handleShowImage = (evt: any) => {
    evt.preventDefault()
    dispatch(fetchPassportImage())
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
  return (
    <div
      className={classnames(
        'fullwidth dlg-content player-coin-request',
        isLoadingPlayerList ? 'in-progress' : '',
      )}
    >
      {isLoadingPlayerList ? (
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
          {whatsAppOtp ? (
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
            initialValues={initialValues}
            onSubmit={async values => {
              onSubmitForm(values)
            }}
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
                  <div className="input-label">{t('email address')}</div>
                  <FormInput
                    id="email"
                    type="email"
                    disabled={
                      postVerifyWhatsAppDataCheck ||
                      allPlayersData[0]?.whatsappverified === 1
                    }
                    placeholder={t('enter email address')}
                    name="email"
                    value={values.email}
                    handleChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                  <div className="input-label">{t('mobile phone number')}</div>
                  <PhoneInput
                    countries={approvedCountriesCodeList}
                    name="mobile_no"
                    value={values.mobile_no}
                    disabled={
                      postVerifyWhatsAppDataCheck ||
                      allPlayersData[0]?.whatsappverified === 1
                    }
                    placeholder={t('enter mobile phone number')}
                    onChange={e => setFieldValue('mobile_no', e)}
                    // onCountryChange={e => e && setCountryCode(e)}
                    onBlur={handleBlur}
                  />
                  {errors.mobile_no && touched.mobile_no && (
                    <div className="input-feedback">{errors.mobile_no}</div>
                  )}
                  <div className="input-label">
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
                    // disabled={
                    //   postVerifyWhatsAppDataCheck ||
                    //   allPlayersData[0]?.whatsappverified === 1
                    // }
                    disabled={true}
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="input-feedback">{errors.firstName}</div>
                  )}
                  <div className="input-label">
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
                    // disabled={
                    //   postVerifyWhatsAppDataCheck ||
                    //   allPlayersData[0]?.whatsappverified === 1
                    // }
                    disabled={true}
                  />
                  {errors.surName && touched.surName && (
                    <div className="input-feedback">{errors.surName}</div>
                  )}
                  <div className="input-label">
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
                      postVerifyWhatsAppDataCheck ||
                      allPlayersData[0]?.whatsappverified === 1
                    }
                  />
                  {errors.artistName && touched.artistName && (
                    <div className="input-feedback">{errors.artistName}</div>
                  )}
                  <div className="input-label">{t('date of Birth')}</div>
                  <div className="birthday">
                    <select
                      id="select-day"
                      className="dob-select"
                      value={values.daySelected}
                      name="daySelected"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      // disabled={
                      //   postVerifyWhatsAppDataCheck ||
                      //   allPlayersData[0]?.whatsappverified === 1
                      // }
                      disabled={true}
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
                      className="dob-select"
                      value={values.monthSelected}
                      name="monthSelected"
                      onChange={(event: any) => {
                        handleChange(event)
                        handleMonthChange(event)
                      }}
                      onBlur={handleBlur}
                      // disabled={
                      //   postVerifyWhatsAppDataCheck ||
                      //   allPlayersData[0]?.whatsappverified === 1
                      // }
                      disabled={true}
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
                      className="dob-select"
                      value={values.yearSelected}
                      name="yearSelected"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      // disabled={
                      //   postVerifyWhatsAppDataCheck ||
                      //   allPlayersData[0]?.whatsappverified === 1
                      // }
                      disabled={true}
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
                  <div className="input-label">{t('nationality')}</div>
                  <div
                    className={classnames(
                      'player-dashboard-select',
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
                        values?.nationality ? values?.nationality : countryCode
                        // initialValues?.nationality
                        // values?.nationality
                        // countryCode
                      }
                      // disabled={
                      //   postVerifyWhatsAppDataCheck ||
                      //   allPlayersData[0]?.whatsappverified === 1
                      // }
                      disabled={true}
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
                  <div className="input-label">{t('passport image')}</div>
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
                        className="input-label text-primary-color"
                        href="#"
                        onClick={evt => handleShowImage(evt)}
                        target="_blank"
                      >
                        {t('click here to open')}
                      </a>
                    </div>
                  ) : (
                    <div className="textinput-wrapper">
                      <input
                        type="file"
                        id="passport_image"
                        className={classNames(
                          deviceOs === 'iOS' ? 'ios-input' : '',
                        )}
                        name="passport_image"
                        disabled={
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
                  <div className="input-label">
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
                          postVerifyWhatsAppDataCheck ||
                          allPlayersData[0]?.whatsappverified === 1 ||
                          getPlayerDetailsSuccessData?.sharetype === 0
                            ? true
                            : false
                        }
                        placeholder={t(
                          'https:https://www.instagram.com/username',
                        )}
                        name="instagram_url"
                        value={values.instagram_url}
                        handleChange={handleChange}
                        onBlur={handleBlur}
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
                  <div className="input-label">
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
                    // disabled={
                    //   postVerifyWhatsAppDataCheck ||
                    //   allPlayersData[0]?.whatsappverified === 1
                    // }
                    disabled={true}
                    placeholder={t('enter transfermarkt link')}
                    name="transfermarkt_link"
                    value={values.transfermarkt_link}
                    handleChange={handleChange}
                    onBlur={handleBlur}
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
                                (allPlayersData[0]?.email &&
                                  allPlayersData[0]?.whatsappverified === 1) ||
                                termsAccepted
                                  ? true
                                  : false
                              }
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
                                (allPlayersData[0]?.email &&
                                  allPlayersData[0]?.whatsappverified === 1) ||
                                privacyAccepted
                                  ? true
                                  : false
                              }
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
                  {/* {console.log('allPlayersData', allPlayersData)} */}
                  <SubmitButton
                    isDisabled={
                      !termsAccepted || !privacyAccepted || !isValid || !dirty
                    }
                    isLoading={isLoading}
                    title={t('claim')}
                    className={classnames(
                      'm-0auto',
                      allPlayersData[0]?.whatsappverified === 1 ? 'hidden' : '',
                    )}
                    onPress={handleSubmit}
                  />
                  {allPlayersData[0]?.claimapproved === null ||
                  isCreatePlayerSuccess ? (
                    <>
                      {postVerifyWhatsAppData ? (
                        <div className="new-draft-title">
                          {t('we are currently verifying your information')}
                        </div>
                      ) : null}
                      {allPlayersData[0]?.whatsappverified === 1 ? (
                        <Spinner
                          spinnerStatus={true}
                          title={t('pending verification')}
                          component="PlayerCoinRequest"
                        />
                      ) : (
                        ''
                      )}
                    </>
                  ) : null}
                </form>
              )
            }}
          </Formik>
          <SubmitButton
            isDisabled={false}
            title={t(
              allPlayersData[0]?.whatsappverified === 1
                ? 'check status'
                : 'claim',
            )}
            className={classnames(
              'form-submit-btn mt-20 m-0auto status-check-btn',
              (allPlayersData[0]?.whatsappverified === 1 &&
                allPlayersData[0]?.claimapproved === null) ||
                (isCreatePlayerSuccess &&
                  allPlayersData[0]?.whatsappverified === 1)
                ? ''
                : 'hidden',
            )}
            onPress={() => checkVerificationStatus()}
          />
        </>
      )}
    </div>
  )
}

export default FanClubRequest
