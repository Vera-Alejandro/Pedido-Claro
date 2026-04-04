<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { NotFoundException } from '@zxing/library'
import { useToast } from 'primevue/usetoast'
import { useCatalogStore } from '../stores/catalog'
import { lookupBarcode } from '../services/openFoodFactsService'
import type { Product } from '../types'

type ScannerState = 'idle' | 'scanning' | 'reading' | 'lookup' | 'preview' | 'manual' | 'error'

interface ScannerControls {
  stop: () => void
}

const props = defineProps<{ visible: boolean }>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  added: [product: Product]
}>()

const { t } = useI18n()
const toast = useToast()
const catalogStore = useCatalogStore()

const localVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const state = ref<ScannerState>('idle')
const errorMessage = ref('')
const detectedBarcode = ref('')
const pendingProduct = ref<Product | null>(null)

const fileInput = ref<HTMLInputElement | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
let scannerControls: ScannerControls | null = null

const formErrors = ref({ brand: false, nameEs: false })
const form = ref({
  barcode: '',
  brand: '',
  nameEs: '',
  nameEn: '',
  category: 'chips' as Product['category'],
  pkg: '',
})

const categoryOptions = [
  { label: 'Botanas / Chips', value: 'chips' as Product['category'] },
  { label: 'Bebidas / Beverages', value: 'beverages' as Product['category'] },
  { label: 'Galletas / Cookies', value: 'cookies' as Product['category'] },
  { label: 'Enlatados / Canned', value: 'canned' as Product['category'] },
  { label: 'Limpieza / Cleaning', value: 'cleaning' as Product['category'] },
  { label: 'Lácteos / Dairy', value: 'dairy' as Product['category'] },
]

function stopLiveScan() {
  scannerControls?.stop()
  scannerControls = null
}

function reset() {
  stopLiveScan()
  state.value = 'idle'
  errorMessage.value = ''
  detectedBarcode.value = ''
  pendingProduct.value = null
  formErrors.value = { brand: false, nameEs: false }
  if (fileInput.value) fileInput.value.value = ''
}

watch(
  () => props.visible,
  (val) => {
    if (!val) reset()
  },
)

// --- Photo / file capture ---

function triggerPhoto() {
  fileInput.value?.click()
}

