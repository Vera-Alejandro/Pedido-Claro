<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { computed } from 'vue'

import { useCatalogStore } from '../../stores/catalog'
import { useOrderDraftStore } from '../../stores/orderDraft'
import { useAppStore } from '../../stores/app'
import type { Product } from '../../types'

const appStore = useAppStore()
const catalogStore = useCatalogStore()
const orderStore = useOrderDraftStore()
const toast = useToast()

const lines = computed(() =>
  catalogStore.products
    .filter((product) => Boolean(orderStore.items[product.id]))
    .map((product) => ({
      product,
      quantity: orderStore.items[product.id],
    })),
)

function productName(product: Product): string {
  return appStore.locale === 'es-MX' ? product.nameEs : product.nameEn
}

function onBack() {
  orderStore.goToStep('quantity')
}

function onSave() {
  orderStore.persist()
  toast.add({
    severity: 'success',
    summary: 'OK',
    detail: String(appStore.locale === 'es-MX' ? 'Borrador guardado correctamente' : 'Draft saved successfully'),
    life: 2500,
  })
}
</script>

<template>
  <section class="space-y-4">
    <Toast />
    <h2 class="text-xl font-bold text-slate-900">{{ $t('reviewTitle') }}</h2>

    <Card class="border border-orange-100">
      <template #content>
        <p class="text-sm text-slate-600">{{ $t('selectedItems') }}: {{ orderStore.selectedCount }}</p>
        <p class="text-sm text-slate-600">{{ $t('totalUnits') }}: {{ orderStore.totalUnits }}</p>
      </template>
    </Card>

    <Card v-for="line in lines" :key="line.product.id" class="border border-orange-100">
      <template #content>
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <h3 class="line-clamp-2 text-base font-semibold text-slate-900">
              {{ line.product.brand }} {{ productName(line.product) }}
            </h3>
            <p class="text-sm text-slate-600">{{ $t('labels.code') }}: {{ line.product.code }}</p>
          </div>
          <Button
            icon="pi pi-trash"
            rounded
            text
            severity="danger"
            :aria-label="$t('actions.remove')"
            @click="orderStore.removeItem(line.product.id)"
          />
        </div>

        <Divider class="my-3" />

        <InputNumber
          :model-value="line.quantity"
          class="w-full"
          :min="1"
          :max="999"
          show-buttons
          button-layout="horizontal"
          increment-button-icon="pi pi-plus"
          decrement-button-icon="pi pi-minus"
          @update:model-value="orderStore.setQuantity(line.product.id, Number($event))"
        />
      </template>
    </Card>

    <div class="grid grid-cols-2 gap-3">
      <Button class="w-full" severity="secondary" size="large" :label="$t('back')" @click="onBack" />
      <Button class="w-full" size="large" icon="pi pi-save" :label="$t('saveDraft')" @click="onSave" />
    </div>
  </section>
</template>
