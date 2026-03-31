import { createApp } from 'vue'
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
