import { defineStore } from 'pinia'

import type { LocaleCode } from '../types'

const LOCALE_KEY = 'order-app-locale'

function getInitialLocale(): LocaleCode {
  const saved = localStorage.getItem(LOCALE_KEY)
  return saved === 'en-US' ? 'en-US' : 'es-MX'
}

export const useAppStore = defineStore('app', {
  state: () => ({
    locale: getInitialLocale() as LocaleCode,
  }),
  actions: {
    setLocale(locale: LocaleCode) {
      this.locale = locale
      localStorage.setItem(LOCALE_KEY, locale)
    },
  },
})
