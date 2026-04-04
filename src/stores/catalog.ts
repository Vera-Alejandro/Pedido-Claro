import { defineStore } from 'pinia'

import { getCatalogProducts } from '../services/catalogService'
import type { Product } from '../types'

type CategoryFilter = Product['category'] | 'all'

const SCANNED_KEY = 'order-app-scanned-products'

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// localStorage keeps scanned products across sessions (intentional — scanning is effort-intensive)
function loadScannedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(SCANNED_KEY)
    return raw ? (JSON.parse(raw) as Product[]) : []
  } catch {
    return []
  }
}

function persistScannedProducts(products: Product[]): void {
  localStorage.setItem(SCANNED_KEY, JSON.stringify(products))
}

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    products: [] as Product[],
    scannedProducts: loadScannedProducts(),
    isLoading: false,
    activeCategory: 'all' as CategoryFilter,
    searchTerm: '',
    selectedOnly: false,
  }),
  getters: {
    filteredProducts(state): Product[] {
      const term = normalizeText(state.searchTerm)
      return state.products.filter((product) => {
        const byCategory =
          state.activeCategory === 'all' || product.category === state.activeCategory
        const haystack = normalizeText(`${product.brand} ${product.nameEs} ${product.nameEn}`)
        const byTerm = term.length === 0 || haystack.includes(term)
        return byCategory && byTerm
      })
    },
  },
  actions: {
    async fetchProducts() {
      this.isLoading = true
      try {
        const base = await getCatalogProducts()
        this.products = [...base, ...this.scannedProducts]
      } finally {
        this.isLoading = false
      }
    },
    addScannedProduct(product: Product) {
      if (this.products.some((p) => p.id === product.id)) return
      this.scannedProducts.push(product)
      this.products.push(product)
      persistScannedProducts(this.scannedProducts)
    },
    setCategory(category: CategoryFilter) {
      this.activeCategory = category
    },
    setSearchTerm(term: string) {
      this.searchTerm = term
    },
    setSelectedOnly(value: boolean) {
      this.selectedOnly = value
    },
  },
})
