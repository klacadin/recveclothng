import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import type { Product } from '@/hooks/useProducts';
import type { Database } from '@/integrations/supabase/types';

type ProductSize = Database['public']['Enums']['product_size'];

export type CartItem = {
  product: Product;
  quantity: number;
  size: ProductSize;
};

// Create a unique key for cart items (product + size combination)
const getCartItemKey = (productId: string, size: ProductSize): string => `${productId}-${size}`;

type CartContextType = {
  items: CartItem[];
  isCartLoaded: boolean;
  addToCart: (product: Product, size: ProductSize, quantity?: number) => void;
  removeFromCart: (productId: string, size: ProductSize) => void;
  updateQuantity: (productId: string, size: ProductSize, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping-cart-v2';

function parseCartFromStorage(savedCart: string): CartItem[] {
  try {
    const parsed = JSON.parse(savedCart);
    const rawItems = Array.isArray(parsed) ? parsed : (parsed?.items ?? []);
    return rawItems.filter((item: unknown) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
      const i = item as Record<string, unknown>;
      if (!i.size || !i.quantity || typeof i.quantity !== 'number' || i.quantity < 1) return false;
      if (!i.product || typeof i.product !== 'object' || Array.isArray(i.product)) return false;
      const p = i.product as Record<string, unknown>;
      if (!p.id || !p.name || p.price == null || Number.isNaN(Number(p.price))) return false;
      return true;
    }).map((item: unknown) => {
      const i = item as { product: Record<string, unknown>; quantity: number; size: ProductSize };
      const p = i.product;
      return {
        product: {
          ...p,
          id: String(p.id),
          name: String(p.name),
          price: Number(p.price),
        } as Product,
        quantity: i.quantity,
        size: i.size as ProductSize,
      };
    });
  } catch {
    return [];
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const hasLoadedRef = useRef(false);

  // Load cart from localStorage on mount (runs once)
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const loaded = parseCartFromStorage(savedCart || '[]');
    setItems(loaded);
    hasLoadedRef.current = true;
    setIsCartLoaded(true);
  }, []);

  // Save cart to localStorage when it changes, but never overwrite with [] before load completes
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, size: ProductSize, quantity: number = 1) => {
    setItems(currentItems => {
      const itemKey = getCartItemKey(product.id, size);
      const existingItem = currentItems.find(
        item => getCartItemKey(item.product.id, item.size) === itemKey
      );
      
      if (existingItem) {
        return currentItems.map(item =>
          getCartItemKey(item.product.id, item.size) === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...currentItems, { product, quantity, size }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: ProductSize) => {
    const itemKey = getCartItemKey(productId, size);
    setItems(currentItems => 
      currentItems.filter(item => getCartItemKey(item.product.id, item.size) !== itemKey)
    );
  };

  const updateQuantity = (productId: string, size: ProductSize, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    
    const itemKey = getCartItemKey(productId, size);
    setItems(currentItems =>
      currentItems.map(item =>
        getCartItemKey(item.product.id, item.size) === itemKey ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartLoaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
