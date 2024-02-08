import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import AppLayout from '@components/Page/AppLayout'
import CheckIcon from '@mui/icons-material/Check'

import { tempLanguages } from '@root/constants'
import i18n from '@root/i18n'
import '@assets/css/pages/Language.css'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { setSelectedLanguage } from '@root/apis/onboarding/authenticationSlice'

const Language = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [lang, setLang] = useState(localStorage.getItem('language'))

  const languages = true
    ? [
        {
          name: 'English',
          symbol: 'en',
        },
        // {
        //   name: 'Deutsch',
        //   symbol: 'de',
        // },
      ]
    : tempLanguages

  const selectedLanguage = useSelector(
    (state: RootState) => state.authentication.selectedLanguage,
  )

  if (lang === null) {
    setLang('en')
  }

  const changeLanguage = (name: string, lng: string) => {
    i18n.changeLanguage(lng)
    setLang(lng)
    localStorage.setItem('languageName', name)
    localStorage.setItem('language', lng)
    localStorage.setItem('isLocaleSet', 'true')
    if (localStorage.getItem('loginInfo') || localStorage.getItem('loginId')) {
      dispatch(
        setSelectedLanguage({ language: lng, hasSelected: !!selectedLanguage }),
      )
    }
  }

  return (
    <AppLayout
      className="language-container"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <div
        className={classnames(
          'language-title',
          !window.location.href.includes('/app') ? 'mt-60' : '',
        )}
      >
        {t('language')}
      </div>
      {languages.map((item, index: number) => (
        <div
          className={classnames('language')}
          key={index}
          onClick={() => changeLanguage(item.name, item.symbol)}
        >
          <div>{item.name}</div>
          <div className="check-icon">
            {lang === item.symbol && <CheckIcon fontSize="small" />}
          </div>
        </div>
      ))}
    </AppLayout>
  )
}

export default Language
