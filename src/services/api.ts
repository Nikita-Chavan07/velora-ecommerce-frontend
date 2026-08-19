import axios from 'axios';
import type { Product } from '../types';
import { products as localProducts } from '../data/products';

const API_BASE = 'https://fakestoreapi.com';

// Transform FakeStore product to our Product model
const transformFakeStoreProduct = (item: any, index: number): Product => {
  const cat = item.category?.toLowerCase() ?? '';
  let category: Product['category'] = 'fashion';
  let gender: Product['gender'] = 'unisex';
  let subcategory = item.category;

  if (cat.includes('women')) { category = 'fashion'; gender = 'women'; subcategory = "Women's Clothing"; }
  else if (cat.includes('men')) { category = 'fashion'; gender = 'men'; subcategory = "Men's Clothing"; }
  else if (cat.includes('jewel')) { category = 'accessories'; subcategory = 'Jewellery'; }
  else if (cat.includes('electronic')) { category = 'accessories'; subcategory = 'Tech Accessories'; }

  const price = Math.round(parseFloat(item.price) * 83 / 10) * 10 || 4990;
  const originalPrice = Math.round((price * 1.25) / 10) * 10;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return {
    id: `api-${item.id}`,
    name: item.title ?? 'Product',
    brand: 'VELORA',
    category,
    subcategory,
    gender,
    price,
    originalPrice,
    discount,
    rating: item.rating?.rate ?? 4.0,
    reviewCount: item.rating?.count ?? 50,
    images: [item.image, item.image],
    description: item.description ?? '',
    colors: ['Default'],
    sizes: ['One Size'],
    stock: 20 + index,
    isNew: index < 5,
    isFeatured: item.rating?.rate > 4.5,
    tags: [category, subcategory?.toLowerCase() ?? ''],
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_BASE}/products`, { timeout: 8000 });
    if (Array.isArray(response.data) && response.data.length > 0) {
      const apiProducts = response.data.map((item: any, index: number) =>
        transformFakeStoreProduct(item, index)
      );
      // Merge with local products, local ones take priority
      return [...localProducts, ...apiProducts.slice(0, 8)];
    }
    return localProducts;
  } catch {
    // Fallback to local data
    return localProducts;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  // Check local first
  const local = localProducts.find(p => p.id === id);
  if (local) return local;

  // Try API for api- prefixed ids
  if (id.startsWith('api-')) {
    const numId = id.replace('api-', '');
    try {
      const response = await axios.get(`${API_BASE}/products/${numId}`, { timeout: 8000 });
      return transformFakeStoreProduct(response.data, 0);
    } catch {
      return null;
    }
  }
  return null;
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const local = localProducts.filter(p => p.category === category);
  try {
    const response = await axios.get(`${API_BASE}/products/category/${category}`, { timeout: 8000 });
    if (Array.isArray(response.data)) {
      return [...local, ...response.data.map((item: any, i: number) => transformFakeStoreProduct(item, i))];
    }
    return local;
  } catch {
    return local;
  }
};
