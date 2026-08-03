import { create } from "zustand";

interface StudioState {
  // mapped by product slug
  sessions: Record<string, {
    uploadedImage?: string;
    crop?: { x: number; y: number };
    zoom?: number;
    selectedVariants: Record<string, string>;
    engravingText?: string;
  }>;
  setField: (slug: string, field: string, value: any) => void;
  setVariant: (slug: string, variantKey: string, variantValue: string) => void;
  clearSession: (slug: string) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  sessions: {},
  setField: (slug, field, value) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [slug]: {
          ...state.sessions[slug],
          [field]: value,
        },
      },
    })),
  setVariant: (slug, variantKey, variantValue) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [slug]: {
          ...state.sessions[slug],
          selectedVariants: {
            ...(state.sessions[slug]?.selectedVariants || {}),
            [variantKey]: variantValue,
          },
        },
      },
    })),
  clearSession: (slug) =>
    set((state) => {
      const newSessions = { ...state.sessions };
      delete newSessions[slug];
      return { sessions: newSessions };
    }),
}));
