import axios from 'axios'

import { demoProducts } from '../data/products'
import type { Product } from '../types'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

export async function getCatalogProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return demoProducts
}
