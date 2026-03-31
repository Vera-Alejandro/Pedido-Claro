import type { Product } from '../types'

const rows: Array<Omit<Product, 'id'>> = [
  { code: 'CH-001', brand: 'Doritos', nameEs: 'Nacho', nameEn: 'Nacho', category: 'chips', packageEs: 'Caja 10 x 170g', packageEn: 'Case 10 x 170g', imageUrl: 'https://placehold.co/300x200/F97316/FFFFFF?text=Doritos' },
  { code: 'CH-002', brand: 'Doritos', nameEs: 'Flamin Hot', nameEn: 'Flamin Hot', category: 'chips', packageEs: 'Caja 10 x 170g', packageEn: 'Case 10 x 170g', imageUrl: 'https://placehold.co/300x200/EF4444/FFFFFF?text=Doritos+Hot' },
  { code: 'CH-003', brand: 'Lays', nameEs: 'Clasicas', nameEn: 'Classic', category: 'chips', packageEs: 'Caja 12 x 150g', packageEn: 'Case 12 x 150g', imageUrl: 'https://placehold.co/300x200/FACC15/111827?text=Lays' },
  { code: 'CH-004', brand: 'Lays', nameEs: 'Limón', nameEn: 'Lime', category: 'chips', packageEs: 'Caja 12 x 150g', packageEn: 'Case 12 x 150g', imageUrl: 'https://placehold.co/300x200/84CC16/111827?text=Lays+Lime' },
  { code: 'CH-005', brand: 'Ruffles', nameEs: 'Queso', nameEn: 'Cheddar', category: 'chips', packageEs: 'Caja 10 x 145g', packageEn: 'Case 10 x 145g', imageUrl: 'https://placehold.co/300x200/FB923C/111827?text=Ruffles' },
  { code: 'CH-006', brand: 'Sabritas', nameEs: 'Adobadas', nameEn: 'Adobadas', category: 'chips', packageEs: 'Caja 14 x 120g', packageEn: 'Case 14 x 120g', imageUrl: 'https://placehold.co/300x200/DC2626/FFFFFF?text=Sabritas' },
  { code: 'CH-007', brand: 'Takis', nameEs: 'Fuego', nameEn: 'Fuego', category: 'chips', packageEs: 'Caja 18 x 65g', packageEn: 'Case 18 x 65g', imageUrl: 'https://placehold.co/300x200/7C2D12/FFFFFF?text=Takis' },
  { code: 'CH-008', brand: 'Churrumais', nameEs: 'Original', nameEn: 'Original', category: 'chips', packageEs: 'Caja 20 x 58g', packageEn: 'Case 20 x 58g', imageUrl: 'https://placehold.co/300x200/B45309/FFFFFF?text=Churrumais' },

  { code: 'BV-001', brand: 'Jarritos', nameEs: 'Mandarina', nameEn: 'Mandarin', category: 'beverages', packageEs: 'Caja 24 x 355ml', packageEn: 'Case 24 x 355ml', imageUrl: 'https://placehold.co/300x200/F59E0B/111827?text=Jarritos' },
  { code: 'BV-002', brand: 'Jarritos', nameEs: 'Tamarindo', nameEn: 'Tamarind', category: 'beverages', packageEs: 'Caja 24 x 355ml', packageEn: 'Case 24 x 355ml', imageUrl: 'https://placehold.co/300x200/92400E/FFFFFF?text=Jarritos+Tam' },
  { code: 'BV-003', brand: 'Boing', nameEs: 'Mango', nameEn: 'Mango', category: 'beverages', packageEs: 'Caja 24 x 500ml', packageEn: 'Case 24 x 500ml', imageUrl: 'https://placehold.co/300x200/FBBF24/111827?text=Boing' },
  { code: 'BV-004', brand: 'Boing', nameEs: 'Guayaba', nameEn: 'Guava', category: 'beverages', packageEs: 'Caja 24 x 500ml', packageEn: 'Case 24 x 500ml', imageUrl: 'https://placehold.co/300x200/F97316/FFFFFF?text=Boing+Guayaba' },
  { code: 'BV-005', brand: 'Topo Chico', nameEs: 'Mineral', nameEn: 'Sparkling Water', category: 'beverages', packageEs: 'Caja 24 x 355ml', packageEn: 'Case 24 x 355ml', imageUrl: 'https://placehold.co/300x200/0EA5E9/FFFFFF?text=Topo+Chico' },
  { code: 'BV-006', brand: 'Jumex', nameEs: 'Durazno', nameEn: 'Peach', category: 'beverages', packageEs: 'Caja 24 x 335ml', packageEn: 'Case 24 x 335ml', imageUrl: 'https://placehold.co/300x200/F59E0B/111827?text=Jumex' },
  { code: 'BV-007', brand: 'Jumex', nameEs: 'Manzana', nameEn: 'Apple', category: 'beverages', packageEs: 'Caja 24 x 335ml', packageEn: 'Case 24 x 335ml', imageUrl: 'https://placehold.co/300x200/10B981/FFFFFF?text=Jumex+Apple' },
  { code: 'BV-008', brand: 'Coca-Cola', nameEs: 'Original', nameEn: 'Original', category: 'beverages', packageEs: 'Caja 24 x 355ml', packageEn: 'Case 24 x 355ml', imageUrl: 'https://placehold.co/300x200/DC2626/FFFFFF?text=Coca-Cola' },

  { code: 'CK-001', brand: 'Marinela', nameEs: 'Gansito', nameEn: 'Gansito', category: 'cookies', packageEs: 'Caja 24 x 50g', packageEn: 'Case 24 x 50g', imageUrl: 'https://placehold.co/300x200/2563EB/FFFFFF?text=Gansito' },
  { code: 'CK-002', brand: 'Gamesa', nameEs: 'Marias', nameEn: 'Maria Cookies', category: 'cookies', packageEs: 'Caja 18 x 170g', packageEn: 'Case 18 x 170g', imageUrl: 'https://placehold.co/300x200/F59E0B/111827?text=Marias' },
  { code: 'CK-003', brand: 'Oreo', nameEs: 'Original', nameEn: 'Original', category: 'cookies', packageEs: 'Caja 20 x 114g', packageEn: 'Case 20 x 114g', imageUrl: 'https://placehold.co/300x200/1E293B/FFFFFF?text=Oreo' },
  { code: 'CK-004', brand: 'Emperador', nameEs: 'Chocolate', nameEn: 'Chocolate', category: 'cookies', packageEs: 'Caja 16 x 109g', packageEn: 'Case 16 x 109g', imageUrl: 'https://placehold.co/300x200/7C2D12/FFFFFF?text=Emperador' },
  { code: 'CK-005', brand: 'Ritz', nameEs: 'Original', nameEn: 'Original', category: 'cookies', packageEs: 'Caja 18 x 200g', packageEn: 'Case 18 x 200g', imageUrl: 'https://placehold.co/300x200/EAB308/111827?text=Ritz' },
  { code: 'CK-006', brand: 'Nutter Butter', nameEs: 'Cacahuate', nameEn: 'Peanut Butter', category: 'cookies', packageEs: 'Caja 18 x 142g', packageEn: 'Case 18 x 142g', imageUrl: 'https://placehold.co/300x200/FBBF24/111827?text=Nutter+Butter' },
  { code: 'CK-007', brand: 'Triki Trakes', nameEs: 'Vainilla', nameEn: 'Vanilla', category: 'cookies', packageEs: 'Caja 20 x 40g', packageEn: 'Case 20 x 40g', imageUrl: 'https://placehold.co/300x200/3B82F6/FFFFFF?text=Triki+Trakes' },

  { code: 'CN-001', brand: 'La Costena', nameEs: 'Chiles Jalapenos', nameEn: 'Jalapeno Peppers', category: 'canned', packageEs: 'Caja 12 x 380g', packageEn: 'Case 12 x 380g', imageUrl: 'https://placehold.co/300x200/16A34A/FFFFFF?text=La+Costena' },
  { code: 'CN-002', brand: 'Herdez', nameEs: 'Salsa Verde', nameEn: 'Green Salsa', category: 'canned', packageEs: 'Caja 12 x 453g', packageEn: 'Case 12 x 453g', imageUrl: 'https://placehold.co/300x200/15803D/FFFFFF?text=Herdez' },
  { code: 'CN-003', brand: 'Del Monte', nameEs: 'Elote', nameEn: 'Corn', category: 'canned', packageEs: 'Caja 24 x 220g', packageEn: 'Case 24 x 220g', imageUrl: 'https://placehold.co/300x200/CA8A04/111827?text=Del+Monte' },
  { code: 'CN-004', brand: 'San Marcos', nameEs: 'Frijoles Negros', nameEn: 'Black Beans', category: 'canned', packageEs: 'Caja 24 x 430g', packageEn: 'Case 24 x 430g', imageUrl: 'https://placehold.co/300x200/1F2937/FFFFFF?text=Frijoles' },
  { code: 'CN-005', brand: 'Isadora', nameEs: 'Frijol Pinto', nameEn: 'Pinto Beans', category: 'canned', packageEs: 'Caja 12 x 430g', packageEn: 'Case 12 x 430g', imageUrl: 'https://placehold.co/300x200/92400E/FFFFFF?text=Isadora' },
  { code: 'CN-006', brand: 'Campbells', nameEs: 'Sopa Tomate', nameEn: 'Tomato Soup', category: 'canned', packageEs: 'Caja 24 x 305g', packageEn: 'Case 24 x 305g', imageUrl: 'https://placehold.co/300x200/EF4444/FFFFFF?text=Campbells' },
  { code: 'CN-007', brand: 'La Sierra', nameEs: 'Nachos', nameEn: 'Nacho Slices', category: 'canned', packageEs: 'Caja 12 x 220g', packageEn: 'Case 12 x 220g', imageUrl: 'https://placehold.co/300x200/F97316/111827?text=La+Sierra' },

  { code: 'CL-001', brand: 'Fabuloso', nameEs: 'Lavanda', nameEn: 'Lavender', category: 'cleaning', packageEs: 'Caja 12 x 1L', packageEn: 'Case 12 x 1L', imageUrl: 'https://placehold.co/300x200/A855F7/FFFFFF?text=Fabuloso' },
  { code: 'CL-002', brand: 'Pinol', nameEs: 'Original', nameEn: 'Original', category: 'cleaning', packageEs: 'Caja 12 x 828ml', packageEn: 'Case 12 x 828ml', imageUrl: 'https://placehold.co/300x200/16A34A/FFFFFF?text=Pinol' },
  { code: 'CL-003', brand: 'Cloralex', nameEs: 'Blanqueador', nameEn: 'Bleach', category: 'cleaning', packageEs: 'Caja 12 x 950ml', packageEn: 'Case 12 x 950ml', imageUrl: 'https://placehold.co/300x200/0EA5E9/FFFFFF?text=Cloralex' },
  { code: 'CL-004', brand: 'Suavitel', nameEs: 'Suavizante', nameEn: 'Fabric Softener', category: 'cleaning', packageEs: 'Caja 8 x 1.4L', packageEn: 'Case 8 x 1.4L', imageUrl: 'https://placehold.co/300x200/EC4899/FFFFFF?text=Suavitel' },
  { code: 'CL-005', brand: 'Salvo', nameEs: 'Lavatrastes', nameEn: 'Dish Soap', category: 'cleaning', packageEs: 'Caja 12 x 750ml', packageEn: 'Case 12 x 750ml', imageUrl: 'https://placehold.co/300x200/2563EB/FFFFFF?text=Salvo' },
  { code: 'CL-006', brand: 'Roma', nameEs: 'Detergente', nameEn: 'Detergent', category: 'cleaning', packageEs: 'Caja 10 x 1kg', packageEn: 'Case 10 x 1kg', imageUrl: 'https://placehold.co/300x200/F59E0B/111827?text=Roma' },
  { code: 'CL-007', brand: 'Axion', nameEs: 'Pasta', nameEn: 'Dish Paste', category: 'cleaning', packageEs: 'Caja 20 x 450g', packageEn: 'Case 20 x 450g', imageUrl: 'https://placehold.co/300x200/22C55E/111827?text=Axion' },

  { code: 'DY-001', brand: 'Lala', nameEs: 'Leche Entera', nameEn: 'Whole Milk', category: 'dairy', packageEs: 'Caja 12 x 1L', packageEn: 'Case 12 x 1L', imageUrl: 'https://placehold.co/300x200/F3F4F6/111827?text=Lala' },
  { code: 'DY-002', brand: 'Alpura', nameEs: 'Leche Light', nameEn: 'Low Fat Milk', category: 'dairy', packageEs: 'Caja 12 x 1L', packageEn: 'Case 12 x 1L', imageUrl: 'https://placehold.co/300x200/E5E7EB/111827?text=Alpura' },
  { code: 'DY-003', brand: 'Danone', nameEs: 'Yogur Fresa', nameEn: 'Strawberry Yogurt', category: 'dairy', packageEs: 'Caja 24 x 150g', packageEn: 'Case 24 x 150g', imageUrl: 'https://placehold.co/300x200/FDA4AF/111827?text=Danone' },
  { code: 'DY-004', brand: 'Philadelphia', nameEs: 'Queso Crema', nameEn: 'Cream Cheese', category: 'dairy', packageEs: 'Caja 18 x 180g', packageEn: 'Case 18 x 180g', imageUrl: 'https://placehold.co/300x200/DBEAFE/111827?text=Philadelphia' },
  { code: 'DY-005', brand: 'Noche Buena', nameEs: 'Queso Fresco', nameEn: 'Fresh Cheese', category: 'dairy', packageEs: 'Caja 10 x 400g', packageEn: 'Case 10 x 400g', imageUrl: 'https://placehold.co/300x200/FEF9C3/111827?text=Noche+Buena' },
  { code: 'DY-006', brand: 'Yoplait', nameEs: 'Natural', nameEn: 'Plain Yogurt', category: 'dairy', packageEs: 'Caja 24 x 125g', packageEn: 'Case 24 x 125g', imageUrl: 'https://placehold.co/300x200/FECACA/111827?text=Yoplait' },
  { code: 'DY-007', brand: 'Lyncott', nameEs: 'Mantequilla', nameEn: 'Butter', category: 'dairy', packageEs: 'Caja 24 x 90g', packageEn: 'Case 24 x 90g', imageUrl: 'https://placehold.co/300x200/FDE68A/111827?text=Lyncott' },
]

export const demoProducts: Product[] = rows.map((row) => ({
  id: row.code,
  ...row,
}))
