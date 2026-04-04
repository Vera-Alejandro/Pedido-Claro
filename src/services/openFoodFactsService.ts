import type { Product } from '../types'

const BASE_URL = 'https://world.openfoodfacts.org/api/v2'
const FIELDS = 'product_name,product_name_es,brands,categories_tags,image_front_url,image_url,quantity'

function mapCategory(tags: string[]): Product['category'] {
  const joined = tags.join(' ').toLowerCase()
  if (/beverage|drink|juice|water|soda|refresco|carbonated|jugo/.test(joined)) return 'beverages'
  if (/cookie|biscuit|cracker|galleta|pastry|wafer/.test(joined)) return 'cookies'
  if (/canned|conserve|sauce|salsa|bean|frijol|tomato/.test(joined)) return 'canned'
  if (/dairy|milk|cheese|yogurt|leche|queso|cream/.test(joined)) return 'dairy'
  if (/clean|detergent|limpiador|laundry|bleach/.test(joined)) return 'cleaning'
  return 'chips'
}

export interface OffFoundResult {
  found: true
  data: Omit<Product, 'id' | 'code'>
}

export interface OffNotFoundResult {
  found: false
}

export type OffResult = OffFoundResult | OffNotFoundResult

export async function lookupBarcode(barcode: string): Promise<OffResult> {
  const response = await fetch(`${BASE_URL}/product/${barcode}.json?fields=${FIELDS}`)

  if (!response.ok) return { found: false }

  const json = (await response.json()) as {
    status: number
    product?: Record<string, unknown>
  }

  if (json.status !== 1 || !json.product) return { found: false }

  const p = json.product
  const nameEn = String(p['product_name'] ?? '').trim()
  const nameEs = String(p['product_name_es'] ?? nameEn).trim()
  const brand = String(p['brands'] ?? '').split(',')[0].trim()
  const imageUrl = String(p['image_front_url'] ?? p['image_url'] ?? '').trim()
  const pkg = String(p['quantity'] ?? '').trim()
  const categoriesTags = Array.isArray(p['categories_tags'])
    ? p['categories_tags'].map(String)
    : []

  return {
    found: true,
    data: {
      brand: brand || 'Unknown',
      nameEn: nameEn || nameEs || brand || 'Unknown',
      nameEs: nameEs || nameEn || brand || 'Unknown',
      category: mapCategory(categoriesTags),
      packageEn: pkg,
      packageEs: pkg,
      imageUrl,
      isScanned: true,
    },
  }
}
