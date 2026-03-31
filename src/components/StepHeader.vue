<script setup lang="ts">
import type { OrderStep } from '../types'

defineProps<{
  step: OrderStep
}>()

const visibleSteps: OrderStep[] = ['catalog', 'quantity', 'review']
</script>

<template>
  <div class="rounded-xl border border-orange-100 bg-white px-4 py-3 shadow-sm">
    <div class="flex items-center justify-between gap-3">
      <div
        v-for="current in visibleSteps"
        :key="current"
        class="flex flex-1 items-center gap-2"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
          :class="step === current ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-800'"
        >
          {{ visibleSteps.indexOf(current) + 1 }}
        </div>
        <span class="text-xs font-medium text-slate-700">{{ $t(`steps.${current}`) }}</span>
      </div>
    </div>
  </div>
</template>
