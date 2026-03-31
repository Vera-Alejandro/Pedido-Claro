<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'
import { computed } from 'vue'

import { useCatalogStore } from '../../stores/catalog'
import { useOrderDraftStore } from '../../stores/orderDraft'
import { useAppStore } from '../../stores/app'
import type { Product } from '../../types'

const appStore = useAppStore()
const catalogStore = useCatalogStore()
const orderStore = useOrderDraftStore()

const selectedProducts = computed(() =>
  catalogStore.products.filter((product) => Boolean(orderStore.items[product.id])),
)

function getQuantity(productId: string): number {
  return orderStore.items[productId] ?? 1
}

function productName(product: Product): string {
  return appStore.locale === 'es-MX' ? product.nameEs : product.nameEn
}

const emit = defineEmits<{
  back: []
  next: []
}>()

function onBack() {
  orderStore.goToStep('catalog')
  emit('back')
}

function onNext() {
  if (orderStore.validateBeforeStep('review')) {
    orderStore.goToStep('review')
    emit('next')
  }
}
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-xl font-bold text-slate-900">{{ $t('quantityTitle') }}</h2>

    <Card class="theme-shell">
      <template #content>
        <div class="space-y-2">
          <p class="text-sm font-semibold text-slate-900">{{ $t('labels.quantityOverviewTitle') }}</p>
          <p class="text-sm text-slate-700">{{ $t('labels.quantityOverviewHelp') }}</p>
          <div class="theme-stat rounded-lg px-3 py-2 text-sm font-bold">
            {{ $t('selectedItems') }}: {{ orderStore.selectedCount }} | {{ $t('totalUnits') }}: {{ orderStore.totalUnits }}
          </div>
        </div>
      </template>
    </Card>

    <Message v-if="selectedProducts.length === 0" severity="warn" :closable="false">
      {{ $t('labels.emptyOrder') }}
    </Message>

    <div class="space-y-3">
      <Card v-for="product in selectedProducts" :key="product.id" class="border border-orange-100">
        <template #content>
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <img
                  :src="product.imageUrl"
                  :alt="`${product.brand} ${productName(product)}`"
                  class="h-20 w-20 rounded-lg object-cover ring-1 ring-orange-200"
                  loading="lazy"
                />
                <div>
                  <h3 class="text-xl font-extrabold leading-tight text-slate-900">{{ product.brand }} {{ productName(product) }}</h3>
                  <p class="text-sm font-semibold text-slate-700">{{ $t('labels.code') }}: {{ product.code }}</p>
                  <p class="text-base font-bold text-slate-800">
                    {{ $t('labels.quantity') }}:
                  </p>
                  <p class="text-base font-medium text-slate-700">
                    {{ $t('labels.orderingNow') }}:
                    <span class="rounded-md bg-emerald-700 px-2 py-1 text-lg font-extrabold text-white">
                      {{ getQuantity(product.id) }} {{ $t('labels.units') }}
                    </span>
                  </p>
                </div>
              </div>
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                :aria-label="$t('actions.remove')"
                @click="orderStore.removeItem(product.id)"
              />
            </div>

            <InputNumber
              :model-value="getQuantity(product.id)"
              input-class="w-full text-2xl font-extrabold text-center"
              class="w-full"
              :min="1"
              :max="999"
              :use-grouping="false"
              show-buttons
              button-layout="horizontal"
              decrement-button-class="p-button-secondary"
              increment-button-class="p-button-secondary"
              increment-button-icon="pi pi-plus"
              decrement-button-icon="pi pi-minus"
              @update:model-value="orderStore.setQuantity(product.id, Number($event))"
            />
          </div>
        </template>
      </Card>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <Button class="w-full" severity="secondary" size="large" :label="$t('back')" @click="onBack" />
      <Button
        class="w-full"
        size="large"
        :label="$t('next')"
        :disabled="selectedProducts.length === 0"
        @click="onNext"
      />
    </div>
  </section>
</template>