async function onFileCapture(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  state.value = 'reading'
  const url = URL.createObjectURL(file)

  try {
    const reader = new BrowserMultiFormatReader()
    const result = await reader.decodeFromImageUrl(url)
    detectedBarcode.value = result.getText()
    URL.revokeObjectURL(url)
    await queryProduct(detectedBarcode.value)
  } catch (error) {
    if (error instanceof NotFoundException) {
      errorMessage.value = t('scanner.barcodeNotFound')
    }

    console.error('Error reading barcode from image', error)
    URL.revokeObjectURL(url)
    errorMessage.value = t('scanner.barcodeError')
    state.value = 'error'
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}

// --- Live camera scan ---

async function startLiveScan() {
  state.value = 'scanning'
  await nextTick()

  if (!videoEl.value) {
    errorMessage.value = t('scanner.cameraError')
    state.value = 'error'
    return
  }

  try {
    const reader = new BrowserMultiFormatReader()
    scannerControls = await reader.decodeFromVideoDevice(
      undefined,
      videoEl.value,
      (result, err) => {
        if (result) {
          stopLiveScan()
          detectedBarcode.value = result.getText()
          void queryProduct(detectedBarcode.value)
        } else if (err && err.name !== 'NotFoundException') {
          stopLiveScan()
          errorMessage.value = t('scanner.cameraError')
          state.value = 'error'
        }
      },
    )
  } catch {
    stopLiveScan()
    errorMessage.value = t('scanner.cameraError')
    state.value = 'error'
  }
}

// --- API lookup ---

async function queryProduct(barcode: string) {
  if (catalogStore.products.some((p) => p.id === barcode)) {
    toast.add({ severity: 'info', summary: t('scanner.duplicate'), life: 3000 })
    localVisible.value = false
    return
  }

  state.value = 'lookup'

  try {
    const result = await lookupBarcode(barcode)
    if (result.found) {
      pendingProduct.value = { id: barcode, code: barcode, ...result.data }
      state.value = 'preview'
    } else {
      goManual(barcode)
    }
  } catch {
    errorMessage.value = t('scanner.cameraError')
    state.value = 'error'
  }
}

// --- Confirm add from preview ---

function confirmAdd() {
  if (!pendingProduct.value) return
  catalogStore.addScannedProduct(pendingProduct.value)
  toast.add({ severity: 'success', summary: t('scanner.added'), life: 2500 })
  emit('added', pendingProduct.value)
  localVisible.value = false
}

// --- Manual entry ---

function goManual(barcodeOrPartial?: string | Partial<Product>) {
  formErrors.value = { brand: false, nameEs: false }
  if (typeof barcodeOrPartial === 'string') {
    form.value = { barcode: barcodeOrPartial, brand: '', nameEs: '', nameEn: '', category: 'chips', pkg: '' }
  } else if (barcodeOrPartial && typeof barcodeOrPartial === 'object') {
    form.value = {
      barcode: barcodeOrPartial.code ?? '',
      brand: barcodeOrPartial.brand ?? '',
      nameEs: barcodeOrPartial.nameEs ?? '',
      nameEn: barcodeOrPartial.nameEn ?? '',
      category: barcodeOrPartial.category ?? 'chips',
      pkg: barcodeOrPartial.packageEs ?? '',
    }
  } else {
    form.value = { barcode: '', brand: '', nameEs: '', nameEn: '', category: 'chips', pkg: '' }
  }
  state.value = 'manual'
}

function saveManual() {
  formErrors.value = {
    brand: !form.value.brand.trim(),
    nameEs: !form.value.nameEs.trim(),
  }
  if (formErrors.value.brand || formErrors.value.nameEs) return

  const code = form.value.barcode.trim() || `MANUAL-${Date.now()}`

  if (catalogStore.products.some((p) => p.id === code)) {
    toast.add({ severity: 'info', summary: t('scanner.duplicate'), life: 3000 })
    localVisible.value = false
    return
  }

  const product: Product = {
    id: code,
    code,
    brand: form.value.brand.trim(),
    nameEs: form.value.nameEs.trim(),
    nameEn: form.value.nameEn.trim() || form.value.nameEs.trim(),
    category: form.value.category,
    packageEs: form.value.pkg.trim(),
    packageEn: form.value.pkg.trim(),
    imageUrl: '',
    isScanned: true,
  }

  catalogStore.addScannedProduct(product)
  toast.add({ severity: 'success', summary: t('scanner.added'), life: 2500 })
  emit('added', product)
  localVisible.value = false
}
</script>

<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    :header="t('scanner.title')"
    :style="{ width: '95vw', maxWidth: '480px' }"
    :draggable="false"
  >
    <!-- IDLE -->
    <div v-if="state === 'idle'" class="space-y-3">
      <p class="text-base text-slate-600">{{ t('scanner.intro') }}</p>

      <Button
        icon="pi pi-camera"
        :label="t('scanner.takePhoto')"
        class="w-full"
        size="large"
        aria-label="t('scanner.takePhoto')"
        @click="triggerPhoto"
      />

      <Button
        icon="pi pi-video"
        :label="t('scanner.liveScan')"
        class="w-full"
        size="large"
        severity="secondary"
        aria-label="t('scanner.liveScan')"
        @click="startLiveScan"
      />

      <Button
        icon="pi pi-pencil"
        :label="t('scanner.enterManually')"
        class="w-full"
        severity="secondary"
        text
        @click="goManual()"
      />

      <!-- Hidden file input — capture="environment" opens rear camera on iOS/Android -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
        aria-hidden="true"
        tabindex="-1"
        @change="onFileCapture"
      />
    </div>

    <!-- SCANNING (live camera) -->
    <div v-else-if="state === 'scanning'" class="space-y-3">
      <div class="relative overflow-hidden rounded-xl bg-black aspect-[4/3]">
        <video
          ref="videoEl"
          class="w-full h-full object-cover"
          autoplay
          playsinline
          muted
          aria-label="Camera feed for barcode scanning"
        />
        <!-- Targeting overlay -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="w-56 h-36 rounded-2xl border-4 border-white/80 shadow-lg" />
        </div>
      </div>
      <p class="text-center text-sm text-slate-600">{{ t('scanner.scanning') }}</p>
      <Button
        :label="t('scanner.cancel')"
        severity="secondary"
        class="w-full"
        size="large"
        @click="stopLiveScan(); state = 'idle'"
      />
    </div>

    <!-- READING / LOOKUP -->
    <div
      v-else-if="state === 'reading' || state === 'lookup'"
      class="flex flex-col items-center gap-4 py-8"
      role="status"
      aria-live="polite"
    >
      <ProgressSpinner style="width: 56px; height: 56px" />
      <p class="text-base font-medium text-slate-700">
        {{ state === 'reading' ? t('scanner.readingBarcode') : t('scanner.lookingUp') }}
      </p>
      <p v-if="detectedBarcode && state === 'lookup'" class="font-mono text-sm text-slate-500">
        {{ t('scanner.detected') }}: {{ detectedBarcode }}
      </p>
    </div>

    <!-- PREVIEW -->
    <div v-else-if="state === 'preview' && pendingProduct" class="space-y-4">
      <p class="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        {{ t('scanner.productFound') }}
      </p>

      <!-- Product preview card -->
      <div class="flex gap-4 rounded-xl border border-orange-100 bg-orange-50 p-4">
        <img
          v-if="pendingProduct.imageUrl"
          :src="pendingProduct.imageUrl"
          :alt="pendingProduct.nameEs"
          class="h-24 w-24 rounded-lg object-cover flex-shrink-0"
          loading="lazy"
        />
        <div
          v-else
          class="h-24 w-24 rounded-lg bg-orange-200 flex items-center justify-center flex-shrink-0"
          aria-hidden="true"
        >
          <i class="pi pi-image text-3xl text-orange-400" />
        </div>

        <div class="min-w-0 space-y-1">
          <p class="font-bold text-slate-900 text-base leading-tight">{{ pendingProduct.brand }}</p>
          <p class="text-slate-700 text-sm line-clamp-2">{{ pendingProduct.nameEs }}</p>
          <p v-if="pendingProduct.nameEn !== pendingProduct.nameEs" class="text-slate-500 text-xs">
            {{ pendingProduct.nameEn }}
          </p>
          <p class="font-mono text-xs text-slate-400">{{ pendingProduct.code }}</p>
          <p v-if="pendingProduct.packageEs" class="text-xs text-slate-600">
            {{ pendingProduct.packageEs }}
          </p>
        </div>
      </div>

      <Button
        icon="pi pi-plus-circle"
        :label="t('scanner.addToList')"
        class="w-full"
        size="large"
        @click="confirmAdd"
      />
      <Button
        icon="pi pi-pencil"
        :label="t('scanner.editDetails')"
        class="w-full"
        severity="secondary"
        @click="goManual(pendingProduct)"
      />
    </div>

    <!-- MANUAL ENTRY FORM -->
    <div v-else-if="state === 'manual'" class="space-y-4">
      <p class="text-base font-semibold text-slate-800">{{ t('scanner.form.title') }}</p>

      <div class="space-y-3">
        <!-- Barcode -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-slate-700" for="scan-barcode">
            {{ t('scanner.form.barcode') }}
          </label>
          <InputText
            id="scan-barcode"
            v-model="form.barcode"
            class="w-full"
            inputmode="numeric"
            :placeholder="t('scanner.form.barcode')"
          />
        </div>

        <!-- Brand -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-slate-700" for="scan-brand">
            {{ t('scanner.form.brand') }} <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <InputText
            id="scan-brand"
            v-model="form.brand"
            class="w-full"
            :class="formErrors.brand ? 'p-invalid' : ''"
            :placeholder="t('scanner.form.brand')"
            :aria-invalid="formErrors.brand"
            :aria-describedby="formErrors.brand ? 'brand-error' : undefined"
          />
          <p v-if="formErrors.brand" id="brand-error" class="text-xs text-red-600" role="alert">
            {{ t('scanner.form.brandRequired') }}
          </p>
        </div>

        <!-- Name ES -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-slate-700" for="scan-name-es">
            {{ t('scanner.form.nameEs') }} <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <InputText
            id="scan-name-es"
            v-model="form.nameEs"
            class="w-full"
            :class="formErrors.nameEs ? 'p-invalid' : ''"
            :placeholder="t('scanner.form.nameEs')"
            :aria-invalid="formErrors.nameEs"
            :aria-describedby="formErrors.nameEs ? 'name-es-error' : undefined"
          />
          <p v-if="formErrors.nameEs" id="name-es-error" class="text-xs text-red-600" role="alert">
            {{ t('scanner.form.nameRequired') }}
          </p>
        </div>

        <!-- Name EN -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-slate-700" for="scan-name-en">
            {{ t('scanner.form.nameEn') }}
          </label>
          <InputText
            id="scan-name-en"
            v-model="form.nameEn"
            class="w-full"
            :placeholder="t('scanner.form.nameEn')"
          />
        </div>

        <!-- Category -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-slate-700" for="scan-category">
            {{ t('scanner.form.category') }}
          </label>
          <Select
            id="scan-category"
            v-model="form.category"
            :options="categoryOptions"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>

        <!-- Package -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-slate-700" for="scan-pkg">
            {{ t('scanner.form.packageSize') }}
          </label>
          <InputText
            id="scan-pkg"
            v-model="form.pkg"
            class="w-full"
            :placeholder="t('scanner.form.packageSize')"
          />
        </div>
      </div>

      <Button
        icon="pi pi-check"
        :label="t('scanner.form.save')"
        class="w-full"
        size="large"
        @click="saveManual"
      />
      <Button
        :label="t('scanner.cancel')"
        severity="secondary"
        text
        class="w-full"
        @click="state = 'idle'"
      />
    </div>

    <!-- ERROR -->
    <div v-else-if="state === 'error'" class="flex flex-col items-center gap-4 py-4 text-center">
      <i class="pi pi-exclamation-triangle text-5xl text-orange-500" aria-hidden="true" />
      <p class="text-base text-slate-700" role="alert">{{ errorMessage }}</p>
      <Button
        icon="pi pi-refresh"
        :label="t('scanner.tryAgain')"
        class="w-full"
        size="large"
        @click="state = 'idle'"
      />
      <Button
        icon="pi pi-pencil"
        :label="t('scanner.enterManually')"
        class="w-full"
        severity="secondary"
        @click="goManual(detectedBarcode || undefined)"
      />
    </div>
  </Dialog>
</template>
