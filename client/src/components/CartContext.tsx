import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { ToastContainer } from '@/components/ui/custom-toast';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  img_url?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const { toasts, success, removeToast } = useCustomToast();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        success(
          'Quantité mise à jour',
          `${item.name} - Quantité: ${found.quantity + 1}`
        );
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      success(
        'Ajouté au panier',
        `${item.name} a été ajouté à votre panier`
      );
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => {
      const itemToRemove = prev.find((i) => i.id === id);
      if (itemToRemove) {
        success(
          'Retiré du panier',
          `${itemToRemove.name} a été retiré de votre panier`
        );
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item && quantity === 0) {
        success(
          'Retiré du panier',
          `${item.name} a été retiré de votre panier`
        );
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) => i.id === id ? { ...i, quantity } : i);
    });
  };

  const clearCart = () => {
    setItems([]);
    success(
      'Panier vidé',
      'Tous les articles ont été retirés de votre panier'
    );
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </CartContext.Provider>
  );
} 