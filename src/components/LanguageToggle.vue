<script setup lang="ts">
import { computed } from 'vue'

import { useAppStore } from '../stores/app'
import type { LocaleCode } from '../types'

const appStore = useAppStore()

const localeOptions = [
  { label: 'ES', value: 'es-MX' },
  { label: 'EN', value: 'en-US' },
]

const locale = computed({
  get: () => appStore.locale,
  set: (value: LocaleCode) => appStore.setLocale(value),
})
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-xs font-bold uppercase tracking-wide text-slate-800">{{ $t('language') }}</span>
    <SelectButton
      v-model="locale"
      :options="localeOptions"
      option-label="label"
      option-value="value"
      size="small"
      aria-label="Language switch"
    />
  </div>
</template>
