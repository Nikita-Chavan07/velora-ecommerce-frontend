export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'fashion' | 'beauty' | 'skincare' | 'makeup' | 'accessories';
  subcategory: string;
  gender: 'women' | 'men' | 'unisex';
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  colors: string[];
  sizes: string[];
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  tags: string[];
  material?: string;
  ingredients?: string[];
  specifications?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  verified: boolean;
}

export interface FilterState {
  category: string[];
  gender: string[];
  priceMin: number;
  priceMax: number;
  rating: number;
  availability: string;
  sortBy: string;
  search: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  deliveryMethod: string;
  estimatedDelivery: string;
  createdAt: Date;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
