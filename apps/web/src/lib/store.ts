import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  initializeFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isHydrated: false,
      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isHydrated: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
        }
      },
      setUser: (user) => {
        set({ user });
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isHydrated: true });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('auth-storage');
        }
      },
      initializeFromStorage: () => {
        if (typeof window === 'undefined') {
          return;
        }

        const persistedState = localStorage.getItem('auth-storage');
        if (persistedState) {
          try {
            const parsed = JSON.parse(persistedState) as {
              state?: {
                user?: User | null;
                accessToken?: string | null;
                refreshToken?: string | null;
              };
            };
            const persistedUser = parsed.state?.user || null;
            const persistedAccessToken = parsed.state?.accessToken || null;
            const persistedRefreshToken = parsed.state?.refreshToken || null;

            if (persistedAccessToken) {
              set({
                user: persistedUser,
                accessToken: persistedAccessToken,
                refreshToken: persistedRefreshToken,
                isHydrated: true,
              });
              localStorage.setItem('accessToken', persistedAccessToken);
              return;
            }
          } catch {
            localStorage.removeItem('auth-storage');
          }
        }

        const token = localStorage.getItem('accessToken');
        if (token) {
          set((state) => ({
            accessToken: state.accessToken || token,
            isHydrated: true,
          }));
          return;
        }

        set({ isHydrated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const clearClientAuth = (): void => {
  useAuthStore.getState().logout();
};

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
