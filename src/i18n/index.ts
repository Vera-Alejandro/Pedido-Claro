import { createI18n } from 'vue-i18n'

import { messages } from './messages'

const savedLocale = localStorage.getItem('order-app-locale')
const locale = savedLocale === 'en-US' ? 'en-US' : 'es-MX'

export const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en-US',
  messages,
})
