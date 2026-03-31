<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'

import LanguageToggle from './components/LanguageToggle.vue'
import StepHeader from './components/StepHeader.vue'
import LandingScreen from './components/screens/LandingScreen.vue'
import ProductSelectionScreen from './components/screens/ProductSelectionScreen.vue'
import QuantityScreen from './components/screens/QuantityScreen.vue'
import ReviewScreen from './components/screens/ReviewScreen.vue'
import { i18n } from './i18n'
import { useAppStore } from './stores/app'
import { useCatalogStore } from './stores/catalog'
import { useOrderDraftStore } from './stores/orderDraft'

const appStore = useAppStore()
const catalogStore = useCatalogStore()
const orderStore = useOrderDraftStore()

const showStepper = computed(() => orderStore.step !== 'landing')

let mediaQuery: MediaQueryList | null = null

function applySystemTheme(isDark: boolean) {
  document.documentElement.classList.toggle('app-dark', isDark)
}

function onThemeChanged(event: MediaQueryListEvent) {
  applySystemTheme(event.matches)
}

onMounted(async () => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  applySystemTheme(mediaQuery.matches)
  mediaQuery.addEventListener('change', onThemeChanged)

  if (catalogStore.products.length === 0) {
    await catalogStore.fetchProducts()
  }
})

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', onThemeChanged)
})

watch(
  () => appStore.locale,
  (locale) => {
    i18n.global.locale.value = locale
  },
  { immediate: true },
)
</script>

<template>
  <div class="min-h-screen text-slate-900">
    <main class="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6">
      <header class="theme-shell mb-4 flex items-center justify-between rounded-xl px-4 py-3 shadow-sm">
        <div>
          <p class="theme-accent-label text-xs font-bold uppercase tracking-wider">{{ $t('appName') }}</p>
          <p class="theme-subtitle text-sm font-medium">{{ $t('labels.draftHelp') }}</p>
        </div>
        <LanguageToggle />
      </header>

      <StepHeader v-if="showStepper" :step="orderStore.step" />

      <section class="mt-4">
        <LandingScreen
          v-if="orderStore.step === 'landing'"
          @begin="orderStore.goToStep('catalog')"
        />

        <ProductSelectionScreen
          v-else-if="orderStore.step === 'catalog'"
          @next="orderStore.goToStep('quantity')"
        />

        <QuantityScreen
          v-else-if="orderStore.step === 'quantity'"
          @back="orderStore.goToStep('catalog')"
          @next="orderStore.goToStep('review')"
        />

        <ReviewScreen v-else />
      </section>
    </main>
  </div>
</template>
