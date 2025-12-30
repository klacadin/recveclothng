import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

const CART_STORAGE_KEY = 'shopping-cart-v2'; // New key for size-aware cart

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Validate that items have size field
        const validItems = parsed.filter((item: any) => item.size && item.product && item.quantity);
        setItems(validItems);
      } catch (e) {
        console.error('Failed to parse cart from storage:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
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
