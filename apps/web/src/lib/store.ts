import { create } from 'zustand';

interface CartItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.productId === item.productId);
      if (existingItem) {
        const updatedItems = state.items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity, total: (i.quantity + item.quantity) * i.price }
            : i
        );
        return { items: updatedItems, total: updatedItems.reduce((sum, i) => sum + i.total, 0) };
      }
      return {
        items: [...state.items, item],
        total: state.total + item.total,
      };
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const updatedItems = state.items.filter((i) => i.productId !== productId);
        return { items: updatedItems, total: updatedItems.reduce((sum, i) => sum + i.total, 0) };
      }
      const updatedItems = state.items.map((i) =>
        i.productId === productId ? { ...i, quantity, total: quantity * i.price } : i
      );
      return { items: updatedItems, total: updatedItems.reduce((sum, i) => sum + i.total, 0) };
    }),
  removeItem: (productId) =>
    set((state) => {
      const updatedItems = state.items.filter((i) => i.productId !== productId);
      return { items: updatedItems, total: updatedItems.reduce((sum, i) => sum + i.total, 0) };
    }),
  clearCart: () => set({ items: [], total: 0 }),
}));
