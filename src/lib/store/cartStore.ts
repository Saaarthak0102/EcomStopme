import { create } from "zustand";
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
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isDrawerOpen: false,
  addItem: (item) =>
    set((state) => {
      // If item with same productSlug, selectedVariants, and uploadedImage exists, increase quantity
      const existing = state.items.find(
        (i) =>
          i.productSlug === item.productSlug &&
          JSON.stringify(i.selectedVariants) === JSON.stringify(item.selectedVariants) &&
          i.uploadedImage === item.uploadedImage &&
          i.engravingText === item.engravingText
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
}));
