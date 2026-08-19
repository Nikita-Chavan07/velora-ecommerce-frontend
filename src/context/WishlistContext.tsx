import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product, WishlistItem } from '../types';

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR' };

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'velora_wishlist';

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.items.some(i => i.product.id === action.payload.id)) return state;
      return { items: [...state.items, { product: action.payload, addedAt: new Date() }] };
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.product.id !== action.payload) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
};

const loadFromStorage = (): WishlistState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { items: parsed.items.map((i: any) => ({ ...i, addedAt: new Date(i.addedAt) })) };
    }
  } catch { /* ignore */ }
  return { items: [] };
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, undefined, loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addToWishlist = (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeFromWishlist = (productId: string) => dispatch({ type: 'REMOVE_ITEM', payload: productId });
  const toggleWishlist = (product: Product) => {
    if (state.items.some(i => i.product.id === product.id)) {
      dispatch({ type: 'REMOVE_ITEM', payload: product.id });
    } else {
      dispatch({ type: 'ADD_ITEM', payload: product });
    }
  };
  const isInWishlist = (productId: string) => state.items.some(i => i.product.id === productId);
  const clearWishlist = () => dispatch({ type: 'CLEAR' });

  return (
    <WishlistContext.Provider value={{
      items: state.items,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      totalItems: state.items.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
