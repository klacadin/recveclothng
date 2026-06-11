import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import type { Product } from '@/hooks/useProducts';
import type { Database } from '@/integrations/supabase/types';
import { MAX_ORDER_PIECES } from '@/config/constants';
import { toast } from '@/hooks/use-toast';

const CART_LIMIT_TITLE = 'Cart limit reached';
const CART_LIMIT_DESCRIPTION = `Orders are limited to ${MAX_ORDER_PIECES} pieces total. Remove items or reduce quantities to add more.`;

function notifyCartPieceCapExceeded() {
  setTimeout(() => {
    toast({
      title: CART_LIMIT_TITLE,
      description: CART_LIMIT_DESCRIPTION,
      variant: 'destructive',
    });
  }, 0);
}

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

function cartPieceCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.quantity, 0);
}

/** If stored cart exceeds the cap (e.g. old rules), trim quantities from the end of the list. */
function normalizeCartPieceTotals(items: CartItem[]): CartItem[] {
  let total = cartPieceCount(items);
  if (total <= MAX_ORDER_PIECES) return items;
  const out = items.map((i) => ({ ...i }));
  for (let idx = out.length - 1; idx >= 0 && total > MAX_ORDER_PIECES; idx--) {
    const over = total - MAX_ORDER_PIECES;
    const dec = Math.min(out[idx].quantity, over);
    out[idx] = { ...out[idx], quantity: out[idx].quantity - dec };
    total -= dec;
  }
  return out.filter((i) => i.quantity > 0);
}

function parseCartFromStorage(savedCart: string): CartItem[] {
  try {
    const parsed = JSON.parse(savedCart);
    const rawItems = Array.isArray(parsed) ? parsed : (parsed?.items ?? []);
    const items = rawItems.filter((item: unknown) => {
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
    return normalizeCartPieceTotals(items);
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
      const currentTotal = cartPieceCount(currentItems);
      const existingQty = existingItem?.quantity ?? 0;
      const maxAdd = MAX_ORDER_PIECES - (currentTotal - existingQty);
      const addQty = Math.max(0, Math.min(quantity, maxAdd));
      if (addQty === 0) {
        if (quantity > 0) notifyCartPieceCapExceeded();
        return currentItems;
      }
      if (addQty < quantity) notifyCartPieceCapExceeded();

      if (existingItem) {
        return currentItems.map(item =>
          getCartItemKey(item.product.id, item.size) === itemKey
            ? { ...item, quantity: item.quantity + addQty }
            : item
        );
      }

      return [...currentItems, { product, quantity: addQty, size }];
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
    setItems(currentItems => {
      const others = currentItems
        .filter(item => getCartItemKey(item.product.id, item.size) !== itemKey)
        .reduce((s, item) => s + item.quantity, 0);
      const maxForLine = MAX_ORDER_PIECES - others;
      if (quantity > maxForLine) notifyCartPieceCapExceeded();
      const newQty = Math.min(quantity, maxForLine);
      if (newQty < 1) {
        return currentItems.filter(item => getCartItemKey(item.product.id, item.size) !== itemKey);
      }
      return currentItems.map(item =>
        getCartItemKey(item.product.id, item.size) === itemKey ? { ...item, quantity: newQty } : item
      );
    });
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
