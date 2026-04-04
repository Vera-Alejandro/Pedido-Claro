<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chip from 'primevue/chip'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import { computed, ref } from 'vue'

import { useCatalogStore } from '../../stores/catalog'
import { useOrderDraftStore } from '../../stores/orderDraft'
import { useAppStore } from '../../stores/app'
import type { Product } from '../../types'
import ProductScannerModal from '../ProductScannerModal.vue'

const catalogStore = useCatalogStore()
const orderStore = useOrderDraftStore()
const appStore = useAppStore()

const showScanner = ref(false)

const categoryOptions: Array<Product['category'] | 'all'> = [
  'all',
  'chips',
  'beverages',
  'cookies',
  'canned',
  'cleaning',
  'dairy',
]

const displayedProducts = computed(() => {
  if (!catalogStore.selectedOnly) {
    return catalogStore.filteredProducts
  }

  return catalogStore.filteredProducts.filter((product) => Boolean(orderStore.items[product.id]))
})

function productName(product: Product): string {
  return appStore.locale === 'es-MX' ? product.nameEs : product.nameEn
}

function packageLabel(product: Product): string {
  return appStore.locale === 'es-MX' ? product.packageEs : product.packageEn
}

function isSelected(productId: string): boolean {
  return Boolean(orderStore.items[productId])
}

function onProductAdded(product: Product) {
  orderStore.toggleItem(product.id)
}

const emit = defineEmits<{
  next: []
}>()

function goNext() {
  if (orderStore.validateBeforeStep('quantity')) {
    orderStore.goToStep('quantity')
    emit('next')
  }
}
</script>

<template>
  <section class="space-y-4">
    <div class="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
      <h2 class="text-xl font-bold text-slate-900">{{ $t('catalogTitle') }}</h2>

      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          :model-value="catalogStore.searchTerm"
          class="w-full"
          :placeholder="$t('searchPlaceholder')"
          @update:model-value="catalogStore.setSearchTerm(String($event))"
        />
      </IconField>

      <div class="flex flex-wrap gap-2">
        <Chip
          v-for="category in categoryOptions"
          :key="category"
          :label="$t(`categories.${category}`)"
          class="cursor-pointer"
          :class="catalogStore.activeCategory === category ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-900'"
          @click="catalogStore.setCategory(category)"
        />
      </div>

      <div class="flex items-center justify-between rounded-lg bg-orange-50 px-3 py-2">
        <span class="text-sm font-medium text-slate-700">{{ $t('selectedOnly') }}</span>
        <InputSwitch
          :model-value="catalogStore.selectedOnly"
          @update:model-value="catalogStore.setSelectedOnly(Boolean($event))"
        />
      </div>

      <Button
        icon="pi pi-camera"
        :label="$t('scanner.title')"
        class="w-full"
        size="large"
        severity="secondary"
        @click="showScanner = true"
      />
    </div>

    <div v-if="catalogStore.isLoading" class="rounded-xl bg-white p-5 text-center text-slate-700 shadow-sm ring-1 ring-orange-100">
      {{ $t('loading') }}
    </div>

    <div v-else-if="displayedProducts.length === 0" class="rounded-xl bg-white p-5 text-center text-slate-700 shadow-sm ring-1 ring-orange-100">
      {{ $t('labels.emptyCatalog') }}
    </div>

    <div v-else class="grid grid-cols-1 gap-3">
      <Card
        v-for="product in displayedProducts"
        :key="product.id"
        class="overflow-hidden border border-orange-100"
      >
        <template #content>
          <div class="flex gap-3">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="productName(product)"
              class="h-24 w-24 rounded-lg object-cover flex-shrink-0"
              loading="lazy"
            />
            <div
              v-else
              class="h-24 w-24 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <i class="pi pi-image text-3xl text-orange-300" />
            </div>

            <div class="min-w-0 flex-1 space-y-1">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="line-clamp-2 text-base font-semibold text-slate-900">
                    {{ product.brand }} {{ productName(product) }}
                  </h3>
                  <p class="text-sm text-slate-600">{{ $t('labels.code') }}: {{ product.code }}</p>
                  <div
                    v-if="isSelected(product.id)"
                    class="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
                  >
                    <i class="pi pi-check-circle" aria-hidden="true" />
                    <span>{{ $t('labels.inOrderBadge') }}</span>
                  </div>
                  <p
                    v-if="isSelected(product.id)"
                    class="mt-1 text-xs font-semibold text-emerald-800"
                  >
                    {{ $t('labels.inOrderDescription') }}
                  </p>
                </div>
                <Tag severity="contrast" :value="$t(`categories.${product.category}`)" />
              </div>

              <p class="text-sm text-slate-700">{{ packageLabel(product) }}</p>

              <Button
                class="mt-1 w-full"
                size="large"
                :severity="isSelected(product.id) ? 'secondary' : 'primary'"
                :label="isSelected(product.id) ? $t('actions.remove') : $t('actions.add')"
                @click="orderStore.toggleItem(product.id)"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Button
      class="w-full"
      size="large"
      icon="pi pi-arrow-right"
      icon-pos="right"
      :label="$t('next')"
      :disabled="orderStore.selectedCount === 0"
      @click="goNext"
    />

    <ProductScannerModal
      v-model:visible="showScanner"
      @added="onProductAdded"
    />
  </section>
</template>
