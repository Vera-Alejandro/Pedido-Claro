<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'

import { useOrderDraftStore } from '../../stores/orderDraft'

const orderStore = useOrderDraftStore()

const emit = defineEmits<{
  begin: []
}>()

function onBegin() {
  orderStore.startOrder()
  emit('begin')
}

function onContinue() {
  orderStore.goToStep('catalog')
  emit('begin')
}

function onClearDraft() {
  orderStore.clearDraft()
}
</script>

<template>
  <Card class="theme-shell overflow-hidden shadow-sm">
    <template #title>
      <h1 class="theme-title-contrast text-3xl font-extrabold leading-tight">{{ $t('landingTitle') }}</h1>
    </template>
    <template #subtitle>
      <p class="theme-subtitle text-base font-medium">{{ $t('landingSubtitle') }}</p>
    </template>
    <template #content>
      <div class="space-y-3">
        <Button
          class="w-full"
          icon="pi pi-plus-circle"
          size="large"
          :label="$t('startOrder')"
          @click="onBegin"
        />

        <Button
          v-if="orderStore.selectedCount > 0"
          class="w-full"
          icon="pi pi-pencil"
          severity="secondary"
          size="large"
          :label="$t('continueDraft')"
          @click="onContinue"
        />

        <Button
          v-if="orderStore.selectedCount > 0"
          class="w-full"
          icon="pi pi-trash"
          severity="danger"
          outlined
          size="large"
          :label="$t('clearDraft')"
          @click="onClearDraft"
        />

        <div class="theme-stat rounded-lg p-3 text-sm font-semibold">
          {{ $t('selectedItems') }}: <strong>{{ orderStore.selectedCount }}</strong>
          <br />
          {{ $t('totalUnits') }}: <strong>{{ orderStore.totalUnits }}</strong>
        </div>
      </div>
    </template>
  </Card>
</template>
