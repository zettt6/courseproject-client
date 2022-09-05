import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './axios'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { translation } from './locales/translation'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ['en', 'ru'],
    fallbackLng: 'en',
    detection: {
      order: ['cookie'],
      caches: ['cookie'],
    },
    resources: {
      en: { translation: translation.en },
      ru: { translation: translation.ru },
    },
  })

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
