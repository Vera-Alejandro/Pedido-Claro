import { defineStore } from 'pinia'
import { z } from 'zod'

import type { OrderStep } from '../types'

const DRAFT_KEY = 'order-app-draft'

const quantitySchema = z.coerce.number().int().min(1).max(999)

interface StoredDraft {
  id: string
  step: OrderStep
  items: Record<string, number>
  createdAt: string
  updatedAt: string
}

function createDraftId(): string {
  return `draft-${Date.now()}`
}

function buildInitialDraft(): StoredDraft {
  const now = new Date().toISOString()
  return {
    id: createDraftId(),
    step: 'landing',
    items: {},
    createdAt: now,
    updatedAt: now,
  }
}

function loadStoredDraft(): StoredDraft {
  const fallback = buildInitialDraft()
  const raw = localStorage.getItem(DRAFT_KEY)

  if (!raw) {
    return fallback
  }

  try {
    const parsed = JSON.parse(raw) as StoredDraft
    if (!parsed.id || !parsed.step || !parsed.items) {
      return fallback
    }
    return parsed
  } catch {
    return fallback
  }
}

export const useOrderDraftStore = defineStore('orderDraft', {
  state: () => loadStoredDraft(),
  getters: {
    selectedCount(state): number {
      return Object.keys(state.items).length
    },
    totalUnits(state): number {
      return Object.values(state.items).reduce((sum, quantity) => sum + quantity, 0)
    },
    sortedLineIds(state): string[] {
      return Object.keys(state.items).sort()
    },
  },
  actions: {
    persist() {
      this.updatedAt = new Date().toISOString()
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          id: this.id,
          step: this.step,
          items: this.items,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        } satisfies StoredDraft),
      )
    },
    startOrder() {
      if (this.selectedCount === 0) {
        const initial = buildInitialDraft()
        this.id = initial.id
        this.items = initial.items
        this.createdAt = initial.createdAt
      }
      this.step = 'catalog'
      this.persist()
    },
    goToStep(step: OrderStep) {
      this.step = step
      this.persist()
    },
    toggleItem(productId: string) {
      if (this.items[productId]) {
        delete this.items[productId]
      } else {
        this.items[productId] = 1
      }
      this.persist()
    },
    setQuantity(productId: string, quantityValue: number | null | undefined) {
      if (!quantityValue) {
        delete this.items[productId]
        this.persist()
        return
      }

      const parsed = quantitySchema.safeParse(quantityValue)
      if (parsed.success) {
        this.items[productId] = parsed.data
        this.persist()
      }
    },
    removeItem(productId: string) {
      delete this.items[productId]
      this.persist()
    },
    clearDraft() {
      const initial = buildInitialDraft()
      this.id = initial.id
      this.step = initial.step
      this.items = initial.items
      this.createdAt = initial.createdAt
      this.updatedAt = initial.updatedAt
      localStorage.removeItem(DRAFT_KEY)
    },
    validateBeforeStep(step: Exclude<OrderStep, 'landing' | 'catalog'>): boolean {
      if (step === 'quantity') {
        return this.selectedCount > 0
      }
      if (step === 'review') {
        const quantities = Object.values(this.items)
        return quantities.length > 0 && quantities.every((q) => quantitySchema.safeParse(q).success)
      }
      return true
    },
  },
})
