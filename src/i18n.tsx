import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

import enTranslation from './locales/en/common.json'
import zhTranslation from './locales/zh/common.json'
import deTranslation from './locales/de/common.json'
import esTranslation from './locales/es/common.json'
import frTranslation from './locales/fr/common.json'
import itTranslation from './locales/it/common.json'
import psTranslation from './locales/ps/common.json'
import ptTranslation from './locales/pt/common.json'

const includeLanding = !window.location.href.includes('/app')

const languageCode = includeLanding ? 'en' : localStorage.getItem('language')
i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en', //'zh',
    debug: false,
    lng: 'en', //languageCode, //selectedLanguage === 'English' ? 'en' : 'en',
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: { ...enTranslation },
      },
      zh: {
        translation: { ...zhTranslation },
      },
      de: {
        translation: { ...deTranslation },
      },
      es: {
        translation: { ...esTranslation },
      },
      fr: {
        translation: { ...frTranslation },
      },
      it: {
        translation: { ...itTranslation },
      },
      ps: {
        translation: { ...psTranslation },
      },
      pt: {
        translation: { ...ptTranslation },
      },
    },
  })

export default i18n
