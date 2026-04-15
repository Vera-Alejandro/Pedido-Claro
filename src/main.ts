import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import { createPinia } from 'pinia'

import './style.css'
import 'primeicons/primeicons.css'

import App from './App.vue'
import { i18n } from './i18n'

const app = createApp(App)
const pinia = createPinia()

const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined
if (sentryDsn) {
  Sentry.init({
    app,
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    integrations: [],  // error tracking only — no perf tracing or session replay
    sampleRate: 1.0,   // capture all errors (low-volume personal app)
    sendDefaultPii: false,
  })
}

app.use(pinia)
app.use(i18n)
app.use(ToastService)
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			darkModeSelector: '.app-dark',
		},
	},
})

app.mount('#app')
