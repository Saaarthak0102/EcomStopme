import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "../types";

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalItems: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (item) =>
        set((state) => {
          // If same product + same variants → increment quantity
          const existing = state.items.find(
            (i) =>
              i.productId === item.productId &&
              JSON.stringify(i.selectedVariants) === JSON.stringify(item.selectedVariants)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      totalAmount: () =>
        get().items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0),
    }),
    { name: "stopme-cart" }
  )
);

