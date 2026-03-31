export type LocaleCode = 'es-MX' | 'en-US'

export type OrderStep = 'landing' | 'catalog' | 'quantity' | 'review'

export interface Product {
  id: string
  code: string
  brand: string
  nameEs: string
  nameEn: string
  category: 'chips' | 'beverages' | 'cookies' | 'canned' | 'cleaning' | 'dairy'
  packageEs: string
  packageEn: string
  imageUrl: string
}

export interface DraftLine {
  productId: string
  quantity: number
}

export interface DraftMeta {
  id: string
  createdAt: string
  updatedAt: string
}
