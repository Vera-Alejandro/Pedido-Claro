import { defineStore } from 'pinia'

import { getCatalogProducts } from '../services/catalogService'
import type { Product } from '../types'

type CategoryFilter = Product['category'] | 'all'

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    products: [] as Product[],
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
        this.products = await getCatalogProducts()
      } finally {
        this.isLoading = false
      }
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
