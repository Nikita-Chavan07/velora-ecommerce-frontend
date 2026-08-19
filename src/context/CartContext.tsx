import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; color: string; size: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'velora_cart';

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.product.id === action.payload.product.id &&
          item.selectedColor === action.payload.color &&
          item.selectedSize === action.payload.size
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + action.payload.quantity,
        };
        return { items: updated };
      }
      return {
        items: [...state.items, {
          product: action.payload.product,
          quantity: action.payload.quantity,
          selectedColor: action.payload.color,
          selectedSize: action.payload.size,
        }],
      };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(item => item.product.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { items: state.items.filter(item => item.product.id !== action.payload.id) };
      }
      return {
        items: state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

const loadCartFromStorage = (): CartState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { items: [] };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCartFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addToCart = (product: Product, quantity = 1, color = '', size = '') => {
    const selectedColor = color || (product.colors[0] ?? '');
    const selectedSize = size || (product.sizes[0] ?? '');
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, color: selectedColor, size: selectedSize } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = state.items.reduce((sum, item) => {
    const saved = (item.product.originalPrice - item.product.price) * item.quantity;
    return sum + saved;
  }, 0);
  const shipping = subtotal > 6250 ? 0 : 499;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const isInCart = (productId: string) => state.items.some(item => item.product.id === productId);

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
